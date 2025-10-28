import { useForm } from "@inertiajs/react";
import { useToast } from "@/Context/ToastContext";

export function useTandaTanganForm(sigData) {
  const { showToast } = useToast();
  const initialData = {
    nama: sigData.nama ?? "",
    nip: sigData.nip ?? "",
    pangkat: sigData.pangkat ?? "",
    golongan: sigData.golongan ?? "",
    jabatan1: sigData.jabatan1 ?? "",
    jabatan2: sigData.jabatan2 ?? "",
    kota: sigData.kota ?? "",
  };

  const { data, setData, processing, errors, clearErrors, put } =
    useForm(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();

    put(route("super-admin.penanda-tangan-update"), {
      preserveScroll: true,
      onSuccess: () => showToast("Berhasil menyimpan data", "success"),
      onError: () => showToast("Gagal menyimpan data", "error"),
    });
  };

  return { data, setData, processing, errors, clearErrors, handleSubmit };
}
