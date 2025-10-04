import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../../Layout";
import { router } from "@inertiajs/react";

import { ChevronDown, Filter, Search } from "lucide-react";
import SearchableSelect from "@/Components/SearchableSelect";
import SmartPagination from "@/Components/SmartPagination";
import Table from "@/Components/WajibRetribusi/Table";

const Diproses = ({
  datas,
  filters,
  pjOptions = [],
  kategoriOptions = [],
  subKategoriOptions = [],
  kelurahanOptions = [],
  tahunOptions = [],
  user = "ROLE_KUPTD",
}) => {
  const [search, setSearch] = useState(filters.search || "");
  const [sort, setSort] = useState(filters.sort || null);
  const [direction, setDirection] = useState(filters.direction || null);
  const [kategori, setKategori] = useState(filters.kategori || "");
  const [subKategori, setSubKategori] = useState(filters.subKategori || "");
  const [kecamatan, setKecamatan] = useState(filters.kecamatan || "");
  const [kelurahan, setKelurahan] = useState(filters.kelurahan || "");
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
    {
      key: "tanggalSkrd",
      label: "tanggal spkrd",
      align: "text-left truncate",
    },
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
      kategoriOptions?.map((k) => ({
        value: k.kodeKategori,
        label: k.namaKategori,
      })),
    [kategoriOptions],
  );

  const pjList = useMemo(
    () =>
      pjOptions?.map((k) => ({
        value: k.id.toString(),
        label: k.namaPemilik,
      })),
    [pjOptions],
  );

  const subKategoriList = useMemo(
    () =>
      subKategoriOptions?.map((s) => ({
        value: s.kodeSubKategori,
        label: s.namaSubKategori,
      })),
    [subKategoriOptions],
  );

  const kelurahanList = useMemo(
    () =>
      kelurahanOptions.map((kel) => ({
        value: kel.kodeKelurahan,
        label: kel.namaKelurahan,
      })),
    [kelurahanOptions],
  );

  const buildParams = (additionalParams = {}) => {
    const params = { ...additionalParams };

    if (search && search.trim() !== "") params.search = search;
    if (pj) params.pj = pj;
    if (kategori) params.kategori = kategori;
    if (subKategori) params["sub-kategori"] = subKategori;
    // if (kecamatan) params.kecamatan = kecamatan;
    if (kelurahan) params.kelurahan = kelurahan;
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

      router.get(route("kuptd.wajib-retribusi.diproses"), params, {
        preserveState: true,
        replace: true,
        only: [
          "datas",
          "pjOptions",
          "subKategoriOptions",
          "kelurahanOptions",
          "filters",
        ],
        onFinish: () => setIsLoading(false),
      });
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      setIsLoading(false);
    };
  }, [
    search,
    sort,
    direction,
    kategori,
    subKategori,
    kecamatan,
    kelurahan,
    perPage,
    status,
    pj,
    tahun,
  ]);

  return (
    <Layout title="INBOX DIPROSES">
      <section className="h-[calc(100dvh_-_80px)] touch-pan-y overflow-auto p-3">
        <div className="mb-3 flex w-full flex-col justify-between gap-3 rounded bg-white p-2 shadow lg:flex-row lg:items-center">
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:items-center">
            <div className="flex w-full items-center gap-2 sm:w-max">
              <div className="relative flex w-full gap-2 sm:w-max">
                <label
                  htmlFor="showData"
                  className="relative flex h-full w-full min-w-20 max-w-24 cursor-pointer items-center gap-1.5 text-sm"
                >
                  <select
                    name="showData"
                    id="showData"
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(parseInt(e.target.value));
                    }}
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
                    id="kecamatanlist"
                    options={kecamatanList}
                    value={kecamatan}
                    onChange={(val) => {
                      setKecamatan(val);
                      setKelurahan("");
                    }}
                    placeholder="Pilih Kecamatan"
                  /> */}
                  <SearchableSelect
                    id="kelurahanlist"
                    options={kelurahanList}
                    value={kelurahan}
                    onChange={(val) => setKelurahan(val)}
                    placeholder="Pilih Kelurahan"
                    disabled={!kecamatan}
                  />
                  <SearchableSelect
                    id="pjlist"
                    options={pjList}
                    value={pj}
                    onChange={(val) => setpj(val)}
                    placeholder="Pilih Penanggung Jawab"
                  />
                  <SearchableSelect
                    id="tahunList"
                    options={tahunOptions}
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
            <button
              onClick={() => {
                const params = new URLSearchParams();

                if (search) params.append("search", search);
                if (kategori) params.append("kategori", kategori);
                if (subKategori) params.append("sub-kategori", subKategori);
                if (kecamatan) params.append("kecamatan", kecamatan);
                if (kelurahan) params.append("kelurahan", kelurahan);

                params.append("status", "Processed");

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

                params.append("status", "Processed");

                window.open(
                  route("wajib-retribusi.export") + "?" + params.toString(),
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
              <Table
                search={search}
                datas={datas}
                columns={columns}
                sort={sort}
                setSort={setSort}
                direction={direction}
                setDirection={setDirection}
                isLoading={isLoading}
                role={user}
              />
            </>
          )}
        </div>

        {!isLoading && <SmartPagination datas={datas} filters={filters} />}
      </section>
    </Layout>
  );
};

export default Diproses;
