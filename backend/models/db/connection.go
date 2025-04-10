package connection

import (
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
)

func GetConnectionDb() (*sql.DB, error) {
	const db_route = "root:1234@tcp(localhost:3306)/dbo_milele"
	const db_type = "mysql"
	return sql.Open(db_type, db_route)
}
