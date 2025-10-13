import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import TableHead from "@/Components/TableHead";
import React from "react";

const Index = ({ datas, filters }) => {
  const [startDate, setStartDate] = useState(filters.tanggal_mulai ?? "");
  const [endDate, setEndDate] = useState(filters.tanggal_akhir ?? "");
  const [sort, setSort] = useState(filters.sort || null);
  const [direction, setDirection] = useState(filters.direction || null);
  const [isLoading, setIsLoading] = useState(false);

  // const columns = [
  //   { key: "id", label: "No", align: "text-center w-10" },
  //   { key: "namaKategori", label: "Kategori", align: "text-left" },
  //   { key: "namaSubKategori", label: "Sub Kategori", align: "text-left" },
  //   { key: "jumlah", label: "Jumlah", align: "text-center" },
  // ];

  const numberFormat = (data) => {
    return (
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(data) ?? 0
    );
  };

  const buildParams = (additionalParams = {}) => {
    const params = { ...additionalParams };

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
  }, [sort, direction]);

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
  };

  const openDetail = (data, sub) => {
    const params = {
      tanggal_mulai: startDate || filters.tanggal_mulai || "",
      tanggal_akhir: endDate || filters.tanggal_akhir || "",
      kategori: data.namaKategori,
      sub_kategori: sub.label,
    };

    // console.log(data);

    router.get(route("super-admin.rekapitulasi.spkrd.detail"), params, {
      preserveScroll: true,
      replace: false,
    });
  };

  return (
    <>
      <Head title="Rekapitulasi SPKRD" />
      <section className="h-[calc(100dvh_-_80px)] touch-pan-y overflow-auto p-3">
        <div className="mb-3 flex w-full flex-col justify-between gap-3 rounded bg-white p-2 shadow lg:flex-row lg:items-center">
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:items-center">
            <form
              onSubmit={onSubmitFilter}
              className="grid h-full w-full grid-cols-2 gap-2 md:grid-cols-4"
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
              <div className="col-span-2 flex w-full items-end text-sm">
                <button
                  disabled={isLoading}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded bg-black px-4 py-2 text-white sm:w-max"
                >
                  Cari
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
                  {/* <TableHead
                    columns={columns}
                    sort={sort}
                    direction={direction}
                    onSort={(column, dir) => {
                      setSort(column);
                      setDirection(dir);
                    }}
                  /> */}
                  <tr className="text-white *:sticky *:top-0 *:z-0 *:cursor-pointer *:select-none *:bg-[#F1B174] *:p-2 *:text-xs *:font-medium *:uppercase *:md:text-sm">
                    <th className="sticky top-0 z-0 w-10 cursor-pointer select-none bg-[#F1B174] text-center">
                      no
                    </th>
                    <th className="text-left">kategori</th>
                    <th className="text-left">sub kategori</th>
                    <th className="text-center">jumlah spkrd</th>
                    <th className="text-center">total tagihan</th>
                    <th className="text-center">total bayar</th>
                    <th className="text-center">sisa bayar</th>
                  </tr>
                </thead>
                <tbody>
                  {datas && (datas.data ?? datas)?.length > 0 ? (
                    (datas.data ?? datas).map((data, i) => (
                      <React.Fragment key={i}>
                        {data.subKategori.map((sub, subIdx) => (
                          <tr
                            key={`${i}-${subIdx}`}
                            className={`cursor-pointer *:p-2 ${i % 2 == 0 ? "bg-[#B3CEAF] hover:bg-[#A0BD9A]" : "bg-white hover:bg-neutral-200"}`}
                          >
                            {subIdx === 0 && (
                              <>
                                <td
                                  onClick={(e) => e.stopPropagation()}
                                  className={`pointer-events-none text-center ${i % 2 == 0 ? "bg-[#B3CEAF]" : "bg-white"}`}
                                  rowSpan={data.subKategori.length}
                                >
                                  {data.no}
                                </td>
                                <td
                                  onClick={(e) => e.stopPropagation()}
                                  className={`pointer-events-none w-[400px] ${i % 2 == 0 ? "bg-[#B3CEAF]" : "bg-white"}`}
                                  rowSpan={data.subKategori.length}
                                >
                                  <div className="w-full max-w-[400px]">
                                    {data.namaKategori}
                                  </div>
                                </td>
                              </>
                            )}
                            <td onClick={() => openDetail(data, sub)}>
                              <div>{sub.label}</div>
                            </td>
                            <td
                              className="text-center"
                              onClick={() => openDetail(data, sub)}
                            >
                              {sub.jumlah}
                            </td>
                            <td
                              className="text-center"
                              onClick={() => openDetail(data, sub)}
                            >
                              {numberFormat(sub.tagihan)}
                            </td>
                            <td
                              className="text-center"
                              onClick={() => openDetail(data, sub)}
                            >
                              {numberFormat(sub.totalBayar)}
                              {console.log(sub.totalBayar)}
                            </td>
                            <td
                              className="text-center"
                              onClick={() => openDetail(data, sub)}
                            >
                              {numberFormat(sub.tagihan - sub.totalBayar)}
                              {console.log(data)}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))
                  ) : startDate || endDate ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-8 text-center text-xs text-gray-500 lg:text-sm"
                      >
                        SPKRD tidak ditemukan.
                      </td>
                    </tr>
                  ) : null}
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
