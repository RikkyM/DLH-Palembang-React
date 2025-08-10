const FormInput = ({ children, className = null }) => {
  return (
    <div className={`flex flex-col gap-1.5 text-sm ${className}`}>
      {children}
    </div>
  );
};

export default FormInput;
