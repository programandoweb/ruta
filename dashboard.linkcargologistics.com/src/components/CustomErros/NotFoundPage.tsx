import React from 'react';
import './css/style.css';

interface NotFoundProps {
  heading: string;
  content: string;
}

const NotFound: React.FC<NotFoundProps> = ({ heading, content }) => {
  return (
    <div id="colorlib-notfound" className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="colorlib-notfound">
        <div className="colorlib-notfound-404">
          <h3 id="colorlib_404_customizer_page_heading" className="text-4xl font-bold text-gray-800">{heading}</h3>
          <h1 className="text-6xl font-bold text-gray-800">
            <span>4</span>
            <span>0</span>
            <span>4</span>
          </h1>
        </div>
        <h2 id="colorlib_404_customizer_content" className="mt-4 text-2xl text-gray-600">{content}</h2>
      </div>      
    </div>
  );
};

export default NotFound;
