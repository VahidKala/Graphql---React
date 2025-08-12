import openSocket from "socket.io-client";
import "./App.css";
import Nav from "./components/Nav/nav";
import StatusBar from "./components/StatusBar/StatusBar";
import Button from "./components/UI/Button";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Form from "./components/Modals/Form";
import BlurScreen from "./components/Modals/BlurScreen";
import AllPosts from "./components/pages/AllPosts/AllPosts";
import infoCtx from "./context/use-contect";
import LengthError from "./components/Modals/LemgthError";
import { Route, Routes, useNavigate } from "react-router-dom";
import SignupForm from "./components/Modals/SignupForm";
import Error from "./components/Modals/Error";
import Welcome from "./components/pages/Welcome";

let falseAfterShowingItemsAtFirsttime = true;

function App() {
    const [showForm, setShowForm] = useState(false);
    const [listOfItems, setListOfItems] = useState([]);
    const [hideLengthError, setHideLengthError] = useState(false);
    const [details, setDetails] = useState({});
    const [spinner, setSpinner] = useState(false);
    const [spinnerFetch, setSpinnerFetch] = useState(false);
    const [deleteSpinnerState, setDeleteSpinnerState] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPagesState, setTotalPagesState] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errorState, setErrorState] = useState({
        status: false,
        errorMessage: null,
    });

    const navigate = useNavigate();

    const triggerForm = (itemInfo) => {
        setShowForm((prev) => !prev);
        setDetails(itemInfo);
        navigate("/form");
    };

    const removeBlurHandler = () => {
        if (!spinner) {
            setShowForm((prev) => !prev);
            setHideLengthError(false);
            navigate({ pathname: "/", search: `?page=${page}` });
        }
    };

    const removeBlurHandlerFroLiginForm = () => {
        navigate({ pathname: "/", search: `?page=${page}` });
    };

    const allItemsShowsAtFirstLoad = (entry) => {
        const itemsList = entry.map((item) => {
            const date = new Date(item.createdAt);
            return {
                _id: item._id,
                title: item.title,
                creator: item.creator.name,
                imageUrl: item.imageUrl,
                content: item.content,
                createdAt: {
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    day: date.getDay(),
                },
            };
        });

        setListOfItems(itemsList);
    };

    const formInputsHandler = (entry) => {
        if (listOfItems.length === 2) {
            setListOfItems((prev) => [entry, ...prev.slice(0, -1)]);
            return;
        }
        setListOfItems((prev) => [entry, ...prev]);
    };

    const lengthHandler = () => {
        setHideLengthError((prev) => !prev);
    };

    const fetchDataSpinner = (entry) => {
        setSpinnerFetch(entry);
    };

    const getItemsFromServer = () => {
        const graphqlQuery = {
            query: `
                query {getItems(userInputs:{pageNum: ${page}}) {_id, title, content, creator{_id, name}, imageUrl, createdAt, totalPages}}
            `,
        };
        setSpinnerFetch(true);
        fetch(`http://localhost:8080/graphql`, {
            method: "POST",
            body: JSON.stringify(graphqlQuery),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((res) => {
                return res.json();
            })
            .then((dataa) => {
                if (
                    dataa.errors &&
                    dataa.errors[0].message === "Invalid Token!"
                ) {
                    setSpinnerFetch(false);
                    navigate("/");
                    return;
                }

                if (dataa.message === "Invalid Token!") {
                    setSpinnerFetch(false);
                    navigate("/");
                    return;
                }

                if (dataa.data.getItems.length === 0) {
                    setTotalPagesState(0);
                    setSpinnerFetch(false);
                    onLoginFormHandler(true);
                    navigate("/");
                    return;
                }

                if (dataa.errors) {
                    setErrorState({
                        status: dataa.errors[0].statusCode,
                        errorMessage: dataa.errors[0].message,
                    });
                    navigate("/");
                    setSpinnerFetch(false);
                    return;
                }
                setTotalPagesState(dataa.data.getItems[0].totalPages);
                onLoginFormHandler(true);
                navigate({ pathname: "/", search: `?page=${page}` });
                allItemsShowsAtFirstLoad(dataa.data.getItems);
                setSpinnerFetch(false);
            })
            .catch((err) => {
                errorHandeling({
                    status: true,
                    errorMessage: err.message,
                });
                setSpinnerFetch(false);
                console.log(err.message);
            });
    };

    useEffect(() => {
        getItemsFromServer();
    }, [page]);

    useEffect(() => {
        getItemsFromServer();
    }, []);

    const itemDetails = (datails) => {
        setDetails({ ...datails });
    };

    const spinnerHandler = (entry) => {
        setSpinner(entry);
    };

    const editedItemHandler = (editedItem) => {
        console.log(editedItem);
        const editedListItems = listOfItems.map((item) => {
            return item._id === editedItem._id
                ? {
                      ...item,
                      title: editedItem.title,
                      content: editedItem.content,
                  }
                : item;
        });

        setListOfItems(editedListItems);
    };

    const deleteSpinnerHandler = (entry) => {
        if (entry.data) {
            const editedListItems = listOfItems.filter((item) => {
                return item._id !== entry.data._id;
            });

            setListOfItems(editedListItems);
        }
        setDeleteSpinnerState(entry.spin);
    };

    const setPageHandler = (entry) => {
        setPage((prev) => {
            if (entry === "back" && prev > 1) {
                navigate(`?page=${page - 1}`);
                return prev - 1;
            }
            if (entry === "next") {
                navigate(`?page=${page + 1}`);
                return prev + 1;
            }
            if (entry === "page-1") {
                navigate(`?page=${page - 1}`);
                return prev - 1;
            }
            if (entry === "page+1") {
                navigate(`?page=${page + 1}`);
                return prev + 1;
            }
            return prev;
        });
    };

    const onLoginFormHandler = (entry) => {
        setIsLoggedIn(entry);
    };

    const errorHandeling = (entry) => {
        setErrorState({
            status: entry.status,
            errorMessage: entry.errorMessage,
        });
    };

    const emptyWhenLogoutPress = () => {
        setListOfItems([]);
        setTotalPagesState(0);
    };

    const LoginForm = () => {
        return (
            <>
                {createPortal(
                    <SignupForm
                        onClickCancel={removeBlurHandlerFroLiginForm}
                    />,
                    document.getElementById("root-form-modal")
                )}
                {createPortal(
                    <BlurScreen onClick={removeBlurHandlerFroLiginForm} />,
                    document.getElementById("blur-modal")
                )}

                {createPortal(
                    <BlurScreen onClick={removeBlurHandlerFroLiginForm} />,
                    document.getElementById("root")
                )}
            </>
        );
    };

    const ShowSlashPathElements = () => {
        if (!isLoggedIn) {
            return;
        }
        return (
            <>
                <StatusBar />
                {!showForm && !spinner && !spinnerFetch && (
                    <Button onClick={triggerForm} disabled={spinner}>
                        New Post
                    </Button>
                )}
                {listOfItems.length === 0 && !spinnerFetch && (
                    <div>There Is No Item.</div>
                )}
            </>
        );
    };

    return (
        <div className="App">
            <infoCtx.Provider
                value={{
                    formInputsHandler,
                    allItems: listOfItems,
                    lengthHandler,
                    hideLengthError,
                    itemDetails,
                    details,
                    spinnerHandler,
                    spinner,
                    triggerForm,
                    spinnerFetch,
                    fetchDataSpinner,
                    editedItemHandler,
                    deleteSpinnerHandler,
                    page,
                    isLoggedIn,
                    onLoginFormHandler,
                    removeBlurHandlerFroLiginForm,
                    errorHandeling,
                    errorState,
                    getItemsFromServer,
                    emptyWhenLogoutPress,
                }}
            >
                <Nav />
                {!isLoggedIn && <Welcome />}
                <Routes>
                    <Route path="/" element={<ShowSlashPathElements />} />
                    <Route
                        path="/form"
                        element={
                            isLoggedIn && showForm && !hideLengthError
                                ? createPortal(
                                      <Form
                                          onClickCancel={removeBlurHandler}
                                      />,
                                      document.getElementById("root-form-modal")
                                  )
                                : null
                        }
                    />
                    <Route path="/login-form" element={<LoginForm />} />
                </Routes>

                {isLoggedIn &&
                    showForm &&
                    !hideLengthError &&
                    createPortal(
                        <BlurScreen onClick={removeBlurHandler} />,
                        document.getElementById("root")
                    )}
                {spinner &&
                    createPortal(
                        <div className="spinnerParent">
                            <div className="spinner" />
                            <div>Item is sending to server, Please wait...</div>
                        </div>,
                        document.getElementById("spinner-modal")
                    )}
                {spinnerFetch &&
                    createPortal(
                        <div className="spinnerParentFetch">
                            <div className="spinner" />
                            <div>Fetching Data, Please wait...</div>
                        </div>,
                        document.getElementById("spinner-modal")
                    )}
                {spinnerFetch &&
                    createPortal(
                        <BlurScreen onClick={removeBlurHandler} />,
                        document.getElementById("root")
                    )}
                {deleteSpinnerState &&
                    createPortal(
                        <div className="spinnerParentFetch">
                            <div className="spinner" />
                            <div>Deleting Item, Please wait...</div>
                        </div>,
                        document.getElementById("spinner-modal")
                    )}
                {deleteSpinnerState &&
                    createPortal(
                        <BlurScreen />,
                        document.getElementById("blur-modal")
                    )}
                {isLoggedIn && hideLengthError && <LengthError />}
                <AllPosts />
                {isLoggedIn && (
                    <div className="page-number-button">
                        {page > 1 && (
                            <button
                                onClick={() => {
                                    setPageHandler("back");
                                }}
                            >
                                Preview Page
                            </button>
                        )}
                        {page > 1 && (
                            <button
                                onClick={() => {
                                    setPageHandler("page-1");
                                }}
                            >
                                {page - 1}
                            </button>
                        )}
                        {0 < page < totalPagesState && (
                            <button
                                onClick={() => {
                                    setPageHandler("page");
                                }}
                                className="page"
                            >
                                {page}
                            </button>
                        )}
                        {page < totalPagesState && (
                            <button
                                onClick={() => {
                                    setPageHandler("page+1");
                                }}
                            >
                                {page + 1}
                            </button>
                        )}
                        {page < totalPagesState && (
                            <button
                                onClick={() => {
                                    setPageHandler("next");
                                }}
                            >
                                Next Page
                            </button>
                        )}
                        <h2>Total Pages: {totalPagesState}</h2>
                    </div>
                )}
                {errorState.status && <Error />}
            </infoCtx.Provider>
        </div>
    );
}

export default App;
