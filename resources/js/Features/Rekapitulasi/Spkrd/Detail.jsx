import { Head } from "@inertiajs/react";
import { useState } from "react";
import TableHead from "@/Components/TableHead";
import React from "react";

const Detail = ({ datas, bulan, filters }) => {
  const [sort, setSort] = useState(filters.sort || null);
  const [direction, setDirection] = useState(filters.direction || null);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    { key: "id", label: "No", align: "text-center w-10" },
    { key: "noSkrd", label: "No SPKRD", align: "text-left" },
    {
      key: "namaObjekRetribusi",
      label: "Nama Wajib Retribusi",
      align: "text-left",
    },
    { key: "namaKategori", label: "Kategori", align: "text-left" },
    { key: "namaSubKategori", label: "Sub Kategori", align: "text-left" },
    { key: "tagihanPerBulanSkrd", label: "Tarif Perbulan", align: "text-left" },
    { key: "tangalSkrd", label: "Tgl Bayar (Bank)", align: "text-left" },
  ];

  return (
    <>
      <Head title="Detail Rekapitulasi SPKRD" />
      <section className="h-[calc(100dvh_-_80px)] touch-pan-y overflow-auto p-3">
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
                  >
                    {bulan.map((bulan, i) => (
                      <React.Fragment key={i}>
                        <th className="sticky top-0 cursor-pointer select-none bg-[#F1B174]">
                          {bulan}
                        </th>
                        <th className="sticky top-0 cursor-pointer select-none truncate bg-[#F1B174]">
                          Tanggal Bayar
                        </th>
                      </React.Fragment>
                    ))}
                  </TableHead>
                </thead>
                <tbody>
                  {(datas.data ?? datas).map((data, i) => (
                    <tr
                      key={data.id ?? i}
                      className={`*:p-2 ${i % 2 === 0 ? "bg-[#B3CEAF]" : "bg-white"}`}
                      onClick={() => openDetail(data)}
                    >
                      <td className="text-left">
                        <div className="w-10 text-center">
                          {((datas.current_page ?? 1) - 1) *
                            (datas.per_page ?? (datas.data ?? datas).length) +
                            i +
                            1}
                        </div>
                      </td>
                      <td>{data.noSkrd ?? "-"}</td>
                      <td>{data.namaObjekRetribusi}</td>
                      <td className="whitespace-nowrap">{data.namaKategori}</td>
                      <td className="whitespace-nowrap">
                        {data.namaSubKategori}
                      </td>
                      <td>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(data.tagihanPerBulanSkrd)}
                      </td>
                      <td>
                        {new Date(
                          data.tanggalSkrd ?? data.created_at,
                        ).toLocaleString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      {bulan.map((_, i) => {
                        const pembayaranUntukBulan =
                          data.pembayaran.find((item) =>
                            item.pembayaranBulan.includes(i + 1),
                          ) ??
                          data.detail_setoran.find(
                            (d) =>
                              d.namaBulan.toLowerCase() ===
                                bulan[i].toLowerCase()
                          );

                        return (
                          <React.Fragment key={i}>
                            <td className="text-center">
                              {pembayaranUntukBulan ? i + 1 : "-"}
                            </td>
                            <td className="text-center">
                              {pembayaranUntukBulan
                                ? new Date(
                                    pembayaranUntukBulan.tanggalBayar,
                                  ).toLocaleDateString("id-ID")
                                : "-"}
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Detail;
