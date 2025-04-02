import sqlite3
from selenium import webdriver
from selenium.webdriver.common.by import By
#from tabulate import tabulate
import pandas as pd

def scrapear_webs(page):
    """Generador para las páginas de laptops."""
    while True:
        yield f"https://webscraper.io/test-sites/e-commerce/static/computers/laptops?page={page}"
        page += 1
        if page > 20:
            break

    try:
        #conectar a la base de datos
        conexion = sqlite3.connect("C:\sqlite-tools-win-x64-3490100\productos_db\db_connector.db", timeout=10)
        cursor = conexion.cursor()

        #Crear la tabla si no existe
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS productos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                precio TEXT NOT NULL,
                descripcion TEXT NOT NULL,
                valoracion TEXT
            )
        """)
        conexion.commit()

        driver = webdriver.Chrome()
        element_list = []

        # Recorrer cada página
        for page_url in scrapear_webs(1):
            driver.get(page_url)

            # Extraer los datos
            title = driver.find_elements(By.CLASS_NAME, "title")
            price = driver.find_elements(By.CLASS_NAME, "price")
            description = driver.find_elements(By.CLASS_NAME, "description")
            valoracion = driver.find_elements(By.CLASS_NAME, "ratings")

            # Guardar en la lista
            for i in range(len(title)):
                producto = (title[i].text, price[i].text, description[i].text, valoracion[i].text)
                element_list.append(producto)

        #Inserta elementos evitando duplicados
        cursor.executemany("""
            INSERT INTO productos (titulo, precio, descripcion, valoracion) 
            VALUES (?, ?, ?, ?)
        """, element_list)

        conexion.commit()
        conexion.close()
    except sqlite3.Error as e:
        print(f"Error de SQLite: {e}")
    finally:
        if conexion:
            conexion.close()
            driver.quit()

# 🔹 Mostrar datos en una tabla
#headers = ["Título", "Precio", "Descripción", "Valoración"]
#print(tabulate(element_list, headers=headers, tablefmt="grid"))]

print("\n✅ Datos guardados en SQLite")
# Cerrar el driver después de extraer los datos
