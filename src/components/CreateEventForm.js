import React, { useState } from 'react';

const CreateEventForm = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && date && time) {
      onSave(date, time, name);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-white mb-4">Créer un nouvel événement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Nom de l'événement</label>
          <input
            type="text"
            className="mt-1 block w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Date</label>
          <input
            type="date"
            className="mt-1 block w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Heure</label>
          <input
            type="time"
            className="mt-1 block w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="bg-gray-700 text-white px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Annuler
          </button>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventForm;
