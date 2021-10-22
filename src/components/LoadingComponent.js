import { Backdrop, CircularProgress } from "@material-ui/core";
import React, { Component } from "react";

class LoadingComponent extends Component {
  render() {
    return (
      <React.Fragment>
        <Backdrop open={true}>
          <CircularProgress />
        </Backdrop>
      </React.Fragment>
    );
  }
}

export default LoadingComponent;
