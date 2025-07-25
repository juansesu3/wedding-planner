import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    const { correo, password } = await request.json();

    if (!correo || !password) {
      return NextResponse.json(
        { message: "Correo y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ correo });
    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // Crear token
    const token = jwt.sign(
      { id: user._id, correo: user.correo, rol: user.rol },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    const res = NextResponse.json({ success: true });
    res.cookies.set('user_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24
    });
  
    return res;
   
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { message: "Error en el servidor" },
      { status: 500 }
    );
  }
}
