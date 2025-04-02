from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from fastapi.responses import JSONResponse
from ms import filtrar_productos


# Configurar el limitador de peticiones
limiter = Limiter(key_func=get_remote_address)

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Vincular el controlador de exceso de peticiones a FastAPI
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

@app.exception_handler(429)
async def ratelimit_exceeded_handler(request: Request, exc):
    return JSONResponse(
        status_code=429,
        content={"detail": "🚨 Has excedido el límite de peticiones. Intenta más tarde."},
    )

@app.get("/")
@limiter.limit("10/10minute")
def obtener_productos(
    request: Request,
    q: str = Query("", description="Texto para buscar en título y descripción"),
    min_precio: float = Query(None, description="Precio mínimo"),
    max_precio: float = Query(None, description="Precio máximo")
):
    try:
        if min_precio is not None and max_precio is not None and min_precio > max_precio:
            raise HTTPException(status_code=400, detail="El precio mínimo no puede ser mayor que el precio máximo.")

        productos = filtrar_productos(q, min_precio, max_precio)

        if not productos:
            raise HTTPException(status_code=404, detail="No se encontraron productos.")

        return productos
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        import logging
        logging.error(f"❌ Error inesperado en /productos: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor.")
