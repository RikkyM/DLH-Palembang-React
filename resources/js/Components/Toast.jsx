import { Check, TriangleAlert, X } from "lucide-react";
import { useEffect, useState } from "react";

const Toast = ({ message, type = "success", duration = 3500, onDone }) => {
  const [visible, setVisible] = useState(false);

  const defaultClass =
    "absolute w-max rounded-md bg-white px-3 py-3 text-xs text-black transition-all duration-[.3s] shadow-sm border border-gray-300 font-medium flex gap-1 items-center";
  const smallWidth = `left-1/2 -translate-x-1/2 ${visible ? "bottom-3" : "bottom-0 opacity-0"}`;
  const mediumWidth = `md:bottom-5 md:left-auto md:translate-x-0 md:text-sm ${visible ? "md:right-5" : "md:right-0 opacity-0"}`;

  const Icon =
    type === "success" ? Check : type === "error" ? X : TriangleAlert;

  const iconClass =
    type === "success"
      ? "text-green-500"
      : type === "error"
        ? "text-red-500"
        : "text-yellow-500";

  // const typeClass =
  //   type === "success"
  //     ? "bg-white"
  //     : type === "error"
  //       ? "bg-red-500"
  //       : "bg-gray-500";

  useEffect(() => {
    if (!message) return;

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);

      const clearTimer = setTimeout(() => onDone?.(), 300);
      return () => clearTimeout(clearTimer);
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDone]);

  if (!message) return null;

  return (
    <div className={`${defaultClass} ${smallWidth} ${mediumWidth}`}>
      <Icon className={`${iconClass} size-5`} /> {message}
    </div>
  );
};

export default Toast;
