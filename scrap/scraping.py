import uuid
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import mysql.connector

def conectar_mysql():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="1234",
        database="dbo_milele"
    )

def scrapear_con_selenium():
    # Configuración de Selenium en modo headless
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    driver = webdriver.Chrome(options=chrome_options)

    # Conectar a SQLite
    conexion = conectar_mysql()
    cursor = conexion.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        precio_base DECIMAL(10, 2),
        descuento DECIMAL(10, 2),
        genero VARCHAR(100),
        estado VARCHAR(100),
        sku VARCHAR(100),
        url_imagen_principal TEXT,
        marca VARCHAR(100)
    )
    """)
    conexion.commit()

    productos = []

    for page in range(1, 15):  # hasta la página 14
        url = f"https://www.bullbenny.com.ar/shop/?mpage={page}"
        print(f"🔄 Scrapeando: {url}")
        driver.get(url)
        time.sleep(5)  # esperar a que se cargue todo

        soup = BeautifulSoup(driver.page_source, "html.parser")
        items = soup.find_all("a", title=True)

        for item in items:
            sku = str(uuid.uuid4())
            nombre = item["title"]
            descripcion = item.img["alt"] if item.img else ""
            url_imagen = item.img.get("data-srcset", "").split(" ")[0] if item.img else ""

            parent = item.find_parent("div", class_="grid__item")
            precio_span = parent.find("span", class_="js-price-display item-price") if parent else None
            precio_texto = precio_span.text.strip().replace("$", "").replace(".", "").replace(",", "") if precio_span else "0"

            try:
                precio_base = float(precio_texto)
            except ValueError:
                precio_base = 0.0

            productos.append((
                nombre,
                descripcion,
                precio_base,
                0.0,            # descuento
                "hombre",          # genero
                "activo",       # estado
                sku,          # sku
                url_imagen,
                "bullbenny"
            ))

    cursor.executemany("""
        INSERT INTO productos (
            nombre, descripcion, precio_base, descuento, genero, estado, sku, url_imagen_principal, marca
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, productos)

    conexion.commit()
    conexion.close()
    driver.quit()
    print(f"\n✅ Se guardaron {len(productos)} productos en la base de datos.")

# Ejecutar
scrapear_con_selenium()
