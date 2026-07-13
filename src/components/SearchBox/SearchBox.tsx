"use client";

import React, { useState } from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  globalSearch: string;
  onSearchChange: (value: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  globalSearch,
  onSearchChange,
}) => {
  // Инициализируем один раз текущим значением глобального поиска
  const [localValue, setLocalValue] = useState(globalSearch);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setLocalValue(value); // Сразу обновляем текст на экране (без лагов)
    onSearchChange(value); // Отправляем в дебаунс хук родителя
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={localValue}
      onChange={handleChange}
    />
  );
};
