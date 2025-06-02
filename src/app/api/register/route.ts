import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import bcrypt from "bcryptjs";
import User from "@/models/User";

// POST /api/usuarios/registro
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, correo, password, rol } = body;

    if (!nombre || !correo || !password || !rol) {
      return NextResponse.json(
        { message: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }

    await connectDB();

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return NextResponse.json(
        { message: "El correo ya está registrado." },
        { status: 400 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const nuevoUsuario = new User({
      nombre,
      correo,
      password: hashedPassword,
      rol,
    });

    await nuevoUsuario.save();

    return NextResponse.json({ message: "Usuario creado con éxito" }, { status: 201 });
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { message: "Error en el servidor." },
      { status: 500 }
    );
  }
}
