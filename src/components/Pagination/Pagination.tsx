"use client";

import React from "react";
import type { ComponentType } from "react";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import css from "./Pagination.module.css";

type ModuleWithDefault<T> = { default: T };

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageClick = (selectedItem: { selected: number }) => {
    onPageChange(selectedItem.selected + 1);
  };

  // Безпечне клієнтське звуження типів для збирача Next.js
  let ReactPaginateComponent: ComponentType<ReactPaginateProps>;

  if (
    ReactPaginateModule &&
    typeof ReactPaginateModule === "object" &&
    "default" in ReactPaginateModule
  ) {
    const castingModule = ReactPaginateModule as ModuleWithDefault<
      ComponentType<ReactPaginateProps>
    >;
    ReactPaginateComponent = castingModule.default;
  } else {
    ReactPaginateComponent =
      ReactPaginateModule as ComponentType<ReactPaginateProps>;
  }

  if (!ReactPaginateComponent) {
    return null;
  }

  return (
    <ReactPaginateComponent
      previousLabel={"←"}
      nextLabel={"→"}
      breakLabel={"..."}
      pageCount={totalPages}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      onPageChange={handlePageClick}
      forcePage={currentPage - 1}
      // 🌟 СИНХРОНІЗАЦІЯ КЛАСІВ З ВАШИМ НОВИМ CSS-ФАЙЛОМ:
      containerClassName={css.pagination} // Прив'язуємо головний список до .pagination
      activeClassName={css.active} // Прив'язуємо активний елемент лі до .active
      // Наступні властивості можна залишити порожніми або вимкнути,
      // оскільки ваш новий CSS стилізує теги "li" та "a" напряму через каскад!
      pageClassName={""}
      pageLinkClassName={""}
      previousClassName={""}
      previousLinkClassName={""}
      nextClassName={""}
      nextLinkClassName={""}
      breakClassName={""}
      breakLinkClassName={""}
    />
  );
};
