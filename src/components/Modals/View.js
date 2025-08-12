import classes from "./View.module.css";
import Button from "../UI/Button";
import { useContext } from "react";
import infoCtx from "../../context/use-contect";
import { useNavigate } from "react-router-dom";

const View = (props) => {
    const ctx = useContext(infoCtx);
    const navigate = useNavigate();

    if (Object.keys(ctx.details).length === 0) {
        return;
    }
    if (!ctx.isLoggedIn) {
        return;
    }

    const hideViewHandler = () => {
        props.hideView(false);
        ctx.itemDetails({});

        navigate("/");
    };

    const fixedImageUrl = ctx.details.imageUrl.replace(/\\/g, "/");
    return (
        <section className={classes.view}>
            <div className={classes.outerDiv}>
                <div className={classes.innerDiv}>{ctx.details.title}</div>
                <div className={classes.innerDiv}>{ctx.details.content}</div>
                <img
                    src={`http://localhost:8080/${fixedImageUrl}`}
                    alt="viewImage"
                />
                <Button onClick={hideViewHandler}>Ok</Button>
            </div>
        </section>
    );
};

export default View;
