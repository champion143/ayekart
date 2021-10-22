import { Avatar, Button, MenuItem, Select, TextField } from "@material-ui/core";
import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

import profileclipart from "../../assets/profileclipart.png";

import CallIcon from "../../assets/CallIcon.png";
import Cookies from "universal-cookie/es6";
import { logOutUser, validateLogin } from "../constants/functions";
import LoadingComponent from "../LoadingComponent";
import { APIURL } from "../constants/APIURL";

import address from "../../assets/address.png";
import settings from "../../assets/settings.png";
import business from "../../assets/business.png";
import { toast } from "react-toastify";
import LangConvertComponent from "../LangConvertComponent";

class EditProfileComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      userInfo: {},
      data: {},
      isLoading: true,
      notFound: false,

      //
      first_name: "",
      last_name: "",
      state: "",
      city: "",
      address: "",
      pincode: "",
      profile_image_url: "",
      business_name: "",
      mobile: "",
      //
      cities: [],
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
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
        console.log(result[0]);
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
  handleSubmit = () => {
    this.updateUser({
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      state: this.state.state,
      city: this.state.city,
      address: this.state.address,
      pincode: this.state.pincode,
      profile_image_url: this.state.profile_image_url,
      business_name: this.state.business_name,
      mobile: this.state.mobile,
    });
  };
  updateUser = (creds) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(creds);

    var requestOptions = {
      method: "PUT",
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://proxycorsserversurya.herokuapp.com/" +
        APIURL +
        "/user/" +
        this.state.userInfo.ID +
        "/me",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        this.getUserDetails();
      })
      .catch((error) => console.log("error", error));
  };
  getUserDetails = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(APIURL + "/user/me?uid=" + this.state.mobile, requestOptions)
      .then((response) => {
        console.log(response.status);
        if (!response.ok) {
          throw Error("It is 409 error");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        this.state.cookies.set("userInfo", result.data);
        toast.success("Profile Updated");
        window.location.href = "/userprofile";
      })
      .catch((error) => {
        console.log("errdddor", error);
        this.state.cookies.set("mobileNumber", this.state.mobileNumber);
      });
  };
  componentDidMount() {
    validateLogin
      .then((res) => {
        var userInfo = this.state.cookies.get("userInfo");
        this.setState({
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          state: userInfo.state,
          city: userInfo.city,
          address: userInfo.address,
          pincode: userInfo.pincode,
          profile_image_url: userInfo.profile_image_url,
          business_name: userInfo.business.business_name,
          mobile: userInfo.mobile,
          userInfo: this.state.cookies.get("userInfo"),
          isLoading: false,
        });
      })
      .catch((err) => {
        window.location.href = "/login";
      });
  }
  render() {
    if (this.state.isLoading) {
      return (
        <React.Fragment>
          <LoadingComponent />
        </React.Fragment>
      );
    }
    if (this.state.notFound) {
      return (
        <React.Fragment>
          <div>User not found</div>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-0 nopadding">
              <SidebarComponent activePage="Home" />
            </div>

            <div className="col-sm-12 nopadding">
              <div className="PageContentMainDiv">
                <div className="PageContentContentDiv">
                  <HeaderComponent />

                  <div className="ProfileMainDiv">
                    <Container>
                      <Row>
                        <Col sm>
                          <div></div>
                        </Col>

                        <Col sm>
                          <div className="d-flex justify-content-center">
                            <Avatar
                              style={{
                                backgroundColor: "#0D3293",
                                width: "120px",
                                height: "120px",
                                fontSize: "50px",
                              }}
                            >
                              {this.state.userInfo.first_name[0] +
                                this.state.userInfo.last_name[0]}
                            </Avatar>
                          </div>
                        </Col>
                        <Col sm>
                          <div style={{ float: "right" }}>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => this.handleSubmit()}
                            >
                              <LangConvertComponent name="done" />
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Container>

                    <div className="ProfileSecondDiv">
                      <Container>
                        <br />

                        <Row>
                          <Col sm>
                            <div>
                              <TextField
                                value={this.state.business_name}
                                onChange={this.handleInputChange}
                                name="business_name"
                                inputProps={{
                                  style: { backgroundColor: "white" },
                                }}
                                variant="filled"
                                label={
                                  <LangConvertComponent name="business_name" />
                                }
                                fullWidth
                              />
                            </div>
                          </Col>
                          <Col sm>
                            <div>
                              <TextField
                                value={this.state.mobile}
                                onChange={this.handleInputChange}
                                name="mobile"
                                inputProps={{
                                  style: { backgroundColor: "white" },
                                }}
                                variant="filled"
                                label={
                                  <LangConvertComponent name="mobile_number" />
                                }
                                fullWidth
                              />
                            </div>
                          </Col>
                        </Row>
                        <br />
                        <Row>
                          <Col sm>
                            <div>
                              <TextField
                                value={this.state.first_name}
                                onChange={this.handleInputChange}
                                name="first_name"
                                inputProps={{
                                  style: { backgroundColor: "white" },
                                }}
                                variant="filled"
                                label={
                                  <LangConvertComponent name="first_name" />
                                }
                                fullWidth
                              />
                            </div>
                          </Col>
                          <Col sm>
                            <div>
                              <TextField
                                value={this.state.last_name}
                                onChange={this.handleInputChange}
                                name="last_name"
                                inputProps={{
                                  style: { backgroundColor: "white" },
                                }}
                                variant="filled"
                                label={
                                  <LangConvertComponent name="last_name" />
                                }
                                fullWidth
                              />
                            </div>
                          </Col>
                        </Row>
                        <br />
                        <Row>
                          <Col sm>
                            <div>
                              <TextField
                                value={this.state.pincode}
                                onChange={this.handleInputChange}
                                name="pincode"
                                inputProps={{
                                  style: { backgroundColor: "white" },
                                }}
                                variant="filled"
                                label={
                                  <LangConvertComponent name="enter_pincode" />
                                }
                                fullWidth
                              />
                            </div>
                          </Col>
                          <Col sm>
                            <div>
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
                                <MenuItem value={this.state.city} disabled>
                                  {this.state.city}
                                </MenuItem>
                                {this.state.cities.map((city) => (
                                  <MenuItem value={city}>{city}</MenuItem>
                                ))}
                              </Select>
                            </div>
                          </Col>
                        </Row>
                        <br />
                        <Row>
                          <Col sm>
                            <div>
                              <TextField
                                value={this.state.address}
                                onChange={this.handleInputChange}
                                name="address"
                                inputProps={{
                                  style: { backgroundColor: "white" },
                                }}
                                variant="filled"
                                label={<LangConvertComponent name="address" />}
                                fullWidth
                              />
                            </div>
                          </Col>
                          <Col sm>
                            <div>
                              <TextField
                                value={this.state.state}
                                onChange={this.handleInputChange}
                                name="state"
                                inputProps={{
                                  style: { backgroundColor: "white" },
                                }}
                                variant="filled"
                                label="State"
                                fullWidth
                                disabled
                              />
                            </div>
                          </Col>
                        </Row>
                        <br />
                      </Container>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default EditProfileComponent;
