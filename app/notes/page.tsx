import React from "react";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "../../lib/api";
import { NotesClient } from "./Notes.client";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  // Передаємо параметри точно так само, як вони будуть ініціалізовані на клієнті
  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, ""], // 🌟 page: 1 (число), search: '' (порожній рядок)
    queryFn: () => fetchNotes({ page: 1, perPage: 12, search: "" }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}
