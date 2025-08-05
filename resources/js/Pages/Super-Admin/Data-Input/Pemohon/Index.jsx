import { Filter, PencilLine, Search, Trash } from "lucide-react";
import Layout from "../../Layout";
import { useEffect, useRef, useState } from "react";
import { useProvider } from "@/Context/GlobalContext";
import SmartPagination from "@/Components/SmartPagination";
import TableHead from "@/Components/TableHead";
import { router } from "@inertiajs/react";
import DialogForm from "./DialogForm";

const Index = ({ datas, filters, kecamatanOptions, kelurahanOptions }) => {
    const { modalState, openModal, closeModal } = useProvider();
    const [search, setSearch] = useState(filters.search || "");
    const [sort, setSort] = useState(filters.sort || "");
    const [direction, setDirection] = useState(filters.direction || "asc");
    const [isLoading, setIsLoading] = useState(false);

    const columns = [
        { key: "id", label: "No", align: "text-left" },
        { key: "nik", label: "NIK", align: "text-left" },
        { key: "namaPemilik", label: "Nama Pemilik", align: "text-left" },
        { key: "alamat", label: "Alamat", align: "text-left" },
        { key: "tempatLahir", label: "Tempat Lahir", align: "text-left" },
        { key: "tanggalLahir", label: "Tanggal Lahir", align: "text-left" },
        { key: "kodeKecamatan", label: "Kecamatan", align: "text-left" },
        { key: "kodeKelurahan", label: "Kelurahan", align: "text-left" },
        { key: "noHp", label: "Nomor Hp", align: "text-left" },
        { key: "email", label: "Email", align: "text-left" },
        { key: "jabatan", label: "Jabatan", align: "text-left" },
    ];

    useEffect(() => {
        setIsLoading(true);
        const timeoutId = setTimeout(() => {
            const params = {};

            if (search && search.trim() !== "") params.search = search;
            if (sort && sort !== filters.sort) params.sort = sort;
            if (direction && direction !== filters.direction)
                params.direction = direction;

            router.get(route("super-admin.pemohon.index"), params, {
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
    }, [search, sort, direction]);

    const allFilters = {
        search: search || filters.search,
        sort: sort || filters.sort,
        direction: direction || filters.direction,
    };

    return (
        <Layout title="PEMOHON">
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
                            placeholder="Cari nama..."
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
                        <span>Tambah Pemohon</span>
                    </button>
                </div>

                <div className="overflow-x-auto bg-white rounded">
                    <table className="p-3 min-w-full divide-y divide-gray-300 whitespace-nowrap">
                        <thead>
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
                        <tbody className="text-xs md:text-sm divide-y divide-neutral-300">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={12}>
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
                                        <td>{data.nik}</td>
                                        <td>{data.namaPemilik}</td>
                                        <td>{data.alamat}</td>
                                        <td>{data.tempatLahir}</td>
                                        <td>
                                            {data.tanggalLahir &&
                                                new Date(data.tanggalLahir)
                                                    .toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                        }
                                                    )
                                                    .replace(/\//g, "-")}
                                        </td>
                                        <td>{data.kecamatan.namaKecamatan}</td>
                                        <td>{data.kelurahan.namaKelurahan}</td>
                                        <td>{data.noHP}</td>
                                        <td>{data.email}</td>
                                        <td>{data.jabatan}</td>
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
                                            {/* <button
                                                type="button"
                                                onClick={() => {
                                                    openModal("delete", data);
                                                }}
                                                className="rounded-full outline-none p-1 hover:bg-neutral-300 transition-all duration-300"
                                            >
                                                <Trash size={20} />
                                            </button> */}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="12"
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

                {!isLoading && (
                    <SmartPagination datas={datas} filters={allFilters} />
                )}
            </section>
            <DialogForm
                isOpen={
                    modalState.type === "create" || modalState.type === "edit"
                }
                onClose={closeModal}
                pemohon={modalState.data}
                mode={modalState.type}
                kecamatanOptions={kecamatanOptions}
                kelurahanOptions={kelurahanOptions}
            />
        </Layout>
    );
};

export default Index;
