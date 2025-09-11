'use client'; // Directiva para indicar que este componente debe ejecutarse en el cliente

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Cargar ReactQuill dinámicamente solo en el cliente
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const id  = "text"
function MyEditor({ name, formData, setFormData, label }) {

  const handleOnChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="editor-container mt-4 h-52">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-white">
        {label}
      </label>
      <ReactQuill
        id={id}
        style={{ height: 150 }}
        name={name}
        theme="snow"
        value={formData&&formData[name]}
        onChange={handleOnChange}
      />
    </div>
  );
}

export default MyEditor;
