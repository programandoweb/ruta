/**
 * ---------------------------------------------------
 *  Desarrollado por: Jorge Méndez - Programandoweb
 *  Correo: lic.jorgemendez@gmail.com
 *  Celular: 3115000926
 *  website: Programandoweb.net
 *  Proyecto: Ivoolve *  
 * ---------------------------------------------------
 */

import React from 'react';

interface Comment {
  pathname: string;
  mensaje: string;
  image: string | null;
  module: string;
  user_id: number;
  updated_at: string;
  usuario: string;
}

interface LogbookProps {
  comments: Comment[];
}

const Logbook: React.FC<LogbookProps> = ({ comments }) => {
  return (
    <div className="logbook bg-gray-100 rounded-lg shadow-lg p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Logbook</h2>
      <div className="chat-container space-y-4">
        {comments.map((comment, index) => (
          <div
            key={index}
            className={`chat-message flex ${
              comment.user_id === 2 ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`message-container p-3 rounded-lg max-w-xs ${
                comment.user_id === 2
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p className="message text-sm mb-2">{comment.mensaje}</p>
              <p className="user text-xs font-semibold">
                {comment.usuario}
              </p>
              <p className="date text-xs text-gray-400 mt-1">
                {new Date(comment.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Logbook;
