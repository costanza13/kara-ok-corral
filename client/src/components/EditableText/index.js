import { useState } from 'react';
import './EditableText.css';

const EditableText = ({
  edit,
  textClass,
  inputClass,
  blur,
  save,
  showSave,
  showCancel,
  saveButtonClass,
  cancelButtonClass,
  initClear,
  editIcon,
  children
}) => {
  const [editMode, setEditMode] = useState(edit);
  const [inputValue, setInputValue] = useState(children);

  const init = () => {
    initClear && setInputValue('');
    setEditMode(true);
  }
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
        setEditMode(false);
        break;
      case 'hold':
        // do nothing
        break;
      case 'cancel':
      default:
        e.target.value = children;
        setEditMode(false);
        break;
    }
  };

  const handleSaveButton = () => {
    const value = document.querySelector('#et-input').value;
    save(value);
    setEditMode(false);
  }

  const handleCancelButton = () => {
    document.querySelector('#et-input').value = children;
    setEditMode(false);
  }

  return (
    <>
      {
        editMode
          ? (
            <>
              <input id='et-input' className={inputClass} type="text" value={inputValue} onBlur={handleBlur} onChange={handleChange} onKeyUp={handleKeyUp} autoFocus />
              {showSave ? <span onClick={handleSaveButton} className={`et-btn ${saveButtonClass}`}><i className="far fa-save"></i></span> : ('')}
              {showCancel ? <span onClick={handleCancelButton} className={`et-btn ${cancelButtonClass}`}><i className="far fa-window-close"></i></span> : ('')}
            </>
          ) : (
            <span className={`et-editable-text ${textClass}`} onClick={() => init()}>
              {children}
              <span
                className="et-btn et-edit-btn"
              >
                {editIcon ? editIcon : <i className="far fa-edit fa-md"></i>}
              </span>
            </span>
          )
      }
    </>
  )
}

export default EditableText;