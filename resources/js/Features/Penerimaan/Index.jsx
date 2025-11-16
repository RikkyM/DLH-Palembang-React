import { useProvider } from "@/Context/GlobalContext";
import {
  ChevronDown,
  Eye,
  Filter,
  ReceiptText,
  Search,
  Send,
  Undo2,
} from "lucide-react";
import SearchableSelect from "@/Components/SearchableSelect";
import TableHead from "@/Components/TableHead";
import { useEffect, useRef, useState } from "react";
import { Deferred, Head, Link, router } from "@inertiajs/react";
import SmartPagination from "@/Components/SmartPagination";
import LoadingTable from "@/Components/LoadingTable";
import Confirmation from "./Confirmation";

const DataSetoran = ({
  datas,
  filters,
  skrdOptions = [],
  metodeOptions = [],
  kecamatanOptions = [],
  statusOptions = [],
  role,
}) => {
  const { modalState, openModal, closeModal } = useProvider();
  const [search, setSearch] = useState(filters.search || "");
  const [sort, setSort] = useState(filters.sort || null);
  const [direction, setDirection] = useState(filters.direction || null);
  const [perPage, setPerPage] = useState(() => {
    return filters.per_page && filters.per_page !== 10 ? filters.per_page : 10;
  });
  const [kecamatan, setKecamatan] = useState(filters.kecamatan || null);
  const [skrd, setSkrd] = useState(filters.skrd || "");
  const [metode, setMetode] = useState(filters.metode || "");
  const [status, setStatus] = useState(filters.status || "");
  const [tanggal, setTanggal] = useState(filters.tanggal_bayar || "");
  const [tanggalSerah, setTanggalSerah] = useState(filters.tanggal_serah || "");
  const [tanggalAcc, setTanggalAcc] = useState(filters.tanggal_acc || "");
  const [nominal, setNominal] = useState(filters.nominal || null);
  const [tarifPerbulan, setTarifPerbulan] = useState(
    filters.tarif_perbulan || null,
  );
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const filterRef = useRef(null);

  const roleConfig = {
    ROLE_SUPERADMIN: "super-admin",
    ROLE_KUPTD: "kuptd",
    ROLE_KASUBAG_TU_UPDT: "kasubag",
    ROLE_BENDAHARA: "bendahara",
  };

  const routeConfig = roleConfig[role];

  const statusMap = {
    ROLE_SUPERADMIN: {
      Processed: {
        default: "Diproses",
      },
      Approved: {
        default: "Diterima",
      },
      Rejected: {
        default: "Ditolak",
      },
      Cancelled: {
        default: "Dibatalkan",
      },
    },
    ROLE_KASUBAG_TU_UPDT: {
      Processed: {
        kasubag: "Diproses",
        kuptd: "Diproses ke KUPTD",
        bendahara: "Diproses oleh Bendahara",
      },
      Approved: {
        default: "Diterima",
      },
      Rejected: {
        default: "Ditolak",
      },
      Cancelled: {
        default: "Dibatalkan",
      },
    },
    ROLE_KUPTD: {
      Processed: {
        kuptd: "Diproses",
        bendahara: "Diproses ke Bendahara",
      },
      Approved: {
        default: "Diterima",
      },
      Rejected: {
        default: "Ditolak",
      },
      Cancelled: {
        default: "Dibatalkan",
      },
    },
    ROLE_BENDAHARA: {
      Processed: {
        bendahara: "Diproses",
      },
      Approved: {
        default: "Diterima",
      },
      Rejected: {
        default: "Ditolak",
      },
      Cancelled: {
        default: "Dibatalkan",
      },
    },
  };

  const renderStatus = (data) => {
    const roleStatus = statusMap[role];
    if (!roleStatus) return data.status;

    const statusValue = roleStatus[data.status];

    if (typeof statusValue === "string") {
      return statusValue;
    }

    return statusValue?.[data.current_stage] || statusValue.default;
  };

  const columns = [
    { key: "created_at", label: "no", align: "text-left" },
    { key: "nomorNota", label: "nomor nota", align: "text-left" },
    { key: "noSkrd", label: "nomor spkrd", align: "text-left" },
    {
      key: "namaObjekRetribusi",
      label: "nama objek retribusi",
      align: "text-left",
    },
    { key: "kecamatan", label: "kecamatan", align: "text-center" },
    {
      key: "tagihanPerBulanSkrd",
      label: "tarif per-bulan",
      align: "text-center",
    },
    { key: "metodeBayar", label: "cara bayar", align: "text-center" },
    { key: "namaBank", label: "nama bank", align: "text-center" },
    { key: "tanggalBayar", label: "tanggal bayar", align: "text-left" },
    { key: "jumlahBayar", label: "jumlah bayar", align: "text-left" },
    { key: "jumlahBulan", label: "jumlah bulan", align: "text-left" },
    { key: "noRef", label: "nomor referensi", align: "text-left" },
    { key: "namaPenyetor", label: "pengirim / penyetor", align: "text-left" },
    { key: "keteranganBulan", label: "ket. bulan bayar", align: "text-left" },
    { key: "tanggal_diterima", label: "Tgl Serah", align: "text-left" },
    { key: "tanggal_diterima", label: "Tgl Acc Bendahara", align: "text-left" },
    { key: "buktiBayar", label: "bukti setor", align: "text-left" },
    {
      key: "keterangan",
      label: "keterangan",
      align: "text-left max-w-72 w-full",
    },
    {
      key: "status",
      label: "status",
      align: "text-left sticky top-0 right-12 z-10",
    },
  ];
  const buildParams = (additionalParams = {}) => {
    const params = { ...additionalParams };

    if (search && search.trim() !== "") params.search = search;
    if (skrd) params.skrd = skrd;
    if (metode) params.metode = metode;
    if (tanggal) params.tanggal_bayar = tanggal;
    if (tanggalAcc) params.tanggal_acc = tanggalAcc;
    if (kecamatan) params.kecamatan = kecamatan.toLowerCase();
    if (nominal) params.nominal = nominal;
    if (tarifPerbulan) params.tarif_perbulan = tarifPerbulan;
    if (status) params.status = status;
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

  const fetchData = () => {
    const params = buildParams();

    router.get(route(`${routeConfig}.data-setoran.index`), params, {
      preserveState: true,
      // only: only,
      only: ["datas", "skrdOptions", "metodeOptions", "filters"],
      onStart: () => setIsLoading(true),
      onFinish: () => setIsLoading(false),
    });
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
    // if (!datas) return;
    if (datas) {
      const timeoutId = setTimeout(() => {
        fetchData();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [search, nominal, tarifPerbulan]);

  useEffect(() => {
    // if (!datas) return;
    if (datas) {
      fetchData();
      // const params = buildParams();

      // router.get(route(`${routeConfig}.data-setoran.index`), params, {
      //   preserveState: true,
      //   replace: true,
      //   only: ["datas", "skrdOptions", "metodeOptions", "filters"],
      //   onStart: () => setIsLoading(true),
      //   onFinish: () => setIsLoading(false),
      // });
    }
  }, [
    sort,
    direction,
    skrd,
    metode,
    perPage,
    tanggal,
    tanggalSerah,
    tanggalAcc,
    kecamatan,
    status,
  ]);

  const actionButtons = (data) => {
    const isCurrentStage =
      role !== "ROLE_SUPERADMIN" && data.current_stage === roleConfig[role];

    const ACTIONS = {
      Processed: { title: "Kirim", Icon: Send, iconClass: "size-5" },
      Approved: {
        title: "Batalkan Data Setoran",
        Icon: Undo2,
        iconClass: "size-5 text-red-500",
      },
    };

    const action = isCurrentStage ? ACTIONS[data.status] : null;
    if (!action) return null;

    const Icon = ACTIONS[data.status].Icon;

    return (
      <button
        title={ACTIONS[data.status].title}
        aria-label={ACTIONS[data.status].title}
        onClick={() => openModal("confirmation", data)}
      >
        <Icon className={ACTIONS[data.status].iconClass} />
      </button>
    );
  };

  const displayNomorNota = (v) =>
    typeof v === "string" && v.toLowerCase().startsWith("temp-") ? "-" : v;

  return (
    <>
      <Head title="Data Setoran" />
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
                    id="skrdList"
                    options={skrdOptions}
                    value={skrd}
                    onChange={(val) => {
                      setSkrd(val);
                    }}
                    placeholder="Nomor SPKRD"
                  />
                  <SearchableSelect
                    id="metodeSetor"
                    options={metodeOptions}
                    value={metode}
                    onChange={(val) => {
                      setMetode(val);
                    }}
                    placeholder="Metode Bayar"
                  />
                  {!["ROLE_KASUBAG_TU_UPDT", "ROLE_KUPTD"].includes(role) && (
                    <SearchableSelect
                      id="kecamatan"
                      options={kecamatanOptions}
                      value={kecamatan}
                      onChange={(val) => {
                        setKecamatan(val);
                      }}
                      placeholder="Kecamatan"
                    />
                  )}
                  <SearchableSelect
                    id="status"
                    options={statusOptions}
                    value={status}
                    onChange={(val) => {
                      setStatus(val);
                    }}
                    placeholder="Status"
                  />
                  <label htmlFor="tanggalBayar">
                    <input
                      id="tanggalBayar"
                      type={tanggal ? "date" : "text"}
                      placeholder="Tanggal bayar"
                      className="w-full rounded border bg-white p-2"
                      value={tanggal || ""}
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => {
                        if (!e.target.value) e.target.type = "text";
                      }}
                      onChange={(e) => {
                        setTanggal(e.target.value);
                      }}
                    />
                  </label>
                  <label htmlFor="tanggalSerah">
                    <input
                      id="tanggalSerah"
                      type={tanggalSerah ? "date" : "text"}
                      placeholder="Tanggal serah"
                      className="w-full rounded border bg-white p-2"
                      value={tanggalSerah || ""}
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => {
                        if (!e.target.value) e.target.type = "text";
                      }}
                      onChange={(e) => {
                        setTanggalSerah(e.target.value);
                      }}
                    />
                  </label>
                  <label htmlFor="tanggalAcc">
                    <input
                      id="tanggalAcc"
                      type={tanggalAcc ? "date" : "text"}
                      placeholder="Tanggal acc bendahara"
                      className="w-full rounded border bg-white p-2"
                      value={tanggalAcc || ""}
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => {
                        if (!e.target.value) e.target.type = "text";
                      }}
                      onChange={(e) => {
                        setTanggalAcc(e.target.value);
                      }}
                    />
                  </label>
                  <label
                    htmlFor="nominal"
                    className="flex w-full items-center gap-1.5 rounded border bg-white p-2 text-sm shadow md:max-w-80"
                  >
                    <Search size={20} />
                    <input
                      autoComplete="off"
                      type="number"
                      id="nominal"
                      placeholder="Jumlah bayar"
                      className="flex-1 outline-none"
                      value={nominal}
                      onChange={(e) => setNominal(e.target.value)}
                    />
                  </label>
                  <label
                    htmlFor="tarifPerbulan"
                    className="flex w-full items-center gap-1.5 rounded border bg-white p-2 text-sm shadow md:max-w-80"
                  >
                    <Search size={20} />
                    <input
                      autoComplete="off"
                      type="number"
                      id="tarifPerbulan"
                      placeholder="Tarif per-bulan"
                      className="flex-1 outline-none"
                      value={tarifPerbulan}
                      onChange={(e) => setTarifPerbulan(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            </div>
            <label
              htmlFor="search"
              className="flex w-full items-center gap-1.5 rounded border p-2 text-sm shadow md:w-[250px]"
            >
              <Search size={20} />
              <input
                autoComplete="off"
                type="search"
                id="search"
                placeholder="Cari nama atau nota bayar..."
                className="w-full flex-1 outline-none"
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
                  route("export-setoran") + "?" + params.toString(),
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
          className={`max-h-[calc(100%_-_230px)] overflow-auto rounded sm:max-h-[calc(100%_-_180px)] md:max-h-[calc(100%_-_200px)] lg:max-h-[calc(100%_-_150px)]`}
        >
          <Deferred data="datas" fallback={<LoadingTable />}>
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
                {(datas?.data ?? datas)?.length > 0 ? (
                  (datas?.data ?? datas).map((data, index) => (
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
                      <td className="whitespace-nowrap text-xs md:text-sm">
                        {displayNomorNota(data.nomorNota)}
                      </td>
                      <td className="text-xs md:text-sm">{data.skrd.noSkrd}</td>
                      <td className="text-xs md:text-sm">
                        <div className="max-w-72">
                          {data.skrd.namaObjekRetribusi}
                        </div>
                      </td>
                      <td className="text-xs md:text-sm">
                        <div className="max-w-72">
                          {data.skrd?.kecamatanObjekRetribusi ?? "-"}
                        </div>
                      </td>
                      <td className="text-xs md:text-sm">
                        <div className="max-w-72">
                          {Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(data.skrd?.tagihanPerBulanSkrd ?? "-")}
                        </div>
                      </td>
                      <td className="text-center text-xs md:text-sm">
                        {data.metodeBayar ?? "-"}
                      </td>
                      <td className="text-center text-xs md:text-sm">
                        {data.namaBank ?? "-"}
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
                      <td className="text-center text-xs md:text-sm">
                        {Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(data.jumlahBayar)}
                      </td>
                      <td className="text-center text-xs md:text-sm">
                        {data.jumlahBulan} Bulan
                      </td>
                      <td className="text-xs md:text-sm">
                        {data.noRef ?? "-"}
                      </td>
                      <td className="text-xs md:text-sm">
                        {data.namaPenyetor ?? "-"}
                      </td>
                      <td className="text-xs md:text-sm">
                        {data.keteranganBulan ?? "-"}
                      </td>
                      <td className="whitespace-nowrap text-xs md:text-sm">
                        {data.tanggal_serah
                          ? new Date(data.tanggal_serah).toLocaleString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </td>
                      <td className="whitespace-nowrap text-xs md:text-sm">
                        {data.tanggal_diterima
                          ? new Date(data.tanggal_diterima).toLocaleString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </td>
                      <td className="text-center text-xs md:text-sm">
                        {data.buktiBayar ? (
                          <a
                            href={route("bukti-bayar", {
                              filename: data.buktiBayar,
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-center font-semibold text-amber-600 hover:underline"
                          >
                            Bukti Bayar
                          </a>
                        ) : (
                          <>Tidak ada</>
                        )}
                      </td>
                      <td className="w-full max-w-72 overflow-hidden text-left text-xs md:text-sm">
                        <div className="w-full min-w-56 max-w-56 text-pretty">
                          {data?.keterangan ?? "-"}
                        </div>
                      </td>
                      <td
                        className={`sticky right-12 z-0 whitespace-nowrap text-sm ${index % 2 === 0 ? "bg-[#B3CEAF]" : "bg-white"} ${data.status === "Processed" ? "text-blue-500" : data.status === "Approved" ? "text-green-500" : data.status === "Cancelled" ? "text-amber-500" : "text-red-500"}`}
                      >
                        {/* {data.status === "Processed"
                          ? "Diproses"
                          : data.status === "Approved"
                            ? "Diterima"
                            : "Ditolak"} */}
                        {/* {data.status === "Processed" ?
                              data.current_stage === "kuptd" ? "Dikirim ke KUPTD" : data.current_stage === "bendahara" ? "Dikirim ke Bendahara" : "Diproses"
                              : ""} */}
                        {renderStatus(data)}
                      </td>
                      <td
                        className={`sticky right-0 space-x-1 text-right md:space-x-2 ${index % 2 === 0 ? "bg-[#B3CEAF]" : "bg-white"}`}
                      >
                        {/* <Link href={route("super-admin.data-setoran.show", {
                          data: data
                        })}>
                          <ReceiptText size={20} />
                        </Link> */}
                        <div className="flex flex-col gap-1.5">
                          <Link
                            preserveState
                            preserveScroll
                            title="Detail"
                            href={route(`${routeConfig}.data-setoran.show`, {
                              data: data.nomorNota,
                            })}
                          >
                            <Eye className="size-5" />
                          </Link>
                          {data.status === "Approved" &&
                            data.current_stage === "bendahara" && (
                              <a
                                href={route("setoran.pdf", {
                                  setoran: data.nomorNota,
                                })}
                                target="_blank"
                                rel="noreferrer noopener"
                                title="Nota Bayar"
                              >
                                <ReceiptText className="size-5" />
                              </a>
                            )}
                          {/* {role !== "ROLE_SUPERADMIN" &&
                            data.current_stage === roleConfig[role] &&
                            data.status === "Processed" && (
                              <button
                                title="Kirim"
                                onClick={() => {
                                  openModal("confirmation", data);
                                }}
                              >
                                <Send className="size-5" />
                              </button>
                            )}
                          {role !== "ROLE_SUPERADMIN" &&
                            data.current_stage === roleConfig[role] &&
                            data.status === "Approved" && (
                              <button
                                title="Tolak Data Setoran"
                                onClick={() => {
                                  openModal("confirmation", data);
                                }}
                              >
                                <Undo2 className="size-5 text-red-500" />
                              </button>
                            )} */}
                          {actionButtons(data)}
                          {/* <button>asdasd</button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="12"
                      className="py-8 text-center text-xs text-gray-500 md:text-sm"
                    >
                      {filters
                        ? "Tidak ada data yang ditemukan untuk pencarian tersebut"
                        : "Belum ada data setoran"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Deferred>
        </div>
        <Deferred data="datas">
          <SmartPagination datas={datas} filters={filters} />
        </Deferred>
      </section>
      <Confirmation
        isOpen={modalState.type === "confirmation"}
        onClose={closeModal}
        setoran={modalState.data}
        route={routeConfig}
      />
    </>
  );
};

export default DataSetoran;
