const Label = ({ htmlFor, children, className = "" }) => {
    return <label htmlFor={htmlFor}>{children}</label>;
};

export default Label;
