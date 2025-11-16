import { useState } from "react";

const namaBulanID = (i) =>
  new Date(0, i).toLocaleString("id-ID", { month: "long" });

const Step3 = ({ data, previewData }) => {
  const [zoom, setZoom] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageClick = () => {
    if (data.buktiBayar && data.buktiBayar.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(data.buktiBayar));
      setZoom(true);
    }
  };

  const handleCloseZoom = () => {
    setZoom(false);
  };

  return (
    <>
      <div className="space-y-3 rounded bg-white px-3 py-5">
        <div>
          <h2 className="text-sm font-semibold lg:text-base">
            Konfirmasi Pembayaran
          </h2>
          <p className="text-xs md:text-sm">
            Periksa kembali data yang telah dimasukkan sebelum menyimpan
          </p>
        </div>
        <div className="grid w-full gap-3 lg:grid-cols-2">
          <div className="w-full">
            <h2 className="text-sm font-semibold lg:text-base">Data SPKRD</h2>
            <table className="table w-full table-auto border-collapse text-xs">
              <tbody>
                <tr>
                  <td className="whitespace-nowrap align-top">Nomor SPKRD</td>
                  <td className="px-1.5 align-top">:</td>
                  <td>{previewData?.noSkrd}</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap align-top">
                    Nomor Objek Retribusi
                  </td>
                  <td className="px-1.5 align-top">:</td>
                  <td>{previewData?.noWajibRetribusi}</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap align-top">
                    Nama Objek Retribusi
                  </td>
                  <td className="px-1.5 align-top">:</td>
                  <td className="align-top">
                    {previewData?.namaObjekRetribusi}
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap align-top">
                    Alamat Objek Retribusi
                  </td>
                  <td className="px-1.5 align-top">:</td>
                  <td className="align-top">{previewData?.alamat}</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap align-top">
                    Kecamatan Objek Retribusi
                  </td>
                  <td className="px-1.5 align-top">:</td>
                  <td className="align-top">{previewData?.kecamatan}</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap align-top">Kelurahan</td>
                  <td className="px-1.5 align-top">:</td>
                  <td className="align-top">{previewData?.kelurahan}</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap align-top">
                    Tarif Perbulan
                  </td>
                  <td className="px-1.5 align-top">:</td>
                  <td className="align-top">
                    {Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(previewData?.tarifPerbulan)}
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap align-top">
                    Tarif Pertahun
                  </td>
                  <td className="px-1.5 align-top">:</td>
                  <td className="align-top">
                    {Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(previewData?.tarifPertahun)}
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap align-top">
                    Keterangan Bulan
                  </td>
                  <td className="px-1.5 align-top">:</td>
                  <td className="align-top">
                    {previewData?.keteranganBulan ?? "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-full">
            <h2 className="text-sm font-semibold lg:text-base">
              Data Pembayaran
            </h2>
            <table className="table w-full table-auto border-collapse text-xs">
              <tbody>
                <tr>
                  <td className="whitespace-nowrap align-top">Metode Setor</td>
                  <td className="px-1.5 align-top">:</td>
                  <td className="align-top">{data.metodeBayar}</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap align-top">Nama Bank</td>
                  <td className="px-1.5 align-top">:</td>
                  <td className="align-top">{data.namaBank}</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap align-top">Tanggal Bayar</td>
                  <td className="px-1.5 align-top">:</td>
                  <td>
                    {data.tanggalBayar
                      ? new Intl.DateTimeFormat("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(data.tanggalBayar))
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap align-top">Jumlah Setor</td>
                  <td className="px-1.5 align-top">:</td>
                  <td>
                    {Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(data.jumlahBayar)}
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap align-top">Jumlah Bulan</td>
                  <td className="px-1.5 align-top">:</td>
                  <td className="align-top">{data.jumlahBulanBayar} Bulan</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap align-top">
                    Nomor Referensi Bank
                  </td>
                  <td className="px-1.5 align-top">:</td>
                  <td className="align-top">{data.noReferensiBank}</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap align-top">Nama Pengirim</td>
                  <td className="px-1.5 align-top">:</td>
                  <td className="align-top">{data.namaPengirim}</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap align-top">
                    Keterangan Bulan
                  </td>
                  <td className="px-1.5 align-top">:</td>
                  <td className="align-top">{data.keteranganBulan ?? "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="lg:col-span-2">
            <h2
              className={`py-0.5 font-semibold ${data.buktiBayar && data.buktiBayar.type.startsWith("image/") ? "text-center" : "text-left"}`}
            >
              Bukti Bayar
            </h2>
            {data.buktiBayar ? (
              data.buktiBayar.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(data.buktiBayar)}
                  alt="Bukti Bayar"
                  className="mx-auto max-h-72 cursor-pointer transition-transform hover:scale-105"
                  onClick={handleImageClick}
                  title="Klik untuk memperbesar"
                />
              ) : (
                <a
                  href={URL.createObjectURL(data.buktiBayar)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Lihat Bukti Bayar
                </a>
              )
            ) : (
              "-"
            )}
          </div>
        </div>
        <div className="overflow-auto">
          <h2 className="mb-2 text-sm font-semibold lg:text-base">
            Detail Pembayaran
          </h2>
          <table className="w-full">
            <thead>
              <tr className="*:truncate *:px-2 *:text-sm *:text-xs">
                <th>No.</th>
                <th className="text-left">Bulan</th>
                <th className="text-center">Tanggal Bayar</th>
                <th className="text-left">Jumlah Bayar</th>
                <th className="text-left">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 12 }, (_, i) => {
                const row = data.detailSetoran?.[i] ?? {
                  ...data,
                  tanggalBayar: "",
                  jumlah: "",
                  keterangan: "",
                };

                return (
                  <tr key={i} className="*:px-2 *:py-1.5">
                    <td className="text-center">{i + 1}</td>
                    <td className="text-sm lg:text-base">{namaBulanID(i)}</td>
                    <td className="px-1 text-center text-sm lg:text-base">
                      {row.tanggalBayar
                        ? new Date(row.tanggalBayar).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "-"}
                    </td>
                    <td className="text-sm lg:text-base">
                      {Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(row.jumlah)}
                    </td>
                    <td className="text-sm lg:text-base">
                      {row.keterangan ? row.keterangan : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Zoom */}
      {zoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
          onClick={handleCloseZoom}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <button
              className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xl font-bold text-gray-800 shadow-lg hover:bg-gray-200"
              onClick={handleCloseZoom}
              title="Tutup"
            >
              ×
            </button>
            <img
              src={previewUrl}
              alt="Bukti Bayar - Zoom"
              className="max-h-[90vh] max-w-full rounded object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Step3;
