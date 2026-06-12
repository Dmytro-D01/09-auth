"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={totalPages}
      forcePage={currentPage - 1}
      onPageChange={({ selected }) =>
        onPageChange(selected + 1)
      }
      previousLabel="← Prev"
      nextLabel="Next →"
      containerClassName={
        css.pagination
      }
      pageClassName={css.page}
      pageLinkClassName={css.pageLink}
      previousClassName={css.page}
      previousLinkClassName={
        css.pageLink
      }
      nextClassName={css.page}
      nextLinkClassName={css.pageLink}
      activeClassName={css.active}
      disabledClassName={css.disabled}
      breakLabel="..."
      breakClassName={css.page}
      breakLinkClassName={css.pageLink}
    />
  );
}
