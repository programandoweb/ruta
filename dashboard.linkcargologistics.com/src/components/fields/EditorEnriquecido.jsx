import React, { useState, useEffect } from 'react';
import {  Editor, 
          EditorState, 
          RichUtils, 
          ContentState, 
          convertFromHTML , 
          convertToRaw} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'draft-js/dist/Draft.css';
import Card from '../card';

const EditorEnriquecido = ({ defaultValue, onChange , label}) => {
  const [editorId] = useState(`editor-enriquecido`); // Generamos un id único
  const [editorStateActive, setEditorStateActive] = useState(false);
  const [editorState, setEditorState] = useState(() => {
    if (defaultValue) {
      const blocksFromHTML    =   convertFromHTML(defaultValue);
      const state             =   ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      return EditorState.createWithContent(state);
    }
    return EditorState.createEmpty();
  });

  const [activeStyles, setActiveStyles] = useState([]);

  useEffect(() => {
    // Actualizar el estado del editor cuando cambia el defaultValue
    if (defaultValue&&!editorStateActive) {
      setEditorStateActive(true)
      const blocksFromHTML = convertFromHTML(defaultValue);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      setEditorState(EditorState.createWithContent(state));
    }
  }, [defaultValue]);

  const handleEditorChange = (newEditorState) => {

    setEditorState(newEditorState);

    // Obtener el contenido HTML actualizado del editor y pasarlo a la función onChange
    const contentState      =   newEditorState.getCurrentContent();
    const rawContentState   =   convertToRaw(contentState);

    const markup = draftToHtml(
      rawContentState,       
    );
    onChange(markup);
   
  };  

  const handleFormatClick = (format) => {
    const newEditorState = RichUtils.toggleInlineStyle(editorState, format);
    setEditorState(newEditorState);
    toggleActiveStyle(format);
    handleEditorChange(newEditorState);
  };

  const handleBlockTypeClick = (blockType) => {
    const newEditorState = RichUtils.toggleBlockType(editorState, blockType);
    setEditorState(newEditorState);
    toggleActiveStyle(blockType);
    handleEditorChange(newEditorState);
  };

  const toggleActiveStyle = (style) => {
    const isActive = activeStyles.includes(style);
    const updatedStyles = isActive
      ? activeStyles.filter((activeStyle) => activeStyle !== style)
      : [...activeStyles, style];
    setActiveStyles(updatedStyles);
  };

  const INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
  ];

  const BLOCK_TYPES = [
    { label: 'H1', style: 'header-one' },
    { label: 'H2', style: 'header-two' },
    { label: 'H3', style: 'header-three' },
    { label: 'H4', style: 'header-four' },
    { label: 'H5', style: 'header-five' },
    { label: 'H6', style: 'header-six' },    
  ];

  return (
    <div style={{ minWidth: "60%"  }}>
      {
        label&&(
          <label
                  htmlFor={editorId}
                  className={`text-sm text-navy-700 dark:text-white font-bold mb-2`}
                >
                  {label}
          </label>          
        )
      }
      
      <div className="flex btn-group mb-2 mt-5" role="group">
        {INLINE_STYLES.map((style) => (
          <div
            className="flex items-center mr-2 px-5 linear rounded-xl bg-brand-500 py-1 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            key={style.label}
            onClick={() => handleFormatClick(style.style)}            
          >
            {style.label}          
          </div>
        ))}        
      </div>
      <Card>
        <div className='card-body' style={{ minHeight: '200px' }}>
          <Editor
            id={editorId} 
            editorState={editorState}
            onChange={handleEditorChange}
            placeholder="Escriba acá el texto..."
          />
        </div>
      
      </Card>
    </div>
  );
};

export default EditorEnriquecido;
