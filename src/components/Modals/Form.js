import classes from "./Form.module.css";
import Button from "../UI/Button";
import { useContext, useEffect, useRef, useState } from "react";
import infoCtx from "../../context/use-contect";
import { useNavigate } from "react-router-dom";

const Form = (props) => {
    const title = useRef();
    const img = useRef();
    const content = useRef();
    const ctx = useContext(infoCtx);
    const [titleValue, setTitleValue] = useState(
        (ctx.details && ctx.details.title) || ""
    );
    const [contentValue, setContentValue] = useState(
        (ctx.details && ctx.details.content) || ""
    );
    const [showLengthError, setShowLengthError] = useState(false);

    const navigate = useNavigate();

    const postDataToServerHandler = async (event) => {
        event.preventDefault();

        if (
            title.current.value.trim().length <= 4 ||
            content.current.value.trim().length <= 4
        ) {
            setShowLengthError(true);
        }
        if (
            title.current.value.trim().length > 4 ||
            content.current.value.trim().length > 4
        ) {
            setShowLengthError(false);
        }

        ctx.spinnerHandler(true);

        const titleValue = title.current.value;
        const contentValue = title.current.value;

        const formData = new FormData();

        formData.append("imageUrl", img.current.files[0]);

        const imagePath = await fetch("http://localhost:8080/post-image", {
            method: "PUT",
            body: formData,
            credentials: "include",
        })
            .then((res) => {
                return res.json();
            })
            .then((imagePathh) => {
                return imagePathh.filePath;
            })
            .catch((err) => {
                console.log(err);
            });

        const safeImagePath = imagePath.replace(/\\/g, "\\\\");

        const graphqlQuery = {
            query: `
                    mutation { postItems(postInputs:{title:"${titleValue}", content:"${contentValue}", imageUrl:"${safeImagePath}"}) {title, content, creator{_id, name}}}
            `,
        };

        fetch(`http://localhost:8080/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(graphqlQuery),
            credentials: "include",
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.errors) {
                    ctx.errorHandeling({
                        status: data.errors[0].statusCode,
                        errorMessage: data.errors[0].message,
                    });
                    navigate("/");
                    ctx.fetchDataSpinner(false);
                    return;
                }
                ctx.itemDetails({
                    title: data.data.postItems.title,
                    content: data.data.postItems.content,
                    imageUrl: imagePath,
                });
                ctx.spinnerHandler(false);
                ctx.getItemsFromServer();
                props.onClickCancel();
            })
            .catch((err) => {
                ctx.spinnerHandler(false);
                ctx.triggerForm();
                console.log(err.message);
            });
    };

    useEffect(() => {
        ctx.lengthHandler();
    }, [showLengthError]);

    const editDataHandler = async (event) => {
        event.preventDefault();

        ctx.spinnerHandler(true);

        const titlee = title.current.value;
        const contentt = content.current.value;

        let safeImagePath;
        let graphqlQuery;
        
        if (img.current && img.current.files[0]) { 
            const formData = new FormData();

            formData.append("imageUrl", img.current.files[0]);

            const imagePath = await fetch("http://localhost:8080/post-image", {
                method: "PUT",
                body: formData,
                credentials: "include",
            })
                .then((res) => {
                    return res.json();
                })
                .then((imagePathh) => {
                    return imagePathh.filePath;
                })
                .catch((err) => {
                    console.log(err);
                });

            safeImagePath = imagePath.replace(/\\/g, "\\\\");
            graphqlQuery = {
                query: `
                    mutation { editItem(userInputs:{postId: "${ctx.details._id}",  title: "${titlee}", content: "${contentt}", imageUrl:"${safeImagePath}" }) { title, content, imageUrl }}
                `,
            };
        } else {
            graphqlQuery = {
                query: `
                    mutation { editItem(userInputs:{postId: "${ctx.details._id}", title: "${titlee}", content: "${contentt}"}) { title, content, imageUrl }}
                `,
            };
        }
        fetch(`http://localhost:8080/graphql`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
            },
            body: JSON.stringify(graphqlQuery),
            credentials: "include",
        })
            .then((res) => {
                return res.json();
            })
            .then((response) => {
                ctx.getItemsFromServer();
                ctx.spinnerHandler(false);
                props.onClickCancel();
                ctx.editedItemHandler(response.data.editItem);
                return;
            })
            .catch((err) => {
                ctx.spinnerHandler(false);
                console.log(err);
            });
    };

    return (
        <form
            className={classes.form}
            onSubmit={
                ctx.details && ctx.details.title
                    ? editDataHandler
                    : postDataToServerHandler
            }
        >
            <label>Title</label>
            <input
                type="text"
                ref={title}
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
            />
            <br />
            <label>Image</label>
            <input type="file" ref={img} name="img" />
            <label>Please choose an image</label>
            <br />
            <label>Content</label>
            <textarea
                rows={8}
                ref={content}
                value={contentValue}
                onChange={(e) => setContentValue(e.target.value)}
            />
            <br />
            <div>
                <Button onClick={props.onClickCancel} disabled={ctx.spinner}>
                    Cancel
                </Button>
                <Button type="submit" disabled={ctx.spinner}>
                    {ctx.details && ctx.details.title ? "Edit" : "Accept"}
                </Button>
            </div>
        </form>
    );
};

export default Form;
