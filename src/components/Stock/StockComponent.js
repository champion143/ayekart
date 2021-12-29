import "date-fns";
import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

import RightArrowImg from "../../assets/RightArrow.png";
import DownArrowImg from "../../assets/DownArrow.png";

import SearchIcon from "../../assets/SearchIcon.png";
import FilterIcon from "../../assets/FilterIcon.png";
import AddIcon from "../../assets/AddIcon.png";

import HeaderDp from "../../assets/headerdp.png";

import CallIcon from "../../assets/CallIcon.png";

import RemindIcon from "../../assets/RemindIcon.png";
import PaynowIcon from "../../assets/PaynowIcon.png";
import CollectnowIcon from "../../assets/CollectnowIcon.png";
import { Bar } from "react-chartjs-2";
import Cookies from "universal-cookie/es6";
import { validateLogin } from "../constants/functions";
import { APIURL } from "../constants/APIURL";
import LoadingComponent from "../LoadingComponent";

import moment from "moment";
import { Link } from "react-router-dom";
import { Menu, MenuItem, TextField } from "@material-ui/core";

import DateFnsUtils from "@date-io/date-fns";
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import LangConvertComponent from "../LangConvertComponent";

class StockComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cookies: new Cookies(),
            userInfo: {},
            isLoading: true,
            data: {},
            mostRecent: true,
            searchClicked: false,
            searchQuery: "",
            stock: [],

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
    handleSearchChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });

        var SearchResult = this.state.stock.filter((item) =>
            item.item_name.toString().toLowerCase().includes(value.toLowerCase())
        );
        if (value.length <= 0) {
            this.setState({
                isLoading: true,
            });
            this.getStock();
        } else {
            this.setState({
                stock: SearchResult,
            });
        }
    }
    getDashboard = () => {
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
                APIURL +
                "/user/" +
                this.state.userInfo.ID +
                "/business/" +
                this.state.userInfo.business.ID +
                "/stock/dashboard?from=" +
                this.state.startDate +
                "&to=" +
                this.state.endDate,
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
                result.data.Stocks.forEach((item) => {
                    total_purchased += item.purchased_value;
                    total_sold += item.sold_value;
                    if (item.entry_type == "sold") {
                        soldSum += item.item_sold;
                    }
                    if (item.entry_type == "returned") {
                        returnedSum += item.item_returned;
                    }
                    if (item.entry_type == "purchased") {
                        purchasedSum += item.item_purchased;
                    }
                    if (item.entry_type == "damaged") {
                        damagedSum += item.item_damaged;
                    }
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
                console.log(purchasedSum);
            })
            .catch((error) => console.log("error", error));
    };
    getStock = (mostRecent = true) => {
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
                APIURL +
                "/user/" +
                this.state.userInfo.ID +
                "/business/" +
                this.state.userInfo.business.ID +
                "/stock",
                requestOptions
            )
            .then((response) => {
                if (!response.ok) {
                    throw Error("Something Error");
                }
                return response.json();
            })
            .then((result) => {
                console.log(result);
                this.setState({
                    isLoading: false,
                    data: result.data,
                    // stock: mostRecent === true ? result.data.reverse() : result.data,
                    stock: mostRecent === true ? result.data : result.data.reverse(),
                });
                this.getDashboard();
            })
            .catch((error) => console.log("error", error));
    };
    componentDidMount() {
        validateLogin
            .then((res) => {
                var d = new Date(),
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
                    selectedDate: new Date(),
                    startDate: startDate,
                    endDate: endDate,
                    dateOpen: false,
                });
                this.setState({
                    userInfo: this.state.cookies.get("userInfo"),
                });
                this.getStock();
            })
            .catch((err) => (window.location.href = "/login"));
    }
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
        });
        this.getStock();
    };
    render() {
        if (this.state.isLoading) {
            return ( <
                React.Fragment >
                <
                LoadingComponent / >
                <
                /React.Fragment>
            );
        }
        return ( <
            React.Fragment >
            <
            div className = "container-fluid" >
            <
            div className = "row" >
            <
            div className = "col-sm-0 nopadding" >
            <
            SidebarComponent activePage = "Stock" / >
            <
            /div>

            <
            div className = "col-sm-12 nopadding" >
            <
            div className = "PageContentMainDiv" >
            <
            div className = "PageContentContentDiv" > { /* <HeaderComponent /> */ }

            <
            div className = "HomeMainDiv" >
            <
            div className = "HomeTopDiv" >
            <
            Row >
            <
            Col sm xs >
            <
            div >
            <
            h6 onClick = { this.handleIsMonthClick }
            style = {
                { cursor: "pointer" }
            } > { this.state.isMonthly ? "Monthly" : "Yearly" } <
            span >
            <
            img src = { DownArrowImg }
            className = "img-fluid"
            style = {
                { width: "20px" }
            }
            /> < /
            span > <
            /h6> <
            Menu anchorEl = { this.state.anchorEl }
            keepMounted open = { Boolean(this.state.anchorEl) }
            onClose = { this.handleIsMonthClose } >
            <
            MenuItem onClick = {
                () =>
                this.handleMonthlyOptions("Monthly")
            } >
            <
            LangConvertComponent name = "monthly" / >
            <
            /MenuItem> <
            MenuItem onClick = {
                () =>
                this.handleMonthlyOptions("Yearly")
            } >
            Yearly <
            /MenuItem> < /
            Menu > <
            /div> < /
            Col >

            <
            Col sm xs >
            <
            div > {
                this.state.dateOpen ? ( <
                    MuiPickersUtilsProvider utils = { DateFnsUtils }
                    InputProps = {
                        {
                            color: "white",
                            backgroundColor: "white",
                        }
                    } >
                    <
                    KeyboardDatePicker ref = "testref"
                    margin = "normal"
                    id = "date-picker-dialog"
                    label = "End Date"
                    format = "dd/MM/yyyy"
                    value = { this.state.selectedDate }
                    onChange = { this.handleEndDateChange }
                    KeyboardButtonProps = {
                        {
                            "aria-label": "change date",
                        }
                    }
                    views = {
                        this.state.isMonthly ? ["year", "month"] : ["year"]
                    }
                    autoOk = { true }
                    open = { this.state.dateOpen }
                    onClose = {
                        () =>
                        this.setState({ dateOpen: false })
                    }
                    /> < /
                    MuiPickersUtilsProvider >
                ) : ( <
                    div >
                    <
                    h6 onClick = {
                        () =>
                        this.setState({ dateOpen: true })
                    } > {
                        this.state.isMonthly ?
                        moment(this.state.selectedDate).format(
                            "MMM YYYY"
                        ) : moment(this.state.selectedDate).format(
                            "YYYY"
                        )
                    } <
                    span >
                    <
                    img src = { DownArrowImg }
                    className = "img-fluid"
                    style = {
                        { width: "20px" }
                    }
                    /> < /
                    span > <
                    /h6> < /
                    div >
                )
            } <
            /div> < /
            Col >

            <
            Col sm >
            <
            Link to = "/stockreport"
            id = "NoHoverLink" >
            <
            div >
            <
            h6 >
            <
            LangConvertComponent name = "view_reports" / >
            <
            span >
            <
            img src = { RightArrowImg }
            className = "img-fluid"
            style = {
                { width: "20px" }
            }
            /> < /
            span > <
            /h6> < /
            div > <
            /Link> < /
            Col > <
            /Row>

            <
            Row >
            <
            Col sm >
            <
            div >
            <
            Bar data = {
                {
                    labels: [
                        "Sold",
                        "Returned",
                        "Purchased",
                        "Damaged",
                    ],
                    datasets: [{
                        label: "Units",
                        backgroundColor: [
                            "#81D4FA",
                            "#CE93D8",
                            "#FFCC80",
                            "#ef9a9a",
                        ],
                        hoverBackgroundColor: [
                            "#0288D1",
                            "#8E24AA",
                            "#FB8C00",
                            "#e53935",
                        ],
                        data: [
                            this.state.soldSum,
                            this.state.returnedSum,
                            this.state.purchasedSum,
                            this.state.damagedSum,
                        ],
                    }, ],
                }
            }
            options = {
                {
                    legend: {
                        display: false,
                        position: "right",
                    },
                }
            }
            /> < /
            div > <
            /Col>

            <
            Col sm >
            <
            div style = {
                { textAlign: "center", marginTop: "80px" }
            } >
            <
            Row >
            <
            Col sm = "0"
            xs = "0"
            className = "" >
            <
            div >
            <
            h6 >
            <
            LangConvertComponent name = "stock_sold" / >
            <
            /h6> < /
            div > <
            /Col> <
            Col sm xs className = "" > {
                /* <div
                                                  style={{
                                                    backgroundColor: "#0d3293",
                                                    height: "10px",
                                                    borderRadius: "4px",
                                                    width: "300px",
                                                    marginTop: "6px",
                                                  }}
                                                /> */
            } <
            /Col> <
            Col sm xs className = "nopadding" >
            <
            div >
            <
            h6 > ₹{ this.state.total_sold } < /h6> < /
            div > <
            /Col> < /
            Row > <
            Row >
            <
            Col sm = "0"
            xs = "0"
            className = "" >
            <
            div >
            <
            h6 >
            <
            LangConvertComponent name = "stock_purchased" / >
            <
            /h6> < /
            div > <
            /Col> <
            Col sm xs className = "" > {
                /* <div
                                                  style={{
                                                    backgroundColor: "#0d3293",
                                                    height: "10px",
                                                    borderRadius: "4px",
                                                    width: "300px",
                                                    marginTop: "6px",
                                                    marginLeft: "6px",
                                                  }}
                                                /> */
            } <
            /Col> <
            Col sm xs className = "nopadding" >
            <
            div >
            <
            h6 > ₹{ this.state.total_purchased } < /h6> < /
            div > <
            /Col> < /
            Row > <
            /div> < /
            Col > <
            /Row> < /
            div >

            <
            div className = "HomeSecondDiv" >
            <
            div className = {
                this.state.mostRecent ?
                "HomeBlueButton" : "HomeWhiteButton"
            }
            style = {
                { float: "left", margin: "6px" }
            }
            onClick = {
                () => {
                    this.setState({
                        mostRecent: !this.state.mostRecent,
                    });
                    this.getStock(!this.state.mostRecent);
                }
            } >
            <
            h6 >
            <
            LangConvertComponent name = "most_recent" / >
            <
            /h6> < /
            div > <
            div className = {!this.state.mostRecent ?
                "HomeBlueButton" : "HomeWhiteButton"
            }
            style = {
                { float: "left", margin: "6px" }
            }
            onClick = {
                () => {
                    this.setState({
                        mostRecent: !this.state.mostRecent,
                    });
                    this.getStock(!this.state.mostRecent);
                }
            } >
            <
            h6 >
            <
            LangConvertComponent name = "oldest" / >
            <
            /h6> < /
            div >

            <
            div className = "HomeSecondDivRightIcons"
            style = {
                { float: "right" }
            } > {
                this.state.searchClicked ? ( <
                    span className = "HomeSecondDivRightIconItem" >
                    <
                    TextField inputProps = {
                        {
                            style: { backgroundColor: "white" },
                        }
                    }
                    autoFocus variant = "filled"
                    label = { <
                        LangConvertComponent name = "search_item" / >
                    }
                    name = "searchQuery"
                    value = { this.state.searchQuery }
                    onChange = { this.handleSearchChange }
                    /> < /
                    span >
                ) : ( <
                    span className = "HomeSecondDivRightIconItem"
                    onClick = {
                        () => {
                            this.setState({
                                searchClicked: true,
                            });
                        }
                    } >
                    <
                    img src = { SearchIcon }
                    style = {
                        { width: "20px" }
                    }
                    /> < /
                    span >
                )
            } {
                /* <span className="HomeSecondDivRightIconItem">
                                          <img src={FilterIcon} style={{ width: "20px" }} />
                                        </span> */
            } <
            Link to = "/addstockentry" >
            <
            span className = "HomeSecondDivRightIconItem"
            style = {
                { cursor: "pointer" }
            } >
            <
            img src = { AddIcon }
            style = {
                { width: "20px" }
            }
            /> < /
            span > <
            /Link> < /
            div > <
            /div> <
            br / >
            <
            br / >
            <
            br / >
            <
            br / >
            <
            br className = "d-block d-sm-none" / >
            <
            br className = "d-block d-sm-none" / >
            <
            br className = "d-block d-sm-none" / >
            <
            br className = "d-block d-sm-none" / >

            <
            div className = "HomeThirdDiv" >
            <
            Container fluid >
            <
            Row > {
                this.state.stock.length > 0 &&
                this.state.stock.map((item) => ( <
                    Col sm = "5"
                    className = "HomeThirdDivItemDiv" >
                    <
                    Link to = { `/updatestock/${item.ID}` }
                    id = "NoHoverLink" >
                    <
                    div >
                    <
                    p style = {
                        { textAlign: "right" }
                    } > {
                        moment(item.CreatedAt).format(
                            "MMMM Do YYYY, h:mm A"
                        )
                    } <
                    /p> <
                    h6 > { item.item_name } < /h6> <
                    h6 >
                    <
                    LangConvertComponent name = "purchased" / >: { " " } <
                    span id = "BlueColorText" > { item.item_purchased }
                    Units of { " " } { "₹ " + item.purchased_value } <
                    /span> < /
                    h6 > <
                    h6 >
                    <
                    LangConvertComponent name = "sold" / >: { " " } <
                    span id = "BlueColorText" > { item.item_sold }
                    Units of { " " } { "₹ " + item.sold_value } <
                    /span> < /
                    h6 > <
                    h6 >
                    <
                    LangConvertComponent name = "damaged" / >: { " " } <
                    span id = "BlueColorText" > { item.item_damaged }
                    Units of { " " } { "₹ " + item.damaged_value } <
                    /span> < /
                    h6 > <
                    h6 >
                    <
                    LangConvertComponent name = "returned" / >: { " " } <
                    span id = "BlueColorText" > { item.item_returned }
                    Units of { " " } { "₹ " + item.returned_value } <
                    /span> < /
                    h6 > {
                        item.image_URL.length > 0 ? ( <
                            React.Fragment >
                            <
                            p > 2 images < /p> <
                            img src = { item.image_URL[0] }
                            className = "img-fluid"
                            style = {
                                { width: "100px" }
                            }
                            /> < /
                            React.Fragment >
                        ) : (
                            ""
                        )
                    } <
                    /div> < /
                    Link > <
                    /Col>
                ))
            } <
            /Row> < /
            Container > <
            /div> < /
            div > <
            /div> < /
            div > <
            /div> < /
            div > <
            /div> < /
            React.Fragment >
        );
    }
}

export default StockComponent;