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
    let pagesToShow = [];

    if (lastPage <= 5) {
      // Kalau total halaman <= 5, tampilkan semua
      for (let i = 1; i <= lastPage; i++) {
        pagesToShow.push(i);
      }
    } else {
      // Selalu tampilkan 1 - 5
      for (let i = 1; i <= 5; i++) {
        pagesToShow.push(i);
      }

      // Tambahkan "..." kalau lastPage > 6
      if (lastPage > 6) {
        pagesToShow.push("...");
      }

      // Tambahkan halaman terakhir
      pagesToShow.push(lastPage);
    }

    return pagesToShow;
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
