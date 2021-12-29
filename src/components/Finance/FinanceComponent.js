import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

import BankIcon from "../../assets/BankIcon.png";
import RightArrowBlack from "../../assets/RightArrowBlack.png";
import InvoiceIcon from "../../assets/InvoiceIcon.png";
import RequestMoneyIcon from "../../assets/RequestMoneyIcon.png";
import { Line } from "react-chartjs-2";
import { ArrowDownward, ExpandMore } from "@material-ui/icons";
import { validateLogin } from "../constants/functions";
import Cookies from "universal-cookie/es6";
import { APIURL } from "../constants/APIURL";
import LoadingComponent from "../LoadingComponent";
import "date-fns";

import DateFnsUtils from "@date-io/date-fns";
import {
  DatePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Link } from "react-router-dom";

import moment from "moment";
import BottomBarComponent from "../BottomBarComponent";
import LangConvertComponent from "../LangConvertComponent";

class FinanceComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cookies: new Cookies(),
      userInfo: {},
      data: {},
      homeData: {},
      totalPendingMoney: 0,
      isLoading: true,
      selectedDate: new Date(),
      endDate: "",
      startDate: "",
      dateClicked: false,

      //
      totalCollectedMoney: 0,
      totalMoneyGiven: 0,
      collectedMoney: {},
      moneyGiven: {},
    };
  }
  handleDateChange = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    var endDate = [year, month, new Date(year, month, 0).getDate()].join("-");
    var startDate = [year, month, "01"].join("-");
    this.setState({
      selectedDate: date,
      endDate: endDate,
      startDate: startDate,
      dateClicked: false,
    });
    console.log(endDate);
    this.getFinanceData(startDate, endDate);
  };
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
        var totalPendingMoney = 0;
        result.data.customers.forEach((item) => {
          totalPendingMoney += item.to_collect - item.collected;
        });
        this.setState({
          isLoading: false,
          homeData: result.data,
          totalPendingMoney: totalPendingMoney,
        });
      })
      .catch((error) => console.log("error", error));
  };
  getFinanceData = (
    startDate = this.state.startDate,
    endDate = this.state.endDate
  ) => {
    this.setState({
      isLoading: true,
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
        "/finance/graph?from=" +
        startDate +
        "&to=" +
        endDate,
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

        var totalCollected = 0;
        var totalGiven = 0;
        result.data.forEach((item) => {
          totalCollected += item.collected_money;
          totalGiven += item.money_given;
        });

        var collectedMoney = {};
        var moneyGiven = {};

        result.data.forEach((item) => {
          if (item.money_given === 0) {
            collectedMoney[new Date(item.date_time).getDate()] =
              item.collected_money;
          } else {
            moneyGiven[new Date(item.date_time).getDate()] = item.money_given;
          }
        });
        console.log(collectedMoney);
        this.setState({
          data: result.data,
          isLoading: false,
          totalCollectedMoney: totalCollected,
          totalMoneyGiven: totalGiven,
          collectedMoney: collectedMoney,
          moneyGiven: moneyGiven,
        });
      })
      .catch((error) => console.log("error", error));
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

        var endDate = [year, month, "31"].join("-");
        var startDate = [year, month, "01"].join("-");
        this.setState({
          endDate: endDate,
          startDate: startDate,
        });
        this.getFinanceData();
        this.getHomeDetails(this.state.cookies.get("userInfo"));
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
    return (
      <React.Fragment>
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
                    <br />
                    <br />

                    <div className="HomeThirdDiv">
                      <Container fluid>
                        <Row>
                          <Col sm className="HomeThirdDivItemDiv">
                            <div>
                              <Row>
                                <Col sm xs="0">
                                  <div></div>
                                </Col>
                                <Col sm xs>
                                  <div>
                                    <h6>
                                      <LangConvertComponent name="collected_money" />
                                    </h6>
                                    <p id="BlueColorText">
                                      ₹ {this.state.totalCollectedMoney}
                                    </p>
                                  </div>
                                </Col>
                                <Col sm xs>
                                  <div>
                                    <h6>
                                      <LangConvertComponent name="money_paid" />
                                    </h6>
                                    <p id="BlueColorText">
                                      ₹ {this.state.totalMoneyGiven}
                                    </p>
                                  </div>
                                </Col>
                              </Row>

                              <div>
                                <Line
                                  data={{
                                    labels: Object.keys(
                                      this.state.collectedMoney
                                    ),

                                    datasets: [
                                      {
                                        label: "Collected Money",
                                        fill: false,
                                        lineTension: 0.1,
                                        backgroundColor: "rgba(75,192,192,0.4)",
                                        borderColor: "rgba(75,192,192,1)",
                                        borderCapStyle: "butt",
                                        borderDash: [],
                                        borderDashOffset: 0.0,
                                        borderJoinStyle: "miter",
                                        pointBorderColor: "rgba(75,192,192,1)",
                                        pointBackgroundColor: "#fff",
                                        pointBorderWidth: 10,
                                        pointHoverRadius: 10,
                                        pointHoverBackgroundColor:
                                          "rgba(75,192,192,1)",
                                        pointHoverBorderColor:
                                          "rgba(220,220,220,1)",
                                        pointHoverBorderWidth: 2,
                                        pointRadius: 1,
                                        pointHitRadius: 10,
                                        data: Object.values(
                                          this.state.collectedMoney
                                        ),
                                      },
                                      {
                                        label: "Money Paid",
                                        fill: false,
                                        lineTension: 0.1,
                                        backgroundColor: "#0d3293",
                                        borderColor: "#0d3293",
                                        borderCapStyle: "butt",
                                        borderDash: [],
                                        borderDashOffset: 0.0,
                                        borderJoinStyle: "miter",
                                        pointBorderColor: "#0d3293",
                                        pointBackgroundColor: "#0d3293",
                                        pointBorderWidth: 10,
                                        pointHoverRadius: 10,
                                        pointHoverBackgroundColor: "#0d3293",
                                        pointHoverBorderColor: "#0d3293",
                                        pointHoverBorderWidth: 2,
                                        pointRadius: 1,
                                        pointHitRadius: 10,
                                        data: Object.values(
                                          this.state.moneyGiven
                                        ),
                                      },
                                    ],
                                    options: {
                                      scales: {
                                        yAxes: [
                                          {
                                            scaleLabel: {
                                              display: true,
                                              labelString: "probability",
                                            },
                                          },
                                        ],
                                      },
                                    },
                                  }}
                                />
                              </div>

                              <div style={{ textAlign: "center" }}>
                                {/* <h6>
                                  November
                                  <span>
                                    <ExpandMore />
                                  </span>
                                </h6> */}

                                {this.state.dateClicked ? (
                                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                      margin="normal"
                                      id="date-picker-dialog"
                                      label="Date picker dialog"
                                      format="dd/MM/yyyy"
                                      views={["year", "month"]}
                                      value={this.state.selectedDate}
                                      onChange={this.handleDateChange}
                                      KeyboardButtonProps={{
                                        "aria-label": "change date",
                                      }}
                                      autoOk={true}
                                      open={this.state.dateClicked}
                                      onClose={() =>
                                        this.setState({ dateClicked: false })
                                      }
                                    />
                                  </MuiPickersUtilsProvider>
                                ) : (
                                  <div
                                    onClick={() => {
                                      this.setState({
                                        dateClicked: true,
                                      });
                                    }}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <h6>
                                      {moment(this.state.selectedDate).format(
                                        "MMMM YYYY"
                                      )}
                                      <span>
                                        <ExpandMore />
                                      </span>
                                    </h6>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Container>
                    </div>

                    <div className="FinanceSecondDiv">
                      <Container fluid>
                        <Row>
                          <Col sm className="HomeThirdDivItemDiv">
                            <Row>
                              <Col sm="0" xs="0">
                                <div>
                                  <img
                                    src={InvoiceIcon}
                                    className="img-fluid"
                                    style={{
                                      width: "40px",
                                      marginLeft: "20px",
                                    }}
                                  />
                                </div>
                              </Col>
                              <Col sm xs>
                                {/* <Link to="/createinvoice" id="NoHoverLink"> */}
                                <Link to={`/customercreateinvoice/${this.state.userInfo.first_name + " " + this.state.userInfo.last_name }/${this.state.userInfo.mobile}`} id="NoHoverLink">
                                  <div>
                                    <h6>
                                      <LangConvertComponent name="create_invoice" />
                                    </h6>
                                    <p>Choose invoice for your products</p>
                                  </div>
                                </Link>
                              </Col>
                            </Row>
                          </Col>

                          <Col sm className="HomeThirdDivItemDiv">
                            <Row>
                              <Col sm="0" xs="0">
                                <div>
                                  <img
                                    src={RequestMoneyIcon}
                                    className="img-fluid"
                                    style={{
                                      width: "40px",
                                      marginLeft: "20px",
                                    }}
                                  />
                                </div>
                              </Col>
                              <Col sm xs>
                                <Link to="/requestmoney" id="NoHoverLink">
                                  <div>
                                    <h6>
                                      <LangConvertComponent name="request_money" />
                                    </h6>
                                    <p>
                                      ₹ {this.state.totalPendingMoney}{" "}
                                      <LangConvertComponent name="pending" />
                                    </p>
                                  </div>
                                </Link>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
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

export default FinanceComponent;
