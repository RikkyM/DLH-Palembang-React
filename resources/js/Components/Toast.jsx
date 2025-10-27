import { useEffect, useState } from "react";

const Toast = ({ message, type = "success", duration = 3500, onDone }) => {
  const [visible, setVisible] = useState(false);

  const smallWidth = `left-1/2 -translate-x-1/2 ${visible ? "bottom-3" : "bottom-0 opacity-0"}`;
  const mediumWidth = `md:bottom-5 md:left-auto md:translate-x-0 ${visible ? "md:right-5" : "md:right-0 opacity-0"}`;

  const typeClass =
    type === "success"
      ? "bg-green-500"
      : type === "error"
        ? "bg-red-500"
        : "bg-gray-500";

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
    <div
      className={`${smallWidth} ${mediumWidth} ${typeClass} absolute w-max rounded bg-green-500 p-2.5 text-xs font-semibold text-white transition-all duration-[.3s] md:text-sm`}
    >
      {message}
    </div>
  );
};

export default Toast;
