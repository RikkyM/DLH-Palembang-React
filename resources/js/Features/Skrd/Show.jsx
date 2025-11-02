import { roleConfig } from "@/Constants/RoleConfig";
import { Check, EllipsisVertical } from "lucide-react";
import React from "react";

const Show = ({ user, data, bulan }) => {
  const findUser = (usr) => {
    return user.find((item) => item.id === usr.userId);
  };

  const getMessageHistory = {
    Submited: "Pendaftaran Retribusi",
    Send: "Dikirim",
    Approved: "Diterima",
    Rejected: "Ditolak",
    Finished: "Disetujui",
  };

  return (
    <section className="p-3">
      <div className="mb-3 grid w-full grid-cols-2 justify-between rounded bg-white p-5 md:flex-row md:items-center md:gap-2">
        <div className="col-span-2 flex items-center gap-2 text-sm">
          <button
            onClick={() => {
              window.open(
                route("skrd.pdf", {
                  filename: data.fileSkrd,
                }),
                "_blank",
              );
            }}
            className="rounded bg-red-500 px-3 py-1.5 text-sm font-medium text-white"
          >
            PDF
          </button>
          <button
            onClick={() => {
              window.open(
                route("skrd.download-data-excel", {
                  id: data.id,
                }),
                "_blank",
              );
            }}
            className="rounded bg-green-700 px-3 py-1.5 text-sm font-medium text-white transition duration-300"
          >
            Excel
          </button>
        </div>
        <h2 className="col-span-2 font-semibold">Informasi</h2>
        <div className="col-span-2 grid grid-cols-2 text-sm">
          <p>Nama Pemilik :</p>
          <p>{data.pemilik?.namaPemilik ?? "-"}</p>
        </div>
        <div className="col-span-2 grid grid-cols-2 text-sm">
          <p>Nomor Induk Kependudukan (NIK) :</p>
          <p>{data.pemilik?.nik ?? "-"}</p>
        </div>
        <div className="col-span-2 grid grid-cols-2 text-sm">
          <p>Alamat :</p>
          <p>{data.pemilik?.alamat ?? "-"}</p>
        </div>
        <div className="col-span-2 grid grid-cols-2 text-sm">
          <p>Nomor Handphone :</p>
          <p>{data.pemilik?.noHP ?? "-"}</p>
        </div>
        <div className="col-span-2 grid grid-cols-2 text-sm">
          <p>Jabatan :</p>
          <p>{data.pemilik?.jabatan ?? "-"}</p>
        </div>
        <h2 className="col-span-2 font-semibold">UPTD</h2>
        <div className="col-span-2 grid grid-cols-2 text-sm">
          <p>Wilayah UPTD :</p>
          <p>{data.uptd.namaUptd}</p>
        </div>
        <h2 className="col-span-2 font-semibold">Wajib Retribusi</h2>
        <div className="col-span-2 grid grid-cols-2 text-sm">
          <p>Nomor SKRD :</p>
          <p>{data.noSkrd}</p>
        </div>
        <div className="col-span-2 grid grid-cols-2 text-sm">
          <p>Nomor Wajib Retribusi :</p>
          <p>{data.noWajibRetribusi}</p>
        </div>
        <div className="col-span-2 grid grid-cols-2 text-sm">
          <p>Nama Objek Retribusi :</p>
          <p>{data.namaObjekRetribusi}</p>
        </div>
        <div className="col-span-2 grid grid-cols-2 text-sm">
          <p>Alamat :</p>
          <p>{data.alamatObjekRetribusi}</p>
        </div>
        <div className="col-span-2 grid grid-cols-2 text-sm">
          <p>Kecamatan :</p>
          <p>{data.kecamatanObjekRetribusi}</p>
        </div>
        <div className="col-span-2 grid grid-cols-2 text-sm">
          <p>Kelurahan :</p>
          <p>{data.kelurahanObjekRetribusi}</p>
        </div>
        <div className="col-span-2 grid grid-cols-2 text-sm">
          <p>Klasifikasi - Objek :</p>
          <p>{data.namaKategori}</p>
        </div>
        <div className="col-span-2 grid grid-cols-2 text-sm">
          <p>Kelas :</p>
          <p>{data.namaSubKategori}</p>
        </div>
        <div className="col-span-2 grid grid-cols-2 text-sm">
          <p>Jenis/Deskripsi :</p>
          <p>{data.deskripsiUsaha}</p>
        </div>
        <div className="col-span-2 grid grid-cols-2 text-sm">
          <p>Per Bulan :</p>
          <p>{data.tarifPerBulanObjekRetribusi}</p>
        </div>
        <div className="col-span-2 grid grid-cols-2 text-sm">
          <p>Per Tahun :</p>
          <p>{data.tarifPerTahunObjekRetribusi}</p>
        </div>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <h2 className="font-bold">
            Pembayaran Tahun {new Date(data.created_at).getFullYear()}:
          </h2>
          <table className="w-full">
            <tbody className="w-full">
              {bulan.map((bulan, i) => {
                const pembayaranBulan =
                  data.pembayaran.find((item) =>
                    item.pembayaranBulan.includes(i + 1),
                  ) ??
                  data.detail_setoran.find(
                    (d) => d.namaBulan.toLowerCase() === bulan.toLowerCase(),
                  );

                return (
                  <tr key={i} className="w-full">
                    <td>{bulan}</td>
                    <td>:</td>
                    <td>
                      {pembayaranBulan
                        ? new Date(
                            pembayaranBulan.tanggalBayar,
                          ).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                    <td>{pembayaranBulan?.keterangan || "-"}</td>
                    <td>
                      {pembayaranBulan &&
                      pembayaranBulan?.setoran?.buktiBayar ? (
                        <a
                          href={route("bukti-bayar", {
                            filename: pembayaranBulan?.setoran?.buktiBayar,
                          })}
                          target="_blank"
                          rel="noopener"
                          className="hover:underline"
                        >
                          Lihat Bukti Bayar
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="col-span-2 grid grid-cols-1 gap-2 text-sm">
          <h2 className="font-bold">History Retribusi</h2>
          {data.historyAction && data.historyAction.length > 0
            ? JSON.parse(data.historyAction).map((d, i) => {
                return (
                  <React.Fragment key={i}>
                    <div className="w-full max-w-96 capitalize">
                      <div className="flex gap-1.5 rounded bg-[#B3CEAF] p-3">
                        <div className="flex h-max max-w-max justify-center self-center rounded-full border-[1px] border-green-400 bg-green-300 p-1">
                          {d.action !== "Rejected" ? (
                            <div className="flex h-max w-max items-center rounded-full border-[1px] border-green-500 bg-green-300 p-1">
                              <Check className="max-h-3 max-w-3 stroke-2 text-green-500 lg:max-h-5 lg:max-w-5" />
                            </div>
                          ) : (
                            d.action
                          )}
                        </div>
                        <div className="font-semibold">
                          <h3 className="text-xs md:text-sm">
                            {getMessageHistory[d.action] ?? "-"}
                          </h3>
                          <p className="text-xs font-medium">
                            {new Date(d.actionDate).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "2-digit",
                              },
                            )}
                          </p>
                          <p className="flex flex-wrap items-center text-xs">
                            {findUser(d).namaLengkap}
                            <span className="flex items-center font-medium">
                              <span className="px-1">•</span>
                              {roleConfig[findUser(d).role]}
                            </span>
                          </p>
                        </div>
                      </div>
                      {d.action !== "Finished" && (
                        <div className="flex w-full justify-center bg-transparent p-1">
                          <EllipsisVertical />
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                );
              })
            : "-"}
        </div>
      </div>
    </section>
  );
};

export default Show;
