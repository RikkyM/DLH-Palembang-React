import TableHead from "@/Components/TableHead";
import { Link } from "@inertiajs/react";
import { FileText, Pencil, PencilLine, Send } from "lucide-react";

const Table = ({
  datas,
  search,
  columns,
  sort,
  setSort,
  direction,
  setDirection,
  isLoading,
  handleSendDiterima,
}) => {
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
              <td>{data.user.namaLengkap}</td>
              <td>
                <span
                  className={`select-none rounded py-2 font-medium ${
                    data.status == "Approved"
                      ? "text-teal-600"
                      : data.status == "Rejected"
                        ? "text-red-600"
                        : "text-amber-600"
                  }`}
                >
                  {data.status == "Approved"
                    ? "Diterima"
                    : data.status == "Rejected"
                      ? "Ditolak"
                      : "Diproses"}
                </span>
              </td>
              <td>
                <div className="flex gap-2 *:rounded *:text-sm *:font-medium">
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
                    {/* <FileText size={20} /> Draft untuk di proses */}
                    <FileText size={20} /> Draft SKRD
                  </button>
                  {/* <button
                    onClick={(e) => {
                      e.stopPropagation();

                      window.open(
                        route("super-admin.wajib-retribusi.export-single", {
                          id: data.id,
                        }),
                        "_blank",
                      );
                    }}
                    className="flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <FileText size={20} /> Excel
                  </button> */}
                  {data.status === "Approved" && (
                    <>
                      <Link
                        href={route("super-admin.wajib-retribusi.edit", {
                          retribusi: data.noPendaftaran,
                        })}
                        className="flex items-center gap-1.5"
                      >
                        <PencilLine size={20} /> Edit
                      </Link>
                      <button
                        onClick={(e) => handleSendDiterima(e, data.id)}
                        className="flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Send size={20} /> Kirim
                      </button>
                    </>
                  )}
                  {data.status === "Rejected" && (
                    <>
                      <button className="flex items-center gap-1.5 whitespace-nowrap">
                        <Pencil size={20} /> Edit
                      </button>
                      <button className="flex items-center gap-1.5 whitespace-nowrap">
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
