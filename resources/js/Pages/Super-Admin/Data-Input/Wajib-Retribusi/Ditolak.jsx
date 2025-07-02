import { useEffect, useRef, useState } from "react";
import Layout from "../../Layout";
import TableHead from "@/Components/TableHead";
import { router } from "@inertiajs/react";

import { FileText, Filter, PencilLine, Search } from "lucide-react";
import SearchableSelect from "@/Components/SearchableSelect";
import SmartPagination from "@/Components/SmartPagination";
import Table from "./Table";

const Ditolak = ({
    datas,
    filters,
    pjOptions = [],
    kategoriOptions = [],
    subKategoriOptions = [],
    kecamatanOptions = [],
    kelurahanOptions = [],
    petugasOptions = [],
}) => {
    const [search, setSearch] = useState(filters.search || "");
    const [sort, setSort] = useState(filters.sort || null);
    const [direction, setDirection] = useState(filters.direction || null);
    const [kategori, setKategori] = useState(filters.kategori || "");
    const [subKategori, setSubKategori] = useState(filters.subKategori || "");
    const [kecamatan, setKecamatan] = useState(filters.kecamatan || "");
    const [kelurahan, setKelurahan] = useState(filters.kelurahan || "");
    const [petugas, setPetugas] = useState(filters.petugas || "");
    const [showFilters, setShowFilters] = useState(false);
    const [pj, setpj] = useState(filters.pj || "");
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

    const kategoriList = kategoriOptions.map((k) => ({
        value: k.kodeKategori,
        label: k.namaKategori,
    }));

    const pjList = pjOptions.map((k) => ({
        value: k.id.toString(),
        label: k.namaPemilik,
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
        if (pj) params.pj = pj;
        if (kategori) params.kategori = kategori;
        if (subKategori) params["sub-kategori"] = subKategori;
        if (kecamatan) params.kecamatan = kecamatan;
        if (kelurahan) params.kelurahan = kelurahan;
        if (petugas) params.petugas = petugas;
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

            router.get(route("super-admin.wajib-retribusi-ditolak"), params, {
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
        pj,
    ]);

    return (
        <Layout title="WAJIB RETRIBUSI DITOLAK">
            <section className="p-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center justify-between w-full mb-3 p-2 rounded bg-white shadow">
                    <div className="flex flex-col sm:flex-row md:items-center gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-2 w-full sm:w-max">
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
                                    <SearchableSelect
                                        id="pjlist"
                                        options={pjList}
                                        value={pj}
                                        onChange={(val) => setpj(val)}
                                        placeholder="Pilih Penanggung Jawab"
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

                                params.append("status", "Approved");

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

                                params.append("status", "Approved");

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
                    <Table
                        datas={datas}
                        columns={columns}
                        sort={sort}
                        direction={direction}
                    />
                </div>

                <SmartPagination datas={datas} filters={filters} />
            </section>
        </Layout>
    );
};

export default Ditolak;
