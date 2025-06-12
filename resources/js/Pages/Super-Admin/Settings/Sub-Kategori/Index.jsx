import { PencilLine, Search, Trash } from "lucide-react";
import Layout from "../../Layout";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import SmartPagination from "@/Components/SmartPagination";
import { useProvider } from "@/Context/GlobalContext";
import DialogForm from "./DialogForm";
import DialogDelete from "./DialogDelete";

const Index = ({ datas, filters, kategori }) => {
    const { modalState, openModal, closeModal } = useProvider();
    const [search, setSearch] = useState(filters.search || "");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = {};

            if (search && search.trim() !== "") params.search = search;

            router.get(route("super-admin.sub-kategori"), params, {
                preserveState: true,
                replace: true,
                only: ["datas"],
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search]);

    return (
        <Layout title="Sub Kategori">
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
                            placeholder="Cari nama kelurahan..."
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
                        <span>Tambah Sub Kategori</span>
                    </button>
                </div>

                <div className="overflow-x-auto bg-white rounded">
                    <table className="p-3 min-w-full divide-y divide-gray-300 whitespace-nowrap">
                        <thead>
                            <tr className="*:font-medium *:text-sm *:p-2">
                                <th className="text-center">No</th>
                                <th className="text-left">Kategori</th>
                                <th className="text-left">Kode Sub Kategori</th>
                                <th className="text-left">Nama Sub Kategori</th>
                                <th className="text-left">Tarif</th>
                                <th className="text-left">Perhitungan</th>
                                <th className="text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs md:text-sm divide-y divide-neutral-300">
                            {datas?.data?.length > 0 ? (
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
                                        <td>{data.kategori.namaKategori}</td>
                                        <td>{data.kodeSubKategori}</td>
                                        <td>{data.namaSubKategori}</td>
                                        <td>
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0,
                                            }).format(data.tarif ?? 0)}
                                        </td>
                                        <td>
                                            {(() => {
                                                try {
                                                    const parsed = JSON.parse(
                                                        data.perhitungan
                                                    );
                                                    return parsed.rumus || "-";
                                                } catch {
                                                    return (
                                                        data.perhitungan || "-"
                                                    );
                                                }
                                            })()}
                                        </td>
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
                                        colSpan="5"
                                        className="text-center py-8 text-center text-gray-500"
                                    >
                                        {search
                                            ? "Tidak ada data yang ditemukan untuk pencarian tersebut"
                                            : "Belum ada data Kelurahan"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <SmartPagination datas={datas} filters={filters} />
            </section>

            <DialogForm
                isOpen={
                    modalState.type === "create" || modalState.type === "edit"
                }
                onClose={closeModal}
                mode={modalState.type}
                kategori={kategori}
                subkategori={modalState.data}
            />

            <DialogDelete
                isOpen={modalState.type === "delete"}
                onClose={closeModal}
                subkategori={modalState.data}
            />
        </Layout>
    );
};

export default Index;
