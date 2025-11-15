import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import { usePagination } from "../hooks/usePagination";

const SmartPagination = ({
  datas,
  className = null,
  filters = {},
  routeName = null,
}) => {
  const { handlePageChange, generatePagesToShow, buildPageUrl } =
    usePagination();

  if (!datas?.links || datas.data?.length === 0) return null;

  const currentPage = datas.current_page;
  const lastPage = datas.last_page;
  const pagesToShow = generatePagesToShow(currentPage, lastPage);

  const handlePageClick = (page) => {
    if (routeName) {
      const params = { page };

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.toString().trim() !== "") {
          params[key] = value;
        }
      });

      router.get(route(routeName), params, {
        preserveState: true,
        replace: true,
        only: ["datas", "users"],
      });
    } else {
      const targetUrl = buildPageUrl(page, filters);
      router.visit(targetUrl, {
        preserveState: true,
        replace: true,
        only: ["datas", "users"],
      });
    }
  };

  return (
    <div
      className={`overflow-x-auto border-t border-gray-200 bg-white px-4 py-3 ${className}`}
    >
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="hidden text-xs text-gray-700 md:block lg:text-sm">
          Menampilkan <span className="font-medium">{datas.from || 0}</span>{" "}
          sampai <span className="font-medium">{datas.to || 0}</span> dari{" "}
          <span className="font-medium">{datas.total}</span>
        </div>

        <div className="mx-auto flex items-center gap-1 md:mx-0">
          <button
            type="button"
            onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}
            className={`rounded-lg border border-gray-200 bg-white px-2 py-2 transition-colors duration-200 ${
              currentPage <= 1
                ? "cursor-not-allowed text-gray-300"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
            }`}
            disabled={currentPage <= 1}
          >
            <ChevronLeft size={16} />
          </button>

          {pagesToShow.map((page, index) => {
            if (page === "...") {
              return (
                <span key={`dots-${index}`} className="px-3 py-2 text-gray-400">
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors duration-200 ${
                  page === currentPage
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() =>
              currentPage < lastPage && handlePageClick(currentPage + 1)
            }
            className={`rounded-lg border border-gray-200 bg-white px-2 py-2 transition-colors duration-200 ${
              currentPage >= lastPage
                ? "cursor-not-allowed text-gray-300"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
            }`}
            disabled={currentPage >= lastPage}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartPagination;
