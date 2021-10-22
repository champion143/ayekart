import React, { Component } from "react";
import {
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";

import AyekartHisabLogo from "../../assets/AyekartHisabLogo.png";
import unauthorizedIcon from "../../assets/unauthorized.png";

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from "firebase/app";
import { Link } from "react-router-dom";

import * as firebaseui from "firebaseui";
import firebaseConfig from "../../firebaseConfig";
import {
  Backdrop,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import OtpInput from "react-otp-input";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "universal-cookie/es6";
import { APIURL } from "../constants/APIURL";
import { validateLogin } from "../constants/functions";
import { get, set } from "idb-keyval";

import LoaderGif from "../../assets/loader.gif";

import LangConvertComponent from "../LangConvertComponent";

var axios = require("axios");

const queryString = require("query-string");

class LoginComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNumber: "",
      otp: "",
      timer: 60,
      confirmResult: [],
      OTPDialogOpen: false,
      isLoading: false,
      cookies: new Cookies(),

      finoUnAuthorizedDialogOpen: false,
      finoLoading: true,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  checkUserRegisteredForPassword = () => {
      //Check if email adress registerd then password security
      firebase.auth().fetchSignInMethodsForEmail(this.state.mobileNumber+'@example.com')
        .then((signInMethods) => {
          if (signInMethods.length) {
            this.state.cookies.set("isUserAccountExist", true);
          } else {
            this.state.cookies.set("isUserAccountExist", false);
          }
          this.state.cookies.set("mobileNumber", this.state.mobileNumber);
          window.location.href = "/loginwithpassword";
        })
        .catch((error) => {
          // Some error occurred.
        });
  };
  checkUserRegistered = () => {
    // const parsed = queryString.parse(window.location.search);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(APIURL + "/user/me?uid=" + this.state.mobileNumber, requestOptions)
      .then((response) => {
        console.log("response");
        console.log(response);
        if (!response.ok) {
          throw Error("It is 409 error");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        this.state.cookies.set("userInfo", result.data);
        window.location.href = "/home";
      })
      .catch((error) => {
        console.log("errdddor", error);
        this.state.cookies.set("mobileNumber", this.state.mobileNumber);
        window.location.href = "/signup";
      });
  };

  handleBackDropOpen = () => {
    this.setState({
      isLoading: true,
    });
  };
  handleBackDropClose = () => {
    this.setState({
      isLoading: false,
    });
  };

  handleOTPChange = (otp) => {
    this.setState({
      otp: otp,
    });
    if (otp.length === 6) {
      toast("Verifying OTP", {
        autoClose: 500,
      });
      this.firebaseSigninCall(otp);
    }
  };

  firebaseSigninCall = (otp) => {
    this.state.confirmResult
      .confirm(otp)
      .then((result) => {
        console.log("login response");
        console.log(result);
        // User signed in successfully.
        const user = result.user;
        console.log(user);
        toast.dismiss();
        toast.success("Login Success");
        this.handleDialogClose();
        this.handleBackDropOpen();
        this.checkUserRegistered();
        // ...
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        // ...
        console.log(error);
        toast.error("Incorrect OTP");
      });
  };

  handleDialogOpen = () => {
    this.setState({
      OTPDialogOpen: true,
    });
    this.countDown = setInterval(() => {
      if (this.state.timer > 0) {
        this.setState({
          timer: this.state.timer - 1,
        });
      }
      if (this.state.timer === 0) {
        this.setState({
          timer: 0,
        });
      }
    }, 1000);
  };

  handleDialogClose = () => {
    this.setState({
      OTPDialogOpen: false,
    });
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.loginSubmit();
  };
  componentDidMount() {
    validateLogin
      .then((res) => {
        get("lang").then((val) => {
          if (val === undefined) {
            set("lang", "en")
              .then((val) => {})
              .catch((err) => {});
          }

          var parsed = queryString.parse(window.location.search);
          if (parsed.AHVALID === undefined) {
          } else {
            // var user = result.data.ID;
            this.setState({
              finoUnAuthorizedDialogOpen: true,
              // finoLoading: false,
            });
  
            var AHVALIDSTR = parsed.AHVALID;
            var replaced = AHVALIDSTR.split(" ").join("+");
            // var header = parsed.AHHEADER.split(" ").join("+");
            // console.log(header);
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            // myHeaders.append("Access-Control-Allow-Origin", "*");
            // myHeaders.append("Authentication", header);
            var requestOptions = {
              method: "POST",
              // headers: myHeaders,
              body: JSON.stringify({
                AHVALID: replaced,
              }),
              redirect: "follow",
            };
  
            fetch(APIURL + "/user/fino", requestOptions)
              .then((response) => {
                console.log(response.status);
                if (!response.ok) {
                  throw Error("It is 409 error");
                }
                return response.json();
              })
              .then((result) => {
                console.log(result);
                new Cookies().set("userInfo", result.data.user);
                window.location.href = "/home";
              })
              .catch((error) => {
                console.log("errdddor", error);
                // toast.error("401 status code returned");
                this.setState({
                  finoUnAuthorizedDialogOpen: true,
                  finoLoading: false,
                });
  
                // this.state.cookies.set("mobileNumber", this.state.mobileNumber);
                // window.location.href = "/signup";
                // this.setState({
                //   finoUnAuthorizedDialogOpen: true,
                // });
              });
          }
        });
        // window.location.href = "/home";
      })
      .catch((err) => {
        set("lang", "en")
          .then((val) => {})
          .catch((err) => {});

        var parsed = queryString.parse(window.location.search);
        if (parsed.AHVALID === undefined) {
        } else {
          // var user = result.data.ID;
          this.setState({
            finoUnAuthorizedDialogOpen: true,
            // finoLoading: false,
          });

          var AHVALIDSTR = parsed.AHVALID;
          var replaced = AHVALIDSTR.split(" ").join("+");
          // var header = parsed.AHHEADER.split(" ").join("+");
          // console.log(header);
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          // myHeaders.append("Access-Control-Allow-Origin", "*");
          // myHeaders.append("Authentication", header);
          var requestOptions = {
            method: "POST",
            // headers: myHeaders,
            body: JSON.stringify({
              AHVALID: replaced,
            }),
            redirect: "follow",
          };

          fetch(APIURL + "/user/fino", requestOptions)
            .then((response) => {
              console.log(response.status);
              if (!response.ok) {
                throw Error("It is 409 error");
              }
              return response.json();
            })
            .then((result) => {
              console.log(result);
              new Cookies().set("userInfo", result.data.user);
              window.location.href = "/home";
            })
            .catch((error) => {
              console.log("errdddor", error);
              // toast.error("401 status code returned");
              this.setState({
                finoUnAuthorizedDialogOpen: true,
                finoLoading: false,
              });

              // this.state.cookies.set("mobileNumber", this.state.mobileNumber);
              // window.location.href = "/signup";
              // this.setState({
              //   finoUnAuthorizedDialogOpen: true,
              // });
            });
        }
      });

    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
      }
    );

    firebase.auth().useDeviceLanguage();
  }

  loginSubmit = () => {
    console.log("Clicked");
    const appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber("+91" + this.state.mobileNumber, appVerifier)
      .then((confirmResult) => {
        // success
        console.log("SMS sent" + confirmResult);
        toast("OTP sent");
        this.setState({
          confirmResult: confirmResult,
        });
        this.handleDialogOpen();
      })
      .catch((error) => {
        // error
        toast.error("Something not correct. Please try again");
        console.log("Not sent" + error);
        // window.location.reload();
      });
  };
  render() {
    if (this.state.isLoading) {
      return (
        <React.Fragment>
          <Backdrop open={this.state.isLoading}>
            <CircularProgress />
          </Backdrop>
        </React.Fragment>
      );
    }
    return (
      // <React.Fragment>
      //   <div id="firebaseui-auth-container"></div>
      // </React.Fragment>
      <React.Fragment>
        <Dialog maxWidth="lg" open={this.state.finoUnAuthorizedDialogOpen}>
          {/* <DialogTitle>Unauthorized access</DialogTitle> */}
          <DialogContent>
            {this.state.finoLoading ? (
              <div style={{ textAlign: "center" }}>
                <img src={LoaderGif} className="img-fluid" width="80px" />
                <br />
                <br />
                <h6>Please wait, while we are authenticating you. </h6>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <img
                  src={unauthorizedIcon}
                  className="img-fluid"
                  width="80px"
                />
                <br />
                <br />
                <h5>Unauthorized Access</h5>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.OTPDialogOpen}
          onClose={this.handleDialogClose}
        >
          <DialogTitle>Enter 6 digit OTP</DialogTitle>
          <DialogContent>
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
                  isInputNum
                  inputStyle={{ width: "100%", margin: "10px" }}
                />
                <p style={{ fontSize: "12px", textAlign: "left" }}>
                  OTP has been sent to {this.state.mobileNumber}
                </p>
                <p style={{ fontSize: "12px", textAlign: "left" }}>
                  Haven't received your OTP yet?
                  <span style={{ float: "right" }}>
                    Wait {this.state.timer + "s"}
                  </span>
                </p>
                {this.state.timer > 0 ? (
                  <div
                    className="HomeBlueButtonSmall"
                    style={{
                      margin: "6px",
                      marginTop: "40px",
                    }}
                    onClick={() => {
                      toast.info(
                        "Please wait " +
                          this.state.timer +
                          "seconds to resend OTP"
                      );
                    }}
                  >
                    <h6>Re-Send OTP on SMS</h6>
                  </div>
                ) : (
                  <div
                    className="HomeBlueButtonSmall"
                    style={{ margin: "6px", marginTop: "40px" }}
                    onClick={() => {
                      this.loginSubmit();
                      this.setState({
                        timer: 60,
                      });
                    }}
                  >
                    <h6>Re-Send OTP on SMS</h6>
                  </div>
                )}
                <h6
                  style={{ marginTop: "20px", cursor: "pointer" }}
                  onClick={() => {
                    this.handleDialogClose();
                    this.setState({
                      mobileNumber: "",
                      timer: 60,
                    });
                  }}
                >
                  Use different mobile number
                </h6>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
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
              <h6>
                <LangConvertComponent name="login_to_ayekart" />
              </h6>
              <br />

              <div
                style={{ textAlign: "center" }}
                className="d-flex justify-content-center"
              >
                <Form onSubmit={this.handleSubmit}>
                  <InputGroup style={{ width: "300px" }}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>+91</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="text"
                      autoFocus
                      placeholder="Your Phone number"
                      value={this.state.mobileNumber}
                      name="mobileNumber"
                      onChange={this.handleInputChange}
                    />
                  </InputGroup>
                  <p style={{ fontSize: "12px", textAlign: "left" }}>
                    <LangConvertComponent name="we_will_send_you_otp_on_this_number" />
                  </p>
                  
                  <input
                    className="HomeBlueButtonInput"
                    id="recaptcha-container"
                    type="submit"
                    value="Send OTP on SMS"
                  />
                  <p style={{ textAlign: 'center', marginBottom: '10px' }}>or</p>
                  <div
                    className="HomeBlueButtonSmall"
                    id="recaptcha-container"
                    style={{ margin: "6px", marginTop: "10px" }}
                    onClick={() => {
                      if(this.state.mobileNumber != '' && this.state.mobileNumber != null) {
                        this.checkUserRegisteredForPassword();
                      }
                    }}
                  >
                    <h6>Use Password</h6>
                  </div>

                  {/* <div
                    className="HomeBlueButtonSmall"
                    id="recaptcha-container"
                    style={{ margin: "6px", marginTop: "40px" }}
                    onClick={() => this.loginSubmit}
                  >
                    <h6>Send OTP on SMS</h6>
                  </div> */}
                </Form>
              </div>
            </div>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default LoginComponent;
