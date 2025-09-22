import Layout from "../../../Layout";

const Index = ({ data, bulan }) => {
  return (
    <Layout title={data.namaObjekRetribusi}>
      <section className="p-3">
        <div className="mb-3 grid w-full grid-cols-2 justify-between rounded bg-white p-5 md:flex-row md:items-center md:gap-2">
          <div className="col-span-2 flex items-center gap-2 text-sm">
            <button
              onClick={() => {
                window.open(
                  route("super-admin.skrd.download-data-pdf", {
                    id: data.id,
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
                  route("super-admin.skrd.download-data-excel", {
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
            <p>{data.pemilik.namaPemilik}</p>
          </div>
          <div className="col-span-2 grid grid-cols-2 text-sm">
            <p>Nomor Induk Kependudukan (NIK) :</p>
            <p>{data.pemilik.nik}</p>
          </div>
          <div className="col-span-2 grid grid-cols-2 text-sm">
            <p>Alamat :</p>
            <p>{data.pemilik.alamat}</p>
          </div>
          <div className="col-span-2 grid grid-cols-2 text-sm">
            <p>Nomor Handphone :</p>
            <p>{data.pemilik.noHP}</p>
          </div>
          <div className="col-span-2 grid grid-cols-2 text-sm">
            <p>Jabatan :</p>
            <p>{data.pemilik.jabatan}</p>
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
                              day: 'numeric',
                              month: "long",
                              year: "numeric"
                            })
                          : "-"}
                      </td>
                      <td>
                        {pembayaranBulan &&
                        pembayaranBulan?.setoran?.buktiBayar ? (
                          <a
                            href={route("super-admin.bukti-bayar", {
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
                        {/* <>{console.log(pembayaranBulan)}</>
                    {pembayaranBulan && pembayaranBulan.setoran.length > 0 && (
                      <>{console.log(pembayaranBulan.setoran.buktiBayar)}</>
                    )} */}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* <div className="grid grid-cols-2 col-span-2 text-sm overflow-x-auto mt-5">
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
                                                <td className="text-center py-2">
                                                    {pembayaranUntukBulan
                                                        ? bulanIndex + 1
                                                        : "-"}
                                                </td>
                                                <td className="text-center">
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
                    </div> */}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
