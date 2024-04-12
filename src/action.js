// actions.js
export const setFetchedDataLength = (length) => {
    return {
        type: 'SET_FETCHED_DATA_LENGTH',
        payload: length
    };
};


export const storeFetchedData = (data) => {
    return {
        type: 'NEW_DATA',
        payload: data
    };
}


export const storeUserPermissions = (data) => {
    return {
        type: 'PERMISSIONS',
        payload: data
    };
}