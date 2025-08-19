import Layout from "../../../Layout";

const Index = ({ data, bulan }) => {
  return (
    <Layout title={data.namaObjekRetribusi}>
      <section className="p-3">
        <div className="mb-3 w-full rounded bg-white p-5">
          <div className="col-span-2 flex items-center gap-2 text-sm">
            <button
              onClick={() => {
                window.open(
                  route("pendaftar.skrd.download-data-pdf", {
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
                  route("pendaftar.skrd.download-data-excel", {
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
          <div className="max-w-5xl py-4">
            <h2 className="col-span-2 font-semibold">Informasi</h2>
            <div className="table w-full">
              <div className="table-row-group space-y-3">
                <div className="table-row">
                  <div className="table-cell w-96">Nama Pemilik</div>
                  <div className="table-cell py-1">:</div>
                  <div className="table-cell py-1">
                    {data.pemilik.namaPemilik}
                  </div>
                </div>
                <div className="table-row">
                  <div className="table-cell py-1">
                    Nomor Induk Kependudukan (NIK)
                  </div>
                  <div className="table-cell py-1">:</div>
                  <div className="table-cell py-1">{data.pemilik.nik}</div>
                </div>
                <div className="table-row">
                  <div className="table-cell py-1">Alamat</div>
                  <div className="table-cell py-1">:</div>
                  <div className="table-cell py-1">{data.pemilik.alamat}</div>
                </div>
                <div className="table-row">
                  <div className="table-cell py-1">Nomor Handphone</div>
                  <div className="table-cell py-1">:</div>
                  <div className="table-cell py-1">{data.pemilik.noHP}</div>
                </div>
                <div className="table-row">
                  <div className="table-cell py-1">Jabatan</div>
                  <div className="table-cell py-1">:</div>
                  <div className="table-cell py-1">{data.pemilik.jabatan}</div>
                </div>
                <h2 className="font-semibold">UPTD</h2>
                <div className="table-row">
                  <div className="table-cell py-1">Wilayah UPTD</div>
                  <div className="table-cell py-1">:</div>
                  <div className="table-cell py-1">{data.uptd.namaUptd}</div>
                </div>
                <h2 className="font-semibold">Wajib Retribusi</h2>
                <div className="table-row">
                  <div className="table-cell py-1">Nomor SKRD</div>
                  <div className="table-cell py-1">:</div>
                  <div className="table-cell py-1">{data.noSkrd}</div>
                </div>
                <div className="table-row">
                  <div className="table-cell py-1">Nomor Wajib Retribusi</div>
                  <div className="table-cell py-1">:</div>
                  <div className="table-cell py-1">{data.noWajibRetribusi}</div>
                </div>
                <div className="table-row">
                  <div className="table-cell py-1">Nama Objek Retribusi</div>
                  <div className="table-cell py-1">:</div>
                  <div className="table-cell py-1">
                    {data.namaObjekRetribusi}
                  </div>
                </div>
                <div className="table-row">
                  <div className="table-cell py-1">Alamat</div>
                  <div className="table-cell py-1">:</div>
                  <div className="table-cell py-1">
                    {data.alamatObjekRetribusi}
                  </div>
                </div>
                <div className="table-row">
                  <div className="table-cell py-1">Kecamatan</div>
                  <div className="table-cell py-1">:</div>
                  <div className="table-cell py-1">
                    {data.kecamatanObjekRetribusi}
                  </div>
                </div>
                <div className="table-row">
                  <div className="table-cell py-1">Klasifikasi - Objek</div>
                  <div className="table-cell py-1">:</div>
                  <div className="table-cell py-1">{data.namaKategori}</div>
                </div>
                <div className="table-row">
                  <div className="table-cell py-1">Kelas</div>
                  <div className="table-cell py-1">:</div>
                  <div className="table-cell py-1">{data.namaSubKategori}</div>
                </div>
                <div className="table-row">
                  <div className="table-cell py-1">Jenis/Deskripsi</div>
                  <div className="table-cell py-1">:</div>
                  <div className="table-cell py-1">{data.deskripsiUsaha}</div>
                </div>
                <div className="table-row">
                  <div className="table-cell py-1">Per Bulan</div>
                  <div className="table-cell py-1">:</div>
                  <div className="table-cell py-1">
                    {data.tarifPerBulanObjekRetribusi}
                  </div>
                </div>
                <div className="table-row">
                  <div className="table-cell py-1">Per Tahun</div>
                  <div className="table-cell py-1">:</div>
                  <div className="table-cell py-1">
                    {data.tarifPerTahunObjekRetribusi}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid w-max grid-cols-1 gap-2">
              <h2 className="font-semibold">
                Pembayaran Tahun {new Date(data.created_at).getFullYear()}:
              </h2>
              {bulan.map((bulan, i) => {
                const pembayaranBulan = data.pembayaran.find((item) =>
                  item.pembayaranBulan.includes(i + 1),
                );
                return (
                  <div key={i} className="grid grid-cols-3">
                    <span>{bulan} </span>
                    <span>:</span>
                    <span>
                      {pembayaranBulan
                        ? new Date(
                            pembayaranBulan.tanggalBayar,
                          ).toLocaleDateString("id-ID")
                        : "-"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
