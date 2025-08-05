const Input = ({
    id,
    value,
    defaultValue,
    onChange,
    type = "text",
    className = "",
    ...rest
}) => {
    return (
        <input
            id={id}
            type={type}
            autoComplete="off"
            className={`px-3 py-2 bg-gray-200 outline-none rounded ${className}`}
            {...(value !== undefined ? { value, onChange } : { defaultValue })}
            {...rest}
        />
    );
};

export default Input;
