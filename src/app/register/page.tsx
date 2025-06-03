"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 ">
      {/* Fondo con imagen */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/fondo-boda-1.jpg"
          alt="Fondo boda"
          layout="fill"
          objectFit="cover"
          className="blur-[2px] brightness-50"
        />
      </div>
      <div className="relative z-10 bg-white/30 backdrop-blur-md  p-8 rounded-xl shadow-lg max-w-md w-full mx-2">
        <h1 className="text-2xl font-bold mb-4 text-[#fff]">Registrar Usuario</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nombre"
            value={guestData.nombre}
            onChange={handleChange}
            className="w-full p-2 border-none rounded text-gray-700 bg-white"
            placeholder="Nombre"
          />
          <input
            type="email"
            name="correo"
            value={guestData.correo}
            onChange={handleChange}
            className="w-full p-2 border-none rounded text-gray-700 bg-white"
            placeholder="Correo"
          />
          <input
            type="password"
            name="password"
            value={guestData.password}
            onChange={handleChange}
            className="w-full p-2 border-none rounded text-gray-700 bg-white"
            placeholder="Contraseña"
          />
          <input
            type="password"
            name="confirmPassword"
            value={guestData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border-none rounded text-gray-700 bg-white"
            placeholder="Confirmar Contraseña"
          />
          <select
            name="rol"
            value={guestData.rol}
            onChange={handleChange}
            className="w-full p-2 border-none rounded text-gray-700 bg-white"
          >
            <option value="invitado text-gray-500">Invitado</option>
            <option value="admin">Administrador</option>
          </select>
          <button
            type="submit"
            className="w-full bg-[#C97C5D] hover:bg-[#ff9064]  text-white py-2 rounded cursor-pointer"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
