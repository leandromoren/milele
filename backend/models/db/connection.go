package connection

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func GetConnectionDb() *sql.DB {
	// Datos de conexión
	user := "root"
	password := "1234"
	host := "localhost"
	port := "3306"
	dbname := "milele"

	// Formato: usuario:contraseña@tcp(host:puerto)/nombre_bd
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", user, password, host, port, dbname)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("❌ Error al abrir conexión con la base de datos: %s", err)
	}

	// Verificar conexión
	err = db.Ping()
	if err != nil {
		log.Fatalf("❌ No se pudo conectar a la base de datos: %s", err)
	}

	log.Println("✅ Conexión a la base de datos exitosa")
	return db
}
