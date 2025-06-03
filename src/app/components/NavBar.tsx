'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import {
  FaHome,
  FaCalendarAlt,
  FaUsers,
  FaTruck,
  FaDollarSign,
  FaCog,
  FaBars
} from 'react-icons/fa';

const NavBar = ({children}: {children: React.ReactNode}) => {
  const pathname = usePathname(); // obtenemos la ruta actual
  const [isOpen, setIsOpen] = useState(false);

  // Si la URL contiene 'login', no renderizamos nada (ni el navbar ni el contenido)
  if (['login', 'register'].some(route => pathname.includes(route))) {
    return <>{children}</>;
  }

  const menuItems = [
    { name: 'Inicio', icon: <FaHome />, href: '/' },
    { name: 'Agenda', icon: <FaCalendarAlt />, href: '/agenda' },
    { name: 'Invitados', icon: <FaUsers />, href: '/invitados' },
    { name: 'Proveedores', icon: <FaTruck />, href: '/proveedores' },
    { name: 'Presupuesto', icon: <FaDollarSign />, href: '/presupuesto' },
    { name: 'Configuración', icon: <FaCog />, href: '/configuracion' },
  ];

  return (
    <div className="flex">
    {/* Sidebar */}
    <div
      className={`h-full transition-all duration-300 flex flex-col
      ${isOpen ? 'w-64' : 'w-14'} fixed top-0 left-0 z-40 bg-[#F9F5F0] shadow-lg`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white flex items-center justify-center bg-[#C97C5D] p-3"
      >
        <FaBars />
      </button>

      {/* Navegación */}
      <nav className="flex flex-col space-y-2 mt-4 px-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex items-center gap-4 px-2 py-2 rounded-md transition-colors hover:bg-[#D8A48F] text-[#5B7553] hover:text-white"
          >
            <div className="text-xl">{item.icon}</div>
            {isOpen && <span className="text-sm">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>

      {/* Contenido principal */}
      <div className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-14'}`}>
      {children}
      </div>
    </div>
  );
};

export default NavBar;
