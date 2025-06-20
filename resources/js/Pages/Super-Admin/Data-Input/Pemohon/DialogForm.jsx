import Dialog from "@/Components/Dialog";
import { X } from "lucide-react";
import useAutoFocusInput from "@/hooks/useAutoFocusInput";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import DropdownInput from "@/Components/DropdownInput";

const DialogForm = ({
    isOpen,
    onClose,
    pemohon = null,
    mode = "create",
    kecamatanOptions,
    kelurahanOptions,
}) => {
    const isEditMode = mode === "edit" && pemohon;
    const firstInputRef = useAutoFocusInput(isOpen, true);

    const initialData = {
        nik: "",
        namaPemilik: "",
        alamat: "",
        tempatLahir: "",
        tanggalLahir: "",
        kodeKecamatan: "",
        kodeKelurahan: "",
        noHP: "",
        email: "",
        jabatan: "",
    };

    const { data, setData, errors, processing, clearErrors, post, put } =
        useForm(initialData);

    useEffect(() => {
        if (isOpen) {
            if (isEditMode) {
                setData({
                    nik: pemohon.nik || "",
                    namaPemilik: pemohon.namaPemilik || "",
                    alamat: pemohon.alamat || "",
                    tempatLahir: pemohon.tempatLahir || "",
                    tanggalLahir: pemohon.tanggalLahir || "",
                    kodeKecamatan: pemohon.kodeKecamatan || "",
                    kodeKelurahan: pemohon.kodeKelurahan || "",
                    noHP: pemohon.noHP || "",
                    email: pemohon.email || "",
                    jabatan: pemohon.jabatan || "",
                });
            } else {
                setData(initialData);
            }
            clearErrors();
        }
    }, [isOpen, pemohon, isEditMode]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditMode) {
            put(route("super-admin.pemohon.update", pemohon.id), {
                onSuccess: () => {
                    setData(initialData);
                    onClose();
                },
                onError: (e) => {
                    console.error(e);
                },
            });
        } else {
            post(route("super-admin.pemohon.store"), {
                onSuccess: () => {
                    setData(initialData);
                    onClose();
                },
                onError: (e) => {
                    console.error(e);
                    console.log(e);
                },
            });
        }
    };

    useEffect(() => {
        if (!isEditMode) {
            setData("kodeKelurahan", "");
        }
    }, [data.kodeKecamatan]);

    const filteredKelurahanOptions = kelurahanOptions[data.kodeKecamatan] || [];

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-white w-full max-w-lg rounded h-max max-h-full overflow-auto transition-all duration-300
                [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300
                ${isOpen ? "scale-100" : "scale-95"}`}
            >
                <div className="flex items-center justify-between p-5">
                    <h3 className="text-lg font-medium">Form Pemohon</h3>
                    <button type="button" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5 px-5 pb-5">
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="nik"
                            className="after:content-['*'] after:text-red-500"
                        >
                            NIK
                        </label>
                        <input
                            autoComplete="off"
                            ref={firstInputRef}
                            id="nik"
                            type="number"
                            placeholder="Masukkan NIK..."
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.nik}
                            onChange={(e) => setData("nik", e.target.value)}
                        />
                        {errors.nik && (
                            <span className="text-sm text-red-500">
                                {errors.nik}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="namaPemohon"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Nama Pemilk
                        </label>
                        <input
                            autoComplete="off"
                            id="namaPemohon"
                            type="text"
                            placeholder="Masukkan nama pemohon..."
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.namaPemilik}
                            onChange={(e) =>
                                setData("namaPemilik", e.target.value)
                            }
                        />
                        {errors.namaPemilik && (
                            <span className="text-sm text-red-500">
                                {errors.namaPemilik}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="alamat"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Alamat
                        </label>
                        <input
                            autoComplete="off"
                            id="alamat"
                            type="text"
                            placeholder="Masukkan nama pemohon..."
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.alamat}
                            onChange={(e) => setData("alamat", e.target.value)}
                        />
                        {errors.alamat && (
                            <span className="text-sm text-red-500">
                                {errors.alamat}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="tempatLahir"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Tempat Lahir
                        </label>
                        <input
                            autoComplete="off"
                            id="tempatLahir"
                            type="text"
                            placeholder="Masukkan tempat lahir..."
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.tempatLahir}
                            onChange={(e) =>
                                setData("tempatLahir", e.target.value)
                            }
                        />
                        {errors.tempatLahir && (
                            <span className="text-sm text-red-500">
                                {errors.tempatLahir}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="tanggalLahir"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Tanggal Lahir
                        </label>
                        <input
                            autoComplete="off"
                            id="tanggalLahir"
                            type="date"
                            placeholder="Masukkan tempat lahir..."
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.tanggalLahir}
                            onChange={(e) =>
                                setData("tanggalLahir", e.target.value)
                            }
                        />
                        {errors.tanggalLahir && (
                            <span className="text-sm text-red-500">
                                {errors.tanggalLahir}
                            </span>
                        )}
                    </div>
                    <DropdownInput
                        id="kecamatan"
                        label="Kecamatan"
                        placeholder="Pilih kecamatan..."
                        value={data.kodeKecamatan}
                        onChange={(value) => setData("kodeKecamatan", value)}
                        options={kecamatanOptions}
                        error={errors.kodeKecamatan}
                        required={true}
                        valueKey="value"
                        labelKey="label"
                    />
                    <DropdownInput
                        id="kelurahan"
                        label="Kelurahan"
                        placeholder="Pilih kelurahan..."
                        value={data.kodeKelurahan}
                        onChange={(value) => setData("kodeKelurahan", value)}
                        options={filteredKelurahanOptions}
                        error={errors.kodeKelurahan}
                        required={true}
                        valueKey="value"
                        labelKey="label"
                        disabled={!data.kodeKecamatan}
                    />
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="noHP"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Nomor HP
                        </label>
                        <input
                            autoComplete="off"
                            id="noHP"
                            type="number"
                            placeholder="Masukkan nomor hp..."
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.noHP}
                            onChange={(e) => setData("noHP", e.target.value)}
                        />
                        {errors.noHP && (
                            <span className="text-sm text-red-500">
                                {errors.noHP}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="email"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Email
                        </label>
                        <input
                            autoComplete="off"
                            id="email"
                            type="email"
                            placeholder="Masukkan email..."
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        {errors.email && (
                            <span className="text-sm text-red-500">
                                {errors.email}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="jabatan"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Jabatan
                        </label>
                        <input
                            autoComplete="off"
                            id="jabatan"
                            type="text"
                            placeholder="Masukkan jabatan..."
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.jabatan}
                            onChange={(e) => setData("jabatan", e.target.value)}
                        />
                        {errors.jabatan && (
                            <span className="text-sm text-red-500">
                                {errors.jabatan}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-end gap-3 md:gap-2 text-sm">
                        <button
                            className="px-3 py-2 font-medium order-1 md:order-2 rounded text-white bg-teal-400 hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={processing}
                            type="submit"
                        >
                            {processing ? "Menyimpan..." : "Simpan Data"}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-3 py-2 font-medium order-2 md:order-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                            type="button"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </Dialog>
    );
};

export default DialogForm;
