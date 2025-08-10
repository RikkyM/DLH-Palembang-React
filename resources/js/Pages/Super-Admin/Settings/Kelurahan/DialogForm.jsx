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
      put(route("super-admin.kelurahan.update", kelurahan.kodeKelurahan), {
        onSuccess: () => {
          setData(initialData);
          onClose();
        },
        onError: (e) => {
          console.error(e);
        },
      });
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
        className={`h-max max-h-full w-full max-w-lg rounded bg-white transition-all duration-300 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-1 ${isOpen ? "scale-100" : "scale-95"}`}
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
              className="after:text-red-500 after:content-['*']"
            >
              Nama Kelurahan
            </label>
            <input
              autoComplete="off"
              ref={firstInputRef}
              id="namaKelurahan"
              type="text"
              placeholder="Masukkan nama kelurahan..."
              className="rounded bg-gray-200 px-3 py-2 outline-none"
              value={data.namaKelurahan}
              onChange={(e) => setData("namaKelurahan", e.target.value)}
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

export default DialogForm;
