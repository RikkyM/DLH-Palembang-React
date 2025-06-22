import { FileText, Filter, PencilLine, Search } from "lucide-react";
import Layout from "../../Layout";
import { useEffect, useRef, useState } from "react";
import SearchableSelect from "@/Components/SearchableSelect";
import SmartPagination from "@/Components/SmartPagination";
import TableHead from "@/Components/TableHead";
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
    const [status, setStatus] = useState(filters.status || "");
    const [sort, setSort] = useState(filters.sort || null);
    const [direction, setDirection] = useState(filters.direction || null);

    const allFilters = {
        search: search || filters.search,
        sort: sort || filters.sort,
        direction: direction || filters.direction,
        kategori: kategori || filters.kategori,
        subKategori: subKategori || filters.subKategori,
        petugas: petugas || filters.petugas,
        status: status || filters.status,
    };

    const [showFilters, setShowFilters] = useState(false);
    const filterRef = useRef(null);

    const columns = [
        { key: "id", label: "No", align: "text-center" },
        {
            key: "noSkrd",
            label: "no skrd",
            align: "text-left truncate",
        },
        {
            key: "noWajibRetribusi",
            label: "no wajib retribusi",
            align: "text-left truncate",
        },
        {
            key: "created_at",
            label: "tanggal skrd",
            align: "text-left truncate",
        },
        {
            key: "namaObjekRetribusi",
            label: "nama objek retribusi",
            align: "text-left truncate",
        },
        {
            key: "alamatObjekRetribusi",
            label: "alamat objek retribusi",
            align: "text-left truncate",
        },
        {
            key: "kelurahanObjekRetribusi",
            label: "kelurahan objek retribusi",
            align: "text-left truncate",
        },
        {
            key: "kecamatanObjekRetribusi",
            label: "kecamatan objek retribusi",
            align: "text-left truncate",
        },
        {
            key: "namaKategori",
            label: "klasifikasi - objek",
            align: "text-left truncate",
        },
        { key: "namaSubKategori", label: "kelas", align: "text-left truncate" },
        {
            key: "deskripsiUsaha",
            label: "jenis/deskripsi",
            align: "text-left truncate",
        },
        {
            key: "tagihanPerBulanSkrd",
            label: "per bulan",
            align: "text-left truncate",
        },
        {
            key: "tagihanPerTahunSkrd",
            label: "per tahun",
            align: "text-left truncate",
        },
        {
            key: "pembayaran_sum_jumlah_bayar",
            label: "jumlah tertagih",
            align: "text-left truncate",
        },
        {
            key: "sisa_tertagih",
            label: "sisa tertagih",
            align: "text-left truncate",
        },
        {
            key: "user.namaLengkap",
            label: "nama petugas",
            align: "text-left truncate",
        },
        { key: "statusLunas", label: "status", align: "text-left truncate" },
    ];

    const kategoriList = kategoriOptions.map((k) => ({
        value: k.namaKategori,
        label: k.namaKategori,
    }));

    const subKategoriList = subKategoriOptions.map((s) => ({
        value: s.namaSubKategori,
        label: s.namaSubKategori,
    }));

    const petugasList = petugasOptions.map((petugas) => ({
        value: petugas.id.toString(),
        label: `${petugas.namaLengkap} ${petugas.lokasi}`,
    }));

    const statusList = [
        { value: "lunas", label: "Lunas" },
        { value: "belum_lunas", label: "Belum Lunas" },
    ];

    const buildParams = (additionalParams = {}) => {
        const params = { ...additionalParams };

        if (search && search.trim() !== "") params.search = search;
        if (kategori) params.kategori = kategori;
        if (subKategori) params["sub-kategori"] = subKategori;
        if (petugas) params.petugas = petugas;
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

            router.get(route("super-admin.skrd.index"), params, {
                preserveState: true,
                replace: true,
                only: ["datas", "subKategoriOptions", "filters"],
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, kategori, subKategori, petugas, sort, direction, status]);

    return (
        <Layout title="SKRD">
            <section className="p-3">
                <div className="flex flex-col gap-3 md:gap-0 md:flex-row md:items-center justify-between w-full mb-3 bg-white p-2 rounded">
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
                            <SearchableSelect
                                id="statusList"
                                options={statusList}
                                value={status}
                                onChange={(val) => setStatus(val)}
                                placeholder="Filter berdasarkan status"
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
                            {datas?.data?.length > 0 ? (
                                datas.data.map((data, index) => (
                                    <tr
                                        key={data.id || index}
                                        onClick={() =>
                                            router.get(
                                                route(
                                                    "super-admin.skrd.show",
                                                    data.id
                                                )
                                            )
                                        }
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
                                        <td>{data.noSkrd}</td>
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
                                        <td className="min-w-32">
                                            {data.namaSubKategori}
                                        </td>
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
                                        <td className="text-left">
                                            {data.tagihanPerTahunSkrd -
                                                data.pembayaran_sum_jumlah_bayar ===
                                            0 ? (
                                                <span className="px-2 py-1 truncate text-green-700 rounded">
                                                    Lunas
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 truncate text-red-700 rounded">
                                                    Belum Lunas
                                                </span>
                                            )}
                                        </td>
                                        <td onClick={e => e.stopPropagation()}>
                                            <div className="flex flex-wrap gap-2 *:rounded *:font-medium *:text-xs *:sm:text-sm">
                                                <button className="flex items-center gap-1.5 outline-none">
                                                    <PencilLine size={20} />{" "}
                                                    Edit
                                                </button>
                                                <button
                                                    className="whitespace-nowrap flex items-center gap-1.5 outline-none"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(
                                                            route(
                                                                "super-admin.skrd.download-pdf",
                                                                { id: data.id},
                                                            ),
                                                            "_blank"
                                                        );
                                                    }}
                                                >
                                                    <FileText size={20} /> PDF
                                                </button>
                                                <button
                                                    className="whitespace-nowrap flex items-center gap-1.5 outline-none"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(
                                                            route(
                                                                "super-admin.skrd.export-excel",
                                                                { id: data.id },
                                                            ),
                                                            "_blank"
                                                        );
                                                    }}
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
                                        colSpan="17"
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
                <SmartPagination datas={datas} filters={allFilters} />
            </section>
        </Layout>
    );
};

export default Index;
