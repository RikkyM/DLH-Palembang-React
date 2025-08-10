import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";

const AccordionItem = ({ title, items, isRouteActive }) => {
  const { url } = usePage();

  const isRouteActiveIgnoreQuery = (routeName, activeRoute = null) => {
    if (!routeName) return false;

    try {
      // Jika ada activeRoute (wildcard pattern), gunakan itu untuk pengecekan
      const routeToCheck = activeRoute || routeName;

      // Jika menggunakan wildcard pattern (mengandung *)
      if (routeToCheck.includes("*")) {
        const pattern = routeToCheck.replace("*", "");
        const currentRouteName = route().current();

        // Cek apakah current route dimulai dengan pattern
        return currentRouteName && currentRouteName.startsWith(pattern);
      }

      // Untuk route normal tanpa wildcard
      const routeUrl = route(routeName);
      const currentPathname = new URL(url, window.location.origin).pathname;
      const routePathname = new URL(routeUrl, window.location.origin).pathname;

      return currentPathname === routePathname;
    } catch (error) {
      return isRouteActive ? isRouteActive(routeName) : false;
    }
  };

  const hasActiveItem = items.some(
    (item) =>
      item.route && isRouteActiveIgnoreQuery(item.route, item.activeRoute),
  );

  const [isOpen, setIsOpen] = useState(hasActiveItem);
  const [wasManuallyToggled, setWasManuallyToggled] = useState(false);

  useEffect(() => {
    if (hasActiveItem && !isOpen && !wasManuallyToggled) {
      setIsOpen(true);
    }

    if (!hasActiveItem) {
      setWasManuallyToggled(false);
    }
  }, [hasActiveItem, isOpen, wasManuallyToggled]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setWasManuallyToggled(true);
  };

  return (
    <div>
      <button
        onClick={handleToggle}
        className="flex w-full items-center justify-between rounded px-3 py-2 outline-none transition-all duration-300 hover:bg-neutral-200"
      >
        <span>{title}</span>
        <ChevronDown
          size={18}
          className={`transition-all duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="pl-3">
          <ul className="ml-0.5 space-y-1.5 border-l border-neutral-400 p-3 pl-3 text-sm">
            {items.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.route ? route(item.route) : "#"}
                  className={`inline-block w-full rounded p-2 transition-all duration-300 ${
                    item.route &&
                    isRouteActiveIgnoreQuery(item.route, item.activeRoute)
                      ? "bg-teal-400 font-medium text-white"
                      : "hover:bg-neutral-100"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
