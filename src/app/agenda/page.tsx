'use client';
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';


const WeddingCalendar = () => {
  const [events, setEvents] = useState([
    { title: '💐 Reunión con florista', date: '2025-07-10' },
    { title: '👗 Prueba de vestido', date: '2025-07-15' },
    { title: '🎶 Reunión con DJ', date: '2025-08-02' },
    { title: '💍 Día de la boda', date: '2025-09-15' },
  ]);

  const handleDateClick = (info: { dateStr: string }) => {
    const title = prompt('¿Cuál es el nombre del evento?');
    if (title) {
      setEvents([...events, { title, date: info.dateStr }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-[#5B7553] px-4 py-6 md:px-8">
      <h1 className="text-xl sm:text-2xl font-bold text-boho-terracotta mb-4 text-center sm:text-left">
        📅 Calendario de la Boda
      </h1>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <div className="min-w-[320px] w-full">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
            }}
            editable={true}
            selectable={true}
            events={events}
            dateClick={handleDateClick}
            height="auto"
            locale="es"
            buttonText={{
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              list: 'Lista',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WeddingCalendar;
