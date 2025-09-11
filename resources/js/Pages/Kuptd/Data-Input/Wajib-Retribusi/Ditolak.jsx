import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../../Layout";
import { router } from "@inertiajs/react";

import { Filter, Search } from "lucide-react";
import SearchableSelect from "@/Components/SearchableSelect";
import SmartPagination from "@/Components/SmartPagination";
import Table from "@/Components/WajibRetribusi/Table";

const Ditolak = ({
  datas,
  filters,
  pjOptions = [],
  kategoriOptions = [],
  subKategoriOptions = [],
  kecamatanOptions = [],
  kelurahanOptions = [],
}) => {
  const [search, setSearch] = useState(filters.search || "");
  const [sort, setSort] = useState(filters.sort || null);
  const [direction, setDirection] = useState(filters.direction || null);
  const [kategori, setKategori] = useState(filters.kategori || "");
  const [subKategori, setSubKategori] = useState(filters.subKategori || "");
  const [kecamatan, setKecamatan] = useState(filters.kecamatan || "");
  const [kelurahan, setKelurahan] = useState(filters.kelurahan || "");
  const [showFilters, setShowFilters] = useState(false);
  const [pj, setpj] = useState(filters.pj || "");
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
    { key: "uptd", label: "uptd", align: "text-left truncate" },
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
    { key: "keterangan", label: "keterangan", align: "text-left" },
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

  const buildParams = (additionalParams = {}) => {
    const params = { ...additionalParams };

    if (search && search.trim() !== "") params.search = search;
    if (pj) params.pj = pj;
    if (kategori) params.kategori = kategori;
    if (subKategori) params["sub-kategori"] = subKategori;
    // if (kecamatan) params.kecamatan = kecamatan;
    if (kelurahan) params.kelurahan = kelurahan;
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

      router.get(route("kuptd.wajib-retribusi.ditolak"), params, {
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
    pj,
  ]);

  return (
    <Layout title="INBOX DITOLAK">
      <section className="h-[calc(100dvh_-_80px)] touch-pan-y overflow-auto p-3">
        <div className="mb-3 flex w-full flex-col justify-between gap-3 rounded bg-white p-2 shadow lg:flex-row lg:items-center">
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:items-center">
            <div className="flex w-full items-center gap-2 sm:w-max">
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
                </div>
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
                if (kecamatan) params.append("kecamatan", kecamatan);
                if (kelurahan) params.append("kelurahan", kelurahan);

                params.append("status", "Approved");

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

                params.append("status", "Approved");

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
          className={`max-h-[calc(100%_-_180px)] overflow-auto rounded ${!isLoading && "shadow"}`}
        >
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
              <Table
                datas={datas}
                columns={columns}
                sort={sort}
                setSort={setSort}
                direction={direction}
                setDirection={setDirection}
                isLoading={isLoading}
                role="ROLE_KUPTD"
              />
            </>
          )}
        </div>

        {!isLoading && <SmartPagination datas={datas} filters={filters} />}
      </section>
    </Layout>
  );
};

export default Ditolak;
