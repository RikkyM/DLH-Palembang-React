const Input = ({
  id,
  value,
  defaultValue,
  onChange,
  type = "text",
  className = "",
  ...rest
}) => {
  const commonProps = {
    id,
    type,
    className: `rounded bg-gray-200 px-3 py-2 outline-none ${className}`,
    ...rest,
  };

  if (type === "file") {
    return <input {...commonProps} onChange={onChange} />;
  }

  return (
    <input
      {...commonProps}
      {...(value !== undefined ? { value, onChange } : { defaultValue })}
      {...rest}
    />
  );
};

export default Input;
