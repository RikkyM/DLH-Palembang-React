import MapPicker from "@/Components/MapPicker";
import { useForm } from "@inertiajs/react";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

const WajibRetribusiShow = ({
  kelurahanOptions = [],
  subKategoriOptions = [],
  retribusi,
}) => {
  const getSelectedSubKategori = () => {
    if (!data.kodeKategori || !data.kodeSubKategori) return null;

    const subKategoriList = subKategoriOptions[data.kodeKategori] || [];
    return subKategoriList.find((sub) => sub.value === data.kodeSubKategori);
  };

  const initialData = {
    // kodeKategori: retribusi.kodeKategori || "",
    // kodeSubKategori: retribusi.kodeSubKategori || "",
    variabelValues: {
      bulan: retribusi.bulan,
      unit: retribusi?.unit,
      m2: retribusi?.m2,
      giat: retribusi?.giat,
      hari: retribusi?.hari,
      meter: retribusi?.meter,
    },
  };

  const { data, setData, errors, clearErrors } = useForm(initialData);

  useEffect(() => {
    if (data.kodeKategori && data.kodeSubKategori) {
      const selectedSub = (subKategoriOptions[data.kodeKategori] || []).find(
        (sub) => sub.value === data.kodeSubKategori,
      );

      if (selectedSub) {
        const tarifValue =
          data.jenisTarif === "tarif2" ? selectedSub.tarif2 : selectedSub.tarif;

        const total = calculateTotal();

        setData((prev) => ({
          ...prev,
          tarifRetribusi: tarifValue || 0,
          totalRetribusi: total,
        }));
      }
    }
  }, []);

  // const filteredKelurahanOptions = kelurahanOptions[data.kodeKecamatan] || [];
  // const filteredSubKategoriOptions =
  //   subKategoriOptions[data.kodeKategori] || [];

  // const statusTempat = [
  //   { value: "MILIK SENDIRI", label: "MILIK SENDIRI" },
  //   { value: "SEWA", label: "SEWA" },
  // ];

  // const bentukUsaha = [
  //   { value: "Perorangan", label: "Perorangan" },
  //   { value: "CV", label: "CV" },
  //   { value: "PT", label: "PT" },
  //   { value: "Koperasi", label: "Koperasi" },
  //   { value: "BUMN", label: "BUMN" },
  //   { value: "Instansi Pemerintah", label: "Instansi Pemerintah" },
  //   { value: "FIRMA", label: "FIRMA" },
  // ];

  const calculateTotal = () => {
    const selectedSub = getSelectedSubKategori();
    if (!selectedSub) return 0;

    const tarif = parseInt(data.tarifRetribusi || 0);

    const variabelArray = Array.isArray(selectedSub.variabel)
      ? selectedSub.variabel
      : JSON.parse(selectedSub.variabel || "[]");

    if (selectedSub.rumus) {
      let formula = selectedSub.rumus;

      variabelArray.forEach((field) => {
        const value = parseInt(data.variabelValues?.[field] || 0);
        formula = formula.replaceAll(field, value || 0);
      });

      try {
        let result = Function(`"use strict"; return (${formula})`)();

        const bulan = parseInt(data.variabelValues?.bulan || 0);
        if (bulan > 0) result *= bulan;

        return (result || 0) * tarif;
      } catch (error) {
        console.error("Error evaluate formula:", error);
        return 0;
      }
    }

    let total = tarif;

    variabelArray.forEach((field) => {
      const value = parseInt(data.variabelValues?.[field] || 0);
      if (value > 0) total *= value;
    });

    const bulan = parseInt(data.variabelValues?.bulan || 0);
    if (bulan > 0) total *= bulan;

    return total || 0;
  };

  useEffect(() => {
    const total = calculateTotal();

    if (data.totalRetribusi !== total) {
      setData("totalRetribusi", total);
    }
  }, [
    data.variabelValues,
    data.tarifRetribusi,
    data.jenisTarif,
    data.kodeSubKategori,
  ]);

  return (
    <section className="p-3">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="col-span-2 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="flex flex-col gap-1.5 text-sm lg:col-span-1">
            <label htmlFor="namaObjekRetribusi">Nama Objek Retribusi</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 outline-none"
              type="text"
              id="namaObjekRetribusi"
              autoComplete="off"
              placeholder="Nama Objek Retribusi..."
              value={retribusi.namaObjekRetribusi}
              readOnly={true}
            />
          </div>
          <div className="flex flex-col gap-1.5 text-sm lg:col-span-1">
            <label htmlFor="nomorObjekRetribusi">Nomor Objek Retribusi</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 outline-none"
              type="text"
              id="nomorObjekRetribusi"
              autoComplete="off"
              placeholder="Nomor Objek Retribusi..."
              value={retribusi.noWajibRetribusi}
              readOnly={true}
            />
          </div>
          <div className="flex flex-col gap-1.5 text-sm lg:col-span-1">
            <label htmlFor="nomorObjekRetribusi">Tanggal SPKRD</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 outline-none"
              type="date"
              id="tanggalSkrd"
              value={retribusi.tanggalSkrd}
              readOnly={true}
            />
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-1.5 text-sm">
          <label htmlFor="pemohon">Pemohon</label>
          <input
            className="cursor-auto rounded bg-gray-200 px-3 py-2 capitalize outline-none"
            type="text"
            id="pemohon"
            value={retribusi.pemilik?.namaPemilik ?? "-"}
            disabled={true}
          />
        </div>
        <div className="col-span-2 flex flex-col gap-1.5 text-sm">
          <label htmlFor="alamatObjekRetribusi">Alamat Objek Retribusi</label>
          <input
            className="cursor-auto rounded bg-gray-200 px-3 py-2 outline-none"
            type="text"
            id="alamatObjekRetribusi"
            autoComplete="off"
            placeholder="contoh: Jalan Srikandi Nomor 16/ Lorong Asahan Nomor 38"
            value={retribusi.alamat}
            readOnly={true}
          />
        </div>

        <div className="col-span-2 grid grid-cols-1 gap-5 lg:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
            <label htmlFor="rt">RT</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 outline-none"
              type="text"
              id="rt"
              autoComplete="off"
              placeholder="RT"
              value={retribusi.rt ?? "-"}
              readOnly={true}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
            <label htmlFor="rw">RW</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 outline-none"
              type="text"
              id="rw"
              autoComplete="off"
              placeholder="RW"
              value={retribusi.rw ?? "-"}
              readOnly={true}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
            <label htmlFor="kecamatan">Kecamatan</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 capitalize outline-none"
              type="text"
              id="kecamatan"
              value={retribusi.kecamatan.namaKecamatan}
              disabled={true}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
            <label htmlFor="kelurahan">Kelurahan</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 capitalize outline-none"
              type="text"
              id="kelurahan"
              value={retribusi.kelurahan?.namaKelurahan ?? "-"}
              disabled={true}
            />
          </div>
        </div>

        <div className="col-span-2 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="flex flex-col gap-1.5 text-sm lg:col-span-1">
            <label htmlFor="bentukUsaha">Bentuk Badan Usaha</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 capitalize outline-none"
              type="text"
              id="bentukUsaha"
              value={retribusi.bentukBadanUsaha}
              disabled={true}
            />
          </div>
          <div className="flex flex-col gap-1.5 text-sm lg:col-span-1">
            <label htmlFor="deskripsi">Deskripsi Usaha</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 outline-none"
              type="text"
              id="deskripsi"
              placeholder="Deskripsi Usaha..."
              value={retribusi.deskripsiUsaha}
              readOnly={true}
            />
          </div>
        </div>

        <div className="col-span-2 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="flex flex-col gap-1.5 text-sm">
            <label htmlFor="layanan">Layanan</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 capitalize outline-none"
              type="text"
              id="layanan"
              value={retribusi.jenisTarif === "tarif" ? "Tarif 1" : "Tarif 2"}
              disabled={true}
            />
          </div>
          <div className="flex flex-col gap-1.5 text-sm lg:col-span-1">
            <label htmlFor="kategori">Kategori</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 outline-none"
              type="text"
              id="kategori"
              autoComplete="off"
              value={retribusi.kategori.namaKategori || ""}
              disabled={true}
            />
          </div>
          <div className="flex flex-col gap-1.5 text-sm lg:col-span-1">
            <label htmlFor="subKategori">Sub Kategori</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 outline-none"
              type="text"
              id="subKategori"
              autoComplete="off"
              value={retribusi.sub_kategori.namaSubKategori || ""}
              disabled={true}
            />
          </div>
        </div>

        <div className="col-span-2 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
            <label htmlFor="bulan">Bulan</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 outline-none"
              type="number"
              id="bulan"
              autoComplete="off"
              placeholder="Jumlah Bulan..."
              value={retribusi.bulan || ""}
              onKeyDown={(e) => {
                if (!isAllowedKey(e)) {
                  e.preventDefault();
                }
              }}
              readOnly={true}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
            <label htmlFor="tarifRetribusi">Tarif Retribusi</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 outline-none"
              type="text"
              id="tarifRetribusi"
              autoComplete="off"
              tabIndex={-1}
              value={
                new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  // minimumFractionDigits: 0
                }).format(retribusi.tarifPerbulan) || 0
              }
              readOnly={true}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
            <label htmlFor="total">Total Retribusi</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 outline-none"
              type="text"
              id="total"
              // value={new Intl.NumberFormat("id-ID", {
              //   style: "currency",
              //   currency: "IDR",
              // }).format(calculateTotal())}
              value={new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(retribusi.tarifPertahun)}
              readOnly
            />
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-1.5 text-sm">
          <label htmlFor="keteranganBulan">Keterangan Bulan</label>
          <input
            className="cursor-auto rounded bg-gray-200 px-3 py-2 outline-none"
            type="text"
            id="keteranganBulan"
            value={retribusi.keteranganBulan}
            readOnly
          />
        </div>

        {(() => {
          const selectedSubKategori = getSelectedSubKategori();

          let variabelArray = [];

          if (selectedSubKategori && selectedSubKategori.variabel) {
            variabelArray = Array.isArray(selectedSubKategori.variabel)
              ? selectedSubKategori.variabel
              : JSON.parse(selectedSubKategori.variabel || "[]");
          }

          const inputFields = ["unit", "m2", "giat", "hari", "meter"];

          return (
            <div className="col-span-2 grid grid-cols-1 gap-5 md:grid-cols-5">
              {inputFields.map((field, index) => {
                const isEnabled = variabelArray.includes(field);
                return (
                  <div
                    key={`variabel-${field}-${index}`}
                    className="flex flex-col gap-1.5 text-sm"
                  >
                    <label
                      htmlFor={`variabel-${field}`}
                      className={`capitalize`}
                    >
                      {field}
                    </label>
                    <input
                      className={`cursor-auto px-3 py-2 outline-none ${
                        isEnabled
                          ? "bg-gray-200"
                          : "cursor-not-allowed bg-gray-200"
                      }`}
                      type="number"
                      id={`variabel-${field}`}
                      autoComplete="off"
                      placeholder={`-`}
                      value={data.variabelValues[field] || ""}
                      onKeyDown={(e) => {
                        if (!isAllowedKey(e)) {
                          e.preventDefault();
                        }
                      }}
                      readOnly={true}
                    />
                    {errors[`variabelValues.${field}`] && (
                      <span className="text-xs text-red-500">
                        {errors[`variabelValues.${field}`]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}

        <div className="col-span-2 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
            <label htmlFor="statusTempat">Status Tempat</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 capitalize outline-none"
              type="text"
              id="statusTempat"
              value={retribusi.statusTempat ?? "-"}
              disabled={true}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
            <label htmlFor="jBangunan">Jumlah Bangunan</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 outline-none"
              type="text"
              id="jBangunan"
              autoComplete="off"
              placeholder="Jumlah Bangunan..."
              value={retribusi.jumlahBangunan ?? "-"}
              readOnly={true}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
            <label htmlFor="jLantai">Jumlah Lantai</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 outline-none"
              type="text"
              id="jLantai"
              autoComplete="off"
              placeholder="Jumlah Lantai..."
              value={retribusi.jumlahLantai ?? "-"}
              readOnly={true}
            />
          </div>
        </div>

        <div className="col-span-2 grid grid-cols-1 gap-5 lg:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
            <label htmlFor="latitude">Latitude</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 outline-none"
              type="text"
              id="latitude"
              autoComplete="off"
              placeholder="Latitude..."
              value={retribusi.latitude || ""}
              readOnly={true}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
            <label htmlFor="longitude">Longitude</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 outline-none"
              type="text"
              id="longitude"
              autoComplete="off"
              placeholder="Longitude..."
              value={retribusi.longitude || ""}
              readOnly={true}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
            <label htmlFor="linkMap">Link Map</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 outline-none"
              type="url"
              id="linkMap"
              autoComplete="off"
              placeholder="-"
              value={retribusi?.linkMap || undefined}
              readOnly={true}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
            <label htmlFor="penagih">Nama Penagih</label>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 outline-none"
              type="url"
              id="penagih"
              autoComplete="off"
              placeholder="-"
              value={retribusi.penagih?.nama ?? "-"}
              readOnly={true}
            />
          </div>
        </div>

        <div className="relative z-0 col-span-2 flex flex-col gap-1.5 text-sm">
          <MapPicker
            latitude={retribusi.latitude || ""}
            longitude={retribusi.longitude || ""}
            editable={false}
            height="400px"
          />
        </div>

        <div className="col-span-2 grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="flex flex-col gap-1.5 text-sm md:col-span-1">
            <h2>Bangunan</h2>
            {retribusi.image ? (
              <img
                src={route("private.file", {
                  type: "image",
                  filename: retribusi.image,
                })}
                alt=""
              />
            ) : (
              <>
                <h2 className="text-sm">Tidak ada Gambar</h2>
              </>
            )}
          </div>
          <div className="flex flex-col gap-1.5 text-sm md:col-span-1">
            <h2>Berkas</h2>
            {retribusi.file ? (
              <>
                {retribusi.file.toLowerCase().endsWith(".pdf") ? (
                  <iframe
                    className="h-[600px]"
                    src={route("private.file", {
                      type: "file",
                      filename: retribusi.file,
                    })}
                    alt="berkas pdf"
                  />
                ) : (
                  <img
                    src={route("private.file", {
                      type: "file",
                      filename: retribusi.file,
                    })}
                    alt="berkas gambar"
                  />
                )}
              </>
            ) : (
              <>
                <h2 className="text-sm">Tidak ada Berkas</h2>
              </>
            )}
          </div>
          <div className="flex flex-col gap-1.5 text-sm md:col-span-1">
            <h2>UPTD Penanggung Jawab</h2>
            <input
              className="cursor-auto rounded bg-gray-200 px-3 py-2 outline-none"
              type="url"
              id="penagih"
              autoComplete="off"
              placeholder="-"
              value={retribusi.uptd?.namaUptd ?? "-"}
              readOnly={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WajibRetribusiShow;
