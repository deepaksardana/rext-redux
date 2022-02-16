import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import { createBrowserHistory } from 'history';
import createSagaMiddleware from 'redux-saga';

import createRootReducer from "./reducers";
import rootSaga from "./saga";

export const history =  createBrowserHistory();

export default function configureStore(initialState) {
  // create the composing function for our middlewares
  const composeEnhancers = composeWithDevTools({})
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    createRootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(
        sagaMiddleware
      )
    )
  );
  sagaMiddleware.run(rootSaga);
  return store
}


