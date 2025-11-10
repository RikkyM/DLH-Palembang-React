import { router } from "@inertiajs/react";
import { FileText } from "lucide-react";
import React, { memo } from "react";

const Table = ({
  TableHead,
  columns,
  sort,
  setSort,
  direction,
  setDirection,
  bulan,
  datas,
  fmtIDR,
  paidEffective,
  sisaTagihan,
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
      <tbody className="divide-y divide-neutral-300 text-xs md:text-sm">
        {(datas?.data ?? datas)?.length > 0 ? (
          (datas?.data ?? datas).map((data, index) => (
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
              <td>{data.noWajibRetribusi}</td>
              <td>{data.noSkrd}</td>
              <td>
                {new Date(data.created_at)
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, "-")}
              </td>
              <td>{data.namaObjekRetribusi}</td>
              <td>
                <div className="w-72">{data.alamatObjekRetribusi}</div>
              </td>
              <td>{data.kelurahanObjekRetribusi}</td>
              <td>{data.kecamatanObjekRetribusi}</td>
              <td>{data.namaKategori}</td>
              <td className="min-w-32">{data.namaSubKategori}</td>
              <td>{data.deskripsiUsaha}</td>
              <td>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(data.tagihanPerBulanSkrd ?? 0)}
              </td>
              <td>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(data.tagihanPerTahunSkrd ?? 0)}
              </td>
              <td>{fmtIDR(paidEffective(data))}</td>
              <td>{fmtIDR(sisaTagihan(data))}</td>
              <td>{data.namaPendaftar ?? '-'}</td>
              <td>{data.namaPenagih ?? "-"}</td>
              <td className="text-left">
                {sisaTagihan(data) === 0 ? (
                  <span className="truncate rounded px-2 py-1 text-green-700">
                    Lunas
                  </span>
                ) : (
                  <span className="truncate rounded px-2 py-1 text-red-700">
                    Belum Lunas
                  </span>
                )}
              </td>
              {bulan.map((_, i) => {
                const pembayaranUntukBulan =
                  data.pembayaran.find((item) =>
                    item.pembayaranBulan.includes(i + 1),
                  ) ??
                  data.detail_setoran.find(
                    (d) =>
                      d.namaBulan.toLowerCase() === bulan[i].toLowerCase() &&
                      d.setoran.status === "Approved",
                  );

                return (
                  <React.Fragment key={i}>
                    <td className="text-center">
                      {pembayaranUntukBulan
                        ? fmtIDR(data.tagihanPerBulanSkrd ?? "-")
                        : "-"}
                      {/* {fmtIDR(data.tagihanPerBulanSkrd ?? "-")} */}
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
              <td
                className={`sticky right-0 ${index % 2 === 0 ? "bg-[#B3CEAF]" : "bg-white"}`}
              >
                <div className="flex flex-wrap gap-2 *:rounded *:text-xs *:font-medium *:sm:text-sm">
                  {/* <button className="flex items-center gap-1.5 outline-none">
                                                    <PencilLine size={20} />{" "}
                                                    Edit
                                                </button> */}
                  <button
                    type="button"
                    className="flex items-center gap-1.5 whitespace-nowrap outline-none"
                    onClick={(e) => {
                      e.preventDefault();
                      if (data.fileSkrd !== null) {
                        window.open(
                          route("skrd.pdf", {
                            filename: data.fileSkrd,
                          }),
                          "_blank",
                        );
                      }

                      if (data.fileSkrd === null) {
                        window.open(
                          route("skrd.download-data-pdf", {
                            id: data.id,
                          }),
                          "_blank",
                        );
                      }
                    }}
                  >
                    <FileText size={20} /> SKRD
                  </button>
                  <button
                    className="flex items-center gap-1.5 whitespace-nowrap outline-none"
                    onClick={() => {
                      window.open(
                        route("skrd.download-data-excel", {
                          id: data.id,
                        }),
                        "_blank",
                      );
                    }}
                  >
                    <FileText size={20} /> Excel
                  </button>
                  <button
                    onClick={() =>
                      router.get(route("super-admin.skrd.show", data.id))
                    }
                    className="flex items-center gap-1.5 whitespace-nowrap outline-none"
                  >
                    <FileText size={20} /> Detail
                  </button>
                  {/* <button
                              onClick={() =>
                                openModal(
                                  "history",
                                  JSON.parse(data.historyAction),
                                )
                              }
                              className="flex items-center gap-1.5 whitespace-nowrap outline-none"
                            >
                              <FileClock size={20} /> History
                            </button> */}
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="17" className="py-8 text-center text-gray-500">
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

export default memo(Table);
