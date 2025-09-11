import { Link, router } from "@inertiajs/react";
import {
  FileText,
  Pencil,
  PencilLine,
  Send,
  TableOfContents,
} from "lucide-react";
import TableHead from "@/Components/TableHead";
import { useProvider } from "@/Context/GlobalContext";

const Table = ({
  datas,
  search,
  columns,
  sort,
  setSort,
  direction,
  setDirection,
  role,
}) => {
    const { openModal } = useProvider();
  
  const handleSend = (e, id) => {
    e.preventDefault();

    router.put(
      route("pendaftar.wajib-retribusi.send", id),
      {},
      {
        preserveScroll: true,
        onError: () => {
          console.error("Terjadi kesalahan ketika mengirim");
        },
      },
    );
  };

  const roleConfig = {
    ROLE_KUPTD: {
      show: "kuptd.wajib-retribusi.show",
    },
    ROLE_KATIM: {
      show: "katim.wajib-retribusi.show",
    },
    ROLE_KABID: {
      show: "kabid.wajib-retribusi.show",
    },
  };

  const routeConfig = roleConfig[role];

  const renderStatus = (data) => {
    if (role === "ROLE_PENDAFTAR") {
      return (
        <span
          className={`select-none rounded py-2 font-medium ${
            data.status === "Approved" && data.current_role != null
              ? "text-sky-600"
              : data.status == "Processed"
                ? "text-amber-500"
                : data.status == "Rejected"
                  ? "text-red-500"
                  : data.status === "Approved" &&
                    data.current_role == null &&
                    "text-green-500"
          }`}
        >
          {data.status == "Approved"
            ? "Diterima"
            : data.status == "Rejected"
              ? "Ditolak"
              : "Diproses"}
        </span>
      );
    }

    return (
      <span
        className={`select-none rounded py-2 font-medium ${
          data.status === "Processed" && data.current_role == role
            ? "text-sky-600"
            : data.status == "Processed" && data.current_role != role
              ? "text-amber-500"
              : data.status == "Rejected"
                ? "text-red-500"
                : data.status === "Approved" &&
                  data.current_role == null &&
                  "text-green-500"
        }`}
      >
        {data.status === "Processed" && data.current_role == role && "Diterima"}
        {data.status === "Processed" && data.current_role != role && "Diproses"}
        {data.status === "Rejected" && "Ditolak"}
        {data.status === "Approved" && data.current_role == null && "Selesai"}
      </span>
    );
  };

  const renderActions = (data) => {
    if (role === "ROLE_PENDAFTAR") {
      return (
        <div className="flex flex-col gap-2 *:rounded *:text-sm *:font-medium">
          <button
            className="flex items-center gap-1.5 whitespace-nowrap"
            onClick={(e) => {
              e.stopPropagation();
              window.open(
                route("wajib-retribusi.draft-pdf", {
                  id: data.id,
                }),
                "_blank",
              );
            }}
          >
            <FileText size={20} /> Draft SKRD
          </button>
          {data.status === "Approved" && (
            <>
              <Link
                href={route("pendaftar.wajib-retribusi.edit", {
                  status: "diterima",
                  retribusi: data.id,
                })}
                className="flex items-center gap-1.5"
              >
                <PencilLine size={20} /> Edit
              </Link>
              <button
                onClick={(e) => handleSend(e, data.id)}
                className="flex items-center gap-1.5 whitespace-nowrap"
              >
                <Send size={20} /> Kirim
              </button>
            </>
          )}
          {data.status === "Rejected" && (
            <>
              <Link
                href={route("pendaftar.wajib-retribusi.edit", {
                  status: "ditolak",
                  retribusi: data.id,
                })}
                className="flex items-center gap-1.5 whitespace-nowrap"
              >
                <Pencil size={20} /> Edit
              </Link>
              <button
                onClick={(e) => handleSend(e, data.id)}
                className="flex items-center gap-1.5 whitespace-nowrap"
              >
                <Send size={20} /> Kirim
              </button>
            </>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2 *:rounded *:text-sm *:font-medium">
        <button
          className="flex items-center gap-1.5 whitespace-nowrap"
          onClick={(e) => {
            e.stopPropagation();
            window.open(
              route("wajib-retribusi.draft-pdf", {
                id: data.id,
              }),
              "_blank",
            );
          }}
        >
          <FileText size={20} /> Draft SKRD
        </button>
        {data.status === "Processed" && data.current_role == role && (
          <>
            <Link
              href={route(routeConfig.show, {
                status: "diterima",
                retribusi: data.id,
              })}
              className="flex items-center gap-1.5"
            >
              <TableOfContents size={20} /> Lihat
            </Link>
            <button
              onClick={() => openModal("diterima", data)}
              className="flex items-center gap-1.5 whitespace-nowrap"
            >
              <Send size={20} /> Proses
            </button>
          </>
        )}
      </div>
    );
  };

  return (
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
      <tbody className="dividfe-y divide-neutral-300 text-xs md:text-sm">
        {(datas.data || datas)?.length > 0 ? (
          (datas.data || datas).map((data, index) => (
            <tr
              key={data.id || index}
              className={`*:p-2 ${index % 2 === 0 ? "bg-[#B3CEAF]" : "bg-white"}`}
            >
              <td className="text-center">
                {((datas.current_page ?? 1) - 1) *
                  (datas.per_page ?? (datas.data ?? datas).length) +
                  index +
                  1}
              </td>
              {/* <td>{data.noPendaftaran}</td> */}
              <td>{data.noWajibRetribusi ?? "-"}</td>
              <td>{data.pemilik.namaPemilik}</td>
              <td>{data.namaObjekRetribusi}</td>
              <td>
                <div className="w-72">{data.alamat}</div>
              </td>
              <td className="whitespace-nowrap">
                {data.kelurahan.namaKelurahan}
              </td>
              <td className="whitespace-nowrap">
                {data.kecamatan.namaKecamatan}
              </td>
              <td>{data.kategori.namaKategori}</td>
              <td>{data.sub_kategori.namaSubKategori}</td>
              <td className="whitespace-nowrap">{data.uptd.namaUptd}</td>
              <td>{data.bulan ? `${data.bulan} Bulan` : "-"}</td>
              <td>{data.bentukBadanUsaha ?? "-"}</td>
              <td>
                {data.jenisTarif === "tarif"
                  ? "Tarif 1"
                  : data.jenisTarif === "tarif2"
                    ? "Tarif 2"
                    : "-"}
              </td>
              <td>
                <div className="w-max">{data.keteranganBulan ?? "-"}</div>
              </td>
              <td>{data.unit ?? "-"}</td>
              <td>{data.m2 ?? "-"}</td>
              <td>{data.giat ?? "-"}</td>
              <td>{data.hari ?? "-"}</td>
              <td>{data.meter ?? "-"}</td>
              <td className="whitespace-nowrap">
                {data.tanggalSkrd
                  ? new Date(data.tanggalSkrd).toLocaleDateString("id-ID", {
                      // day: "numeric",
                      // month: "long",
                      // year: "numeric"
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "-"}
              </td>
              <td>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(data.tarifPerbulan) || 0}
              </td>
              <td>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(data.tarifPertahun) || 0}
              </td>
              <td>{data.user.namaLengkap}</td>
              {data.status == "Rejected" && <td>{data.keterangan}</td>}
              <td>
                {/* <span
                  className={`select-none rounded py-2 font-medium ${
                    data.status === "Approved" && data.current_role != null
                      ? "text-sky-600"
                      : data.status == "Processed"
                        ? "text-amber-500"
                        : data.status == "Rejected"
                          ? "text-red-500"
                          : data.status === "Approved" &&
                            data.current_role == null &&
                            "text-green-500"
                  }`}
                >
                  {data.status == "Approved"
                    ? "Diterima"
                    : data.status == "Rejected"
                      ? "Ditolak"
                      : "Diproses"}
                </span> */}
                {renderStatus(data)}
              </td>
              <td
                className={`sticky right-0 ${index % 2 === 0 ? "bg-[#B3CEAF]" : "bg-white"}`}
              >
                {/* <div className="flex h-full w-full flex-col gap-2 p-2 *:rounded *:text-sm *:font-medium">
                  <button
                    className="flex items-center gap-1.5 whitespace-nowrap"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(
                        route("wajib-retribusi.draft-pdf", { id: data.id }),
                        "_blank",
                      );
                    }}
                  >
                    <FileText size={20} /> Draft SKRD
                  </button>
                  {data.status === "Approved" && (
                    <>
                      <Link
                        href={route("super-admin.wajib-retribusi.edit", {
                          status: "diterima",
                          retribusi: data.id,
                        })}
                        className="flex items-center gap-1.5"
                      >
                        <PencilLine size={20} /> Edit
                      </Link>
                      <button
                        onClick={(e) => handleSend(e, data.id)}
                        className="flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Send size={20} /> Kirim
                      </button>
                    </>
                  )}
                  {data.status === "Rejected" && (
                    <>
                      <Link
                        href={route("super-admin.wajib-retribusi.edit", {
                          retribusi: data.id,
                          status: "ditolak",
                        })}
                        className="flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Pencil size={20} /> Edit
                      </Link>
                      <button
                        onClick={(e) => handleSend(e, data.id)}
                        className="flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Send size={20} /> Kirim
                      </button>
                    </>
                  )}
                </div> */}
                {renderActions(data)}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="13" className="py-8 text-center text-gray-500">
              {search
                ? "Tidak ada data yang ditemukan untuk pencarian tersebut"
                : "Belum ada data wajib retribusi"}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
