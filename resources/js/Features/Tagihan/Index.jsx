import { useProvider } from "@/Context/GlobalContext";
import { FileText, Search, PencilLine, ChevronDown } from "lucide-react";
import DialogForm from "./DialogForm";
import { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import TableHead from "@/Components/TableHead";
import SmartPagination from "@/Components/SmartPagination";

const Index = ({ datas, filters, retribusiOptions = [], role }) => {
  const { modalState, openModal, closeModal } = useProvider();
  const [search, setSearch] = useState(filters.search || "");
  const [sort, setSort] = useState(filters.sort || "");
  const [direction, setDirection] = useState(filters.direction || null);
  const [perPage, setPerPage] = useState(() => {
    return filters.per_page && filters.per_page !== 10 ? filters.per_page : 10;
  });
  const [isLoading, setIsLoading] = useState(false);

  const roleConfig = {
    ROLE_SUPERADMIN: "super-admin",
    ROLE_KUPTD: "kuptd",
    ROLE_KASUBAG_TU_UPDT: "kasubag",
    ROLE_BENDAHARA: "bendahara",
  };

  const routeConfig = roleConfig[role];

  const columns = [
    { key: "id", label: "no", align: "text-left" },
    {
      key: "tanggal_terbit",
      label: "tanggal invoice",
      align: "text-center truncate",
    },
    { key: "no_invoice", label: "no invoice", align: "text-left truncate" },
    {
      key: "noSkrd",
      label: "no spkrd",
      align: "text-left truncate",
    },
    {
      key: "namaObjekRetribusi",
      label: "nama wajib retribusi",
      align: "text-left truncate",
    },
    {
      key: "alamatObjekRetribusi",
      label: "alamat",
      align: "text-left truncate",
    },
    {
      key: "kelurahanObjekRetribusi",
      label: "kelurahan",
      align: "text-left truncate",
    },
    {
      key: "kecamatanObjekRetribusi",
      label: "kecamatan",
      align: "text-left truncate",
    },
    {
      key: "jumlah_bulan",
      label: "jumlah bulan",
      align: "text-center truncate",
    },
    { key: "satuan", label: "keterangan bulan", align: "text-left truncate" },
    {
      key: "tagihanPerBulanSkrd",
      label: "tarif retribusi",
      align: "text-left truncate",
    },
    {
      key: "total_retribusi",
      label: "total retribusi",
      align: "text-left truncate",
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const params = {};

      if (search && search.trim() !== "") params.search = search;
      if (perPage && perPage !== 10) params.per_page = perPage;
      if (sort && sort !== filters.sort) params.sort = sort;
      if (direction && direction !== filters.direction)
        params.direction = direction;

      router.get(route(`${routeConfig}.surat-tagihan.index`), params, {
        preserveState: true,
        replace: true,
        only: ["datas"],
        onFinish: () => setIsLoading(false),
      });
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      setIsLoading(false);
    };
  }, [search, sort, direction, perPage]);

  const allFilters = {
    search: search || filters.search,
    sort: sort || filters.sort,
    direction: direction || filters.direction,
  };

  return (
    <>
      <Head title="Data Surat Tagihan" />
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
                placeholder="Cari nama"
                className="flex-1 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-1.5 md:justify-start">
            {role !== "ROLE_BENDAHARA" && (
              <button
                onClick={() => {
                  openModal("create");
                }}
                className="rounded bg-green-500 px-3 py-1.5 text-sm font-medium text-white"
              >
                Tambah
              </button>
            )}
            <button className="rounded bg-red-500 px-3 py-1.5 text-sm font-medium text-white">
              <span>PDF</span>
            </button>
            <button className="rounded bg-green-700 px-3 py-1.5 text-sm font-medium text-white">
              <span>Excel</span>
            </button>
          </div>
        </div>
        <div
          className={`max-h-[calc(100%_-_230px)] overflow-auto rounded ${!isLoading && "shadow"}`}
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
              <table className="min-w-full divide-y divide-gray-300 bg-white p-3">
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
                        <td>
                          {data.tanggal_terbit
                            ? new Date(data.tanggal_terbit).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                },
                              )
                            : "-"}
                        </td>
                        <td>{data.no_invoice}</td>
                        <td>{data.noSkrd}</td>
                        <td>
                          <div className="w-60">
                            {data.skrd.namaObjekRetribusi}
                          </div>
                        </td>
                        <td>
                          <div className="w-72">
                            {data.skrd.alamatObjekRetribusi}
                          </div>
                        </td>
                        <td className="whitespace-nowrap">
                          {data.skrd.kelurahanObjekRetribusi}
                        </td>
                        <td className="whitespace-nowrap">
                          {data.skrd.kecamatanObjekRetribusi}
                        </td>
                        <td className="text-center">
                          {data.jumlah_bulan
                            ? `${data.jumlah_bulan} Bulan`
                            : "-"}
                        </td>
                        <td>{data.satuan}</td>
                        <td>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(data.skrd.tagihanPerBulanSkrd)}
                        </td>
                        <td>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(data.total_retribusi)}
                        </td>
                        <td
                          className={`sticky right-0 text-right ${index % 2 === 0 ? "bg-[#B3CEAF]" : "bg-white"}`}
                        >
                          <div className="flex flex-col gap-2 *:rounded *:text-sm *:font-medium">
                            {role === "ROLE_SUPERADMIN" && (
                              <button
                                type="button"
                                onClick={() => {
                                  openModal("edit", data);
                                }}
                                className="inline-flex items-center gap-1.5"
                              >
                                <PencilLine className="size-5" /> Edit
                              </button>
                            )}
                            <a
                              href={route("invoice.pdf", {
                                id: data.no_invoice,
                              })}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5"
                            >
                              <FileText className="size-5" /> PDF
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={13}
                        className="py-8 text-center text-gray-500"
                      >
                        {search
                          ? "Tidak ada data yang ditemukan untuk pencarian tersebut"
                          : "Belum ada data surat tagihan"}
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

      <DialogForm
        isOpen={modalState.type === "create" || modalState.type === "edit"}
        onClose={closeModal}
        mode={modalState.type}
        invoice={modalState.data}
        retribusiOptions={retribusiOptions}
        role={role}
      />
    </>
  );
};

export default Index;
