import { Head } from "@inertiajs/react";

const AuthLayout = ({ title = "Authentication", children }) => {
    return (
        <section className="min-h-dvh bg-[#ECF6EE] flex">
            <Head title={title} />
            <div className="flex-1 grid place-content-center text-center hidden md:grid">
                <div>
                <img src="/img/logo.png" alt="logo" className="max-w-72 mx-auto" />
                <h2 className="text-3xl font-semibold">Objek Retribusi</h2>
                <p className="text-">DLH Kota Palembang</p>
                </div>
            </div>
            <div className="flex items-center justify-center flex-1 bg-white">
                {children}
            </div>
        </section>
    );
};

export default AuthLayout;
