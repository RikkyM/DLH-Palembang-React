import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { GlobalProvider } from "./Context/GlobalContext";
import "../css/app.css";
import "react-calendar/dist/Calendar.css";
import { ToastProvider } from "./Context/ToastContext";

createInertiaApp({
  progress: false,
  resolve: (name) => {
    const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
    return pages[`./Pages/${name}.jsx`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <GlobalProvider>
        <ToastProvider>
          <App {...props} />
        </ToastProvider>
      </GlobalProvider>,
    );
  },
}).then(() => {
  document.getElementById("app").removeAttribute("data-page");
});
