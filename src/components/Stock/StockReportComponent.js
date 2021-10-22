import "date-fns";
import React, { Component } from "react";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

import PDFOutlineIcon from "../../assets/PDFOutlineIcon.png";
import CalendarIcon from "../../assets/CalendarIcon.png";
import { Col, Container, Row } from "reactstrap";
import { FormControl, Input, InputLabel, TextField } from "@material-ui/core";
import { Search, ViewArray } from "@material-ui/icons";
import { APIURL, APIURLNEW } from "../constants/APIURL";
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
import LangConvertComponent from "../LangConvertComponent";

class StockReportComponent extends Component {
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
      purchaseSum: 0,
      soldSum: 0,
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
      item.item_name.toString().toLowerCase().includes(value.toLowerCase())
    );
    if (value.length <= 0) {
      this.setState({
        isLoading: true,
      });
      this.getStockReport(this.state.startDate, this.state.endDate);
    } else {
      this.setState({
        data: SearchResult,
      });
    }
  }
  generatePDF = () => {
    toast("Generating PDF. Download starts automatically");
    const doc = new jsPDF();
    const tableColumns = ["Item", "Entry Type", "Amount"];
    var tableRows = [];
    this.state.data.forEach((item1) => {
      item1.stock_entry_log.forEach((item) => {
        const tableItem = [
          item1.item_name,
          item.entry_type === "purchased"
            ? "Purchased"
            : item.entry_type === "damaged"
            ? "Damaged"
            : item.entry_type === "returned"
            ? "Returned"
            : item.entry_type === "sold"
            ? "Sold"
            : "",
          item1.item_purchased + " Units - " + "Rs. " + item1.purchased_value,
        ];
        tableRows.push(tableItem);
      });
    });
    doc.text("Stock Report", 40, 20, "center");
    doc.autoTable(tableColumns, tableRows, { startY: 30, startX: 40 });
    doc.save(`Stock_Report_${this.state.userInfo.ID}`);
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
    this.getStockReport(startDate, this.state.endDate);
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
    this.getStockReport(this.state.startDate, endDate);
  };

  getStockReport = (startDate = "2021-01-01", endDate = "2021-02-22") => {
    this.setState({
      isLoading: true,
    });
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      // APIURL +
      //   "/user/" +
      //   this.state.userInfo.ID +
      //   "/business/" +
      //   this.state.userInfo.business.ID +
      //   "/stock/report?from=" +
      //   startDate +
      //   "&to=" +
      //   endDate,
      // requestOptions

      APIURLNEW +
        "/hisab/stock_entries/stock_entry_log/getall"+
        "?business_id=" +
        this.state.userInfo.business.ID +
        "&from=" +
        startDate +
        "&to=" +
        endDate,
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          throw Error("No Customer");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result.Data);
        var purchaseSum = 0;
        var soldSum = 0;

        var purchaseSoldArr = [];
        if (result.Data.length > 0) {
          // purchaseSoldArr = result.Data.filter(
          //   (item) => item.stock_entry_log.length !== 0
          // );

          purchaseSoldArr = result.Data;

          var entryArr = [];

          purchaseSoldArr.forEach((entry) => {
              if (entry.entry_type === "sold") {
                soldSum += entry.sold_value;
              }
              if (entry.entry_type === "purchase") {
                purchaseSum += entry.purchased_value;
              }
              entryArr.push(entry);
          });

          console.log("purchaseSoldArr");
          console.log(purchaseSoldArr);
          console.log("purchaseSoldArr1");

          // purchaseSoldArr.forEach((item) => {
          //   item.stock_entry_log.forEach((entry) => {
          //     if (entry.entry_type === "sold") {
          //       soldSum += entry.sold_value;
          //     }
          //     if (entry.entry_type === "purchase") {
          //       purchaseSum += entry.purchased_value;
          //     }
          //     entryArr.push(entry);
          //   });
          // });
        }
        this.setState({
          isLoading: false,
          data: purchaseSoldArr,
          entries: entryArr,
          purchaseSum: purchaseSum,
          soldSum: soldSum,
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
        var startDate = [year, month, "01"].join("-");
        this.setState({
          startDate: startDate,
          endDate: endDate,
        });
        this.getStockReport(this.state.startDate, endDate);
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
              <SidebarComponent activePage="Stock" />
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
                                  <LangConvertComponent name="search_item" />
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
                                <LangConvertComponent name="items" />
                              </h6>
                              {/* <p>({this.state.data.length} Entries)</p> */}
                            </div>
                          </Col>

                          <Col sm xs>
                            <div>
                              <h6>
                                <LangConvertComponent name="entry_type" />
                              </h6>
                              {/* <p>
                                <b>{this.state.purchaseSum}</b>
                              </p> */}
                            </div>
                          </Col>
                          <Col sm xs>
                            <div>
                              <h6>
                                <LangConvertComponent name="amount" />
                              </h6>
                              {/* <p>
                                <b>{this.state.soldSum}</b>
                              </p> */}
                            </div>
                          </Col>
                        </Row>
                      </Container>
                    </div>

                    <div className="SpecificThirdDiv">
                      <Container fluid>
                        {this.state.data.length > 0 &&
                          this.state.data.map((item1) =>
                            // item1.stock_entry_log.map((item) => (
                            //   <div className="HomeThirdDivItemDiv">
                            //     <Row>
                            //       <Col
                            //         sm
                            //         className="d-flex justify-content-center"
                            //       >
                            //         <div>
                            //           <h5 id="BlueColorText">
                            //             {item1.item_name}
                            //           </h5>
                            //           {/* <h6>{item.item_name}</h6> */}
                            //           <p>
                            //             {moment(item.CreatedAt).format(
                            //               "MMMM Do YYYY, h:mm a"
                            //             )}
                            //           </p>
                            //         </div>
                            //       </Col>
                            //       <Col
                            //         sm
                            //         className="d-flex justify-content-center"
                            //       >
                            //         <div>
                            //           <h6>
                            //             {item.entry_type === "purchased"
                            //               ? "Purchased"
                            //               : item.entry_type === "damaged"
                            //               ? "Damaged"
                            //               : item.entry_type === "returned"
                            //               ? "Returned"
                            //               : item.entry_type === "sold"
                            //               ? "Sold"
                            //               : ""}
                            //           </h6>
                            //         </div>
                            //       </Col>
                            //       <Col
                            //         sm
                            //         className="d-flex justify-content-center"
                            //       >
                            //         <div id="BlueColorText">
                            //           <h6>{item1.item_purchased + " Units"}</h6>
                            //           <h6>{"₹ " + item1.purchased_value}</h6>
                            //         </div>
                            //       </Col>
                            //     </Row>
                            //   </div>
                            // ))

                            
                              <div className="HomeThirdDivItemDiv">
                                <Row>
                                  <Col
                                    sm
                                    className="d-flex justify-content-center"
                                  >
                                    <div>
                                      <h5 id="BlueColorText">
                                        {item1.item_name}
                                      </h5>
                                      {/* <h6>{item.item_name}</h6> */}
                                      <p>
                                        {moment(item1.created_at).format(
                                          "MMMM Do YYYY, h:mm a"
                                        )}
                                      </p>
                                    </div>
                                  </Col>
                                  <Col
                                    sm
                                    className="d-flex justify-content-center"
                                  >
                                    <div>
                                      <h6>
                                        {item1.entry_type === "purchased"
                                          ? "Purchased"
                                          : item1.entry_type === "damaged"
                                          ? "Damaged"
                                          : item1.entry_type === "returned"
                                          ? "Returned"
                                          : item1.entry_type === "sold"
                                          ? "Sold"
                                          : ""}
                                      </h6>
                                    </div>
                                  </Col>
                                  <Col
                                    sm
                                    className="d-flex justify-content-center"
                                  >
                                    <div id="BlueColorText">
                                      <h6>{
                                        item1.entry_type === "purchased"
                                        ? item1.item_purchased
                                        : item1.entry_type === "damaged"
                                        ? item1.item_damaged
                                        : item1.entry_type === "returned"
                                        ? item1.item_returned
                                        : item1.entry_type === "sold"
                                        ? item1.item_sold
                                        : ""}
                                        { " Units" }
                                        </h6>
                                      <h6>{"₹ " + item1.purchased_value}</h6>
                                    </div>
                                  </Col>
                                </Row>
                              </div>


                          )}
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

export default StockReportComponent;
