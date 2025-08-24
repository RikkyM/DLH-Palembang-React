import DropdownInput from "@/Components/DropdownInput";
import MapPicker from "@/Components/MapPicker";
import Layout from "../../Layout";
import { useForm } from "@inertiajs/react";
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useState } from "react";
import { isAllowedKey } from "@/Utils/inputValidators";
import WajibRetribusiCreate from "../../../../Components/WajibRetribusi/Create";

const Create = (props
//   {
//   pemohonOptions = [],
//   kecamatanOptions = [],
//   kelurahanOptions = [],
//   kategoriOptions = [],
//   subKategoriOptions = [],
// }
) => {
  // const [mapReset, setMapReset] = useState(0);

  // const getSelectedSubKategori = () => {
  //   if (!data.kodeKategori || !data.kodeSubKategori) return null;

  //   const subKategoriList = subKategoriOptions[data.kodeKategori] || [];
  //   return subKategoriList.find((sub) => sub.value === data.kodeSubKategori);
  // };

  // const initialData = {
  //   namaObjekRetribusi: "",
  //   pemilikId: "",
  //   alamatObjekRetribusi: "",
  //   rt: "",
  //   rw: "",
  //   kodeKecamatan: "",
  //   kodeKelurahan: "",
  //   bentukUsaha: "",
  //   deskripsi: "",
  //   kodeKategori: "",
  //   kodeSubKategori: "",
  //   statusTempat: "",
  //   jBangunan: "",
  //   jLantai: "",
  //   linkMap: "",
  //   latitude: null,
  //   longitude: null,
  //   fotoBangunan: null,
  //   fotoBerkas: null,
  //   variabelValues: {},
  //   tarifRetribusi: 0,
  //   jenisTarif: "tarif",
  // };

  // const handleVariabelChange = (variabelName, value) => {
  //   setData((prevData) => ({
  //     ...prevData,
  //     variabelValues: {
  //       ...prevData.variabelValues,
  //       [variabelName]: value,
  //     },
  //   }));
  // };

  // const { data, setData, errors, processing, clearErrors, post } =
  //   useForm(initialData);

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

  // const handleLocationChange = useCallback(
  //   (lat, lng) => {
  //     setData((prevData) => ({
  //       ...prevData,
  //       latitude: lat.toString(),
  //       longitude: lng.toString(),
  //     }));
  //   },
  //   [setData],
  // );

  // const handleFileChange = (field, file) => {
  //   setData(field, file);
  //   if (errors[field]) {
  //     clearErrors(field);
  //   }
  // };

  // const handleInputChange = (field, value) => {
  //   setData(field, value);

  //   if (errors[field]) {
  //     clearErrors(field);
  //   }
  // };

  // const handleJenisTarifChange = (value) => {
  //   setData("jenisTarif", value);

  //   const selectedSub = (subKategoriOptions[data.kodeKategori] || []).find(
  //     (sub) => sub.value === data.kodeSubKategori,
  //   );

  //   if (selectedSub) {
  //     const tarifValue =
  //       value === "tarif2" ? selectedSub.tarif2 : selectedSub.tarif;
  //     setData("tarifRetribusi", tarifValue || 0);
  //   }
  // };

  // const handleKategoriChange = (value) => {
  //   setData((prevData) => ({
  //     ...prevData,
  //     kodeKategori: value,
  //     kodeSubKategori: "",
  //     variabelValues: {},
  //     tarifRetribusi: 0,
  //   }));

  //   if (errors.kodeKategori) {
  //     clearErrors("kodeKategori");
  //   }
  //   if (errors.kodeSubKategori) {
  //     clearErrors("kodeSubKategori");
  //   }

  //   Object.keys(errors).forEach((key) => {
  //     if (key.startsWith("variabelValues.")) {
  //       clearErrors(key);
  //     }
  //   });
  // };

  // const hasTarif2 = () => {
  //   const selectedSub = getSelectedSubKategori();
  //   return (
  //     selectedSub && selectedSub.tarif2 != null && selectedSub.tarif2 !== ""
  //   );
  // };

  // const handleSubKategoriChange = (value) => {
  //   const selectedSub = (subKategoriOptions[data.kodeKategori] || []).find(
  //     (sub) => sub.value === value,
  //   );

  //   let jenisTarif = data.jenisTarif;

  //   if (
  //     jenisTarif === "tarif2" &&
  //     (!selectedSub?.tarif2 || selectedSub.tarif2 === "")
  //   ) {
  //     jenisTarif = "tarif";
  //   }

  //   setData((prevData) => ({
  //     ...prevData,
  //     kodeSubKategori: value,
  //     variabelValues: { bulan: 1 },
  //     jenisTarif: jenisTarif,
  //     tarifRetribusi: selectedSub
  //       ? jenisTarif === "tarif2"
  //         ? selectedSub.tarif2
  //         : selectedSub.tarif
  //       : "",
  //   }));

  //   if (errors.kodeSubKategori) {
  //     clearErrors("kodeSubKategori");
  //   }

  //   Object.keys(errors).forEach((key) => {
  //     if (key.startsWith("variabelValues.")) {
  //       clearErrors(key);
  //     }
  //   });
  // };

  // const handleClearForm = () => {
  //   setData({
  //     ...initialData,
  //     variabelValues: {},
  //   });
  //   clearErrors();

  //   const fileInputs = document.querySelectorAll('input[type="file"]');
  //   fileInputs.forEach((input) => {
  //     input.value = "";
  //   });

  //   setMapReset((prev) => prev + 1);
  // };

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
  //       const value = parseInt(data.variabelValues?.[field] || 0);
  //       formula = formula.replaceAll(field, value || 0);
  //     });

  //     try {
  //       let result = Function(`"use strict"; return (${formula})`)();

  //       // selalu kalikan bulan kalau ada
  //       const bulan = parseInt(data.variabelValues?.bulan || 0);
  //       if (bulan > 0) result *= bulan;

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

  // useEffect(() => {
  //   const total = calculateTotal();

  //   if (data.totalRetribusi !== total) {
  //     setData("totalRetribusi", total);
  //   }
  // }, [
  //   data.variabelValues,
  //   data.tarifRetribusi,
  //   data.jenisTarif,
  //   data.kodeSubKategori,
  // ]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   clearErrors();

  //   const total = calculateTotal();

  //   console.log(data.tarifRetribusi);

  //   post(route("pendaftar.wajib-retribusi.store"), {
  //     data: {
  //       ...data,
  //       tarifRetribusi: data.tarifRetribusi,
  //       totalRetribusi: total,
  //     },
  //     onSuccess: () => {
  //       setData(initialData);
  //     },
  //     onError: (e) => {
  //       console.error(e);
  //     },
  //   });
  // };

  return (
    // <Layout title="FORM OBJEK RETRIBUSI">
    //   <section className="p-3">
    //     <form
    //       onSubmit={handleSubmit}
    //       className="grid grid-cols-1 gap-5 md:grid-cols-2"
    //     >
    //       <div className="col-span-2 flex flex-col gap-1.5 text-sm">
    //         <label
    //           htmlFor="namaObjekRetribusi"
    //           className="after:text-red-500 after:content-['*']"
    //         >
    //           Nama Objek Retribusi
    //         </label>
    //         <input
    //           className={`rounded bg-gray-200 px-3 py-2 outline-none ${errors.namaObjekRetribusi && "border border-red-500"}`}
    //           type="text"
    //           id="namaObjekRetribusi"
    //           autoComplete="off"
    //           placeholder="Nama Objek Retribusi..."
    //           value={data.namaObjekRetribusi}
    //           onChange={(e) =>
    //             handleInputChange("namaObjekRetribusi", e.target.value)
    //           }
    //         />
    //         {errors.namaObjekRetribusi && (
    //           <span className="text-xs text-red-500">
    //             {errors.namaObjekRetribusi}
    //           </span>
    //         )}
    //       </div>
    //       <DropdownInput
    //         id="pemohon"
    //         label="Pilih Pemohon"
    //         placeholder="Silahkan Pilih Pemohon..."
    //         value={data.pemilikId}
    //         onChange={(value) => handleInputChange("pemilikId", value)}
    //         options={pemohonOptions}
    //         error={errors.pemilikId}
    //         required={true}
    //         valueKey="value"
    //         labelKey="label"
    //         className="col-span-2"
    //       />
    //       <div className="col-span-2 flex flex-col gap-1.5 text-sm">
    //         <label
    //           htmlFor="alamatObjekRetribusi"
    //           className="after:text-red-500 after:content-['*']"
    //         >
    //           Alamat Objek Retribusi
    //         </label>
    //         <input
    //           className={`rounded bg-gray-200 px-3 py-2 outline-none ${errors.alamatObjekRetribusi && "border border-red-500"}`}
    //           type="text"
    //           id="alamatObjekRetribusi"
    //           autoComplete="off"
    //           placeholder="contoh: Jalan Srikandi Nomor 16/ Lorong Asahan Nomor 38"
    //           value={data.alamatObjekRetribusi}
    //           onChange={(e) =>
    //             handleInputChange("alamatObjekRetribusi", e.target.value)
    //           }
    //         />
    //         {errors.alamatObjekRetribusi && (
    //           <span className="text-xs text-red-500">
    //             {errors.alamatObjekRetribusi}
    //           </span>
    //         )}
    //       </div>
    //       <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
    //         <label
    //           htmlFor="rt"
    //           className="after:text-red-500 after:content-['*']"
    //         >
    //           RT
    //         </label>
    //         <input
    //           className={`rounded bg-gray-200 px-3 py-2 outline-none ${errors.rt && "border border-red-500"}`}
    //           type="number"
    //           id="rt"
    //           autoComplete="off"
    //           placeholder="RT"
    //           value={data.rt}
    //           onKeyDown={(e) => {
    //             if (!isAllowedKey(e)) {
    //               e.preventDefault();
    //             }
    //           }}
    //           onChange={(e) => {
    //             const value = e.target.value.replace(/\D/g, "");
    //             if (value.length <= 3) {
    //               setData("rt", value);
    //             }
    //           }}
    //         />
    //         {errors.rt && (
    //           <span className="text-xs text-red-500">{errors.rt}</span>
    //         )}
    //       </div>
    //       <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
    //         <label
    //           htmlFor="rw"
    //           className="after:text-red-500 after:content-['*']"
    //         >
    //           RW
    //         </label>
    //         <input
    //           className={`rounded bg-gray-200 px-3 py-2 outline-none ${errors.rw && "border border-red-500"}`}
    //           type="number"
    //           id="rw"
    //           autoComplete="off"
    //           placeholder="RW"
    //           value={data.rw}
    //           onKeyDown={(e) => {
    //             if (!isAllowedKey(e)) {
    //               e.preventDefault();
    //             }
    //           }}
    //           onChange={(e) => {
    //             const value = e.target.value.replace(/\D/g, "");
    //             if (value.length <= 3) {
    //               setData("rw", value);
    //             }
    //           }}
    //         />
    //         {errors.rw && (
    //           <span className="text-xs text-red-500">{errors.rw}</span>
    //         )}
    //       </div>
    //       <DropdownInput
    //         id="kecamatan"
    //         label="Pilih Kecamatan"
    //         placeholder="Silahkan Pilih Kecamatan..."
    //         value={data.kodeKecamatan}
    //         onChange={(value) => handleInputChange("kodeKecamatan", value)}
    //         options={kecamatanOptions}
    //         error={errors.kodeKecamatan}
    //         required={true}
    //         valueKey="value"
    //         labelKey="label"
    //         className="col-span-2 md:col-span-1"
    //       />
    //       <DropdownInput
    //         id="kelurahan"
    //         label="Pilih Kelurahan"
    //         placeholder="Silahkan Pilih Kelurahan..."
    //         value={data.kodeKelurahan}
    //         onChange={(value) => handleInputChange("kodeKelurahan", value)}
    //         options={filteredKelurahanOptions}
    //         error={errors.kodeKelurahan}
    //         required={true}
    //         valueKey="value"
    //         labelKey="label"
    //         disabled={!data.kodeKecamatan}
    //         className="col-span-2 md:col-span-1"
    //       />
    //       <DropdownInput
    //         id="bentukUsaha"
    //         label="Bentuk Badan Usaha"
    //         placeholder="Pilih Bentuk Badan Usaha"
    //         value={data.bentukUsaha}
    //         onChange={(value) => handleInputChange("bentukUsaha", value)}
    //         options={bentukUsaha}
    //         error={errors.bentukUsaha}
    //         required={true}
    //         valueKey="value"
    //         labelKey="label"
    //         className="col-span-2"
    //       />
    //       <div className="col-span-2 flex flex-col gap-1.5 text-sm">
    //         <label
    //           htmlFor="deskripsi"
    //           className="after:text-red-500 after:content-['*']"
    //         >
    //           Deskripsi Usaha
    //         </label>
    //         <input
    //           className={`rounded bg-gray-200 px-3 py-2 outline-none ${errors.deskripsi && "border border-red-500"}`}
    //           type="text"
    //           id="deskripsi"
    //           autoComplete="off"
    //           placeholder="Deskripsi Usaha..."
    //           value={data.deskripsi}
    //           onChange={(e) => handleInputChange("deskripsi", e.target.value)}
    //         />
    //         {errors.deskripsi && (
    //           <span className="text-xs text-red-500">{errors.deskripsi}</span>
    //         )}
    //       </div>
    //       <DropdownInput
    //         id="jenisTarif"
    //         label="Pilih Layanan"
    //         placeholder="Silahkan Pilih Layanan..."
    //         value={data.jenisTarif || "tarif"}
    //         onChange={handleJenisTarifChange}
    //         options={[
    //           { value: "tarif", label: "Tarif 1" },
    //           { value: "tarif2", label: "Tarif 2" },
    //         ]}
    //         error={errors.jenisTarif}
    //         required={true}
    //         valueKey="value"
    //         labelKey="label"
    //         className="col-span-2"
    //       />
    //       <DropdownInput
    //         id="kategori"
    //         label="Pilih Kategori"
    //         placeholder="Silahkan Pilih Kategori..."
    //         value={data.kodeKategori}
    //         onChange={handleKategoriChange}
    //         options={kategoriOptions}
    //         error={errors.kodeKategori}
    //         required={true}
    //         valueKey="value"
    //         labelKey="label"
    //         className="col-span-2 md:col-span-1"
    //       />
    //       <DropdownInput
    //         id="subkategori"
    //         label="Pilih Sub Kategori"
    //         placeholder="Silahkan Pilih Sub Kategori..."
    //         value={data.kodeSubKategori}
    //         onChange={handleSubKategoriChange}
    //         options={filteredSubKategoriOptions}
    //         error={errors.kodeSubKategori}
    //         required={true}
    //         valueKey="value"
    //         labelKey="label"
    //         disabled={!data.kodeKategori}
    //         className="col-span-2 md:col-span-1"
    //       />
    //       <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
    //         <label
    //           htmlFor="bulan"
    //           className="after:text-red-500 after:content-['*']"
    //         >
    //           Bulan
    //         </label>
    //         <input
    //           className={`rounded bg-gray-200 px-3 py-2 outline-none ${errors.bulan && "border border-red-500"}`}
    //           type="number"
    //           min={1}
    //           max={99}
    //           id="bulan"
    //           autoComplete="off"
    //           placeholder="Jumlah Bulan..."
    //           value={data.variabelValues.bulan || ""}
    //           onKeyDown={(e) => {
    //             if (!isAllowedKey(e)) {
    //               e.preventDefault();
    //             }
    //           }}
    //           onChange={(e) => {
    //             const value = e.target.value.replace(/\D/g, "");

    //             if (value >= 0 && value.length <= 2) {
    //               handleVariabelChange("bulan", value);
    //             }
    //           }}
    //         />
    //         {errors.bulan && (
    //           <span className="text-xs text-red-500">{errors.bulan}</span>
    //         )}
    //       </div>
    //       <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
    //         <label htmlFor="tarifRetribusi">Tarif Retribusi</label>
    //         <input
    //           className={`rounded bg-gray-200 px-3 py-2 outline-none ${errors.bulan && "border border-red-500"}`}
    //           type="text"
    //           id="tarifRetribusi"
    //           autoComplete="off"
    //           tabIndex={-1}
    //           // placeholder="Jumlah Bulan..."
    //           value={
    //             new Intl.NumberFormat("id-ID", {
    //               style: "currency",
    //               currency: "IDR",
    //               // minimumFractionDigits: 0
    //             }).format(data.tarifRetribusi) || 0
    //           }
    //           // onChange={(e) =>
    //           //   setData("tarifRetribusi", e.target.value.replace(/\D/g, ""))
    //           // }
    //           readOnly={true}
    //         />
    //         {errors.tarifRetribusi && (
    //           <span className="text-xs text-red-500">
    //             {errors.tarifRetribusi}
    //           </span>
    //         )}
    //       </div>
    //       {(() => {
    //         const selectedSubKategori = getSelectedSubKategori();

    //         let variabelArray = [];

    //         if (selectedSubKategori && selectedSubKategori.variabel) {
    //           variabelArray = Array.isArray(selectedSubKategori.variabel)
    //             ? selectedSubKategori.variabel
    //             : JSON.parse(selectedSubKategori.variabel || "[]");
    //         }

    //         {
    //           /* const inputFields = [
    //           "bulan",
    //           "unit",
    //           "m2",
    //           "giat",
    //           "hari",
    //           "meter",
    //         ]; */
    //         }

    //         const inputFields = ["unit", "m2", "giat", "hari", "meter"];

    //         return (
    //           <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
    //             {inputFields.map((field, index) => {
    //               const isEnabled = variabelArray.includes(field);
    //               return (
    //                 <div
    //                   key={`variabel-${field}-${index}`}
    //                   className="flex flex-col gap-1.5 text-sm"
    //                 >
    //                   <label
    //                     htmlFor={`variabel-${field}`}
    //                     className="capitalize after:text-red-500 after:content-['*']"
    //                   >
    //                     {field}
    //                   </label>
    //                   <input
    //                     className={`px-3 py-2 outline-none ${
    //                       isEnabled
    //                         ? "bg-gray-200"
    //                         : "cursor-not-allowed bg-gray-100"
    //                     }`}
    //                     type="number"
    //                     id={`variabel-${field}`}
    //                     autoComplete="off"
    //                     placeholder={`Masukkan nilai ${field}...`}
    //                     value={data.variabelValues[field] || ""}
    //                     onKeyDown={(e) => {
    //                       if (!isAllowedKey(e)) {
    //                         e.preventDefault();
    //                       }
    //                     }}
    //                     onChange={(e) => {
    //                       const value = e.target.value.replace(/\D/g, "");

    //                       if (value >= 0 && value.length <= 10) {
    //                         handleVariabelChange(field, value);
    //                       }
    //                     }}
    //                     required
    //                     disabled={!isEnabled}
    //                   />
    //                   {errors[`variabelValues.${field}`] && (
    //                     <span className="text-xs text-red-500">
    //                       {errors[`variabelValues.${field}`]}
    //                     </span>
    //                   )}
    //                 </div>
    //               );
    //             })}
    //             <div className="col-span-1 flex flex-col gap-1.5 text-sm">
    //               <label htmlFor="total">Total Retribusi</label>
    //               <input
    //                 className="rounded bg-gray-200 px-3 py-2 outline-none"
    //                 type="text"
    //                 id="total"
    //                 value={new Intl.NumberFormat("id-ID", {
    //                   style: "currency",
    //                   currency: "IDR",
    //                 }).format(calculateTotal())}
    //                 readOnly
    //               />
    //               {errors.totalRetribusi && (
    //                 <span className="text-xs text-red-500">
    //                   {errors.totalRetribusi}
    //                 </span>
    //               )}
    //             </div>
    //           </div>
    //         );
    //       })()}

    //       <DropdownInput
    //         id="statusTempat"
    //         label="Status Tempat"
    //         placeholder="Pilih Status Tempat..."
    //         value={data.statusTempat}
    //         onChange={(value) => handleInputChange("statusTempat", value)}
    //         options={statusTempat}
    //         error={errors.statusTempat}
    //         required={true}
    //         valueKey="value"
    //         labelKey="label"
    //         className="col-span-2"
    //       />
    //       <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
    //         <label
    //           htmlFor="jBangunan"
    //           className="after:text-red-500 after:content-['*']"
    //         >
    //           Jumlah Bangunan
    //         </label>
    //         <input
    //           className={`rounded bg-gray-200 px-3 py-2 outline-none ${errors.jBangunan && "border border-red-500"}`}
    //           type="number"
    //           id="jBangunan"
    //           autoComplete="off"
    //           placeholder="Jumlah Bangunan..."
    //           value={data.jBangunan}
    //           onKeyDown={(e) => {
    //             if (!isAllowedKey(e)) {
    //               e.preventDefault();
    //             }
    //           }}
    //           onChange={(e) =>
    //             setData("jBangunan", e.target.value.replace(/\D/g, ""))
    //           }
    //         />
    //         {errors.jBangunan && (
    //           <span className="text-xs text-red-500">{errors.jBangunan}</span>
    //         )}
    //       </div>
    //       <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
    //         <label
    //           htmlFor="jLantai"
    //           className="after:text-red-500 after:content-['*']"
    //         >
    //           Jumlah Lantai
    //         </label>
    //         <input
    //           className={`rounded bg-gray-200 px-3 py-2 outline-none ${errors.jLantai && "border border-red-500"}`}
    //           type="text"
    //           id="jLantai"
    //           autoComplete="off"
    //           placeholder="Jumlah Lantai..."
    //           value={data.jLantai}
    //           onKeyDown={(e) => {
    //             if (!isAllowedKey(e)) {
    //               e.preventDefault();
    //             }
    //           }}
    //           onChange={(e) =>
    //             setData("jLantai", e.target.value.replace(/\D/g, ""))
    //           }
    //         />
    //         {errors.jLantai && (
    //           <span className="text-xs text-red-500">{errors.jLantai}</span>
    //         )}
    //       </div>
    //       <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
    //         <label
    //           htmlFor="latitude"
    //           className="after:text-red-500 after:content-['*']"
    //         >
    //           Latitude
    //         </label>
    //         <input
    //           className={`rounded bg-gray-200 px-3 py-2 outline-none ${errors.latitude && "border border-red-500"}`}
    //           type="text"
    //           id="latitude"
    //           autoComplete="off"
    //           placeholder="Latitude..."
    //           value={data.latitude || ""}
    //           onChange={(e) => {
    //             let value = e.target.value.replace(/[^0-9\.\-]/g, "");

    //             const parts = value.split(".");

    //             if (parts.length > 2) {
    //               value = parts[0] + "." + parts.slice(1).join("");
    //             }

    //             value = value.replace(/(?!^)-/g, "");

    //             if (value.includes("-") && value.indexOf("-") > 0) {
    //               value = value.replace("-", "");
    //             }

    //             setData("latitude", value);
    //           }}
    //         />
    //         {errors.latitude && (
    //           <span className="text-xs text-red-500">{errors.latitude}</span>
    //         )}
    //       </div>
    //       <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
    //         <label
    //           htmlFor="longitude"
    //           className="after:text-red-500 after:content-['*']"
    //         >
    //           Longitude
    //         </label>
    //         <input
    //           className={`rounded bg-gray-200 px-3 py-2 outline-none ${errors.longitude && "border border-red-500"}`}
    //           type="text"
    //           id="longitude"
    //           autoComplete="off"
    //           placeholder="Longitude..."
    //           value={data.longitude || ""}
    //           onChange={(e) => {
    //             let value = e.target.value;

    //             value = value.replace(/[^0-9\.\-]/g, "");

    //             const parts = value.split(".");
    //             if (parts.length > 2) {
    //               value = parts[0] + "." + parts.slice(1).join("");
    //             }

    //             value = value.replace(/(?!^)-/g, "");
    //             if (value.includes("-") && value.indexOf("-") > 0) {
    //               value = value.replace("-", "");
    //             }

    //             setData("longitude", value);
    //           }}
    //         />
    //         {errors.longitude && (
    //           <span className="text-xs text-red-500">{errors.longitude}</span>
    //         )}
    //       </div>
    //       <div className="col-span-2 flex flex-col gap-1.5 text-sm">
    //         <label htmlFor="linkMap">Link Map</label>
    //         <input
    //           className={`rounded bg-gray-200 px-3 py-2 outline-none ${errors.linkMap && "border border-red-500"}`}
    //           type="url"
    //           id="linkMap"
    //           autoComplete="off"
    //           placeholder="Link Map..."
    //           value={data.linkMap}
    //           onChange={(e) => handleInputChange("linkMap", e.target.value)}
    //         />
    //         {errors.linkMap && (
    //           <span className="text-xs text-red-500">{errors.linkMap}</span>
    //         )}
    //       </div>
    //       <div className="z-0 col-span-2 flex flex-col gap-1.5 text-sm">
    //         <MapPicker
    //           latitude={data.latitude || ""}
    //           longitude={data.longitude || ""}
    //           onLocationChange={handleLocationChange}
    //           height="400px"
    //           resetTrigger={mapReset}
    //         />
    //       </div>
    //       <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
    //         <label htmlFor="fotoBangunan">Upload Foto Bangunan</label>
    //         <input
    //           className="bg-gray-200 px-3 py-2 outline-none"
    //           type="file"
    //           id="fotoBangunan"
    //           accept="image/*"
    //           onChange={(e) =>
    //             handleFileChange("fotoBangunan", e.target.files[0])
    //           }
    //           required
    //         />
    //         {errors.fotoBangunan && (
    //           <span className="text-xs text-red-500">
    //             {errors.fotoBangunan}
    //           </span>
    //         )}
    //         {data.fotoBangunan && (
    //           <span className="text-xs text-green-600">
    //             File dipilih: {data.fotoBangunan.name}
    //           </span>
    //         )}
    //       </div>
    //       <div className="col-span-2 flex flex-col gap-1.5 text-sm md:col-span-1">
    //         <label htmlFor="fotoBerkas">Upload Foto Berkas Persyaratan</label>
    //         <input
    //           className="bg-gray-200 px-3 py-2 outline-none"
    //           type="file"
    //           accept="image/*"
    //           id="fotoBerkas"
    //           onChange={(e) =>
    //             handleFileChange("fotoBerkas", e.target.files[0])
    //           }
    //           required
    //         />
    //         {errors.fotoBerkas && (
    //           <span className="text-xs text-red-500">{errors.fotoBerkas}</span>
    //         )}
    //         {data.fotoBerkas && (
    //           <span className="text-xs text-green-600">
    //             File dipilih: {data.fotoBerkas.name}
    //           </span>
    //         )}
    //       </div>
    //       <div className="col-span-2 flex flex-col gap-1.5 text-sm md:flex-row md:justify-end md:gap-4">
    //         <button
    //           type="button"
    //           onClick={handleClearForm}
    //           className="order-2 md:order-1"
    //         >
    //           Clear Form
    //         </button>
    //         <button
    //           type="submit"
    //           disabled={processing}
    //           className="order-1 rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:bg-blue-300 md:order-2"
    //         >
    //           {processing ? "Submitting..." : "Submit Data"}
    //         </button>
    //       </div>
    //     </form>
    //   </section>
    // </Layout>
    <Layout title="FORM OBJEK RETRIBUSI">
      <WajibRetribusiCreate
        {...props}
        userRole="ROLE_PENDAFTAR"
      />
    </Layout>
  );
};

export default Create;
