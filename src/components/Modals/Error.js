import { useContext } from "react";
import classes from "./Error.module.css";
import infoCtx from "../../context/use-contect";
import Button from "../UI/Button";

const Error = () => {
    const ctx = useContext(infoCtx);

    const removeErrorModal = () => {
        ctx.errorHandeling({ status: false, errorMessage: null });
    };

    return (
        <div className={classes.error}>
            <h2>{ctx.errorState.errorMessage}</h2>
            <Button onClick={removeErrorModal}>Exit</Button>
        </div>
    );
};

export default Error;
