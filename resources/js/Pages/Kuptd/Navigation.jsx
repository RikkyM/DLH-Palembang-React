import { Link, usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import AccordionItem from "@/Components/AccordionItem";

const KuptdNavigation = () => {
  const { url } = usePage();

  const isRouteActive = (routeName) => {
    const generatedRoute = route(routeName);
    return generatedRoute.includes(url);
  };

  const laporanItems = [
    {
      label: "Data Wajib Retribusi",
      route: "kuptd.wajib-retribusi.index",
      activeRoute: "kuptd.wajib-retribusi.*",
    },
    {
      label: "Inbox Diterima",
        route: "kuptd.wajib-retribusi-diterima",
    },
    {
      label: "Inbox Diproses",
        route: "kuptd.wajib-retribusi-diproses",
    },
    {
      label: "Inbox Ditolak",
        route: "kuptd.wajib-retribusi-ditolak",
    },
    {
      label: "Inbox Selesai (SKRD)",
      //   route: "kuptd.skrd.index",
      //   activeRoute: "kuptd.skrd.*",
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

  return (
    <Sidebar>
      <div className="space-y-1.5 p-3">
        <Link
          className={`block rounded px-3 py-2 transition-all duration-300 ${
            isRouteActive("kuptd.dashboard")
              ? "bg-teal-400 font-medium text-white"
              : "bg-transparent hover:bg-neutral-300"
          }`}
          href={route("kuptd.dashboard")}
        >
          Dashboard
        </Link>

        <AccordionItem
          title="Data Input"
          items={laporanItems}
          isRouteActive={isRouteActive}
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

export default KuptdNavigation;
