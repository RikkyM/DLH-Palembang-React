import { router } from "@inertiajs/react";

export const usePagination = () => {
  const handlePageChange = (url) => {
    if (url) {
      router.visit(url, {
        preserveState: true,
        replace: true,
        only: ["datas"],
      });
    }
  };

  const generatePagesToShow = (currentPage, lastPage) => {
    const pages = [];

    // Jika total halaman sedikit, tampilkan semua
    if (lastPage <= 7) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
      return pages;
    }

    const add = (p) => pages.push(p);

    add(1); // selalu tampilkan halaman pertama

    // tentukan window di sekitar currentPage
    // misal: 2 angka sebelum dan sesudah currentPage
    let start = Math.max(2, currentPage - 2);
    let end = Math.min(lastPage - 1, currentPage + 2);

    // rapikan bila currentPage dekat awal
    if (currentPage <= 4) {
      start = 2;
      end = 5; // 1, 2,3,4,5, ..., last
    }

    // rapikan bila currentPage dekat akhir
    if (currentPage >= lastPage - 3) {
      start = lastPage - 4; // 1, ..., last-4,last-3,last-2,last-1,last
      end = lastPage - 1;
    }

    // sisipkan "..." jika ada gap dari 1 ke start
    if (start > 2) add("...");

    for (let i = start; i <= end; i++) add(i);

    // sisipkan "..." jika ada gap dari end ke lastPage
    if (end < lastPage - 1) add("...");

    add(lastPage); // selalu tampilkan halaman terakhir
    return pages;
  };


  const buildPageUrl = (page, filters = {}) => {
    const currentParams = new URLSearchParams(window.location.search);

    // Set the new page number
    currentParams.set("page", page);

    // Add or update filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.toString().trim() !== "") {
        currentParams.set(key, value);
      } else {
        currentParams.delete(key);
      }
    });

    return `${window.location.pathname}?${currentParams.toString()}`;
  };

  const navigateToPage = (page, routeName, filters = {}) => {
    const params = { ...filters, page };

    // Clean up empty parameters
    Object.keys(params).forEach((key) => {
      if (!params[key] || params[key].toString().trim() === "") {
        delete params[key];
      }
    });

    router.get(route(routeName), params, {
      preserveState: true,
      replace: true,
      only: ["datas"],
    });
  };

  return {
    handlePageChange,
    generatePagesToShow,
    buildPageUrl,
    navigateToPage,
  };
};
