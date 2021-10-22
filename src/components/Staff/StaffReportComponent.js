import "date-fns";
import React, { Component } from "react";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

import PDFOutlineIcon from "../../assets/PDFOutlineIcon.png";
import CalendarIcon from "../../assets/CalendarIcon.png";
import { Col, Container, Row } from "reactstrap";
import {
  Avatar,
  FormControl,
  Input,
  InputLabel,
  TextField,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { APIURL } from "../constants/APIURL";
import Cookies from "universal-cookie/es6";
import { validateLogin } from "../constants/functions";
import LoadingComponent from "../LoadingComponent";

import { alpha } from '@material-ui/core/styles';

import moment from "moment";

import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Link } from "react-router-dom";
import GetReportComponent from "./GetReportComponent";
import LangConvertComponent from "../LangConvertComponent";

class StaffReportComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      cookies: new Cookies(),
      customerId: this.props.match.params.id,
      data: {},
      isLoading: true,
      notFound: false,
      staff: [],

      //
      startDateOpen: false,
      endDateOpen: false,
      searchQuery: "",

      //
      paidSum: 0,
      collectedSum: 0,
      entries: [],
      startDate: "2021-01-01",
      endDate: "",
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }
  handleSearchChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    var SearchResult = this.state.entries.filter((item) =>
      item.full_name.toString().toLowerCase().includes(value.toLowerCase())
    );
    if (value.length <= 0) {
      this.setState({
        isLoading: true,
      });
      this.getStaff();
    } else {
      this.setState({
        entries: SearchResult,
      });
    }
  }

  handleStartDateChange = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    var startDate = [year, month, day].join("-");
    this.setState({
      startDate: startDate,
    });
    // this.getUserReports(startDate, this.state.endDate);
  };

  handleEndDateChange = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    var endDate = [year, month, day].join("-");
    this.setState({
      endDate: endDate,
    });
    this.getUserReports();
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
        this.setState({
          isLoading: false,
          data: result.data,
          staff: result.data,
          entries: result.data,
        });
      })
      .catch((error) => console.log("error", error));
  };

  getUserReports = () => {
    this.setState({
      isLoading: false,
    });
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
        "/customer-hisab-reports?from=" +
        this.state.startDate +
        "&" +
        this.state.endDate,
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          throw Error("No Customer");
        }
        return response.json();
      })
      .then((result) => {
        var paidSum = 0;

        var collectedSum = 0;

        var collectedPaidArr = [];
        if (result.data.length > 0) {
          collectedPaidArr = result.data.filter(
            (item) =>
              item.entry_type === "collected" || item.entry_type === "paid"
          );
          collectedPaidArr.forEach((entry) => {
            if (entry.entry_type === "collected") {
              collectedSum += entry.collected;
            } else {
              paidSum += entry.paid;
            }
          });
        }
        this.setState({
          isLoading: false,
          data: result.data,
          entries: collectedPaidArr,
          collectedSum: collectedSum,
          paidSum: paidSum,
        });
      })
      .catch((error) => {
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
        var d = new Date(),
          month = "" + (d.getMonth() + 1),
          day = "" + d.getDate(),
          year = d.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        var endDate = [year, month, day].join("-");
        this.setState({
          endDate: endDate,
        });
        // this.getUserReports(this.state.startDate, endDate);
        this.getStaff();
      })
      .catch((err) => (window.location.href = "/login"));
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
      return <React.Fragment>User Not Found</React.Fragment>;
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

                  <div className="SpecificMainDiv">
                    <div className="SpecificTopDiv">
                      <Container fluid>
                        <Row>
                          <Col sm="6">
                            <div className="SpecificTopDivItemsDiv">
                              <TextField
                                inputProps={{
                                  style: {
                                    backgroundColor: "white",
                                    borderRadius: "10px",
                                  },
                                }}
                                variant="filled"
                                label={
                                  <LangConvertComponent name="search_staff" />
                                }
                                fullWidth
                                name="searchQuery"
                                value={this.state.searchQuery}
                                onChange={this.handleSearchChange}
                              />
                            </div>
                          </Col>
                          <Col sm xs>
                            {this.state.startDateOpen ? (
                              <MuiPickersUtilsProvider
                                utils={DateFnsUtils}
                                InputProps={{
                                  color: "white",
                                  backgroundColor: "white",
                                }}
                              >
                                <KeyboardDatePicker
                                  ref="testref"
                                  margin="normal"
                                  id="date-picker-dialog"
                                  label="Start Date"
                                  format="dd/MM/yyyy"
                                  value={this.state.startDate}
                                  onChange={this.handleStartDateChange}
                                  KeyboardButtonProps={{
                                    "aria-label": "change date",
                                  }}
                                  onClose={() => {
                                    this.setState({
                                      startDateOpen: false,
                                    });
                                  }}
                                  autoOk={true}
                                  open={this.state.startDateOpen}
                                />
                              </MuiPickersUtilsProvider>
                            ) : this.state.startDate === "" ? (
                              <div
                                className="SpecificTopDivItemsDiv"
                                onClick={() =>
                                  this.setState({
                                    startDateOpen: true,
                                  })
                                }
                                style={{ marginTop: "5px", cursor: "pointer" }}
                              >
                                <h6>
                                  <img
                                    src={CalendarIcon}
                                    className="img-fluid"
                                    style={{ width: "20px" }}
                                  />
                                  <span
                                    style={{
                                      color: "white",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    <LangConvertComponent name="start_date" />
                                  </span>
                                </h6>
                              </div>
                            ) : (
                              <div
                                className="SpecificTopDivItemsDiv"
                                onClick={() =>
                                  this.setState({
                                    startDateOpen: true,
                                  })
                                }
                                style={{ marginTop: "5px", cursor: "pointer" }}
                              >
                                <h6>
                                  <img
                                    src={CalendarIcon}
                                    className="img-fluid"
                                    style={{ width: "20px" }}
                                  />
                                  <span
                                    style={{
                                      color: "white",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    {moment(this.state.startDate).format(
                                      "MMM Do YYYY"
                                    )}
                                  </span>
                                </h6>
                              </div>
                            )}
                          </Col>
                          <Col sm xs>
                            {this.state.endDateOpen ? (
                              <MuiPickersUtilsProvider
                                utils={DateFnsUtils}
                                InputProps={{
                                  color: "white",
                                  backgroundColor: "white",
                                }}
                              >
                                <KeyboardDatePicker
                                  ref="testref"
                                  margin="normal"
                                  id="date-picker-dialog"
                                  label="End Date"
                                  format="dd/MM/yyyy"
                                  value={this.state.endDate}
                                  onChange={this.handleEndDateChange}
                                  KeyboardButtonProps={{
                                    "aria-label": "change date",
                                  }}
                                  onClose={() => {
                                    this.setState({
                                      endDateOpen: false,
                                    });
                                  }}
                                  autoOk={true}
                                  open={this.state.endDateOpen}
                                />
                              </MuiPickersUtilsProvider>
                            ) : this.state.endDate === "" ? (
                              <div
                                className="SpecificTopDivItemsDiv"
                                onClick={() =>
                                  this.setState({
                                    endDateOpen: true,
                                  })
                                }
                                style={{ marginTop: "5px", cursor: "pointer" }}
                              >
                                <h6>
                                  <img
                                    src={CalendarIcon}
                                    className="img-fluid"
                                    style={{ width: "20px" }}
                                  />
                                  <span
                                    style={{
                                      color: "white",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    <LangConvertComponent name="end_date" />
                                  </span>
                                </h6>
                              </div>
                            ) : (
                              <div
                                className="SpecificTopDivItemsDiv"
                                onClick={() =>
                                  this.setState({
                                    endDateOpen: true,
                                  })
                                }
                                style={{ marginTop: "5px", cursor: "pointer" }}
                              >
                                <h6>
                                  <img
                                    src={CalendarIcon}
                                    className="img-fluid"
                                    style={{ width: "20px" }}
                                  />
                                  <span
                                    style={{
                                      color: "white",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    {moment(this.state.endDate).format(
                                      "MMM Do YYYY"
                                    )}
                                  </span>
                                </h6>
                              </div>
                            )}
                          </Col>
                          {/* <Col sm>
                            <div className="SpecificTopDivItemsDiv">
                              <img
                                src={PDFOutlineIcon}
                                className="img-fluid"
                                style={{ width: "30px" }}
                              />
                            </div>
                          </Col>
                          <Col sm>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                label="Date picker dialog"
                                format="dd/MM/yyyy"
                                value={this.state.startDate}
                                onChange={this.handleStartDateChange}
                                KeyboardButtonProps={{
                                  "aria-label": "change date",
                                }}
                                autoOk={true}
                              />
                            </MuiPickersUtilsProvider>
                            
                          </Col>
                          <Col sm>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                label="Date picker dialog"
                                format="dd/MM/yyyy"
                                value={this.state.endDate}
                                onChange={this.handleEndDateChange}
                                KeyboardButtonProps={{
                                  "aria-label": "change date",
                                }}
                                autoOk={true}
                              />
                            </MuiPickersUtilsProvider>
                            
                          </Col>
                          <Col sm>
                            <div className="SpecificTopDivItemsDiv">
                              <Input
                                inputProps={{
                                  style: { backgroundColor: "white" },
                                }}
                                type="text"
                                placeholder="Search"
                                endAdornment={
                                  <Search style={{ color: "white" }} />
                                }
                              />
                            </div>
                          </Col> */}
                        </Row>
                      </Container>
                    </div>

                    <div className="SpecificThirdDiv">
                      <Container fluid>
                        <Row>
                          {this.state.entries.length > 0 &&
                            this.state.entries.map((item) => (
                              <Col sm="5" className="HomeThirdDivItemDiv">
                                <div>
                                  <div style={{}}>
                                    <h6>
                                      {/* <img
                                              src={HeaderDp}
                                              style={{ width: "40px" }}
                                            /> */}
                                      <span style={{ float: "left" }}>
                                        <Avatar
                                          style={{
                                            backgroundColor: "#0D3293",
                                          }}
                                        >
                                          {item.full_name[0]}
                                        </Avatar>
                                      </span>
                                      <span
                                        style={{
                                          marginLeft: "10px",
                                          paddingTop: "20px",
                                        }}
                                      >
                                        {item.full_name}
                                      </span>
                                    </h6>
                                    <br />

                                    <hr />
                                  </div>
                                  {/*  */}
                                  <GetReportComponent staffId={item.ID} />
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

export default StaffReportComponent;
