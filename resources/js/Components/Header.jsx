import { useSidebar } from "@/Context/SidebarContext";
import { Menu } from "lucide-react";

const Header = ({ title }) => {
    const { toggleSidebar } = useSidebar();

    return (
        <header className="h-20 p-2">
            <nav className="w-full h-full rounded flex items-center justify-between px-4 bg-white shadow-sm md:bg-transparent md:shadow-none">
                <h3 className="font-semibold text-lg">{title}</h3>
                <button
                    onClick={toggleSidebar}
                    className="md:hidden hover:bg-neutral-200 transition-all p-1.5 rounded outline-none"
                >
                    <Menu size={30} />
                </button>

                <div className="hidden md:block relative">
                    {/* <div className="size-10 grid place-content-center bg-neutral-400 rounded-full font-medium text-white peer">
                        {getInitials(user?.namaLengkap)}
                    </div> */}
                    <div className="absolute top-full bg-white mt-3 p-3 right-0 transform origin-top-right scale-0 peer-hover:scale-100 transition-all"></div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
