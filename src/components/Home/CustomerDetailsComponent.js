import React, { Component } from "react";

import { Col, Container, Row } from "reactstrap";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

import RightArrowImg from "../../assets/RightArrow.png";

import SearchIcon from "../../assets/SearchIcon.png";
import FilterIcon from "../../assets/FilterIcon.png";
import AddIcon from "../../assets/AddIcon.png";

import HeaderDp from "../../assets/headerdp.png";

import CallIcon from "../../assets/CallIcon.png";

import RemindIcon from "../../assets/RemindIcon.png";
import PaynowIcon from "../../assets/PaynowIcon.png";
import CollectnowIcon from "../../assets/CollectnowIcon.png";
import ReportsIcon from "../../assets/ReportsIcon.png";

import ProdImage from "../../assets/ProdImage.png";
import { validateLogin } from "../constants/functions";
import { APIURL } from "../constants/APIURL";
import Cookies from "universal-cookie/es6";
import LoadingComponent from "../LoadingComponent";
import {
    Avatar,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
} from "@material-ui/core";

import moment from "moment";
import { Link } from "react-router-dom";
import LangConvertComponent from "../LangConvertComponent";
import { Sms, WhatsApp } from "@material-ui/icons";
import { toast } from "react-toastify";

class CustomerDetailsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cookies: new Cookies(),
            userInfo: new Cookies().get("userInfo"),
            customerId: this.props.match.params.id,
            notFound: false,
            isLoading: true,
            data: {},

            //
            mostRecent: true,
            searchClicked: false,
            searchQuery: "",
            hisab: [],

            //
            collectNowDialogOpen: false,
            payNowDialogOpen: false,
            //
            userUPIId: "",
            UPIAmount: "",
        };
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    collectMoneySMS = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            dynamicLinkInfo: {
                domainUriPrefix: "https://ayekarthisab.page.link",
                link: "https://www.upiqrcode.com/upi-link-generator/?apikey=roqgfj&seckey=pgarts&vpa=" +
                    this.state.userUPIId +
                    "&payee=" +
                    this.state.data.first_name +
                    " " +
                    this.state.data.last_name +
                    "&amount=" +
                    this.state.UPIAmount,
                androidInfo: {
                    androidPackageName: "com.ayekart.android",
                },
            },
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        fetch(
                "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyA8exxQ8w3d52Rm6Wy84wBmgXuohLRie3g",
                requestOptions
            )
            .then((response) => response.json())
            .then((result) => {
                window.open(
                    "sms://+91" +
                    this.state.mobile +
                    "?body=Dear%20Sir/Madam,%20Your%20payment%20of%20₹" +
                    this.state.UPIAmount +
                    "%20is%20pending%20at%20" +
                    this.state.data.business_name +
                    ". Please click on the below link to make the payment. " +
                    result.shortLink,
                    "_blank"
                );
                // window.open(result.shortLink, "_blank");
            })
            .catch((error) => console.log("error", error));
    };

    collectMoneyWhatsapp = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            dynamicLinkInfo: {
                domainUriPrefix: "https://ayekarthisab.page.link",
                link: "https://www.upiqrcode.com/upi-link-generator/?apikey=roqgfj&seckey=pgarts&vpa=" +
                    this.state.userUPIId +
                    "&payee=" +
                    this.state.data.first_name +
                    " " +
                    this.state.data.last_name +
                    "&amount=" +
                    this.state.UPIAmount,
                androidInfo: {
                    androidPackageName: "com.ayekart.android",
                },
            },
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        fetch(
                "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyA8exxQ8w3d52Rm6Wy84wBmgXuohLRie3g",
                requestOptions
            )
            .then((response) => response.json())
            .then((result) => {
                window.open(
                    "https://wa.me/+91" +
                    this.state.data.mobile +
                    "?text=Dear%20Sir/Madam,%20Your%20payment%20of%20₹" +
                    this.state.UPIAmount +
                    "%20is%20pending%20at%20" +
                    this.state.data.business_name +
                    ". Please click on the below link to make the payment. %0a" +
                    result.shortLink,
                    "_blank"
                );
                // window.open(result.shortLink, "_blank");
            })
            .catch((error) => console.log("error", error));
    };

    payNowLinkGenerator = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            dynamicLinkInfo: {
                domainUriPrefix: "https://ayekarthisab.page.link",
                link: "https://www.upiqrcode.com/upi-link-generator/?apikey=roqgfj&seckey=pgarts&vpa=" +
                    this.state.userUPIId +
                    "&payee=" +
                    this.state.data.business_name +
                    "&amount=" +
                    this.state.UPIAmount,
                androidInfo: {
                    androidPackageName: "com.ayekart.android",
                },
            },
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        fetch(
                "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyA8exxQ8w3d52Rm6Wy84wBmgXuohLRie3g",
                requestOptions
            )
            .then((response) => response.json())
            .then((result) => {
                window.open(result.shortLink, "_blank");
            })
            .catch((error) => console.log("error", error));
    };

    handlePayNowDialogOpen = () => {
        this.setState({
            payNowDialogOpen: true,
        });
    };

    handlePayNowDialogClose = () => {
        this.setState({
            payNowDialogOpen: false,
            userUPIId: "",
            UPIAmount: "",
        });
    };

    handleCollectNowDialogOpen = () => {
        this.setState({
            collectNowDialogOpen: true,
        });
    };

    handleCollectNowDialogClose = () => {
        this.setState({
            collectNowDialogOpen: false,
            userUPIId: "",
            UPIAmount: "",
        });
    };
    handleSearchChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });

        var SearchResult = this.state.hisab.filter((item) =>
            item.item_name.toLowerCase().includes(value.toLowerCase())
        );
        if (value.length <= 0) {
            this.setState({
                isLoading: true,
            });
            this.getCustomerDetails();
        } else {
            this.setState({
                hisab: SearchResult,
            });
        }
    }

    getCustomerDetails = (mostRecent = true) => {
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
                "/customer/" +
                this.state.customerId +
                "/details",
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
                this.setState({
                    isLoading: false,
                    data: result.data,
                    hisab: mostRecent === true ?
                        result.data.hisab.reverse() :
                        result.data.hisab,
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
                this.getCustomerDetails();
            })
            .catch((err) => (window.location.href = "/login"));
    }
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
        if (this.state.notFound) {
            return <React.Fragment > User Not Found < /React.Fragment>;
        }
        return ( <
            React.Fragment >
            <
            Dialog fullWidth maxWidth = "xs"
            open = { this.state.payNowDialogOpen }
            onClose = { this.handlePayNowDialogClose } >
            <
            DialogTitle > Pay Money < /DialogTitle> <
            DialogContent >
            Customer Name: { " " } { this.state.data.first_name + " " + this.state.data.last_name } <
            h6 >
            To Pay: ₹{ " " } {
                this.state.data.to_pay - this.state.data.paid < 0 ?
                    Math.abs(this.state.data.to_pay - this.state.data.paid) +
                    "(Adv)" :
                    this.state.data.to_pay - this.state.data.paid
            } <
            /h6> <
            div style = {
                { marginTop: "20px" } } >
            <
            TextField fullWidth label = "User UPI ID"
            variant = "filled"
            name = "userUPIId"
            value = { this.state.userUPIId }
            onChange = { this.handleInputChange }
            /> <
            br / >
            <
            br / >
            <
            TextField fullWidth label = "Amount"
            variant = "filled"
            name = "UPIAmount"
            value = { this.state.UPIAmount }
            onChange = { this.handleInputChange }
            /> <
            br / >
            <
            br / >
            <
            h6 > Request via: < /h6> <
            Button variant = "contained"
            style = {
                {
                    backgroundColor: "green",
                    color: "white",
                    marginRight: "20px",
                }
            }
            onClick = {
                () => {
                    if (
                        this.state.userUPIId.trim().length === 0 ||
                        this.state.UPIAmount.trim().length === 0
                    ) {
                        toast.error("Please enter all fields");
                    } else {
                        this.payNowLinkGenerator();
                    }
                }
            } >
            Open Payment URL <
            /Button> <
            /div> <
            /DialogContent> <
            /Dialog> <
            Dialog fullWidth maxWidth = "xs"
            open = { this.state.collectNowDialogOpen }
            onClose = { this.handleCollectNowDialogClose } >
            <
            DialogTitle > Collect Money12 < /DialogTitle> <
            DialogContent >
            Customer Name: { " " } { this.state.data.first_name + " " + this.state.data.last_name } <
            h6 >
            Pending: ₹{ " " } {
                this.state.data.to_collect - this.state.data.collected < 0 ?
                    Math.abs(
                        this.state.data.to_collect - this.state.data.collected
                    ) + "(Adv)" :
                    this.state.data.to_collect - this.state.data.collected
            } <
            /h6> <
            div style = {
                { marginTop: "20px" } } >
            <
            TextField fullWidth label = "Your UPI ID"
            variant = "filled"
            name = "userUPIId"
            value = { this.state.userUPIId }
            onChange = { this.handleInputChange }
            /> <
            br / >
            <
            br / >
            <
            TextField fullWidth label = "Amount"
            variant = "filled"
            name = "UPIAmount"
            value = { this.state.UPIAmount }
            onChange = { this.handleInputChange }
            /> <
            br / >
            <
            br / >
            <
            h6 > Request via: < /h6> <
            Button variant = "contained"
            startIcon = { < WhatsApp / > }
            style = {
                {
                    backgroundColor: "green",
                    color: "white",
                    marginRight: "20px",
                }
            }
            onClick = {
                () => {
                    if (
                        this.state.userUPIId.trim().length === 0 ||
                        this.state.UPIAmount.trim().length === 0
                    ) {
                        toast.error("Please enter all fields");
                    } else {
                        this.collectMoneyWhatsapp();
                    }
                }
            } >
            WhatsApp <
            /Button>

            <
            Button variant = "contained"
            startIcon = { < Sms / > }
            style = {
                { backgroundColor: "#01579B", color: "white" } }
            onClick = {
                () => {
                    if (
                        this.state.userUPIId.trim().length === 0 ||
                        this.state.UPIAmount.trim().length === 0
                    ) {
                        toast.error("Please enter all fields");
                    } else {
                        this.collectMoneySMS();
                    }
                }
            } >
            SMS <
            /Button> <
            /div> <
            /DialogContent> <
            /Dialog> <
            div className = "container-fluid" >
            <
            div className = "row" >
            <
            div className = "col-sm-0 nopadding" >
            <
            SidebarComponent activePage = "Home" / >
            <
            /div>

            <
            div className = "col-sm-12 nopadding" >
            <
            div className = "PageContentMainDiv" >
            <
            div className = "PageContentContentDiv" >
            <
            HeaderComponent / >

            <
            div className = "HomeMainDiv" >
            <
            div className = "HomeTopDiv" >
            <
            Row >
            <
            Col sm = "0" >
            <
            Avatar style = {
                {
                    backgroundColor: "#0D3293",
                    width: "50px",
                    height: "50px",
                }
            } >
            {
                this.state.data.first_name[0] +
                this.state.data.last_name[0]
            } <
            /Avatar> <
            /Col> <
            Col sm xs >
            <
            div style = {
                { marginLeft: "10px" } } >
            <
            h5 > {
                this.state.data.first_name +
                " " +
                this.state.data.last_name
            } <
            /h5> <
            Link to = { `/profile/customer/${this.state.data.ID}` }
            id = "NoHoverLink" >
            <
            p >
            <
            LangConvertComponent name = "click_here_to_view_profile_settings" / >
            <
            /p> <
            /Link> <
            /div> <
            /Col> <
            Col sm xs >
            <
            span style = {
                { float: "right" } } >
            <
            img src = { CallIcon }
            style = {
                { width: "20px" } }
            /> <
            /span> <
            /Col> <
            /Row> <
            Row >
            <
            Col sm xs = "6" >
            <
            div style = {
                { margin: "20px" } } >
            <
            h6 >
            <
            LangConvertComponent name = "to_collect" / >
            <
            /h6> <
            p id = "BlueColorText" > ₹{ " " } {
                this.state.data.to_collect -
                    this.state.data.collected <
                    0 ?
                    Math.abs(
                        this.state.data.to_collect -
                        this.state.data.collected
                    ) + "(Adv)" :
                    this.state.data.to_collect -
                    this.state.data.collected
            } <
            /p> <
            /div> <
            /Col>

            <
            Col sm xs = "6" >
            <
            div style = {
                { margin: "20px" } } >
            <
            h6 >
            <
            LangConvertComponent name = "collected" / >
            <
            /h6> <
            p id = "BlueColorText" > ₹{ this.state.data.collected } <
            /p> <
            /div> <
            /Col>

            <
            Col sm xs = "6" >
            <
            div style = {
                { margin: "20px" } } >
            <
            h6 >
            <
            LangConvertComponent name = "to_pay" / >
            <
            /h6> <
            p id = "BlueColorText" > ₹{ " " } {
                this.state.data.to_pay - this.state.data.paid < 0 ?
                    Math.abs(
                        this.state.data.to_pay -
                        this.state.data.paid
                    ) + "(Adv)" :
                    this.state.data.to_pay - this.state.data.paid
            } <
            /p> <
            /div> <
            /Col>

            <
            Col sm xs = "6" >
            <
            div style = {
                { margin: "20px" } } >
            <
            h6 >
            <
            LangConvertComponent name = "paid" / >
            <
            /h6> <
            p id = "BlueColorText" > ₹{ this.state.data.paid } < /p> <
            /div> <
            /Col> <
            /Row>

            <
            Row >
            <
            Col sm xs = "6"
            className = "nopadding" >
            <
            div className = "HomeThirdDivPayItems"
            onClick = {
                () => this.handleCollectNowDialogOpen() } >
            <
            h6 >
            <
            img src = { CollectnowIcon }
            style = {
                { width: "20px" } }
            /> <
            span style = {
                {
                    marginLeft: "5px",
                    paddingTop: "0px",
                }
            } >
            <
            LangConvertComponent name = "collect_now" / >
            <
            /span> <
            /h6> <
            /div> <
            /Col>

            <
            Col sm xs = "6"
            className = "nopadding" >
            <
            Link to = { `/customer/report/${this.state.data.ID}` }
            id = "NoHoverLink" >
            <
            div className = "HomeThirdDivPayItems" >
            <
            h6 >
            <
            img src = { ReportsIcon }
            style = {
                { width: "20px" } }
            /> <
            span style = {
                {
                    marginLeft: "5px",
                    paddingTop: "30px",
                }
            } >
            <
            LangConvertComponent name = "view_reports" / >
            <
            /span> <
            /h6> <
            /div> <
            /Link> <
            /Col>

            <
            Col sm xs = "6"
            className = "nopadding" >
            <
            div className = "HomeThirdDivPayItems"
            onClick = {
                () => this.handlePayNowDialogOpen() } >
            <
            h6 >
            <
            img src = { PaynowIcon }
            style = {
                { width: "20px" } }
            /> <
            span style = {
                {
                    marginLeft: "5px",
                    paddingTop: "0px",
                }
            } >
            <
            LangConvertComponent name = "pay_now" / >
            <
            /span> <
            /h6> <
            /div> <
            /Col>

            <
            Col sm xs = "6"
            className = "nopadding" >
            <
            div className = "HomeThirdDivPayItems" >
            <
            h6 >
            <
            img src = { RemindIcon }
            style = {
                { width: "20px" } }
            /> <
            a id = "NoHoverLink"
            target = "_blank"
            href = {
                "https://wa.me/+91" +
                this.state.data.mobile +
                "?text=Dear%20Sir/Madam,%20Your%20payment%20of%20₹" +
                (this.state.data.to_collect -
                    this.state.data.collected) +
                "%20is%20pending."
            }
            // href={
            //   "sms://+91" +
            //   item.mobile +
            //   "?body=Dear%20Sir/Madam,%20Your%20payment%20of%20₹" +
            //   (item.to_collect -
            //     item.collected) +
            //   "%20is%20pending%20at%20" +
            //   this.state.data.business_name
            // }
            >
            <
            span style = {
                {
                    marginLeft: "5px",
                    paddingTop: "0px",
                }
            } >
            <
            LangConvertComponent name = "remind" / >
            <
            /span> <
            /a> <
            /h6> <
            /div> <
            /Col> <
            /Row> <
            /div>

            <
            div className = "HomeSecondDiv" >
            <
            div className = {
                this.state.mostRecent ?
                "HomeBlueButton" :
                    "HomeWhiteButton"
            }
            style = {
                { float: "left", margin: "6px" } }
            onClick = {
                () => {
                    this.setState({
                        mostRecent: !this.state.mostRecent,
                    });
                    this.getCustomerDetails(!this.state.mostRecent);
                }
            } >
            <
            h6 >
            <
            LangConvertComponent name = "most_recent" / >
            <
            /h6> <
            /div> <
            div className = {!this.state.mostRecent ?
                "HomeBlueButton" :
                    "HomeWhiteButton"
            }
            style = {
                { float: "left", margin: "6px" } }
            onClick = {
                () => {
                    this.setState({
                        mostRecent: !this.state.mostRecent,
                    });
                    this.getCustomerDetails(!this.state.mostRecent);
                }
            } >
            <
            h6 >
            <
            LangConvertComponent name = "oldest" / >
            <
            /h6> <
            /div>

            <
            div className = "HomeSecondDivRightIcons"
            style = {
                { float: "right" } } >
            {
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
                    /> <
                    /span>
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
                        { width: "20px" } }
                    /> <
                    /span>
                )
            } {
                /* <span className="HomeSecondDivRightIconItem">
                                          <img src={FilterIcon} style={{ width: "20px" }} />
                                        </span> */
            } <
            Link to = { `/addhisabentry/${this.state.data.ID}/${this.state.data.first_name + " " + this.state.data.last_name}/${this.state.data.mobile}` } >
            <
            span className = "HomeSecondDivRightIconItem"
            style = {
                { cursor: "pointer" } } >
            <
            img src = { AddIcon }
            style = {
                { width: "20px" } }
            /> <
            /span> <
            /Link> <
            /div> <
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
                this.state.data.hisab.length === 0 ? ( <
                    div > < /div>
                ) : (
                    this.state.hisab.map((item) => ( <
                        Col sm = "5"
                        className = "HomeThirdDivItemDiv" >
                        <
                        div >
                        <
                        h6 >
                        <
                        b > { item.item_name } < /b> <
                        span id = "BlueColorText"
                        style = {
                            { float: "right" } } >
                        {
                            item.entry_type === "to_collect" ?
                            "To Collect: ₹ " + item.to_collect :
                                item.entry_type === "to_pay" ?
                                "To Pay: ₹ " + item.to_pay :
                                item.entry_type === "paid" ?
                                "Paid: ₹ " + item.paid :
                                item.entry_type === "collected" ?
                                "Collected: ₹ " + item.collected :
                                ""
                        } <
                        /span> <
                        /h6> <
                        p > {
                            moment(item.UpdatedAt).format(
                                "MMMM Do YYYY - h:mm a"
                            )
                        } <
                        /p>

                        {
                            item.image_url.length === 0 ? ( <
                                div > < /div>
                            ) : ( <
                                div >
                                <
                                pre > Images < /pre> <
                                img src = { item.image_url[0] }
                                style = {
                                    { width: "100px" } }
                                className = "img-fluid" /
                                >
                                <
                                /div>
                            )
                        } <
                        /div> <
                        /Col>
                    ))
                )
            } <
            /Row> <
            /Container> <
            /div> <
            /div> <
            /div> <
            /div> <
            /div> <
            /div> <
            /div> <
            /React.Fragment>
        );
    }
}

export default CustomerDetailsComponent;