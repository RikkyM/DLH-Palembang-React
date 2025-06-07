import { useEffect, useRef, useState } from "react";
import Layout from "../../Layout";
import { router } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import SearchableSelect from "@/Components/SearchableSelect";

const Index = ({
    datas,
    filters,
    kategoriOptions,
    subKategoriOptions,
    kecamatanOptions,
    kelurahanOptions,
    petugasOptions,
}) => {
    const [search, setSearch] = useState(filters.search || "");
    const [kategori, setKategori] = useState(filters.kategori || "");
    const [subKategori, setSubKategori] = useState(filters.subKategori || "");
    const [kecamatan, setKecamatan] = useState(filters.kecamatan || "");
    const [kelurahan, setKelurahan] = useState(filters.kelurahan || "");
    const [petugas, setPetugas] = useState(filters.petugas || "");
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

    console.log(petugasList);

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
            const params = {};

            if (search && search.trim() !== "") params.search = search;
            if (kategori) params.kategori = kategori;
            if (subKategori) params["sub-kategori"] = subKategori;
            if (kecamatan) params.kecamatan = kecamatan;
            if (kelurahan) params.kelurahan = kelurahan;
            if (petugas) params.petugas = petugas;

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
    }, [search, kategori, subKategori, kecamatan, kelurahan, petugas]);

    const renderSmartPagination = () => {
        if (!datas?.links) return null;

        const currentPage = datas.current_page;
        const lastPage = datas.last_page;

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
                        currentPage > 1 && handlePageChange(datas.prev_page_url)
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
                                    only: ["datas"],
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
                        handlePageChange(datas.next_page_url)
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

    const handlePageChange = (url) => {
        if (url) {
            router.visit(url, {
                preserveState: true,
                replace: true,
                only: ["datas"],
            });
        }
    };

    return (
        <Layout title="LAPORAN WAJIB RETRIBUSI">
            <section className="p-3">
                <div className="flex flex-col gap-3 md:gap-0 md:flex-row md:items-center justify-between w-full mb-3 bg-white p-2 rounded">
                    <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
                        <label
                            htmlFor="search"
                            className="flex items-center gap-1.5 bg-white p-2 w-full md:max-w-80 text-sm rounded shadow border"
                        >
                            <Search size={20} />
                            <input
                                type="search"
                                id="search"
                                placeholder="Cari nama..."
                                className="outline-none flex-1"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </label>
                        <div className="relative w-full">
                            <button
                                type="button"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded shadow border w-full"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={() => setShowFilters((prev) => !prev)}
                            >
                                <span>Filter</span>
                                <Filter size={20} />
                            </button>
                            <div
                                ref={filterRef}
                                className={`absolute top-full left-1/2 -translate-x-1/2 grid grid-cols-1 w-max bg-white gap-2 p-3 shadow border border-neutral-300 rounded transition-all ${
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
                    <button
                        onClick={() => {
                            const params = new URLSearchParams();

                            if (search) params.append("search", search);
                            if (kategori) params.append("kategori", kategori);
                            if (subKategori)
                                params.append("sub-kategori", subKategori);
                            if (kecamatan)
                                params.append("kecamatan", kecamatan);
                            if (kelurahan)
                                params.append("kelurahan", kelurahan);
                            if (petugas) params.append("petugas", petugas);

                            window.open(
                                route("super-admin.wajib-retribusi.export") +
                                    "?" +
                                    params.toString(),
                                "_blank"
                            );
                        }}
                        className="px-3 py-2 bg-teal-400 transition duration-300 hover:bg-teal-500 rounded text-white text-sm font-medium "
                    >
                        Download Laporan
                    </button>
                </div>
                <div className="overflow-x-auto bg-white rounded">
                    <table className="p-3 min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr className="*:font-medium *:text-sm *:p-2 *:uppercase *:whitespace-nowrap">
                                <th className="text-center">no</th>
                                <th className="text-left">no pendaftaran</th>
                                <th className="text-left">no wr</th>
                                <th className="text-left">pemilik</th>
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
                                        <td>{data.noPendaftaran}</td>
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
                                            <span className="bg-teal-400 px-3 py-2 rounded  font-medium text-white cursor-pointer select-none hover:bg-teal-500 transition duration-300">
                                                {data.status == "Approved" &&
                                                    "Diterima"}
                                            </span>
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
                {datas?.data?.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-200 bg-white">
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

                            <div className="mx-auto md:mx-0">
                                {renderSmartPagination()}
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </Layout>
    );
};

export default Index;
