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
import { Link } from "react-router-dom";

import address from "../../assets/address.png";
import settings from "../../assets/settings.png";
import business from "../../assets/business.png";
import salary from "../../assets/salary.png";
import { toast } from "react-toastify";
import LangConvertComponent from "../LangConvertComponent";

class StaffProfileComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staffId: this.props.match.params.id,
      cookies: new Cookies(),
      userInfo: {},
      data: {},
      isLoading: true,
      notFound: false,
      staffDetails: {},
    };
  }

  deleteStaff = () => {
    var requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    fetch(
      "https://proxycorsserversurya.herokuapp.com/https://proxycorsserversurya.herokuapp.com/" +
        APIURL +
        "/user/" +
        this.state.userInfo.ID +
        "/business/" +
        this.state.userInfo.business.ID +
        "/staff/" +
        this.state.staffId,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        toast("Staff Deleted");
        window.location.href = "/staff";
      })
      .catch((error) => console.log("error", error));
  };
  getStaff = () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      APIURL +
        "/user/" +
        this.state.userInfo.ID +
        "/business/" +
        this.state.userInfo.business.ID +
        "/staff",
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          throw Error("Error");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        var staffDetails = {};
        staffDetails = result.data.filter(
          (item) => item.ID == this.state.staffId
        )[0];
        console.log(staffDetails);
        this.setState({
          isLoading: false,
          data: result.data,
          staffDetails: staffDetails,
        });
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({
          isLoading: false,
          notFound: true,
        });
      });
  };
  componentDidMount() {
    validateLogin
      .then((res) => {
        this.setState({
          userInfo: this.state.cookies.get("userInfo"),
        });
        this.getStaff();
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
              <SidebarComponent activePage="Staff" />
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
                              {this.state.staffDetails.full_name[0]}
                            </Avatar>
                          </div>
                        </Col>
                        <Col sm xs>
                          <div style={{ float: "right" }}>
                            <Link
                              to={`/editstaffprofile/${this.state.staffId}`}
                              id="NoHoverLink"
                            >
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
                          <Col sm xs style={{ marginBottom: "10px" }}>
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
                                <h6>{this.state.staffDetails.full_name}</h6>
                              </Col>
                            </Row>
                          </Col>

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
                                <h6>{this.state.staffDetails.mobile_number}</h6>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <br />

                        <Row>
                          <Col sm xs style={{ marginBottom: "10px" }}>
                            <Row>
                              <Col sm="0" xs="0">
                                <img
                                  src={salary}
                                  className="img-fluid"
                                  style={{ width: "40px" }}
                                />
                              </Col>
                              <Col sm xs>
                                <h5>
                                  <LangConvertComponent name="monthly_salary_of_staff" />
                                </h5>
                                <h6>{this.state.staffDetails.staff_salary}</h6>
                              </Col>
                            </Row>
                          </Col>
                          <Col sm xs></Col>
                        </Row>
                        <br />
                      </Container>
                    </div>

                    <br />
                    <Container>
                      <Row>
                        <Col sm xs></Col>
                        <Col sm xs>
                          <div>
                            <div
                              className="HomeBlueButton d-flex justify-content-center"
                              style={{
                                margin: "6px",
                                marginTop: "30px",
                                textAlign: "center",
                              }}
                              onClick={() => this.deleteStaff()}
                            >
                              <h6>
                                <LangConvertComponent name="delete" />
                              </h6>
                            </div>
                          </div>
                        </Col>
                        <Col sm xs></Col>
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

export default StaffProfileComponent;
