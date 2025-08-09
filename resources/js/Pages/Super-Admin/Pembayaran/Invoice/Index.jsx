import Layout from "../../Layout";
import { useProvider } from "@/Context/GlobalContext";
import { Search } from "lucide-react";
import DialogForm from "./DialogForm";
import { useEffect, useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import TableHead from "@/Components/TableHead";

const Index = ({ datas, filters, retribusiOptions = [] }) => {
    const { modalState, openModal, closeModal } = useProvider();
    const [search, setSearch] = useState(filters.search || "");
    const [sort, setSort] = useState(filters.sort || "");
    const [direction, setDirection] = useState(filters.direction || "asc");
    const [isLoading, setIsLoading] = useState(false);

    const columns = [
        { key: "id", label: "no", align: "text-left" },
        { key: "no_invoice", label: "no invoice", align: "text-center" },
        {
            key: "noWajibRetribusi",
            label: "no wajib retribusi",
            align: "text-center truncate",
        },
        {
            key: "namaObjekRetribusi",
            label: "nama wajib retribusi",
            align: "text-left truncate",
        },
        {
            key: "alamatObjekRetribusi",
            label: "alamat layanan",
            align: "text-left",
        },
        { key: "jumlah_bulan", label: "jumlah bulan", align: "text-center truncate" },
        { key: "satuan", label: "satuan", align: "text-left" },
        {
            key: "tagihanPerBulanSkrd",
            label: "tarif retribusi",
            align: "text-left truncate",
        },
        {
            key: "total_retribusi",
            label: "total retribusi",
            align: "text-left truncate",
        },
    ];

    useEffect(() => {
        setIsLoading(true);
        const timeoutId = setTimeout(() => {
            const params = {};

            if (search && search.trim() !== "") params.search = search;
            if (sort && sort !== filters.sort) params.sort = sort;
            if (direction && direction !== filters.direction)
                params.direction = direction;

            router.get(route("super-admin.invoice.index"), params, {
                preserveState: true,
                replace: true,
                only: ["datas"],
                onFinish: () => setIsLoading(false),
            });
        }, 500);

        return () => {
            clearTimeout(timeoutId);
            setIsLoading(false);
        };
    }, [search, sort, direction]);

    const allFilters = {
        search: search || filters.search,
        sort: sort || filters.sort,
        direction: direction || filters.direction,
    };

    return (
        <Layout title="Invoice">
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
                            placeholder="Cari nama"
                            className="outline-none flex-1"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </label>
                    <div className="flex items-center justify-end md:justify-start gap-1.5 flex-wrap">
                        <button
                            onClick={() => {
                                openModal("create");
                            }}
                            className="bg-green-500 px-3 py-1.5 rounded text-sm text-white font-medium"
                        >
                            Tambah
                        </button>
                        <button className="bg-red-500 px-3 py-1.5 rounded text-sm text-white font-medium">
                            <span>PDF</span>
                        </button>
                        <button className="px-3 py-1.5 bg-green-700 rounded text-white text-sm font-medium ">
                            <span>Excel</span>
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto bg-white rounded shadow">
                    <table className="p-3 min-w-full divide-y divide-gray-300">
                        <thead>
                            {/* <tr className="*:font-medium *:text-sm *:p-2 *:uppercase *:whitespace-nowrap">
                                <th>No</th>
                                <th>no invoice</th>
                                <th>no wajib retribusi</th>
                                <th>nama wajib retribusi</th>
                                <th>alamat layanan</th>
                                <th>jumlah bulan</th>
                                <th>satuan</th>
                                <th>tarif retribusi</th>
                                <th>sub total</th>
                                <th>total retribusi</th>
                                <th>Aksi</th>
                                
                            </tr> */}
                            <TableHead
                                columns={columns}
                                sort={sort}
                                direction={direction}
                                onSort={(column, dir) => {
                                    setSort(column);
                                    setDirection(dir);
                                }}
                            />
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={11}>
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
                                        className={`*:p-2 *:truncate ${
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
                                        <td>{data.no_invoice}</td>
                                        <td>{data.skrd.noWajibRetribusi}</td>
                                        <td>{data.skrd.namaObjekRetribusi}</td>
                                        <td>
                                            {data.skrd.alamatObjekRetribusi}
                                        </td>
                                        <td>{data.jumlah_bulan}</td>
                                        <td>{data.satuan}</td>
                                        <td>
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                            }).format(
                                                data.skrd.tagihanPerBulanSkrd
                                            )}
                                        </td>
                                        <td>
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                            }).format(data.total_retribusi)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <DialogForm
                isOpen={
                    modalState.type === "create" || modalState.type === "edit"
                }
                onClose={closeModal}
                mode={modalState.type}
                invoice={modalState.data}
                retribusiOptions={retribusiOptions}
            />
        </Layout>
    );
};

export default Index;
