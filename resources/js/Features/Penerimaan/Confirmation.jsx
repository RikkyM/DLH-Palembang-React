import Dialog from "@/Components/Dialog";
import { useForm } from "@inertiajs/react";
import { X } from "lucide-react";
import { useEffect } from "react";

const Confirmation = ({ isOpen, onClose, setoran, route: config }) => {
  const { data, setData, processing, put } = useForm();

  useEffect(() => {
    if (isOpen) {
      setData({
        status: setoran.status ?? null,
        current_stage: setoran.current_stage,
      });
    }
  }, [isOpen, setoran]);

  console.log(setoran)

  const handleSubmit = (e, nota) => {
    e.preventDefault();

    put(
      route(`${config}.data-setoran.update`, {
        data: encodeURIComponent(nota),
      }),
      {
        preserveScroll: true,
        onSuccess: () => {
          onClose();
        },
      },
    );

    // if (config === "kasubag") {
    //   put(
    //     route(`${config}.proses-setoran`, {
    //       data: encodeURIComponent(nota),
    //     }),
    //     {
    //       preserveScroll: true,
    //       onSuccess: () => {
    //         onClose();
    //       },
    //       onError: () => {
    //         console.error("Terjadi kesalahan ketika memproses data setoran.");
    //       },
    //     },
    //   );
    // } else {
    //   put(
    //     route(`${config}.data-setoran.update`, {
    //       data: encodeURIComponent(nota),
    //     }),
    //     {
    //       preserveScroll: true,
    //       onSuccess: () => {
    //         onClose();
    //       },
    //     },
    //   );
    // }
  };

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
          {config === "kasubag"
            ? "Apakah anda yakin ingin memproses data setoran ?"
            : "Apakah Anda yakin ingin melanjutkan?"}
        </div>
        <form
          onSubmit={(e) => handleSubmit(e, setoran.nomorNota)}
          className="px-5 pb-3"
        >
          <div className="flex flex-col gap-3 text-xs md:flex-row md:justify-end md:gap-2 md:text-sm">
            {config !== "kasubag" && (
              <button
                className="order-2 rounded bg-red-500 px-3 py-2 font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50 md:order-2"
                disabled={processing}
                type="submit"
                onClick={(e) => {
                  setData("status", "Rejected");
                }}
              >
                {processing ? "Proses..." : "Tolak"}
              </button>
            )}
            <button
              className="order-1 rounded bg-green-500 px-3 py-2 font-medium text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50 md:order-2"
              disabled={processing}
              type="submit"
              onClick={(e) => {
                if (config !== "kasubag") {
                  setData("status", "Approved");
                }
              }}
            >
              {processing
                ? "Proses..."
                : config !== "kasubag"
                  ? "Setujui"
                  : "Kirim"}
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

export default Confirmation;
