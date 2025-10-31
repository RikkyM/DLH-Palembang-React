import { Deferred, Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { roleConfig } from "@/Constants/roleConfig";
import LoadingTable from "@/Components/LoadingTable";

const Index = ({ datas, filters, role }) => {
  const [startDate, setStartDate] = useState(filters.tanggal_mulai ?? "");
  const [endDate, setEndDate] = useState(filters.tanggal_akhir ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const routeConfig = roleConfig[role];

  const calculatePercentage = (part, total) => {
    if (!total || total === 0) return 0;
    return ((part / total) * 100).toFixed(2);
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

  return (
    <>
      <Head title="Retribusi Kecamatan" />
      <section className="h-[calc(100dvh_-_80px)] touch-pan-y overflow-auto p-3">
        <div className="mb-3 flex w-full flex-col justify-between gap-3 rounded bg-white p-2 shadow lg:flex-row lg:items-center">
          <div className="flex flex-col gap-2 sm:flex-row md:w-auto md:items-center">
            <div className="grid h-full w-full grid-cols-2 gap-2 md:grid-cols-3 lg:flex">
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
                <Link
                  as="button"
                  href={route(`${routeConfig}.rekapitulasi.retribusi-kecamatan`, {
                    ...(startDate && { tanggal_mulai: startDate }),
                    ...(endDate && { tanggal_akhir: endDate }),
                  })}
                  preserveState
                  preserveScroll
                  replace
                  only={["datas", "filters"]}
                  onStart={() => setIsLoading(true)}
                  onFinish={() => setIsLoading(false)}
                  // disabled={isLoading}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded bg-black px-4 py-2 text-white sm:w-max"
                >
                  Cari
                </Link>
                <button
                  onClick={() => {
                    const params = new URLSearchParams();

                    if (startDate) params.append("tanggal_mulai", startDate);
                    if (endDate) params.append("tanggal_akhir", endDate);

                    window.open(
                      route("export-penerimaan-kecamatan") +
                        "?" +
                        params.toString(),
                      "_blank",
                    );
                  }}
                  className="h-10 self-end rounded bg-green-700 px-3 py-1.5 text-sm font-medium text-white"
                >
                  Excel
                </button>
              </div>
            </div>
          </div>
          <div className="self-end">
            <p className="relative text-xs text-red-500 before:text-red-500 before:content-['*']">
              Data Tampil apabila sudah di approve oleh Keuangan/Bendahara
            </p>
          </div>
        </div>

        <div className="max-h-[calc(100%_-_240px)] overflow-auto rounded-t sm:max-h-[calc(100%_-_180px)] md:max-h-[calc(100%_-_200px)] lg:max-h-[calc(100%_-_150px)]">
          <Deferred data="datas" fallback={<LoadingTable />}>
            {isLoading && <LoadingTable />}

            {!isLoading && datas && (
              <table className="min-w-full divide-y divide-gray-300 p-3 shadow">
                <thead className="truncate">
                  <tr className="text-white *:sticky *:top-0 *:select-none *:bg-[#F1B174] *:p-2 *:text-left *:text-xs *:font-medium *:uppercase *:md:text-sm">
                    <th>No</th>
                    <th>Kecamatan</th>
                    <th>Total SPKRD</th>
                    <th>Jumlah Tagihan</th>
                    <th>Total Bayar</th>
                    <th>Sisa Bayar</th>
                    <th>Persentase Bayar</th>
                    <th>Persentase Belum Bayar</th>
                  </tr>
                </thead>
                <tbody>
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
                            <Link
                              key={data.id ?? i}
                              className={`*:cursor-pointer *:p-2 *:text-xs *:sm:text-sm *:lg:text-base ${i % 2 === 0 ? "bg-[#B3CEAF] hover:bg-[#A0BD9A]" : "bg-white hover:bg-neutral-200"}`}
                              as="tr"
                              href={route(
                                `${routeConfig}.rekapitulasi.retribusi-kecamatan.detail`,
                                {
                                  tanggal_mulai:
                                    startDate || filters.tanggal_mulai || "",
                                  tanggal_akhir:
                                    endDate || filters.tanggal_akhir || "",
                                  kecamatan: data.namaKecamatan,
                                },
                              )}
                              preserveState
                              prefetch
                              preserveScroll
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
                              <td>{data.namaKecamatan}</td>
                              <td>{data.kecamatan}</td>
                              <td>{formatNumber(data.tagihanPertahun)}</td>
                              <td>{formatNumber(data.totalBayar)}</td>
                              <td>
                                {formatNumber(
                                  data.tagihanPertahun - data.totalBayar,
                                )}
                              </td>
                              <td>{persentaseBayar}%</td>
                              <td>{persentaseBelumBayar}%</td>
                            </Link>
                          );
                        })}
                      <tr className="sticky bottom-0 bg-white">
                        <td colSpan={2} className="p-2 font-bold">
                          Total
                        </td>
                        <td className="p-2">
                        {console.log(datas)}
                          {datas.reduce(
                            (acc, row) => acc + (Number(row?.kecamatan ?? 0) || 0),
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
                        <td className="p-2">
                          {formatNumber(
                            datas.reduce(
                              (acc, row) =>
                                acc + (Number(row?.totalBayar ?? 0) || 0),
                              0,
                            ),
                          )}
                        </td>
                        <td className="p-2">
                          {formatNumber(
                            datas.reduce((acc, row) => {
                              const tagihan = Number(row?.tagihanPertahun ?? 0);
                              const totalBayar = Number(row?.totalBayar ?? 0);

                              return acc + (tagihan - totalBayar);
                            }, 0),
                          )}
                        </td>
                        <td className="p-2">
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
                        <td className="p-2">
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
            )}
          </Deferred>
        </div>
      </section>
    </>
  );
};

export default Index;
