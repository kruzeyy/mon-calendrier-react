import React, { useState } from 'react';

const CreateEventForm = ({ onSave, onClose }) => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventName || !eventDate || !startTime || !endTime) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    // Validation : L'heure de fin ne doit pas être avant l'heure de début
    if (endTime <= startTime) {
      alert("L'heure de fin doit être après l'heure de début.");
      return;
    }

    onSave(eventDate, startTime, endTime, eventName); // Appelle la fonction pour sauvegarder l'événement
    onClose(); // Ferme le formulaire après l'enregistrement
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-indigo-200">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full transform transition duration-300 hover:scale-105">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Créer un événement</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom de l'événement */}
          <div>
            <label htmlFor="event-name" className="block text-sm font-semibold text-gray-700">
              Nom de l'événement
            </label>
            <input
              type="text"
              id="event-name"
              className="mt-2 block w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-400 text-gray-800"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Saisir un nom"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="event-date" className="block text-sm font-semibold text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="event-date"
              className="mt-2 block w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-800"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>

          {/* Heure de début */}
          <div>
            <label htmlFor="start-time" className="block text-sm font-semibold text-gray-700">
              Heure de début
            </label>
            <input
              type="time"
              id="start-time"
              className="mt-2 block w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-800"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          {/* Heure de fin */}
          <div>
            <label htmlFor="end-time" className="block text-sm font-semibold text-gray-700">
              Heure de fin
            </label>
            <input
              type="time"
              id="end-time"
              className="mt-2 block w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-800"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-between space-x-4">
            <button
              type="button"
              className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-3 rounded-lg transition duration-300 shadow-md"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="w-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-4 py-3 rounded-lg transition duration-300 shadow-md"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventForm;
