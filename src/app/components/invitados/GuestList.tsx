// src/app/components/invitados/GuestList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';

type RawInvitation = {
  _id: string;
  groupId: string;
  contactName: string;
  contactEmail: string;
  preferredLanguage?: string;
  notes?: string;
  members: Array<{
    _id?: string;
    firstName: string;
    lastName: string;
    targetEmail: string;
    role?: string; // primary / companion
    status?: string;
    dietary?: string;
    accessLink?: string;
  }>;
};

type Member = RawInvitation['members'][number];
type OidLike = { $oid: string };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function isOidLike(v: unknown): v is OidLike {
  return isRecord(v) && typeof v.$oid === 'string';
}

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

function optStr(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

function idToString(v: unknown, fallback = ''): string {
  if (typeof v === 'string') return v;
  if (isOidLike(v)) return v.$oid;
  return fallback;
}

function memberIdToString(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  if (isOidLike(v)) return v.$oid;
  return undefined;
}

function normalizeMember(input: unknown): Member | null {
  if (!isRecord(input)) return null;

  const firstName = str(input.firstName);
  const lastName = str(input.lastName);
  const targetEmail = str(input.targetEmail);

  // mínimos requeridos para mostrarlo
  if (!firstName || !targetEmail) return null;

  return {
    _id: memberIdToString(input._id),
    firstName,
    lastName,
    targetEmail,
    role: optStr(input.role),
    status: optStr(input.status),
    dietary: optStr(input.dietary),
    accessLink: optStr(input.accessLink),
  };
}

function normalizeInvitation(input: unknown): RawInvitation | null {
  if (!isRecord(input)) return null;

  const _id = idToString(input._id);
  const groupId = str(input.groupId);
  const contactName = str(input.contactName);
  const contactEmail = str(input.contactEmail);

  if (!_id || !groupId || !contactName || !contactEmail) return null;

  const membersRaw = Array.isArray(input.members) ? input.members : [];
  const members = membersRaw
    .map(normalizeMember)
    .filter((m): m is Member => m !== null);

  return {
    _id,
    groupId,
    contactName,
    contactEmail,
    preferredLanguage: optStr(input.preferredLanguage),
    notes: optStr(input.notes),
    members,
  };
}

const GuestList = () => {
  const [invitations, setInvitations] = useState<RawInvitation[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // form manual
  const [mainGuestName, setMainGuestName] = useState('');
  const [mainGuestPhone, setMainGuestPhone] = useState('');
  const [numAccompanying, setNumAccompanying] = useState(0);
  const [accompanyingGuests, setAccompanyingGuests] = useState<Array<{ name: string; phone: string }>>([]);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const res = await fetch('/api/invitations', { cache: 'no-store' });
        if (!res.ok) {
          console.error('[GuestList] fetch invitations failed', res.status);
          setInvitations([]);
          return;
        }

        const json = (await res.json()) as unknown;
        const arr = Array.isArray(json) ? json : [];

        const normalized = arr
          .map(normalizeInvitation)
          .filter((x): x is RawInvitation => x !== null);

        setInvitations(normalized);
      } catch (e) {
        console.error('[GuestList] fetch invitations error', e);
        setInvitations([]);
      }
    };

    fetchInvitations();
  }, []);

  // total de personas = suma de members por invitation
  const totalGuests = invitations.reduce((acc, inv) => acc + (inv.members?.length || 0), 0);

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // modal
  const openModal = () => {
    setIsModalOpen(true);
    setMainGuestName('');
    setMainGuestPhone('');
    setNumAccompanying(0);
    setAccompanyingGuests([]);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleNumAccompanyingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10) || 0;
    setNumAccompanying(value);

    if (value > accompanyingGuests.length) {
      const extra = Array.from({ length: value - accompanyingGuests.length }, () => ({ name: '', phone: '' }));
      setAccompanyingGuests([...accompanyingGuests, ...extra]);
    } else if (value < accompanyingGuests.length) {
      setAccompanyingGuests(accompanyingGuests.slice(0, value));
    }
  };

  // submit manual (solo en memoria)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainGuestName.trim()) return;

    const now = Date.now();

    const newInvitation: RawInvitation = {
      _id: `local-${now}`,
      groupId: `local-${now}`,
      contactName: mainGuestName,
      contactEmail: mainGuestPhone || '-',
      preferredLanguage: 'es',
      notes: '',
      members: [
        {
          _id: `local-${now}-primary`,
          firstName: mainGuestName,
          lastName: '',
          targetEmail: mainGuestPhone || '-',
          role: 'primary',
          status: 'pending',
        },
        ...accompanyingGuests.map((g, idx) => ({
          _id: `local-${now}-companion-${idx}`,
          firstName: g.name,
          lastName: '',
          targetEmail: g.phone,
          role: 'companion',
          status: 'pending',
        })),
      ],
    };

    setInvitations((prev) => [newInvitation, ...prev]);
    closeModal();
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-8 bg-gray-50/50 text-[#5B7553]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-extrabold" style={{ color: '#C97C5D' }}>
          👥 Invitaciones
        </h1>
        <div className="text-sm bg-white px-4 py-2 rounded-full shadow border border-[#D8A48F]/40">
          Grupos: <strong>{invitations.length}</strong> • Invitados totales: <strong>{totalGuests}</strong>
        </div>
      </div>

      <button
        onClick={openModal}
        className="mb-4 px-4 py-2 bg-[#C97C5D] text-white rounded-md hover:bg-[#b66d50] transition"
      >
        + Agregar Invitación manual
      </button>

      <div className="overflow-x-auto rounded-2xl shadow-lg bg-white border" style={{ borderColor: '#D8A48F' }}>
        <table className="min-w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#D8A48F', color: 'white' }}>
              <th className="px-6 py-3 text-left font-semibold w-10"></th>
              <th className="px-6 py-3 text-left font-semibold">Invitado principal</th>
              <th className="px-6 py-3 text-left font-semibold">Email contacto</th>
              <th className="px-6 py-3 text-left font-semibold">Idioma</th>
              <th className="px-6 py-3 text-left font-semibold"># miembros</th>
              <th className="px-6 py-3 text-left font-semibold">Grupo</th>
              <th className="px-6 py-3 text-right font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {invitations.map((inv) => {
              const primary = inv.members.find((m) => m.role === 'primary') || inv.members[0];

              return (
                <React.Fragment key={inv._id}>
                  <tr
                    className="transition-colors duration-200 hover:bg-opacity-50 bg-gray-50/50 text-[#5B7553]"
                    style={{ borderBottom: '1px solid #F1E8E0' }}
                  >
                    <td className="px-6 py-4">
                      {inv.members.length > 1 ? (
                        <button
                          onClick={() => toggleGroup(inv._id)}
                          className="p-1 rounded hover:bg-white/60"
                          aria-label="Mostrar acompañantes"
                        >
                          {expandedGroups[inv._id] ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                      ) : null}
                    </td>

                    <td className="px-6 py-4 font-medium" style={{ color: '#5B7553' }}>
                      {primary ? `${primary.firstName} ${primary.lastName || ''}`.trim() : inv.contactName}
                    </td>

                    <td className="px-6 py-4">{inv.contactEmail}</td>
                    <td className="px-6 py-4">{inv.preferredLanguage || 'es'}</td>
                    <td className="px-6 py-4">{inv.members.length}</td>
                    <td className="px-6 py-4">{inv.groupId}</td>

                    <td className="px-6 py-4 text-right flex gap-2 justify-end">
                      <button className="inline-flex items-center justify-center rounded-md px-2 py-1" aria-label="Editar">
                        <FaEdit className="text-[#A3A380]" />
                      </button>
                      <button
                        className="inline-flex items-center justify-center rounded-md px-2 py-1"
                        aria-label="Eliminar"
                      >
                        <FaTrash className="text-[#DC2626]" />
                      </button>
                    </td>
                  </tr>

                  {expandedGroups[inv._id] && inv.members.length > 1 && (
                    <tr>
                      <td colSpan={7} className="bg-white">
                        <div className="px-10 py-4 space-y-2">
                          <p className="text-xs uppercase tracking-wide text-gray-400">Acompañantes / miembros del grupo</p>

                          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {inv.members
                              .filter((m) => m !== primary)
                              .map((m) => (
                                <div
                                  key={m._id || m.targetEmail}
                                  className="border rounded-lg p-3 flex flex-col gap-1 bg-gray-50/40"
                                >
                                  <span className="font-semibold text-[#5B7553]">
                                    {m.firstName} {m.lastName}
                                  </span>
                                  <span className="text-xs text-gray-500">{m.targetEmail}</span>
                                  <span className="text-xs text-gray-500 capitalize">Rol: {m.role || 'companion'}</span>

                                  {m.status && (
                                    <span className="text-xs">
                                      Estado:{' '}
                                      <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                        {m.status}
                                      </span>
                                    </span>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {invitations.length === 0 && (
              <tr>
                <td className="px-6 py-4 text-center text-gray-400" colSpan={7}>
                  No hay invitaciones cargadas todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-center" style={{ color: '#C97C5D' }}>
              Agregar Invitación
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
                <label className="block font-semibold mb-1">Contacto (tel/email)</label>
                <input
                  type="text"
                  value={mainGuestPhone}
                  onChange={(e) => setMainGuestPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C97C5D]"
                  placeholder="email o teléfono"
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

              {accompanyingGuests.map((guest, idx) => (
                <div key={idx} className="border p-3 rounded-md mb-3">
                  <h3 className="font-semibold mb-2">Acompañante #{idx + 1}</h3>

                  <input
                    type="text"
                    value={guest.name}
                    onChange={(e) => {
                      setAccompanyingGuests((prev) => {
                        const copy = [...prev];
                        copy[idx] = { ...copy[idx], name: e.target.value };
                        return copy;
                      });
                    }}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#C97C5D]"
                    placeholder="Nombre"
                    required
                  />

                  <input
                    type="text"
                    value={guest.phone}
                    onChange={(e) => {
                      setAccompanyingGuests((prev) => {
                        const copy = [...prev];
                        copy[idx] = { ...copy[idx], phone: e.target.value };
                        return copy;
                      });
                    }}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C97C5D]"
                    placeholder="Teléfono/Email"
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
                <button type="submit" className="px-4 py-2 bg-[#C97C5D] text-white rounded hover:bg-[#b66d50]">
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