
export default function Home() {
  const weddingDate = new Date('2026-06-26');
  const today = new Date();
  const timeDiff = weddingDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  return (
    <div
      className="min-h-screen p-6 bg-gray-50/50 text-[#5B7553]"
      // Fondo + texto principal
    >
      <h1
        className="text-3xl font-bold mb-2"
        style={{ color: '#C97C5D' }} // Terracotta
      >
        💍 ¡Hola Romina & Sebastian!
      </h1>

      <p className="text-lg mb-6">
        Faltan{' '}
        <span className="font-semibold" style={{ color: '#D8A48F' }}>
          {daysLeft} días
        </span>{' '}
        para el gran día.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Tarjeta: Tareas */}
        <div
          className="shadow rounded-lg p-4"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <h2 className="text-lg font-semibold mb-2">🗓️ Tareas</h2>
          <p>5 tareas pendientes</p>
        </div>

        {/* Tarjeta: Presupuesto */}
        <div
          className="shadow rounded-lg p-4"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <h2 className="text-lg font-semibold mb-2">💰 Presupuesto</h2>
          <p>70% usado</p>
        </div>

        {/* Tarjeta: Invitados */}
        <div
          className="shadow rounded-lg p-4"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <h2 className="text-lg font-semibold mb-2">👥 Invitados</h2>
          <p>80 confirmados</p>
        </div>

        {/* Tarjeta: Proveedores */}
        <div
          className="shadow rounded-lg p-4"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <h2 className="text-lg font-semibold mb-2">🚚 Proveedores</h2>
          <p>3 contratados</p>
        </div>
      </div>

      {/* Tarjeta: Próximos pasos */}
      <div
        className="shadow rounded-lg p-4"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <h2 className="text-lg font-semibold mb-2" style={{ color: '#C97C5D' }}>
          📌 Próximos pasos
        </h2>
        <ul className="list-disc ml-5 text-sm space-y-1">
          <li>Confirmar catering</li>
          <li>Enviar invitaciones digitales</li>
          <li>Revisar lista de regalos</li>
        </ul>
      </div>
    </div>
  );
}
