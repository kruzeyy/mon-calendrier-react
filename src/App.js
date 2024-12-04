import React, { useState } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  startOfYear,
  endOfYear,
} from 'date-fns';
import { fr } from 'date-fns/locale'; // Importer la localisation française
import CreateEventForm from './components/CreateEventForm';

const Calendar = ({ events, onCreateEvent, view }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-lg shadow-lg text-white">
      <button
        onClick={() => {
          if (view === 'week') setCurrentDate((prev) => addDays(prev, -7));
          else if (view === 'year') setCurrentDate((prev) => new Date(prev.getFullYear() - 1, 0, 1));
          else setCurrentDate((prev) => addDays(prev, -1));
        }}
        className="text-lg px-3 py-1 bg-white text-blue-600 rounded-lg shadow-md hover:bg-gray-200 transition duration-300"
      >
        &lt;
      </button>
      <h2 className="text-2xl font-bold">
        {view === 'week'
          ? `Semaine du ${format(startOfWeek(currentDate, { locale: fr }), 'dd MMM', { locale: fr })} au ${format(
              endOfWeek(currentDate, { locale: fr }),
              'dd MMM',
              { locale: fr }
            )}`
          : view === 'year'
          ? `Année ${format(currentDate, 'yyyy', { locale: fr })}`
          : format(currentDate, 'EEEE dd MMMM yyyy', { locale: fr })}
      </h2>
      <button
        onClick={() => {
          if (view === 'week') setCurrentDate((prev) => addDays(prev, 7));
          else if (view === 'year') setCurrentDate((prev) => new Date(prev.getFullYear() + 1, 0, 1));
          else setCurrentDate((prev) => addDays(prev, 1));
        }}
        className="text-lg px-3 py-1 bg-white text-blue-600 rounded-lg shadow-md hover:bg-gray-200 transition duration-300"
      >
        &gt;
      </button>
    </div>
  );

  const renderCells = () => {
    if (view === 'day') {
      const todayKey = format(currentDate, 'yyyy-MM-dd');
      return (
        <div className="p-6 border rounded-lg bg-gradient-to-b from-white to-gray-50 shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">{format(currentDate, 'EEEE dd MMMM yyyy', { locale: fr })}</h3>
          <div>
            {events[todayKey]?.map((event, index) => (
              <div
                key={index}
                className="text-sm bg-blue-500 text-white mt-2 p-2 rounded shadow-md hover:bg-blue-600 transition duration-300"
              >
                {event}
              </div>
            )) || <p className="text-gray-500 italic">Aucun événement</p>}
          </div>
        </div>
      );
    }

    if (view === 'week') {
      const start = startOfWeek(currentDate, { locale: fr });
      const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i));

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {days.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            return (
              <div
                key={dateKey}
                className="p-4 border rounded-lg bg-white shadow-md hover:shadow-lg transition duration-300"
              >
                <h3 className="font-semibold text-lg text-gray-800">{format(day, 'EEE dd MMM', { locale: fr })}</h3>
                <div>
                  {events[dateKey]?.map((event, index) => (
                    <div
                      key={index}
                      className="text-sm bg-blue-500 text-white mt-2 p-2 rounded shadow-md hover:bg-blue-600 transition duration-300"
                    >
                      {event}
                    </div>
                  )) || <p className="text-gray-500 italic">Aucun événement</p>}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    if (view === 'year') {
      const yearStart = startOfYear(currentDate);
      const months = Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {months.map((month) => (
            <div
              key={month}
              className="p-4 border rounded-lg bg-gradient-to-b from-gray-50 to-gray-100 shadow-md hover:shadow-lg transition duration-300"
            >
              <h3 className="font-semibold text-lg text-gray-800">{format(month, 'MMMM yyyy', { locale: fr })}</h3>
              <p className="text-gray-500 italic">Aucun affichage détaillé.</p>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      {renderHeader()}
      {renderCells()}
    </div>
  );
};

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState({});
  const [view, setView] = useState('week'); // Vue par défaut : semaine

  const saveEvent = (date, time, name) => {
    const dateKey = format(new Date(`${date}T${time}`), 'yyyy-MM-dd');
    setEvents((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), name],
    }));
    setShowForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-gray-200">
      {showForm ? (
        <CreateEventForm
          onSave={(date, time, name) => saveEvent(date, time, name)}
          onClose={() => setShowForm(false)}
        />
      ) : (
        <div className="w-full">
          <div className="flex justify-center mb-6 space-x-4">
            <button
              onClick={() => setView('day')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              Jour
            </button>
            <button
              onClick={() => setView('week')}
              className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
            >
              Semaine
            </button>
            <button
              onClick={() => setView('year')}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
            >
              Mois
            </button>
          </div>
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300"
            >
              Créer un événement
            </button>
          </div>
          <Calendar events={events} onCreateEvent={() => setShowForm(true)} view={view} />
        </div>
      )}
    </div>
  );
}
