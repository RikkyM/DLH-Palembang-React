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

    if (lastPage > 0) {
      pagesToShow.push(1);
    }

    if (currentPage > 3) {
      pagesToShow.push("...");
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(lastPage - 1, currentPage + 1);
      i++
    ) {
      if (!pagesToShow.includes(i)) {
        pagesToShow.push(i);
      }
    }

    if (currentPage < lastPage - 2) {
      pagesToShow.push("...");
    }

    if (lastPage > 1) {
      pagesToShow.push(lastPage);
    }

    return pagesToShow;
  };

  const buildPageUrl = (page, filters = {}) => {
    // Get current URL parameters
    const currentParams = new URLSearchParams(window.location.search);

    // Set the new page number
    currentParams.set("page", page);

    // Add or update filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.toString().trim() !== "") {
        currentParams.set(key, value);
      } else {
        // Remove parameter if value is empty
        currentParams.delete(key);
      }
    });

    return `${window.location.pathname}?${currentParams.toString()}`;
  };

  // Alternative method using router.get for better Inertia integration
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
