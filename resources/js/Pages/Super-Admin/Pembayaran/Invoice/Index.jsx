import Layout from "../../Layout";
import { useProvider } from "@/Context/GlobalContext";
import { FileText, Search } from "lucide-react";
import DialogForm from "./DialogForm";
import { useEffect, useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import TableHead from "@/Components/TableHead";
import SmartPagination from "@/Components/SmartPagination";

const Index = ({ datas, filters, retribusiOptions = [] }) => {
  const { modalState, openModal, closeModal } = useProvider();
  const [search, setSearch] = useState(filters.search || "");
  const [sort, setSort] = useState(filters.sort || "");
  const [direction, setDirection] = useState(filters.direction || "asc");
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    { key: "id", label: "no", align: "text-left" },
    { key: "no_invoice", label: "no invoice", align: "text-center truncate" },
    {
      key: "noWajibRetribusi",
      label: "no wajib retribusi",
      align: "text-center truncate",
    },
    {
      key: "namaObjekRetribusi",
      label: "nama wajib retribusi",
      align: "text-left truncate",
    },
    {
      key: "alamatObjekRetribusi",
      label: "alamat layanan",
      align: "text-left truncate",
    },
    {
      key: "jumlah_bulan",
      label: "jumlah bulan",
      align: "text-center truncate",
    },
    { key: "satuan", label: "satuan", align: "text-left" },
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
      if (sort && sort !== filters.sort) params.sort = sort;
      if (direction && direction !== filters.direction)
        params.direction = direction;

      router.get(route("super-admin.invoice.index"), params, {
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
  }, [search, sort, direction]);

  const allFilters = {
    search: search || filters.search,
    sort: sort || filters.sort,
    direction: direction || filters.direction,
  };

  return (
    <Layout title="Invoice">
      <section className="p-3">
        <div className="mb-3 flex w-full flex-col gap-3 rounded bg-white p-2 lg:flex-row lg:items-start lg:items-center lg:justify-between">
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
          <div className="flex flex-wrap items-center justify-end gap-1.5 md:justify-start">
            <button
              onClick={() => {
                openModal("create");
              }}
              className="rounded bg-green-500 px-3 py-1.5 text-sm font-medium text-white"
            >
              Tambah
            </button>
            <button className="rounded bg-red-500 px-3 py-1.5 text-sm font-medium text-white">
              <span>PDF</span>
            </button>
            <button className="rounded bg-green-700 px-3 py-1.5 text-sm font-medium text-white">
              <span>Excel</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded bg-white shadow">
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
                  />
                </thead>
                <tbody className="divide-y divide-neutral-300 text-xs md:text-sm">
                  {isLoading ? (
                    <tr></tr>
                  ) : datas?.data?.length > 0 ? (
                    datas.data.map((data, index) => (
                      <tr
                        key={data.id || index}
                        className={`*:truncate *:p-2 ${
                          index % 2 === 0 ? "bg-[#F7FBFE]" : ""
                        }`}
                      >
                        <td className="text-center">
                          {(datas.current_page - 1) * datas.per_page +
                            index +
                            1}
                        </td>
                        <td>{data.no_invoice}</td>
                        <td>{data.skrd.noWajibRetribusi}</td>
                        <td>{data.skrd.namaObjekRetribusi}</td>
                        <td>{data.skrd.alamatObjekRetribusi}</td>
                        <td className="text-center">{data.jumlah_bulan}</td>
                        <td>{data.satuan}</td>
                        <td>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(data.skrd.tagihanPerBulanSkrd)}
                        </td>
                        <td>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(data.total_retribusi)}
                        </td>
                        <td className="text-right">
                          <a
                            href={route("super-admin.invoice.pdf", {
                              filename: data.file,
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5"
                          >
                            <FileText size={20} /> PDF
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={10}
                        className="py-8 text-center text-gray-500"
                      >
                        {search
                          ? "Tidak ada data yang ditemukan untuk pencarian tersebut"
                          : "Belum ada data invoice"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
        {!isLoading && <SmartPagination datas={datas} filters={filters}/>}
      </section>

      <DialogForm
        isOpen={modalState.type === "create" || modalState.type === "edit"}
        onClose={closeModal}
        mode={modalState.type}
        invoice={modalState.data}
        retribusiOptions={retribusiOptions}
      />
    </Layout>
  );
};

export default Index;
