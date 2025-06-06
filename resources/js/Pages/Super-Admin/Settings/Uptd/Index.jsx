import { PencilLine, Search, Trash } from "lucide-react";
import Layout from "../../Layout";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import DialogDelete from "./DialogDelete";
import { useProvider } from "@/Context/GlobalContext";
import DialogEdit from "./DialogEdit";
import DialogCreate from "./DialogCreate";

const Index = ({ datas, filters, kecamatan }) => {
    const { modalState, openModal, closeModal } = useProvider();
    const [search, setSearch] = useState(filters.search || "");
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        if (datas && datas.data !== undefined) {
            setIsInitialLoad(false);
        }
    }, [datas]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(
                route("super-admin.uptd"),
                { search: search },
                {
                    preserveState: true,
                    replace: true,
                    only: ["datas"],
                }
            );
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search]);

    const handlePageChange = (url) => {
        if (url) {
            router.visit(url, {
                preserveState: true,
                replace: true,
                only: ["datas"],
            });
        }
    };

    const renderPaginationButton = (link) => {
        if (!link.url) {
            return (
                <span
                    key={link.label}
                    className="px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            );
        }

        return (
            <button
                key={link.label}
                onClick={() => handlePageChange(link.url)}
                className={`px-3 py-2 text-sm rounded transition-colors duration-200 ${
                    link.active
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border"
                }`}
                dangerouslySetInnerHTML={{ __html: link.label }}
            />
        );
    };

    const LoadingSkeleton = () => {
        <>
            {[...Array(10)].map((_, index) => (
                <tr key={index} className="*:p-2 animate-pulse">
                    <td className="text-center">
                        <div className="h-4 bg-gray-200 rounded w-8 mx-auto"></div>
                    </td>
                    <td>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td>
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </td>
                    <td className="text-right">
                        <div className="flex justify-end space-x-1">
                            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                        </div>
                    </td>
                </tr>
            ))}
        </>;
    };

    return (
        <Layout title="UPTD">
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
                            placeholder="Cari nama uptd..."
                            className="outline-none flex-1"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </label>
                    <button
                        onClick={() => {
                            openModal("create", "Form UPTD");
                        }}
                        className="flex justify-center items-center gap-1.5 text-sm bg-green-500 hover:bg-green-600 transition-colors duration-300 px-3 py-2 text-white w-full md:w-auto rounded outline-none"
                    >
                        <span>Tambah Uptd</span>
                    </button>
                </div>
                <div className="overflow-x-auto bg-white rounded">
                    <table className="p-3 min-w-full divide-y divide-gray-300 whitespace-nowrap">
                        <thead>
                            <tr className="*:font-medium *:text-xs *:text-sm *:p-2">
                                <th className="text-center">No</th>
                                <th className="text-left">Nama Uptd</th>
                                <th className="text-left">Alamat</th>
                                <th className="text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs md:text-sm divide-y divide-neutral-300">
                            {isInitialLoad ? (
                                <LoadingSkeleton />
                            ) : datas.data.length > 0 ? (
                                datas.data.map((data, index) => (
                                    <tr
                                        key={data.id || index}
                                        className="*:p-2"
                                    >
                                        <td className="text-center">
                                            {(datas.current_page - 1) *
                                                datas.per_page +
                                                index +
                                                1}
                                        </td>
                                        <td>{data.namaUptd}</td>
                                        <td>{data.alamat}</td>
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
                                                    openModal("delete");
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
                                            : "Belum ada data UPTD"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {isInitialLoad ? (
                    <div className="px-4 py-3 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-sm text-gray-700 hidden md:block animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-48"></div>
                            </div>
                            <div className="flex items-center space-x-1 mx-auto md:mx-0 animate-pulse">
                                {[...Array(3)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-8 w-8 bg-gray-200 rounded"
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    datas.data.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div className="text-sm text-gray-700 hidden md:block">
                                    Menampilkan{" "}
                                    <span className="font-medium">
                                        {datas.from || 0}
                                    </span>{" "}
                                    sampai{" "}
                                    <span className="font-medium">
                                        {datas.to || 0}
                                    </span>{" "}
                                    dari{" "}
                                    <span className="font-medium">
                                        {datas.total}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-1 mx-auto md:mx-0">
                                    {datas.links.map((link, index) =>
                                        renderPaginationButton(link)
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                )}
            </section>

            {/* modal */}
            <DialogCreate
                isOpen={modalState.type === "create"}
                onClose={closeModal}
            />

            <DialogEdit
                isOpen={modalState.type === "edit"}
                onClose={closeModal}
                uptd={modalState.data}
            />

            <DialogDelete
                isOpen={modalState.type === "delete"}
                onClose={closeModal}
                uptd={modalState.data}
            />
        </Layout>
    );
};

export default Index;
