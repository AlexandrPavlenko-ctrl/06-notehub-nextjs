import React from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Note } from "../../types/note"; // Переконайтеся, що шлях до Note правильний

// Імпортуємо ваші оригінальні стилі
import styles from "./NoteList.module.css";

// 1. Обов'язковий іменований інтерфейс для пропсів (вимога рев'ю)
interface NoteListProps {
  notes: Note[];
}

// API функція для видалення нотатки
const deleteNoteApi = async (id: string): Promise<void> => {
  const response = await fetch(`/api/notes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete note");
};

// 2. Типізація компонента через створений інтерфейс NoteListProps
export const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const queryClient = useQueryClient();

  // Мутація для видалення з інвалідацією кешу (схвалено рев'юером)
  const { mutate: deleteNote } = useMutation({
    mutationFn: deleteNoteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error: Error) => {
      alert(`Error deleting note: ${error.message}`);
    },
  });

  if (!notes || notes.length === 0) {
    return (
      <p style={{ textAlign: "center", padding: "20px" }}>No notes found.</p>
    );
  }

  return (
    // Використовуємо оригінальний список ul та клас .list
    <ul className={styles.list}>
      {notes.map((note) => (
        // Кожна картка — це тег li з класом .listItem
        <li key={note.id} className={styles.listItem}>
          {/* Заголовок нотатки */}
          <h3 className={styles.title}>{note.title}</h3>

          {/* Вміст нотатки */}
          <p className={styles.content}>{note.content}</p>

          {/* Нижній блок картки з тегом, лінком деталей та кнопкою */}
          <div className={styles.footer}>
            {/* Тег нотатки */}
            <span className={styles.tag} title={note.tag}>
              {note.tag}
            </span>

            {/* Ваша Link на сторінку деталей Next.js */}
            <Link href={`/notes/${note.id}`} className={styles.link}>
              View Details
            </Link>

            {/* Кнопка видалення */}
            <button
              type="button"
              onClick={() => deleteNote(note.id)}
              className={styles.button}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
