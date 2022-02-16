
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import { Fragment, useEffect } from "react";

import Home from "./Home";
import Test from "./Test";
import { ApplicationState } from "./store/reducers";
import { IRextActionDefinition, IRextResetActionDefinition, IRextState } from "rext-redux";
import { test1, test2 } from "./rext";
import { getRextState } from "rext-redux";


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
  let navigate = useNavigate();

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
    <>
    <button onClick={() => {
      navigate("/test")
    }}>test</button>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/test" element={<Test/>}/>
    </Routes>
    </>
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
