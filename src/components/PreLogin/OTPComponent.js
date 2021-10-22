import React, { Component } from "react";
import OtpInput from "react-otp-input";
import {
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";

import AyekartHisabLogo from "../../assets/AyekartHisabLogo.png";

class OTPComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: "",
      timer: 60,
    };
  }

  handleOTPChange = (otp) => {
    this.setState({
      otp: otp,
    });
  };

  componentDidMount() {
    this.countDown = setInterval(() => {
      this.setState({
        timer: this.state.timer - 1,
      });
    }, 1000);
  }
  render() {
    return (
      <React.Fragment>
        <div className="LoginMainDiv">
          <Container>
            <div className="LoginLogoDiv">
              <img
                src={AyekartHisabLogo}
                className="img-fluid"
                style={{ width: "280px" }}
              />
            </div>
            <div className="LoginContentDiv ">
              <h6>Enter 6 digit OTP</h6>
              <br />
              <div
                style={{ textAlign: "center" }}
                className="d-flex justify-content-center"
              >
                <Form>
                  <OtpInput
                    value={this.state.otp}
                    onChange={this.handleOTPChange}
                    numInputs={6}
                    separator={<span> </span>}
                    shouldAutoFocus
                    isInputSecure
                    inputStyle={{ width: "50px", margin: "10px" }}
                  />
                  <p style={{ fontSize: "12px", textAlign: "left" }}>
                    OTP has been sent to 1234567890
                  </p>
                  <p style={{ fontSize: "12px", textAlign: "left" }}>
                    Haven't received your OTP yet?
                    <span style={{ float: "right" }}>
                      Wait {this.state.timer + "s"}
                    </span>
                  </p>
                  <div
                    className="HomeBlueButtonSmall"
                    style={{ margin: "6px", marginTop: "40px" }}
                  >
                    <h6>Re-Send OTP on SMS</h6>
                  </div>
                  <h6 style={{marginTop: "20px"}}>Use different mobile number</h6>
                </Form>
              </div>
            </div>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default OTPComponent;
