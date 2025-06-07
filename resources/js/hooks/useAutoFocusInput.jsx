import { useEffect, useRef } from "react";

export default function useAutoFocusInput(isOpen, shouldSelect = false) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    if (shouldSelect) {
                        inputRef.current.select();
                    }
                }
            }, 300);
        }
    }, [isOpen, shouldSelect]);

    return inputRef;
}
