import { Link, usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import AccordionItem from "@/Components/AccordionItem";
import Calendar from "react-calendar";

const BendaharaNavigation = () => {
  const { props } = usePage();
  const { auth, inbox } = props[0];

  const inboxItems = [
    {
      label: "Inbox Selesai (SPKRD)",
      route: "bendahara.skrd.index",
      activeRoute: "bendahara.skrd.*",
    },
  ];

  // const tagihanItems = [
  //   {
  //     label: "Data Surat Tagihan",
  //     route: "bendahara.surat-tagihan.index",
  //   },
  // ];

  const penerimaanItems = [
    {
      label: "Data Setoran",
      route: "bendahara.data-setoran.index",
      activeRoute: [
        "bendahara.data-setoran.index",
        "bendahara.data-setoran.show",
      ],
    },
  ];

  const isAccordionActive = (items) =>
    items.some((item) => {
      if (item.activeRoute) {
        if (Array.isArray(item.activeRoute)) {
          return item.activeRoute.some((r) => {
            if (r === "bendahara.wajib-retribusi.edit") {
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
            route().current("bendahara.dashboard")
              ? "bg-[#B3CEAF] font-medium text-white"
              : "bg-transparent hover:bg-neutral-300"
          }`}
          href={route("bendahara.dashboard")}
        >
          Dashboard
        </Link>

        <AccordionItem
          title="Inbox Data"
          items={inboxItems}
          defaultOpen={isAccordionActive(inboxItems)}
        />
        {/* <AccordionItem
          title="Tagihan"
          items={tagihanItems}
          defaultOpen={isAccordionActive(tagihanItems)}
        /> */}
        <Link
          className={`block rounded px-3 py-2 transition-all duration-300 ${
            route().current("bendahara.surat-tagihan.index")
              ? "bg-[#B3CEAF] font-medium text-white"
              : "bg-transparent hover:bg-neutral-300"
          }`}
          href={route("bendahara.surat-tagihan.index")}
        >
          Surat Tagihan
        </Link>
        <AccordionItem
          title="Penerimaan"
          items={penerimaanItems}
          defaultOpen={isAccordionActive(penerimaanItems)}
        />

        <div className="py-3">
          <Calendar />
        </div>
      </div>
    </Sidebar>
  );
};

export default BendaharaNavigation;
