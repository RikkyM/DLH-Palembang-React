import Dialog from "@/Components/Dialog";
import { X } from "lucide-react";
import useAutoFocusInput from "@/hooks/useAutoFocusInput";
import { useForm } from "@inertiajs/react";
import { useEffect, useMemo } from "react";
import DropdownInput from "@/Components/DropdownInput";

const DialogForm = ({
  isOpen,
  onClose,
  pemohon = null,
  mode = "create",
  kecamatanOptions = [],
  kelurahanOptions = [],
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
      if (isEditMode && pemohon?.id !== data.id) {
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
      } else if (!isEditMode) {
        setData(initialData);
      } else {
        setData(initialData);
      }
      clearErrors();
    }
  }, [isOpen, pemohon?.id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    clearErrors();

    if (isEditMode) {
      put(route("pendaftar.pemohon.update", pemohon.id), {
        onSuccess: () => {
          setData(initialData);
          onClose();
        },
        onError: (e) => {
          console.error(e);
        },
      });
    } else {
      post(route("pendaftar.pemohon.store"), {
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
        className={`h-max max-h-full w-full max-w-lg overflow-auto rounded bg-white transition-all duration-300 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-1 ${isOpen ? "scale-100" : "scale-95"}`}
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
              className="after:text-red-500 after:content-['*']"
            >
              NIK
            </label>
            <input
              autoComplete="off"
              ref={firstInputRef}
              id="nik"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Masukkan NIK..."
              className={`rounded bg-gray-200 px-3 py-2 outline-none ${errors.nik && "border border-red-500"}`}
              value={data.nik}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 16) {
                  setData("nik", value);
                }
              }}
            />
            {errors.nik && (
              <span className="text-xs text-red-500">{errors.nik}</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5 text-sm">
            <label
              htmlFor="namaPemohon"
              className="after:text-red-500 after:content-['*']"
            >
              Nama Pemilk
            </label>
            <input
              autoComplete="off"
              id="namaPemohon"
              type="text"
              placeholder="Masukkan nama pemohon..."
              className={`rounded bg-gray-200 px-3 py-2 outline-none ${errors.namaPemilik && "border border-red-500"}`}
              value={data.namaPemilik}
              onChange={(e) => setData("namaPemilik", e.target.value)}
            />
            {errors.namaPemilik && (
              <span className="text-xs text-red-500">{errors.namaPemilik}</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5 text-sm">
            <label
              htmlFor="alamat"
              className="after:text-red-500 after:content-['*']"
            >
              Alamat
            </label>
            <input
              autoComplete="off"
              id="alamat"
              type="text"
              placeholder="Masukkan nama pemohon..."
              className={`rounded bg-gray-200 px-3 py-2 outline-none ${errors.alamat && "border border-red-500"}`}
              value={data.alamat}
              onChange={(e) => setData("alamat", e.target.value)}
            />
            {errors.alamat && (
              <span className="text-xs text-red-500">{errors.alamat}</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5 text-sm">
            <label
              htmlFor="tempatLahir"
              className="after:text-red-500 after:content-['*']"
            >
              Tempat Lahir
            </label>
            <input
              autoComplete="off"
              id="tempatLahir"
              type="text"
              placeholder="Masukkan tempat lahir..."
              className={`rounded bg-gray-200 px-3 py-2 outline-none ${errors.tempatLahir && "border border-red-500"}`}
              value={data.tempatLahir}
              onChange={(e) => setData("tempatLahir", e.target.value)}
            />
            {errors.tempatLahir && (
              <span className="text-xs text-red-500">{errors.tempatLahir}</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5 text-sm">
            <label
              htmlFor="tanggalLahir"
              className="after:text-red-500 after:content-['*']"
            >
              Tanggal Lahir
            </label>
            <input
              id="tanggalLahir"
              type="date"
              className={`w-full appearance-none rounded bg-gray-200 px-3 py-2 outline-none ${errors.tanggalLahir && "border border-red-500"}`}
              value={data.tanggalLahir}
              onChange={(e) => setData("tanggalLahir", e.target.value)}
            />
            {errors.tanggalLahir && (
              <span className="text-xs text-red-500">
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
              className="after:text-red-500 after:content-['*']"
            >
              Nomor HP
            </label>
            <input
              autoComplete="off"
              id="noHP"
              type="text"
              placeholder="Masukkan nomor hp..."
              className={`rounded bg-gray-200 px-3 py-2 outline-none ${errors.noHP && "border border-red-500"}`}
              value={data.noHP}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 15) {
                  setData("noHP", value);
                }
              }}
            />
            {errors.noHP && (
              <span className="text-xs text-red-500">{errors.noHP}</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5 text-sm">
            <label htmlFor="email">Email</label>
            <input
              autoComplete="off"
              id="email"
              type="email"
              placeholder="Masukkan email..."
              className={`rounded bg-gray-200 px-3 py-2 outline-none ${errors.email && "border border-red-500"}`}
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
            />
            {errors.email && (
              <span className="text-xs text-red-500">{errors.email}</span>
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
              className={`rounded bg-gray-200 px-3 py-2 outline-none ${errors.jabatan && "border border-red-500"}`}
              value={data.jabatan}
              onChange={(e) => setData("jabatan", e.target.value)}
            />
            {errors.jabatan && (
              <span className="text-xs text-red-500">{errors.jabatan}</span>
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

export default DialogForm;
