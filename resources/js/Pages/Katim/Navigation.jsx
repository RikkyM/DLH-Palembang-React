import { Link, usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import AccordionItem from "@/Components/AccordionItem";
import Calendar from "react-calendar";

const KatimNavigation = () => {
  const { props } = usePage();
  const { inbox, auth } = props[0];
  const namaLengkap = auth?.user?.namaLengkap;

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
      label: "Diterima",
      route: "katim.wajib-retribusi.diterima",
      activeRoute: [
        "katim.wajib-retribusi.diterima",
        "katim.wajib-retribusi.show",
      ],
      badge:
        inbox
          .filter((i) => i.status === "Processed")
          .filter((i) => i.current_role === "ROLE_KATIM").length || "",
    },
    {
      label: "Diproses",
      route: "katim.wajib-retribusi.diproses",
      activeRoute: [
        "katim.wajib-retribusi.diproses",
        "katim.wajib-retribusi.show",
      ],
      badge:
        inbox
          .filter((i) => i.status === "Processed")
          .filter(
            (i) =>
              i.current_role !== "ROLE_KUPTD" &&
              i.current_role !== "ROLE_KATIM",
          ).length || "",
    },
    {
      label: "Ditolak",
      route: "katim.wajib-retribusi.ditolak",
      activeRoute: [
        "katim.wajib-retribusi.ditolak",
        "katim.wajib-retribusi.show",
      ],
      badge: inbox.filter((i) => i.status === "Rejected").length || "",
    },
    {
      label: "Selesai",
      route: "katim.wajib-retribusi.selesai",
      activeRoute: [
        "katim.wajib-retribusi.selesai",
        "katim.wajib-retribusi.show",
      ],
    },
  ];

  const laporanItems = [
    {
      label: "Jumlah SPKRD",
      route: "katim.rekapitulasi.spkrd",
      activeRoute: [
        "katim.rekapitulasi.spkrd",
        "katim.rekapitulasi.spkrd.detail",
      ],
    },
    {
      label: "Retribusi Kecamatan",
      route: "katim.rekapitulasi.retribusi-kecamatan",
      activeRoute: [
        "katim.rekapitulasi.retribusi-kecamatan",
        "katim.rekapitulasi.retribusi-kecamatan.detail",
      ],
    },
    {
      label: "Retribusi UPTD",
      route: "katim.rekapitulasi.penerimaan",
      activeRoute: [
        "katim.rekapitulasi.penerimaan",
        "katim.rekapitulasi.penerimaan.detail",
      ],
    },
    {
      label: "Nota Tagihan",
      route: "katim.rekapitulasi.nota-tagihan",
    },
  ];

  const settingItems = [
    {
      label: "Tahun Retribusi",
      route: "katim.tahun-retribusi",
    },
  ];

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
                item.label.toLowerCase().includes("diproses") &&
                params.status === "diproses"
              ) {
                return route().current(r);
              }
              if (
                item.label.toLowerCase().includes("ditolak") &&
                params.status === "ditolak"
              ) {
                return route().current(r);
              }
              if (
                item.label.toLowerCase().includes("selesai") &&
                params.status === "selesai"
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
        <Link
          prefetch
          cacheFor="5m"
          preserveScroll
          className={`block rounded px-3 py-2 transition-all duration-300 ${
            route().current("katim.skrd.*")
              ? "bg-[#B3CEAF] font-medium text-white"
              : "bg-transparent hover:bg-neutral-300"
          }`}
          href={route("katim.skrd.index")}
        >
          Kartu Kendali
        </Link>
        <AccordionItem
          title="Laporan"
          items={laporanItems}
          defaultOpen={isAccordionActive(laporanItems)}
        />
        {namaLengkap.includes("Jessie Zarastami") && (
          <AccordionItem
            title="Setting"
            items={settingItems}
            defaultOpen={isAccordionActive(settingItems)}
          />
        )}
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
