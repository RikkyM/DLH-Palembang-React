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
                className={`fixed inset-0 min-h-dvh bg-black/50 z-20 transition-opacity duration-300 md:hidden ${
                    isOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
            ></div>
            <aside
                className={`bg-white fixed flex z-20 flex-col top-0 bottom-0 left-0 max-h-dvh md:relative transition-all duration-300 ease-[cubic-bezier(0.65,0.05,0.36,1)] md:w-64 ${
                    isOpen ? "w-64" : "w-0"
                }`}
            >
                {/* head */}
                <section className="overflow-hidden">
                    <img
                        src="/img/logo.png"
                        alt="logo"
                        className="w-64 min-w-64 p-7"
                    />
                </section>

                {/* body */}
                <section className="text-nowrap place-content-start overflow-y-auto overflow-x-hidden flex-1 space-y-1.5 text-sm [&::-webkit-scrollbar]:w-0.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                    {children}
                </section>

                {/* footer */}
                <section className="overflow-hidden md:hidden">
                    <div className="p-3 w-64 min-w-64">
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
                            <Ellipsis size={20} />
                        </button>
                    </div>
                    <div
                        ref={menuRef}
                        className={`absolute right-0 mr-3 md:mr-0 md:ml-3 md:right-auto bottom-20 md:left-full md:bottom-4 z-10 bg-white shadow-md divide-y divide-neutral-200 rounded-md border border-neutral-200 transform origin-bottom-right md:origin-bottom-left transition-all duration-200 ${
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
            </aside>
        </>
    );
};

export default Sidebar;
