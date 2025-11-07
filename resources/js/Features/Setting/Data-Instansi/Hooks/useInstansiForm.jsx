import { useToast } from "@/Context/ToastContext";
import { useForm } from "@inertiajs/react";

export function useInstansiForm(instansi) {
  const { showToast } = useToast();

  const initialData = {
    namaInstansi: instansi?.namaInstansi ?? "",
    alamatInstansi: instansi?.alamatInstansi ?? "",
    noTelepon: instansi?.noTelepon ?? "",
    email: instansi?.email ?? "",
    website: instansi?.website ?? "",
    instagram: instansi?.instagram ?? "",
    tiktok: instansi?.tiktok ?? "",
  };

  const { data, setData, processing, errors, clearErrors, put } =
    useForm(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();

    put(route("super-admin.data-instansi-update"), {
      preserveScroll: true,
      preserveState: false,
      onSuccess: () => showToast("Berhasil update data instansi", "success"),
      onError: () => showToast("Gagal update data instansi", "error"),
    });
  };

  return { data, setData, processing, errors, clearErrors, handleSubmit };
}
