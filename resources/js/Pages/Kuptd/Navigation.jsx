import { Link, usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import AccordionItem from "@/Components/AccordionItem";
import Calendar from "react-calendar";

const KuptdNavigation = () => {
  const { url } = usePage();

  const dataInputs = [
    {
      label: "Data Wajib Retribusi",
      route: "kuptd.wajib-retribusi.index",
      activeRoute: [
        "kuptd.wajib-retribusi.index",
        "kuptd.wajib-retribusi.create",
      ],
    },
    {
      label: "Inbox Diterima",
      route: "kuptd.wajib-retribusi.diterima",
      activeRoute: [
        "kuptd.wajib-retribusi.diterima",
        "kuptd.wajib-retribusi.show",
      ],
    },
    {
      label: "Inbox Diproses",
      route: "kuptd.wajib-retribusi.diproses",
    },
    {
      label: "Inbox Ditolak",
      route: "kuptd.wajib-retribusi.ditolak",
      activeRoute: "kuptd.wajib-retribusi.ditolak",
    },
    {
      label: "Inbox Selesai (SKRD)",
      route: "kuptd.skrd.index",
      activeRoute: "kuptd.skrd.*",
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
            if (r === "kuptd.wajib-retribusi.show") {
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
            route().current("kuptd.dashboard")
              ? "bg-teal-400 font-medium text-white"
              : "bg-transparent hover:bg-neutral-300"
          }`}
          href={route("kuptd.dashboard")}
        >
          Dashboard
        </Link>

        <AccordionItem
          title="Data Input"
          items={dataInputs}
          defaultOpen={isAccordionActive(dataInputs)}
        />

        <div className="py-3">
          <Calendar />
        </div>

        {/* <AccordionItem
          title="Settings"
          items={settingItems}
          isRouteActive={isRouteActive}
        /> */}
      </div>
    </Sidebar>
  );
};

export default KuptdNavigation;
