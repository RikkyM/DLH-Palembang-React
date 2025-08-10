import { Head } from "@inertiajs/react";

const AuthLayout = ({ title = "Authentication", children }) => {
  return (
    <section className="flex min-h-dvh bg-[#ECF6EE]">
      <Head title={title} />
      <div className="grid hidden flex-1 place-content-center text-center md:flex md:items-center md:px-10">
        <div className="flex">
          <div></div>
          <div>
            <div className="flex items-center">
              <img
                src="/img/logo_palembang.png"
                alt="logo"
                className="mx-auto max-w-24"
              />
              <img
                src="/img/dlh_logo.png"
                alt="logo"
                className="mx-auto max-w-40"
              />
              <img
                src="/img/KLHK_2024.png"
                alt="logo"
                className="mx-auto max-w-24"
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
      <div className="flex flex-1 items-center justify-center bg-white">
        {children}
      </div>
    </section>
  );
};

export default AuthLayout;
