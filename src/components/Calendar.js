import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, setHours, setMinutes, isToday } from 'date-fns';
import { fr } from 'date-fns/locale'; // Localisation française
import CreateEventForm from './CreateEventForm';
import emailjs from '@emailjs/browser'; // Import EmailJS

const Calendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showForm, setShowForm] = useState(false);

  // Charger les événements depuis le stockage local
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem('events')) || {};
    setEvents(savedEvents);
  }, []);

  // Mettre à jour l'heure actuelle toutes les minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Sauvegarder les événements dans le stockage local
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  // Fonction pour envoyer un email via EmailJS
  const sendEmailNotification = (eventName, eventDate) => {
    emailjs
      .send(
        'service_1l76i2b', // Remplace par ton Service ID EmailJS
        'template_ooftzq7', // Remplace par ton Template ID EmailJS
        {
          to_name: 'Maxime', // Nom du destinataire
          to_email: 'pontus.maxime@yahoo.com', // Adresse email destinataire
          event_name: eventName,
          event_date: format(new Date(eventDate), 'HH:mm dd MMMM yyyy', { locale: fr }),
        },
        'Nt5q7ny28pMGpvi6V' // Remplace par ta clé publique EmailJS
      )
      .then(
        (response) => {
          console.log('Email envoyé avec succès !', response.status, response.text);
        },
        (error) => {
          console.error('Erreur lors de l\'envoi de l\'email :', error);
        }
      );
  };

  // Ajouter un événement
  const addEvent = (dateKey, eventName) => {
    setEvents((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), eventName],
    }));
    sendEmailNotification(eventName, dateKey); // Envoi de la notification par email
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
    const hours = Array.from({ length: 24 }, (_, i) => i); // Plage horaire : 0h à 23h
    const start = startOfWeek(currentWeek, { locale: fr });
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

    return (
      <div className="grid grid-cols-8 border-t border-gray-700">
        {/* En-tête des jours */}
        <div className="bg-gray-800 text-gray-300 text-center font-bold"></div>
        {days.map((day, index) => (
          <div key={index} className="bg-gray-800 text-gray-300 text-center font-bold p-2">
            {format(day, 'EEEE dd MMMM', { locale: fr })}
          </div>
        ))}

        {/* Colonnes horaires */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            {/* Colonne des heures */}
            <div className="text-gray-400 bg-gray-900 text-right pr-2 h-16 border-b border-gray-700">
              {hour}:00
            </div>
            {days.map((day) => {
              const slotTime = setMinutes(setHours(day, hour), 0);
              const slotKey = format(slotTime, 'yyyy-MM-dd HH:mm');

              return (
                <div
                  key={slotKey}
                  className="h-16 border-b border-gray-700 relative cursor-pointer hover:bg-gray-800"
                >
                  {/* Afficher les événements */}
                  {events[slotKey]?.map((event, index) => (
                    <div
                      key={index}
                      className="absolute top-2 left-1 w-[95%] bg-blue-500 text-white text-xs rounded p-1"
                    >
                      {event}
                    </div>
                  ))}

                  {/* Barre de l'heure actuelle */}
                  {isToday(day) && currentTime.getHours() === hour && (
                    <div
                      className="absolute left-0 right-0 h-1 bg-red-500"
                      style={{
                        top: `${(currentTime.getMinutes() / 60) * 100}%`,
                      }}
                    >
                      <div className="absolute top-[-1.5rem] text-xs text-orange-500 font-bold bg-gray-900 p-1 rounded-md">
                        {format(currentTime, 'HH:mm')}
                      </div>
                    </div>
                  )}
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
          onSave={(date, time, name) => {
            const dateKey = `${date} ${time}`;
            addEvent(dateKey, name);
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
