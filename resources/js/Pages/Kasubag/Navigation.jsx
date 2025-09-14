import { Link } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import AccordionItem from "@/Components/AccordionItem";
import Calendar from "react-calendar";

const KasubagNavigation = () => {

//   const permohonanItems = [
//     {
//       label: "Pemohon",
//       route: "kasubag.pemohon.index",
//     },
//     {
//       label: "Wajib Retribusi",
//       route: "kasubag.wajib-retribusi.index",
//       activeRoute: [
//         "kasubag.wajib-retribusi.index",
//         "kasubag.wajib-retribusi.create",
//       ],
//     },
//   ];

//   const inboxItems = [
//     {
//       label: "Inbox Diterima",
//       route: "kasubag.wajib-retribusi.diterima",
//       activeRoute: [
//         "kasubag.wajib-retribusi.diterima",
//         "kasubag.wajib-retribusi.edit",
//       ],
//     },
//     {
//       label: "Inbox Diproses",
//       route: "kasubag.wajib-retribusi.diproses",
//     },
//     {
//       label: "Inbox Ditolak",
//       route: "kasubag.wajib-retribusi.ditolak",
//       activeRoute: [
//         "kasubag.wajib-retribusi.ditolak",
//         "kasubag.wajib-retribusi.edit",
//       ],
//     },
//     {
//       label: "Inbox Selesai (SPKRD)",
//       route: "kasubag.skrd.index",
//       activeRoute: "kasubag.skrd.*",
//     },
//   ];

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
            if (r === "kasubag.wajib-retribusi.edit") {
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
            route().current("kasubag.dashboard")
              ? "bg-[#B3CEAF] font-medium text-white"
              : "bg-transparent hover:bg-neutral-300"
          }`}
          href={route("kasubag.dashboard")}
        >
          Dashboard
        </Link>

        {/* <AccordionItem
          title="Permohonan"
          items={permohonanItems}
          defaultOpen={isAccordionActive(permohonanItems)}
        />
        <AccordionItem
          title="Inbox Data"
          items={inboxItems}
          defaultOpen={isAccordionActive(inboxItems)}
        /> */}

        <div className="py-3">
          <Calendar />
        </div>
        
      </div>
    </Sidebar>
  );
};

export default KasubagNavigation;
