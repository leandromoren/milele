import re
import spacy
from db import obtener_productos

# Cargar el modelo de NLP (ajustar según idioma)
nlp = spacy.load("es_core_news_md")

def limpiar_precio(precio_str):
    """Convierte un precio de string a float, eliminando caracteres no numéricos."""
    try:
        precio_limpio = re.sub(r"[^\d.]", "", precio_str)
        return float(precio_limpio) if precio_limpio else None
    except ValueError:
        return None

def calcular_similitud(query: str, texto: str):
    """Calcula la similitud semántica entre el texto de búsqueda y el producto."""
    doc1 = nlp(query.lower())
    doc2 = nlp(texto.lower())
    return doc1.similarity(doc2)

def filtrar_productos(q: str = "", min_precio: float = None, max_precio: float = None):
    """Filtra los productos según búsqueda, precio y ordena por similitud."""
    productos = obtener_productos()
    if not productos:
        return []

    productos_limpios = []
    for p in productos:
        precio_float = limpiar_precio(p[2])
        if (min_precio is None or precio_float >= min_precio) and \
           (max_precio is None or precio_float <= max_precio):

            producto = {
                "id": p[0],
                "titulo": p[1],
                "precio": precio_float,
                "descripcion": p[3],
                "valoracion": p[4]
            }

            # Normalización de textos para evitar errores por mayúsculas/minúsculas
            q_lower:str = q.lower()
            titulo_lower:str = p[1].lower()
            descripcion_lower:str = p[3].lower()

            # Buscar coincidencias exactas
            if q and (q_lower in titulo_lower or q_lower in descripcion_lower):
                producto["similitud"] = 1.0
            else:
                producto["similitud"] = calcular_similitud(q, f"{p[1]} {p[3]}")

            productos_limpios.append(producto)

    # Ordenar por similitud si hay una búsqueda
    if q:
        productos_limpios = sorted(productos_limpios, key=lambda x: x["similitud"], reverse=True)

    return productos_limpios
