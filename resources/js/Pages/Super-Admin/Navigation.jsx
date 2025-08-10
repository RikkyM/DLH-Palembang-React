import { Link, usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import AccordionItem from "@/Components/AccordionItem";

const SuperAdminNavigation = () => {
  const { url } = usePage();

  const isRouteActive = (routeName) => {
    const generatedRoute = route(routeName);
    return generatedRoute.includes(url);
  };

  const dataInputs = [
    {
      label: "Pemohon",
      route: "super-admin.pemohon.index",
    },
    {
      label: "Data Wajib Retribusi",
      route: "super-admin.wajib-retribusi.index",
      activeRoute: "super-admin.wajib-retribusi.*",
    },
    {
      label: "Inbox Diterima",
      route: "super-admin.wajib-retribusi-diterima",
    },
    {
      label: "Inbox Diproses",
      route: "super-admin.wajib-retribusi-diproses",
    },
    {
      label: "Inbox Ditolak",
      route: "super-admin.wajib-retribusi-ditolak",
    },
    {
      label: "SKRD",
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
      // route: "super-admin.laporan.piutang-retribusi",
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
      route: "super-admin.uptd",
    },
    {
      label: "User / Pegawai",
      route: "super-admin.user",
    },
    {
      label: "Kecamatan",
      route: "super-admin.kecamatan",
    },
    {
      label: "Kelurahan",
      route: "super-admin.kelurahan",
    },
    {
      label: "Kategori",
      route: "super-admin.kategori",
    },
    {
      label: "Sub Kategori",
      route: "super-admin.sub-kategori",
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
          href={route("super-admin.dashboard")}
        >
          Dashboard
        </Link>

        <AccordionItem
          title="Data Input"
          items={dataInputs}
          isRouteActive={isRouteActive}
        />

        <AccordionItem
          title="Pembayaran"
          items={pembayaranItems}
          isRouteActive={isRouteActive}
        />

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
