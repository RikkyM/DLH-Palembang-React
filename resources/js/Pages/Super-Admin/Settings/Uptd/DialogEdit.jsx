import { useEffect } from "react";
import Dialog from "@/Components/Dialog";
import { useForm } from "@inertiajs/react";
import { X } from "lucide-react";
import useAutoFocusInput from "@/hooks/useAutoFocusInput";

const DialogEdit = ({ isOpen, onClose, uptd }) => {
    const firstInputRef = useAutoFocusInput(isOpen, true);

    const initialData = {
        namaUptd: "",
        alamat: "",
    };

    const { data, setData, errors, processing, clearErrors, put } =
        useForm(initialData);

    useEffect(() => {
        if (isOpen && uptd) {
            setData({
                namaUptd: uptd.namaUptd || "",
                alamat: uptd.alamat || "",
            });
        } else {
            setData(initialData);
            clearErrors();
        }
    }, [isOpen, uptd]);

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route("super-admin.uptd.update", uptd.id), {
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
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-white w-full max-w-lg rounded h-max max-h-full overflow-auto transition-all duration-300
                [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300
                ${isOpen ? "scale-100" : "scale-95"}`}
            >
                <div className="flex items-center justify-between p-5">
                    <h3 className="text-lg font-medium">Edit UPTD</h3>
                    <button type="button" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 px-5 pb-5"
                    data-modal
                >
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label htmlFor="nama">Nama UPTD</label>
                        <input
                            ref={firstInputRef}
                            id="nama"
                            type="text"
                            placeholder="Masukkan nama UPTD..."
                            className="px-3 py-2 bg-neutral-300 outline-none"
                            value={data.namaUptd}
                            onChange={(e) =>
                                setData("namaUptd", e.target.value)
                            }
                        />
                        {errors.namaUptd && (
                            <span className="text-sm text-red-500">
                                {errors.namaUptd}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label htmlFor="alamat">Alamat</label>
                        <input
                            id="alamat"
                            type="text"
                            placeholder="Masukkan nama UPTD..."
                            className="px-3 py-2 bg-neutral-300 outline-none"
                            value={data.alamat}
                            onChange={(e) => setData("alamat", e.target.value)}
                        />
                        {errors.alamat && (
                            <span className="text-sm text-red-500">
                                {errors.alamat}
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

export default DialogEdit;
