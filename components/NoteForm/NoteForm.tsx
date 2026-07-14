import React from "react";

// 1. Окремий іменований інтерфейс для пропсів
interface NoteFormProps {
  onCancel: () => void;
}

// 2. Типізація компонента за допомогою створеного інтерфейсу
const NoteForm: React.FC<NoteFormProps> = ({ onCancel }) => {
  return (
    <form className="note-form">
      {/* Приклад полів форми */}
      <h3>Створити нотатку</h3>
      <input type="text" placeholder="Заголовок" />
      <textarea placeholder="Текст нотатки"></textarea>

      <div className="form-actions">
        <button type="button" onClick={onCancel}>
          Скасувати
        </button>
        <button type="submit">Зберегти</button>
      </div>
    </form>
  );
};

export default NoteForm;
