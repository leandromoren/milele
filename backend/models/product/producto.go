package product

type Producto struct {
	ID          int     `json:"id" db:"id"`
	Nombre      string  `json:"nombre" db:"nombre"`
	Descripcion string  `json:"descripcion" db:"descripcion"`
	Precio      float64 `json:"precio" db:"precio_base"`
	Imagen      string  `json:"imagen" db:"url_imagen_principal"`
	Genero      string  `json:"genero" db:"genero"`
	Estado      string  `json:"estado" db:"estado"`
	Sku         string  `json:"sku" db:"sku"`
	Descuento   float64 `json:"descuento" db:"descuento"`
}
