import { ChevronLeft, ChevronRight } from "lucide-react";
import { router } from "@inertiajs/react";
import { usePagination } from "../hooks/usePagination";

const SmartPagination = ({ datas, filters = {}, routeName = null }) => {
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
        <div className="px-4 py-3 border-t border-gray-200 bg-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-gray-700 hidden md:block">
                    Menampilkan{" "}
                    <span className="font-medium">{datas.from || 0}</span>{" "}
                    sampai <span className="font-medium">{datas.to || 0}</span>{" "}
                    dari <span className="font-medium">{datas.total}</span>
                </div>

                <div className="flex items-center gap-1 mx-auto md:mx-0">
                    <button
                        onClick={() =>
                            currentPage > 1 && handlePageClick(currentPage - 1)
                        }
                        className={`px-2 py-2 border border-gray-200 rounded-lg bg-white transition-colors duration-200 ${
                            currentPage <= 1
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                        }`}
                        disabled={currentPage <= 1}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {pagesToShow.map((page, index) => {
                        if (page === "...") {
                            return (
                                <span
                                    key={`dots-${index}`}
                                    className="px-3 py-2 text-gray-400"
                                >
                                    ...
                                </span>
                            );
                        }

                        return (
                            <button
                                key={page}
                                onClick={() => handlePageClick(page)}
                                className={`px-3 py-2 text-sm rounded-lg border transition-colors duration-200 ${
                                    page === currentPage
                                        ? "bg-blue-500 text-white border-blue-500"
                                        : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                                }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        onClick={() =>
                            currentPage < lastPage &&
                            handlePageClick(currentPage + 1)
                        }
                        className={`px-2 py-2 border border-gray-200 rounded-lg bg-white transition-colors duration-200 ${
                            currentPage >= lastPage
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
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
