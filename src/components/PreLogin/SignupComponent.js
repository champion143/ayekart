import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import React, { Component } from "react";
import { toast } from "react-toastify";
import { Col, Container, Form, Row } from "reactstrap";
import Cookies from "universal-cookie/es6";
import AyekartHisabLogo from "../../assets/AyekartHisabLogo.png";
import { validateLogin } from "../constants/functions";
class SignupComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      first_name: "",
      last_name: "",
      email_address: "",
      mobile: "",
      state: "",
      city: "Your City",
      address: "",
      locale: "",
      business_name: "",
      pincode: "",

      //
      cities: [],
      accepted: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleAcceptedChange = (event) => {
    this.setState({
      accepted: event.target.checked,
    });
  };

  handleSelectCity = (event) => {
    this.setState({
      city: event.target.value,
    });
  };

  getCityPostalAPI = (pincode) => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("https://api.postalpincode.in/pincode/" + pincode, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result[0].PostOffice !== null) {
          var cii = [];
          result[0].PostOffice.forEach((item) => {
            cii.push(item.Name);
          });
          var state = "";
          state = result[0].PostOffice[0].State;
          console.log(cii);
          console.log(state);
          this.setState({
            cities: cii,
            city: cii[0],
            state: state,
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "pincode" && value.length === 6) {
      this.getCityPostalAPI(value);
    }

    this.setState({
      [name]: value,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.state.accepted) {
      toast.error("Please accept Terms & Conditions to proceed");
    } else {
      this.registerUser({
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email_address: this.state.email_address,
        mobile: this.state.cookies.get("mobileNumber"),
        state: this.state.state,
        city: this.state.city,
        address: this.state.address,
        locale: "english",
        business_name: this.state.business_name,
        pincode: this.state.pincode,
      });
    }
  };

  registerUser = (creds) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(creds);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      mode: "no-cors",
      body: raw,
      redirect: "follow",
    };

    fetch("https://api.ayekart.com/v1/user/register", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        toast.success("User Registered");
        // window.location.href = "/home";
        window.location.href = "/login";
      })
      .catch((error) => console.log("error", error));
  };

  componentDidMount() {
    this.setState({
      mobile: this.state.cookies.get("mobileNumber")
    })
    // validateLogin
    //   .then((res) => {})
    //   .catch((err) => {
    //     window.location.href = "/login";
    //   });
  }

  render() {
    return (
      <React.Fragment>
        <div className="SignupMainDiv">
          <div className="SignupTopDiv">
            <h1>
              Sign Up with
              <span>
                <img
                  src={AyekartHisabLogo}
                  className="img-fluid"
                  style={{ width: "200px", marginLeft: "30px" }}
                />
              </span>
            </h1>
          </div>

          <div className="SignupFormDiv">
            <Form onSubmit={this.handleSubmit}>
              <Container>
                <Row>
                  <Col sm>
                    <div>
                      <TextField
                        inputProps={{
                          style: { backgroundColor: "white" },
                        }}
                        variant="filled"
                        label="First Name (*)"
                        fullWidth
                        name="first_name"
                        value={this.state.first_name}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </Col>

                  <Col sm>
                    <div>
                      <TextField
                        inputProps={{
                          style: { backgroundColor: "white" },
                        }}
                        variant="filled"
                        label="Last Name (*)"
                        fullWidth
                        name="last_name"
                        value={this.state.last_name}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </Col>
                  <Col sm>
                    <div>
                      <TextField
                        inputProps={{
                          style: { backgroundColor: "white" },
                        }}
                        variant="filled"
                        label="Business Name (*)"
                        fullWidth
                        name="business_name"
                        value={this.state.business_name}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </Col>
                </Row>

                <br />
                <br />

                <Row>
                  <Col sm>
                    <div>
                      <TextField
                        inputProps={{
                          style: { backgroundColor: "white" },
                        }}
                        variant="filled"
                        label="Email Address"
                        fullWidth
                        name="email_address"
                        value={this.state.email_address}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </Col>

                  <Col sm>
                    <div>
                      <TextField
                        inputProps={{
                          style: { backgroundColor: "white" },
                        }}
                        variant="filled"
                        label="Enter Pincode (*)"
                        fullWidth
                        name="pincode"
                        value={this.state.pincode}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </Col>
                  <Col sm>
                    <div style={{ paddingTop: "20px" }}>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={this.state.city}
                        onChange={this.handleSelectCity}
                        fullWidth
                        inputProps={{
                          style: { backgroundColor: "white" },
                        }}
                      >
                        {this.state.cities.map((city) => (
                          <MenuItem value={city}>{city}</MenuItem>
                        ))}
                      </Select>
                    </div>
                  </Col>
                </Row>
                <br />
                <br />
                <Row>
                  <Col sm>
                    <div>
                      <TextField
                        inputProps={{
                          style: { backgroundColor: "white" },
                        }}
                        variant="filled"
                        label="State (*)"
                        fullWidth
                        name="state"
                        value={this.state.state}
                        onChange={this.handleInputChange}
                        disabled
                      />
                    </div>
                  </Col>
                  <Col sm>
                    <div>
                      <TextField
                        inputProps={{
                          style: { backgroundColor: "white" },
                        }}
                        variant="filled"
                        label="Enter UPI ID"
                        fullWidth
                      />
                    </div>
                  </Col>
                  <Col sm>
                    <div></div>
                  </Col>
                </Row>
                <br />
                <br />

                <div>
                  <div>
                    <TextField
                      multiline
                      rows={4}
                      variant="filled"
                      label="Address (*)"
                      fullWidth
                      name="address"
                      value={this.state.address}
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <br />

                  <div style={{ textAlign: "center" }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.accepted}
                          onChange={this.handleAcceptedChange}
                          name="checkedB"
                          color="primary"
                          style={{ textAlign: "center" }}
                        />
                      }
                      label="Accept terms & conditions"
                    />
                  </div>

                  <Row>
                    <Col sm>
                      <div></div>
                    </Col>
                    <Col sm>
                      <div
                        className="HomeBlueButton"
                        style={{
                          margin: "6px",
                          marginTop: "10px",
                          textAlign: "center",
                        }}
                        onClick={() => {
                          console.log(this.state);

                          !this.state.accepted
                            ? toast.error(
                                "Please accept Terms & Conditions to proceed"
                              )
                            : this.state.first_name.trim().length === 0 ||
                              this.state.last_name.trim().length === 0 ||
                              this.state.mobile.trim().length === 0 ||
                              this.state.state.trim().length === 0 ||
                              this.state.city.trim().length === 0 ||
                              this.state.address.trim().length === 0 ||
                              this.state.business_name.trim().length === 0 ||
                              this.state.pincode.trim().length === 0
                            ? toast.error("Please enter all required fields..")
                            : this.registerUser({
                                first_name: this.state.first_name,
                                last_name: this.state.last_name,
                                email_address: this.state.email_address,
                                mobile: this.state.cookies.get("mobileNumber"),
                                state: this.state.state,
                                city: this.state.city,
                                address: this.state.address,
                                locale: "english",
                                business_name: this.state.business_name,
                                pincode: this.state.pincode,
                              });
                        }}
                      >
                        <h4>Sign Up</h4>
                      </div>
                    </Col>
                    <Col sm>
                      <div></div>
                    </Col>
                  </Row>
                </div>
              </Container>
            </Form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SignupComponent;
