import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import session from './session'
import expensesReducer from './expense'
import groupsReducer from './group'
import commentsReducer from './comment'
import usersReducer from "./user"
import friendsReducer from "./friend"
import imagesReducer from "./image"

const rootReducer = combineReducers({
  session,
  expenses: expensesReducer,
  groups: groupsReducer,
  comments: commentsReducer,
  users: usersReducer,
  friends: friendsReducer,
  images: imagesReducer
});


let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
