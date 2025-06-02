'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
    const [
        correo, setCorreo] = useState('');
    const [password , setPassword ] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    correo, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Usuario o contraseña incorrectos');
                setLoading(false);
                return;
            }

            router.push('/');
        } catch {
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-100 ">
            {/* Fondo con imagen */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/assets/fondo-boda-3.webp"
                    alt="Fondo boda"
                    layout="fill"
                    objectFit="cover"
                    className="brightness-50"
                />
            </div>

            {/* Contenedor del formulario */}
            <div className="relative z-10 bg-white/30 backdrop-blur-md  p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
                <h1 className="text-3xl font-bold text-center text-[white] mb-4">
                    Acceso a la Boda
                </h1>
                <p className="text-center text-sm text-gray-100 mb-6">
                    Ingresa tu usuario y contraseña
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        placeholder="Usuario o email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d0b7a4] bg-white text-black"
                    />

                    <input
                        type="password"
                        value={password }
                        onChange={(e) => setPassword (e.target.value)}
                        placeholder="Contraseña"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d0b7a4] bg-white text-black"
                    />

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#d0b7a4] text-white py-2 rounded-md font-semibold hover:bg-[#c4a88f] transition disabled:opacity-50"
                    >
                        {loading ? 'Verificando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
