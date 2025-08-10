import DropdownInput from "@/Components/DropdownInput";
import MapPicker from "@/Components/MapPicker";
import Layout from "../../Layout";
import { useForm } from "@inertiajs/react";
import "leaflet/dist/leaflet.css";
import { useCallback, useState } from "react";

const Create = ({
  pemohonOptions = [],
  kecamatanOptions = [],
  kelurahanOptions = [],
  kategoriOptions = [],
  subKategoriOptions = [],
}) => {
  const [mapReset, setMapReset] = useState(0);

  const getSelectedSubKategori = () => {
    if (!data.kodeKategori || !data.kodeSubKategori) return null;

    const subKategoriList = subKategoriOptions[data.kodeKategori] || [];
    return subKategoriList.find((sub) => sub.value === data.kodeSubKategori);
  };

  const initialData = {
    namaObjekRetribusi: "",
    pemilikId: "",
    alamatObjekRetribusi: "",
    rt: "",
    rw: "",
    kodeKecamatan: "",
    kodeKelurahan: "",
    bentukUsaha: "",
    deskripsi: "",
    kodeKategori: "",
    kodeSubKategori: "",
    statusTempat: "",
    jBangunan: "",
    jLantai: "",
    linkMap: "",
    latitude: null,
    longitude: null,
    fotoBangunan: null,
    fotoBerkas: null,
    variabelValues: {},
  };

  const handleVariabelChange = (variabelName, value) => {
    setData((prevData) => ({
      ...prevData,
      variabelValues: {
        ...prevData.variabelValues,
        [variabelName]: value,
      },
    }));
  };

  const { data, setData, errors, processing, clearErrors, post } =
    useForm(initialData);

  const filteredKelurahanOptions = kelurahanOptions[data.kodeKecamatan] || [];
  const filteredSubKategoriOptions =
    subKategoriOptions[data.kodeKategori] || [];

  const statusTempat = [
    { value: "MILIK SENDIRI", label: "MILIK SENDIRI" },
    { value: "SEWA", label: "SEWA" },
  ];

  const bentukUsaha = [
    { value: "Perorangan", label: "Perorangan" },
    { value: "CV", label: "CV" },
    { value: "PT", label: "PT" },
    { value: "Koperasi", label: "Koperasi" },
    { value: "BUMN", label: "BUMN" },
    { value: "Instansi Pemerintah", label: "Instansi Pemerintah" },
    { value: "FIRMA", label: "FIRMA" },
  ];

  const handleLocationChange = useCallback(
    (lat, lng) => {
      setData((prevData) => ({
        ...prevData,
        latitude: lat.toString(),
        longitude: lng.toString(),
      }));
    },
    [setData],
  );

  const handleFileChange = (field, file) => {
    setData(field, file);
    if (errors[field]) {
      clearErrors(field);
    }
  };

  const handleInputChange = (field, value) => {
    setData(field, value);

    if (errors[field]) {
      clearErrors(field);
    }
  };

  const handleKategoriChange = (value) => {
    setData((prevData) => ({
      ...prevData,
      kodeKategori: value,
      kodeSubKategori: "",
      variabelValues: {},
    }));

    if (errors.kodeKategori) {
      clearErrors("kodeKategori");
    }
    if (errors.kodeSubKategori) {
      clearErrors("kodeSubKategori");
    }

    Object.keys(errors).forEach((key) => {
      if (key.startsWith("variabelValues.")) {
        clearErrors(key);
      }
    });
  };

  const handleSubKategoriChange = (value) => {
    setData((prevData) => ({
      ...prevData,
      kodeSubKategori: value,
      variabelValues: {},
    }));

    if (errors.kodeSubKategori) {
      clearErrors("kodeSubKategori");
    }

    Object.keys(errors).forEach((key) => {
      if (key.startsWith("variabelValues.")) {
        clearErrors(key);
      }
    });
  };

  const handleClearForm = () => {
    setData({
      ...initialData,
      variabelValues: {},
    });
    clearErrors();

    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      input.value = "";
    });

    setMapReset((prev) => prev + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route("super-admin.wajib-retribusi.store"), {
      onSuccess: () => {
        setData(initialData);
      },
      onError: (e) => {
        console.error(e);
      },
    });
  };

  return (
    <Layout title="FORM OBJEK RETRIBUSI">
      <section className="p-3">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <div className="col-span-2 flex flex-col gap-1.5 text-sm">
            <label
              htmlFor="namaObjekRetribusi"
              className="after:text-red-500 after:content-['*']"
            >
              Nama Objek Retribusi
            </label>
            <input
              className="bg-gray-200 px-3 py-2 outline-none"
              type="text"
              id="namaObjekRetribusi"
              autoComplete="off"
              placeholder="Nama Objek Retribusi..."
              value={data.namaObjekRetribusi}
              onChange={(e) =>
                handleInputChange("namaObjekRetribusi", e.target.value)
              }
            />
            {errors.namaObjekRetribusi && (
              <span className="text-xs text-red-500">
                {errors.namaObjekRetribusi}
              </span>
            )}
          </div>
          <DropdownInput
            id="pemohon"
            label="Pilih Pemohon"
            placeholder="Silahkan Pilih Pemohon..."
            value={data.pemilikId}
            onChange={(value) => handleInputChange("pemilikId", value)}
            options={pemohonOptions}
            error={errors.pemilikId}
            required={true}
            valueKey="value"
            labelKey="label"
            className="col-span-2"
          />
          <div className="col-span-2 flex flex-col gap-1.5 text-sm">
            <label
              htmlFor="alamatObjekRetribusi"
              className="after:text-red-500 after:content-['*']"
            >
              Alamat Objek Retribusi
            </label>
            <input
              className="bg-gray-200 px-3 py-2 outline-none"
              type="text"
              id="alamatObjekRetribusi"
              autoComplete="off"
              placeholder="contoh: Jalan Srikandi Nomor 16/ Lorong Asahan Nomor 38"
              value={data.alamatObjekRetribusi}
              onChange={(e) =>
                handleInputChange("alamatObjekRetribusi", e.target.value)
              }
            />
            {errors.alamatObjekRetribusi && (
              <span className="text-xs text-red-500">
                {errors.alamatObjekRetribusi}
              </span>
            )}
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
            <label
              htmlFor="rt"
              className="after:text-red-500 after:content-['*']"
            >
              RT
            </label>
            <input
              className="bg-gray-200 px-3 py-2 outline-none"
              type="number"
              id="rt"
              autoComplete="off"
              placeholder="RT"
              value={data.rt}
              onChange={(e) => handleInputChange("rt", e.target.value)}
            />
            {errors.rt && (
              <span className="text-xs text-red-500">{errors.rt}</span>
            )}
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
            <label
              htmlFor="rw"
              className="after:text-red-500 after:content-['*']"
            >
              RW
            </label>
            <input
              className="bg-gray-200 px-3 py-2 outline-none"
              type="number"
              id="rw"
              autoComplete="off"
              placeholder="RW"
              value={data.rw}
              onChange={(e) => handleInputChange("rw", e.target.value)}
            />
            {errors.rw && (
              <span className="text-xs text-red-500">{errors.rw}</span>
            )}
          </div>
          <DropdownInput
            id="kecamatan"
            label="Pilih Kecamatan"
            placeholder="Silahkan Pilih Kecamatan..."
            value={data.kodeKecamatan}
            onChange={(value) => handleInputChange("kodeKecamatan", value)}
            options={kecamatanOptions}
            error={errors.kodeKecamatan}
            required={true}
            valueKey="value"
            labelKey="label"
            className="col-span-2 md:col-span-1"
          />
          <DropdownInput
            id="kelurahan"
            label="Pilih Kelurahan"
            placeholder="Silahkan Pilih Kelurahan..."
            value={data.kodeKelurahan}
            onChange={(value) => handleInputChange("kodeKelurahan", value)}
            options={filteredKelurahanOptions}
            error={errors.kodeKelurahan}
            required={true}
            valueKey="value"
            labelKey="label"
            disabled={!data.kodeKecamatan}
            className="col-span-2 md:col-span-1"
          />
          <DropdownInput
            id="bentukUsaha"
            label="Bentuk Badan Usaha"
            placeholder="Pilih Bentuk Badan Usaha"
            value={data.bentukUsaha}
            onChange={(value) => handleInputChange("bentukUsaha", value)}
            options={bentukUsaha}
            error={errors.bentukUsaha}
            required={true}
            valueKey="value"
            labelKey="label"
            className="col-span-2"
          />
          <div className="col-span-2 flex flex-col gap-1.5 text-sm">
            <label
              htmlFor="deskripsi"
              className="after:text-red-500 after:content-['*']"
            >
              Deskripsi Usaha
            </label>
            <input
              className="bg-gray-200 px-3 py-2 outline-none"
              type="text"
              id="deskripsi"
              autoComplete="off"
              placeholder="Deskripsi Usaha..."
              value={data.deskripsi}
              onChange={(e) => handleInputChange("deskripsi", e.target.value)}
            />
            {errors.deskripsi && (
              <span className="text-xs text-red-500">{errors.deskripsi}</span>
            )}
          </div>
          <DropdownInput
            id="kategori"
            label="Pilih Kategori"
            placeholder="Silahkan Pilih Kategori..."
            value={data.kodeKategori}
            onChange={handleKategoriChange}
            options={kategoriOptions}
            error={errors.kodeKategori}
            required={true}
            valueKey="value"
            labelKey="label"
            className="col-span-2 md:col-span-1"
          />
          <DropdownInput
            id="subkategori"
            label="Pilih Sub Kategori"
            placeholder="Silahkan Pilih Sub Kategori..."
            value={data.kodeSubKategori}
            onChange={handleSubKategoriChange}
            options={filteredSubKategoriOptions}
            error={errors.kodeSubKategori}
            required={true}
            valueKey="value"
            labelKey="label"
            disabled={!data.kodeKategori}
            className="col-span-2 md:col-span-1"
          />
          {(() => {
            const selectedSubKategori = getSelectedSubKategori();

            let variabelArray = [];

            if (selectedSubKategori && selectedSubKategori.variabel) {
              variabelArray = Array.isArray(selectedSubKategori.variabel)
                ? selectedSubKategori.variabel
                : JSON.parse(selectedSubKategori.variabel || "[]");
            }

            const inputFields = [
              "bulan",
              "unit",
              "m2",
              "giat",
              "hari",
              "meter",
            ];

            return (
              <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                {inputFields.map((field, index) => {
                  const isEnabled = variabelArray.includes(field);
                  return (
                    <div
                      key={`variabel-${field}-${index}`}
                      className="flex flex-col gap-1.5 text-sm"
                    >
                      <label
                        htmlFor={`variabel-${field}`}
                        className="capitalize after:text-red-500 after:content-['*']"
                      >
                        {field}
                      </label>
                      <input
                        className={`px-3 py-2 outline-none ${
                          isEnabled
                            ? "bg-gray-200"
                            : "cursor-not-allowed bg-gray-100"
                        }`}
                        type="number"
                        id={`variabel-${field}`}
                        autoComplete="off"
                        placeholder={`Masukkan nilai ${field}...`}
                        value={data.variabelValues[field] || ""}
                        onChange={(e) =>
                          handleVariabelChange(field, e.target.value)
                        }
                        required
                        disabled={!isEnabled}
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

          <DropdownInput
            id="statusTempat"
            label="Status Tempat"
            placeholder="Pilih Status Tempat..."
            value={data.statusTempat}
            onChange={(value) => handleInputChange("statusTempat", value)}
            options={statusTempat}
            error={errors.statusTempat}
            required={true}
            valueKey="value"
            labelKey="label"
            className="col-span-2"
          />
          <div className="col-span-2 flex flex-col gap-1.5 text-sm">
            <label
              htmlFor="jBangunan"
              className="after:text-red-500 after:content-['*']"
            >
              Jumlah Bangunan
            </label>
            <input
              className="bg-gray-200 px-3 py-2 outline-none"
              type="number"
              id="jBangunan"
              autoComplete="off"
              placeholder="Jumlah Bangunan..."
              value={data.jBangunan}
              onChange={(e) => handleInputChange("jBangunan", e.target.value)}
            />
            {errors.jBangunan && (
              <span className="text-xs text-red-500">{errors.jBangunan}</span>
            )}
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 text-sm">
            <label
              htmlFor="jLantai"
              className="after:text-red-500 after:content-['*']"
            >
              Jumlah Lantai
            </label>
            <input
              className="bg-gray-200 px-3 py-2 outline-none"
              type="number"
              id="jLantai"
              autoComplete="off"
              placeholder="Jumlah Lantai..."
              value={data.jLantai}
              onChange={(e) => handleInputChange("jLantai", e.target.value)}
            />
            {errors.jLantai && (
              <span className="text-xs text-red-500">{errors.jLantai}</span>
            )}
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
            <label
              htmlFor="latitude"
              className="after:text-red-500 after:content-['*']"
            >
              Latitude
            </label>
            <input
              className="bg-gray-200 px-3 py-2 outline-none"
              type="number"
              id="latitude"
              autoComplete="off"
              placeholder="Latitude..."
              value={data.latitude || ""}
              onChange={(e) => handleInputChange("latitude", e.target.value)}
            />
            {errors.latitude && (
              <span className="text-xs text-red-500">{errors.latitude}</span>
            )}
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
            <label
              htmlFor="longitude"
              className="after:text-red-500 after:content-['*']"
            >
              Longitude
            </label>
            <input
              className="bg-gray-200 px-3 py-2 outline-none"
              type="number"
              id="longitude"
              autoComplete="off"
              placeholder="Longitude..."
              value={data.longitude || ""}
              onChange={(e) => handleInputChange("longitude", e.target.value)}
            />
            {errors.longitude && (
              <span className="text-xs text-red-500">{errors.longitude}</span>
            )}
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 text-sm">
            <label
              htmlFor="linkMap"
              className="after:text-red-500 after:content-['*']"
            >
              Link Map
            </label>
            <input
              className="bg-gray-200 px-3 py-2 outline-none"
              type="url"
              id="linkMap"
              autoComplete="off"
              placeholder="Link Map..."
              value={data.linkMap}
              onChange={(e) => handleInputChange("linkMap", e.target.value)}
            />
            {errors.linkMap && (
              <span className="text-xs text-red-500">{errors.linkMap}</span>
            )}
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 text-sm">
            <MapPicker
              latitude={data.latitude || ""}
              longitude={data.longitude || ""}
              onLocationChange={handleLocationChange}
              height="400px"
              resetTrigger={mapReset}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
            <label htmlFor="fotoBangunan">Upload Foto Bangunan</label>
            <input
              className="bg-gray-200 px-3 py-2 outline-none"
              type="file"
              id="fotoBangunan"
              accept="image/*"
              onChange={(e) =>
                handleFileChange("fotoBangunan", e.target.files[0])
              }
              required
            />
            {errors.fotoBangunan && (
              <span className="text-xs text-red-500">
                {errors.fotoBangunan}
              </span>
            )}
            {data.fotoBangunan && (
              <span className="text-xs text-green-600">
                File dipilih: {data.fotoBangunan.name}
              </span>
            )}
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
            <label htmlFor="fotoBerkas">Upload Foto Berkas Persyaratan</label>
            <input
              className="bg-gray-200 px-3 py-2 outline-none"
              type="file"
              accept="image/*"
              id="fotoBerkas"
              onChange={(e) =>
                handleFileChange("fotoBerkas", e.target.files[0])
              }
              required
            />
            {errors.fotoBerkas && (
              <span className="text-xs text-red-500">{errors.fotoBerkas}</span>
            )}
            {data.fotoBerkas && (
              <span className="text-xs text-green-600">
                File dipilih: {data.fotoBerkas.name}
              </span>
            )}
          </div>
          <div className="col-span-2 flex flex-col gap-1.5 text-sm md:flex-row md:justify-end md:gap-4">
            <button
              type="button"
              onClick={handleClearForm}
              className="order-2 md:order-1"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={processing}
              className="order-1 rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:bg-blue-300 md:order-2"
            >
              {processing ? "Submitting..." : "Submit Data"}
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default Create;
