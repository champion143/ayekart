import React, { Component } from "react";

import SearchIcon from "../../assets/SearchIcon.png";
import FilterIcon from "../../assets/FilterIcon.png";
import AddIcon from "../../assets/AddIcon.png";
import HistoryIcon from "../../assets/history.png";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";
import PDFIcon from "../../assets/PDFIcon.png";
import HeaderDP from "../../assets/headerdp.png";
import ClockIcon from "../../assets/clock.png";
import CallIcon from "../../assets/CallIcon.png";
import ShareIcon from "../../assets/Share.png";
import { Col, Container, Row } from "reactstrap";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import Cookies from "universal-cookie/es6";
import { APIURL } from "../constants/APIURL";
import { validateLogin } from "../constants/functions";
import LoadingComponent from "../LoadingComponent";
import LangConvertComponent from "../LangConvertComponent";

class RequestMoneyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UPIDialogOpen: false,
      AmountDialogOpen: false,
      cookies: new Cookies(),
      data: [],
      isLoading: true,
      customers: [],
    };
  }
  componentDidMount() {
    validateLogin
      .then((res) => {
        var userInfo = this.state.cookies.get("userInfo");

        this.setState({
          userInfo: userInfo,
        });
        this.getHomeDetails(userInfo);
      })
      .catch((error) => {
        window.location.href = "/login";
      });
  }

  getHomeDetails = (userInfo = this.state.cookies.get("userInfo")) => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      APIURL +
        "/user/" +
        userInfo.ID +
        "/business/" +
        userInfo.business.ID +
        "/home",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        var custo = [];
        if (result.data.customers !== 0) {
          custo = result.data.customers.filter(
            (item) => item.to_collect - item.collected > 0
          );
        }
        this.setState({
          isLoading: false,
          data: result.data,
          customers: custo,
        });
      })
      .catch((error) => console.log("error", error));
  };

  handleAmountDialogOpen = () => {
    this.setState({
      UPIDialogOpen: false,
      AmountDialogOpen: true,
    });
  };
  handleAmountDialogClose = () => {
    this.setState({
      UPIDialogOpen: false,
    });
  };
  handleUPIDialogOpen = () => {
    this.setState({
      UPIDialogOpen: true,
    });
  };
  handleUPIDialogClose = () => {
    this.setState({
      UPIDialogOpen: false,
    });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <React.Fragment>
          <LoadingComponent />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <Dialog
          open={this.state.AmountDialogOpen}
          onClose={this.handleAmountDialogClose}
          fullWidth
          maxWidth="sm"
        >
          {/* <DialogTitle>{"Use Google's location service?"}</DialogTitle> */}
          <DialogContent>
            <DialogContentText>
              <div>
                <Row>
                  <Col sm="0" className="nopadding">
                    <div>
                      <img
                        src={HeaderDP}
                        className="img-fluid"
                        style={{
                          width: "50px",
                          marginLeft: "10px",
                        }}
                      />
                    </div>
                  </Col>
                  <Col sm>
                    <div>
                      <h6>Ramesh Kadam</h6>
                      <p>12th Oct 2020</p>
                    </div>
                  </Col>
                  <Col sm>
                    <div>
                      <h6>Pending</h6>
                      <p id="BlueColorText">₹100</p>
                    </div>
                  </Col>
                </Row>
                <TextField
                  inputProps={{
                    style: { backgroundColor: "white" },
                  }}
                  variant="filled"
                  label="Amount"
                  fullWidth
                />
                <br />
                <br />
                <div
                  className="HomeBlueButtonSmall"
                  style={{ margin: "6px", textAlign: "center" }}
                >
                  <h6>ADD</h6>
                </div>
                <br />
                <div style={{ textAlign: "center" }}>
                  <Button
                    variant="outlined"
                    onClick={() => this.handleUPIDialogClose()}
                  >
                    Later
                  </Button>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.UPIDialogOpen}
          onClose={this.handleUPIDialogClose}
          fullWidth
          maxWidth="sm"
        >
          {/* <DialogTitle>{"Use Google's location service?"}</DialogTitle> */}
          <DialogContent>
            <DialogContentText>
              <div>
                <TextField
                  inputProps={{
                    style: { backgroundColor: "white" },
                  }}
                  variant="filled"
                  label="Enter UPI ID to receive payments"
                  fullWidth
                />
                <br />
                <br />
                <Container>
                  <Row>
                    <Col sm="0">
                      <div>
                        <img
                          src={ShareIcon}
                          className="img-fluid"
                          style={{ width: "30px" }}
                        />
                      </div>
                    </Col>
                    <Col sm>
                      <div>
                        <h6>Share on</h6>
                      </div>
                    </Col>
                    <Col sm>
                      <div>WhatsApp</div>
                    </Col>
                  </Row>
                </Container>
                <br />
                <div
                  className="HomeBlueButtonSmall"
                  style={{ margin: "6px", textAlign: "center" }}
                  onClick={() => this.handleAmountDialogOpen()}
                >
                  <h6>Request Money</h6>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-0 nopadding">
              <SidebarComponent activePage="Finance" />
            </div>

            <div className="col-sm-12 nopadding">
              <div className="PageContentMainDiv">
                <div className="PageContentContentDiv">
                  <HeaderComponent />

                  <div className="HomeMainDiv">
                    <p style={{ textAlign: "right", marginRight: "10px" }}></p>
                    <div className="HomeSecondDiv">
                      <div
                        className="HomeBlueButton"
                        style={{ float: "left", margin: "6px" }}
                      >
                        <h6>
                          <LangConvertComponent name="urgent_pendings" />
                        </h6>
                      </div>

                      {/* <div
                        className="HomeSecondDivRightIcons"
                        style={{ float: "right" }}
                      >
                        <span className="HomeSecondDivRightIconItem">
                          <img src={SearchIcon} style={{ width: "20px" }} />
                        </span>
                        <span className="HomeSecondDivRightIconItem">
                          <img src={FilterIcon} style={{ width: "20px" }} />
                        </span>
                      </div> */}
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />

                    <div className="InvoiceHistorySecondDiv">
                      <Container fluid>
                        <Row>
                          {this.state.customers.length > 0 &&
                            this.state.customers.reverse().map((item) => (
                              <Col sm="5" className="HomeThirdDivItemDiv">
                                <div>
                                  <Row>
                                    <Col sm="0" xs="0" className="nopadding">
                                      <div style={{ marginLeft: "10px" }}>
                                        <Avatar
                                          style={{
                                            backgroundColor: "#0D3293",
                                          }}
                                        >
                                          {item.first_name[0] +
                                            item.last_name[0]}
                                        </Avatar>
                                      </div>
                                    </Col>
                                    <Col sm xs>
                                      <div>
                                        <h6>
                                          {item.first_name +
                                            " " +
                                            item.last_name}
                                        </h6>
                                        {/* <p>12th Oct 2020</p> */}
                                      </div>
                                    </Col>
                                    <Col sm xs>
                                      <div>
                                        <h6>
                                          <LangConvertComponent name="to_collect" />
                                        </h6>
                                        <p id="BlueColorText">
                                          ₹{" "}
                                          {item.to_collect - item.collected < 0
                                            ? Math.abs(
                                                item.to_collect - item.collected
                                              ) + "(Adv)"
                                            : item.to_collect - item.collected}
                                        </p>
                                      </div>
                                    </Col>
                                  </Row>

                                  <hr />
                                  <Row>
                                    <Col sm="3">
                                      <div>
                                        <p id="BlueColorText">
                                          <LangConvertComponent name="remind" />{" "}
                                          via:{" "}
                                        </p>
                                      </div>
                                    </Col>
                                    <Col sm xs>
                                      {/* <div
                                        className="HomeBlueButtonSmall"
                                        style={{
                                          float: "right",
                                          margin: "0px",
                                        }}
                                      >
                                        <h6>Request</h6>
                                      </div> */}
                                      <a
                                        href={
                                          "sms://+91" +
                                          item.mobile +
                                          "?body=Dear%20Sir/Madam,%20Your%20payment%20of%20₹" +
                                          (item.to_collect - item.collected) +
                                          "%20is%20pending%20at%20" +
                                          this.state.data.business_name
                                        }
                                      >
                                        <Button variant="contained">SMS</Button>
                                      </a>
                                    </Col>
                                    <Col sm xs>
                                      <div>
                                        <a
                                          target="_blank"
                                          href={
                                            "https://wa.me/+91" +
                                            item.mobile +
                                            "?text=Dear%20Sir/Madam,%20Your%20payment%20of%20₹" +
                                            (item.to_collect - item.collected) +
                                            "%20is%20pending%20at%20" +
                                            this.state.data.business_name
                                          }
                                        >
                                          <Button variant="contained">
                                            WhatsApp
                                          </Button>
                                        </a>
                                      </div>
                                    </Col>
                                  </Row>
                                </div>
                              </Col>
                            ))}
                        </Row>
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

export default RequestMoneyComponent;
