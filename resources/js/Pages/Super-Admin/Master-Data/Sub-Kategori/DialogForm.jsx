import Dialog from "@/Components/Dialog";
import DropdownInput from "@/Components/DropdownInput";
import { X } from "lucide-react";
import useAutoFocusInput from "@/hooks/useAutoFocusInput";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

const DialogForm = ({
  isOpen,
  onClose,
  kategori,
  subkategori = null,
  mode = "create",
}) => {
  const isEditMode = mode === "edit" && subkategori;
  const firstInputRef = useAutoFocusInput(isOpen, true);

  const initialData = {
    kodeSubKategori: "",
    kodeKategori: null,
    namaSubKategori: "",
    tarif: "",
    tarif2: "",
    rumus: "",
    variabel: [],
    satuan: "",
  };

  const extractVariables = (rumus) => {
    const regex = /[a-zA-Z_]\w*/g;
    const reserved = ["tarif"];
    return [
      ...new Set(
        rumus.match(regex)?.filter((v) => !reserved.includes(v)) || [],
      ),
    ];
  };

  const isValidRumus = (rumus) => {
    if (!rumus || typeof rumus !== "string") return true;
    if (rumus.trim() === "") return true;
    const pattern = /^([a-zA-Z_][\w]*\s*([\+\-\*\/]\s*[a-zA-Z_][\w]*)*)$/;
    return pattern.test(rumus.trim());
  };

  const { data, setData, errors, processing, clearErrors, post, put } =
    useForm(initialData);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        // Handle rumus - check if it's JSON string or direct value
        let rumusValue = "";
        let variabelValue = [];

        if (subkategori.rumus) {
          rumusValue = subkategori.rumus;
          variabelValue = extractVariables(subkategori.rumus);
        } else if (subkategori.perhitungan) {
          // Fallback for old format
          const perhitunganData = JSON.parse(subkategori.perhitungan);
          rumusValue = perhitunganData.rumus || "";
          variabelValue = perhitunganData.variabel || [];
        }

        if (subkategori.variabel) {
          try {
            variabelValue = JSON.parse(subkategori.variabel);
          } catch (e) {
            variabelValue = extractVariables(rumusValue);
          }
        }

        console.log("Rumus:", rumusValue);
        console.log("Variabel:", variabelValue);

        setData({
          kodeKategori: subkategori.kodeKategori || null,
          namaSubKategori: subkategori.namaSubKategori || "",
          tarif: subkategori.tarif || "",
          tarif2: subkategori.tarif2 || "",
          rumus: rumusValue,
          variabel: variabelValue,
          satuan: subkategori.satuan || "",
        });
      } else {
        setData(initialData);
      }
      clearErrors();
    }
  }, [isOpen, subkategori, isEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidRumus(data.rumus)) {
      alert(
        "Format rumus tidak valid. Gunakan format seperti: var1 * var2 + var3",
      );
      return;
    }

    const requestData = {
      ...data,
      // Send as separate fields
      rumus: data.rumus.trim() || null,
      variabel: data.variabel.length > 0 ? data.variabel : null,
    };

    if (isEditMode) {
      put(
        route("super-admin.sub-kategori.update", subkategori.kodeSubKategori),
        {
          data: requestData,
          onSuccess: () => {
            setData(initialData);
            onClose();
          },
          onError: (e) => {
            console.error(e);
          },
        },
      );
    } else {
      post(route("super-admin.sub-kategori.store"), {
        data: requestData,
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
          <h3 className="text-lg font-medium">Form Sub Kategori</h3>
          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 px-5 pb-5">
          <div className="flex flex-col gap-1.5 text-sm">
            <label
              htmlFor="namaSubKategori"
              className="after:text-red-500 after:content-['*']"
            >
              Nama Sub Kategori
            </label>
            <input
              autoComplete="off"
              ref={firstInputRef}
              id="namaSubKategori"
              type="text"
              placeholder="Masukkan nama sub kategori..."
              className="rounded bg-gray-200 px-3 py-2 outline-none"
              value={data.namaSubKategori ?? ""}
              onChange={(e) => setData("namaSubKategori", e.target.value)}
            />
            {errors.namaSubKategori && (
              <span className="text-sm text-red-500">
                {errors.namaSubKategori}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5 text-sm">
            <label
              htmlFor="satuan"
              className="after:text-red-500 after:content-['*']"
            >
              Satuan
            </label>
            <input
              autoComplete="off"
              id="satuan"
              type="text"
              placeholder="Contoh: bulan"
              className="rounded bg-gray-200 px-3 py-2 outline-none"
              value={data.satuan}
              onChange={(e) => setData("satuan", e.target.value)}
            />
            {errors.satuan && (
              <span className="text-sm text-red-500">{errors.satuan}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5 text-sm">
            <label htmlFor="rumus">
              Rumus <span className="text-gray-500">(opsional)</span>
            </label>
            <input
              autoComplete="off"
              id="rumus"
              type="text"
              placeholder="tarif * luasUsaha"
              className={`rounded bg-gray-200 px-3 py-2 outline-none ${
                errors.rumus ? "border border-red-500" : ""
              }`}
              value={data.rumus ?? ""}
              onChange={(e) => {
                const rumus = e.target.value;
                const variabel = extractVariables(rumus);
                setData({
                  ...data,
                  rumus,
                  variabel,
                });
              }}
            />
            {errors.rumus && (
              <span className="text-sm text-red-500">{errors.rumus}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5 text-sm">
            <label
              htmlFor="tarif"
              className="after:text-red-500 after:content-['*']"
            >
              Tarif 1
            </label>
            <input
              autoComplete="off"
              id="tarif"
              type="text"
              placeholder="Contoh: 2500"
              className="rounded bg-gray-200 px-3 py-2 outline-none"
              value={data.tarif ?? ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value >= 0) {
                  setData("tarif", value);
                }
              }}
            />
            {errors.tarif && (
              <span className="text-sm text-red-500">{errors.tarif}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5 text-sm">
            <label htmlFor="tarif2">Tarif 2</label>
            <input
              autoComplete="off"
              id="tarif2"
              type="text"
              placeholder="Contoh: 2500"
              className="rounded bg-gray-200 px-3 py-2 outline-none"
              value={data.tarif2 ?? ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value >= 0) {
                  setData("tarif2", value);
                }
              }}
            />
            {errors.tarif2 && (
              <span className="text-sm text-red-500">{errors.tarif2}</span>
            )}
          </div>

          <DropdownInput
            id="kodeKategori"
            label="Kategori"
            placeholder="Pilih Kategori..."
            value={data.kodeKategori}
            onChange={(value) => setData("kodeKategori", value)}
            options={kategori}
            error={errors.kodeKategori}
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
