import { Link, usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import AccordionItem from "@/Components/AccordionItem";

const SuperAdminNavigation = () => {
  const { url } = usePage();

  const dataInputs = [
    {
      label: "Pemohon",
      route: "super-admin.pemohon.index",
    },
    {
      label: "Data Wajib Retribusi",
      route: "super-admin.wajib-retribusi.index",
      activeRoute: [
        "super-admin.wajib-retribusi.index",
        "super-admin.wajib-retribusi.create",
      ],
    },
    {
      label: "Inbox Diterima",
      route: "super-admin.wajib-retribusi.diterima",
      activeRoute: [
        "super-admin.wajib-retribusi.diterima",
        "super-admin.wajib-retribusi.edit",
      ],
    },
    {
      label: "Inbox Diproses",
      route: "super-admin.wajib-retribusi.diproses",
    },
    {
      label: "Inbox Ditolak",
      route: "super-admin.wajib-retribusi.ditolak",
      activeRoute: [
        "super-admin.wajib-retribusi.ditolak",
        "super-admin.wajib-retribusi.edit",
      ],
    },
    {
      label: "Inbox Selesai (SKRD)",
      route: "super-admin.skrd.index",
      activeRoute: "super-admin.skrd.*",
    },
  ];


  const pembayaranItems = [
    {
      label: "Invoice",
      route: "super-admin.invoice.index",
    },
    {
      label: "Input Setoran",
      route: "super-admin.input-setoran",
    },
    {
      label: "Data Setoran",
      // route: "super-admin.laporan.piutang-retribusi",
    },
    {
      label: "Penerimaan Retribusi",
      route: "super-admin.penerimaan-retribusi.index",
    },
    {
      label: "Piutang Retribusi",
      // route: "super-admin.laporan.piutang-retribusi",
    },
  ];

  const laporanItems = [
    {
      label: "Rekap Penanggung Jawab",
      // route: "super-admin.laporan.piutang-retribusi",
    },
    {
      label: "Rekap Wajib Retribusi",
      // route: "super-admin.laporan.penerimaan-retribusi",
    },
    {
      label: "Rekap SKRD",
      // route: "super-admin.laporan.piutang-retribusi",
    },
    {
      label: "Rekap Penerimaan Retribusi",
      // route: "super-admin.laporan.piutang-retribusi",
    },
    {
      label: "Rekap Piutang Retribusi",
      // route: "super-admin.laporan.piutang-retribusi",
    },
  ];

  const settingItems = [
    {
      label: "Uptd",
      route: "super-admin.uptd.index",
    },
    {
      label: "User / Pegawai",
      route: "super-admin.user.index",
    },
    {
      label: "Kecamatan",
      route: "super-admin.kecamatan.index",
    },
    {
      label: "Kelurahan",
      route: "super-admin.kelurahan.index",
    },
    {
      label: "Kategori",
      route: "super-admin.kategori.index",
    },
    {
      label: "Sub Kategori",
      route: "super-admin.sub-kategori.index",
    },
  ];

  const isAccordionActive = (items) =>
    items.some((item) => {
      if (item.activeRoute) {
        if (Array.isArray(item.activeRoute)) {
          return item.activeRoute.some((r) => {
            if (r === "super-admin.wajib-retribusi.edit") {
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
            route().current('super-admin.dashboard')
              ? "bg-teal-400 font-medium text-white"
              : "bg-transparent hover:bg-neutral-300"
          }`}
          href={route("super-admin.dashboard")}
        >
          Dashboard
        </Link>

        <AccordionItem
          title="Data Input"
          items={dataInputs}
          defaultOpen={isAccordionActive(dataInputs)}
        />
        <AccordionItem
          title="Pembayaran"
          items={pembayaranItems}
          defaultOpen={isAccordionActive(pembayaranItems)}
        />
        <AccordionItem
          title="Laporan"
          items={laporanItems}
          defaultOpen={isAccordionActive(laporanItems)}
        />
        <AccordionItem
          title="Settings"
          items={settingItems}
          defaultOpen={isAccordionActive(settingItems)}
        />
      </div>
    </Sidebar>
  );
};

export default SuperAdminNavigation;
