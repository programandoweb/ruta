'use client';

import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import './index.css';

interface ModalComponentProps {
  component: React.ElementType;
  row?: any;
  modal: boolean;
  onClose: () => void;
}

const customStyles = {
  content: {
    outline: 'none',
  },
};

const ModalComponent: React.FC<ModalComponentProps> = ({ component: Component, row, modal, onClose }) => {
  useEffect(() => {
    const element = document.getElementById('__next');
    if (element) {
      ReactModal.setAppElement(element);
    }
  }, []);

  return (
    <div className="">
      <ReactModal
        isOpen={modal?true:false}
        onRequestClose={onClose}
        shouldCloseOnOverlayClick={true}
        style={customStyles}
        overlayClassName="overlay"
        className="relative bg-white rounded-lg p-6 max-w-full sm:max-w-3xl w-full mx-4 sm:mx-auto h-[80vh] overflow-y-auto"
        contentLabel="Modal"
      >
        <div className="content">
          {/* Renderizar el componente pasado como prop */}
          <div className="content-component">
            <Component {...row} />
          </div>
          {/* Botón de cerrar */}
          <div className="text-base mt-4 flex justify-end">
            <button
              type="button"
              className="rounded-xl bg-gray-500 py-2 px-4 text-base font-medium text-white transition duration-200 hover:bg-gray-600 active:bg-gray-600 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 dark:active:bg-gray-600"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default ModalComponent;
