import Dialog from "@/Components/Dialog";
import { useForm } from "@inertiajs/react";
import { X } from "lucide-react";
import DropdownInput from "@/Components/DropdownInput";
import React, { useEffect, useMemo } from "react";
import FormInput from "@/Components/FormInput";
import Label from "@/Components/Label";
import Input from "@/Components/Input";

const DialogForm = ({
    isOpen,
    onClose,
    invoice = null,
    mode = "create",
    retribusiOptions = null,
}) => {
    const isEditMode = mode === "edit" && invoice;

    const initialData = {
        noSkrd: "",
        jumlahBulan: "",
        satuan: "",
        namaBank: "",
        pengirim: "",
        noRekening: "",
    };

    const { data, setData, errors, processing, clearErrors, post, put } =
        useForm(initialData);

    useEffect(() => {
        if (isOpen) {
            if (isEditMode && invoice?.id !== data.id) {
                setData({
                    noWajibRetribusi: invoice.noWajibRetribusi,
                    noSkrd: invoice.noSkrd,
                    namaObjekRetribusi: invoice.namaObjekRetribusi,
                });
            } else {
                setData(initialData);
            }
            clearErrors();
        }
    }, [isOpen, invoice?.id, isEditMode]);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("super-admin.invoice.store"), {
            onSuccess: () => {
                setData(initialData);
                onClose();
            },
            onError: (e) => {
                console.error(e);
            },
        });
    };

    const retribusiList = useMemo(
        () =>
            retribusiOptions.map((r) => ({
                value: r.noWajibRetribusi,
                label: r.namaObjekRetribusi,
            })),
        [retribusiOptions]
    );

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-white w-full max-w-lg rounded h-max max-h-full overflow-auto transition-all duration-300
                [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300
                ${isOpen ? "scale-100" : "scale-95"}`}
            >
                <div className="flex items-center justify-between p-5">
                    <h3 className="text-lg font-medium">Form Invoice</h3>
                    <button type="button" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 px-5 pb-5 font-poppins"
                >
                    <DropdownInput
                        id="nama wajib retribusi"
                        label="Nama Wajib Retribusi"
                        placeholder="Pilih Wajib Retribusi..."
                        value={data.noWajibRetribusi}
                        onChange={(value) => {
                            const selected = retribusiOptions.find(
                                (r) => r.noWajibRetribusi === value
                            );

                            setData(
                                "noWajibRetribusi",
                                selected?.noWajibRetribusi || ""
                            );
                            setData("noSkrd", selected?.noSkrd || "");
                            setData(
                                "namaObjekRetribusi",
                                selected?.namaObjekRetribusi || ""
                            );
                        }}
                        options={retribusiList}
                        error={errors.noWajibRetribusi}
                        required={true}
                        valueKey="value"
                        labelKey="label"
                    />

                    <FormInput>
                        <Label htmlFor="noSkrd">No SKRD</Label>
                        <Input
                            id="noSkrd"
                            value={data.noSkrd}
                            onChange={(e) => setData("noSkrd", e.target.value)}
                            readOnly={true}
                            tabIndex={-1}
                        />
                        {errors.noSkrd && (
                            <span className="text-sm text-red-500">
                                {errors.noSkrd}
                            </span>
                        )}
                    </FormInput>

                    <FormInput>
                        <Label htmlFor="jumlahBulan">Jumlah Bulan</Label>
                        <Input
                            id="jumlahBulan"
                            type="number"
                            value={data.jumlahBulan}
                            onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                if (
                                    !isNaN(value) &&
                                    value >= 1 &&
                                    value <= 12
                                ) {
                                    setData("jumlahBulan", value);
                                } else if (e.target.value === "") {
                                    setData("jumlahBulan", "");
                                }
                            }}
                            min={1}
                            max={12}
                            placeholder="Masukkan jumlah bulan..."
                        />
                        {errors.jumlahBulan && (
                            <span className="text-sm text-red-500">
                                {errors.jumlahBulan}
                            </span>
                        )}
                    </FormInput>

                    <FormInput>
                        <Label htmlFor="satuan">Satuan</Label>
                        <Input
                            id="satuan"
                            value={data.satuan}
                            onChange={(e) => setData("satuan", e.target.value)}
                            placeholder="contoh: Bulan (Jan s.d Des)"
                        />
                        {errors.satuan && (
                            <span className="text-sm text-red-500">
                                {errors.satuan}
                            </span>
                        )}
                    </FormInput>
                    <FormInput>
                        <Label htmlFor="namaBank">Nama Bank</Label>
                        <Input
                            id="namaBank"
                            value={data.namaBank}
                            onChange={(e) =>
                                setData("namaBank", e.target.value)
                            }
                            placeholder="Masukkan nama bank..."
                        />
                        {errors.namaBank && (
                            <span className="text-sm text-red-500">
                                {errors.namaBank}
                            </span>
                        )}
                    </FormInput>
                    <FormInput>
                        <Label htmlFor="pengirim">Nama Pengirim</Label>
                        <Input
                            id="pengirim"
                            value={data.pengirim}
                            onChange={(e) =>
                                setData("pengirim", e.target.value)
                            }
                            placeholder="Masukkan nama pengirim..."
                        />
                        {errors.pengirim && (
                            <span className="text-sm text-red-500">
                                {errors.pengirim}
                            </span>
                        )}
                    </FormInput>
                    <FormInput>
                        <Label htmlFor="noRekening">No Rekening</Label>
                        <Input
                            id="noRekening"
                            value={data.noRekening}
                            type="number"
                            onChange={(e) =>
                                setData("noRekening", e.target.value)
                            }
                            placeholder="Masukkan nomor rekening..."
                        />
                        {errors.noRekening && (
                            <span className="text-sm text-red-500">
                                {errors.noRekening}
                            </span>
                        )}
                    </FormInput>

                    <div className="flex flex-col md:flex-row md:justify-end gap-3 md:gap-2 text-sm">
                        <button
                            className="px-3 py-2 font-medium order-1 md:order-2 rounded text-white bg-teal-400 hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={processing}
                            type="submit"
                        >
                            {processing ? "Menyimpan..." : "Simpan Data"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const params = new URLSearchParams(
                                    data
                                ).toString();
                                window.open(
                                    route("super-admin.invoice.preview") +
                                        "?" +
                                        params,
                                    "_blank"
                                );
                            }}
                            className="px-3 py-2 font-medium rounded text-white bg-blue-500 hover:bg-blue-600"
                        >
                            Preview PDF
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

export default React.memo(DialogForm);
