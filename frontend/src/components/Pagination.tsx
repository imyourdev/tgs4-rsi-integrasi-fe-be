
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
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() =>
          onPageChange(Math.max(1, currentPage - 1))
        }
      >
        ← Sebelumnya
      </button>

      <span>
        {currentPage} / {totalPages}
      </span>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() =>
          onPageChange(Math.min(totalPages, currentPage + 1))
        }
      >
        Berikutnya →
      </button>
    </div>
  );
}
