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
        rumus: "",
        variabel: [],
        satuan: "",
    };

    const extractVariables = (rumus) => {
        const regex = /[a-zA-Z_]\w*/g;
        const reserved = ["tarif"];
        return [
            ...new Set(
                rumus.match(regex)?.filter((v) => !reserved.includes(v)) || []
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
                "Format rumus tidak valid. Gunakan format seperti: var1 * var2 + var3"
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
                route(
                    "super-admin.sub-kategori.update",
                    subkategori.kodeSubKategori
                ),
                {
                    data: requestData,
                    onSuccess: () => {
                        setData(initialData);
                        onClose();
                    },
                    onError: (e) => {
                        console.error(e);
                    },
                }
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
                className={`bg-white w-full max-w-lg rounded h-max max-h-full  transition-all duration-300
                [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300
                ${isOpen ? "scale-100" : "scale-95"}`}
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
                            className="after:content-['*'] after:text-red-500"
                        >
                            Nama Sub Kategori
                        </label>
                        <input
                            autoComplete="off"
                            ref={firstInputRef}
                            id="namaSubKategori"
                            type="text"
                            placeholder="Masukkan nama sub kategori..."
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.namaSubKategori ?? ""}
                            onChange={(e) =>
                                setData("namaSubKategori", e.target.value)
                            }
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
                            className="after:content-['*'] after:text-red-500"
                        >
                            Satuan
                        </label>
                        <input
                            autoComplete="off"
                            id="satuan"
                            type="text"
                            placeholder="Contoh: bulan"
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.satuan}
                            onChange={(e) => setData("satuan", e.target.value)}
                        />
                        {errors.satuan && (
                            <span className="text-sm text-red-500">
                                {errors.satuan}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5 text-sm">
                        <label htmlFor="rumus">
                            Rumus{" "}
                            <span className="text-gray-500">(opsional)</span>
                        </label>
                        <input
                            autoComplete="off"
                            id="rumus"
                            type="text"
                            placeholder="tarif * luasUsaha"
                            className={`px-3 py-2 bg-gray-200 outline-none rounded ${
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
                            <span className="text-sm text-red-500">
                                {errors.rumus}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="tarif"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Tarif
                        </label>
                        <input
                            autoComplete="off"
                            id="tarif"
                            type="number"
                            placeholder="Contoh: 2500"
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.tarif ?? ""}
                            onChange={(e) => setData("tarif", e.target.value)}
                        />
                        {errors.tarif && (
                            <span className="text-sm text-red-500">
                                {errors.tarif}
                            </span>
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

                    <div className="flex flex-col md:flex-row md:justify-end gap-3 md:gap-2 text-sm">
                        <button
                            className="px-3 py-2 font-medium order-1 md:order-2 rounded text-white bg-teal-400 hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={processing}
                            type="submit"
                        >
                            {processing ? "Menyimpan..." : "Simpan Data"}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-3 py-2 font-medium order-2 md:order-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
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
