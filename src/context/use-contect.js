import react from "react";

const infoCtx = react.createContext({
    title: "",
    image: "",
    content: "",
    author: "",
    formInputsHandler: () => {},
    createdAt: Date(),
    allItems: [],
    lengthHandler: () => {},
    hideLengthError: false,
    itemDetails: () => {},
    details: {},
    spinnerHandler: () => {},
    spinner: false,
    triggerForm: () => {},
    fetchDataSpinner: () => {},
    spinnerFetch: false,
    editedItemHandler: () => {},
    deleteSpinnerHandler: () => {},
    setPageHandler: () => {},
    page: Number,
    isLoggedIn: false,
    onLoginFormHandler: () => {},
    removeBlurHandlerFroLiginForm: () => {},
    errorHandeling: () => {},
    errorState: { status: false, errorMessage: null },
    getItemsFromServer: () => {},
    emptyWhenLogoutPress: () => {},
});

export default infoCtx;
