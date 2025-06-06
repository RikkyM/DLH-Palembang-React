import { Link, usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import { useState } from "react";
import AccordionItem from "@/Components/AccordionItem";

const SuperAdminNavigation = () => {
    const { url } = usePage();

    const isRouteActive = (routeName) => {
        const generatedRoute = route(routeName);
        return generatedRoute.includes(url);
    };

    const laporanItems = [
        {
            label: "SKRD",
            // route: "super-admin.dashboard",
        },
        {
            label: "Data Wajib Retribusi",
            // route: "super-admin.laporan.data-wajib-retribusi",
        },
        {
            label: "Penerimaan Retribusi",
            // route: "super-admin.laporan.penerimaan-retribusi",
        },
        {
            label: "Piutang Retribusi",
            // route: "super-admin.laporan.piutang-retribusi",
        },
    ];

    const settingItems = [
        {
            label: "Uptd",
            route:'super-admin.uptd'
        },
        {
            label: "User / Pegawai",
        },
        {
            label: "Kecamatan",
        },
        {
            label: "Kelurahan",
        },
        {
            label: "Kategori",
        },
        {
            label: "Sub Kategori",
        },
    ];

    return (
        <Sidebar>
            <div className="p-3 space-y-1.5">
                <Link
                    className={`block rounded px-3 py-2 transition-all duration-300 ${
                        isRouteActive("super-admin.dashboard")
                            ? "bg-teal-400 font-medium text-white"
                            : "bg-transparent hover:bg-neutral-300"
                    }`}
                    href={route("super-admin.dashboard")}
                >
                    Dashboard
                </Link>

                <AccordionItem
                    title="Laporan"
                    items={laporanItems}
                    isRouteActive={isRouteActive}
                />

                <AccordionItem
                    title="Settings"
                    items={settingItems}
                    isRouteActive={isRouteActive}
                />
            </div>

            {/* <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center px-3 py-2 hover:bg-neutral-200 transition-all duration-300 rounded outline-none"
            >
                <span>Laporan</span>
                <ChevronDown
                    size={18}
                    className={`transition-all duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96" : "max-h-0"
                }`}
            >
                <div className="pl-3">
                    <ul className="p-3 ml-0.5 pl-3 space-y-5 border-l border-neutral-400">
                        <li>
                            <Link
                                className={`inline-block w-full p-2 rounded`}
                            >
                                SKRD
                            </Link>
                        </li>
                        <li>
                            <Link className="bg-[#ECF6EE] inline-block w-full p-2 rounded">
                                Data Wajib Retribusi
                            </Link>
                        </li>
                        <li>
                            <Link className="bg-[#ECF6EE] inline-block w-full p-2 rounded">
                                Penerimaan Retribusi
                            </Link>
                        </li>
                        <li>
                            <Link className="bg-[#ECF6EE] inline-block w-full p-2 rounded">
                                Piutang Retribusi
                            </Link>
                        </li>
                    </ul>
                </div>
            </div> */}
        </Sidebar>
    );
};

export default SuperAdminNavigation;
