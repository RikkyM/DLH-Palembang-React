import { createContext, useContext, useState } from "react";

const Context = createContext();

export const GlobalProvider = ({ children }) => {
    // sidebar
    const [isOpen, setIsOpen] = useState(false);

    // dialog
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: "",
        type: null,
        data: null,
    });

    const openModal = (type, data = null) => {
        setModalState({
            isOpen: true,
            type,
            data,
        });
    };

    const closeModal = () => {
        setModalState({
            isOpen: false,
            type: null,
            data: null,
        });
    };

    const toggleSidebar = () => setIsOpen((prev) => !prev);

    return (
        <Context.Provider
            value={{
                isOpen,
                setIsOpen,
                modalState,
                setModalState,
                openModal,
                closeModal,
                toggleSidebar,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useProvider = () => useContext(Context);
