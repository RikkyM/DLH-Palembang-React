import DropdownInput from "@/Components/DropdownInput";
import MapPicker from "@/Components/MapPicker";
import { useForm } from "@inertiajs/react";
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useState } from "react";
import { isAllowedKey } from "@/Utils/inputValidators";
import FormInput from "@/Components/FormInput";
import Label from "@/Components/Label";
import Input from "@/Components/Input";

const WajibRetribusiCreate = ({
  pemohonOptions = [],
  kecamatanOptions = [],
  kelurahanOptions = [],
  kategoriOptions = [],
  subKategoriOptions = [],
  penagihOptions = [],
  badanUsahaOptions = [],
  userRole = "ROLE_PENDAFTAR",
  customProps = {},
  generateWr = null,
}) => {
  const [mapReset, setMapReset] = useState(0);

  const roleConfig = {
    ROLE_SUPERADMIN: {
      submitRoute: "super-admin.wajib-retribusi.store",
      redirectRoute: "super-admin.wajib-retribusi.index",
    },
    ROLE_PENDAFTAR: {
      submitRoute: "pendaftar.wajib-retribusi.store",
      redirectRoute: "pendaftar.wajib-retribusi.index",
    },
  };

  const currentConfig = roleConfig[userRole] || roleConfig.ROLE_PENDAFTAR;

  const getSelectedSubKategori = () => {
    if (!data.kodeKategori || !data.kodeSubKategori) return null;
    const subKategoriList = subKategoriOptions[data.kodeKategori] || [];
    return subKategoriList.find((sub) => sub.value === data.kodeSubKategori);
  };

  const initialData = {
    namaObjekRetribusi: "",
    noSkrd: "",
    noWajibRetribusi: generateWr || "",
    pemilikId: "",
    penagihId: "",
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
    keteranganBulan: "",
    tarifRetribusi: 0,
    jenisTarif: "tarif",
    tanggalSkrd: new Date().toISOString().split("T")[0],
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

  // const bentukUsaha = [
  //   { value: "Perorangan", label: "Perorangan" },
  //   { value: "CV", label: "CV" },
  //   { value: "PT", label: "PT" },
  //   { value: "Koperasi", label: "Koperasi" },
  //   { value: "BUMN", label: "BUMN" },
  //   { value: "Instansi Pemerintah", label: "Instansi Pemerintah" },
  //   { value: "FIRMA", label: "FIRMA" },
  // ];

  const handleLocationChange = useCallback(
    (lat, lng) => {
      if (lat != null && lng != null) {
        setData((prevData) => ({
          ...prevData,
          latitude: String(lat),
          longitude: String(lng),
        }));
      }
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

  // const calculateTotal = () => {
  //   const selectedSub = getSelectedSubKategori();
  //   if (!selectedSub) return 0;

  //   const tarif = parseInt(data.tarifRetribusi || 0);

  //   const variabelArray = Array.isArray(selectedSub.variabel)
  //     ? selectedSub.variabel
  //     : JSON.parse(selectedSub.variabel || "[]");

  //   if (selectedSub.rumus) {
  //     let formula = selectedSub.rumus;

  //     variabelArray.forEach((field) => {
  //       const value = parseInt(data.variabelValues?.[field] ?? 0) || 0;
  //       formula = formula.replaceAll(field, value || 0);
  //     });

  //     try {
  //       let result = Function(`"use strict"; return (${formula})`)();
  //       console.log(result);

  //       const bulan = parseInt(data.variabelValues?.bulan || 0);
  //       if (bulan > 0) result *= bulan;

  //       console.log(bulan)

  //       return (result || 0) * tarif;
  //     } catch (error) {
  //       console.error("Error evaluate formula:", error);
  //       return 0;
  //     }
  //   }

  //   let total = tarif;

  //   variabelArray.forEach((field) => {
  //     const value = parseInt(data.variabelValues?.[field] || 0);
  //     if (value > 0) total *= value;
  //   });

  //   const bulan = parseInt(data.variabelValues?.bulan || 0);
  //   if (bulan > 0) total *= bulan;

  //   return total || 0;
  // };

  const calculateTotal = () => {
    const selectedSub = getSelectedSubKategori();
    if (!selectedSub) return 0;

    const tarif = parseInt(data.tarifRetribusi || 0) || 0;

    const variabelArray = Array.isArray(selectedSub.variabel)
      ? selectedSub.variabel
      : JSON.parse(selectedSub.variabel || "[]");

    const getVal = (name) => parseInt(data.variabelValues?.[name] ?? 0) || 0;

    // Ada rumus
    if (selectedSub.rumus && String(selectedSub.rumus).trim() !== "") {
      const rawFormula = String(selectedSub.rumus);
      let formula = rawFormula;

      // Replace semua variabel yang kita kenal + 'bulan'
      const namesToReplace = new Set([...variabelArray, "bulan"]);
      namesToReplace.forEach((name) => {
        const re = new RegExp(`\\b${name}\\b`, "gi");
        formula = formula.replace(re, String(getVal(name)));
      });

      let result = 0;
      try {
        // evaluasi aman untuk ekspresi aritmatika
        result = Function(`"use strict"; return (${formula})`)();
      } catch (error) {
        console.error("Error evaluate formula:", error, { formula });
        result = 0;
      }

      // Jika rumus TIDAK mengandung 'bulan', baru kalikan dengan bulan di luar
      const formulaHasBulan = /\bbulan\b/i.test(rawFormula);
      if (!formulaHasBulan) {
        result *= getVal("bulan");
      }

      return (result || 0) * tarif;
    }

    // TANPA rumus: kalikan semua variabel kecuali 'bulan'
    let total = tarif;
    variabelArray.forEach((field) => {
      if (field?.toLowerCase() === "bulan") return; // hindari double count
      const value = getVal(field);
      if (value > 0) total *= value;
    });

    // Tambahkan bulan hanya jika tidak ada di variabelArray
    if (!variabelArray.map((v) => String(v).toLowerCase()).includes("bulan")) {
      total *= getVal("bulan");
    }

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

  const handleSubmit = (e) => {
    e.preventDefault();

    clearErrors();

    const total = calculateTotal();

    let submitData = {
      ...data,
      tarifRetribusi: data.tarifRetribusi,
      totalRetribusi: total,
    };

    console.log(submitData)

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
    <section className="h-[calc(100dvh_-_80px)] touch-pan-y overflow-auto p-3">
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-5">
        {/* <div className="col-span-3 grid w-full gap-5 lg:col-span-3 lg:grid-cols-4"> */}
        <div className="col-span-3 grid w-full gap-5 lg:col-span-3 lg:grid-cols-3">
          <FormInput className="lg:col-span-1">
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
          <FormInput className="lg:col-span-1">
            <Label
              htmlFor="noWajibRetribusi"
              className="after:text-red-500 after:content-['*']"
            >
              Nomor Objek Retribusi
            </Label>
            <Input
              id="noWajibRetribusi"
              className={`${errors.noWajibRetribusi && "border border-red-500"} read-only:bg-transparent read-only:cursor-default read-only:selection:bg-transparent`}
              placeholder="Nomor Objek Retribusi..."
              value={data.noWajibRetribusi || generateWr}
              onChange={(e) =>
                handleInputChange("noWajibRetribusi", e.target.value)
              }
              // readOnly={true}
            />
            {errors.noWajibRetribusi && (
              <span className="text-xs text-red-500">
                {errors.noWajibRetribusi}
              </span>
            )}
          </FormInput>
          {/* <FormInput className="lg:col-span-1">
            <Label
              htmlFor="noSkrd"
              className="after:text-red-500 after:content-['*']"
            >
              Nomor SPKRD
            </Label>
            <Input
              id="noSkrd"
              className={`${errors.noSkrd && "border border-red-500"}`}
              placeholder="Nomor SPKRD..."
              value={data.noSkrd}
              onChange={(e) => handleInputChange("noSkrd", e.target.value)}
            />
            {errors.noSkrd && (
              <span className="text-xs text-red-500">{errors.noSkrd}</span>
            )}
          </FormInput> */}
          <FormInput className="lg:col-span-1">
            <Label htmlFor="tanggalSkrd">Tanggal SPKRD</Label>
            <Input
              type="date"
              id="tanggalSkrd"
              className={`w-full ${errors.tanggalSkrd && "border border-red-500"}`}
              value={data.tanggalSkrd}
              onChange={(e) => handleInputChange("tanggalSkrd", e.target.value)}
            />
            {errors.tanggalSkrd && (
              <span className="text-xs text-red-500">{errors.tanggalSkrd}</span>
            )}
          </FormInput>
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
          className="col-span-3"
        />
        <FormInput className="col-span-3">
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
          {errors.alamatObjekRetribusi && (
            <span className="text-xs text-red-500">
              {errors.alamatObjekRetribusi}
            </span>
          )}
        </FormInput>
        <div className="col-span-3 grid gap-5 lg:grid-cols-4">
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
        </div>
        <div className="col-span-3 grid gap-5 lg:grid-cols-2">
          <DropdownInput
            id="bentukUsaha"
            label="Bentuk Badan Usaha"
            placeholder="Pilih Bentuk Badan Usaha"
            value={data.bentukUsaha}
            onChange={(value) => handleInputChange("bentukUsaha", value)}
            options={badanUsahaOptions}
            error={errors.bentukUsaha}
            required={true}
            valueKey="value"
            labelKey="label"
            className="col-span-2 md:col-span-1"
          />
          <FormInput className="col-span-2 md:col-span-1">
            <Label
              htmlFor="deskripsi"
              className="after:text-red-500 after:content-['*']"
            >
              Deskripsi Usaha
            </Label>
            <Input
              id="deskripsi"
              className={`${errors.deskripsi && "border border-red-500"}`}
              placeholder="Deskripsi Usaha Contoh: warung nasi / toko sepatu / warung gado-gado..."
              value={data.deskripsi}
              onChange={(e) => handleInputChange("deskripsi", e.target.value)}
            />
            {errors.deskripsi && (
              <span className="text-xs text-red-500">{errors.deskripsi}</span>
            )}
          </FormInput>
        </div>
        <div className="col-span-3 grid gap-5 lg:grid-cols-3">
          <DropdownInput
            id="jenisTarif"
            label="Pilih Layanan"
            placeholder="Silahkan Pilih Layanan..."
            value={data.jenisTarif || "tarif"}
            onChange={handleJenisTarifChange}
            options={[
              { value: "tarif", label: "Tarif 1" },
              { value: "tarif2", label: "Tarif 2" },
            ]}
            error={errors.jenisTarif}
            required={true}
            valueKey="value"
            labelKey="label"
            className="col-span-2 md:col-span-1"
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
              className={`${errors["variabelValues.bulan"] && "border border-red-500"}`}
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
            {errors["variabelValues.bulan"] && (
              <span className="text-xs text-red-500">
                {errors["variabelValues.bulan"]}
              </span>
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
              readOnly
            />
            {errors.tarifRetribusi && (
              <span className="text-xs text-red-500">
                {errors.tarifRetribusi}
              </span>
            )}
          </FormInput>
          <FormInput className="col-span-2 md:col-span-1">
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
        <FormInput className="col-span-3">
          <Label
            htmlFor="keteranganBulan"
            className="after:text-red-500 after:content-['*']"
          >
            Keterangan Bulan
          </Label>
          <Input
            id="keteranganBulan"
            type="text"
            className={`${errors.keteranganBulan && "border border-red-500"}`}
            placeholder="Contoh: Bulan (Jan s.d Des)"
            value={data.keteranganBulan}
            onChange={(e) =>
              handleInputChange("keteranganBulan", e.target.value)
            }
          />
          {errors.keteranganBulan && (
            <span className="text-xs text-red-500">
              {errors.keteranganBulan}
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

          {/* console.log(variabelArray); */}

          const inputFields = ["unit", "m2", "giat", "hari", "meter"];

          return (
            <div className="col-span-3 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
                      id={`variabel-${field}`}
                      className={`${isEnabled ? "bg-gray-200" : "cursor-not-allowed bg-slate-300"} ${errors[`variabelValues.${field}`] && "border border-red-500"}`}
                      type="number"
                      placeholder={
                        field === "giat"
                          ? "Jumlah kegiatan 1 atau 2 atau 3"
                          : `Masukkan nilai ${field}...`
                      }
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
            </div>
          );
        })()}
        <div className="col-span-3 grid gap-5 lg:grid-cols-3">
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
            className="col-span-2 md:col-span-1"
          />
          {/* <DropdownInput
          id="penagih"
          label="Penagih"
          placeholder="Pilih Status Tempat..."
          value={data.statusTempat}
          onChange={(value) => handleInputChange("statusTempat", value)}
          options={statusTempat}
          error={errors.statusTempat}
          required={true}
          valueKey="value"
          labelKey="label"
          className="col-span-2"
        /> */}
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
                handleInputChange(
                  "jBangunan",
                  e.target.value.replace(/\D/g, ""),
                )
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
        </div>
        <div className="col-span-3 grid gap-5 lg:grid-cols-3">
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
            />
            {errors.longitude && (
              <span className="text-xs text-red-500">{errors.longitude}</span>
            )}
          </FormInput>
          <FormInput className="col-span-2 md:col-span-1">
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
        </div>
        <FormInput className="z-0 col-span-3">
          <MapPicker
            latitude={data.latitude || ""}
            longitude={data.longitude || ""}
            onLocationChange={handleLocationChange}
            editable={true}
            height="400px"
            resetTrigger={mapReset}
          />
        </FormInput>
        <div className="col-span-3 grid gap-5 lg:grid-cols-3">
          <FormInput className="col-span-2 md:col-span-1">
            <Label
              htmlFor="fotoBangunan"
            >
              Upload Foto Bangunan
            </Label>
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
              onChange={(e) =>
                handleFileChange("fotoBerkas", e.target.files[0])
              }
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
          {/* <FormInput className="col-span-2 md:col-span-1">
            <Label
              htmlFor="penagih"
              className="after:text-red-500 after:content-['*']"
            >
              Nama Penagih/Kolektor
            </Label>
            <Input
              type="text"
              id="penagih"
              className={`${errors.jBangunan && "border border-red-500"}`}
              placeholder="Pilih Penagih..."
              // value={data.jBangunan}
              // onKeyDown={(e) => {
              //   if (!isAllowedKey(e)) {
              //     e.preventDefault();
              //   }
              // }}
              // onChange={(e) =>
              //   handleInputChange("jBangunan", e.target.value.replace(/\D/g, ""))
              // }
            />
            {errors.jBangunan && (
              <span className="text-xs text-red-500">{errors.jBangunan}</span>
            )}
          </FormInput> */}
          <DropdownInput
            id="penagih"
            label="Nama Penagih/Kolektor"
            placeholder="Pilih Penagih..."
            value={data.penagihId}
            onChange={(value) => handleInputChange("penagihId", value)}
            options={penagihOptions}
            error={errors.penagihId}
            required={true}
            valueKey="value"
            labelKey="label"
            className="col-span-2 md:col-span-1"
          />
        </div>
        <div className="col-span-3 flex flex-col gap-1.5 text-sm md:flex-row md:justify-end md:gap-4">
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
