import { useEffect } from "react";
import Dialog from "@/Components/Dialog";
import { useForm } from "@inertiajs/react";
import { X } from "lucide-react";
import useAutoFocusInput from "@/hooks/useAutoFocusInput";
import DropdownInput from "@/Components/DropdownInput";

const DialogCreate = ({
    isOpen,
    onClose,
    uptdOptions,
    user = null,
    mode = "create",
}) => {
    const isEditMode = mode === "edit" && user;
    const firstInputRef = useAutoFocusInput(isOpen, true);

    const initialData = {
        namaLengkap: "",
        jabatan: "",
        nip: "",
        username: "",
        email: "",
        lokasi: "",
        kelamin: "",
        uptdId: null,
        pangkat: "",
        golongan: "",
        deskripsi: "",
        role: "",
        password: "",
        password_confirmation: "",
    };

    const gender = [
        {
            value: "Laki-laki",
            label: "Laki-laki",
        },
        {
            value: "Perempuan",
            label: "Perempuan",
        },
    ];

    const roleOptions = [
        {
            value: "ROLE_SEKDIN",
            label: "SEKDIN",
        },
        {
            value: "ROLE_PENDAFTAR",
            label: "PENDAFTAR",
        },
        {
            value: "ROLE_KUPTD",
            label: "KUPTD",
        },
        {
            value: "ROLE_KATIM",
            label: "KATIM",
        },
        {
            value: "ROLE_KASUBAG_TU_UPDT",
            label: "KASUBAG TU UPDT",
        },
        {
            value: "ROLE_KADIN",
            label: "KADIN",
        },
        {
            value: "ROLE_KABID",
            label: "KABID",
        },
        {
            value: "ROLE_BENDAHARA",
            label: "BENDAHARA",
        },
    ];

    const { data, setData, errors, processing, clearErrors, post, put } =
        useForm(initialData);

    useEffect(() => {
        if (isOpen) {
            if (isEditMode) {
                setData({
                    namaLengkap: user.namaLengkap || "",
                    username: user.username || "",
                    jabatan: user.jabatan || "",
                    nip: user.nip || "",
                    email: user.email || "",
                    lokasi: user.lokasi || "",
                    kelamin: user.kelamin || "",
                    uptdId: user.uptdId || "",
                    pangkat: user.pangkat || "",
                    golongan: user.golongan || "",
                    deskripsi: user.deskripsi || "",
                    role: user.role || "",
                    password: "",
                    password_confirmation: "",
                });
            } else {
                setData(initialData);
            }
            clearErrors();
        }
    }, [isOpen, user, isEditMode]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditMode) {
            put(route("super-admin.user.update", user.id), {
                onSuccess: () => {
                    setData(initialData);
                    onClose();
                },
                onError: (e) => {
                    console.error(e);
                },
            });
        } else {
            post(route("super-admin.user.store"), {
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
                className={`bg-white w-full max-w-lg rounded h-max max-h-full overflow-auto transition-all duration-300
                [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300
                ${isOpen ? "scale-100" : "scale-95"}`}
            >
                <div className="flex items-center justify-between p-5">
                    <h3 className="text-lg font-medium">Form User</h3>
                    <button type="button" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 px-5 pb-5"
                    data-modal
                >
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="nama"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Nama Lengkap
                        </label>
                        <input
                            autoComplete="off"
                            ref={firstInputRef}
                            id="nama"
                            type="text"
                            placeholder="Masukkan nama lengkap..."
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.namaLengkap}
                            onChange={(e) =>
                                setData("namaLengkap", e.target.value)
                            }
                        />
                        {errors.namaLengkap && (
                            <span className="text-sm text-red-500">
                                {errors.namaLengkap}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="username"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Username
                        </label>
                        <input
                            autoComplete="off"
                            id="username"
                            type="text"
                            placeholder={
                                isEditMode && user?.username
                                    ? "Username tidak dapat diubah"
                                    : "Masukkan username..."
                            }
                            className={`px-3 py-2 outline-none rounded ${
                                isEditMode && user?.username
                                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                    : "bg-gray-200"
                            }`}
                            value={data.username}
                            onChange={(e) => {
                                if (!(isEditMode && user?.username)) {
                                    setData("username", e.target.value);
                                }
                            }}
                            readOnly={isEditMode && user?.username}
                            disabled={isEditMode && user?.username}
                        />
                        {isEditMode && user?.username && (
                            <span className="text-xs text-gray-500">
                                Username sudah ada dan tidak dapat diubah
                            </span>
                        )}
                        {errors.username && (
                            <span className="text-sm text-red-500">
                                {errors.username}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="jabatan"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Jabatan
                        </label>
                        <input
                            autoComplete="off"
                            id="jabatan"
                            type="text"
                            placeholder="Masukkan jabatan..."
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.jabatan}
                            onChange={(e) => setData("jabatan", e.target.value)}
                        />
                        {errors.jabatan && (
                            <span className="text-sm text-red-500">
                                {errors.jabatan}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="nip"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Nomor Induk Pegawai
                        </label>
                        <input
                            autoComplete="off"
                            id="nip"
                            type="text"
                            placeholder="Masukkan NIP..."
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.nip}
                            onChange={(e) => setData("nip", e.target.value)}
                        />
                        {errors.nip && (
                            <span className="text-sm text-red-500">
                                {errors.nip}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label htmlFor="email">Email</label>
                        <input
                            autoComplete="off"
                            id="email"
                            type="email"
                            placeholder="Masukkan E-Mail..."
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        {errors.email && (
                            <span className="text-sm text-red-500">
                                {errors.email}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="lokasi"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Lokasi
                        </label>
                        <input
                            autoComplete="off"
                            id="lokasi"
                            type="text"
                            placeholder="Masukkan lokasi..."
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.lokasi}
                            onChange={(e) => setData("lokasi", e.target.value)}
                        />
                        {errors.lokasi && (
                            <span className="text-sm text-red-500">
                                {errors.lokasi}
                            </span>
                        )}
                    </div>
                    <DropdownInput
                        id="kelamin"
                        label="Jenis Kelamin"
                        placeholder="Pilih kelamin..."
                        value={data.kelamin}
                        onChange={(value) => setData("kelamin", value)}
                        options={gender}
                        error={errors.kelamin}
                        required={true}
                        valueKey="value"
                        labelKey="label"
                    />
                    <DropdownInput
                        id="uptd"
                        label="UPTD"
                        placeholder="Pilih UPTD..."
                        value={data.uptdId}
                        onChange={(value) => setData("uptdId", value)}
                        options={uptdOptions}
                        error={errors.uptdId}
                        required={true}
                        valueKey="value"
                        labelKey="label"
                    />
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="pangkat"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Pangkat
                        </label>
                        <input
                            autoComplete="off"
                            id="pangkat"
                            type="text"
                            placeholder="Masukkan pangkat..."
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.pangkat}
                            onChange={(e) => setData("pangkat", e.target.value)}
                        />
                        {errors.pangkat && (
                            <span className="text-sm text-red-500">
                                {errors.pangkat}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="golongan"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Golongan
                        </label>
                        <input
                            autoComplete="off"
                            id="golongan"
                            type="text"
                            placeholder="Masukkan golongan..."
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.golongan}
                            onChange={(e) =>
                                setData("golongan", e.target.value)
                            }
                        />
                        {errors.golongan && (
                            <span className="text-sm text-red-500">
                                {errors.golongan}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="deskripsi"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Deskripsi
                        </label>
                        <input
                            autoComplete="off"
                            id="deskripsi"
                            type="text"
                            placeholder="Contoh: Kepala UPTD Lingkungan Hidup Kecamatan Gandus"
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.deskripsi}
                            onChange={(e) =>
                                setData("deskripsi", e.target.value)
                            }
                        />
                        {errors.deskripsi && (
                            <span className="text-sm text-red-500">
                                {errors.deskripsi}
                            </span>
                        )}
                    </div>
                    <DropdownInput
                        id="role"
                        label="Role User"
                        placeholder="Pilih Role..."
                        value={data.role}
                        onChange={(value) => setData("role", value)}
                        options={roleOptions}
                        error={errors.role}
                        required={true}
                        valueKey="value"
                        labelKey="label"
                    />
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="password"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Password
                        </label>
                        <input
                            autoComplete="off"
                            id="password"
                            type="password"
                            placeholder="Masukkan password..."
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                        {errors.password && (
                            <span className="text-sm text-red-500">
                                {errors.password}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm">
                        <label
                            htmlFor="password_confirmation"
                            className="after:content-['*'] after:text-red-500"
                        >
                            Konfirmasi Password
                        </label>
                        <input
                            autoComplete="off"
                            id="password_confirmation"
                            type="password"
                            placeholder="Masukkan konfirmasi password..."
                            className="px-3 py-2 bg-gray-200 outline-none rounded"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                        />
                        {errors.password_confirmation && (
                            <span className="text-sm text-red-500">
                                {errors.password_confirmation}
                            </span>
                        )}
                    </div>
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

export default DialogCreate;
