import { Link, usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import AccordionItem from "@/Components/AccordionItem";
import Calendar from "react-calendar";

const KabidNavigation = () => {
  const { url } = usePage();

  const permohonanItems = [
    {
      label: "Wajib Retribusi",
      route: "kabid.wajib-retribusi.index",
      activeRoute: [
        "kabid.wajib-retribusi.index",
        "kabid.wajib-retribusi.create",
      ],
    },
  ];

  const inboxInputs = [
    {
      label: "Wajib Retribusi",
      route: "kabid.wajib-retribusi.index",
      activeRoute: [
        "kabid.wajib-retribusi.index",
        "kabid.wajib-retribusi.create",
      ],
    },
    {
      label: "Inbox Diterima",
      route: "kabid.wajib-retribusi.diterima",
      activeRoute: [
        "kabid.wajib-retribusi.diterima",
        "kabid.wajib-retribusi.show",
      ],
    },
    // {
    //   label: "Inbox Diproses",
    //   route: "kabid.wajib-retribusi.diproses",
    // },
    {
      label: "Inbox Ditolak",
      route: "kabid.wajib-retribusi.ditolak",
      activeRoute: "kabid.wajib-retribusi.ditolak",
    },
    {
      label: "Inbox Selesai (SPKRD)",
      route: "kabid.skrd.index",
      activeRoute: "kabid.skrd.*",
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
            if (r === "kabid.wajib-retribusi.show") {
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
            route().current("kabid.dashboard")
              ? "bg-[#B3CEAF] font-medium text-white"
              : "bg-transparent hover:bg-neutral-300"
          }`}
          href={route("kabid.dashboard")}
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
          items={inboxInputs}
          defaultOpen={isAccordionActive(inboxInputs)}
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

export default KabidNavigation;
