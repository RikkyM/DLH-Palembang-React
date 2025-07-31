import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../../Layout";
import TableHead from "@/Components/TableHead";
import { Link, router } from "@inertiajs/react";
import { useProvider } from "@/Context/GlobalContext";

import {
    ChevronDown,
    Download,
    FileText,
    Filter,
    PencilLine,
    Search,
} from "lucide-react";
import SearchableSelect from "@/Components/SearchableSelect";
import SmartPagination from "@/Components/SmartPagination";
import DialogForm from "./DialogForm";

const Index = ({
    datas,
    filters,
    pjOptions = [],
    kategoriOptions = [],
    subKategoriOptions = [],
    kecamatanOptions = [],
    kelurahanOptions = [],
    petugasOptions = [],
    statusOptions = [],
}) => {
    const { modalState, openModal, closeModal } = useProvider();
    const [search, setSearch] = useState(filters.search || "");
    const [sort, setSort] = useState(filters.sort || null);
    const [direction, setDirection] = useState(filters.direction || null);
    const [kategori, setKategori] = useState(filters.kategori || "");
    const [subKategori, setSubKategori] = useState(filters.subKategori || "");
    const [kecamatan, setKecamatan] = useState(filters.kecamatan || "");
    const [kelurahan, setKelurahan] = useState(filters.kelurahan || "");
    const [petugas, setPetugas] = useState(filters.petugas || "");
    const [status, setStatus] = useState(filters.status || "");
    const [pj, setpj] = useState(filters.pj || "");
    const [perPage, setPerPage] = useState(() => {
        return filters.per_page && filters.per_page !== 10
            ? filters.per_page
            : 10;
    });
    const [showFilters, setShowFilters] = useState(false);
    const filterRef = useRef(null);

    const columns = [
        { key: "id", label: "No", align: "text-center" },
        {
            key: "noPendaftaran",
            label: "no pendaftaran",
            align: "text-left truncate",
        },
        {
            key: "noWajibRetribusi",
            label: "no wajib retribusi",
            align: "text-left truncate",
        },
        {
            key: "penanggungJawab",
            label: "penanggung jawab",
            align: "text-left truncate",
        },
        {
            key: "namaObjekRetribusi",
            label: "nama objek retribusi",
            align: "text-left truncate",
        },
        { key: "alamat", label: "alamat", align: "text-left truncate" },
        { key: "kelurahan", label: "kelurahan", align: "text-left truncate" },
        { key: "kecamatan", label: "kecamatan", align: "text-left truncate" },
        {
            key: "rincian",
            label: "rincian layanan",
            align: "text-left truncate",
        },
        {
            key: "detailRincian",
            label: "detail rincian",
            align: "text-left truncate",
        },
        { key: "uptd", label: "uptd", align: "text-left truncate" },
        { key: "petugas", label: "nama petugas", align: "text-left truncate" },
        { key: "status", label: "status", align: "text-left truncate" },
    ];

    const kategoriList = useMemo(
        () =>
            kategoriOptions.map((k) => ({
                value: k.kodeKategori,
                label: k.namaKategori,
            })),
        [kategoriOptions]
    );

    const pjList = useMemo(
        () =>
            pjOptions.map((k) => ({
                value: k.id.toString(),
                label: k.namaPemilik,
            })),
        [pjOptions]
    );

    const subKategoriList = useMemo(
        () =>
            subKategoriOptions.map((s) => ({
                value: s.kodeSubKategori,
                label: s.namaSubKategori,
            })),
        [subKategoriOptions]
    );

    const kecamatanList = useMemo(
        () =>
            kecamatanOptions.map((kec) => ({
                value: kec.kodeKecamatan,
                label: kec.namaKecamatan,
            }))[kecamatanOptions]
    );

    const kelurahanList = useMemo(
        () =>
            kelurahanOptions.map((kel) => ({
                value: kel.kodeKelurahan,
                label: kel.namaKelurahan,
            })),
        [kelurahanOptions]
    );

    const petugasList = useMemo(
        () =>
            petugasOptions.map((petugas) => ({
                value: petugas.id.toString(),
                label: petugas.namaLengkap,
            }))[petugasOptions]
    );

    const statusList = useMemo(
        () =>
            statusOptions?.map((statusOption) => ({
                value: statusOption.value,
                label:
                    statusOption.label == "Approved" ? "Disetujui" : "Ditolak",
            })),
        [statusOptions]
    );

    const buildParams = (additionalParams = {}) => {
        const params = { ...additionalParams };

        if (search && search.trim() !== "") params.search = search;
        if (pj) params.pj = pj;
        if (kategori) params.kategori = kategori;
        if (subKategori) params["sub-kategori"] = subKategori;
        if (kecamatan) params.kecamatan = kecamatan;
        if (kelurahan) params.kelurahan = kelurahan;
        if (petugas) params.petugas = petugas;
        if (perPage && perPage !== 10) params.per_page = perPage;
        if (status) params.status = status;
        if (sort && sort !== "id") {
            params.sort = sort;
            if (direction && direction.toLowerCase() === "desc") {
                params.direction = "desc";
            }
        } else if (
            sort === "id" &&
            direction &&
            direction.toLowerCase() === "desc"
        ) {
            params.sort = sort;
            params.direction = "desc";
        }

        return params;
    };

    useEffect(() => {
        const handleFilterOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setShowFilters(false);
            }
        };

        document.addEventListener("mousedown", handleFilterOutside);
        return () =>
            document.removeEventListener("mousedown", handleFilterOutside);
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = buildParams();

            router.get(route("super-admin.wajib-retribusi.index"), params, {
                preserveState: true,
                replace: true,
                only: [
                    "datas",
                    "subKategoriOptions",
                    "kelurahanOptions",
                    "filters",
                ],
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [
        search,
        sort,
        direction,
        kategori,
        subKategori,
        kecamatan,
        kelurahan,
        petugas,
        perPage,
        status,
        pj,
    ]);

    const handlePerPageChange = (e) => {
        setPerPage(parseInt(e.target.value));
    };

    return (
        <Layout title="WAJIB RETRIBUSI">
            <section className="p-3 overflow-hidden min-h-screen">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center justify-between w-full mb-3 p-2 rounded bg-white shadow">
                    <div className="flex flex-col sm:flex-row md:items-center gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-2 w-full sm:w-max">
                            <label
                                htmlFor="showData"
                                className="text-sm flex items-center gap-1.5 cursor-pointer relative min-w-14 max-w-16 w-full"
                            >
                                <select
                                    name="showData"
                                    id="showData"
                                    value={perPage}
                                    onChange={handlePerPageChange}
                                    className="outline-none appearance-none bg-transparent cursor-pointer w-full px-2 py-1.5 shadow border rounded"
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="250">250</option>
                                </select>
                                <ChevronDown
                                    size={20}
                                    className=" bg-transparent absolute right-1 pointer-events-none"
                                />
                            </label>
                            <button
                                onClick={() => {
                                    const params = new URLSearchParams();

                                    if (perPage)
                                        params.append("per_page", perPage);

                                    window.open(
                                        route(
                                            "super-admin.wajib-retribusi.download-pdf"
                                        ) +
                                            "?" +
                                            params.toString(),
                                        "_blank"
                                    );
                                }}
                                className="py-1.5 rounded text-sm font-medium"
                            >
                                <Download size={20} />
                            </button>
                            <div className="relative flex gap-2 w-full sm:w-max">
                                <button
                                    type="button"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded shadow border w-full sm:w-max"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={() =>
                                        setShowFilters((prev) => !prev)
                                    }
                                >
                                    <span>Filter</span>
                                    <Filter size={20} />
                                </button>
                                <div
                                    ref={filterRef}
                                    className={`absolute top-full left-0 grid grid-cols-1 w-max bg-white gap-2 p-3 shadow border border-neutral-300 rounded transition-all ${
                                        showFilters
                                            ? "opacity-100 pointer-events-auto mt-3"
                                            : "opacity-0 mt-0 pointer-events-none"
                                    }`}
                                >
                                    {showFilters && (
                                        <div>
                                            <SearchableSelect
                                                id="kategoriList"
                                                options={kategoriList}
                                                value={kategori}
                                                onChange={(val) => {
                                                    setKategori(val);
                                                    setSubKategori("");
                                                }}
                                                placeholder="Pilih Kategori"
                                            />
                                            <SearchableSelect
                                                id="subkategorilist"
                                                options={subKategoriList}
                                                value={subKategori}
                                                onChange={(val) =>
                                                    setSubKategori(val)
                                                }
                                                placeholder="Pilih Sub Kategori"
                                                disabled={!kategori}
                                            />
                                            <SearchableSelect
                                                id="kecamatanlist"
                                                options={kecamatanList}
                                                value={kecamatan}
                                                onChange={(val) => {
                                                    setKecamatan(val);
                                                    setKelurahan("");
                                                }}
                                                placeholder="Pilih Kecamatan"
                                            />
                                            <SearchableSelect
                                                id="kelurahanlist"
                                                options={kelurahanList}
                                                value={kelurahan}
                                                onChange={(val) =>
                                                    setKelurahan(val)
                                                }
                                                placeholder="Pilih Kelurahan"
                                                disabled={!kecamatan}
                                            />
                                            <SearchableSelect
                                                id="petugaslist"
                                                options={petugasList}
                                                value={petugas}
                                                onChange={(val) =>
                                                    setPetugas(val)
                                                }
                                                placeholder="Pilih Petugas Pendaftar"
                                            />
                                            <SearchableSelect
                                                id="pjlist"
                                                options={pjList}
                                                value={pj}
                                                onChange={(val) => setpj(val)}
                                                placeholder="Pilih Penanggung Jawab"
                                            />
                                            <SearchableSelect
                                                id="statusList"
                                                options={statusList}
                                                value={status}
                                                onChange={(val) =>
                                                    setStatus(val)
                                                }
                                                placeholder="Filter Berdasarkan Status"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <label
                            htmlFor="search"
                            className="flex items-center gap-1.5 bg-white p-2 w-full md:max-w-80 text-sm rounded shadow border"
                        >
                            <Search className="min-w-5 max-w-20" />
                            <input
                                autoComplete="off"
                                type="search"
                                id="search"
                                placeholder="Cari nama..."
                                className="outline-none flex-1 w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="flex items-center justify-end md:justify-start gap-1.5 flex-wrap">
                        <Link
                            href={route("super-admin.wajib-retribusi.create")}
                            className="bg-green-500 px-3 py-1.5 rounded text-sm text-white font-medium"
                        >
                            Tambah
                        </Link>
                        <button
                            onClick={() => {
                                const params = new URLSearchParams();

                                if (search) params.append("search", search);
                                if (kategori)
                                    params.append("kategori", kategori);
                                if (subKategori)
                                    params.append("sub-kategori", subKategori);
                                if (kecamatan)
                                    params.append("kecamatan", kecamatan);
                                if (kelurahan)
                                    params.append("kelurahan", kelurahan);
                                if (petugas) params.append("petugas", petugas);
                                if (status) params.append("status", status);

                                window.open(
                                    route(
                                        "super-admin.wajib-retribusi.download-pdf"
                                    ) +
                                        "?" +
                                        params.toString(),
                                    "_blank"
                                );
                            }}
                            className="bg-red-500 px-3 py-1.5 rounded text-sm text-white font-medium"
                        >
                            PDF
                        </button>
                        <button
                            onClick={() => {
                                const params = new URLSearchParams();

                                if (search) params.append("search", search);
                                if (kategori)
                                    params.append("kategori", kategori);
                                if (subKategori)
                                    params.append("sub-kategori", subKategori);
                                if (kecamatan)
                                    params.append("kecamatan", kecamatan);
                                if (kelurahan)
                                    params.append("kelurahan", kelurahan);
                                if (petugas) params.append("petugas", petugas);

                                window.open(
                                    route(
                                        "super-admin.wajib-retribusi.export"
                                    ) +
                                        "?" +
                                        params.toString(),
                                    "_blank"
                                );
                            }}
                            className="px-3 py-1.5 bg-green-700 transition duration-300 rounded text-white text-sm font-medium "
                        >
                            Excel
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto bg-white rounded shadow">
                    <table className="p-3 min-w-full divide-y divide-gray-300">
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
                        <tbody className="text-xs md:text-sm ">
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
                                        <td>{data.noPendaftaran}</td>
                                        <td>{data.noWajibRetribusi ?? "-"}</td>
                                        <td className="">
                                            {data.pemilik.namaPemilik}
                                        </td>
                                        <td>{data.namaObjekRetribusi}</td>
                                        <td className="truncate max-w-sm">
                                            {data.alamat}
                                        </td>
                                        <td>{data.kelurahan.namaKelurahan}</td>
                                        <td>{data.kecamatan.namaKecamatan}</td>
                                        <td>{data.kategori.namaKategori}</td>
                                        <td>
                                            {data.sub_kategori.namaSubKategori}
                                        </td>
                                        <td>{data.uptd.namaUptd}</td>
                                        <td>{data.user.namaLengkap}</td>
                                        <td>
                                            <span
                                                className={`py-2 rounded font-medium select-none ${
                                                    data.status == "Approved"
                                                        ? "text-teal-600"
                                                        : data.status ==
                                                          "Processed"
                                                        ? "text-amber-500"
                                                        : "text-red-500"
                                                }`}
                                            >
                                                {data.status == "Approved" &&
                                                    "Diterima"}
                                                {data.status == "Processed" &&
                                                    "Diproses"}
                                                {data.status == "Rejected" &&
                                                    "Ditolak"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-2 *:rounded *:font-medium *:text-sm">
                                                <Link
                                                    href={route(
                                                        "super-admin.wajib-retribusi.edit",
                                                        {
                                                            retribusi:
                                                                data.noPendaftaran,
                                                        }
                                                    )}
                                                    className="flex items-center gap-1.5"
                                                >
                                                    <PencilLine size={20} />{" "}
                                                    Edit
                                                </Link>
                                                <button className="whitespace-nowrap flex items-center gap-1.5">
                                                    <FileText size={20} /> Form
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        window.open(
                                                            route(
                                                                "super-admin.wajib-retribusi.export-single",
                                                                { id: data.id }
                                                            ),
                                                            "_blank"
                                                        );
                                                    }}
                                                    className="whitespace-nowrap flex items-center gap-1.5"
                                                >
                                                    <FileText size={20} /> Excel
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="13"
                                        className="text-center py-8 text-center text-gray-500"
                                    >
                                        {search
                                            ? "Tidak ada data yang ditemukan untuk pencarian tersebut"
                                            : "Belum ada data wajib retribusi"}
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
                wr={modalState.data}
                mode={modalState.type}
            />
        </Layout>
    );
};

export default Index;
