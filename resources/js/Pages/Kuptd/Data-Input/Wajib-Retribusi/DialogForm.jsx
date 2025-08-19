import Dialog from "@/Components/Dialog";
import { X } from "lucide-react";
import useAutoFocusInput from "@/hooks/useAutoFocusInput";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

const DialogForm = ({ isOpen, onClose, retribusi = null }) => {
  const firstInputRef = useAutoFocusInput(isOpen, true);

  const { data, setData, errors, processing, clearErrors, put } = useForm({
    keterangan: "",
    status: "",
  });

  useEffect(() => {
    if (isOpen) {
        setData({
            keterangan: "",
            status: ""
        })
    }
  }, [isOpen, retribusi])

//   const handleSubmit = (e, status) => {
//     e.preventDefault();

//     console.log({ keterangan: data.keterangan, status }); // ✅ Nilai benar

//     post(
//       route("kuptd.wajib-retribusi-proses", retribusi.id),
//       // {
//       //   keterangan: data.keterangan,
//       //   status: status,
//       // },
//       {
//         data: {
//             ...data
//         },
//         forceFormData: true,
//         onSuccess: () => {
//           setData({ keterangan: "", status: "" });
//           onClose();
//         },
//         onError: (e) => {
//           console.error(e);
//         },
//       },
//     );
//   };

    const handleSubmit = (e) => {
      e.preventDefault();

      put(
        route("kuptd.wajib-retribusi.update", retribusi.id),
        {
          ...data,
          status: status,
        },
        {
          forceFormData: true,
          onSuccess: () => {
            setData({ keterangan: "", status: "" });
            onClose();
          },
          onError: (e) => {
            console.error(e);
          },
        },
      );
    };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`h-max max-h-full w-full max-w-lg overflow-auto rounded bg-white transition-all duration-300 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-1 ${isOpen ? "scale-100" : "scale-95"}`}
      >
        <div className="flex items-center justify-between p-5">
          <h3 className="text-lg font-medium">Wajib Retribusi</h3>
          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="grid grid-cols-2 px-5 pb-5">
          <div>Penanggung Jawab</div>
          <div>: {retribusi?.pemilik?.namaPemilik}</div>
          <div>Nama Objek Retribusi</div>
          <div>: {retribusi?.namaObjekRetribusi}</div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 px-5 pb-5">
          <div className="flex flex-col gap-1.5 text-sm">
            <label htmlFor="keterangan">Keterangan</label>
            <input
              autoComplete="off"
              ref={firstInputRef}
              id="keterangan"
              type="text"
              placeholder="Masukkan nama kecamatan..."
              className="rounded bg-gray-200 px-3 py-2 outline-none"
              value={data.keterangan}
              onChange={(e) => setData("keterangan", e.target.value)}
            />
            {errors.keterangan && (
              <span className="text-sm text-red-500">{errors.keterangan}</span>
            )}
          </div>
          <div className="flex flex-col gap-3 text-sm md:flex-row md:justify-end md:gap-2">
            <button
              className="order-1 rounded bg-red-500 px-3 py-2 font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50 md:order-2"
              disabled={processing}
              type="submit"
              onClick={(e) => setData("status", "Rejected")}
            >
              {processing ? "Proses..." : "Tolak"}
            </button>
            <button
              className="order-1 rounded bg-green-500 px-3 py-2 font-medium text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50 md:order-2"
              disabled={processing}
              type="submit"
              onClick={(e) => setData("status", "Approved")}
            >
              {processing ? "Proses..." : "Terima"}
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
