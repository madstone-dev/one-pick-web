import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

export default function OffsetPaginator({
  itemTotal,
  currentPage,
  take,
  lastPage,
  setPage,
}: any) {
  const onPrevClick = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const onNextClick = () => {
    if (currentPage < lastPage) {
      setPage(currentPage + 1);
    }
  };

  return (
    <nav
      className="flex items-center justify-end space-x-4 bg-white"
      aria-label="Pagination"
    >
      <div className="block">
        <p className="text-sm text-gray-700">
          <span className="font-medium">{itemTotal}</span>개 중{" "}
          <span className="font-medium">
            {itemTotal === 0 ? 0 : (currentPage - 1) * take + 1}
          </span>
          -
          <span className="font-medium">
            {currentPage * take > itemTotal ? itemTotal : currentPage * take}
          </span>
        </p>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <button
          onClick={onPrevClick}
          className={`${
            currentPage === 1
              ? "opacity-30 pointer-events-none"
              : "text-gray-700"
          } relative inline-flex items-center p-2 text-sm font-medium rounded-full hover:bg-gray-100`}
        >
          <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
        </button>
        <button
          onClick={onNextClick}
          className={`${
            lastPage === currentPage
              ? "opacity-30 pointer-events-none"
              : "text-gray-700"
          } relative inline-flex items-center p-2 text-sm font-medium rounded-full hover:bg-gray-100`}
        >
          <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
