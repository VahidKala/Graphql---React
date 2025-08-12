import classes from "./Button.module.css";

const Button = (props) => {
    const className = props.className || classes.butt;
    return (
        <button
            type={props.type || "button"}
            className={className}
            onClick={props.onClick}
            disabled={props.disabled || false}
        >
            {props.children}
        </button>
    );
};

export default Button;
