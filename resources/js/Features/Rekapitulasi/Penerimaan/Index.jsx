import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import TableHead from "@/Components/TableHead";

const Index = ({ datas, filters }) => {
  const [startDate, setStartDate] = useState(filters.tanggal_mulai ?? "");
  const [endDate, setEndDate] = useState(filters.tanggal_akhir ?? "");
  const [sort, setSort] = useState(filters.sort || null);
  const [direction, setDirection] = useState(filters.direction || null);
  const [isLoading, setIsLoading] = useState(false);
  // const [hasFilter, setHasFilter] = useState(false);

  const columns = [
    { key: "id", label: "No", align: "text-center w-10" },
    {
      key: "namaKategori",
      label: "Wilayah UPTD",
      align: "text-left",
    },
  ];

  const buildParams = (additionalParams = {}) => {
    const params = { ...additionalParams };

    // if (perPage && perPage !== 10) params.per_page = perPage;
    // if (startDate) params.tanggal_mulai = startDate;
    // if (endDate) params.tanggal_akhir = endDate;
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
    // if (!hasFilter) return;

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const params = buildParams();

      router.get(route(`super-admin.rekapitulasi.penerimaan`), params, {
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
  }, [sort, direction]);

  const onSubmitFilter = (e) => {
    e.preventDefault();

    const params = buildParams();

    // setHasFilter(true);
    setIsLoading(true);
    router.get(
      route("super-admin.rekapitulasi.penerimaan"),
      {
        ...params,
        tanggal_mulai: startDate || undefined,
        tanggal_akhir: endDate || undefined,
      },
      {
        preserveState: true,
        replace: true,
        onFinish: () => setIsLoading(false),
      },
    );
  };

  const formatNumber = (data) => {
    return (
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(data) ?? 0
    );
  };

  const calculatePercentage = (part, total) => {
    if (!total || total === 0) return 0;
    return ((part / total) * 100).toFixed(2);
  };

  return (
    <>
      <Head title="Penerimaan" />
      <section className="h-[calc(100dvh_-_80px)] touch-pan-y overflow-auto p-3">
        <div className="mb-3 flex w-full flex-col justify-between gap-3 rounded bg-white p-2 shadow lg:flex-row lg:items-center">
          <div className="flex flex-col gap-2 sm:flex-row md:w-auto md:items-center">
            <form
              onSubmit={onSubmitFilter}
              className="grid h-full w-full grid-cols-2 gap-2 md:grid-cols-3 lg:flex"
            >
              <div className="space-y-2 rounded text-sm">
                <label htmlFor="tanggal_mulai">Tanggal Mulai</label>
                <input
                  type="date"
                  id="tanggal_mulai"
                  className="h-10 w-full rounded border bg-white p-2 shadow"
                  value={startDate}
                  onChange={(e) => {
                    const start = e.target.value || "";

                    setStartDate(start);

                    if (endDate && endDate < start) setEndDate(start);
                  }}
                  max={endDate || undefined}
                />
              </div>
              <div className="space-y-2 rounded text-sm">
                <label htmlFor="tanggal_akhir">Tanggal Akhir</label>
                <input
                  type="date"
                  id="tanggal_akhir"
                  className="h-10 w-full rounded border bg-white p-2 shadow"
                  value={endDate}
                  onChange={(e) => {
                    const end = e.target.value || "";

                    if (end === "") {
                      setEndDate("");
                      return;
                    }

                    if (startDate && end < startDate) {
                      setEndDate(startDate);
                      return;
                    }
                    setEndDate(end);
                  }}
                  min={startDate || undefined}
                />
              </div>
              <div className="col-span-2 flex w-full flex-col items-end gap-2 text-sm sm:col-span-1 sm:w-max sm:flex-row">
                <button
                  disabled={isLoading}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded bg-black px-4 py-2 text-white sm:w-max"
                >
                  Cari
                </button>
                <button
                  onClick={() => {
                    const params = new URLSearchParams();

                    if (startDate) params.append("tanggal_mulai", startDate);
                    if (endDate) params.append("tanggal_akhir", endDate);

                    window.open(
                      route("export-rekap-retribusi") + "?" + params.toString(),
                      "_blank",
                    );
                  }}
                  className="h-10 self-end rounded bg-green-700 px-3 py-1.5 text-sm font-medium text-white"
                >
                  Excel
                </button>
              </div>
            </form>
          </div>
          <div className="self-end">
            <p className="relative text-xs text-red-500 before:text-red-500 before:content-['*']">
              Data Tampil apabila sudah di approve oleh Keuangan/Bendahara
            </p>
          </div>
        </div>

        <div
          className={`max-h-[calc(100%_-_230px)] overflow-auto rounded-t sm:max-h-[calc(100%_-_180px)] md:max-h-[calc(100%_-_200px)] lg:max-h-[calc(100%_-_150px)] ${!isLoading && "shadow"}`}
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
                  >
                    {/* <th
                      colSpan={2}
                      className="sticky top-0 select-none bg-[#F1B174]"
                    >
                      Approval UPTD
                    </th>
                    <th
                      colSpan={2}
                      className="sticky top-0 select-none bg-[#F1B174]"
                    >
                      Approval Keuangan
                    </th> */}
                    <th className="sticky top-0 select-none bg-[#F1B174] text-left">
                      Total SPKRD
                    </th>
                    <th className="sticky top-0 select-none bg-[#F1B174] text-left">
                      Jumlah Tagihan
                    </th>
                    <th className="sticky top-0 select-none bg-[#F1B174] text-left">
                      Total Bayar
                    </th>
                    <th className="sticky top-0 select-none bg-[#F1B174] text-left">
                      Sisa Bayar
                    </th>
                    <th className="sticky top-0 select-none bg-[#F1B174] text-left">
                      Persentase Bayar
                    </th>
                    <th className="sticky top-0 select-none bg-[#F1B174] text-left">
                      Persentase Belum Bayar
                    </th>
                  </TableHead>
                  {/* <tr className="text-white *:p-2 *:text-xs *:font-medium *:uppercase *:md:text-sm">
                    <th className="sticky top-9 select-none bg-[#F1B174]">
                      Total Bayar
                    </th>
                    <th className="sticky top-9 select-none bg-[#F1B174]">
                      Sisa Bayar
                    </th>
                    <th className="sticky top-9 select-none bg-[#F1B174]">
                      Total Bayar
                    </th>
                    <th className="sticky top-9 select-none bg-[#F1B174]">
                      Sisa Bayar
                    </th>
                  </tr> */}
                </thead>
                <tbody>
                  <tr>
                    {/* <td>1</td>
                  <td>TEST</td>
                  <td>3</td>
                  <td>10000</td>
                  <td>10000</td>
                  <td>10000</td>
                  <td>10000</td> */}
                  </tr>
                  {datas && (datas.data ?? datas)?.length > 0 ? (
                    <>
                      {datas &&
                        (datas.data ?? datas).map((data, i) => {
                          const persentaseBayar = calculatePercentage(
                            data.totalBayar,
                            data.tagihanPertahun,
                          );
                          const persentaseBelumBayar = (
                            100 - persentaseBayar
                          ).toFixed(2);

                          return (
                            <tr
                              key={data.id ?? i}
                              className={`*:p-2 ${i % 2 === 0 ? "bg-[#B3CEAF]" : "bg-white"}`}
                              onClick={() => openDetail(data)}
                            >
                              <td className="text-left">
                                <div className="w-10 text-center">
                                  {((datas.current_page ?? 1) - 1) *
                                    (datas.per_page ??
                                      (datas.data ?? datas).length) +
                                    i +
                                    1}
                                </div>
                              </td>
                              <td>{data.namaUptd}</td>
                              <td>{data.skrd}</td>
                              <td>{formatNumber(data.tagihanPertahun)}</td>
                              <td>{formatNumber(data.totalBayar)}</td>
                              <td>
                                {formatNumber(
                                  data.tagihanPertahun - data.totalBayar,
                                )}
                              </td>
                              <td>{persentaseBayar}%</td>
                              <td>{persentaseBelumBayar}%</td>

                              {/* <td>{data.namaKategori}</td>
                        <td>{data.namaSubKategori}</td>
                        <td className="text-center">{data.jumlah}</td> */}
                            </tr>
                          );
                        })}
                      <tr className="sticky bottom-0 bg-white">
                        <td colSpan={2} className="sticky left-0 p-2 font-bold">
                          Total
                        </td>
                        <td className="p-2">
                          {datas.reduce(
                            (acc, row) => acc + (Number(row?.skrd ?? 0) || 0),
                            0,
                          )}
                        </td>
                        <td className="p-2">
                          {formatNumber(
                            datas.reduce(
                              (acc, row) =>
                                acc + (Number(row?.tagihanPertahun ?? 0) || 0),
                              0,
                            ),
                          )}
                        </td>
                        <td>
                          {formatNumber(
                            datas.reduce(
                              (acc, row) =>
                                acc + (Number(row?.totalBayar ?? 0) || 0),
                              0,
                            ),
                          )}
                        </td>
                        <td>
                          {formatNumber(
                            datas.reduce((acc, row) => {
                              {
                                /* acc + (Number(row?.tagihanPertahun ?? 0) || 0), */
                              }
                              const tagihan = Number(row?.tagihanPertahun ?? 0);
                              const totalBayar = Number(row?.totalBayar ?? 0);

                              return acc + (tagihan - totalBayar);
                            }, 0),
                          )}
                        </td>
                        <td>
                          {(() => {
                            const totalTagihan = datas.reduce(
                              (acc, row) =>
                                acc + (Number(row?.tagihanPertahun ?? 0) || 0),
                              0,
                            );
                            const totalBayar = datas.reduce(
                              (acc, row) =>
                                acc + (Number(row?.totalBayar ?? 0) || 0),
                              0,
                            );
                            return (
                              calculatePercentage(totalBayar, totalTagihan) +
                              "%"
                            );
                          })()}
                        </td>
                        <td>
                          {(() => {
                            const totalTagihan = datas.reduce(
                              (acc, row) =>
                                acc + (Number(row?.tagihanPertahun ?? 0) || 0),
                              0,
                            );
                            const totalBayar = datas.reduce(
                              (acc, row) =>
                                acc + (Number(row?.totalBayar ?? 0) || 0),
                              0,
                            );
                            const persentaseBayar = calculatePercentage(
                              totalBayar,
                              totalTagihan,
                            );
                            return (100 - persentaseBayar).toFixed(2) + "%";
                          })()}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-8 text-center text-xs text-gray-500 lg:text-sm"
                      >
                        {Boolean(startDate || endDate) &&
                          "Rekapitulasi Penerimaan tidak ditemukan."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Index;
