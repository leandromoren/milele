import sqlite3
import logging
from config import DB_PATH

def obtener_conexion():
    """Retorna una conexión a la base de datos SQLite."""
    try:
        conexion = sqlite3.connect(DB_PATH)
        return conexion
    except sqlite3.Error as e:
        logging.error(f"❌ Error de conexión a la BD: {e}")
        return None

def obtener_productos():
    """Obtiene todos los productos desde la base de datos."""
    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        cursor.execute("SELECT id, titulo, precio, descripcion, valoracion FROM productos")
        productos = cursor.fetchall()
        conexion.close()
        return productos
    except sqlite3.Error as e:
        logging.error(f"❌ Error obteniendo productos: {e}")
        return []
