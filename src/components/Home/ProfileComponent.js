import { Avatar, Button } from "@material-ui/core";
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
import { Link } from "react-router-dom";
import LangConvertComponent from "../LangConvertComponent";

class ProfileComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      userInfo: {},
      data: {},
      isLoading: true,
      notFound: false,
    };
  }
  componentDidMount() {
    validateLogin
      .then((res) => {
        this.setState({
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
                        <Col sm xs>
                          <div></div>
                        </Col>

                        <Col sm xs>
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
                        <Col sm xs>
                          <div style={{ float: "right" }}>
                            <Link to="/editprofile" id="NoHoverLink">
                              <Button variant="outlined" color="primary">
                                <LangConvertComponent name="edit" />
                              </Button>
                            </Link>
                          </div>
                        </Col>
                      </Row>
                    </Container>

                    <div className="ProfileSecondDiv">
                      <Container>
                        <br />

                        <Row>
                          <Col sm style={{ marginBottom: "10px" }}>
                            <Row>
                              <Col sm="0" xs="0">
                                <img
                                  src={profileclipart}
                                  className="img-fluid"
                                  style={{ width: "40px" }}
                                />
                              </Col>
                              <Col sm xs>
                                <h5>
                                  <LangConvertComponent name="name" />
                                </h5>
                                <h6>
                                  {this.state.userInfo.first_name +
                                    " " +
                                    this.state.userInfo.last_name}
                                </h6>
                              </Col>
                            </Row>
                          </Col>
                          <Col sm style={{ marginBottom: "10px" }}>
                            {/* <Row>
                              <Col sm="0" xs="0">
                                <img
                                  src={settings}
                                  className="img-fluid"
                                  style={{ width: "40px" }}
                                />
                              </Col>
                              <Col sm xs>
                                <h5></h5>
                                <h6>Language Settings</h6>
                              </Col>
                            </Row> */}
                          </Col>
                        </Row>
                        <br />

                        <Row>
                          <Col sm style={{ marginBottom: "10px" }}>
                            <Row>
                              <Col sm="0" xs="0">
                                <img
                                  src={CallIcon}
                                  className="img-fluid"
                                  style={{ width: "40px" }}
                                />
                              </Col>
                              <Col sm xs>
                                <h5>
                                  <LangConvertComponent name="mobile_number" />
                                </h5>
                                <h6>{this.state.userInfo.mobile}</h6>
                              </Col>
                            </Row>
                          </Col>
                          <Col sm style={{ marginBottom: "10px" }}>
                            <Row>
                              <Col sm="0" xs="0">
                                <img
                                  src={settings}
                                  className="img-fluid"
                                  style={{ width: "40px" }}
                                />
                              </Col>
                              <Col sm xs>
                                <h5>Bank Details</h5>
                                <h6>
                                  {this.state.userInfo.business.bank_detail ===
                                  null
                                    ? "No UPI was added"
                                    : this.state.userInfo.business.bank_detail}
                                </h6>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <br />
                        <Row>
                          <Col sm style={{ marginBottom: "10px" }}>
                            <Row>
                              <Col sm="0" xs="0">
                                <img
                                  src={address}
                                  className="img-fluid"
                                  style={{ width: "40px" }}
                                />
                              </Col>
                              <Col sm xs>
                                <h5>
                                  <LangConvertComponent name="address" />
                                </h5>
                                <h6>{this.state.userInfo.address}</h6>
                              </Col>
                            </Row>
                          </Col>
                          <Col sm style={{ marginBottom: "10px" }}>
                            <Row>
                              <Col sm="0" xs="0">
                                <img
                                  src={business}
                                  className="img-fluid"
                                  style={{ width: "40px" }}
                                />
                              </Col>
                              <Col sm xs>
                                <h5>
                                  <LangConvertComponent name="business_name" />
                                </h5>
                                <h6>
                                  {this.state.userInfo.business.business_name}
                                </h6>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Container>
                    </div>

                    <br />
                    <Container>
                      <Row>
                        <Col sm></Col>
                        <Col sm>
                          <div>
                            <div
                              className="HomeBlueButton d-flex justify-content-center"
                              style={{
                                margin: "6px",
                                marginTop: "30px",
                                textAlign: "center",
                              }}
                              onClick={() => logOutUser()}
                            >
                              <h6>
                                <LangConvertComponent name="logout" />
                              </h6>
                            </div>
                          </div>
                        </Col>
                        <Col sm></Col>
                      </Row>
                    </Container>
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

export default ProfileComponent;
