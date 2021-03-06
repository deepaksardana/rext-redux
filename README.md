#REXT-REDUX

Module created with the help of Redux and Redux-saga. This module will save our time, to write reducer and there actions.

Take a real life example, Let suppose you want to hit and API and want to update there result in store and get the state in the component

So you would required following steps 
1. Create the actions
2. You will create the reducer state
3. Define the API functions
4. Check the reducer action type and update the result accordingly.

And if you have multiple API, You will repeat the steps again and again.

To overcome this situations we have build this package which will save above points.

To connect to server we required token as well as base url, For that create two method in you selector folder

```
export function getBaseUrl (state: any): string {
    return <YOUR BASE URL or if not base url return empty string>;
} 

export function getToken (state: any): string {
    return <YOUR TOKEN or IT CAN HAVE EMPTY STRING ALSO>;
} 
```

Create rext.ts file where you will create the signleton rext object
```
export const test1 = createRext({
    identity: "test1",
    getBaseUrl: getBaseUrl,
    getToken: getToken
});

export const test2 = createRext({
    identity: "test2",
    getBaseUrl: getBaseUrl,
    getToken: getToken
})
```

Now go to root reducer and add rext object

```
import { test1, test2 } from "./rext";

const rootReducer =  combineReducers({
    ...,
    test1State: test1.reducers,
    test2State: test2.reducers,
})

export default rootReducer;
```


Now go to root saga and fork your events

```
import { test1, test2 } from "./rext";

export default function* root(): SagaIterator {
    yield all([
        fork(test1.saga),
        fork(test2.saga),
    ])
};
```

All done from store respective. Now you need to just connect these thing to your functional or class component

```
import { connect } from "react-redux";

import { Fragment, useEffect } from "react";
import { ApplicationState } from "./store/reducers";
import { IRextActionDefinition, IRextResetActionDefinition, IRextState, getRextState } from "rext-redux";
import { test1 } from "./rext";

interface OwnProps {

}

interface StateProps {
  test1RextState: IRextState;
}

interface DispatchProps {
  test1Call: IRextActionDefinition;
}

type Props = OwnProps & StateProps & DispatchProps;

function App(props: Props) {

  useEffect(() => {
    // Dispatching event to get results
    props.test1Call({
      method: "get",
      url: "https://jsonplaceholder.typicode.com/todos/1",
    })
  }, []);

  return (
    <div>Rext Redux</div>
  );
}

const mapStateToProps = (
  state: ApplicationState,
  ownProps: OwnProps
): StateProps => {
  return {
    test1RextState: getRextState(state.test1State, {})   // getRextState function will be used to get data
  };
};

const mapDispatchStateToProps: DispatchProps = {
  test1Call: test1.request
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  mapDispatchStateToProps
)(App);
```

Let check how we can update the requested data

```
import { connect } from "react-redux";

import { Fragment, useEffect } from "react";
import { ApplicationState } from "./store/reducers";
import { IRextActionDefinition, IRextResetActionDefinition, IRextState, getRextState } from "rext-redux";
import { test1, test2 } from "./rext";

interface OwnProps {

}

interface StateProps {
  test1RextState: IRextState;
}

interface DispatchProps {
  test1Call: IRextActionDefinition;
  test2Call: IRextActionDefinition;
  test1UpdateCall: IRextActionDefinition;
  test1ResetUpdate: IRextResetActionDefinition;
}

type Props = OwnProps & StateProps & DispatchProps;

function App(props: Props) {
  const {  isUpdated } = props.test1RextState;

  useEffect(() => {
    props.test1Call({
      method: "get",
      url: "https://jsonplaceholder.typicode.com/todos/1",
    })
    props.test1UpdateCall({
      method: "post",
      url: "https://api.instantwebtools.net/v1/passenger",
      body: {
        "name": "John Doe",
        "trips": 250,
        "airline": 5
    }
    })
  }, []);

  useEffect(() => {
    if(isUpdated) {
      console.log("updatedddd");
      props.test1ResetUpdate();
    }
  }, [isUpdated]);

  return (
    <div>Rext Redux</div>
  );
}

const mapStateToProps = (
  state: ApplicationState,
  ownProps: OwnProps
): StateProps => {
  console.log(state);
  return {
    test1RextState: getRextState(state.test1State, {})
  };
};

const mapDispatchStateToProps: DispatchProps = {
  test1Call: test1.request,
  test2Call: test2.request,
  test1UpdateCall: test1.update,
  test1ResetUpdate: test1.resetUpdate
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  mapDispatchStateToProps
)(App);

```


If you want to send url and query parma you can do like this

```
props.test1Call({
    method: "get",
    url: "https://jsonplaceholder.typicode.com/todos/1",
    queryParams: {
    test: "123",
    test1: "abcd"
    }
})
```

If you want to add url params you can do like this
```
props.test1Call({
    method: "get",
    url: "https://jsonplaceholder.typicode.com/todos/:todosID",
    urlParams: {
    todosID: "1"
    }
})
```


getRextState return following this

```
{
    params: IRextParams; // Params will dispatching the events
    fetching?: boolean; // true when request or update request is in process, otherwise false
    isUpdated?: boolean; // true when update request is completed
    resources: any; // any value you want after request is completed
    data: any; // response
    error: boolean; // true if request or update api call returns error
    message: string; // error or success message.
}
```


