import Layout from "../../Layout";

const bulanId = (i) =>
  new Date(0, i).toLocaleDateString("id-ID", { month: "long" });

const Detail = ({ data }) => {
  return (
    <Layout title="Detail Setoran">
      <section className="h-[calc(100dvh_-_80px)] touch-pan-y overflow-auto p-3">
        <div className="rounded border bg-white p-3 shadow">
          <h2 className="mb-3 text-sm font-semibold md:text-base">
            Nomor Nota: {data.nomorNota}
          </h2>
          <div className="grid gap-2 lg:grid-cols-2">
            <div className="text-sm">
              <h2 className="font-semibold lg:text-base">Data SPKRD</h2>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td>Nomor SPKRD</td>
                    <td>:</td>
                    <td>{data.skrd.noSkrd}</td>
                  </tr>
                  <tr>
                    <td>Nomor Objek Retribusi</td>
                    <td>:</td>
                    <td>{data.skrd.noWajibRetribusi}</td>
                  </tr>
                  <tr>
                    <td>Nama Objek Retribusi</td>
                    <td>:</td>
                    <td>{data.skrd.namaObjekRetribusi}</td>
                  </tr>
                  <tr>
                    <td>Alamat</td>
                    <td>:</td>
                    <td>{data.skrd.alamatObjekRetribusi}</td>
                  </tr>
                  <tr>
                    <td>Kecamatan</td>
                    <td>:</td>
                    <td>{data.skrd.kecamatanObjekRetribusi}</td>
                  </tr>
                  <tr>
                    <td>Kelurahan</td>
                    <td>:</td>
                    <td>{data.skrd.kelurahanObjekRetribusi}</td>
                  </tr>
                  <tr>
                    <td>Tarif Perbulan</td>
                    <td>:</td>
                    <td>
                      {Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(data.skrd.tagihanPerBulanSkrd)}
                    </td>
                  </tr>
                  <tr>
                    <td>Tarif Pertahun</td>
                    <td>:</td>
                    <td>
                      {Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(data.skrd.tagihanPerTahunSkrd)}
                    </td>
                  </tr>
                  <tr>
                    <td>Keterangan Bulan</td>
                    <td>:</td>
                    <td>{data.skrd.keteranganBulan ?? "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-sm">
              <h2 className="font-semibold lg:text-base">Data Pembayaran</h2>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td>Metode Setor</td>
                    <td>:</td>
                    <td>{data.metodeBayar}</td>
                  </tr>
                  <tr>
                    <td>Nama Bank</td>
                    <td>:</td>
                    <td>{data.namaBank}</td>
                  </tr>
                  <tr>
                    <td>Tanggal Bayar</td>
                    <td>:</td>
                    <td>
                      {data.tanggalBayar
                        ? new Date(data.tanggalBayar).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            },
                          )
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Jumlah Bayar</td>
                    <td>:</td>
                    <td>
                      {Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(data.jumlahBayar)}
                    </td>
                  </tr>
                  <tr>
                    <td>Jumlah Bulan</td>
                    <td>:</td>
                    <td>{data.jumlahBulan} Bulan</td>
                  </tr>
                  <tr>
                    <td>Nomor Referensi Bank</td>
                    <td>:</td>
                    <td>{data.noRef}</td>
                  </tr>
                  <tr>
                    <td>Nama Pengirim</td>
                    <td>:</td>
                    <td>{data.namaPenyetor}</td>
                  </tr>
                  <tr>
                    <td>Keterangan Bulan</td>
                    <td>:</td>
                    <td>{data.keteranganBulan}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="lg:col-span-2">
              <h2
                className={`py-0.5 text-sm font-semibold lg:text-base ${data.buktiBayar && data.buktiBayar.endsWith("pdf") ? "text-left" : "text-center"}`}
              >
                Bukti Bayar
              </h2>
              {data.buktiBayar ? (
                data.buktiBayar.endsWith(".pdf") ? (
                  <a
                    href={route("bukti-bayar", {
                      filename: data.buktiBayar,
                    })}
                    target="_blank"
                    rel="noopener"
                    className="text-sm lg:text-base"
                  >
                    Lihat Bukti Bayar
                  </a>
                ) : (
                  <>
                    <img
                      src={route("bukti-bayar", {
                        filename: data.buktiBayar,
                      })}
                      alt="Bukti Bayar"
                      className="mx-auto max-h-72 select-none"
                    />
                  </>
                )
              ) : (
                "-"
              )}
            </div>
            <h2 className="text-sm font-semibold lg:text-base">
              Detail Pembayaran
            </h2>
            <div className="overflow-auto lg:col-span-2">
              <table className="w-full">
                <thead>
                  <tr className="*:whitespace-nowrap *:px-2 *:text-xs *:lg:text-sm">
                    <th>No.</th>
                    <th className="text-left">Bulan</th>
                    <th className="text-left">Tanggal Bayar</th>
                    <th className="text-center">Jumlah Bayar</th>
                    <th className="text-left">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {data.detail_setoran.map((detail, i) => {
                    return (
                      <tr key={i} className="*:px-2 *:text-sm *:lg:text-base">
                        <td className="text-center">{i + 1}</td>
                        <td>{detail.namaBulan}</td>
                        <td className="whitespace-nowrap">
                          {detail.tanggalBayar
                            ? new Date(detail.tanggalBayar).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "-"}
                        </td>
                        <td className="text-center">
                          {Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(detail.jumlahBayar)}
                        </td>
                        <td>{detail.keteranganBulan ?? "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* <tbody>
                  {Array.from({ length: 12 }, (_, i) => {
                    const setoran =
                      data.detail_setoran.find(
                        (d) =>
                          d.namaBulan.toLowerCase() ===
                          bulanId(i).toLowerCase(),
                      ) ?? "-";

                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{bulanId(i)}</td>
                        <td>
                          {setoran.tanggalBayar
                            ? new Date(setoran.tanggalBayar).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "-"}
                        </td>
                        <td className="text-center">
                          {setoran.jumlahBayar
                            ? Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                              }).format(setoran.jumlahBayar)
                            : "-"}
                        </td>
                        <td>{setoran.keteranganBulan ?? "-"}</td>
                        <td>
                          <a href="" rel="noopener noreferrer">{data.buktiBayar}</a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody> */}
                {/* <tbody>
                  {BULAN.map((bulan, i) => {
                    const detail = getDetailMonth(i) ?? "-";
                    console.log(detail);
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{bulan}</td>
                        <td>{detail.tanggalBayar}</td>
                      </tr>
                    );
                  })}
                </tbody> */}
                {/* <tbody>
                  {BULAN.map((namaBulan, i) => {
                    const rows = data.detail_setoran.filter(
                      (d) => d.namaBulan === namaBulan,
                    );

                    if (rows === 0) {
                      return (
                        <tr key={i}>
                          <td>{namaBulan}</td>
                          <td>-</td>
                          <td>-</td>
                          <td>-</td>
                        </tr>
                      );
                    }

                    return rows.map((r, idx) => (
                      <tr key={`${namaBulan}-${idx}`}>
                        {idx === 0 && (
                          <>
                            <td>{i + 1}</td>
                            <td>{namaBulan}</td>
                          </>
                        )}
                        <td>{r.tanggalBayar}</td>
                        <td>{r.jumlahBayar}</td>
                        <td>{r.keteranganBulan ?? "-"}</td>
                      </tr>
                    ));
                  })}
                </tbody> */}
              </table>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Detail;
