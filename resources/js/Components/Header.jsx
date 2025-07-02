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
        <header className="h-20 p-2 sticky md:relative top-0 z-10">
            <nav className="w-full h-full rounded flex items-center justify-between px-4 bg-white shadow-sm md:bg-transparent md:shadow-none">
                <h3 className="font-semibold text-lg">{title}</h3>
                <button
                    onClick={toggleSidebar}
                    className="md:hidden hover:bg-neutral-200 transition-all p-1.5 rounded outline-none"
                >
                    <Menu size={30} />
                </button>

                <section className="hidden md:block relative">
                    <div className="relative">
                        <button
                            ref={buttonRef}
                            onClick={handleProfile}
                            className="w-full flex items-center gap-2 text-nowrap p-2 transition-all duration-300 hover:bg-neutral-200 rounded-md"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <div className="bg-gray-300 size-10 rounded-full grid place-content-center font-medium relative overflow-hidden font-medium">
                                    <img
                                        src="/img/1.jpg"
                                        alt="gambar"
                                        className="absolute object-cover object-center h-full w-full"
                                    />
                                </div>
                                <p className="font-semibold text-sm">
                                    {user?.namaLengkap}
                                </p>
                            </div>
                            {/* <Ellipsis size={20} /> */}
                        </button>
                    </div>
                    <div
                        ref={menuRef}
                        className={`absolute top-full right-0 top-[120%] z-10 bg-white shadow-md divide-y divide-neutral-200 rounded-md border border-neutral-200 transform origin-bottom-right origin-top-right transition-all duration-200 ${
                            menu ? "scale-100" : "scale-0"
                        }`}
                    >
                        <div className="p-3 flex items-center gap-3 w-max">
                            <div className="rounded-full bg-neutral-300 size-9 grid place-content-center overflow-hidden relative">
                                <img
                                    src="/img/1.jpg"
                                    alt="gambar"
                                    className="absolute object-cover object-center h-full w-full"
                                />
                            </div>
                            <p className="selection:bg-black selection:text-white font-medium text-sm">
                                {user?.namaLengkap}
                            </p>
                        </div>
                        <ul className="p-1.5 flex flex-col gap-2 text-xs md:text-sm">
                            <li>
                                <Link className="w-full inline-flex items-center gap-1.5 font-medium transition-all duration-200 hover:bg-neutral-200 p-1.5 rounded">
                                    <User size={20} />
                                    <span>Akun</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="w-full inline-flex items-center gap-1.5 font-medium transition-all duration-200 hover:bg-neutral-200 p-1.5 rounded"
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
