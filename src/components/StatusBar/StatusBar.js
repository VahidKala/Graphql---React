import { useContext } from "react";
import classes from "./StausBar.module.css";
import infoCtx from "../../context/use-contect";

const StatusBar = () => {
    const ctx = useContext(infoCtx);

    if (!ctx.isLoggedIn) {
        return;
    }
    const formHandler = (event) => {
        event.preventDefault();
    };

    return (
        <form onSubmit={formHandler}>
            <input className={classes.statusForm} placeholder="Your Status" />
            <button type="submit" className={classes.updateButt}>
                UPDATE
            </button>
        </form>
    );
};

export default StatusBar;
