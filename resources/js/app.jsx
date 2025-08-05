import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { GlobalProvider } from "./Context/GlobalContext";
import '../css/app.css';

createInertiaApp({
    progress: false,
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <GlobalProvider>
                <App {...props} />
            </GlobalProvider>
        );
    },
});
