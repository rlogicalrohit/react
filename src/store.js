import { createStore, compose } from 'redux';
import rootReducer from './reducer'; // Import your combined reducers here

// Redux DevTools setup
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create the store with combined reducers and middleware
const store = createStore(
    rootReducer, // Combined reducers
    composeEnhancers(
    )
);

export default store;
