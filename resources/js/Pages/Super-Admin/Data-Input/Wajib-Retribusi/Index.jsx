import { useEffect, useRef, useState } from "react";
import Layout from "../../Layout";
import { Link, router } from "@inertiajs/react";
import { useProvider } from "@/Context/GlobalContext";

import {
    ChevronDown,
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
    kategoriOptions,
    subKategoriOptions,
    kecamatanOptions,
    kelurahanOptions,
    petugasOptions,
}) => {
        const { modalState, openModal, closeModal } = useProvider();
    const [search, setSearch] = useState(filters.search || "");
    const [kategori, setKategori] = useState(filters.kategori || "");
    const [subKategori, setSubKategori] = useState(filters.subKategori || "");
    const [kecamatan, setKecamatan] = useState(filters.kecamatan || "");
    const [kelurahan, setKelurahan] = useState(filters.kelurahan || "");
    const [petugas, setPetugas] = useState(filters.petugas || "");
    const [perPage, setPerPage] = useState(() => {
        return filters.per_page && filters.per_page !== 10
            ? filters.per_page
            : 10;
    });
    const [showFilters, setShowFilters] = useState(false);
    const filterRef = useRef(null);

    const kategoriList = kategoriOptions.map((k) => ({
        value: k.kodeKategori,
        label: k.namaKategori,
    }));

    const subKategoriList = subKategoriOptions.map((s) => ({
        value: s.kodeSubKategori,
        label: s.namaSubKategori,
    }));

    const kecamatanList = kecamatanOptions.map((kec) => ({
        value: kec.kodeKecamatan,
        label: kec.namaKecamatan,
    }));

    const kelurahanList = kelurahanOptions.map((kel) => ({
        value: kel.kodeKelurahan,
        label: kel.namaKelurahan,
    }));

    const petugasList = petugasOptions.map((petugas) => ({
        value: petugas.id.toString(),
        label: petugas.namaLengkap,
    }));

    const buildParams = (additionalParams = {}) => {
        const params = { ...additionalParams };

        if (search && search.trim() !== "") params.search = search;
        if (kategori) params.kategori = kategori;
        if (subKategori) params["sub-kategori"] = subKategori;
        if (kecamatan) params.kecamatan = kecamatan;
        if (kelurahan) params.kelurahan = kelurahan;
        if (petugas) params.petugas = petugas;
        if (perPage && perPage !== 10) params.per_page = perPage;

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

            router.get(route("super-admin.wajib-retribusi"), params, {
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
    }, [search, kategori, subKategori, kecamatan, kelurahan, petugas, perPage]);

    const handlePerPageChange = (e) => {
        setPerPage(parseInt(e.target.value));
    };

    return (
        <Layout title="WAJIB RETRIBUSI">
            <section className="p-3">
                <div
                    className="flex flex-col gap-3 lg:flex-row lg:items-center justify-between w-full mb-3 p-2 rounded bg-white shadow"
                    // sticky top-20 bg-red-500
                >
                    <div className="flex flex-col sm:flex-row md:items-center gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-2 w-full sm:w-max">
                            <label
                                htmlFor="showData"
                                className="text-sm flex items-center gap-1.5 cursor-pointer relative w-16"
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
                                    className={`absolute top-full left-0  grid grid-cols-1 w-max bg-white gap-2 p-3 shadow border border-neutral-300 rounded transition-all ${
                                        showFilters
                                            ? "opacity-100 pointer-events-auto mt-3"
                                            : "opacity-0 mt-0 pointer-events-none"
                                    }`}
                                >
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
                                        onChange={(val) => setSubKategori(val)}
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
                                        onChange={(val) => setKelurahan(val)}
                                        placeholder="Pilih Kelurahan"
                                        disabled={!kecamatan}
                                    />
                                    <SearchableSelect
                                        id="petugaslist"
                                        options={petugasList}
                                        value={petugas}
                                        onChange={(val) => setPetugas(val)}
                                        placeholder="Pilih Petugas Pendaftar"
                                    />
                                </div>
                            </div>
                        </div>
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
                    </div>
                    <div className="flex items-center justify-end md:justify-start gap-1.5">
                        <Link href={() => {
                            router.get(route(''))
                        }} className="bg-green-500 px-3 py-1.5 rounded text-sm text-white font-medium">
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

                                window.open(
                                    route(
                                        "super-admin.wajib-retribusi.preview-and-download-pdf"
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
                            <tr className="*:font-medium *:text-sm *:p-2 *:uppercase *:whitespace-nowrap">
                                <th className="text-center">no</th>
                                <th className="text-left">no pendaftaran</th>
                                <th className="text-left">penanggung jawab</th>
                                <th className="text-left">
                                    nama objek retribusi
                                </th>
                                <th className="text-left">alamat</th>
                                <th className="text-left">kelurahan</th>
                                <th className="text-left">kecamatan</th>
                                <th className="text-left">rincian layanan</th>
                                <th className="text-left">detail rincian</th>
                                <th className="text-left">uptd</th>
                                <th className="text-left">nama petugas</th>
                                <th className="text-left">status</th>
                                <th className="text-right">aksi</th>
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
                                        <td>{data.noWajibRetribusi}</td>
                                        <td className="">
                                            {data.pemilik.namaPemilik}
                                        </td>
                                        <td>{data.namaObjekRetribusi}</td>
                                        <td className="truncate max-w-sm">
                                            {data.alamat}
                                        </td>
                                        <td>{data.kelurahan.namaKelurahan}</td>
                                        <td>{data.kecamatan.namaKecamatan}</td>
                                        <td>{data.deskripsiUsaha}</td>
                                        <td>
                                            {data.sub_kategori.namaSubKategori}
                                        </td>
                                        <td>{data.uptd.namaUptd}</td>
                                        <td>{data.user.namaLengkap}</td>
                                        <td>
                                            <span className="py-2 rounded  font-medium text-teal-600 select-none ">
                                                {data.status == "Approved" &&
                                                    "Diterima"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-2 *:rounded *:font-medium *:text-sm">
                                                <button onClick={() => {
                                                    openModal('edit', data)
                                                }} className="flex items-center gap-1.5">
                                                    <PencilLine size={20} />{" "}
                                                    Edit
                                                </button>
                                                <button className="whitespace-nowrap flex items-center gap-1.5">
                                                    <FileText size={20} /> Form
                                                </button>
                                                <button className="whitespace-nowrap flex items-center gap-1.5">
                                                    <FileText size={20} /> SKRD
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
                    modalState.type === 'create' || modalState.type === 'edit'
                }
                onClose={closeModal}
                wr={modalState.data}
                mode={modalState.type}
            />
        </Layout>
    );
};

export default Index;
