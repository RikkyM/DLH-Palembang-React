import DropdownInput from "@/Components/DropdownInput";
import Layout from "../../Layout";
import { useForm } from "@inertiajs/react";
import "leaflet/dist/leaflet.css";
import { lazy, useCallback, useState } from "react";
import FormInput from "@/Components/FormInput";
import Label from "@/Components/Label";
import Input from "@/Components/Input";
import MapPicker from "@/Components/MapPicker";

// const MapPicker = lazy(() => import("@/Components/MapPicker"));

const Edit = ({
  pemohonOptions = [],
  kecamatanOptions = [],
  kelurahanOptions = [],
  kategoriOptions = [],
  subKategoriOptions = [],
  retribusi,
}) => {
  const [mapReset, setMapReset] = useState(0);

  const getSelectedSubKategori = () => {
    if (!data.kodeKategori || !data.kodeSubKategori) return null;

    const subKategoriList = subKategoriOptions[data.kodeKategori] || [];
    return subKategoriList.find((sub) => sub.value === data.kodeSubKategori);
  };

  const initialData = {
    namaObjekRetribusi: retribusi.namaObjekRetribusi || "",
    pemilikId: retribusi.pemilikId || "",
    alamatObjekRetribusi: retribusi.alamat || "",
    rt: retribusi.rt || "",
    rw: retribusi.rw || "",
    kodeKecamatan: retribusi.kodeKecamatan || "",
    kodeKelurahan: retribusi.kodeKelurahan || "",
    bentukUsaha: retribusi.bentukBadanUsaha || "",
    deskripsi: retribusi.deskripsiUsaha || "",
    kodeKategori: retribusi.kodeKategori || "",
    kodeSubKategori: retribusi.kodeSubKategori || "",
    statusTempat: retribusi.statusTempat || "",
    jBangunan: retribusi.jumlahBangunan || "",
    jLantai: retribusi.jumlahLantai || "",
    linkMap: retribusi?.linkMap || "",
    latitude: retribusi.latitude || null,
    longitude: retribusi.longitude || null,
    fotoBangunan: retribusi.fotoBangunan || null,
    fotoBerkas: retribusi.fotoBerkas || null,
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

  const { data, setData, errors, processing, clearErrors, put } =
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

    put(
      route("super-admin.wajib-retribusi.update", {
        retribusi: retribusi.noPendaftaran,
      }),
      {
        onSuccess: () => {
          setData(initialData);
        },
        onError: (e) => {
          console.error(e);
        },
      },
    );
  };

  return (
    <Layout title="FORM OBJEK RETRIBUSI">
      <section className="p-3">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <FormInput className="col-span-2">
            <Label
              htmlFor="namaObjekRetribusi"
              className="after:text-red-500 after:content-['*']"
            >
              Nama Objek Retribusi
            </Label>
            <Input
              className="bg-gray-200 px-3 py-2 outline-none"
              id="namaObjekRetribusi"
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
          </FormInput>
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
          <FormInput className="col-span-2">
            <Label
              htmlFor="alamatObjekRetribusi"
              className="after:text-red-500 after:content-['*']"
            >
              Alamat Objek Retribusi
            </Label>
            <Input
              id="alamatObjekRetribusi"
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
          </FormInput>
          <FormInput className="col-span-2 md:col-span-1">
            <Label
              htmlFor="rt"
              className="after:text-red-500 after:content-['*']"
            >
              RT
            </Label>
            <Input
              type="number"
              id="rt"
              placeholder="RT"
              value={data.rt}
              onChange={(e) => handleInputChange("rt", e.target.value)}
            />
            {errors.rt && (
              <span className="text-xs text-red-500">{errors.rt}</span>
            )}
          </FormInput>
          <FormInput className="col-span-2 md:col-span-1">
            <Label
              htmlFor="rw"
              className="after:text-red-500 after:content-['*']"
            >
              RW
            </Label>
            <Input
              type="number"
              id="rw"
              placeholder="RW"
              value={data.rw}
              onChange={(e) => handleInputChange("rw", e.target.value)}
            />
            {errors.rw && (
              <span className="text-xs text-red-500">{errors.rw}</span>
            )}
          </FormInput>
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
            className="col-span-2"
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
            className="col-span-2"
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
          <FormInput className="col-span-2">
            <Label
              htmlFor="deskripsi"
              className="after:text-red-500 after:content-['*']"
            >
              Deskripsi Usaha
            </Label>
            <Input
              id="deskripsi"
              placeholder="Deskripsi Usaha..."
              value={data.deskripsi}
              onChange={(e) => handleInputChange("deskripsi", e.target.value)}
            />
            {errors.deskripsi && (
              <span className="text-xs text-red-500">{errors.deskripsi}</span>
            )}
          </FormInput>
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
              <div className="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2">
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
          <FormInput className="col-span-2">
            <Label htmlFor="jBangunan">Jumlah Bangunan</Label>
            <Input
              id="jBangunan"
              placeholder="Jumlah Bangunan..."
              value={data.jBangunan}
              onChange={(e) => handleInputChange("jBangunan", e.target.value)}
            />
            {errors.jBangunan && (
              <span className="text-xs text-red-500">{errors.jBangunan}</span>
            )}
          </FormInput>

          <FormInput className="col-span-2">
            <Label
              htmlFor="jLantai"
              className="after:text-red-500 after:content-['*']"
            >
              Jumlah Lantai
            </Label>
            <Input
              type="number"
              id="jLantai"
              placeholder="Jumlah Lantai..."
              value={data.jLantai}
              onChange={(e) => handleInputChange("jLantai", e.target.value)}
            />
            {errors.jLantai && (
              <span className="text-xs text-red-500">{errors.jLantai}</span>
            )}
          </FormInput>

          <FormInput className="col-span-2 md:col-span-1">
            <Label
              htmlFor="latitude"
              className="after:text-red-500 after:content-['*']"
            >
              Latitude
            </Label>
            <Input
              type="number"
              id="latitude"
              placeholder="Latitude..."
              value={data.latitude || ""}
              onChange={(e) => handleInputChange("latitude", e.target.value)}
            />
            {errors.latitude && (
              <span className="text-xs text-red-500">{errors.latitude}</span>
            )}
          </FormInput>

          <FormInput className="col-span-2 md:col-span-1">
            <Label
              htmlFor="longitude"
              className="after:text-red-500 after:content-['*']"
            >
              Longitude
            </Label>
            <Input
              type="number"
              id="longitude"
              placeholder="Longitude..."
              value={data.longitude || ""}
              onChange={(e) => handleInputChange("longitude", e.target.value)}
            />
            {errors.longitude && (
              <span className="text-xs text-red-500">{errors.longitude}</span>
            )}
          </FormInput>

          <FormInput className="col-span-2">
            <Label
              htmlFor="linkMap"
              className="after:text-red-500 after:content-['*']"
            >
              Link Map
            </Label>
            <Input
              type="url"
              id="linkMap"
              placeholder="Link Map..."
              value={data.linkMap}
              onChange={(e) => handleInputChange("linkMap", e.target.value)}
            />
            {errors.linkMap && (
              <span className="text-xs text-red-500">{errors.linkMap}</span>
            )}
          </FormInput>

          <FormInput className="col-span-2">
            <MapPicker
              latitude={data.latitude || ""}
              longitude={data.longitude || ""}
              onLocationChange={handleLocationChange}
              height="400px"
              resetTrigger={mapReset}
            />
          </FormInput>

          <FormInput className="col-span-2">
            <Label htmlFor="fotoBangunan">Upload Foto Bangunan</Label>
            <Input
              type="file"
              id="fotoBangunan"
              accept="image/*"
              onChange={(e) =>
                handleFileChange("fotoBangunan", e.target.files[0])
              }
            />
            {errors.fotoBangunan && (
              <span className="text-xs text-red-500">
                {errors.fotoBangunan}
              </span>
            )}
            <span className="text-xs text-green-600">
              File Gambar: {retribusi.image}
            </span>
          </FormInput>

          <FormInput className="col-span-2">
            <Label htmlFor="fotoBerkas">Upload Foto Berkas Persyaratan</Label>
            <Input
              type="file"
              accept="image/*"
              id="fotoBerkas"
              onChange={(e) =>
                handleFileChange("fotoBerkas", e.target.files[0])
              }
            />
            {errors.fotoBerkas && (
              <span className="text-xs text-red-500">{errors.fotoBerkas}</span>
            )}
            <span className="text-xs text-green-600">
              File dipilih: {retribusi.file}
            </span>
          </FormInput>

          <div className="flex flex-col gap-1.5 text-sm md:col-span-2 md:flex-row md:justify-end md:gap-4">
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

export default Edit;
