import { useState } from 'react';
import './EditableText.css';

const EditableText = ({ edit, textClass, inputClass, blur, save, children }) => {
  const [editMode, setEditMode] = useState(edit);
  const [inputValue, setInputValue] = useState(children);

  const handleChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setInputValue(value);
  };

  const handleKeyUp = (e) => {
    switch (e.key) {
      case 'Escape':
        setInputValue(children);
        setEditMode(false);
        break;
      case 'Enter':
        save(e.target.value);
        setEditMode(false);
        break;
      default:
      // do nothing
    }
  }

  const handleBlur = (e) => {
    switch (blur) {
      case 'save':
        save(e.target.value);
        break;
      case 'cancel':
      default:
        e.target.value = children;
        break;
    }
    setEditMode(false);
  };

  return (
    <>
      {
        editMode
          ? <input className={inputClass} type="text" value={inputValue} onBlur={handleBlur} onChange={handleChange} onKeyUp={handleKeyUp} />
          : <span className={textClass}>{children}
            <span
              onClick={() => setEditMode(true)}
              className="edit-btn"
            >
              <i className="far fa-edit fa-md"></i>
            </span></span>
      }
    </>
  )
}

export default EditableText;