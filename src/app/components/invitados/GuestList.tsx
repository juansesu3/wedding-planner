'use client';
import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const initialGuests = [
  { id: 1, name: 'María López', status: 'Confirmado', category: 'Familia', guests: 2 },
  { id: 2, name: 'Carlos Gómez', status: 'Pendiente', category: 'Amigos', guests: 1 },
  { id: 3, name: 'Lucía Fernández', status: 'No asistirá', category: 'Trabajo', guests: 0 },
];

const GuestList = () => {
  const [guests, setGuests] = useState(initialGuests);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-8 bg-gray-50/50 text-[#5B7553]"  >
      <h1 className="text-3xl font-extrabold mb-6 text-center sm:text-left" style={{ color: '#C97C5D' }}>
        👥 Lista de Invitados
      </h1>

      <div className="overflow-x-auto rounded-2xl shadow-lg bg-white border" style={{ borderColor: '#D8A48F' }}>
        <table className="min-w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#D8A48F', color: 'white' }}>
              <th className="px-6 py-3 text-left font-semibold">Nombre</th>
              <th className="px-6 py-3 text-left font-semibold">Asistencia</th>
              <th className="px-6 py-3 text-left font-semibold">Categoría</th>
              <th className="px-6 py-3 text-left font-semibold">Acompañantes</th>
              <th className="px-6 py-3 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr
                key={guest.id}
                className="transition-colors duration-200 hover:bg-opacity-50 bg-gray-50/50 text-[#5B7553]"
                style={{ borderBottom: '1px solid #F1E8E0' }}
              >
                <td className="px-6 py-4 font-medium" style={{ color: '#5B7553' }}>
                  {guest.name}
                </td>
                <td className="px-6 py-4">
                  <span
                    className="inline-block px-2 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor:
                        guest.status === 'Confirmado'
                          ? '#D1FAE5'
                          : guest.status === 'Pendiente'
                            ? '#FEF9C3'
                            : '#FECACA',
                      color:
                        guest.status === 'Confirmado'
                          ? '#065F46'
                          : guest.status === 'Pendiente'
                            ? '#92400E'
                            : '#991B1B',
                    }}
                  >
                    {guest.status}
                  </span>
                </td>
                <td className="px-6 py-4" style={{ color: '#A3A380' }}>
                  {guest.category}
                </td>
                <td className="px-6 py-4">{guest.guests}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    className="inline-flex items-center justify-center rounded-md px-2 py-1 transition"
                    style={{
                      color: '#A3A380',
                      border: '1px solid transparent',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#A3A380';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#A3A380';
                    }}
                    aria-label="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-md px-2 py-1 transition"
                    style={{
                      color: '#DC2626',
                      border: '1px solid transparent',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#DC2626';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#DC2626';
                    }}
                    aria-label="Eliminar"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestList;
