import { ChevronDown, Filter, PencilLine, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useProvider } from "@/Context/GlobalContext";
import SmartPagination from "@/Components/SmartPagination";
import TableHead from "@/Components/TableHead";
import { router } from "@inertiajs/react";
import DialogForm from "./DialogForm";
import SearchableSelect from "@/Components/SearchableSelect";

const PemohonIndex = ({
  datas,
  filters,
  kecamatanOptions = [],
  kelurahanOptions = [],
  kelurahanFilter = [],
  role = null,
}) => {
  const { modalState, openModal, closeModal } = useProvider();
  const [search, setSearch] = useState(filters.search || "");
  const [sort, setSort] = useState(filters.sort || null);
  const [direction, setDirection] = useState(filters.direction || null);
  const [kecamatan, setKecamatan] = useState(filters.kecamatan || "");
  const [kelurahan, setKelurahan] = useState(filters.kelurahan || "");
  const [perPage, setPerPage] = useState(() => {
    return filters.per_page && filters.per_page !== 10 ? filters.per_page : 10;
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const filterRef = useRef(null);

  const roleConfig = {
    ROLE_SUPERADMIN: "super-admin",
    ROLE_PENDAFTAR: "pendaftar",
  };

  const routeConfig = roleConfig[role];

  const columns = [
    { key: "id", label: "No", align: "text-left" },
    { key: "nik", label: "NIK", align: "text-left" },
    { key: "namaPemilik", label: "Nama Pemilik", align: "text-left" },
    { key: "alamat", label: "Alamat", align: "text-left" },
    { key: "kodeKelurahan", label: "Kelurahan", align: "text-left" },
    { key: "kodeKecamatan", label: "Kecamatan", align: "text-left" },
    { key: "tempatLahir", label: "Tempat Lahir", align: "text-left" },
    { key: "tanggalLahir", label: "Tanggal Lahir", align: "text-left" },
    { key: "noHp", label: "Nomor Hp", align: "text-left" },
    { key: "email", label: "Email", align: "text-left" },
    // { key: "jabatan", label: "Jabatan", align: "text-left" },
    { key: "created_at", label: "create date", align: "text-left" },
  ];

  const buildParams = (additionalParams = {}) => {
    const params = { ...additionalParams };

    if (search && search.trim() !== "") params.search = search;
    if (kecamatan) params.kecamatan = kecamatan;
    if (kelurahan) params.kelurahan = kelurahan;
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

      router.get(route(`${routeConfig}.pemohon.index`), params, {
        preserveState: true,
        replace: true,
        only: ["datas", "kecamatanOptions", "kelurahanFilter", "filters"],
        onFinish: () => setIsLoading(false),
      });
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      setIsLoading(false);
    };
  }, [search, sort, direction, kecamatan, kelurahan, perPage]);

  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
  };

  const allFilters = {
    search: search || filters.search,
    sort: sort || filters.sort,
    direction: direction || filters.direction,
  };

  return (
    <>
      <section className="h-[calc(100dvh_-_80px)] touch-pan-y overflow-auto p-3">
        <div className="mb-3 flex w-full flex-col justify-between gap-3 rounded bg-white p-2 shadow lg:flex-row lg:items-center">
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:items-center">
            <div className="flex w-full items-center gap-2 sm:w-max">
              <div className="relative flex w-full gap-2 sm:w-max">
                <label
                  htmlFor="showData"
                  className="relative flex w-full min-w-20 max-w-24 cursor-pointer items-center gap-1.5 text-sm"
                >
                  <select
                    name="showData"
                    id="showData"
                    value={perPage}
                    onChange={handlePerPageChange}
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
                    id="kecamatanList"
                    options={kecamatanOptions}
                    value={kecamatan}
                    onChange={(val) => {
                      setKecamatan(val);
                    }}
                    placeholder="Pilih Kecamatan"
                  />
                  <SearchableSelect
                    id="kelurahanList"
                    options={kelurahanFilter}
                    value={kelurahan}
                    onChange={(val) => {
                      setKelurahan(val);
                    }}
                    placeholder="Pilih Kelurahan"
                    disabled={!kecamatan}
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
          <div className="flex w-full flex-row gap-2 md:w-max">
            {role === "ROLE_PENDAFTAR" && (
              <button
                onClick={() => {
                  openModal("create");
                }}
                className="flex-0 order-2 flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded bg-green-500 px-3 py-2 text-sm text-white outline-none md:order-1 md:w-auto"
              >
                <span>Tambah Data</span>
              </button>
            )}
            <button
              onClick={() => {
                const params = new URLSearchParams();

                if (search) params.append("search", search);
                if (perPage && perPage !== 10)
                  params.append("per_page", perPage);

                window.open(
                  route("export-pemohon") + "?" + params.toString(),
                  "_blank",
                );
              }}
              className="order-1 flex w-full flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded bg-green-700 px-5 py-2 text-sm text-white outline-none md:order-2 md:w-auto md:px-3"
            >
              <span>Excel</span>
            </button>
          </div>
        </div>

        <div
          className={`max-h-[calc(100%_-_230px)] overflow-auto rounded sm:max-h-[calc(100%_-_180px)] md:max-h-[calc(100%_-_200px)] lg:max-h-[calc(100%_-_150px)] ${!isLoading && "shadow"}`}
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
                <thead className="truncate">
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
                <tbody className="divide-y divide-neutral-300 text-xs md:text-sm">
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
                        <td>{data.nik}</td>
                        <td>{data.namaPemilik}</td>
                        <td>
                          <div className="w-72">{data.alamat}</div>
                        </td>
                        <td className="whitespace-nowrap">
                          {data.kelurahan.namaKelurahan}
                        </td>
                        <td>
                          <div className="w-max whitespace-nowrap">
                            {data.kecamatan.namaKecamatan}
                          </div>
                        </td>
                        <td>{data.tempatLahir}</td>
                        <td>
                          {data.tanggalLahir &&
                            new Date(data.tanggalLahir)
                              .toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                              .replace(/\//g, "-")}
                        </td>

                        <td className="whitespace-nowrap">
                          {data.noHP ?? "-"}
                        </td>
                        <td className="whitespace-nowrap">
                          {data.email ?? "-"}
                        </td>
                        {/* <td>{data.jabatan ?? "-"}</td> */}
                        <td className="truncate">
                          {data.created_at &&
                            new Date(data.created_at)
                              .toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                              .replace(/\//g, "-")}
                        </td>
                        <td
                          className={`sticky right-0 space-x-1 text-right md:space-x-2 ${index % 2 === 0 ? "bg-[#B3CEAF]" : "bg-white"}`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              openModal("edit", data);
                            }}
                            className="rounded-full p-1 outline-none transition-all duration-300 hover:bg-neutral-300"
                          >
                            <PencilLine size={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="12"
                        className="py-8 text-center text-gray-500"
                      >
                        {search
                          ? "Tidak ada data yang ditemukan untuk pencarian tersebut"
                          : "Belum ada data Pemohon"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>

        {!isLoading && datas?.links && (
          <SmartPagination datas={datas} filters={allFilters} />
        )}
      </section>
      <DialogForm
        isOpen={modalState.type === "create" || modalState.type === "edit"}
        onClose={closeModal}
        pemohon={modalState.data}
        mode={modalState.type}
        kecamatanOptions={kecamatanOptions}
        kelurahanOptions={kelurahanOptions}
        role={role}
      />
    </>
  );
};

export default PemohonIndex;
