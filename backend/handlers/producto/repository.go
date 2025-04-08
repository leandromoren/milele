package producto

import (
	connection "backend/models/db"
	models "backend/models/product"
)

func GetAllProducts() ([]models.Producto, error) {
	db, err := connection.GetConnectionDb()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query(`
	SELECT 
		id, 
		nombre, 
		descripcion, 
		precio_base, 
		COALESCE(descuento, 0), 
		genero, 
		estado,
		sku, 
		url_imagen_principal 
	FROM productos`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var productos []models.Producto
	for rows.Next() {
		var p models.Producto
		if err := rows.Scan(
			&p.ID,
			&p.Nombre,
			&p.Descripcion,
			&p.Precio,
			&p.Descuento,
			&p.Genero,
			&p.Estado,
			&p.Sku,
			&p.Imagen,
		); err != nil {
			return nil, err
		}
		productos = append(productos, p)
	}

	return productos, nil
}
