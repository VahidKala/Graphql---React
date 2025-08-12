import { useContext } from "react";
import SinglePost from "../Single Post/SinglePost";
import classes from "./AllPosts.module.css";
import infoCtx from "../../../context/use-contect";

const AllPosts = () => {
    const ctx = useContext(infoCtx);

    if (!ctx.isLoggedIn) {
        return;
    }

    return (
        <ul className={classes.AllPosts}>
            <SinglePost />
        </ul>
    );
};

export default AllPosts;
