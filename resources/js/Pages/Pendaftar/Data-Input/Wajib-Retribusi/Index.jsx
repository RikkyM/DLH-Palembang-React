import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../../Layout";
import TableHead from "@/Components/TableHead";
import { Link, router } from "@inertiajs/react";

import { ChevronDown, Download, FileText, Filter, Search } from "lucide-react";
import SearchableSelect from "@/Components/SearchableSelect";
import SmartPagination from "@/Components/SmartPagination";

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
  tahunOptions = [],
}) => {
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
    return filters.per_page && filters.per_page !== 10 ? filters.per_page : 10;
  });
  const [tahun, setTahun] = useState(filters.tahun || "");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const filterRef = useRef(null);

  const columns = [
    { key: "id", label: "No", align: "text-center" },
    // {
    //   key: "noPendaftaran",
    //   label: "no pendaftaran",
    //   align: "text-left truncate",
    // },
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
    { key: "uptd", label: "wilayah uptd", align: "text-left truncate" },
    { key: "bulan", label: "jumlah bulan", align: "text-left truncate" },
    {
      key: "bentukBadanUsaha",
      label: "bentuk badan usaha",
      align: "text-left truncate",
    },
    { key: "jenisTarif", label: "layanan", align: "text-left truncate" },
    {
      key: "keteranganBulan",
      label: "keterangan bulan",
      align: "text-left truncate",
    },
    { key: "unit", label: "unit", align: "text-left truncate" },
    { key: "m2", label: "m2", align: "text-left truncate" },
    { key: "giat", label: "giat", align: "text-left truncate" },
    { key: "hari", label: "hari", align: "text-left truncate" },
    { key: "meter", label: "meter", align: "text-left truncate" },
    { key: "tanggalSkrd", label: "tanggal spkrd", align: "text-left truncate" },
    {
      key: "tarifPerbulan",
      label: "tarif perbulan",
      align: "text-left truncate",
    },
    {
      key: "tarifPertahun",
      label: "tarif pertahun",
      align: "text-left truncate",
    },
    { key: "petugas", label: "nama petugas", align: "text-left truncate" },
    { key: "status", label: "status", align: "text-left truncate" },
  ];

  const kategoriList = useMemo(
    () =>
      kategoriOptions.map((k) => ({
        value: k.kodeKategori,
        label: k.namaKategori,
      })),
    [kategoriOptions],
  );

  const pjList = useMemo(
    () =>
      pjOptions.map((k) => ({
        value: k.id.toString(),
        label: k.namaPemilik,
      })),
    [pjOptions],
  );

  const subKategoriList = useMemo(
    () =>
      subKategoriOptions.map((s) => ({
        value: s.kodeSubKategori,
        label: s.namaSubKategori,
      })),
    [subKategoriOptions],
  );

  const kecamatanList = useMemo(
    () =>
      kecamatanOptions.map((kec) => ({
        value: kec.kodeKecamatan,
        label: kec.namaKecamatan,
      })),
    [kecamatanOptions],
  );

  const kelurahanList = useMemo(
    () =>
      kelurahanOptions.map((kel) => ({
        value: kel.kodeKelurahan,
        label: kel.namaKelurahan,
      })),
    [kelurahanOptions],
  );

  const petugasList = useMemo(
    () =>
      petugasOptions.map((petugas) => ({
        value: petugas.namaLengkap,
        label: petugas.namaLengkap,
      })),
    [petugasOptions],
  );

  const statusList = useMemo(
    () =>
      statusOptions?.map((statusOption) => ({
        value: statusOption.value,
        label:
          statusOption.label === "Approved"
            ? "Diterima"
            : statusOption.label === "Processed"
              ? "Diproses"
              : statusOption.label === "Rejected"
                ? "Ditolak"
                : "Selesai",
      })),
    [statusOptions],
  );

  const tahunList = useMemo(
    () =>
      tahunOptions.map((t) => ({
        value: t.value.toString(),
        label: t.label.toString(),
      })),
    [tahunOptions],
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
    if (tahun) params.tahun = tahun;
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

      router.get(route("pendaftar.wajib-retribusi.index"), params, {
        preserveState: true,
        replace: true,
        only: ["datas", "subKategoriOptions", "kelurahanOptions", "filters"],
        onFinish: () => setIsLoading(false),
      });
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
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
    tahun,
  ]);

  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
  };

  const handleKategoriChange = (val) => {
    setKategori(val);
    setSubKategori("");
    router.reload({
      only: ["subKategoriOptions"],
      data: { kategori: val },
      preserveState: true,
    });
  };

  return (
    <Layout title="WAJIB RETRIBUSI">
      <section className="h-[calc(100dvh_-_80px)] touch-pan-y overflow-auto p-3">
        <div className="mb-3 flex w-full flex-col items-center justify-between gap-2 rounded bg-white p-2 md:flex-row md:flex-wrap">
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <div className="flex w-full items-center gap-2 sm:w-max">
              <label
                htmlFor="showData"
                className="relative flex h-full w-full min-w-20 max-w-24 cursor-pointer items-center gap-1.5 text-sm"
              >
                <select
                  name="showData"
                  id="showData"
                  value={perPage}
                  onChange={handlePerPageChange}
                  className="h-full w-full cursor-pointer appearance-none rounded border bg-transparent px-2 py-1.5 shadow outline-none"
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
                onClick={() => {
                  const params = new URLSearchParams();

                  if (kecamatan) params.append("kecamatan", kecamatan);
                  if (perPage) params.append("per_page", perPage);
                  if (status) params.append("status", status);
                  if (tahun) params.append("tahun", tahun);

                  window.open(
                    route("wajib-retribusi.download-pdf") +
                      "?" +
                      params.toString(),
                    "_blank",
                  );
                }}
                className="rounded py-1.5 text-sm font-medium"
              >
                <Download size={20} />
              </button>
              <div className="relative flex h-full w-full gap-2 sm:w-max">
                <button
                  type="button"
                  className="flex w-full items-center gap-1.5 rounded border px-3 py-1.5 text-sm shadow sm:w-max"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => setShowFilters((prev) => !prev)}
                >
                  <Filter size={20} />
                  <span>Filter</span>
                </button>
                <div
                  ref={filterRef}
                  className={`absolute right-0 top-full z-20 grid w-max grid-cols-1 gap-2 rounded border border-neutral-300 bg-white p-3 shadow transition-all sm:left-0 sm:right-auto ${
                    showFilters
                      ? "pointer-events-auto mt-3 opacity-100"
                      : "pointer-events-none mt-0 opacity-0"
                  }`}
                >
                  <SearchableSelect
                    id="kategoriList"
                    options={kategoriList}
                    value={kategori}
                    onChange={handleKategoriChange}
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
                    id="petugasList"
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
                  <SearchableSelect
                    id="statusList"
                    options={statusList}
                    value={status}
                    onChange={(val) => setStatus(val)}
                    placeholder="Filter Berdasarkan Status"
                  />
                  <SearchableSelect
                    id="tahunList"
                    options={tahunList}
                    value={tahun}
                    onChange={(val) => setTahun(val)}
                    placeholder="Pilih Tahun"
                  />
                </div>
              </div>
            </div>
            <label
              htmlFor="search"
              className="flex w-full items-center gap-1.5 rounded border bg-white p-2 text-sm shadow md:max-w-80"
            >
              <Search className="min-w-5 max-w-20" />
              <input
                autoComplete="off"
                type="search"
                id="search"
                placeholder="Cari nama..."
                className="w-full flex-1 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-1.5 *:text-xs md:justify-start *:md:text-sm">
            <Link
              href={route("pendaftar.wajib-retribusi.create")}
              className="rounded bg-green-500 px-3 py-1.5 text-sm font-medium text-white"
            >
              Tambah
            </Link>
            <button
              onClick={() => {
                const params = new URLSearchParams();

                if (search) params.append("search", search);
                if (kategori) params.append("kategori", kategori);
                if (subKategori) params.append("sub-kategori", subKategori);
                if (kecamatan) params.append("kecamatan", kecamatan);
                if (kelurahan) params.append("kelurahan", kelurahan);
                if (petugas) params.append("petugas", petugas);
                if (status) params.append("status", status);
                if (tahun) params.append("tahun", tahun);

                window.open(
                  route("wajib-retribusi.download-pdf") +
                    "?" +
                    params.toString(),
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
                if (kecamatan) params.append("kecamatan", kecamatan);
                if (kelurahan) params.append("kelurahan", kelurahan);
                if (petugas) params.append("petugas", petugas);

                window.open(
                  route("wajib-retribusi.export") + "?" + params.toString(),
                  "_blank",
                );
              }}
              className="rounded bg-green-700 px-3 py-1.5 text-sm font-medium text-white"
            >
              Excel
            </button>
          </div>
        </div>
        <div
          className={`max-h-[calc(100%_-_230px)] overflow-auto rounded sm:max-h-[calc(100%_-_180px)] md:max-h-[calc(100%_-_210px)] lg:max-h-[calc(100%_-_150px)] ${!isLoading && "bg-white shadow"}`}
        >
          {isLoading ? (
            <div className="mb-2 flex h-16 items-center justify-center gap-2 bg-white px-2 text-sm text-gray-500 shadow">
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
                  />
                </thead>
                <tbody className="text-xs md:text-sm">
                  {(datas.data ?? datas)?.length > 0 ? (
                    (datas.data ?? datas).map((data, index) => (
                      <tr
                        key={data.id ?? index}
                        className={`*:p-2 ${index % 2 === 0 ? "bg-[#B3CEAF]" : "bg-white"}`}
                      >
                        <td className="text-center">
                          {((datas.current_page ?? 1) - 1) *
                            (datas.per_page ?? (datas.data ?? datas).length) +
                            index +
                            1}
                        </td>
                        {/* <td>{data.noPendaftaran}</td> */}
                        <td>{data.noWajibRetribusi ?? "-"}</td>
                        <td>{data.pemilik.namaPemilik}</td>
                        <td>{data.namaObjekRetribusi}</td>
                        <td>
                          <div className="w-72">{data.alamat}</div>
                        </td>
                        <td className="whitespace-nowrap">
                          {data.kelurahan.namaKelurahan}
                        </td>
                        <td className="whitespace-nowrap">
                          {data.kecamatan.namaKecamatan}
                        </td>
                        <td>{data.kategori.namaKategori}</td>
                        <td>{data.sub_kategori.namaSubKategori}</td>
                        <td className="whitespace-nowrap">
                          {data.uptd.namaUptd}
                        </td>
                        <td>{data.bulan ? `${data.bulan} Bulan` : "-"}</td>
                        <td>{data.bentukBadanUsaha ?? "-"}</td>
                        <td>
                          {data.jenisTarif === "tarif"
                            ? "Tarif 1"
                            : data.jenisTarif === "tarif2"
                              ? "Tarif 2"
                              : "-"}
                        </td>
                        <td>
                          <div className="w-max">
                            {data.keteranganBulan ?? "-"}
                          </div>
                        </td>
                        <td>{data.unit ?? "-"}</td>
                        <td>{data.m2 ?? "-"}</td>
                        <td>{data.giat ?? "-"}</td>
                        <td>{data.hari ?? "-"}</td>
                        <td>{data.meter ?? "-"}</td>
                        <td className="whitespace-nowrap">
                          {data.tanggalSkrd
                            ? new Date(data.tanggalSkrd).toLocaleDateString(
                                "id-ID",
                                {
                                  // day: "numeric",
                                  // month: "long",
                                  // year: "numeric"
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                },
                              )
                            : "-"}
                        </td>
                        <td>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(data.tarifPerbulan) || 0}
                        </td>
                        <td>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(data.tarifPertahun) || 0}
                        </td>
                        <td>{data.user.namaLengkap}</td>
                        <td>
                          <span
                            className={`select-none rounded py-2 font-medium ${
                              data.status === "Approved" &&
                              data.current_role != null
                                ? "text-sky-600"
                                : data.status == "Processed"
                                  ? "text-amber-500"
                                  : data.status == "Rejected"
                                    ? "text-red-500"
                                    : data.status === "Approved" &&
                                      data.current_role == null &&
                                      "text-green-500"
                            } ${
                              data.status === "Finished" &&
                              data.current_role === "ROLE_KABID" &&
                              "text-green-500"
                            }`}
                          >
                            {data.status === "Approved" &&
                              data.current_role != null &&
                              "Diterima"}
                            {data.status === "Processed" && "Diproses"}
                            {data.status === "Rejected" && "Ditolak"}
                            {data.status === "Approved" &&
                              data.current_role == null &&
                              "Selesai"}
                            {data.status === "Finished" &&
                              data.current_role === "ROLE_KABID" &&
                              "Selesai"}
                          </span>
                        </td>
                        <td
                          className={`sticky right-0 ${index % 2 === 0 ? "bg-[#B3CEAF]" : "bg-white"}`}
                        >
                          <div className="flex gap-2 *:rounded *:text-xs *:font-medium *:md:text-sm">
                            {/* <Link
                              href={route("super-admin.wajib-retribusi.edit", {
                                retribusi: data.noPendaftaran,
                              })}
                              className="flex items-center gap-1.5"
                            >
                              <PencilLine size={20} /> Edit
                            </Link> */}
                            <button className="flex items-center gap-1.5 whitespace-nowrap">
                              <FileText size={20} /> Form
                            </button>
                            {/* <button
                              onClick={(e) => {
                                e.stopPropagation();

                                window.open(
                                  route(
                                    "super-admin.wajib-retribusi.export-single",
                                    { id: data.id },
                                  ),
                                  "_blank",
                                );
                              }}
                              className="flex items-center gap-1.5 whitespace-nowrap"
                            >
                              <FileText size={20} /> Excel
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="13"
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

        {!isLoading && <SmartPagination datas={datas} filters={filters} />}
      </section>
    </Layout>
  );
};

export default Index;
