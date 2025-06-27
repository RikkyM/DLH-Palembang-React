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
        return subKategoriList.find(
            (sub) => sub.value === data.kodeSubKategori
        );
    };

    const initialData = {
        namaObjekRetribusi: "",
        pemilikId: "",
        alamatObjekRetribusi: "",
        rt: "",
        rw: "",
        kodeKecamatan: "",
        kodeKelurahan: "",
        deskripsi: "",
        kodeKategori: "",
        kodeSubKategori: "",
        statusTempat: "",
        jBangunan: "",
        jLantai: "",
        latitude: null,
        longitude: null,
        fotoBangunan: null,
        fotoBerkas: null,
        variabelValues: {},
    };

    const handleVariabelChange = (variabelName, value) => {
        setData(prevData => ({
            ...prevData,
            variabelValues: {
                ...prevData.variabelValues,
                [variabelName]: value
            }
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

    const handleLocationChange = useCallback(
        (lat, lng) => {
            setData((prevData) => ({
                ...prevData,
                latitude: lat.toString(),
                longitude: lng.toString(),
            }));
        },
        [setData]
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
            kodeSubKategori: "", // Reset sub kategori
            variabelValues: {}, // Reset all variable values
        }));

        // Clear errors for kategori, subkategori, and variabel fields
        if (errors.kodeKategori) {
            clearErrors("kodeKategori");
        }
        if (errors.kodeSubKategori) {
            clearErrors("kodeSubKategori");
        }

        // Clear variabel errors
        Object.keys(errors).forEach((key) => {
            if (key.startsWith("variabelValues.")) {
                clearErrors(key);
            }
        });
    };

    // Handle sub kategori change with variable reset
    const handleSubKategoriChange = (value) => {
        setData((prevData) => ({
            ...prevData,
            kodeSubKategori: value,
            variabelValues: {}, // Reset all variable values
        }));

        // Clear errors for subkategori and variabel fields
        if (errors.kodeSubKategori) {
            clearErrors("kodeSubKategori");
        }

        // Clear variabel errors
        Object.keys(errors).forEach((key) => {
            if (key.startsWith("variabelValues.")) {
                clearErrors(key);
            }
        });
    };

    const handleClearForm = () => {
        setData({
            ...initialData,
            variabelValues: {}, // Reset variabel values
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
                onClose();
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
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                    <div className="flex flex-col gap-1.5 text-sm md:col-span-2">
                        <label
                            htmlFor="namaObjekRetribusi"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Nama Objek Retribusi
                        </label>
                        <input
                            className="px-3 py-2 bg-gray-200 outline-none"
                            type="text"
                            id="namaObjekRetribusi"
                            autoComplete="off"
                            placeholder="Nama Objek Retribusi..."
                            value={data.namaObjekRetribusi}
                            onChange={(e) =>
                                handleInputChange(
                                    "namaObjekRetribusi",
                                    e.target.value
                                )
                            }
                        />
                    </div>
                    <DropdownInput
                        id="pemohon"
                        label="Pilih Pemohon"
                        placeholder="Silahkan Pilih Pemohon..."
                        value={data.pemilikId}
                        onChange={(value) =>
                            handleInputChange("pemilikId", value)
                        }
                        options={pemohonOptions}
                        error={errors.pemilikId}
                        required={true}
                        valueKey="value"
                        labelKey="label"
                        className="md:col-span-2"
                    />
                    <div className="flex flex-col gap-1.5 text-sm md:col-span-2">
                        <label
                            htmlFor="alamatObjekRetribusi"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Alamat Objek Retribusi
                        </label>
                        <input
                            className="px-3 py-2 bg-gray-200 outline-none"
                            type="text"
                            id="alamatObjekRetribusi"
                            autoComplete="off"
                            placeholder="contoh: Jalan Srikandi Nomor 16/ Lorong Asahan Nomor 38"
                            value={data.alamatObjekRetribusi}
                            onChange={(e) =>
                                handleInputChange(
                                    "alamatObjekRetribusi",
                                    e.target.value
                                )
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="rt"
                            className="after:content-['*'] after:text-red-500"
                        >
                            RT
                        </label>
                        <input
                            className="px-3 py-2 bg-gray-200 outline-none"
                            type="text"
                            id="rt"
                            autoComplete="off"
                            placeholder="RT"
                            value={data.rt}
                            onChange={(e) =>
                                handleInputChange("rt", e.target.value)
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="rw"
                            className="after:content-['*'] after:text-red-500"
                        >
                            RW
                        </label>
                        <input
                            className="px-3 py-2 bg-gray-200 outline-none"
                            type="text"
                            id="rw"
                            autoComplete="off"
                            placeholder="RW"
                            value={data.rw}
                            onChange={(e) =>
                                handleInputChange("rw", e.target.value)
                            }
                        />
                    </div>
                    <DropdownInput
                        id="kecamatan"
                        label="Pilih Kecamatan"
                        placeholder="Silahkan Pilih Kecamatan..."
                        value={data.kodeKecamatan}
                        onChange={(value) =>
                            handleInputChange("kodeKecamatan", value)
                        }
                        options={kecamatanOptions}
                        error={errors.kodeKecamatan}
                        required={true}
                        valueKey="value"
                        labelKey="label"
                    />
                    <DropdownInput
                        id="kelurahan"
                        label="Pilih Kelurahan"
                        placeholder="Silahkan Pilih Kelurahan..."
                        value={data.kodeKelurahan}
                        onChange={(value) =>
                            handleInputChange("kodeKelurahan", value)
                        }
                        options={filteredKelurahanOptions}
                        error={errors.kodeKelurahan}
                        required={true}
                        valueKey="value"
                        labelKey="label"
                        disabled={!data.kodeKecamatan}
                    />
                    <div className="flex flex-col gap-1.5 text-sm md:col-span-2">
                        <label
                            htmlFor="deskripsi"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Deskripsi Usaha
                        </label>
                        <input
                            className="px-3 py-2 bg-gray-200 outline-none"
                            type="text"
                            id="deskripsi"
                            autoComplete="off"
                            placeholder="Deskripsi Usaha..."
                            value={data.deskripsi}
                            onChange={(e) =>
                                handleInputChange("deskripsi", e.target.value)
                            }
                        />
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
                    />
                    {(() => {
                        const selectedSubKategori = getSelectedSubKategori();

                        if (
                            !selectedSubKategori ||
                            !selectedSubKategori.variabel
                        ) {
                            return null;
                        }

                        const variabelArray = Array.isArray(
                            selectedSubKategori.variabel
                        )
                            ? selectedSubKategori.variabel
                            : JSON.parse(selectedSubKategori.variabel || "[]");

                        if (variabelArray.length === 0) {
                            return null;
                        }

                        return (
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {variabelArray.map((variabel, index) => (
                                    <div
                                        key={`${selectedSubKategori.value}-${variabel}-${index}`}
                                        className="flex flex-col gap-1.5 text-sm"
                                    >
                                        <label
                                            htmlFor={`variabel-${variabel}`}
                                            className="capitalize after:content-['*'] after:text-red-500"
                                        >
                                            {variabel}
                                        </label>
                                        <input
                                            className="px-3 py-2 bg-gray-200 outline-none"
                                            type="number"
                                            id={`variabel-${variabel}`}
                                            autoComplete="off"
                                            placeholder={`Masukkan nilai ${variabel}...`}
                                            value={
                                                data.variabelValues[variabel] ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                handleVariabelChange(
                                                    variabel,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {errors[
                                            `variabelValues.${variabel}`
                                        ] && (
                                            <span className="text-red-500 text-xs">
                                                {
                                                    errors[
                                                        `variabelValues.${variabel}`
                                                    ]
                                                }
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                    <DropdownInput
                        id="statusTempat"
                        label="Status Tempat"
                        placeholder="Pilih Status Tempat..."
                        value={data.statusTempat}
                        onChange={(value) =>
                            handleInputChange("statusTempat", value)
                        }
                        options={statusTempat}
                        error={errors.statusTempat}
                        required={true}
                        valueKey="value"
                        labelKey="label"
                        className="md:col-span-2"
                    />
                    <div className="flex flex-col gap-1.5 text-sm md:col-span-2">
                        <label
                            htmlFor="jBangunan"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Jumlah Bangunan
                        </label>
                        <input
                            className="px-3 py-2 bg-gray-200 outline-none"
                            type="number"
                            id="jBangunan"
                            autoComplete="off"
                            placeholder="Jumlah Bangunan..."
                            value={data.jBangunan}
                            onChange={(e) =>
                                handleInputChange("jBangunan", e.target.value)
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm md:col-span-2">
                        <label
                            htmlFor="jLantai"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Jumlah Lantai
                        </label>
                        <input
                            className="px-3 py-2 bg-gray-200 outline-none"
                            type="number"
                            id="jLantai"
                            autoComplete="off"
                            placeholder="Jumlah Lantai..."
                            value={data.jLantai}
                            onChange={(e) =>
                                handleInputChange("jLantai", e.target.value)
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="latitude"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Latitude
                        </label>
                        <input
                            className="px-3 py-2 bg-gray-200 outline-none bg-transparent cursor-auto"
                            type="text"
                            id="latitude"
                            autoComplete="off"
                            placeholder="Klik pada peta untuk mengisi..."
                            value={data.latitude || ""}
                            readOnly
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="longitude"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Longitude
                        </label>
                        <input
                            className="px-3 py-2 bg-gray-200 outline-none bg-transparent cursor-auto"
                            type="text"
                            id="longitude"
                            autoComplete="off"
                            placeholder="Klik pada peta untuk mengisi..."
                            value={data.longitude || ""}
                            readOnly
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm md:col-span-2">
                        <MapPicker
                            latitude={data.latitude || ""}
                            longitude={data.longitude || ""}
                            onLocationChange={handleLocationChange}
                            height="400px"
                            resetTrigger={mapReset}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label htmlFor="fotoBangunan">
                            Upload Foto Bangunan
                        </label>
                        <input
                            className="px-3 py-2 bg-gray-200 outline-none"
                            type="file"
                            id="fotoBangunan"
                            accept="image/*"
                            onChange={(e) =>
                                handleFileChange(
                                    "fotoBangunan",
                                    e.target.files[0]
                                )
                            }
                        />
                        {errors.fotoBangunan && (
                            <span className="text-red-500 text-xs">
                                {errors.fotoBangunan}
                            </span>
                        )}
                        {data.fotoBangunan && (
                            <span className="text-green-600 text-xs">
                                File dipilih: {data.fotoBangunan.name}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label htmlFor="fotoBerkas">
                            Upload Foto Berkas Persyaratan
                        </label>
                        <input
                            className="px-3 py-2 bg-gray-200 outline-none"
                            type="file"
                            accept="image/*"
                            id="fotoBerkas"
                            onChange={(e) =>
                                handleFileChange(
                                    "fotoBerkas",
                                    e.target.files[0]
                                )
                            }
                        />
                        {errors.fotoBerkas && (
                            <span className="text-red-500 text-xs">
                                {errors.fotoBerkas}
                            </span>
                        )}
                        {data.fotoBerkas && (
                            <span className="text-green-600 text-xs">
                                File dipilih: {data.fotoBerkas.name}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-end md:col-span-2 gap-1.5 md:gap-4 text-sm">
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
                            className="order-1 md:order-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
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
