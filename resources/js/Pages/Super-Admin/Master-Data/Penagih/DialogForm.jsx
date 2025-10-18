import DropdownInput from "@/Components/DropdownInput";
import Dialog from "@/Components/Dialog";
import { X } from "lucide-react";
import useAutoFocusInput from "@/hooks/useAutoFocusInput";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

const DialogForm = ({ isOpen, onClose, uptdOptions = [], penagih = null, mode = "create" }) => {
  const isEditMode = mode === "edit" && penagih;
  const firstInputRef = useAutoFocusInput(isOpen, true);

  const initialData = {
    nama: "",
    jabatan: "",
    statusPegawai: "",
    wilayah_uptd: "",
  };

  const { data, setData, errors, processing, clearErrors, post, put } =
    useForm(initialData);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setData({
          nama: penagih.nama || "",
          jabatan: penagih.jabatan || "",
          statusPegawai: penagih.statusPegawai || "",
          wilayah_uptd: penagih.wilayah_uptd || "",
        });
      } else {
        setData(initialData);
      }
      clearErrors();
    }
  }, [isOpen, penagih, isEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();

    clearErrors();

    if (isEditMode) {
      put(route("super-admin.penagih.update", penagih.id), {
        onSuccess: () => {
          setData(initialData);
          onClose();
        },
        onError: (e) => {
          console.error(e);
        },
      });
    } else {
      post(route("super-admin.penagih.store"), {
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
          <h3 className="text-lg font-medium">Form Penagih</h3>
          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 px-5 pb-5">
          <div className="flex flex-col gap-1.5 text-sm">
            <label
              htmlFor="nama"
              className="after:text-red-500 after:content-['*']"
            >
              Nama Penagih
            </label>
            <input
              autoComplete="off"
              ref={firstInputRef}
              id="nama"
              type="text"
              placeholder="Masukkan nama penagih..."
              className="rounded bg-gray-200 px-3 py-2 outline-none"
              value={data.nama}
              onChange={(e) => setData("nama", e.target.value)}
            />
            {errors.nama && (
              <span className="text-xs text-red-500">{errors.nama}</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5 text-sm">
            <label
              htmlFor="jabatan"
              className="after:text-red-500 after:content-['*']"
            >
              Jabatan
            </label>
            <input
              autoComplete="off"
              id="jabatan"
              type="text"
              placeholder="Masukkan jabatan..."
              className="rounded bg-gray-200 px-3 py-2 outline-none"
              value={data.jabatan}
              onChange={(e) => setData("jabatan", e.target.value)}
            />
            {errors.jabatan && (
              <span className="text-xs text-red-500">{errors.jabatan}</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5 text-sm">
            <label
              htmlFor="statusPegawai"
              className="after:text-red-500 after:content-['*']"
            >
              Status Pegawai
            </label>
            <input
              autoComplete="off"
              id="statusPegawai"
              type="text"
              placeholder="Masukkan status pegawai..."
              className="rounded bg-gray-200 px-3 py-2 outline-none"
              value={data.statusPegawai}
              onChange={(e) => setData("statusPegawai", e.target.value)}
            />
            {errors.statusPegawai && (
              <span className="text-xs text-red-500">
                {errors.statusPegawai}
              </span>
            )}
          </div>
          <DropdownInput
            id="wilayah_uptd"
            label="Pilih Wilayah UPTD"
            // placeholder="Silahkan Pilih Pemohon..."
            value={data.wilayah_uptd}
            onChange={(value) => setData("wilayah_uptd", value)}
            options={uptdOptions}
            error={errors.pemilikId}
            required={true}
            valueKey="value"
            labelKey="label"
            className="col-span-3"
          />
          {/* <div className="flex flex-col gap-1.5 text-sm">
            <label
              htmlFor="wilayah_uptd"
              className="after:text-red-500 after:content-['*']"
            >
              Wilayah UPTD
            </label>
            <input
              autoComplete="off"
              id="wilayah_uptd"
              type="text"
              placeholder="Masukkan wilayah uptd..."
              className="rounded bg-gray-200 px-3 py-2 outline-none"
              value={data.wilayah_uptd}
              onChange={(e) => setData("wilayah_uptd", e.target.value)}
            />
            {errors.wilayah_uptd && (
              <span className="text-xs text-red-500">
                {errors.wilayah_uptd}
              </span>
            )}
          </div> */}
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
