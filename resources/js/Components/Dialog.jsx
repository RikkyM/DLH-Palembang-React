import { useEffect, useRef } from "react";

const Dialog = ({ isOpen, onClose, children }) => {
  const overlayRef = useRef(null);
  const mouseDownRef = useRef(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  const handleMouseDown = (e) => {
    mouseDownRef.current = e.target !== overlayRef.current;
  };

  const handleClick = (e) => {
    if (e.target === overlayRef.current && !mouseDownRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      // onClick={onClose}
      className={`transition-all duration-300 ${
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      } absolute inset-0 z-50 flex min-h-screen items-center justify-center bg-black/30 p-4`}
    >
      {children}
    </div>
  );
};

export default Dialog;
