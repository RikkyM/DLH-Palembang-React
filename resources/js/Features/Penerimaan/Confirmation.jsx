import Dialog from "@/Components/Dialog";
import { useForm } from "@inertiajs/react";
import { X } from "lucide-react";
import { useEffect } from "react";

const Confirmation = ({ isOpen, onClose, setoran, route: config }) => {
  const { data, setData, processing, put } = useForm();

  console.log(data)

  useEffect(() => {
    if (isOpen) {
      setData({
        status: setoran.status,
        current_stage: setoran.current_stage
      })
    }
  }, [isOpen, setoran])
  
  const handleSend = (e, nota) => {
    e.preventDefault();
    console.log(setoran.status, nota);
    
    put(
      route(`${config}.proses-setoran`, {
        data: encodeURIComponent(nota),
      }),
      {
        preserveScroll: true,
        onSuccess: () => {
          onClose();
        },
        onError: () => {
          console.error("Terjadi kesalahan ketika memproses data setoran.");
        },
      },
    );
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`h-max max-h-full w-full max-w-lg overflow-auto rounded bg-white transition-all duration-300 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-1 ${isOpen ? "scale-100" : "scale-95"}`}
      >
        <div className="flex items-center justify-between p-5">
          <h3 className="text-lg font-medium">Konfirmasi Data Setoran</h3>
          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="px-5 pb-5 text-sm">
          Apakah anda yakin ingin memproses data setoran ?
        </div>
        <div className="px-5 pb-3">
          <div className="flex flex-col gap-3 text-xs md:text-sm md:flex-row md:justify-end md:gap-2">
            <button
              className="order-1 rounded bg-green-500 px-3 py-2 font-medium text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50 md:order-2"
              disabled={processing}
              onClick={(e) => {
                handleSend(e, setoran.nomorNota);
              }}
            >
              {processing ? "Proses..." : "Kirim"}
            </button>
            <button
              onClick={onClose}
              className="order-2 rounded-md border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 hover:bg-gray-50 md:order-1"
              type="button"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default Confirmation;
