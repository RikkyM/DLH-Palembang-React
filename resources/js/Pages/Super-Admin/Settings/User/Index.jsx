import { Search, ChevronLeft, ChevronRight, Users } from "lucide-react";
import Layout from "../../Layout";
import { useEffect, useState } from "react";
import { useProvider } from "@/Context/GlobalContext";
import { router } from "@inertiajs/react";
import DialogCreate from "./DialogCreate";

const Index = ({ users, uptd, filters }) => {
    const { modalState, openModal, closeModal } = useProvider();
    const [search, setSearch] = useState(filters.search || "");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams();

            if (search && search.trim() !== "") {
                params.append("search", search.trim());
            }

            router.get(route("super-admin.user"), params, {
                preserveState: true,
                replace: true,
                only: ["users"],
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search]);

    const handlePageChange = (url) => {
        if (url) {
            router.visit(url, {
                preserveState: true,
                replace: true,
                only: ["users"],
            });
        }
    };

    const renderSmartPagination = () => {
        if (!users?.links) return null;

        const currentPage = users.current_page;
        const lastPage = users.last_page;

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

        return (
            <div className="flex items-center gap-1">
                <button
                    onClick={() =>
                        currentPage > 1 && handlePageChange(users.prev_page_url)
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
                            onClick={() => {
                                const targetUrl = `${
                                    window.location.pathname
                                }?page=${page}${
                                    filters.search
                                        ? `&search=${filters.search}`
                                        : ""
                                }`;
                                router.visit(targetUrl, {
                                    preserveState: true,
                                    replace: true,
                                    only: ["users"],
                                });
                            }}
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
                        handlePageChange(users.next_page_url)
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
        );
    };

    return (
        <Layout title="User">
            <section className="p-3">
                <div className="flex flex-col gap-3 md:gap-0 md:flex-row items-center justify-between w-full mb-3 bg-white p-2 rounded">
                    <label
                        htmlFor="search"
                        className="flex items-center gap-1.5 bg-white p-2 w-full md:max-w-80 text-sm rounded shadow border"
                    >
                        <Search size={20} />
                        <input
                            type="search"
                            id="search"
                            placeholder="Cari nama user..."
                            className="outline-none flex-1"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </label>
                    <button
                        onClick={() => {
                            openModal("create");
                        }}
                        className="flex justify-center items-center gap-1.5 text-sm bg-green-500 hover:bg-green-600 transition-colors duration-300 px-3 py-2 text-white w-full md:w-auto rounded outline-none"
                    >
                        <span>Tambah User</span>
                    </button>
                </div>

                <div className="overflow-x-auto bg-white rounded">
                    <table className="p-3 min-w-full divide-y divide-gray-300 whitespace-nowrap">
                        <thead>
                            <tr className="*:font-medium *:text-sm *:p-2 *:uppercase">
                                <th className="text-center">No</th>
                                <th className="text-left">Nama Lengkap</th>
                                <th className="text-left">Jabatan</th>
                                <th className="text-left">Kelamin</th>
                                <th className="text-left">Lokasi</th>
                                <th className="text-left">NIP</th>
                                <th className="text-left">Pangkat</th>
                                <th className="text-left">Role</th>
                                <th className="text-right">History Login</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs md:text-sm divide-y divide-neutral-300">
                            {!users?.data || users.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="9"
                                        className="p-8 text-center text-gray-500"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <Users size={35} />
                                            <p className="text-lg font-medium">
                                                Tidak ada data user
                                            </p>
                                            <p className="text-sm">
                                                {search
                                                    ? `Tidak ditemukan hasil untuk "${search}"`
                                                    : "Belum ada user yang terdaftar"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user, index) => (
                                    <tr
                                        key={user.id || index}
                                        className={`*:p-2 ${
                                            index % 2 === 0
                                                ? "bg-[#F7FBFE]"
                                                : ""
                                        }`}
                                    >
                                        <td className="text-center">
                                            {users.from + index}
                                        </td>
                                        <td className="capitalize">{user.namaLengkap}</td>
                                        <td>{user.jabatan || "-"}</td>
                                        <td>{user.kelamin || "-"}</td>
                                        <td>{user.lokasi || "-"}</td>
                                        <td>{user.nip || "-"}</td>
                                        <td>{user.pangkat || "-"}</td>
                                        <td>{user.role || "-"}</td>
                                        <td className="text-right">
                                            {user.historyLogin
                                                ? new Date(
                                                      user.historyLogin
                                                  ).toLocaleDateString(
                                                      "id-ID",
                                                      {
                                                          weekday: "short",
                                                          month: "short",
                                                          day: "numeric",
                                                          year: "numeric",
                                                          hour: "numeric",
                                                          minute: "2-digit",
                                                          hour12: true,
                                                      }
                                                  )
                                                : "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {users?.data?.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-200 bg-white">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-sm text-gray-700 hidden md:block">
                                Menampilkan{" "}
                                <span className="font-medium">
                                    {users.from || 0}
                                </span>{" "}
                                sampai{" "}
                                <span className="font-medium">
                                    {users.to || 0}
                                </span>{" "}
                                dari{" "}
                                <span className="font-medium">
                                    {users.total}
                                </span>
                            </div>

                            <div className="mx-auto md:mx-0">
                                {renderSmartPagination()}
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <DialogCreate
                isOpen={modalState.type === "create"}
                onClose={closeModal}
                uptdOptions={uptd}
            />
        </Layout>
    );
};

export default Index;
