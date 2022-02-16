import { applyMiddleware, createStore, Store } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import { History, createBrowserHistory } from 'history';
import createSagaMiddleware from 'redux-saga';

import createRootReducer, { ApplicationState } from "./reducers";
import rootSaga from "./saga";

export const history: History = createBrowserHistory();

export default function configureStore(initialState: object): Store<ApplicationState> {
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


