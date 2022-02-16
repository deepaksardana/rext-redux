import { connect } from "react-redux";

import { useEffect } from "react";
import { test1, test2 } from "./rext";
import { getRextState } from "rext-redux";

function App(props) {

  const {  isUpdated } = props.test1RextState;

  useEffect(() => {
    // props.test1Call({
    //   method: "get",
    //   url: "https://jsonplaceholder.typicode.com/todos/1",
    //   urlParams: {
    //     test: "123",
    //     test1: "abcd"
    //   }
    // })
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
    <div>Helloo</div>
  );
}

const mapStateToProps = (
  state,
  ownProps
) => {
  console.log(state);
  return {
    test1RextState: getRextState(state.test1State, {})
  };
};

const mapDispatchStateToProps = {
  test1Call: test1.request,
  test2Call: test2.request,
  test1UpdateCall: test1.update,
  test1ResetUpdate: test1.resetUpdate
};

export default connect(
  mapStateToProps,
  mapDispatchStateToProps
)(App);
