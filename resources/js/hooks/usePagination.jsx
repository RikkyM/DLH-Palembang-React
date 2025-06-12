import { router } from "@inertiajs/react";
import React from "react";

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
        const params = new URLSearchParams();
        params.set("page", page);

        Object.entries(filters).forEach(([key, value]) => {
            if (value && value.trim() !== "") {
                params.set(key, value);
            }
        });

        return `${window.location.pathname}?${params.toString()}`;
    };

    return {
        handlePageChange,
        generatePagesToShow,
        buildPageUrl,
    };
};
