import { Head } from "@inertiajs/react";

const AuthLayout = ({ title = "Authentication", children }) => {
    return (
        <section className="min-h-dvh bg-[#ECF6EE] flex">
            <Head title={title} />
            <div className="flex-1 grid place-content-center text-center hidden md:flex md:items-center md:px-10">
                <div className="flex">
                    <div></div>
                    <div>
                        <div className="flex items-center">
                            <img
                                src="/img/logo_palembang.png"
                                alt="logo"
                                className="max-w-24 mx-auto"
                            />
                            <img
                                src="/img/dlh_logo.png"
                                alt="logo"
                                className="max-w-40 mx-auto" 
                            />
                            <img
                                src="/img/KLHK_2024.png"
                                alt="logo"
                                className="max-w-24 mx-auto"
                            />
                        </div>
                        <h2 className="text-xl font-semibold">
                            Sistem Informasi Retribusi Persampahan Versi 2
                        </h2>
                        <p className="text-lg">SIREP V2</p>
                    </div>
                    <div></div>
                </div>
            </div>
            <div className="flex items-center justify-center flex-1 bg-white">
                {children}
            </div>
        </section>
    );
};

export default AuthLayout;
