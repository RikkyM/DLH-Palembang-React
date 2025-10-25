import { Link, usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import AccordionItem from "@/Components/AccordionItem";
import Calendar from "react-calendar";

const PendaftarNavigation = () => {
  const { props } = usePage();
  const { inbox } = props[0];

  const permohonanItems = [
    {
      label: "Pemohon",
      route: "pendaftar.pemohon.index",
    },
    {
      label: "Wajib Retribusi",
      route: "pendaftar.wajib-retribusi.index",
      activeRoute: [
        "pendaftar.wajib-retribusi.index",
        "pendaftar.wajib-retribusi.create",
      ],
    },
  ];

  const inboxItems = [
    {
      label: "Inbox Diterima",
      route: "pendaftar.wajib-retribusi.diterima",
      activeRoute: [
        "pendaftar.wajib-retribusi.diterima",
        "pendaftar.wajib-retribusi.edit",
      ],
      badge:
        inbox
          .filter((i) => i.status === "Approved")
          .filter((i) => i.current_role === "ROLE_PENDAFTAR").length || "",
    },
    {
      label: "Inbox Diproses",
      route: "pendaftar.wajib-retribusi.diproses",
      badge:
        inbox
          .filter((i) => i.status === "Processed")
          .filter((i) => i.current_role !== "ROLE_PENDAFTAR").length || "",
    },
    {
      label: "Inbox Ditolak",
      route: "pendaftar.wajib-retribusi.ditolak",
      activeRoute: [
        "pendaftar.wajib-retribusi.ditolak",
        "pendaftar.wajib-retribusi.edit",
      ],
      badge: inbox.filter((i) => i.status === "Rejected").length || "",
    },
    {
      label: "Inbox Selesai (SPKRD)",
      route: "pendaftar.skrd.index",
      activeRoute: "pendaftar.skrd.*",
    },
  ];

  const laporanItems = [
    {
      label: "Jumlah SPKRD",
      route: "pendaftar.rekapitulasi.spkrd",
      activeRoute: [
        "pendaftar.rekapitulasi.spkrd",
        "pendaftar.rekapitulasi.spkrd.detail",
      ],
    },
    {
      label: "Penerimaan",
      route: "pendaftar.rekapitulasi.penerimaan",
      activeRoute: [
        "pendaftar.rekapitulasi.penerimaan",
        "pendaftar.rekapitulasi.penerimaan.detail",
      ],
    },
    {
      label: "Nota Tagihan",
      route: "pendaftar.rekapitulasi.nota-tagihan",
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
          prefetch
          cacheFor="5m"
          preserveScroll
          className={`block rounded px-3 py-2 transition-all duration-300 ${
            route().current("pendaftar.dashboard")
              ? "bg-[#B3CEAF] font-medium text-white"
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
          title="Permohonan"
          items={permohonanItems}
          defaultOpen={isAccordionActive(permohonanItems)}
        />
        <AccordionItem
          title="Inbox Data"
          items={inboxItems}
          defaultOpen={isAccordionActive(inboxItems)}
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

export default PendaftarNavigation;
