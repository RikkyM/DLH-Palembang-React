import { Link, usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import AccordionItem from "@/Components/AccordionItem";
import Calendar from "react-calendar";

const KabidNavigation = () => {
  const { props } = usePage();
  const { inbox } = props[0];

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
      label: "Inbox Diterima",
      route: "kabid.wajib-retribusi.diterima",
      activeRoute: [
        "kabid.wajib-retribusi.diterima",
        "kabid.wajib-retribusi.show",
      ],
      badge:
        inbox
          .filter((i) => i.status === "Processed")
          .filter((i) => i.current_role === "ROLE_KABID").length || "",
    },
    // {
    //   label: "Inbox Diproses",
    //   route: "kabid.wajib-retribusi.diproses",
    // },
    {
      label: "Inbox Ditolak",
      route: "kabid.wajib-retribusi.ditolak",
      activeRoute: [
        "kabid.wajib-retribusi.ditolak",
        "kabid.wajib-retribusi.show",
      ],
      badge: inbox.filter((i) => i.status === "Rejected").length || "",
    },
    {
      label: "Inbox Selesai (SPKRD)",
      route: "kabid.skrd.index",
      activeRoute: "kabid.skrd.*",
    },
  ];

  const laporanItems = [
    {
      label: "Jumlah SPKRD",
      route: "kabid.rekapitulasi.spkrd",
      activeRoute: [
        "kabid.rekapitulasi.spkrd",
        "kabid.rekapitulasi.spkrd.detail",
      ],
    },
    {
      label: "Penerimaan",
      route: "kabid.rekapitulasi.penerimaan",
      activeRoute: [
        "kabid.rekapitulasi.penerimaan",
        "kabid.rekapitulasi.penerimaan.detail",
      ],
    },
    {
      label: "Nota Tagihan",
      route: "kabid.rekapitulasi.nota-tagihan",
    },
  ];

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
          prefetch
          cacheFor="5m"
          preserveScroll
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

        <AccordionItem
          title="Laporan"
          items={laporanItems}
          defaultOpen={isAccordionActive(laporanItems)}
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
