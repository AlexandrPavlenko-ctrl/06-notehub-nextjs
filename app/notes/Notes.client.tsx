"use client";

import React, { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import dynamic from "next/dynamic";
import { fetchNotes } from "../../lib/api";

import { SearchBox } from "../../components/SearchBox/SearchBox";
import { Pagination } from "../../components/Pagination/Pagination";
import { NoteList } from "../../components/NoteList/NoteList";
import { NoteForm } from "../../components/NoteForm/NoteForm";

import css from "./NotesPage.module.css"; // Шлях до робочих стилів

const Modal = dynamic(
  () => import("../../components/Modal/Modal").then((mod) => mod.Modal),
  { ssr: false },
);

export const NotesClient: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const PER_PAGE = 12;

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search }),
    placeholderData: keepPreviousData,
    refetchOnMount: false, // Гідратація з SSR
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value.trim());
    setPage(1);
  }, 500);

  // 🌟 Безпечно витягуємо масив нотаток. Перевіряємо обидва варіанти, які може повернути API
  const notesList = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div
      className={css.app || ""}
      style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}
    >
      <header
        className={css.toolbar || ""}
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "2rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <SearchBox
          key={search}
          globalSearch={search}
          onSearchChange={debouncedSearch}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        <button
          type="button"
          className={css.submitButton || ""}
          style={{ width: "auto" }}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      <main>
        {/* Показуємо лоадер ТІЛЬКИ якщо даних немає взагалі й це не placeholder */}
        {isLoading && !isPlaceholderData && (
          <div className={css.status}>Синхронізація з сервером...</div>
        )}
        {isError && (
          <div className={css.error}>
            Помилка завантаження даних. Перевірте .env.local
          </div>
        )}

        {/* 🌟 СПРОЩЕНА УМОВА: Якщо масив є — рендеримо його без жорстких блокувань станів */}
        {
          notesList.length > 0 ?
            <NoteList notes={notesList} />
            // Показуємо стан "не знайдено" тільки якщо завантаження успішно завершилось і масив дійсно порожній
          : !isLoading && <div className={css.status}>Нотаток не знайдено</div>
        }
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};
