import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import CreateEventForm from './CreateEventForm';

const Calendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem('events')) || {};
    setEvents(savedEvents);
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  };

  const addEvent = (dateKey, startTime, endTime, eventName) => {
    const newEvent = { id: generateId(), eventName, startTime, endTime };
    setEvents((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newEvent],
    }));
  };

  const renderHeader = () => {
    const start = startOfWeek(currentWeek, { locale: fr });

    return (
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
          className="text-gray-400 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md"
        >
          &lt;
        </button>
        <h2 className="text-2xl font-semibold text-white">
          Semaine du {format(start, 'dd MMMM yyyy', { locale: fr })}
        </h2>
        <button
          onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
          className="text-gray-400 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md"
        >
          &gt;
        </button>
      </div>
    );
  };

  const renderTimeSlots = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const start = startOfWeek(currentWeek, { locale: fr });
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

    return (
      <div className="grid grid-cols-8 border-t border-gray-700">
        <div className="bg-gray-800 text-gray-300 text-center font-bold"></div>
        {days.map((day, index) => (
          <div key={index} className="bg-gray-800 text-gray-300 text-center font-bold p-2">
            {format(day, 'EEEE dd MMMM', { locale: fr })}
          </div>
        ))}

        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="text-gray-400 bg-gray-900 text-right pr-2 h-16 border-b border-gray-700">
              {hour}:00
            </div>
            {days.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              return (
                <div
                  key={`${dateKey}-${hour}`}
                  className="h-16 border-b border-gray-700 relative cursor-pointer hover:bg-gray-800"
                >
                  {events[dateKey]?.map((event) => {
                    const eventStartHour = parseInt(event.startTime.split(':')[0], 10);
                    if (eventStartHour === hour) {
                      return (
                        <div
                          key={event.id}
                          className="absolute top-2 left-1 w-[95%] bg-blue-500 text-white text-xs rounded p-1"
                        >
                          <span className="font-bold">
                            {event.startTime} - {event.endTime}
                          </span>
                          <div>{event.eventName}</div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto bg-gray-900 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Mon Calendrier</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Créer un événement
        </button>
      </div>
      {showForm ? (
        <CreateEventForm
          onClose={() => setShowForm(false)}
          onSave={(date, startTime, endTime, name) => {
            addEvent(date, startTime, endTime, name);
            setShowForm(false);
          }}
        />
      ) : (
        <>
          {renderHeader()}
          {renderTimeSlots()}
        </>
      )}
    </div>
  );
};

export default Calendar;
