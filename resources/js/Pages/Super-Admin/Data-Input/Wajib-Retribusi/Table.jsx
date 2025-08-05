import TableHead from "@/Components/TableHead";
import { FileText, Send } from "lucide-react";

const Table = ({ datas, search, columns, sort, setSort, direction, setDirection, isLoading }) => {
    return (
        <table className="p-3 min-w-full divide-y divide-gray-300">
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
            <tbody className="text-xs md:text-sm dividfe-y divide-neutral-300">
                {isLoading ? (
                    <tr>
                        <td colSpan={14}>
                            <div className="flex justify-center items-center gap-2 text-sm text-gray-500 mb-2 px-2 h-16">
                                <svg
                                    className="w-4 h-4 animate-spin"
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
                            className={`*:p-2 ${
                                index % 2 === 0 ? "bg-[#F7FBFE]" : ""
                            }`}
                        >
                            <td className="text-center">
                                {(datas.current_page - 1) * datas.per_page +
                                    index +
                                    1}
                            </td>
                            <td>{data.noPendaftaran}</td>
                            <td>{data.noWajibRetribusi ?? "-"}</td>
                            <td>{data.pemilik.namaPemilik}</td>
                            <td>{data.namaObjekRetribusi}</td>
                            <td className="truncate max-w-sm">{data.alamat}</td>
                            <td>{data.kelurahan.namaKelurahan}</td>
                            <td>{data.kecamatan.namaKecamatan}</td>
                            <td>{data.kategori.namaKategori}</td>
                            <td>{data.sub_kategori.namaSubKategori}</td>
                            <td>{data.uptd.namaUptd}</td>
                            <td>{data.user.namaLengkap}</td>
                            <td>
                                <span
                                    className={`py-2 rounded font-medium select-none ${
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
                                <div className="flex gap-2 *:rounded *:font-medium *:text-sm">
                                    <button className="whitespace-nowrap flex items-center gap-1.5">
                                        <FileText size={20} /> Form
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            window.open(
                                                route(
                                                    "super-admin.wajib-retribusi.export-single",
                                                    { id: data.id }
                                                ),
                                                "_blank"
                                            );
                                        }}
                                        className="whitespace-nowrap flex items-center gap-1.5"
                                    >
                                        <FileText size={20} /> Excel
                                    </button>
                                    {data.status === "Approved" && (
                                        <button className="whitespace-nowrap flex items-center gap-1.5">
                                            <Send size={20} /> Kirim
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td
                            colSpan="13"
                            className="text-center py-8 text-center text-gray-500"
                        >
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
