import { ChevronDown, FileText, Filter, Search } from "lucide-react";
import Layout from "../Layout";
import { useEffect, useMemo, useRef, useState } from "react";
import SearchableSelect from "@/Components/SearchableSelect";
import SmartPagination from "@/Components/SmartPagination";
import TableHead from "@/Components/TableHead";
import { Head, router } from "@inertiajs/react";
import React from "react";

const Skrd = ({
  datas,
  filters,
  bulan,
  kategoriOptions = [],
  subKategoriOptions = [],
  tahunOptions = [],
}) => {
  const [search, setSearch] = useState(filters.search || "");
  const [kategori, setKategori] = useState(filters.kategori || "");
  const [subKategori, setSubKategori] = useState(filters.subKategori || "");
  const [petugas, setPetugas] = useState(filters.petugas || "");
  const [status, setStatus] = useState(filters.status || "");
  const [sort, setSort] = useState(filters.sort || null);
  const [direction, setDirection] = useState(filters.direction || null);
  const [bulanFilter, setBulanFilter] = useState(filters.bulan || "");
  const [tahunFilter, setTahunFilter] = useState(filters.tahun || "");
  const [perPage, setPerPage] = useState(() => {
    return filters.per_page && filters.per_page !== 10 ? filters.per_page : 10;
  });
  const [isLoading, setIsLoading] = useState(false);

  const fmtIDR = (v) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(v || 0));

  const totalSetoran = (row) => {
    if (row.setoran_sum_jumlah_bayar != null)
      return Number(row.setoran_sum_jumlah_bayar) || 0;

    if (Array.isArray(row.setoran)) {
      return row.setoran.reduce(
        (acc, it) => acc + (Number(it?.jumlahBayar) || 0),
        0,
      );
    }
    return 0;
  };

  const paidEffective = (row) => {
    const totalPembayaran = Number(row.pembayaran_sum_jumlah_bayar) || 0;
    if (totalPembayaran > 0) return totalPembayaran;
    return totalSetoran(row);
  };

  const sisaTagihan = (row) => {
    const tagihan = Number(row.tagihanPerTahunSkrd) || 0;
    const paid = paidEffective(row);
    return Math.max(tagihan - paid, 0);
  };

  const allFilters = {
    search: search || filters.search,
    sort: sort || filters.sort,
    direction: direction || filters.direction,
    kategori: kategori || filters.kategori,
    subKategori: subKategori || filters.subKategori,
    petugas: petugas || filters.petugas,
    status: status || filters.status,
    bulan: bulanFilter || filters.bulan,
    tahun: tahunFilter || filters.tahun,
  };

  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);

  const columns = [
    { key: "id", label: "No", align: "text-center" },
    {
      key: "noWajibRetribusi",
      label: "no wajib retribusi",
      align: "text-left truncate",
    },
    {
      key: "noSkrd",
      label: "no spkrd",
      align: "text-left truncate",
    },
    {
      key: "created_at",
      label: "tanggal spkrd",
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
      label: "Tarif /bulan",
      align: "text-left truncate",
    },
    {
      key: "tagihanPerTahunSkrd",
      label: "Tarif /Tahun",
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
      label: "petugas pendaftar",
      align: "text-left truncate",
    },
    {
      key: "namaPenagih",
      label: "penagih retribusi",
      align: "text-left truncate",
    },
    { key: "statusLunas", label: "status", align: "text-left truncate px-2" },
  ];

  const bulanOptions = useMemo(
    () => bulan.map((nama, idx) => ({ value: String(idx + 1), label: nama })),
    [bulan],
  );

  const tahunList = useMemo(
    () => tahunOptions.map((t) => ({ value: String(t), label: String(t) })),
    [tahunOptions],
  );

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

  const statusList = [
    { value: "lunas", label: "Lunas" },
    { value: "belum_lunas", label: "Belum Lunas" },
  ];

  const buildParams = (additionalParams = {}) => {
    const params = { ...additionalParams };

    if (search && search.trim() !== "") params.search = search;
    if (kategori) params.kategori = kategori;
    if (subKategori) params["sub-kategori"] = subKategori;
    if (status) params.status = status;
    if (bulanFilter) params.bulan = bulanFilter;
    if (tahunFilter) params.tahun = tahunFilter;
    if (perPage && perPage !== 10) params.per_page = perPage;
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

      router.get(route("kasubag.skrd.index"), params, {
        preserveState: true,
        replace: true,
        only: ["datas", "subKategoriOptions", "filters", "tahunOptions"],
        onFinish: () => setIsLoading(false),
      });
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    search,
    kategori,
    subKategori,
    petugas,
    perPage,
    sort,
    direction,
    status,
    bulanFilter,
    tahunFilter,
  ]);

  return (
    <Layout title="INBOX SELESAI (SPKRD)">
      <Head title="Inbox Selesai (SPKRD)" />
      <section className="h-[calc(100dvh_-_80px)] touch-pan-y overflow-auto p-3">
        <div className="mb-3 flex w-full flex-col justify-between gap-3 rounded bg-white p-2 shadow lg:flex-row lg:items-center">
          <div className="relative flex w-full flex-col gap-2 sm:flex-row md:w-auto md:items-center">
            <div className="flex w-full items-center gap-2 sm:w-max">
              <label
                htmlFor="showData"
                className="relative flex w-full min-w-20 max-w-24 cursor-pointer items-center gap-1.5 text-sm"
              >
                <select
                  name="showData"
                  id="showData"
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(parseInt(e.target.value));
                  }}
                  className="w-full cursor-pointer appearance-none rounded border bg-transparent px-2 py-1.5 shadow outline-none"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="250">250</option>
                  <option value="-1">Semua</option>
                </select>
                <ChevronDown
                  size={20}
                  className="pointer-events-none absolute right-1 bg-transparent"
                />
              </label>
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
                className={`absolute left-0 top-full z-10 grid w-max grid-cols-1 gap-2 rounded border border-neutral-300 bg-white p-3 shadow transition-all ${
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
                <SearchableSelect
                  id="statusList"
                  options={statusList}
                  value={status}
                  onChange={(val) => setStatus(val)}
                  placeholder="Filter berdasarkan status"
                />
                <SearchableSelect
                  id="FilterBulan"
                  options={bulanOptions}
                  value={bulanFilter}
                  onChange={(val) => setBulanFilter(val)}
                  placeholder="Filter bulan"
                />
                <SearchableSelect
                  id="FilterTahun"
                  options={tahunList}
                  value={tahunFilter}
                  onChange={(val) => setTahunFilter(val)}
                  placeholder="Filter tahun"
                />
              </div>
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
                if (status) params.append("status", status);

                window.open(
                  route("skrd.download-pdf") + "?" + params.toString(),
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
                if (status) params.append("status", status);

                window.open(
                  route("skrd.download-excel") + "?" + params.toString(),
                  "_blank",
                );
              }}
              className="rounded bg-green-700 px-3 py-1.5 text-sm font-medium text-white transition duration-300"
            >
              Excel
            </button>
          </div>
        </div>
        <div
          className={`max-h-[calc(100%_-_230px)] overflow-auto rounded sm:max-h-[calc(100%_-_180px)] md:max-h-[calc(100%_-_210px)] lg:max-h-[calc(100%_-_150px)] ${!isLoading && "shadow"}`}
        >
          {isLoading ? (
            <div className="mb-2 flex h-16 items-center justify-center gap-2 border bg-white px-2 text-sm text-gray-500 shadow">
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
                        <th className="sticky top-0 cursor-pointer select-none bg-[#F1B174]">
                          {bulan}
                        </th>
                        <th className="sticky top-0 cursor-pointer select-none truncate bg-[#F1B174]">
                          Tanggal Bayar
                        </th>
                      </React.Fragment>
                    ))}
                  </TableHead>
                </thead>
                <tbody className="divide-y divide-neutral-300 text-xs md:text-sm">
                  {(datas.data ?? datas)?.length > 0 ? (
                    (datas.data ?? datas).map((data, index) => (
                      <tr
                        key={data.id || index}
                        className={`*:p-2 ${index % 2 === 0 ? "bg-[#B3CEAF]" : "bg-white"}`}
                      >
                        <td className="text-center">
                          {((datas.current_page ?? 1) - 1) *
                            (datas.per_page ?? (datas.data ?? datas).length) +
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
                        <td>
                          <div className="w-72">
                            {data.alamatObjekRetribusi}
                          </div>
                        </td>
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
                        <td>{fmtIDR(paidEffective(data))}</td>
                        <td>{fmtIDR(sisaTagihan(data))}</td>
                        <td>{data.namaPendaftar}</td>
                        <td>{data.namaPenagih ?? "-"}</td>
                        <td className="text-left">
                          {sisaTagihan(data) === 0 ? (
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
                          const pembayaranUntukBulan =
                            data.pembayaran.find((item) =>
                              item.pembayaranBulan.includes(i + 1),
                            ) ??
                            data.detail_setoran.find(
                              (d) =>
                                d.namaBulan.toLowerCase() ===
                                  bulan[i].toLowerCase() &&
                                d.setoran.status === "Approved",
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
                          className={`sticky right-0 ${index % 2 === 0 ? "bg-[#B3CEAF]" : "bg-white"}`}
                        >
                          <div className="flex flex-wrap gap-2 *:rounded *:text-xs *:font-medium *:sm:text-sm">
                            {/* <button className="flex items-center gap-1.5 outline-none">
                                                        <PencilLine size={20} />{" "}
                                                        Edit
                                                    </button> */}
                            <button
                              className="flex items-center gap-1.5 whitespace-nowrap outline-none"
                              onClick={(e) => {
                                e.preventDefault();

                                if (data.fileSkrd !== null) {
                                  window.open(
                                    route("skrd.pdf", {
                                      filename: data.fileSkrd,
                                    }),
                                    "_blank",
                                  );
                                }

                                if (data.fileSkrd === null) {
                                  window.open(
                                    route("skrd.download-data-pdf", {
                                      id: data.id,
                                    }),
                                    "_blank",
                                  );
                                }
                              }}
                            >
                              <FileText size={20} /> SKRD
                            </button>
                            <button
                              className="flex items-center gap-1.5 whitespace-nowrap outline-none"
                              onClick={() => {
                                window.open(
                                  route("skrd.download-data-excel", {
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
                                router.get(route("kasubag.skrd.show", data.id))
                              }
                              className="flex items-center gap-1.5 whitespace-nowrap outline-none"
                              // onClick={(e) => {
                              //   e.stopPropagation();
                              //   window.open(
                              //     route("kasubag.skrd.download-data-excel", {
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

export default Skrd;
