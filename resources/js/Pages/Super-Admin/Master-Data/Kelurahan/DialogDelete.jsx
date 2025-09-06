import Dialog from "@/Components/Dialog";
import { useForm } from "@inertiajs/react";
import { AlertTriangle, X } from "lucide-react";

const DialogDelete = ({ isOpen, onClose, kelurahan }) => {
  const { processing, delete: destroy } = useForm();

  const handleDelete = (e) => {
    e.preventDefault();

    if (!kelurahan?.kodeKelurahan) return;

    destroy(route("super-admin.kelurahan.destroy", kelurahan.kodeKelurahan), {
      onSuccess: () => {
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
        className={`h-max max-h-full w-full max-w-lg overflow-auto rounded bg-white transition-all duration-300 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-1 ${isOpen ? "scale-100" : "scale-95"}`}
      >
        <div className="flex items-center justify-end px-5 pt-5">
          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="px-5 pb-5">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>

          <div className="mb-6 text-center">
            <h4 className="mb-2 text-lg font-medium text-gray-900">
              Apakah Anda yakin?
            </h4>
            <p className="mb-4 text-sm text-gray-600">
              Anda akan menghapus Kelurahan berikut ini:
            </p>
            <div className="rounded border border-red-300 bg-red-50 p-4 text-left text-sm">
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-700">
                    Nama Kelurahan:{" "}
                  </span>
                  <span className="text-gray-900">
                    {kelurahan?.namaKelurahan}
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-red-600 sm:text-sm">
              <strong>Perhatian:</strong> Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm md:flex-row md:gap-2">
            <button
              type="button"
              onClick={onClose}
              className="order-2 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none transition-colors hover:bg-gray-50 md:order-1"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={processing}
              className="order-1 flex-1 rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium text-white outline-none transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 md:order-2"
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
