import { Link, usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import AccordionItem from "@/Components/AccordionItem";

const PendaftarNavigation = () => {
  const { url } = usePage();

  const dataInputs = [
    {
      label: "Pemohon",
      route: "pendaftar.pemohon.index",
    },
    {
      label: "Data Wajib Retribusi",
      route: "pendaftar.wajib-retribusi.index",
      activeRoute: [
        "pendaftar.wajib-retribusi.index",
        "pendaftar.wajib-retribusi.create",
      ],
    },
    {
      label: "Inbox Diterima",
      route: "pendaftar.wajib-retribusi.diterima",
      activeRoute: [
        "pendaftar.wajib-retribusi.diterima",
        "pendaftar.wajib-retribusi.edit",
      ],
    },
    {
      label: "Inbox Diproses",
      route: "pendaftar.wajib-retribusi.diproses",
    },
    {
      label: "Inbox Ditolak",
      route: "pendaftar.wajib-retribusi.ditolak",
      activeRoute: [
        "pendaftar.wajib-retribusi.ditolak",
        "pendaftar.wajib-retribusi.edit",
      ],
    },
    {
      label: "Inbox Selesai (SKRD)",
      route: "pendaftar.skrd.index",
      activeRoute: "pendaftar.skrd.*",
    },
  ];

  // const settingItems = [
  //   {
  //     label: "Uptd",
  //     // route: "super-admin.uptd",
  //   },
  //   {
  //     label: "User / Pegawai",
  //     // route: "super-admin.user",
  //   },
  //   {
  //     label: "Kecamatan",
  //   },
  //   {
  //     label: "Kelurahan",
  //   },
  //   {
  //     label: "Kategori",
  //   },
  //   {
  //     label: "Sub Kategori",
  //   },
  // ];

  const isAccordionActive = (items) =>
    items.some((item) => {
      if (item.activeRoute) {
        if (Array.isArray(item.activeRoute)) {
          return item.activeRoute.some((r) => {
            if (r === "pendaftar.wajib-retribusi.edit") {
              const params = route().params;
              if (
                item.label.toLowerCase().includes("diterima") &&
                params.status === "diterima"
              ) {
                return route().current(r);
              }
              if (
                item.label.toLowerCase().includes("ditolak") &&
                params.status === "ditolak"
              ) {
                return route().current(r);
              }
              return false;
            }
            return route().current(r);
          });
        }
        return route().current(item.activeRoute);
      }
      return item.route ? route().current(item.route) : false;
    });

  return (
    <Sidebar>
      <div className="space-y-1.5 p-3">
        <Link
          className={`block rounded px-3 py-2 transition-all duration-300 ${
            route().current('pendaftar.dashboard')
              ? "bg-teal-400 font-medium text-white"
              : "bg-transparent hover:bg-neutral-300"
          }`}
          href={route("pendaftar.dashboard")}
        >
          Dashboard
        </Link>

        {/* <AccordionItem
          title="Data Input"
          items={laporanItems}
          isRouteActive={isRouteActive}
        /> */}

        <AccordionItem
          title="Data Input"
          items={dataInputs}
          defaultOpen={isAccordionActive(dataInputs)}
        />

        {/* <AccordionItem
          title="Settings"
          items={settingItems}
          isRouteActive={isRouteActive}
        /> */}
      </div>
    </Sidebar>
  );
};

export default PendaftarNavigation;
