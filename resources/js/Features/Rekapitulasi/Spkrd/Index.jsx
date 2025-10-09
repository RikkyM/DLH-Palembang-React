import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import TableHead from "@/Components/TableHead";
import SmartPagination from "@/Components/SmartPagination";

const Index = ({ datas, filters }) => {
  const [startDate, setStartDate] = useState(filters.tanggal_mulai ?? "");
  const [endDate, setEndDate] = useState(filters.tanggal_akhir ?? "");
  const [sort, setSort] = useState(filters.sort || null);
  const [direction, setDirection] = useState(filters.direction || null);
  const [perPage, setPerPage] = useState(() => {
    return filters.per_page && filters.per_page !== 10 ? filters.per_page : 10;
  });
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    { key: "id", label: "No", align: "text-center w-10" },
    { key: "namaKategori", label: "Kategori", align: "text-left" },
    { key: "namaSubKategori", label: "Sub Kategori", align: "text-left" },
    { key: "jumlah", label: "Jumlah", align: "text-center" },
  ];

  const buildParams = (additionalParams = {}) => {
    const params = { ...additionalParams };

    if (perPage && perPage !== 10) params.per_page = perPage;
    if (startDate) params.tanggal_mulai = startDate;
    if (endDate) params.tanggal_akhir = endDate;
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
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const params = buildParams();

      router.get(route(`super-admin.rekapitulasi.spkrd`), params, {
        preserveState: true,
        replace: true,
        only: ["datas", "filters"],
        onFinish: () => setIsLoading(false),
      });
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      setIsLoading(false);
    };
  }, [sort, direction, perPage]);

  const onSubmitFilter = (e) => {
    e.preventDefault();
    const params = buildParams();

    setIsLoading(true);
    router.get(
      route("super-admin.rekapitulasi.spkrd"),
      {
        ...params,
        tanggal_mulai: startDate || undefined,
        tanggal_akhir: endDate || undefined,
      },
      {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => setIsLoading(false),
      },
    );
    {
    }
  };

  const openDetail = (data) => {
    console.log(data);

    const params = {
      tanggal_mulai: startDate || filters.tanggal_mulai || "",
      tanggal_akhir: endDate || filters.tanggal_akhir || "",
      kategori: data.namaKategori,
      sub_kategori: data.namaSubKategori,
    };

    router.get(route("super-admin.rekapitulasi.spkrd.detail"), params, {
      preserveScroll: true,
      replace: false,
    });
  };

  const allFilters = {
    sort: sort || filters.sort,
    direction: direction || filters.direction,
    tanggal_mulai: startDate || filters.tanggal_mulai,
    tanggal_akhir: endDate || filters.tanggal_akhir,
  };

  return (
    <>
      <Head title="Rekapitulasi SPKRD" />
      <section className="h-[calc(100dvh_-_80px)] touch-pan-y overflow-auto p-3">
        <div className="mb-3 flex w-full flex-col justify-between gap-3 rounded bg-white p-2 shadow lg:flex-row lg:items-center">
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:items-center">
            <form
              onSubmit={onSubmitFilter}
              className="grid h-full w-full grid-cols-1 gap-2 sm:w-max md:grid-cols-3"
            >
              <div className="space-y-2 rounded text-sm">
                <label htmlFor="tanggal_mulai">Tanggal Mulai</label>
                <input
                  type="date"
                  id="tanggal_mulai"
                  className="h-10 w-full rounded border bg-white p-2 shadow"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2 rounded text-sm">
                <label htmlFor="tanggal_akhir">Tanggal Akhir</label>
                <input
                  type="date"
                  id="tanggal_akhir"
                  className="h-10 w-full rounded border bg-white p-2 shadow"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex items-end text-sm">
                <button
                  disabled={isLoading}
                  className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-black px-4 py-2 text-white"
                >
                  Proses
                </button>
              </div>
            </form>
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
                <tbody>
                  {(datas.data ?? datas)?.length > 0 ? (
                    (datas.data ?? datas).map((data, i) => (
                      <tr
                        key={data.id ?? i}
                        className={`*:p-2 ${i % 2 === 0 ? "bg-[#B3CEAF]" : "bg-white"}`}
                        // onClick={() => openDetail(data)}
                      >
                        <td className="text-left">
                          <div className="w-10 text-center">
                            {((datas.current_page ?? 1) - 1) *
                              (datas.per_page ?? (datas.data ?? datas).length) +
                              i +
                              1}
                          </div>
                        </td>
                        <td>{data.namaKategori}</td>
                        <td>{data.namaSubKategori}</td>
                        <td className="text-center">{data.jumlah}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-8 text-center text-gray-500 text-xs lg:text-sm"
                      >
                        {startDate && endDate
                          ? "Tidak ada SPKRD pada waktu tersebut"
                          : "Belum ada data wajib retribusi"}
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
    </>
  );
};

export default Index;
