import Dialog from "@/Components/Dialog";
import { useForm } from "@inertiajs/react";
import { X } from "lucide-react";
import DropdownInput from "@/Components/DropdownInput";
import { useEffect, useMemo } from "react";
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
        noWajibRetribusi: "",
        noSkrd: "",
        namaObjekRetribusi: "",
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
            } else if (!isEditMode) {
                setData(initialData);
            } else {
                setData(initialData);
            }
        }
    }, [isOpen, invoice?.id]);

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
                <form onSubmit={handleSubmit} className="space-y-5 px-5 pb-5 font-poppins">
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
                        />
                        {errors.noSkrd && (
                            <span className="text-sm text-red-500">
                                {errors.noSkrd}
                            </span>
                        )}
                    </FormInput>

                    <FormInput>
                        <Label htmlFor="noWajibRetribusi">
                            No Wajib Retribusi
                        </Label>
                        <Input
                            id="noWajibRetribusi"
                            value={data.noWajibRetribusi}
                            onChange={(e) =>
                                setData(["noWajibRetribusi", e.target.value])
                            }
                        />
                        {errors.noWajibRetribusi && (
                            <span className="text-sm text-red-500">
                                {errors.noWajibRetribusi}
                            </span>
                        )}
                    </FormInput>

                    <button type="submit">submit</button>
                </form>
            </div>
        </Dialog>
    );
};

export default DialogForm;
