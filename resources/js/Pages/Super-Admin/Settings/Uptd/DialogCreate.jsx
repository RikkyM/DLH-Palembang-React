import { useEffect } from "react";
import Dialog from "@/Components/Dialog";
import { useForm } from "@inertiajs/react";
import { X } from "lucide-react";
import useAutoFocusInput from "@/hooks/useAutoFocusInput";

const DialogCreate = ({ isOpen, onClose }) => {
  const firstInputRef = useAutoFocusInput(isOpen);

  const initialData = {
    namaUptd: "",
    alamat: "",
  };

  const { data, setData, errors, processing, clearErrors, post } =
    useForm(initialData);

  useEffect(() => {
    if (isOpen) {
      setData(initialData);
      clearErrors();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route("super-admin.uptd.store"), {
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
        className={`h-max max-h-full w-full max-w-lg overflow-auto rounded bg-white transition-all duration-300 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-1 ${isOpen ? "scale-100" : "scale-95"}`}
      >
        <div className="flex items-center justify-between p-5">
          <h3 className="text-lg font-medium">Form UPTD</h3>
          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 px-5 pb-5">
          <div className="flex flex-col gap-1.5 text-sm">
            <label htmlFor="nama">Nama UPTD</label>
            <input
              autoComplete="off"
              ref={firstInputRef}
              id="nama"
              type="text"
              placeholder="Masukkan nama UPTD..."
              className="rounded bg-neutral-300 px-3 py-2 outline-none"
              value={data.namaUptd}
              onChange={(e) => setData("namaUptd", e.target.value)}
            />
            {errors.namaUptd && (
              <span className="text-sm text-red-500">{errors.namaUptd}</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5 text-sm">
            <label htmlFor="alamat">Alamat</label>
            <input
              autoComplete="off"
              id="alamat"
              type="text"
              placeholder="Masukkan alamat UPTD..."
              className="rounded bg-neutral-300 px-3 py-2 outline-none"
              value={data.alamat}
              onChange={(e) => setData("alamat", e.target.value)}
            />
            {errors.alamat && (
              <span className="text-sm text-red-500">{errors.alamat}</span>
            )}
          </div>
          <div className="flex flex-col gap-3 text-sm md:flex-row md:justify-end md:gap-2">
            <button
              className="order-1 rounded bg-teal-400 px-3 py-2 font-medium text-white transition-colors hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50 md:order-2"
              disabled={processing}
              type="submit"
            >
              {processing ? "Menyimpan..." : "Simpan Data"}
            </button>
            <button
              onClick={onClose}
              className="order-2 rounded-md border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 hover:bg-gray-50 md:order-1"
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

export default DialogCreate;
