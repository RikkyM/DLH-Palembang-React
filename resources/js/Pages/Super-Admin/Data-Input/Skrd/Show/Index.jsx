import React from "react";
import Layout from "../../../Layout";

const Index = ({ data, bulan }) => {
    return (
        <Layout title={data.namaObjekRetribusi}>
            <section className="p-3">
                <div className="grid grid-cols-2 md:gap-2 md:flex-row md:items-center justify-between w-full mb-3 bg-white p-5 rounded">
                    <div className="text-sm flex gap-2 items-center col-span-2">
                        <button
                            onClick={() => {
                                window.open(
                                    route(
                                        "super-admin.skrd.download-data-pdf",
                                        {
                                            id: data.id,
                                        }
                                    ),
                                    "_blank"
                                );
                            }}
                            className="bg-red-500 px-3 py-1.5 rounded text-sm text-white font-medium"
                        >
                            PDF
                        </button>
                        <button
                            onClick={() => {
                                window.open(
                                    route(
                                        "super-admin.skrd.download-data-excel",
                                        { id: data.id }
                                    ),
                                    "_blank"
                                );
                            }}
                            className="px-3 py-1.5 bg-green-700 transition duration-300 rounded text-white text-sm font-medium "
                        >
                            Excel
                        </button>
                    </div>
                    <h2 className="col-span-2 font-semibold">Informasi</h2>
                    <div className="grid grid-cols-2 col-span-2 text-sm">
                        <p>Nama Pemilik :</p>
                        <p>{data.pemilik.namaPemilik}</p>
                    </div>
                    <div className="grid grid-cols-2 col-span-2 text-sm">
                        <p>Nomor Induk Kependudukan (NIK) :</p>
                        <p>{data.pemilik.nik}</p>
                    </div>
                    <div className="grid grid-cols-2 col-span-2 text-sm">
                        <p>Alamat :</p>
                        <p>{data.pemilik.alamat}</p>
                    </div>
                    <div className="grid grid-cols-2 col-span-2 text-sm">
                        <p>Nomor Handphone :</p>
                        <p>{data.pemilik.noHP}</p>
                    </div>
                    <div className="grid grid-cols-2 col-span-2 text-sm">
                        <p>Jabatan :</p>
                        <p>{data.pemilik.jabatan}</p>
                    </div>
                    <h2 className="col-span-2 font-semibold">UPTD</h2>
                    <div className="grid grid-cols-2 col-span-2 text-sm">
                        <p>Wilayah UPTD :</p>
                        <p>{data.uptd.namaUptd}</p>
                    </div>
                    <h2 className="col-span-2 font-semibold">
                        Wajib Retribusi
                    </h2>
                    <div className="grid grid-cols-2 col-span-2 text-sm">
                        <p>Nomor SKRD :</p>
                        <p>{data.noSkrd}</p>
                    </div>
                    <div className="grid grid-cols-2 col-span-2 text-sm">
                        <p>Nomor Wajib Retribusi :</p>
                        <p>{data.noWajibRetribusi}</p>
                    </div>
                    <div className="grid grid-cols-2 col-span-2 text-sm">
                        <p>Nama Objek Retribusi :</p>
                        <p>{data.namaObjekRetribusi}</p>
                    </div>
                    <div className="grid grid-cols-2 col-span-2 text-sm">
                        <p>Alamat :</p>
                        <p>{data.alamatObjekRetribusi}</p>
                    </div>
                    <div className="grid grid-cols-2 col-span-2 text-sm">
                        <p>Kecamatan :</p>
                        <p>{data.kecamatanObjekRetribusi}</p>
                    </div>
                    <div className="grid grid-cols-2 col-span-2 text-sm">
                        <p>Kelurahan :</p>
                        <p>{data.kelurahanObjekRetribusi}</p>
                    </div>
                    <div className="grid grid-cols-2 col-span-2 text-sm">
                        <p>Klasifikasi - Objek :</p>
                        <p>{data.namaKategori}</p>
                    </div>
                    <div className="grid grid-cols-2 col-span-2 text-sm">
                        <p>Kelas :</p>
                        <p>{data.namaSubKategori}</p>
                    </div>
                    <div className="grid grid-cols-2 col-span-2 text-sm">
                        <p>Jenis/Deskripsi :</p>
                        <p>{data.deskripsiUsaha}</p>
                    </div>
                    <div className="grid grid-cols-2 col-span-2 text-sm">
                        <p>Per Bulan :</p>
                        <p>{data.tarifPerBulanObjekRetribusi}</p>
                    </div>
                    <div className="grid grid-cols-2 col-span-2 text-sm">
                        <p>Per Tahun :</p>
                        <p>{data.tarifPerTahunObjekRetribusi}</p>
                    </div>
                    <div className="grid grid-cols-2 col-span-2 text-sm overflow-x-auto mt-5">
                        <table className="w-full col-span-2 divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    {bulan.map((b, idx) => (
                                        <React.Fragment key={idx}>
                                            <th className="truncate font-semibold px-4">
                                                {b}
                                            </th>
                                            <th className="truncate font-semibold px-4">
                                                Tanggal Bayar
                                            </th>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {bulan.map((_, bulanIndex) => {
                                        const pembayaranUntukBulan =
                                            data.pembayaran.find((item) =>
                                                item.pembayaranBulan.includes(
                                                    bulanIndex + 1
                                                )
                                            );

                                        return (
                                            <React.Fragment key={bulanIndex}>
                                                <td className="text-center py-2">{pembayaranUntukBulan ? bulanIndex + 1 : "-" }</td>
                                                <td
                                                    className="text-center"
                                                >
                                                    {pembayaranUntukBulan
                                                        ? new Date(
                                                              pembayaranUntukBulan.tanggalBayar
                                                          ).toLocaleDateString(
                                                              "id-ID"
                                                          )
                                                        : "-"}
                                                </td>
                                            </React.Fragment>
                                        );
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Index;
