import { useEffect } from "react";

const Dialog = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    return (
        <div
            onClick={onClose}
            className={`transition-all duration-300 ${
                isOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
            }   absolute inset-0 z-20 bg-black/30 flex justify-center items-center p-4 min-h-screen`}
        >
            {children}
        </div>
    );
};

export default Dialog;
