import Dialog from "@/Components/Dialog";
import DropdownInput from "@/Components/DropdownInput";
import { X } from "lucide-react";
import useAutoFocusInput from "@/hooks/useAutoFocusInput";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

const DialogForm = ({
    isOpen,
    onClose,
    kelurahan = null,
    kecamatan,
    mode = "create",
}) => {
    const isEditMode = mode === "edit" && kelurahan;
    const firstInputRef = useAutoFocusInput(isOpen, true);

    const initialData = {
        kodeKecamatan: null,
        namaKelurahan: "",
    };

    const { data, setData, errors, processing, clearErrors, post, put } =
        useForm(initialData);

    useEffect(() => {
        if (isOpen) {
            if (isEditMode) {
                setData({
                    kodeKecamatan: kelurahan.kecamatan.kodeKecamatan || "",
                    namaKelurahan: kelurahan.namaKelurahan || "",
                });
            } else {
                setData(initialData);
            }
            clearErrors();
        }
    }, [isOpen, kelurahan, isEditMode]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditMode) {
            put(
                route("super-admin.kelurahan.update", kelurahan.kodeKelurahan),
                {
                    onSuccess: () => {
                        setData(initialData);
                        onClose();
                    },
                    onError: (e) => {
                        console.error(e);
                    },
                }
            );
        } else {
            post(route("super-admin.kelurahan.store"), {
                onSuccess: () => {
                    setData(initialData);
                    onClose();
                },
                onError: (e) => {
                    console.error(e);
                },
            });
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-white w-full max-w-lg rounded h-max max-h-full  transition-all duration-300
                [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300
                ${isOpen ? "scale-100" : "scale-95"}`}
            >
                <div className="flex items-center justify-between p-5">
                    <h3 className="text-lg font-medium">Form Kelurahan</h3>
                    <button type="button" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5 px-5 pb-5">
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="namaKelurahan"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Nama Kelurahan
                        </label>
                        <input
                            autoComplete="off"
                            ref={firstInputRef}
                            id="namaKelurahan"
                            type="text"
                            placeholder="Masukkan nama kelurahan..."
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.namaKelurahan}
                            onChange={(e) =>
                                setData("namaKelurahan", e.target.value)
                            }
                        />
                        {errors.namaKelurahan && (
                            <span className="text-sm text-red-500">
                                {errors.namaKelurahan}
                            </span>
                        )}
                    </div>
                    <DropdownInput
                        id="kodeKecamatan"
                        label="Kecamatan"
                        placeholder="Pilih Kecamatan..."
                        value={data.kodeKecamatan}
                        onChange={(value) => setData("kodeKecamatan", value)}
                        options={kecamatan}
                        error={errors.kodeKecamatan}
                        valueKey="value"
                        labelKey="label"
                    />
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
