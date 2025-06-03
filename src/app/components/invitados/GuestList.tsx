'use client';
import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const initialGuests: Guest[] = [
  { id: 1, name: 'María López', status: 'Confirmado', category: 'Familia', guests: 2 },
  { id: 2, name: 'Carlos Gómez', status: 'Pendiente', category: 'Amigos', guests: 1 },
  { id: 3, name: 'Lucía Fernández', status: 'No asistirá', category: 'Trabajo', guests: 0 },
];

type Guest = {
  id: number;
  name: string;
  phone?: string;
  status: string;
  category?: string;
  guests: number;
};

type AccompanyingGuest = {
  name: string;
  phone: string;
};

const GuestList = () => {
  const [guests, setGuests] = useState(initialGuests);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado formulario invitado principal
  const [mainGuestName, setMainGuestName] = useState('');
  const [mainGuestPhone, setMainGuestPhone] = useState('');
  const [numAccompanying, setNumAccompanying] = useState(0);

  // Estado para acompañantes dinámicos
  const [accompanyingGuests, setAccompanyingGuests] = useState<AccompanyingGuest[]>([]);

  // Abrir modal
  const openModal = () => {
    setIsModalOpen(true);
    // reset form
    setMainGuestName('');
    setMainGuestPhone('');
    setNumAccompanying(0);
    setAccompanyingGuests([]);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Manejar cambio en número de acompañantes
  const handleNumAccompanyingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setNumAccompanying(value);

    // Ajustar el array de acompañantes para que tenga el tamaño correcto
    if (value > accompanyingGuests.length) {
      // Agregar campos vacíos
      setAccompanyingGuests([...accompanyingGuests, ...Array(value - accompanyingGuests.length).fill({ name: '', phone: '' })]);
    } else if (value < accompanyingGuests.length) {
      // Reducir campos
      setAccompanyingGuests(accompanyingGuests.slice(0, value));
    }
  };

  // Manejar cambios en acompañantes
  const handleAccompanyingChange = (
    index: number,
    field: 'name' | 'phone',
    value: string
  ) => {
    const updated = accompanyingGuests.map((guest, i) =>
      i === index ? { ...guest, [field]: value } : guest
    );
    setAccompanyingGuests(updated);
  };

  // Enviar formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!mainGuestName.trim()) {
      alert('El nombre del invitado principal es obligatorio.');
      return;
    }

    // Validar acompañantes
    for (let i = 0; i < accompanyingGuests.length; i++) {
      const g = accompanyingGuests[i];
      if (!g.name.trim() || !g.phone.trim()) {
        alert(`Complete nombre y teléfono del acompañante #${i + 1}`);
        return;
      }
    }

    // Crear nuevo invitado principal
    const newId = guests.length ? Math.max(...guests.map(g => g.id)) + 1 : 1;

    // Añadimos al invitado principal
    const newGuests: Guest[] = [
      ...guests,
      {
        id: newId,
        name: mainGuestName,
        phone: mainGuestPhone,
        status: 'Pendiente',
        category: 'Nuevo',
        guests: numAccompanying,
      },
    ];

    // Agregar acompañantes como invitados individuales (puedes ajustarlo si quieres otro comportamiento)
    accompanyingGuests.forEach((g, index) => {
      newGuests.push({
        id: newId + index + 1,
        name: g.name,
        phone: g.phone,
        status: 'Pendiente',
        category: 'Acompañante',
        guests: 0,
      });
    });

    setGuests(newGuests);
    closeModal();
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-8 bg-gray-50/50 text-[#5B7553]">
      <h1
        className="text-3xl font-extrabold mb-6 text-center sm:text-left"
        style={{ color: '#C97C5D' }}
      >
        👥 Lista de Invitados
      </h1>

      <button
        onClick={openModal}
        className="mb-4 px-4 py-2 bg-[#C97C5D] text-white rounded-md hover:bg-[#b66d50] transition"
      >
        + Agregar Invitado
      </button>

      <div
        className="overflow-x-auto rounded-2xl shadow-lg bg-white border"
        style={{ borderColor: '#D8A48F' }}
      >
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
                  {guest.name} {guest.phone && `(${guest.phone})`}
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
                    {guest.status || 'Pendiente'}
                  </span>
                </td>
                <td className="px-6 py-4" style={{ color: '#A3A380' }}>
                  {guest.category || '-'}
                </td>
                <td className="px-6 py-4">{guest.guests}</td>
                <td className="px-6 py-4 text-right space-x-2 flex">
                  <button
                    className="inline-flex items-center justify-center rounded-md px-2 py-1 transition"
                    style={{
                      color: '#A3A380',
                      border: '1px solid transparent',
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-center" style={{ color: '#C97C5D' }}>
              Agregar Invitado
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Nombre del Invitado Principal</label>
                <input
                  type="text"
                  value={mainGuestName}
                  onChange={(e) => setMainGuestName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C97C5D]"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Número de Teléfono</label>
                <input
                  type="tel"
                  value={mainGuestPhone}
                  onChange={(e) => setMainGuestPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C97C5D]"
                  placeholder="+57 300 000 0000"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Cantidad de Acompañantes</label>
                <input
                  type="number"
                  min={0}
                  value={numAccompanying}
                  onChange={handleNumAccompanyingChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C97C5D]"
                />
              </div>

              {/* Inputs dinámicos para acompañantes */}
              {accompanyingGuests.map((guest, idx) => (
                <div
                  key={idx}
                  className="border p-3 rounded-md mb-3"
                >
                  <h3 className="font-semibold mb-2">Acompañante #{idx + 1}</h3>
                  <label className="block mb-1">Nombre</label>
                  <input
                    type="text"
                    value={guest.name}
                    onChange={(e) => handleAccompanyingChange(idx, 'name', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#C97C5D]"
                    required
                  />
                  <label className="block mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={guest.phone}
                    onChange={(e) => handleAccompanyingChange(idx, 'phone', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C97C5D]"
                    placeholder="+57 300 000 0000"
                    required
                  />
                </div>
              ))}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C97C5D] text-white rounded hover:bg-[#b66d50]"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestList;
