"use client";
import { useState, useEffect } from "react";

export default function Home() {
  interface Producto {
    id: number;
    titulo: string;
    precio: number;
    descripcion: string;
    valoracion: number;
  }

  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/`) // Asegúrate de usar el puerto correcto
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("📦 Respuesta del backend:", data);
        if (data && data.data) {
          setProductos(data);
        } else if (Array.isArray(data)) {
          setProductos(data); // Si data es directamente el array
        } else {
          console.error("Formato de respuesta inesperado:", data);
          setProductos([]); // Establecer un array vacío para evitar errores
        }
      })
      .catch((err) => console.error("❌ Error en fetch:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4 text-red-800">
          Lista de Productos
        </h1>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-black">
              <th className="border p-2">ID</th>
              <th className="border p-2">Título</th>
              <th className="border p-2">Precio</th>
              <th className="border p-2">Descripción</th>
              <th className="border p-2">Valoración</th>
            </tr>
          </thead>
          <tbody>
            {productos && productos.length > 0 ? (
              productos.map((producto) => (
                <tr key={producto.id} className="text-center bg-green-900">
                  <td className="border p-2">{producto.id}</td>
                  <td className="border p-2">{producto.titulo}</td>
                  <td className="border p-2">{producto.precio}</td>
                  <td className="border p-2">{producto.descripcion}</td>
                  <td className="border p-2">{producto.valoracion}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  No hay productos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
