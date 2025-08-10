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
      className={`rounded bg-gray-200 px-3 py-2 outline-none ${className}`}
      {...(value !== undefined ? { value, onChange } : { defaultValue })}
      {...rest}
    />
  );
};

export default Input;
