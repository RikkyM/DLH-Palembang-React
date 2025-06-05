import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";

const AccordionItem = ({ title, items, isRouteActive }) => {
    const hasActiveItem = items.some(
        (item) => item.route && isRouteActive(item.route)
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
                className="w-full flex justify-between items-center px-3 py-2 hover:bg-neutral-200 transition-all duration-300 rounded outline-none"
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
                    <ul className="p-3 ml-0.5 pl-3 space-y-1.5 border-l border-neutral-400 text-sm">
                        {items.map((item, index) => (
                            <li key={index}>
                                <Link
                                    href={item.route ? route(item.route) : "#"}
                                    className={`inline-block w-full p-2 rounded transition-all duration-300 ${
                                        item.route && isRouteActive(item.route)
                                            ? "bg-[#ECF6EE]"
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
