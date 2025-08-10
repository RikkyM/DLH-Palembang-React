import { Ellipsis, LogOutIcon, Menu, User } from "lucide-react";
import { useProvider } from "../Context/GlobalContext";
import { useEffect, useRef, useState } from "react";
import { Link, usePage } from "@inertiajs/react";

const Header = ({ title }) => {
  const { toggleSidebar } = useProvider();
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const [menu, setMenu] = useState(false);
  const { props } = usePage();

  const user = props[0]?.auth?.user;

  const handleProfile = () => {
    setMenu(!menu);
  };

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

  return (
    <header className="sticky top-0 z-10 h-20 p-2 md:relative">
      <nav className="flex h-full w-full items-center justify-between rounded bg-white px-4 shadow-sm md:bg-transparent md:shadow-none">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          onClick={toggleSidebar}
          className="rounded p-1.5 outline-none transition-all hover:bg-neutral-200 md:hidden"
        >
          <Menu size={30} />
        </button>

        <section className="relative hidden md:block">
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={handleProfile}
              className="flex w-full items-center gap-2 text-nowrap rounded-md p-2 transition-all duration-300 hover:bg-neutral-200"
            >
              <div className="flex flex-1 items-center gap-3">
                <div className="relative grid size-10 place-content-center overflow-hidden rounded-full bg-gray-300 font-medium">
                  <img
                    src="/img/KLHK_2024.webp"
                    alt="gambar"
                    className="absolute h-full w-full object-cover object-center"
                  />
                </div>
                <p className="text-sm font-semibold">{user?.namaLengkap}</p>
              </div>
              {/* <Ellipsis size={20} /> */}
            </button>
          </div>
          <div
            ref={menuRef}
            className={`absolute right-0 top-[120%] top-full z-10 origin-bottom-right origin-top-right transform divide-y divide-neutral-200 rounded-md border border-neutral-200 bg-white shadow-md transition-all duration-200 ${
              menu ? "scale-100" : "scale-0"
            }`}
          >
            <div className="flex w-max items-center gap-3 p-3">
              <div className="relative grid size-9 place-content-center overflow-hidden rounded-full bg-neutral-300">
                <img
                  src="/img/KLHK_2024.webp"
                  loading="lazy"
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
                <Link className="inline-flex w-full items-center gap-1.5 rounded p-1.5 font-medium transition-all duration-200 hover:bg-neutral-200">
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
      </nav>
    </header>
  );
};

export default Header;
