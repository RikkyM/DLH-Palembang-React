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
                console.log('asdad')
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
                        {errors.namaObjekRetribusi && (
                            <span className="text-red-500 text-xs">
                                {errors.namaObjekRetribusi}
                            </span>
                        )}
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
                        {errors.alamatObjekRetribusi && (
                            <span className="text-red-500 text-xs">
                                {errors.alamatObjekRetribusi}
                            </span>
                        )}
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
                            type="number"
                            id="rt"
                            autoComplete="off"
                            placeholder="RT"
                            value={data.rt}
                            onChange={(e) =>
                                handleInputChange("rt", e.target.value)
                            }
                        />
                        {errors.rt && (
                            <span className="text-red-500 text-xs">
                                {errors.rt}
                            </span>
                        )}
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
                            type="number"
                            id="rw"
                            autoComplete="off"
                            placeholder="RW"
                            value={data.rw}
                            onChange={(e) =>
                                handleInputChange("rw", e.target.value)
                            }
                        />
                        {errors.rw && (
                            <span className="text-red-500 text-xs">
                                {errors.rw}
                            </span>
                        )}
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
                    <DropdownInput
                        id="bentukUsaha"
                        label="Bentuk Badan Usaha"
                        placeholder="Pilih Bentuk Badan Usaha"
                        value={data.bentukUsaha}
                        onChange={(value) =>
                            handleInputChange("bentukUsaha", value)
                        }
                        options={bentukUsaha}
                        error={errors.bentukUsaha}
                        required={true}
                        valueKey="value"
                        labelKey="label"
                        className="col-span-2"
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
                        {errors.deskripsi && (
                            <span className="text-red-500 text-xs">
                                {errors.deskripsi}
                            </span>
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

                        let variabelArray = [];

                        if (
                            selectedSubKategori &&
                            selectedSubKategori.variabel
                        ) {
                            variabelArray = Array.isArray(
                                selectedSubKategori.variabel
                            )
                                ? selectedSubKategori.variabel
                                : JSON.parse(
                                      selectedSubKategori.variabel || "[]"
                                  );
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
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {inputFields.map((field, index) => {
                                    const isEnabled =
                                        variabelArray.includes(field);
                                    return (
                                        <div
                                            key={`variabel-${field}-${index}`}
                                            className="flex flex-col gap-1.5 text-sm"
                                        >
                                            <label
                                                htmlFor={`variabel-${field}`}
                                                className="capitalize after:content-['*'] after:text-red-500"
                                            >
                                                {field}
                                            </label>
                                            <input
                                                className={`px-3 py-2 outline-none ${
                                                    isEnabled
                                                        ? "bg-gray-200"
                                                        : "bg-gray-100 cursor-not-allowed"
                                                }`}
                                                type="number"
                                                id={`variabel-${field}`}
                                                autoComplete="off"
                                                placeholder={`Masukkan nilai ${field}...`}
                                                value={
                                                    data.variabelValues[
                                                        field
                                                    ] || ""
                                                }
                                                onChange={(e) =>
                                                    handleVariabelChange(
                                                        field,
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                disabled={!isEnabled}
                                            />
                                            {errors[
                                                `variabelValues.${field}`
                                            ] && (
                                                <span className="text-red-500 text-xs">
                                                    {
                                                        errors[
                                                            `variabelValues.${field}`
                                                        ]
                                                    }
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
                        {errors.jBangunan && (
                            <span className="text-red-500 text-xs">
                                {errors.jBangunan}
                            </span>
                        )}
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
                        {errors.jLantai && (
                            <span className="text-red-500 text-xs">
                                {errors.jLantai}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="latitude"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Latitude
                        </label>
                        <input
                            className="px-3 py-2 bg-gray-200 outline-none"
                            type="number"
                            id="latitude"
                            autoComplete="off"
                            placeholder="Latitude..."
                            value={data.latitude || ""}
                            onChange={(e) =>
                                handleInputChange("latitude", e.target.value)
                            }
                        />
                        {errors.latitude && (
                            <span className="text-red-500 text-xs">
                                {errors.latitude}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="longitude"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Longitude
                        </label>
                        <input
                            className="px-3 py-2 bg-gray-200 outline-none"
                            type="number"
                            id="longitude"
                            autoComplete="off"
                            placeholder="Longitude..."
                            value={data.longitude || ""}
                            onChange={(e) =>
                                handleInputChange("longitude", e.target.value)
                            }
                        />
                        {errors.longitude && (
                            <span className="text-red-500 text-xs">
                                {errors.longitude}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm md:col-span-2">
                        <label
                            htmlFor="linkMap"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Link Map
                        </label>
                        <input
                            className="px-3 py-2 bg-gray-200 outline-none"
                            type="url"
                            id="linkMap"
                            autoComplete="off"
                            placeholder="Link Map..."
                            value={data.linkMap}
                            onChange={(e) =>
                                handleInputChange("linkMap", e.target.value)
                            }
                        />
                        {errors.linkMap && (
                            <span className="text-red-500 text-xs">
                                {errors.linkMap}
                            </span>
                        )}
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
                            required
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
                            required
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
