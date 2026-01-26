import { Pagination as BootstrapPagination } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
}) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageItems = () => {
    const items = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // First page
    if (startPage > 1) {
      items.push(
        <BootstrapPagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </BootstrapPagination.Item>,
      );

      if (startPage > 2) {
        items.push(<BootstrapPagination.Ellipsis key="start-ellipsis" />);
      }
    }

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <BootstrapPagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </BootstrapPagination.Item>,
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<BootstrapPagination.Ellipsis key="end-ellipsis" />);
      }

      items.push(
        <BootstrapPagination.Item
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </BootstrapPagination.Item>,
      );
    }

    return items;
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <BootstrapPagination>
        <BootstrapPagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="d-flex align-items-center"
        >
          <FaChevronLeft className="me-1" /> Previous
        </BootstrapPagination.Prev>

        {renderPageItems()}

        <BootstrapPagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="d-flex align-items-center"
        >
          Next <FaChevronRight className="ms-1" />
        </BootstrapPagination.Next>
      </BootstrapPagination>
    </div>
  );
};

export const SimplePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      {showInfo && (
        <div className="text-muted small">
          Page {currentPage} of {totalPages}
        </div>
      )}

      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
