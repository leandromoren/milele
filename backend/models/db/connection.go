package connection

import (
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
)

func GetConnectionDb() (*sql.DB, error) {
	return sql.Open("mysql", "root:1234@tcp(localhost:3306)/dbo_milele")
}
