import { Link, router } from "@inertiajs/react";
import {
  FileText,
  Pencil,
  PencilLine,
  Send,
} from "lucide-react";
import TableHead from "@/Components/TableHead";

const Table = ({
  datas,
  search,
  columns,
  sort,
  setSort,
  direction,
  setDirection,
  isLoading,
}) => {

  const handleSend = (e, id) => {
      e.preventDefault();
  
      router.put(
        route("pendaftar.wajib-retribusi.send", id),
        {},
        {
          preserveScroll: true,
          onError: (errors) => {
            console.error("Terjadi kesalahan ketika mengirim");
          },
        },
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
        {/* <tr className="*:p-2 *:text-sm *:font-medium *:uppercase">
          <th className="text-left">Aksi</th>
          {columns.map((col) => (
            <th
              key={col.key}
              className={`${col.align} cursor-pointer select-none`}
              onClick={() => handleSort(col.key)}
            >
              <span className="flex items-center gap-1.5">
                {col.label}
                {sort === col.key && (
                  <span className="ml-1">
                    {direction === "desc" ? (
                      <ArrowUp size={20} />
                    ) : (
                      <ArrowDown size={20} />
                    )}
                  </span>
                )}
              </span>
            </th>
          ))}
        </tr> */}
      </thead>
      <tbody className="dividfe-y divide-neutral-300 text-xs md:text-sm">
        {isLoading ? (
          <tr>
            <td colSpan={14}>
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
            </td>
          </tr>
        ) : datas?.data?.length > 0 ? (
          datas.data.map((data, index) => (
            <tr
              key={data.id || index}
              className={`*:p-2 ${index % 2 === 0 ? "bg-[#F7FBFE]" : ""}`}
            >
              <td className="text-center">
                {(datas.current_page - 1) * datas.per_page + index + 1}
              </td>
              <td>{data.noPendaftaran}</td>
              <td>{data.noWajibRetribusi ?? "-"}</td>
              <td>{data.pemilik.namaPemilik}</td>
              <td>{data.namaObjekRetribusi}</td>
              <td className="max-w-sm truncate">{data.alamat}</td>
              <td>{data.kelurahan.namaKelurahan}</td>
              <td>{data.kecamatan.namaKecamatan}</td>
              <td>{data.kategori.namaKategori}</td>
              <td>{data.sub_kategori.namaSubKategori}</td>
              <td>{data.uptd.namaUptd}</td>
              <td>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(data.tarifPerbulan) || 0}
              </td>
              <td>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(data.tarifPertahun) || 0}
              </td>
              <td>{data.user.namaLengkap}</td>
              {data.status == "Rejected" && <td>{data.keterangan}</td>}
              <td>
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
              </td>
              <td
                className={`sticky right-0 top-0 ${index % 2 === 0 ? "bg-[#F7FBFE]" : "bg-white"}`}
              >
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
                    {/* <FileText size={20} /> Draft untuk di proses */}
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
