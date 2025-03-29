from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import spacy
import sqlite3
import re

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
        precio_limpio = re.sub(r"[^\d.]", "", precio_str)  # Quita todo excepto números y puntos
        return float(precio_limpio) if precio_limpio else None
    except ValueError:
        return None

def calcular_similitud(query, texto):
    """ Calcula la similitud semántica entre el texto de búsqueda y el producto """
    doc1 = nlp(query)
    doc2 = nlp(texto)
    return doc1.similarity(doc2)

def get_products(filtro: str = "", min_precio: float = None, max_precio: float = None):
    try:
        conexion = sqlite3.connect(r"C:\sqlite-tools-win-x64-3490100\productos_db\db_connector.db")
        cursor = conexion.cursor()
        
        query = "SELECT id, titulo, precio, descripcion, valoracion FROM productos"
        cursor.execute(query)
        productos = cursor.fetchall()
        conexion.close()

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
                if filtro:
                    similitud_titulo = calcular_similitud(filtro, p[1])
                    similitud_desc = calcular_similitud(filtro, p[3])
                    producto["similitud"] = max(similitud_titulo, similitud_desc)
                else:
                    producto["similitud"] = 1.0  # Sin filtro, todos tienen prioridad máxima

                productos_limpios.append(producto)

        # Ordenar por similitud si hay un filtro de búsqueda
        if filtro:
            productos_limpios = sorted(productos_limpios, key=lambda x: x["similitud"], reverse=True)

        return productos_limpios

    except sqlite3.Error as e:
        print(f"Error de SQLite: {e}")
    finally:
        if 'conexion' in locals():
            conexion.close()

@app.get("/productos")
def read_products(
    filtro: str = Query("", description="Texto para buscar en título y descripción"),
    min_precio: float = Query(None, description="Precio mínimo"),
    max_precio: float = Query(None, description="Precio máximo")
):return get_products(filtro, min_precio, max_precio)
