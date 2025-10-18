import { useProvider } from "@/Context/GlobalContext";
import { useEffect, useState } from "react";
import { Deferred, Head, router } from "@inertiajs/react";
import TableHead from "@/Components/TableHead";
import LoadingTable from "../../../Components/LoadingTable";

const Index = ({ datas, filters, role }) => {
  const [startDate, setStartDate] = useState(filters.tanggal_mulai ?? "");
  const [endDate, setEndDate] = useState(filters.tanggal_akhir ?? "");
  const [sort, setSort] = useState(filters.sort || null);
  const [direction, setDirection] = useState(filters.direction || null);
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

  // useEffect(() => {
  //   const params = buildParams();

  //   router.get(route(`${routeConfig}.rekapitulasi.nota-tagihan`), params, {
  //     preserveState: true,
  //     replace: true,
  //     only: ["datas", "filters"],
  //     onStart: () => setIsLoading(true),
  //     onFinish: () => setIsLoading(false),
  //   });
  // }, [sort, direction]);

  const onSubmitFilter = (e) => {
    e.preventDefault();
    const params = buildParams({
      tanggal_mulai: startDate || undefined,
      tanggal_akhir: endDate || undefined,
    });

    router.get(route(`${routeConfig}.rekapitulasi.nota-tagihan`), params, {
      preserveState: true,
      preserveScroll: true,
      onStart: () => setIsLoading(true),
      onFinish: () => setIsLoading(false),
    });
  };

  return (
    <>
      <Head title="Data Surat Tagihan" />
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
                      route("export-rekap-nota-tagihan") +
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
            </form>
          </div>
        </div>

        <div
          className={`max-h-[calc(100%_-_230px)] overflow-auto rounded sm:max-h-[calc(100%_-_180px)] md:max-h-[calc(100%_-_200px)] lg:max-h-[calc(100%_-_150px)]`}
        >
          {isLoading ? (
            <LoadingTable />
          ) : (
            <Deferred data="datas" fallback={<LoadingTable />}>
              <table className="min-w-full divide-y divide-gray-300 p-3 shadow">
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
                  {datas?.length > 0 ? (
                    datas.map((data, index) => (
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={13}
                        className="py-8 text-center text-gray-500"
                      >
                        {startDate || endDate
                          ? "Tidak ada data yang ditemukan untuk pencarian tersebut"
                          : "Belum ada data surat tagihan"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Deferred>
          )}
        </div>
      </section>
    </>
  );
};

export default Index;
