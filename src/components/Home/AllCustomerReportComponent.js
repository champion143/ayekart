import "date-fns";
import React, { Component } from "react";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

import PDFOutlineIcon from "../../assets/PDFOutlineIcon.png";
import CalendarIcon from "../../assets/CalendarIcon.png";
import { Col, Container, Row } from "reactstrap";
import { FormControl, Input, InputLabel, TextField } from "@material-ui/core";
import { Search, ViewArray } from "@material-ui/icons";
import { APIURL } from "../constants/APIURL";
import Cookies from "universal-cookie/es6";
import { validateLogin } from "../constants/functions";
import LoadingComponent from "../LoadingComponent";

import moment from "moment";

import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";
import BottomBarComponent from "../BottomBarComponent";
import LangConvertComponent from "../LangConvertComponent";

class AllCustomerReportComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      cookies: new Cookies(),
      customerId: this.props.match.params.id,
      data: {},
      isLoading: true,
      notFound: false,

      //
      startDateOpen: false,
      endDateOpen: false,
      searchQuery: "",

      //
      paidSum: 0,
      collectedSum: 0,
      entries: [],
      startDate: "",
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

    var SearchResult = this.state.data.filter((item) =>
      (item.first_name + " " + item.last_name)
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    if (value.length <= 0) {
      this.setState({
        isLoading: true,
      });
      this.getUserReports();
    } else {
      this.setState({
        data: SearchResult,
      });
    }
  }
  generatePDF = () => {
    toast("Generating PDF. Download starts automatically");
    const doc = new jsPDF();
    const tableColumns = ["Name", "Info", "Date", "Entry Type", "Amount"];
    var tableRows = [];
    this.state.data.forEach((item) => {
      const tableItem = [
        item.first_name + " " + item.last_name,
        item.item_name,
        moment(item.CreatedAt).format("MMMM Do YYYY"),
        item.entry_type === "to_collect"
          ? "To Collect"
          : item.entry_type === "paid"
          ? "Paid"
          : item.entry_type === "to_pay"
          ? "To Pay"
          : item.entry_type === "collected"
          ? "Collected"
          : "",
        item.entry_type === "to_collect"
          ? "Rs. " + item.to_collect
          : item.entry_type === "paid"
          ? "Rs. " + item.paid
          : item.entry_type === "to_pay"
          ? "Rs. " + item.to_pay
          : item.entry_type === "collected"
          ? "Rs. " + item.collected
          : "",
      ];
      tableRows.push(tableItem);
    });
    doc.text("Customers Report", 40, 20, "center");
    doc.autoTable(tableColumns, tableRows, { startY: 30, startX: 40 });
    doc.save(`Report_${this.state.userInfo.ID}`);
  };

  handleStartDateChange = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    var startDate = [year, month, day].join("-");
    console.log(startDate);
    this.setState({
      startDate: startDate,
      startDateOpen: false,
    });
    this.getUserReports(startDate, this.state.endDate);
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
      endDateOpen: false,
    });
    this.getUserReports(this.state.startDate, endDate);
  };

  getUserReports = (startDate = "2021-01-01", endDate = "2021-02-22") => {
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
        console.log(result);
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

        console.log(collectedPaidArr);

        this.setState({
          isLoading: false,
          data: result.data,
          entries: collectedPaidArr,
          collectedSum: collectedSum,
          paidSum: paidSum,
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
        this.getUserReports(this.state.startDate, endDate);
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
    // if (this.state.notFound) {
    //   return <React.Fragment>User Not Found</React.Fragment>;
    // }
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

                  <div className="SpecificMainDiv">
                    <div className="SpecificTopDiv">
                      <Container fluid>
                        <Row>
                          <Col sm="1">
                            <div
                              style={{ cursor: "pointer" }}
                              className="SpecificTopDivItemsDiv"
                              onClick={() => this.generatePDF()}
                            >
                              <img
                                src={PDFOutlineIcon}
                                className="img-fluid"
                                style={{ width: "30px" }}
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
                          <Col sm>
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
                                  <LangConvertComponent name="search_customer" />
                                }
                                fullWidth
                                name="searchQuery"
                                value={this.state.searchQuery}
                                onChange={this.handleSearchChange}
                              />
                            </div>
                          </Col>
                        </Row>
                      </Container>
                    </div>

                    <div className="SpecificSecondDiv">
                      <Container>
                        <Row>
                          <Col sm xs>
                            <div>
                              <h6>
                                <LangConvertComponent name="total" />
                              </h6>
                              <p>({this.state.data.length} Entries)</p>
                            </div>
                          </Col>

                          <Col sm xs>
                            <div>
                              <h6>
                                <LangConvertComponent name="entry_type" />
                              </h6>
                              {/* <p>
                                <b>{this.state.paidSum}</b>
                              </p> */}
                            </div>
                          </Col>
                          <Col sm xs>
                            <div>
                              <h6>
                                <LangConvertComponent name="amount" />
                              </h6>
                              {/* <p>
                                <b>{this.state.collectedSum}</b>
                              </p> */}
                            </div>
                          </Col>
                        </Row>
                      </Container>
                    </div>

                    <div className="SpecificThirdDiv">
                      <Container fluid>
                        {
                          this.state.data.length == 0 && 
                          <div className="HomeThirdDivItemDiv">
                            no entries found and result need to be clear
                          </div>
                        }
                        {this.state.data.length > 0 &&
                          this.state.data.map((item) => (
                            <div className="HomeThirdDivItemDiv">
                              <Row>
                                <Col
                                  sm
                                  className="d-flex justify-content-center"
                                >
                                  <div>
                                    <h5 id="BlueColorText">
                                      {item.first_name + " " + item.last_name}
                                    </h5>
                                    <h6>{item.item_name}</h6>
                                    <p>
                                      {moment(item.CreatedAt).format(
                                        "MMMM Do YYYY, h:mm a"
                                      )}
                                    </p>
                                  </div>
                                </Col>
                                <Col
                                  sm
                                  className="d-flex justify-content-center"
                                >
                                  <div style={{ padding: "20px" }}>
                                    {item.entry_type === "to_collect" ? (
                                      <h6>To Collect</h6>
                                    ) : item.entry_type === "paid" ? (
                                      <h6>Paid</h6>
                                    ) : item.entry_type === "collected" ? (
                                      <h6>Collected</h6>
                                    ) : item.entry_type === "to_pay" ? (
                                      <h6>To Pay</h6>
                                    ) : (
                                      <h6></h6>
                                    )}
                                  </div>
                                </Col>
                                <Col
                                  sm
                                  className="d-flex justify-content-center"
                                >
                                  <div style={{ padding: "20px" }}>
                                    {item.entry_type === "to_collect" ? (
                                      <h6>₹ {item.to_collect}</h6>
                                    ) : item.entry_type === "paid" ? (
                                      <h6>₹ {item.paid}</h6>
                                    ) : item.entry_type === "collected" ? (
                                      <h6>₹ {item.collected}</h6>
                                    ) : item.entry_type === "to_pay" ? (
                                      <h6>₹ {item.to_pay}</h6>
                                    ) : (
                                      <h6></h6>
                                    )}
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          ))}
                      </Container>
                    </div>
                  </div>
                </div>
              </div>
              <BottomBarComponent />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AllCustomerReportComponent;
