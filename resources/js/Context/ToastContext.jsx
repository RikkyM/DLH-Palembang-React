import { createContext, useCallback, useContext, useState } from "react";
import Toast from "../Components/Toast";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    id: 0,
  });

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  //   const handleDone = () => {
  //     setToast((t) => ({ ...t, message: "" }));
  //   };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.message && (
        <Toast
        key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={3500}
          onDone={() => setToast((t) => ({ ...t, message: "" }))}
        />
      )}
      {/* <Toast message={toast.message} type={toast.type} /> */}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
