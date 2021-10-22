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

class SetPasswordComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirm_password: '',
      enter_password: '',
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

  firebaseSigninCall = (e) => {
    e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.state.cookies.get("mobileNumber")+'@example.com', this.state.enter_password).then((userCredential) => {
          const user = userCredential.user;
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          var requestOptions = {
            method: "GET",
            redirect: "follow",
          };
          fetch(APIURL + "/user/me?uid=" + this.state.cookies.get("mobileNumber"), requestOptions)
          .then((response) => {
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
            this.state.cookies.set("mobileNumber", this.state.cookies.get("mobileNumber"));
            window.location.href = "/signup";
          });
        })
        .catch((error) => {
          console.log("error", error);
          const errorCode = error.code;
          const errorMessage = error.message;
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

  }

  loginSubmit = () => {
    firebase.auth().createUserWithEmailAndPassword(this.state.cookies.get("mobileNumber")+'@example.com', this.state.password)
    .then((userCredential) => {

      var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          var requestOptions = {
            method: "GET",
            redirect: "follow",
          };

      fetch(APIURL + "/user/me?uid=" + this.state.cookies.get("mobileNumber"), requestOptions)
          .then((response) => {
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
            this.state.cookies.set("mobileNumber", this.state.cookies.get("mobileNumber"));
            window.location.href = "/signup";
          });

    })
    .catch((error) => {
      console.log("error", error);
      const errorCode = error.code;
      const errorMessage = error.message;
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
              <h6>
                <LangConvertComponent name="login_to_ayekart" />
              </h6>
              <br />
              <div
                style={{ textAlign: "center" }}
                className="d-flex justify-content-center"
              >

                {
                  (this.state.cookies.get("isUserAccountExist") == false || this.state.cookies.get("isUserAccountExist") == 'false') ? 
                  <Form onSubmit={this.handleSubmit}>
                    <InputGroup style={{ width: "300px" }}>
                        <Input
                          type="text"
                          autoFocus
                          placeholder="Set Passowrd"
                          value={this.state.password}
                          name="password"
                          onChange={this.handleInputChange}
                        />
                      </InputGroup>
                      <InputGroup style={{ width: "300px", marginTop: "20px", marginBottom: "20px" }}>
                        <Input
                          type="text"
                          autoFocus
                          placeholder="Confirm Passowrd"
                          value={this.state.confirm_password}
                          name="confirm_password"
                          onChange={this.handleInputChange}
                        />
                      </InputGroup>
                      <input
                        className="HomeBlueButtonInput"
                        id="recaptcha-container"
                        type="submit"
                        value="Login"
                      />
                  </Form> :
                  <Form onSubmit={this.firebaseSigninCall}>
                    <InputGroup style={{ width: "300px", marginTop: "20px", marginBottom: "20px" }}>
                      <Input
                        type="text"
                        autoFocus
                        placeholder="Enter Passowrd"
                        value={this.state.enter_password}
                        name="enter_password"
                        onChange={this.handleInputChange}
                      />
                    </InputGroup>
                    <input
                      className="HomeBlueButtonInput"
                      id="recaptcha-container"
                      type="submit"
                      value="Login"
                    />
                  </Form>
                }
              </div>
            </div>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default SetPasswordComponent;
