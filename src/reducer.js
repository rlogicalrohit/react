// reducers.js
const initialState = {
    fetchedDataLength: 0
};

const rootReducer = (state = initialState, action) => {
    console.log("called REDUCER", action);
    switch (action.type) {
        case 'SET_FETCHED_DATA_LENGTH':
            return {
                ...state,
                fetchedDataLength: action.payload
            };
        case 'NEW_DATA':
            return {
                ...state,
                allProducts: action.payload
            };

        case 'PERMISSIONS':
            return {
                ...state,
                permissions: action.payload
            };
        case 'CART':
            return {
                ...state,
                cart: action.payload
            };
        default:
            return state;
    }
};

export default rootReducer;
