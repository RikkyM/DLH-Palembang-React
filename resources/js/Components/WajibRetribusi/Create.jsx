import DropdownInput from "@/Components/DropdownInput";
import MapPicker from "@/Components/MapPicker";
import { useForm } from "@inertiajs/react";
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useState } from "react";
import { isAllowedKey } from "@/Utils/inputValidators";
import FormInput from "../FormInput";
import Label from "../Label";
import Input from "../Input";

const WajibRetribusiCreate = ({
  pemohonOptions = [],
  kecamatanOptions = [],
  kelurahanOptions = [],
  kategoriOptions = [],
  subKategoriOptions = [],
  userRole = "ROLE_PENDAFTAR",
  customProps = {},
}) => {
  const [mapReset, setMapReset] = useState(0);

  const roleConfig = {
    ROLE_PENDAFTAR: {
      submitRoute: "pendaftar.wajib-retribusi.store",
      redirectRoute: "pendaftar.wajib-retribusi.index",
      readonlyFields: [],
    },
    ROLE_SUPERADMIN: {
      submitRoute: "super-admin.wajib-retribusi.store",
      redirectRoute: "super-admin.wajib-retribusi.index",
      readonlyFields: [],
    },
  };

  const currentConfig = roleConfig[userRole] || roleConfig.pendaftar;

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
    tarifRetribusi: 0,
    jenisTarif: "tarif",
    ...customProps.initialData,
  };

  const { data, setData, errors, processing, clearErrors, post } =
    useForm(initialData);

  const handleVariabelChange = (variabelName, value) => {
    setData((prevData) => ({
      ...prevData,
      variabelValues: {
        ...prevData.variabelValues,
        [variabelName]: value,
      },
    }));
  };

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

  const handleLocationChange = useCallback((lat, lng) => {
  if (lat != null && lng != null) {
    setData((prevData) => ({
      ...prevData,
      latitude: String(lat),
      longitude: String(lng),
    }));
  }
}, [setData]);

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

  const handleJenisTarifChange = (value) => {
    setData("jenisTarif", value);

    const selectedSub = (subKategoriOptions[data.kodeKategori] || []).find(
      (sub) => sub.value === data.kodeSubKategori,
    );

    if (selectedSub) {
      const tarifValue =
        value === "tarif2" ? selectedSub.tarif2 : selectedSub.tarif;
      setData("tarifRetribusi", tarifValue || 0);
    }
  };

  const handleKategoriChange = (value) => {
    setData((prevData) => ({
      ...prevData,
      kodeKategori: value,
      kodeSubKategori: "",
      variabelValues: {},
      tarifRetribusi: 0,
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
    const selectedSub = (subKategoriOptions[data.kodeKategori] || []).find(
      (sub) => sub.value === value,
    );

    let jenisTarif = data.jenisTarif;

    if (
      jenisTarif === "tarif2" &&
      (!selectedSub?.tarif2 || selectedSub.tarif2 === "")
    ) {
      jenisTarif = "tarif";
    }

    setData((prevData) => ({
      ...prevData,
      kodeSubKategori: value,
      variabelValues: { bulan: 1 },
      jenisTarif: jenisTarif,
      tarifRetribusi: selectedSub
        ? jenisTarif === "tarif2"
          ? selectedSub.tarif2
          : selectedSub.tarif
        : "",
    }));
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
    const timeoutId = setTimeout(() => {
      const total = calculateTotal();
      if (data.totalRetribusi !== total) {
        setData("totalRetribusi", total);
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [
    data.variabelValues,
    data.tarifRetribusi,
    data.jenisTarif,
    data.kodeSubKategori,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    clearErrors();

    const total = calculateTotal();

    let submitData = {
      ...data,
      tarifRetribusi: data.tarifRetribusi,
      totalRetribusi: total,
    };


    post(route(currentConfig.submitRoute), {
      data: submitData,
      onSuccess: () => {
        setData(initialData);
      },
      onError: (e) => {
        console.error(e);
      },
    });
  };

  return (
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
            id="namaObjekRetribusi"
            className={`${errors.namaObjekRetribusi && "border border-red-500"}`}
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
            className={`${errors.alamatObjekRetribusi && "border border-red-500"}`}
            placeholder="Alamat Objek Retribusi..."
            value={data.alamatObjekRetribusi}
            onChange={(e) =>
              handleInputChange("alamatObjekRetribusi", e.target.value)
            }
          />
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
            className={`${errors.rt && "border border-red-500"}`}
            placeholder="RT"
            value={data.rt}
            onKeyDown={(e) => {
              if (!isAllowedKey(e)) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 3) {
                handleInputChange("rt", value);
              }
            }}
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
            className={`${errors.rw && "border border-red-500"}`}
            placeholder="RW"
            value={data.rw}
            onKeyDown={(e) => {
              if (!isAllowedKey(e)) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 3) {
                handleInputChange("rw", value);
              }
            }}
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
        <FormInput className="col-span-2">
          <Label
            htmlFor="deskripsi"
            className="after:text-red-500 after:content-['*']"
          >
            Deskripsi Usaha
          </Label>
          <Input
            id="deskripsi"
            className={`${errors.deskripsi && "border border-red-500"}`}
            placeholder="Deskripsi Usaha..."
            value={data.deskripsi}
            onChange={(e) => handleInputChange("deskripsi", e.target.value)}
          />
          {errors.deskripsi && (
            <span className="text-xs text-red-500">{errors.deskripsi}</span>
          )}
        </FormInput>
        <DropdownInput
          id="jenisTarif"
          label="Pilih Layanan"
          placeholder="Silahkan Pilih Layanan..."
          value={data.jenisTarif}
          onChange={handleJenisTarifChange}
          options={[
            { value: "tarif", label: "Tarif 1" },
            { value: "tarif2", label: "Tarif 2" },
          ]}
          error={errors.jenisTarif}
          required={true}
          valueKey="value"
          labelKey="label"
          className="col-span-2"
        />
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
        <FormInput className="col-span-2 md:col-span-1">
          <Label
            htmlFor="bulan"
            className="after:text-red-500 after:content-['*']"
          >
            Bulan
          </Label>
          <Input
            type="number"
            min={1}
            max={99}
            id="bulan"
            className={`${errors.bulan && "border border-red-500"}`}
            placeholder="Jumlah Bulan..."
            value={data.variabelValues.bulan || ""}
            onKeyDown={(e) => {
              if (!isAllowedKey(e)) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value >= 0 && value.length <= 2) {
                handleVariabelChange("bulan", value);
              }
            }}
          />
          {errors.bulan && (
            <span className="text-xs text-red-500">{errors.bulan}</span>
          )}
        </FormInput>
        <FormInput className="col-span-2 md:col-span-1">
          <Label
            htmlFor="tarifRetribusi"
            className="after:text-red-500 after:content-['*']"
          >
            Tarif Retribusi
          </Label>
          <Input
            id="tarifRetribusi"
            className={`${errors.tarifRetribusi && "border border-red-500"}`}
            tabIndex={-1}
            value={
              new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(data.tarifRetribusi) || 0
            }
            readOnly={true}
          />
          {errors.tarifRetribusi && (
            <span className="text-xs text-red-500">
              {errors.tarifRetribusi}
            </span>
          )}
        </FormInput>
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
            <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
              {inputFields.map((field, index) => {
                const isEnabled = variabelArray.includes(field);
                return (
                  <FormInput
                    key={`variabel-${field}-${index}`}
                    className="flex flex-col gap-1.5 text-sm"
                  >
                    <Label
                      htmlFor={`variabel-${field}`}
                      className={`capitalize ${isEnabled && "after:text-red-500 after:content-['*']"}`}
                    >
                      {field}
                    </Label>
                    <Input
                      type="text"
                      id={`variabel-${field}`}
                      className={`${isEnabled ? "bg-gray-200" : "cursor-not-allowed bg-slate-300"} ${errors[`variabelValues.${field}`] && "border border-red-500"}`}
                      placeholder={`Masukkan nilai ${field}...`}
                      value={data.variabelValues[field] || ""}
                      onKeyDown={(e) => {
                        if (!isAllowedKey(e)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");

                        if (value >= 0 && value.length <= 10) {
                          handleVariabelChange(field, value);
                        }
                      }}
                      required
                      disabled={!isEnabled}
                    />
                    {errors[`variabelValues.${field}`] && (
                      <span className="text-xs text-red-500">
                        {errors[`variabelValues.${field}`]}
                      </span>
                    )}
                  </FormInput>
                );
              })}
              <FormInput className="col-span-1">
                <Label htmlFor="total">Total Retribusi</Label>
                <Input
                  id="total"
                  tabIndex={-1}
                  className={`${errors.totalRetribusi && "border border-red-500"}`}
                  value={new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(calculateTotal())}
                  readOnly
                />
                {errors.totalRetribusi && (
                  <span className="text-xs text-red-500">
                    {errors.totalRetribusi}
                  </span>
                )}
              </FormInput>
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
        <FormInput className="col-span-2 md:col-span-1">
          <Label
            htmlFor="jBangunan"
            className="after:text-red-500 after:content-['*']"
          >
            Jumlah Bangunan
          </Label>
          <Input
            type="number"
            id="jBangunan"
            className={`${errors.jBangunan && "border border-red-500"}`}
            placeholder="Jumlah Bangunan..."
            value={data.jBangunan}
            onKeyDown={(e) => {
              if (!isAllowedKey(e)) {
                e.preventDefault();
              }
            }}
            onChange={(e) =>
              handleInputChange("jBangunan", e.target.value.replace(/\D/g, ""))
            }
          />
          {errors.jBangunan && (
            <span className="text-xs text-red-500">{errors.jBangunan}</span>
          )}
        </FormInput>
        <FormInput className="col-span-2 md:col-span-1">
          <Label
            htmlFor="jLantai"
            className="after:text-red-500 after:content-['*']"
          >
            Jumlah Lantai
          </Label>
          <Input
            id="jLantai"
            className={`${errors.jLantai && "border border-red-500"}`}
            placeholder="Jumlah Lantai..."
            value={data.jLantai}
            onKeyDown={(e) => {
              if (!isAllowedKey(e)) {
                e.preventDefault();
              }
            }}
            onChange={(e) =>
              handleInputChange("jLantai", e.target.value.replace(/\D/g, ""))
            }
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
            id="latitude"
            type="number"
            step="any"
            min={-90}
            max={90}
            className={`${errors.latitude && "border border-red-500"}`}
            placeholder="Latitude..."
            value={data.latitude || ""}
            onChange={(e) => {
              let value = e.target.value.replace(/[^0-9\.\-]/g, "");

              const parts = value.split(".");

              if (parts.length > 2) {
                value = parts[0] + "." + parts.slice(1).join("");
              }

              value = value.replace(/(?!^)-/g, "");

              if (value.includes("-") && value.indexOf("-") > 0) {
                value = value.replace("-", "");
              }

              handleInputChange("latitude", value);
            }}
            // onBlur={() => handleInputChange("latitude", latInput)}
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
            id="longitude"
            type="number"
            step="any"
            min={-180}
            max={180}
            className={`${errors.longitude && "border border-red-500"}`}
            placeholder="Longitude..."
            value={data.longitude || ""}
            onChange={(e) => {
              let value = e.target.value;

              value = value.replace(/[^0-9\.\-]/g, "");

              const parts = value.split(".");
              if (parts.length > 2) {
                value = parts[0] + "." + parts.slice(1).join("");
              }

              value = value.replace(/(?!^)-/g, "");
              if (value.includes("-") && value.indexOf("-") > 0) {
                value = value.replace("-", "");
              }

              handleInputChange("longitude", value);
            }}
            // onBlur={() => handleInputChange("longitude", lngInput)}
          />
          {errors.longitude && (
            <span className="text-xs text-red-500">{errors.longitude}</span>
          )}
        </FormInput>
        <FormInput className="col-span-2">
          <Label htmlFor="linkMap">Link Map</Label>
          <Input
            type="url"
            id="linkMap"
            className={`${errors.linkMap && "border border-red-500"}`}
            placeholder="Link Map..."
            value={data.linkMap}
            onChange={(e) => handleInputChange("linkMap", e.target.value)}
          />
          {errors.linkMap && (
            <span className="text-xs text-red-500">{errors.linkMap}</span>
          )}
        </FormInput>
        <FormInput className="z-0 col-span-2">
          <MapPicker
            latitude={data.latitude || ""}
            longitude={data.longitude || ""}
            onLocationChange={handleLocationChange}
            editable={true}
            height="400px"
            resetTrigger={mapReset}
          />
        </FormInput>
        <FormInput className="col-span-2 md:col-span-1">
          <Label htmlFor="fotoBangunan">Upload Foto Bangunan</Label>
          <Input
            type="file"
            id="fotoBangunan"
            accept="image/*"
            onChange={(e) =>
              handleFileChange("fotoBangunan", e.target.files[0])
            }
            required
          />
          {errors.fotoBangunan && (
            <span className="text-xs text-red-500">{errors.fotoBangunan}</span>
          )}
          {data.fotoBangunan && (
            <span className="text-xs text-green-600">
              File dipilih: {data.fotoBangunan.name}
            </span>
          )}
        </FormInput>
        <FormInput className="col-span-2 md:col-span-1">
          <Label htmlFor="fotoBerkas">Upload Foto Berkas</Label>
          <Input
            type="file"
            accept="image/*,application/pdf"
            id="fotoBerkas"
            onChange={(e) => handleFileChange("fotoBerkas", e.target.files[0])}
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
        </FormInput>
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
  );
};

export default WajibRetribusiCreate;
