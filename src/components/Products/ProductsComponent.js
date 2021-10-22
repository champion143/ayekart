import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

import RightArrowImg from "../../assets/RightArrow.png";

import SearchIcon from "../../assets/SearchIcon.png";
import FilterIcon from "../../assets/FilterIcon.png";
import AddIcon from "../../assets/AddIcon.png";
import DownArrowImg from "../../assets/DownArrow.png";
import { Menu, MenuItem } from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Bar } from "react-chartjs-2";
import DateFnsUtils from "@date-io/date-fns";

import HeaderDp from "../../assets/headerdp.png";

import CallIcon from "../../assets/CallIcon.png";

import RemindIcon from "../../assets/RemindIcon.png";
import PaynowIcon from "../../assets/PaynowIcon.png";
import CollectnowIcon from "../../assets/CollectnowIcon.png";
import Cookies from "universal-cookie/es6";
import { APIURL, APIURLNEW } from "../constants/APIURL";
import { validateLogin } from "../constants/functions";
import LoadingComponent from "../LoadingComponent";
import ProductsEmptyComponent from "./ProductsEmptyComponent";

import AyekartHisabLogo from "../../assets/AyekartHisabLogo.png";

import moment from "moment";
import { Link } from "react-router-dom";
import { TextField } from "@material-ui/core";
import BottomBarComponent from "../BottomBarComponent";
import LangConvertComponent from "../LangConvertComponent";

class ProductsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      userInfo: {},
      isLoading: true,
      isEmpty: false,
      data: {},
      mostRecent: true,
      searchQuery: "",
      searchClicked: false,
      products: [],



      //
      isMonthly: true,
      anchorEl: null,
      dateOpen: false,
      startDate: "",
      endDate: "",
      selectedDate: new Date(),

      //Graph Values
      soldSum: 0,
      returnedSum: 0,
      purchasedSum: 0,
      damagedSum: 0,
      total_purchased: 0,
      total_sold: 0,
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

    var SearchResult = this.state.products.filter((item) =>
      item.product_name.toString().toLowerCase().includes(value.toLowerCase())
    );
    if (value.length <= 0) {
      this.setState({
        isLoading: true,
      });
      this.getProducts();
    } else {
      this.setState({
        products: SearchResult,
      });
    }
  }

  getProducts = (mostRecent = true) => {
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
        "/products",
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          throw Error("Something error");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        if (result.data.length <= 0) {
          this.setState({
            isEmpty: true,
            isLoading: false,
          });
        } else {
          this.setState({
            isEmpty: false,
            isLoading: false,
            data: result.data,
            // products: mostRecent === true ? result.data.reverse() : result.data,
            products: mostRecent === true ? result.data : result.data.reverse(),
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  getDashboard = (endDate = new Date()) => {
    this.setState({
      isLoading: true,
    });
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    console.log("endDate" + endDate);
    let ApiUrl = '';

    let d = new Date(endDate);
    let y = d.getFullYear();

    if(this.state.isMonthly) {
      ApiUrl = APIURLNEW + "/hisab/charts/monthly?business_id=2&monthly=monthly&year="+y;
    } else {
      ApiUrl = APIURLNEW + "/hisab/charts/yearly?business_id=2&yearly=yearly";
    }
    fetch(
      ApiUrl,
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          throw Error("Error");
        }
        return response.json();
      })
      .then((result) => {
        var soldSum = 0;
        var returnedSum = 0;
        var purchasedSum = 0;
        var damagedSum = 0;
        var total_purchased = 0;
        var total_sold = 0;
        result.Data.forEach((item) => {
          total_purchased += parseFloat(item.sum);
        });
        this.setState({
          isLoading: false,
          soldSum: soldSum,
          returnedSum: returnedSum,
          purchasedSum: purchasedSum,
          damagedSum: damagedSum,
          total_purchased: total_purchased,
          total_sold: total_sold,
        });
      })
      .catch((error) => console.log("error", error));
  };

  handleEndDateChange = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    var startDate;
    var endDate;
    if (this.state.isMonthly) {
      startDate = [year, month, "01"].join("-");
      endDate = [year, month, new Date(year, month, 0).getDate()].join("-");
    } else {
      startDate = [year, "01", "01"].join("-");
      endDate = [year, "12", new Date(year, "12", 0).getDate()].join("-");
    }
    this.setState({
      selectedDate: date,
      startDate: startDate,
      endDate: endDate,
      dateOpen: false,
    },this.getDashboard(endDate));
  };

  componentDidMount() {
    validateLogin
      .then((res) => {
        this.setState({
          userInfo: this.state.cookies.get("userInfo"),
        });
        this.getProducts();
        this.getDashboard();
      })
      .catch((err) => (window.location.href = "/login"));
  }
  handleIsMonthClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };
  handleMonthlyOptions = (option) => {
    if (option === "Yearly") {
      this.setState({
        isMonthly: false,
        anchorEl: null,
      });
    } else {
      this.setState({
        isMonthly: true,
        anchorEl: null,
      });
    }
  };
  handleIsMonthClose = () => {
    this.setState({
      anchorEl: null,
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
    if (this.state.isEmpty) {
      return (
        <React.Fragment>
          <ProductsEmptyComponent />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-0 nopadding">
              <SidebarComponent activePage="Products" />
            </div>

            <div className="col-sm-12 nopadding">
              <div className="PageContentMainDiv">
                <div className="PageContentContentDiv">
                  {/* <HeaderComponent /> */}

                  

                  <div className="HomeMainDiv">

                  <div className="HomeTopDiv">
                      <Row>
                        <Col sm xs>
                          <div>
                            <h6
                              onClick={this.handleIsMonthClick}
                              style={{ cursor: "pointer" }}
                            >
                              {this.state.isMonthly ? "Monthly" : "Yearly"}
                              <span>
                                <img
                                  src={DownArrowImg}
                                  className="img-fluid"
                                  style={{ width: "20px" }}
                                />
                              </span>
                            </h6>
                            <Menu
                              anchorEl={this.state.anchorEl}
                              keepMounted
                              open={Boolean(this.state.anchorEl)}
                              onClose={this.handleIsMonthClose}
                            >
                              <MenuItem
                                onClick={() =>
                                  this.handleMonthlyOptions("Monthly")
                                }
                              >
                                <LangConvertComponent name="monthly" />
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  this.handleMonthlyOptions("Yearly")
                                }
                              >
                                Yearly
                              </MenuItem>
                            </Menu>
                          </div>
                        </Col>

                        <Col sm xs>
                          <div>
                            {this.state.dateOpen ? (
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
                                  value={this.state.selectedDate}
                                  onChange={this.handleEndDateChange}
                                  KeyboardButtonProps={{
                                    "aria-label": "change date",
                                  }}
                                  views={
                                    this.state.isMonthly
                                      ? ["year", "month"]
                                      : ["year"]
                                  }
                                  autoOk={true}
                                  open={this.state.dateOpen}
                                  onClose={() =>
                                    this.setState({ dateOpen: false })
                                  }
                                />
                              </MuiPickersUtilsProvider>
                            ) : (
                              <div>
                                <h6
                                  onClick={() =>
                                    this.setState({ dateOpen: true })
                                  }
                                >
                                  {this.state.isMonthly
                                    ? moment(this.state.selectedDate).format(
                                        "MMM YYYY"
                                      )
                                    : moment(this.state.selectedDate).format(
                                        "YYYY"
                                      )}
                                  <span>
                                    <img
                                      src={DownArrowImg}
                                      className="img-fluid"
                                      style={{ width: "20px" }}
                                    />
                                  </span>
                                </h6>
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col sm>
                          <div>
                            <Bar
                              data={{
                                labels: [
                                  "Purchased"
                                ],
                                datasets: [
                                  {
                                    label: "Units",
                                    backgroundColor: [
                                      "#FFCC80"
                                    ],
                                    hoverBackgroundColor: [
                                      "#FB8C00"
                                    ],
                                    data: [
                                      this.state.purchasedSum
                                    ],
                                  },
                                ],
                              }}
                              options={{
                                legend: {
                                  display: false,
                                  position: "right",
                                },
                              }}
                            />
                          </div>
                        </Col>

                        <Col sm>
                          <div
                            style={{ textAlign: "center", marginTop: "80px" }}
                          >
                            <Row>
                              <Col sm="0" xs="0" className="">
                                <div>
                                  <h6>
                                    <LangConvertComponent name="product_purchased" />
                                  </h6>
                                </div>
                              </Col>
                              <Col sm xs className="nopadding">
                                <div>
                                  <h6>₹ {this.state.total_purchased}</h6>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <div className="HomeSecondDiv">
                      <div
                        className={
                          this.state.mostRecent
                            ? "HomeBlueButton"
                            : "HomeWhiteButton"
                        }
                        style={{ float: "left", margin: "6px" }}
                        onClick={() => {
                          this.setState({
                            mostRecent: !this.state.mostRecent,
                          });
                          this.getProducts(!this.state.mostRecent);
                        }}
                      >
                        <h6>
                          <LangConvertComponent name="most_recent" />
                        </h6>
                      </div>
                      <div
                        className={
                          !this.state.mostRecent
                            ? "HomeBlueButton"
                            : "HomeWhiteButton"
                        }
                        style={{ float: "left", margin: "6px" }}
                        onClick={() => {
                          this.setState({
                            mostRecent: !this.state.mostRecent,
                          });
                          this.getProducts(!this.state.mostRecent);
                        }}
                      >
                        <h6>
                          <LangConvertComponent name="oldest" />
                        </h6>
                      </div>

                      <div
                        className="HomeSecondDivRightIcons"
                        style={{ float: "right" }}
                      >
                        {this.state.searchClicked ? (
                          <span className="HomeSecondDivRightIconItem">
                            <TextField
                              inputProps={{
                                style: { backgroundColor: "white" },
                              }}
                              autoFocus
                              variant="filled"
                              label={
                                <LangConvertComponent name="search_item" />
                              }
                              name="searchQuery"
                              value={this.state.searchQuery}
                              onChange={this.handleSearchChange}
                            />
                          </span>
                        ) : (
                          <span
                            className="HomeSecondDivRightIconItem"
                            onClick={() => {
                              this.setState({
                                searchClicked: true,
                              });
                            }}
                          >
                            <img src={SearchIcon} style={{ width: "20px" }} />
                          </span>
                        )}
                        {/* <span className="HomeSecondDivRightIconItem">
                          <img src={FilterIcon} style={{ width: "20px" }} />
                        </span> */}
                        <Link to="/addproduct">
                          <span
                            className="HomeSecondDivRightIconItem"
                            style={{ cursor: "pointer" }}
                          >
                            <img src={AddIcon} style={{ width: "20px" }} />
                          </span>
                        </Link>
                      </div>
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br className="d-block d-sm-none" />
                    <br className="d-block d-sm-none" />
                    <br className="d-block d-sm-none" />
                    <br className="d-block d-sm-none" />


                    <div className="HomeThirdDiv">
                      <Container fluid>
                        <Row>
                          {this.state.products.map((item) => (
                            <Col sm="5" className="HomeThirdDivItemDiv">
                              <Link
                                to={`/updateproduct/${item.ID}`}
                                id="NoHoverLink"
                              >
                                <div>
                                  <p style={{ textAlign: "right" }}>
                                    {moment(item.UpdatedAt).format(
                                      "MMMM Do YYYY, h:mm a"
                                    )}
                                  </p>
                                  <Row>
                                    <Col sm="3" className="nopadding">
                                      <div style={{ margin: "20px" }}>
                                        <img
                                          src={
                                            item.product_image_URL === ""
                                              ? AyekartHisabLogo
                                              : item.product_image_URL
                                          }
                                          className="img-fluid"
                                          style={{ width: "100px" }}
                                        />
                                      </div>
                                    </Col>

                                    <Col
                                      sm
                                      className="nopaadding"
                                      style={{ margin: "10px !important" }}
                                    >
                                      <div>
                                        <h6>{item.product_name}</h6>
                                        <h6>
                                          <LangConvertComponent name="unit_of_measurement" />
                                          :{" "}
                                          <span id="BlueColorText">
                                            {item.measurement_unit}
                                          </span>
                                        </h6>
                                        <h6>
                                        <LangConvertComponent name="buying_price" /> :{" "}
                                          <span id="BlueColorText">
                                            ₹ {item.buying_price}
                                          </span>
                                        </h6>
                                        <h6>
                                        <LangConvertComponent name="selling_price" /> :{" "}
                                          <span id="BlueColorText">
                                            ₹ {item.selling_price}
                                          </span>
                                        </h6>
                                        <h6>
                                          Pack size :{" "}
                                          <span id="BlueColorText">
                                            {item.pack_size}
                                          </span>
                                        </h6>
                                        <h6>
                                          Originated from :{" "}
                                          <span id="BlueColorText">
                                            {item.originated_from}
                                          </span>
                                        </h6>
                                        <h6>
                                          SKU :{" "}
                                          <span id="BlueColorText">
                                            {item.sku}
                                          </span>
                                        </h6>
                                        <h6>
                                        <LangConvertComponent name="gst" /> :{" "}
                                          <span id="BlueColorText">
                                            {item.gst}%
                                          </span>
                                        </h6>
                                        <h6>
                                        <LangConvertComponent name="presense" /> :{" "}
                                          <span id="BlueColorText">
                                            {item.presence === true
                                              ? "Online"
                                              : "Offline"}
                                          </span>
                                        </h6>
                                      </div>
                                    </Col>
                                  </Row>
                                </div>
                              </Link>
                            </Col>
                          ))}
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

export default ProductsComponent;
