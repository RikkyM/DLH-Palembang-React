import { Link, usePage } from "@inertiajs/react";
import { Ellipsis, LogOutIcon, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useProvider } from "../Context/GlobalContext";

const Sidebar = ({ children }) => {
  const { isOpen, setIsOpen, toggleSidebar } = useProvider();
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const [menu, setMenu] = useState(false);
  const { url, props } = usePage();

  const user = props[0]?.auth?.user;

  const roleConfig = {
    ROLE_SUPERADMIN: "super-admin",
    ROLE_PENDAFTAR: "pendaftar",
    ROLE_KUPTD: "kuptd",
    ROLE_KATIM: "katim",
    ROLE_KABID: "kabid",
    ROLE_KASUBAG_TU_UPDT: "kasubag",
    ROLE_BENDAHARA: "bendahara",
  };

  const routeConfig = roleConfig[user.role];

  useEffect(() => {
    setIsOpen(false);
  }, [url]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    const handleMenuOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setMenu(false);
      }
    };

    if (menu) {
      document.addEventListener("mousedown", handleMenuOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleMenuOutside);
    };
  }, [menu]);

  const handleProfile = () => {
    setMenu(!menu);
  };

  return (
    <>
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 z-30 min-h-dvh bg-black/50 transition-opacity duration-300 md:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      ></div>
      <aside
        className={`fixed bottom-0 left-0 top-0 z-30 flex max-h-dvh flex-col bg-white transition-all duration-300 ease-[cubic-bezier(0.65,0.05,0.36,1)] md:relative md:w-72 ${
          isOpen ? "w-72" : "w-0"
        }`}
      >
        {/* head */}
        <section className="overflow-hidden">
          {/* <img
                        src="/img/logo.png"
                        alt="logo"
                        className="w-64 min-w-64 p-7"
                    /> */}
          <picture>
            <source srcSet="/img/logo.webp" type="image/webp" />
            <img
              src="/img/logo.webp"
              alt="Logo DLH"
              fetchPriority="high"
              width="256"
              height="80"
              decoding="async"
              className="w-64 w-full min-w-72 px-7 pt-7"
            />
          </picture>
          <p className="w-full min-w-72 px-14 text-xs uppercase">
            sistem informasi retribusi persampahan versi 2
          </p>
        </section>

        {/* body */}
        <section className="flex-1 place-content-start space-y-1.5 overflow-y-auto overflow-x-hidden text-sm [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-0.5">
          {children}
        </section>

        {/* footer */}
        <section className="overflow-hidden md:hidden">
          <div className="w-full min-w-64 p-3">
            <button
              ref={buttonRef}
              onClick={handleProfile}
              className="flex w-full items-center gap-2 text-nowrap rounded-md p-2 transition-all duration-300 hover:bg-neutral-200"
            >
              <div className="flex flex-1 items-center gap-3">
                <div className="relative grid size-10 place-content-center overflow-hidden rounded-full bg-gray-300 font-medium">
                  <img
                    src="/img/logo_palembang.webp"
                    alt="gambar"
                    className="absolute h-full w-full object-cover object-center"
                  />
                </div>
                <p className="text-sm font-semibold">{user?.namaLengkap}</p>
              </div>
              <Ellipsis size={20} />
            </button>
          </div>
          <div
            ref={menuRef}
            className={`absolute bottom-20 right-0 z-10 mr-3 origin-bottom-right transform divide-y divide-neutral-200 rounded-md border border-neutral-200 bg-white shadow-md transition-all duration-200 md:bottom-4 md:left-full md:right-auto md:ml-3 md:mr-0 md:origin-bottom-left ${
              menu ? "scale-100" : "scale-0"
            }`}
          >
            <div className="flex w-max items-center gap-3 p-3">
              <div className="relative grid size-9 place-content-center overflow-hidden rounded-full bg-gray-300">
                <img
                  src="/img/logo_palembang.webp"
                  alt="gambar"
                  className="absolute h-full w-full object-cover object-center"
                />
              </div>
              <p className="text-sm font-medium selection:bg-black selection:text-white">
                {user?.namaLengkap}
              </p>
            </div>
            <ul className="flex flex-col gap-2 p-1.5 text-xs md:text-sm">
              <li>
                <Link
                  href={route(`${routeConfig}.akun`)}
                  className="inline-flex w-full items-center gap-1.5 rounded p-1.5 font-medium transition-all duration-200 hover:bg-neutral-200"
                >
                  <User size={20} />
                  <span>Akun</span>
                </Link>
              </li>
              <li>
                <Link
                  href={route("logout")}
                  method="post"
                  as="button"
                  className="inline-flex w-full items-center gap-1.5 rounded p-1.5 font-medium transition-all duration-200 hover:bg-neutral-200"
                >
                  <LogOutIcon size={20} />
                  <span>Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </aside>
    </>
  );
};

export default Sidebar;
