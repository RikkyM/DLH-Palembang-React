import Dialog from "@/Components/Dialog";
import { useForm } from "@inertiajs/react";
import { AlertTriangle, X } from "lucide-react";

const DialogDelete = ({ isOpen, onClose, kategori }) => {
    const { processing, delete: destroy } = useForm();

    const handleDelete = (e) => {
        e.preventDefault();

        if (!kategori?.kodeKategori) return;

        destroy(
            route("super-admin.kategori.destroy", kategori.kodeKategori),
            {
                onSuccess: () => {
                    onClose();
                },
                onError: (e) => {
                    console.error(e);
                },
            }
        );
    };
    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-white w-full max-w-lg rounded h-max max-h-full overflow-auto transition-all duration-300
                [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300
                ${isOpen ? "scale-100" : "scale-95"}`}
            >
                <div className="flex items-center justify-end px-5 pt-5">
                    <button type="button" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="px-5 pb-5">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>

                    <div className="text-center mb-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                            Apakah Anda yakin?
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                            Anda akan menghapus Kategori berikut ini:
                        </p>
                        <div className="bg-red-50 border border-red-300 rounded p-4 text-left text-sm">
                            <div className="space-y-2">
                                <div>
                                    <span className="font-medium text-gray-700">
                                        Nama Kategori:{" "}
                                    </span>
                                    <span className="text-gray-900">
                                        {kategori?.namaKategori}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs sm:text-sm text-red-600 mt-4">
                            <strong>Perhatian:</strong> Tindakan ini tidak dapat
                            dibatalkan.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 md:gap-2 text-sm">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 order-2 md:order-1 outline-none px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={processing}
                            className="flex-1 order-1 md:order-2 outline-none px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {processing ? "Menghapus..." : "Ya, Hapus"}
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default DialogDelete;
