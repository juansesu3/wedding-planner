"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [guestData, setGuestData] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmPassword: "",
    rol: "invitado", // valor por defecto
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGuestData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (guestData.password !== guestData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    // Aquí puedes hacer el POST al backend
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guestData),
      });

      if (res.ok) {
        alert("Usuario registrado con éxito");
        router.push("/login");
      } else {
        const errorText = await res.text();
        console.error("Error en respuesta:", errorText);
        alert("Error al registrar el usuario");
      }
    } catch (error) {
      console.error("Error al enviar formulario", error);
      alert("Error de red o servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff6f5]">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-400">Registrar Usuario</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nombre"
            value={guestData.nombre}
            onChange={handleChange}
            className="w-full p-2 border rounded text-gray-500"
            placeholder="Nombre"
          />
          <input
            type="email"
            name="correo"
            value={guestData.correo}
            onChange={handleChange}
            className="w-full p-2 border rounded text-gray-500"
            placeholder="Correo"
          />
          <input
            type="password"
            name="password"
            value={guestData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded text-gray-500"
            placeholder="Contraseña"
          />
          <input
            type="password"
            name="confirmPassword"
            value={guestData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded text-gray-500"
            placeholder="Confirmar Contraseña"
          />
          <select
            name="rol"
            value={guestData.rol}
            onChange={handleChange}
            className="w-full p-2 border rounded text-gray-500"
          >
            <option value="invitado text-gray-400">Invitado</option>
            <option value="admin">Administrador</option>
          </select>
          <button
            type="submit"
            className="w-full bg-[#d49e7b] hover:bg-pink-600 text-white py-2 rounded"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
