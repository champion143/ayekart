import { Avatar } from "@material-ui/core";
import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

import profileclipart from "../../assets/profileclipart.png";

import CallIcon from "../../assets/CallIcon.png";
import Cookies from "universal-cookie/es6";
import { validateLogin } from "../constants/functions";
import LoadingComponent from "../LoadingComponent";
import { APIURL } from "../constants/APIURL";
import LangConvertComponent from "../LangConvertComponent";

class CustomerProfileComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerId: this.props.match.params.id,
      cookies: new Cookies(),
      userInfo: {},
      data: {},
      isLoading: true,
      notFound: false,
    };
  }
  getCustomerDetails = () => {
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
        "/customer/" +
        this.state.customerId +
        "/details",
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
        this.setState({
          isLoading: false,
          data: result.data,
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
        this.getCustomerDetails();
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
                    <Container fluid>
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
                              {this.state.data.first_name[0] +
                                this.state.data.last_name[0]}
                            </Avatar>
                          </div>
                        </Col>
                        <Col sm xs>
                          <div></div>
                        </Col>
                      </Row>
                    </Container>

                    <div className="ProfileSecondDiv">
                      <Container>
                        <h5 id="BlueColorText">
                          <b>
                            <LangConvertComponent name="customer_settings" />
                          </b>
                        </h5>
                        <br />

                        <Row>
                          <Col sm="0" xs="0">
                            <img
                              src={profileclipart}
                              className="img-fluid"
                              style={{ width: "60px" }}
                            />
                          </Col>
                          <Col sm xs>
                            <h5>
                              <LangConvertComponent name="customer_name" />
                            </h5>
                            <h6>
                              {this.state.data.first_name +
                                " " +
                                this.state.data.last_name}
                            </h6>
                          </Col>
                        </Row>
                        <br />
                        <Row>
                          <Col sm="0" xs="0">
                            <img
                              src={CallIcon}
                              className="img-fluid"
                              style={{ width: "60px" }}
                            />
                          </Col>
                          <Col sm xs>
                            <h5>
                              <LangConvertComponent name="customer_mobile" />
                            </h5>
                            <h6>{this.state.data.mobile}</h6>
                          </Col>
                        </Row>
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

export default CustomerProfileComponent;
