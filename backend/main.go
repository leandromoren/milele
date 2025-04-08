package main

import (
	"github.com/leandromoren/milele/backend/db"
)

func main() {
	conn := db.GetConnectionDb()
	defer conn.Close()
}
