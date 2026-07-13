import React from "react";
import { TanStackProvider } from "../components/TanStackProvider/TanStackProvider";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>
        <TanStackProvider>
          <Header />
          {children} {/* Тут рендериться сторінка нотаток */}
          <Footer />
        </TanStackProvider>

        {/* 🌟 ПЕРЕВІРТЕ: Цей контейнер має бути строго ТУТ, перед закриттям body */}
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
