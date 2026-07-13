"use client";
import React from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../lib/api";
import { Note } from "../../types/note";
import css from "./NoteList.module.css";

export const NoteList: React.FC<{ notes: Note[] }> = ({ notes }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const escapeHTML = (str: string) =>
    !str ? "" : (
      str.replace(
        /[&<>'"]/g,
        (t) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            '"': "&quot;",
          })[t] || t,
      )
    );

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{escapeHTML(note.title)}</h2>
          <p className={css.content}>{escapeHTML(note.content)}</p>
          <div className={css.footer}>
            <span className={css.tag}>{escapeHTML(note.tag || "Todo")}</span>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Link
                href={`/notes/${note.id}`}
                style={{
                  color: "#4f46e5",
                  textDecoration: "underline",
                  fontSize: "0.9rem",
                }}
              >
                View details
              </Link>
              <button
                className={css.button}
                onClick={() => {
                  if (confirm("Видалити?")) deleteMutation.mutate(note.id);
                }}
                disabled={deleteMutation.isPending}
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
