import { FileText, Filter, Search } from "lucide-react";
import Layout from "../../Layout";
import { useEffect, useMemo, useRef, useState } from "react";
import SearchableSelect from "@/Components/SearchableSelect";
import SmartPagination from "@/Components/SmartPagination";
import TableHead from "@/Components/TableHead";
import { router } from "@inertiajs/react";
import React from "react";

const Index = ({
  datas,
  filters,
  bulan,
  kategoriOptions = [],
  subKategoriOptions = [],
  petugasOptions = [],
}) => {
  const [search, setSearch] = useState(filters.search || "");
  const [kategori, setKategori] = useState(filters.kategori || "");
  const [subKategori, setSubKategori] = useState(filters.subKategori || "");
  const [petugas, setPetugas] = useState(filters.petugas || "");
  const [status, setStatus] = useState(filters.status || "");
  const [sort, setSort] = useState(filters.sort || null);
  const [direction, setDirection] = useState(filters.direction || null);
  const [isLoading, setIsLoading] = useState(false);

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
      key: "namaPendaftar",
      label: "nama petugas",
      align: "text-left truncate",
    },
    { key: "statusLunas", label: "status", align: "text-left truncate" },
  ];

  const kategoriList = useMemo(
    () =>
      kategoriOptions.map((k) => ({
        value: k.namaKategori,
        label: k.namaKategori,
      })),
    [kategoriOptions],
  );

  const subKategoriList = useMemo(
    () =>
      subKategoriOptions.map((s) => ({
        value: s.namaSubKategori,
        label: s.namaSubKategori,
      })),
    [subKategoriOptions],
  );

  const petugasList = useMemo(
    () =>
      Array.from(
        new Map(
          petugasOptions.map((petugas) => [
            petugas.namaLengkap,
            {
              value: petugas.namaLengkap,
              label: petugas.namaLengkap,
            },
          ]),
        ).values(),
      ),
    [petugasOptions],
  );

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
      if (direction && direction.toLowerCase() === "asc") {
        params.direction = "asc";
      }
    } else if (
      sort === "id" &&
      direction &&
      direction.toLowerCase() === "asc"
    ) {
      params.sort = sort;
      params.direction = "asc";
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
    return () => document.removeEventListener("mousedown", handleFilterOutside);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const params = buildParams();

      router.get(route("kuptd.skrd.index"), params, {
        preserveState: true,
        replace: true,
        only: ["datas", "subKategoriOptions", "filters"],
        onFinish: () => setIsLoading(false),
      });
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search, kategori, subKategori, petugas, sort, direction, status]);

  return (
    <Layout title="SKRD">
      <section className="p-3">
        <div className="mb-3 flex w-full flex-col justify-between gap-3 rounded bg-white p-2 md:flex-row md:items-center md:gap-0">
          <div className="relative flex w-full gap-2 sm:w-max">
            <button
              type="button"
              className="flex w-full items-center gap-1.5 rounded border px-3 py-1.5 shadow sm:w-max"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <Filter size={20} />
              <span>Filter</span>
            </button>
            <div
              ref={filterRef}
              className={`absolute left-0 top-full grid w-max grid-cols-1 gap-2 rounded border border-neutral-300 bg-white p-3 shadow transition-all ${
                showFilters
                  ? "pointer-events-auto mt-3 opacity-100"
                  : "pointer-events-none mt-0 opacity-0"
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
              {/* <SearchableSelect
                id="petugaslist"
                options={petugasList}
                value={petugas}
                onChange={(val) => setPetugas(val)}
                placeholder="Pilih Petugas Pendaftar"
              /> */}
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
              className="flex w-full items-center gap-1.5 rounded border bg-white p-2 text-sm shadow md:max-w-80"
            >
              <Search size={20} />
              <input
                autoComplete="off"
                type="search"
                id="search"
                placeholder="Cari nama..."
                className="flex-1 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>
          <div className="flex items-center justify-end gap-1.5 md:justify-start">
            <button
              onClick={() => {
                const params = new URLSearchParams();

                if (search) params.append("search", search);
                if (kategori) params.append("kategori", kategori);
                if (subKategori) params.append("sub-kategori", subKategori);
                if (petugas) params.append("petugas", petugas);
                if (status) params.append("status", status);

                window.open(
                  route("kuptd.skrd.download-pdf") + "?" + params.toString(),
                  "_blank",
                );
              }}
              className="rounded bg-red-500 px-3 py-1.5 text-sm font-medium text-white"
            >
              PDF
            </button>
            <button
              onClick={() => {
                const params = new URLSearchParams();

                if (search) params.append("search", search);
                if (kategori) params.append("kategori", kategori);
                if (subKategori) params.append("sub-kategori", subKategori);
                if (petugas) params.append("petugas", petugas);
                if (status) params.append("status", status);

                window.open(
                  route("kuptd.skrd.download-excel") + "?" + params.toString(),
                  "_blank",
                );
              }}
              className="rounded bg-green-700 px-3 py-1.5 text-sm font-medium text-white transition duration-300"
            >
              Excel
            </button>
          </div>
        </div>
        <div className={`overflow-auto rounded bg-white shadow`}>
          {isLoading ? (
            <div className="mb-2 flex h-16 items-center justify-center gap-2 px-2 text-sm text-gray-500">
              <svg
                className="h-4 w-4 animate-spin"
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
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-300 p-3">
                <thead>
                  <TableHead
                    columns={columns}
                    sort={sort}
                    direction={direction}
                    onSort={(column, dir) => {
                      setSort(column);
                      setDirection(dir);
                    }}
                  >
                    {bulan.map((bulan, i) => (
                      <React.Fragment key={i}>
                        <th className="cursor-pointer select-none">{bulan}</th>
                        <th className="cursor-pointer select-none truncate">
                          Tanggal Bayar
                        </th>
                      </React.Fragment>
                    ))}
                  </TableHead>
                </thead>
                <tbody className="divide-y divide-neutral-300 text-xs md:text-sm">
                  {datas?.data?.length > 0 ? (
                    datas.data.map((data, index) => (
                      <tr
                        key={data.id || index}
                        // onClick={() =>
                        //   router.get(route("kuptd.skrd.show", data.id))
                        // }
                        className={`*:p-2 ${index % 2 === 0 ? "bg-[#F7FBFE]" : ""}`}
                      >
                        <td className="text-center">
                          {(datas.current_page - 1) * datas.per_page +
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
                        <td className="min-w-32">{data.namaSubKategori}</td>
                        <td>{data.deskripsiUsaha}</td>
                        <td>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(data.tagihanPerBulanSkrd ?? 0)}
                        </td>
                        <td>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(data.tagihanPerTahunSkrd ?? 0)}
                        </td>
                        <td>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(data.pembayaran_sum_jumlah_bayar ?? 0)}
                        </td>
                        <td>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(
                            data.tagihanPerTahunSkrd -
                              data.pembayaran_sum_jumlah_bayar,
                          )}
                        </td>
                        <td>{data.namaPendaftar}</td>
                        <td className="text-left">
                          {data.tagihanPerTahunSkrd -
                            data.pembayaran_sum_jumlah_bayar ===
                          0 ? (
                            <span className="truncate rounded px-2 py-1 text-green-700">
                              Lunas
                            </span>
                          ) : (
                            <span className="truncate rounded px-2 py-1 text-red-700">
                              Belum Lunas
                            </span>
                          )}
                        </td>
                        {bulan.map((_, i) => {
                          const pembayaranUntukBulan = data.pembayaran.find(
                            (item) => item.pembayaranBulan.includes(i + 1),
                          );

                          return (
                            <React.Fragment key={i}>
                              <td className="text-center">
                                {pembayaranUntukBulan ? i + 1 : "-"}
                              </td>
                              <td className="text-center">
                                {pembayaranUntukBulan
                                  ? new Date(
                                      pembayaranUntukBulan.tanggalBayar,
                                    ).toLocaleDateString("id-ID")
                                  : "-"}
                              </td>
                            </React.Fragment>
                          );
                        })}
                        <td
                          className={`sticky right-0 top-0 ${index % 2 === 0 ? "bg-[#F7FBFE]" : "bg-white"}`}
                          // onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex flex-wrap gap-2 *:rounded *:text-xs *:font-medium *:sm:text-sm">
                            {/* <button className="flex items-center gap-1.5 outline-none">
                                                    <PencilLine size={20} />{" "}
                                                    Edit
                                                </button> */}
                            <button
                              className="flex items-center gap-1.5 whitespace-nowrap outline-none"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                  route("kuptd.skrd.download-data-pdf", {
                                    id: data.id,
                                  }),
                                  "_blank",
                                );
                              }}
                            >
                              <FileText size={20} /> SKRD
                            </button>
                            <button
                              className="flex items-center gap-1.5 whitespace-nowrap outline-none"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                  route("kuptd.skrd.download-data-excel", {
                                    id: data.id,
                                  }),
                                  "_blank",
                                );
                              }}
                            >
                              <FileText size={20} /> Excel
                            </button>
                            <button
                              onClick={() =>
                                router.get(route("kuptd.skrd.show", data.id))
                              }
                              className="flex items-center gap-1.5 whitespace-nowrap outline-none"
                              // onClick={(e) => {
                              //   e.stopPropagation();
                              //   window.open(
                              //     route("kuptd.skrd.download-data-excel", {
                              //       id: data.id,
                              //     }),
                              //     "_blank",
                              //   );
                              // }}
                            >
                              <FileText size={20} /> Detail
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="17"
                        className="py-8 text-center text-gray-500"
                      >
                        {search
                          ? "Tidak ada data yang ditemukan untuk pencarian tersebut"
                          : "Belum ada data wajib retribusi"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>

        {!isLoading && <SmartPagination datas={datas} filters={allFilters} />}
      </section>
    </Layout>
  );
};

export default Index;
