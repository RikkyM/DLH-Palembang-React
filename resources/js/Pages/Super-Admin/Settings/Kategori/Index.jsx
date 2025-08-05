import { PencilLine, Search, Trash } from "lucide-react";
import Layout from "../../Layout";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import SmartPagination from "@/Components/SmartPagination";
import { useProvider } from "@/Context/GlobalContext";
import DialogForm from "./DialogForm";
import DialogDelete from "./DialogDelete";

const Index = ({ datas, filters }) => {
    const { modalState, openModal, closeModal } = useProvider();
    const [search, setSearch] = useState(filters.search || "");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const timeoutId = setTimeout(() => {
            const params = {};

            if (search && search.trim() !== "") params.search = search;

            router.get(route("super-admin.kategori"), params, {
                preserveState: true,
                replace: true,
                only: ["datas"],
                onFinish: () => setIsLoading(false),
            });
        }, 300);

        return () => {
            clearTimeout(timeoutId);
            setIsLoading(false);
        };
    }, [search]);

    return (
        <Layout title="KATEGORI">
            <section className="p-3">
                <div className="flex flex-col gap-3 md:gap-0 md:flex-row items-center justify-between w-full mb-3 bg-white p-2 rounded">
                    <label
                        htmlFor="search"
                        className="flex items-center gap-1.5 bg-white p-2 w-full md:max-w-80 text-sm rounded shadow border"
                    >
                        <Search size={20} />
                        <input
                            autoComplete="off"
                            type="search"
                            id="search"
                            placeholder="Cari nama kategori..."
                            className="outline-none flex-1"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </label>
                    <button
                        onClick={() => {
                            openModal("create");
                        }}
                        className="flex justify-center items-center gap-1.5 text-sm bg-green-500 px-3 py-2 text-white w-full md:w-auto rounded outline-none"
                    >
                        <span>Tambah Kategori</span>
                    </button>
                </div>

                <div className="overflow-x-auto bg-white rounded">
                    <table className="p-3 min-w-full divide-y divide-gray-300 whitespace-nowrap">
                        <thead>
                            <tr className="*:font-medium *:text-sm *:p-2">
                                <th className="text-center">No</th>
                                <th className="text-left">Kode Kategori</th>
                                <th className="text-left">Nama Kategori</th>
                                <th className="text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs md:text-sm divide-y divide-neutral-300">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4}>
                                        <div className="flex justify-center items-center gap-2 text-sm text-gray-500 mb-2 px-2 h-16">
                                            <svg
                                                className="w-4 h-4 animate-spin"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8z"
                                                />
                                            </svg>
                                            Memuat data...
                                        </div>
                                    </td>
                                </tr>
                            ) : datas?.data?.length > 0 ? (
                                datas.data.map((data, index) => (
                                    <tr
                                        key={data.id || index}
                                        className={`*:p-2 ${
                                            index % 2 === 0
                                                ? "bg-[#F7FBFE]"
                                                : ""
                                        }`}
                                    >
                                        <td className="text-center">
                                            {(datas.current_page - 1) *
                                                datas.per_page +
                                                index +
                                                1}
                                        </td>
                                        <td>{data.kodeKategori}</td>
                                        <td>{data.namaKategori}</td>
                                        <td className="space-x-1 md:space-x-2 text-right">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    openModal("edit", data);
                                                }}
                                                className="rounded-full outline-none p-1 hover:bg-neutral-300 transition-all duration-300"
                                            >
                                                <PencilLine size={20} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    openModal("delete", data);
                                                }}
                                                className="rounded-full outline-none p-1 hover:bg-neutral-300 transition-all duration-300"
                                            >
                                                <Trash size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="text-center py-8 text-center text-gray-500"
                                    >
                                        {search
                                            ? "Tidak ada data yang ditemukan untuk pencarian tersebut"
                                            : "Belum ada data Kategori"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!isLoading && (
                    <SmartPagination datas={datas} filters={filters} />
                )}
            </section>

            <DialogForm
                isOpen={
                    modalState.type === "create" || modalState.type === "edit"
                }
                onClose={closeModal}
                mode={modalState.type}
                kategori={modalState.data}
            />

            <DialogDelete
                isOpen={modalState.type === "delete"}
                onClose={closeModal}
                kategori={modalState.data}
            />
        </Layout>
    );
};

export default Index;
