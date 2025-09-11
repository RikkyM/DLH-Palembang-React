import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "@inertiajs/react";

const AccordionItem = ({ title, items, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    if (defaultOpen) {
      setIsOpen(true);
    }
  }, [defaultOpen]);

  const handleToggle = () => setIsOpen((prev) => !prev);

  // 🔹 fungsi general untuk cek apakah item sedang aktif
  const isItemActive = (item) => {
    if (Array.isArray(item.activeRoute)) {
      return item.activeRoute.some((r) => {
        // fleksibel: cek kalau route edit wajib retribusi apapun role-nya
        if (r.endsWith(".wajib-retribusi.edit")) {
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

    if (item.activeRoute) {
      return route().current(item.activeRoute);
    }

    if (item.route) {
      return route().current(item.route);
    }

    return false;
  };

  return (
    <div>
      <button
        onClick={handleToggle}
        className="flex w-full items-center justify-between rounded px-3 py-2 outline-none transition-all duration-300 hover:bg-neutral-200 text-nowrap"
      >
        <span>{title}</span>
        <ChevronDown
          size={18}
          className={`transition-all duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out text-nowrap ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="pl-3">
          <ul className="ml-0.5 space-y-1.5 border-l border-neutral-400 p-3 text-sm">
            {items.map((item, index) => (
              <li key={index}>
                {item.route ? (
                  <Link
                    href={route(item.route)}
                    className={`inline-block w-full rounded p-2 transition-all duration-300 ${
                      isItemActive(item)
                        ? "bg-[#B3CEAF] font-medium text-white"
                        : "hover:bg-neutral-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="inline-block w-full rounded p-2 text-neutral-500">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
