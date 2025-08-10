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
      // route: "super-admin.uptd",
    },
    {
      label: "User / Pegawai",
      // route: "super-admin.user",
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
      <div className="space-y-1.5 p-3">
        <Link
          className={`block rounded px-3 py-2 transition-all duration-300 ${
            isRouteActive("super-admin.dashboard")
              ? "bg-teal-400 font-medium text-white"
              : "bg-transparent hover:bg-neutral-300"
          }`}
          href={route("pendaftar.dashboard")}
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
    </Sidebar>
  );
};

export default SuperAdminNavigation;
