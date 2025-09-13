import { Link, usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import AccordionItem from "@/Components/AccordionItem";
import Calendar from "react-calendar";

const KatimNavigation = () => {
  const { url } = usePage();

  const permohonanItems = [
    {
      label: "Wajib Retribusi",
      route: "katim.wajib-retribusi.index",
      activeRoute: [
        "katim.wajib-retribusi.index",
        "katim.wajib-retribusi.create",
      ],
    },
  ];

  const inboxItems = [
    {
      label: "Inbox Diterima",
      route: "katim.wajib-retribusi.diterima",
      activeRoute: [
        "katim.wajib-retribusi.diterima",
        "katim.wajib-retribusi.show",
      ],
    },
    {
      label: "Inbox Diproses",
      route: "katim.wajib-retribusi.diproses",
    },
    {
      label: "Inbox Ditolak",
      route: "katim.wajib-retribusi.ditolak",
      activeRoute: "katim.wajib-retribusi.ditolak",
    },
    {
      label: "Inbox Selesai (SPKRD)",
      route: "katim.skrd.index",
      activeRoute: "katim.skrd.*",
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
            if (r === "katim.wajib-retribusi.show") {
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
            route().current("katim.dashboard")
              ? "bg-[#B3CEAF] font-medium text-white"
              : "bg-transparent hover:bg-neutral-300"
          }`}
          href={route("katim.dashboard")}
        >
          Dashboard
        </Link>

        <AccordionItem
          title="Permohonan"
          items={permohonanItems}
          defaultOpen={isAccordionActive(permohonanItems)}
        />
        <AccordionItem
          title="Inbox Data"
          items={inboxItems}
          defaultOpen={isAccordionActive(inboxItems)}
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

export default KatimNavigation;
