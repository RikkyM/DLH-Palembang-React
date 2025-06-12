import AuthLayout from "@/Layouts/AuthLayout";
import { useForm, usePage } from "@inertiajs/react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useProvider } from "../../Context/GlobalContext";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { setIsOpen } = useProvider();
    const { props } = usePage();

    const user = props[0]?.auth?.user;

    // Ubah field dari 'nip' ke 'login' agar konsisten dengan backend
    const { data, setData, post, processing, errors } = useForm({
        login: "", // Ganti dari 'nip' ke 'login'
        password: "",
        remember: false,
    });

    useEffect(() => {
        if (errors) {
            setData("password", "");
        }
    }, [errors]);

    useEffect(() => {
        setIsOpen(false);
    }, [user?.id]);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("login"));
    };

    return (
        <AuthLayout title="Objek Retribusi DLH Kota Palembang">
            <section className="flex flex-col gap-4 max-w-xs w-full">
                <div className="flex items-center justify-between md:hidden">
                    <img
                        src="/img/logo_palembang.png"
                        alt="logo"
                        className="max-w-16 "
                    />
                    <img
                        src="/img/dlh_logo.png"
                        alt="logo"
                        className="max-w-32 "
                    />
                    <img
                        src="/img/KLHK_2024.png"
                        alt="logo"
                        className="max-w-16 "
                    />
                </div>
                <div className="text-center space-y-0.5">
                    <h3 className="text-xl font-semibold md:text-3xl md:font-medium">
                        Selamat Datang
                    </h3>
                    <p className="text-xs">
                        Masukkan NIP/Username dan password
                    </p>
                </div>
                <form onSubmit={submit} className="flex flex-col gap-5 text-sm">
                    <div className="flex flex-col gap-2">
                        <label className="font-medium" htmlFor="login">
                            NIP/Username
                        </label>
                        <input
                            id="login" // Ubah id dari 'nip' ke 'login'
                            name="login" // Tambahkan name attribute
                            type="text"
                            value={data.login} // Ubah dari data.nip ke data.login
                            onChange={(e) => setData("login", e.target.value)} // Ubah field
                            className="px-3 py-2 text-sm outline-none select-none bg-neutral-200 rounded"
                            placeholder="Masukkan NIP atau Username..." // Update placeholder
                            autoComplete="username" // Update autocomplete
                            required
                        />
                        {errors.login && ( // Ubah dari errors.nip ke errors.login
                            <span className="text-red-500 text-xs">
                                {errors.login}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-medium" htmlFor="password">
                            Password
                        </label>
                        <div className="flex items-center gap-2 bg-neutral-200 rounded px-3 py-2">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password" // Tambahkan name attribute
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="text-sm outline-none select-none bg-transparent flex-1"
                                placeholder="Masukkan Password..."
                                autoComplete="current-password" // Update autocomplete
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePassword}
                                className="outline-none"
                                aria-label={
                                    showPassword
                                        ? "Sembunyikan password"
                                        : "Tampilkan password"
                                }
                            >
                                {showPassword ? (
                                    <Eye size={20} />
                                ) : (
                                    <EyeOff size={20} />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="text-red-500 text-xs">
                                {errors.password}
                            </span>
                        )}
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-black text-white font-medium p-2 rounded flex items-center justify-center disabled:opacity-50"
                        >
                            {processing ? (
                                <LoaderCircle
                                    size={20}
                                    className="animate-spin"
                                />
                            ) : (
                                "Masuk"
                            )}
                        </button>
                    </div>
                    {errors.message && (
                        <div className="text-red-500 text-xs text-center">
                            {errors.message}
                        </div>
                    )}
                </form>
            </section>
        </AuthLayout>
    );
};

export default Login;
