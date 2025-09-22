import {
  ChevronDown,
  Currency,
  Filter,
  ReceiptText,
  Search,
} from "lucide-react";
import Layout from "../../Layout";
import SearchableSelect from "@/Components/SearchableSelect";
import TableHead from "@/Components/TableHead";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

const DataSetoran = ({ datas, filters, skrdOptions = [] }) => {
  const [search, setSearch] = useState(filters.search || "");
  const [sort, setSort] = useState(filters.sort || null);
  const [direction, setDirection] = useState(filters.direction || null);
  const [perPage, setPerPage] = useState(() => {
    return filters.per_page && filters.per_page !== 10 ? filters.per_page : 10;
  });
  const [skrd, setSkrd] = useState(filters.skrd || "");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    { key: "nomorNota", label: "nomor nota", align: "text-left" },
    { key: "noSkrd", label: "nomor skrd", align: "text-left" },
    {
      key: "namaObjekRetribusi",
      label: "nama objek retribusi",
      align: "text-left",
    },
    { key: "metodeBayar", label: "metode setor", align: "text-center" },
    { key: "namaBank", label: "nama bank", align: "text-center" },
    { key: "tanggalBayar", label: "tanggal bayar", align: "text-left" },
    { key: "jumlahBayar", label: "jumlah setor", align: "text-left" },
    { key: "jumlahBulan", label: "jumlah bulan", align: "text-left" },
    { key: "noRef", label: "nomor referensi", align: "text-left" },
    { key: "namaPenyetor", label: "pengirim / penyetor", align: "text-left" },
    { key: "keteranganBulan", label: "ket. bulan bayar", align: "text-left" },
    { key: "buktiBayar", label: "bukti setor", align: "text-left" },
    // { key: "namaPemilik", label: "Nama Pemilik", align: "text-left" },
    // { key: "alamat", label: "Alamat", align: "text-left" },
    // { key: "kodeKelurahan", label: "Kelurahan", align: "text-left" },
    // { key: "kodeKecamatan", label: "Kecamatan", align: "text-left" },
    // { key: "tempatLahir", label: "Tempat Lahir", align: "text-left" },
    // { key: "tanggalLahir", label: "Tanggal Lahir", align: "text-left" },
    // { key: "noHp", label: "Nomor Hp", align: "text-left" },
    // { key: "email", label: "Email", align: "text-left" },
    // // { key: "jabatan", label: "Jabatan", align: "text-left" },
    // { key: "created_at", label: "create date", align: "text-left" },
  ];
  const buildParams = (additionalParams = {}) => {
    const params = { ...additionalParams };

    if (search && search.trim() !== "") params.search = search;
    if (skrd) params.skrd = skrd;
    if (perPage && perPage !== 10) params.per_page = perPage;
    if (sort && sort !== "nomorNota") {
      params.sort = sort;
      if (direction && direction.toLowerCase() === "asc") {
        params.direction = "asc";
      }
    } else if (
      sort === "nomorNota" &&
      direction &&
      direction.toLowerCase() === "asc"
    ) {
      params.sort = sort;
      params.direction = "asc";
    }

    return params;
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = buildParams();

      router.get(route("super-admin.data-setoran.index"), params, {
        preserveState: true,
        replace: true,
        only: ["datas", "skrdOptions", "bankOptions"],
      });
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search, sort, direction, skrd, perPage]);

  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
  };

  return (
    <Layout title="Data Setoran">
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
                  // ref={filterRef}
                  className={`absolute right-0 top-full z-20 grid w-max grid-cols-1 gap-2 rounded border border-neutral-300 bg-white p-3 shadow transition-all sm:left-0 sm:right-auto ${
                    showFilters
                      ? "pointer-events-auto mt-3 opacity-100"
                      : "pointer-events-none mt-0 opacity-0"
                  }`}
                >
                  <SearchableSelect
                    id="skrdList"
                    // options={kategoriList}
                    // value={kategori}
                    // onChange={handleKategoriChange}
                    placeholder="Pilih Nomor SPKRD"
                  />
                  <SearchableSelect
                    id="namaBank"
                    // options={kategoriList}
                    // value={kategori}
                    // onChange={handleKategoriChange}
                    placeholder="Pilih Nama Bank"
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
                placeholder="Cari Nomor Nota..."
                className="flex-1 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>
          <div className="flex w-full flex-row gap-2 md:w-max">
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
              className="rounded bg-green-700 px-3 py-1.5 text-sm font-medium text-white transition duration-300"
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
              <tbody>
                {(datas.data ?? datas)?.length > 0 ? (
                  (datas.data ?? datas).map((data, index) => (
                    <tr
                      key={data.id ?? index}
                      className={`*:p-2 ${index % 2 === 0 ? "bg-[#B3CEAF]" : "bg-white"}`}
                    >
                      <td className="whitespace-nowrap text-xs md:text-sm">
                        {data.nomorNota}
                      </td>
                      <td className="text-xs md:text-sm">{data.skrd.noSkrd}</td>
                      <td className="text-xs md:text-sm">
                        <div className="max-w-72">
                          {data.skrd.namaObjekRetribusi}
                        </div>
                      </td>
                      <td className="text-center text-xs md:text-sm">
                        {data.metodeBayar}
                      </td>
                      <td className="text-center text-xs md:text-sm">
                        {data.namaBank}
                      </td>
                      <td className="text-center text-xs md:text-sm">
                        {data.tanggalBayar
                          ? new Date(data.tanggalBayar).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </td>
                      <td className="text-xs md:text-sm">
                        {Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(data.jumlahBayar)}
                      </td>
                      <td className="text-center text-xs md:text-sm">
                        {data.jumlahBulan} Bulan
                      </td>
                      <td className="text-xs md:text-sm">{data.noRef}</td>
                      <td className="text-xs md:text-sm">
                        {data.namaPenyetor}
                      </td>
                      <td className="text-xs md:text-sm">
                        {data.keteranganBulan}
                      </td>
                      <td className="text-center text-xs md:text-sm">
                        <a
                          href={route("super-admin.bukti-bayar", {
                            filename: data.buktiBayar,
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-center font-semibold text-amber-600 hover:underline"
                        >
                          Bukti Bayar
                        </a>
                      </td>
                      <td
                        className={`sticky right-0 space-x-1 text-right md:space-x-2 ${index % 2 === 0 ? "bg-[#B3CEAF]" : "bg-white"}`}
                      >
                        {/* <Link href={route("super-admin.data-setoran.show", {
                          data: data
                        })}>
                          <ReceiptText size={20} />
                        </Link> */}
                        <a
                          href={route("super-admin.data-setoran.show", {
                            data: data.nomorNota,
                          })}
                        >
                          <ReceiptText size={20} />
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="12"
                      className="py-8 text-center text-xs text-gray-500 md:text-sm"
                    >
                      {search
                        ? "Tidak ada data yang ditemukan untuk pencarian tersebut"
                        : "Belum ada data setoran"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default DataSetoran;
