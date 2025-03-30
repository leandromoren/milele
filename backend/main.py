from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import spacy
import sqlite3
import re
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Cargar el modelo de spaCy (ajustar según idioma)
nlp = spacy.load("es_core_news_md")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Permite el frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los encabezados
)

def limpiar_precio(precio_str):
    """ Convierte un precio de string a float, eliminando caracteres no numéricos """
    try:
        #logging.info(f"Limpieza de precio: {precio_str}")
        # Quita todo excepto números y puntos
        precio_limpio = re.sub(r"[^\d.]", "", precio_str)
        #logging.info(f"Precio limpio: {precio_limpio}")  
        return float(precio_limpio) if precio_limpio else None
    except ValueError:
        return None

def calcular_similitud(query, texto):
    """ Calcula la similitud semántica entre el texto de búsqueda y el producto """
    doc1 = nlp(query)
    doc2 = nlp(texto)
    return doc1.similarity(doc2)

def get_products(q: str = "", min_precio: float = None, max_precio: float = None):
    try:
        db_path = r"C:\sqlite-tools-win-x64-3490100\productos_db\db_connector.db"
        conexion = sqlite3.connect(db_path)
        cursor = conexion.cursor()
        
        query = "SELECT id, titulo, precio, descripcion, valoracion FROM productos"
        cursor.execute(query)
        productos = cursor.fetchall()
        conexion.close()

        if not productos:
            logging.warning("⚠️ No se encontraron productos en la base de datos")
            raise HTTPException(status_code=404, detail="No hay productos disponibles.")

        # Convertir precios y procesar NLP
        productos_limpios = []
        for p in productos:
            precio_float = limpiar_precio(p[2])  # Convertir precio

            # Aplicar filtro de precio
            if (min_precio is None or (precio_float and precio_float >= min_precio)) and \
               (max_precio is None or (precio_float and precio_float <= max_precio)):

                producto = {
                    "id": p[0],
                    "titulo": p[1],
                    "precio": precio_float,
                    "descripcion": p[3],
                    "valoracion": p[4]
                }

                # Si hay filtro de búsqueda, calcular similitud con título y descripción
                if q:
                    similitud_titulo = calcular_similitud(q, p[1])
                    similitud_desc = calcular_similitud(q, p[3])
                    producto["similitud"] = max(similitud_titulo, similitud_desc)
                else:
                    producto["similitud"] = 1.0  # Sin filtro, todos tienen prioridad máxima

                productos_limpios.append(producto)

        # Ordenar por similitud si hay un filtro de búsqueda
        if q:
            productos_limpios = sorted(productos_limpios, key=lambda x: x["similitud"], reverse=True)

        return productos_limpios

    except sqlite3.Error as e:
        logging.error(f"❌ Error de SQLite: {e}")
        raise HTTPException(status_code=500, detail="Error interno en la base de datos.")
    finally:
        if 'conexion' in locals():
            conexion.close()

@app.get("/productos")
def leer_productos(
    q: str = Query("", description="Texto para buscar en título y descripción"),
    min_precio: float = Query(None, description="Precio mínimo"),
    max_precio: float = Query(None, description="Precio máximo")
):
    #return get_products(q, min_precio, max_precio)
    try:
        # Validar rangos de precios (min < max)
        if min_precio is not None and max_precio is not None and min_precio > max_precio:
            raise HTTPException(status_code=400, detail="El precio mínimo no puede ser mayor que el precio máximo.")

        productos = get_products(q, min_precio, max_precio)

        if not productos or "data" not in productos or len(productos["data"]) == 0:
            raise HTTPException(status_code=404, detail="No se encontraron productos con los filtros aplicados.")

        return productos  # Devuelve el resultado de la consulta

    except HTTPException as http_err:
        raise http_err  # Propaga errores HTTP personalizados (404, 400, etc.)

    except Exception as e:
        logging.error(f"❌ Error inesperado en /productos: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor.")
