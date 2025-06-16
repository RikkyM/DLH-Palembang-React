import { Filter, Search } from "lucide-react";
import Layout from "../../Layout";
import { useEffect, useRef, useState } from "react";
import SearchableSelect from "@/Components/SearchableSelect";
import SmartPagination from "@/Components/SmartPagination";
import { router } from "@inertiajs/react";

const Index = ({
    datas,
    filters,
    kategoriOptions,
    subKategoriOptions,
    petugasOptions,
}) => {
    const [search, setSearch] = useState(filters.search || "");
    const [kategori, setKategori] = useState(filters.kategori || "");
    const [subKategori, setSubKategori] = useState(filters.subKategori || "");
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

    const petugasList = petugasOptions.map((petugas) => ({
        value: petugas.id.toString(),
        label: petugas.namaLengkap,
    }));

    const buildParams = (additionalParams = {}) => {
        const params = { ...additionalParams };

        if (search && search.trim() !== "") params.search = search;
        if (kategori) params.kategori = kategori;
        if (subKategori) params["sub-kategori"] = subKategori;
        if (petugas) params.petugas = petugas;

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

            router.get(route("super-admin.skrd.index"), params, {
                preserveState: true,
                replace: true,
                only: ["skrd", "subKategoriOptions", "filters"],
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, kategori, subKategori, petugas]);

    return (
        <Layout title="SKRD">
            <section className="p-3">
                <div className="flex flex-col gap-3 md:gap-0 md:flex-row items-center justify-between w-full mb-3 bg-white p-2 rounded">
                    <div className="relative flex gap-2 w-full sm:w-max">
                        <button
                            type="button"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded shadow border w-full sm:w-max"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => setShowFilters((prev) => !prev)}
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
                                id="petugaslist"
                                options={petugasList}
                                value={petugas}
                                onChange={(val) => setPetugas(val)}
                                placeholder="Pilih Petugas Pendaftar"
                            />
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
                    {/* <button
                        onClick={() => {
                            openModal("create");
                        }}
                        className="flex justify-center items-center gap-1.5 text-sm bg-green-500 hover:bg-green-600 transition-colors duration-300 px-3 py-2 text-white w-full md:w-auto rounded outline-none"
                    >
                        <span>Tambah User</span>
                    </button> */}
                </div>
                <div className="overflow-x-auto bg-white rounded shadow">
                    <table className="p-3 min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr className="*:font-medium *:text-sm *:p-2 *:uppercase *:whitespace-nowrap">
                                <th className="text-center">no</th>
                                <th className="text-left">
                                    no wajib retribusi
                                </th>
                                <th className="text-left">tanggal skrd</th>
                                <th className="text-left">
                                    nama objek retribusi
                                </th>
                                <th className="text-left">
                                    alamat objek retribusi
                                </th>
                                <th className="text-left">kelurahan</th>
                                <th className="text-left">kecamatan</th>
                                <th className="text-left">
                                    klasifikasi - objek
                                </th>
                                <th className="text-left">kelas</th>
                                <th className="text-left">jenis/deskripsi</th>
                                <th className="text-left">per bulan</th>
                                <th className="text-left">pertahun</th>
                                <th className="text-right">jumlah tertagih</th>
                                <th className="text-right">sisa tertagih</th>
                                <th className="text-right">nama petugas</th>
                                {/* <th className="text-right">aksi</th> */}
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
                                        <td>
                                            {new Date(data.created_at)
                                                .toLocaleDateString("en-GB")
                                                .replace(/\//g, "-")}
                                        </td>
                                        <td>{data.namaObjekRetribusi}</td>
                                        <td>{data.alamatObjekRetribusi}</td>
                                        <td>{data.kelurahanObjekRetribusi}</td>
                                        <td>{data.kecamatanObjekRetribusi}</td>
                                        <td>{data.namaKategori}</td>
                                        <td>{data.namaSubKategori}</td>
                                        <td>{data.deskripsiUsaha}</td>
                                        <td>
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0,
                                            }).format(
                                                data.tagihanPerBulanSkrd ?? 0
                                            )}
                                        </td>
                                        <td>
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0,
                                            }).format(
                                                data.tagihanPerTahunSkrd ?? 0
                                            )}
                                        </td>
                                        <td>
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0,
                                            }).format(
                                                data.pembayaran_sum_jumlah_bayar ??
                                                    0
                                            )}
                                        </td>
                                        <td>
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0,
                                            }).format(
                                                data.tagihanPerTahunSkrd -
                                                    data.pembayaran_sum_jumlah_bayar
                                            )}
                                        </td>
                                        <td>{data.user.namaLengkap}</td>
                                        {/*
                                        <td>
                                            <div className="flex gap-2 *:rounded *:font-medium *:text-sm">
                                                <button className="flex items-center gap-1.5">
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
                                        </td> */}
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
        </Layout>
    );
};

export default Index;
