import React, { Component } from "react";
import { Col, Container, Form, Row } from "reactstrap";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

import RightArrowImg from "../../assets/RightArrow.png";

import SearchIcon from "../../assets/SearchIcon.png";
import FilterIcon from "../../assets/FilterIcon.png";
import AddIcon from "../../assets/AddIcon.png";

import HeaderDp from "../../assets/headerdp.png";

import CallIcon from "../../assets/CallIcon.png";

import unauthorizedIcon from "../../assets/unauthorized.png";

import RemindIcon from "../../assets/RemindIcon.png";
import CustomerInvoiceIcon from "../../assets/CustomerInvoice.png";
import PaynowIcon from "../../assets/PaynowIcon.png";
import CollectnowIcon from "../../assets/CollectnowIcon.png";
import Cookies from "universal-cookie/es6";
import { APIURL } from "../constants/APIURL";
import LoadingComponent from "../LoadingComponent";
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
} from "@material-ui/core";
import { toast, ToastContainer } from "react-toastify";
import { validateLogin } from "../constants/functions";
import { Link } from "react-router-dom";
import BottomBarComponent from "../BottomBarComponent";
import LangConvertComponent from "../LangConvertComponent";
import { Sms, WhatsApp } from "@material-ui/icons";

import axios from "axios";

// const queryString = require("query-string");

class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      userInfo: {},
      isLoading: true,
      addCustomerDialogOpen: false,
      mostRecent: true,
      mobileDialogOpen: false,
      selectedMobileNumber: "",
      collectNowDialogOpen: false,
      payNowDialogOpen: false,
      selectedUser: {},
      finoUnAuthorizedDialogOpen: false,
      //Add Customer
      first_name: "",
      last_name: "",
      mobile: "",
      searchClicked: false,
      searchQuery: "",
      //Data
      data: {},
      customers: [],

      userUPIId: "",
      UPIAmount: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlePayNowDialogOpen = (selectedUser) => {
    this.setState({
      selectedUser: selectedUser,
      payNowDialogOpen: true,
    });
  };

  handlePayNowDialogClose = () => {
    this.setState({
      payNowDialogOpen: false,
      userUPIId: "",
      UPIAmount: "",
      selectedUser: {},
    });
  };

  handleCollectNowDialogOpen = (selectedUser) => {
    this.setState({
      selectedUser: selectedUser,
      collectNowDialogOpen: true,
    });
  };

  handleCollectNowDialogClose = () => {
    this.setState({
      collectNowDialogOpen: false,
      userUPIId: "",
      UPIAmount: "",
      selectedUser: {},
    });
  };

  handleMobileDialogOpen = (mobile) => {
    this.setState({
      selectedMobileNumber: mobile,
      mobileDialogOpen: true,
    });
  };
  handleMobileDialogClose = () => {
    this.setState({
      mobileDialogOpen: false,
    });
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }
  handleSearchChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    var SearchResult = this.state.customers.filter((item) =>
      (item.first_name + " " + item.last_name)
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    if (value.length <= 0) {
      this.setState({
        isLoading: true,
      });
      this.getHomeDetails();
    } else {
      this.setState({
        customers: SearchResult,
      });
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.mobile.length !== 10) {
      toast.error("Enter valid mobile number");
    } else {
      this.addCustomer({
        business_id: this.state.userInfo.business.ID,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        mobile: this.state.mobile,
        profile_pic: "",
      });
    }
  };

  addCustomer = (creds) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(creds);

    var requestOptions = {
      method: "POST",
      body: raw,
      redirect: "follow",
    };

    fetch(
      APIURL +
        "/user/" +
        this.state.userInfo.ID +
        "/business/" +
        this.state.userInfo.business.ID +
        "/customer",
      requestOptions
    )
      .then((response) => {
        if (response.statusText !== "Created") {
          throw Error("Already Created");
        } else {
          return response.json();
        }
      })
      .then((result) => {
        console.log(result);
        toast.success("Customer added");
        this.setState({
          first_name: "",
          last_name: "",
          mobile: "",
          isLoading: true,
        });
        this.handleAddCustomerDialogClose();
        this.getHomeDetails();
      })
      .catch((error) => {
        console.log("error", error);
        toast.error("Customer already created with given mobile number");
      });
  };

  handleAddCustomerDialogOpen = () => {
    this.setState({
      addCustomerDialogOpen: true,
    });
  };

  handleAddCustomerDialogClose = () => {
    this.setState({
      addCustomerDialogOpen: false,
    });
  };

  getHomeDetails = (
    userInfo = this.state.cookies.get("userInfo"),
    mostRecent = true
  ) => {
    console.log("GET HOME DETAILS");
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
        userInfo.ID +
        "/business/" +
        userInfo.business.ID +
        "/home",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.data.customers.length !== 0) {
          this.setState({
            data: result.data,
            customers:
              mostRecent === true
                ? result.data.customers.reverse()
                : result.data.customers,
            isLoading: false,
          });
        } else {
          this.setState({
            data: result.data,
            customers: [],
            isLoading: false,
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  collectMoneySMS = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Headers", "*");
        myHeaders.append("Access-Control-Allow-Credentials", true);

    var data = {
      accept_partial: false,
      amount: parseInt(this.state.UPIAmount) * 100,
      callback_method: "get",
      callback_url: "",
      currency: "INR",
      customer: {
        contact: "+91" + this.state.selectedUser.mobile,
        name:
          this.state.selectedUser.first_name +
          " " +
          this.state.selectedUser.last_name,
      },
      description: "",
      notes: {
        merchant_id: "1828",
        merchant_name:
          this.state.selectedUser.first_name +
          " " +
          this.state.selectedUser.last_name,
        merchant_upi_id: this.state.userUPIId,
      },
      notify: {
        email: false,
        sms: false,
      },
      reference_id:
        "aye" +
        this.state.selectedUser.mobile +
        Math.floor(Math.random() * 90000) +
        1,
      reminder_enable: true,
      upi_link: "true",
    };

    var raw = JSON.stringify(data);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "http://pickpic4u.com/razor.php",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        var short_url = result.short_url;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Access-Control-Allow-Headers", "*");
        myHeaders.append("Access-Control-Allow-Credentials", true);

        var raw = JSON.stringify({
          dynamicLinkInfo: {
            domainUriPrefix: "https://ayekarthisab.page.link",
            link:
              "https://www.upiqrcode.com/upi-link-generator/?apikey=roqgfj&seckey=pgarts&vpa=" +
              this.state.userUPIId +
              "&payee=" +
              this.state.selectedUser.first_name +
              " " +
              this.state.selectedUser.last_name +
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

        // fetch(
        //   "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyA8exxQ8w3d52Rm6Wy84wBmgXuohLRie3g",
        //   requestOptions
        // )
        //   .then((response) => response.json())
        //   .then((result) => {
            window.open(
              "sms://+91" +
                this.state.mobile +
                "?body=Dear%20Sir/Madam,%20Your%20payment%20of%20₹" +
                this.state.UPIAmount +
                "%20is%20pending%20at%20" +
                this.state.data.business_name +
                ". Please click on the below link to make the payment. " +
                short_url,
              "_blank"
            );
          })
          .catch((error) => console.log("error", error));
      // })
      // .catch((error) => console.log("error", error));

    // var myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");

    // var raw = JSON.stringify({
    //     dynamicLinkInfo: {
    //         domainUriPrefix: "https://ayekarthisab.page.link",
    //         link: "https://www.upiqrcode.com/upi-link-generator/?apikey=roqgfj&seckey=pgarts&vpa=" +
    //             this.state.userUPIId +
    //             "&payee=" +
    //             this.state.selectedUser.first_name +
    //             " " +
    //             this.state.selectedUser.last_name +
    //             "&amount=" +
    //             this.state.UPIAmount,
    //         androidInfo: {
    //             androidPackageName: "com.ayekart.android",
    //         },
    //     },
    // });

    // var requestOptions = {
    //     method: "POST",
    //     headers: myHeaders,
    //     body: raw,
    //     redirect: "follow",
    // };

    // fetch(
    //         "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyA8exxQ8w3d52Rm6Wy84wBmgXuohLRie3g",
    //         requestOptions
    //     )
    //     .then((response) => response.json())
    //     .then((result) => {
    //         window.open(
    //             "sms://+91" +
    //             this.state.mobile +
    //             "?body=Dear%20Sir/Madam,%20Your%20payment%20of%20₹" +
    //             this.state.UPIAmount +
    //             "%20is%20pending%20at%20" +
    //             this.state.data.business_name +
    //             ". Please click on the below link to make the payment. " +
    //             result.shortLink,
    //             "_blank"
    //         );
    //         // window.open(result.shortLink, "_blank");
    //     })
    //     .catch((error) => console.log("error", error));
  };

  collectMoneyWhatsapp = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Headers", "*");
    myHeaders.append("Access-Control-Allow-Credentials", true);

    var data = {
      accept_partial: false,
      amount: parseInt(this.state.UPIAmount) * 100,
      callback_method: "get",
      callback_url: "",
      currency: "INR",
      customer: {
        contact: "+91" + this.state.selectedUser.mobile,
        name:
          this.state.selectedUser.first_name +
          " " +
          this.state.selectedUser.last_name,
      },
      description: "",
      notes: {
        merchant_id: "1828",
        merchant_name:
          this.state.selectedUser.first_name +
          " " +
          this.state.selectedUser.last_name,
        merchant_upi_id: this.state.userUPIId,
      },
      notify: {
        email: false,
        sms: false,
      },
      reference_id:
        "aye" +
        this.state.selectedUser.mobile +
        Math.floor(Math.random() * 90000) +
        1,
      reminder_enable: true,
      upi_link: "true",
    };

    var raw = JSON.stringify(data);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "http://pickpic4u.com/razor.php",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        var short_url = result.short_url;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Access-Control-Allow-Headers", "*");
        myHeaders.append("Access-Control-Allow-Credentials", true);
        myHeaders.append("Access-Control-Allow-Origin", "*");
        myHeaders.append("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

        var raw = JSON.stringify({
          dynamicLinkInfo: {
            domainUriPrefix: "https://ayekarthisab.page.link",
            link:
              "https://www.upiqrcode.com/upi-link-generator/?apikey=roqgfj&seckey=pgarts&vpa=" +
              this.state.userUPIId +
              "&payee=" +
              this.state.selectedUser.first_name +
              " " +
              this.state.selectedUser.last_name +
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

        // fetch(
        //   "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyA8exxQ8w3d52Rm6Wy84wBmgXuohLRie3g",
        //   requestOptions
        // )
        //   .then((response) => response.json())
        //   .then((result) => {
            window.open(
              "https://wa.me/+91" +
                this.state.selectedUser.mobile +
                "?text=Dear%20Sir/Madam,%20Your%20payment%20of%20₹" +
                this.state.UPIAmount +
                "%20is%20pending%20at%20" +
                this.state.data.business_name +
                ". Please click on the below link to make the payment. %0a" +
                short_url,
              "_blank"
            );
          })
          .catch((error) => console.log("error", error));
      // })
      // .catch((error) => console.log("error", error));

    // var myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");

    // var raw = JSON.stringify({
    //     dynamicLinkInfo: {
    //         domainUriPrefix: "https://ayekarthisab.page.link",
    //         link: "https://www.upiqrcode.com/upi-link-generator/?apikey=roqgfj&seckey=pgarts&vpa=" +
    //             this.state.userUPIId +
    //             "&payee=" +
    //             this.state.selectedUser.first_name +
    //             " " +
    //             this.state.selectedUser.last_name +
    //             "&amount=" +
    //             this.state.UPIAmount,
    //         androidInfo: {
    //             androidPackageName: "com.ayekart.android",
    //         },
    //     },
    // });

    // var requestOptions = {
    //     method: "POST",
    //     headers: myHeaders,
    //     body: raw,
    //     redirect: "follow",
    // };

    // fetch(
    //         "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyA8exxQ8w3d52Rm6Wy84wBmgXuohLRie3g",
    //         requestOptions
    //     )
    //     .then((response) => response.json())
    //     .then((result) => {
    //         window.open(
    //             "https://wa.me/+91" +
    //             this.state.selectedUser.mobile +
    //             "?text=Dear%20Sir/Madam,%20Your%20payment%20of%20₹" +
    //             this.state.UPIAmount +
    //             "%20is%20pending%20at%20" +
    //             this.state.data.business_name +
    //             ". Please click on the below link to make the payment. %0a" +
    //             result.shortLink,
    //             "_blank"
    //         );
    //         // window.open(result.shortLink, "_blank");
    //     })
    //     .catch((error) => console.log("error", error));
  };

  payNowLinkGenerator = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Headers", "*");
    myHeaders.append("Access-Control-Allow-Credentials", true);

    var raw = JSON.stringify({
      dynamicLinkInfo: {
        domainUriPrefix: "https://ayekarthisab.page.link",
        link:
          "https://www.upiqrcode.com/upi-link-generator/?apikey=roqgfj&seckey=pgarts&vpa=" +
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

  componentDidMount() {
    var userInfo = this.state.cookies.get("userInfo");
    console.log("userInfo:: ", userInfo);

    this.setState({
      userInfo: userInfo,
    });
    this.getHomeDetails(userInfo);
    // validateLogin
    //   .then((res) => {
    //     // const parsed = queryString.parse(window.location.search);
    //     var userInfo = this.state.cookies.get("userInfo");

    //     this.setState({
    //       userInfo: userInfo,
    //     });
    //     this.getHomeDetails(userInfo);
    //     // if (parsed.AHVALID === undefined) {

    //     // }
    //     // else {
    //     //   var user = this.state.cookies.get("userInfo");
    //     //   var AHVALIDSTR = parsed.AHVALID;
    //     //   var replaced = AHVALIDSTR.split(" ").join("+");
    //     //   var header = parsed.AHHEADER.split(" ").join("+");
    //     //   var myHeaders = new Headers();
    //     //   myHeaders.append("Content-Type", "application/json");
    //     //   // myHeaders.append("Access-Control-Allow-Origin", "*");
    //     //   myHeaders.append("Authentication", header);
    //     //   var requestOptions = {
    //     //     method: "POST",
    //     //     headers: myHeaders,
    //     //     body: JSON.stringify({
    //     //       AHVALID: replaced,
    //     //     }),
    //     //     redirect: "follow",
    //     //   };

    //     //   fetch(APIURL + "/user/fino", requestOptions)
    //     //     .then((response) => {
    //     //       console.log(response.status);
    //     //       if (!response.ok) {
    //     //         throw Error("It is 409 error");
    //     //       }
    //     //       return response.json();
    //     //     })
    //     //     .then((result) => {
    //     //       this.setState({
    //     //         userInfo: result.data.user,
    //     //       });
    //     //       console.log(result);
    //     //       this.state.cookies.set("userInfo", result.data.user);
    //     //       this.getHomeDetails(result.data.user);
    //     //     })
    //     //     .catch((error) => {
    //     //       console.log("errdddor", error);
    //     //       this.state.cookies.set("mobileNumber", this.state.mobileNumber);
    //     //       this.setState({
    //     //         finoUnAuthorizedDialogOpen: true,
    //     //       });
    //     //     });
    //     // }
    //   })
    //   .catch((error) => {
    //     console.log("Came here");
    //     // const parsed = queryString.parse(window.location.search);
    //     var userInfo = this.state.cookies.get("userInfo");

    //     this.setState({
    //       userInfo: userInfo,
    //     });
    //     this.getHomeDetails(userInfo);
    // if(this.state.cookies.get("userInfo") !== undefined) {

    // } else {
    //   console.log("dfb");
    // }
    // else {
    //   window.location.href = "/login";
    // }

    //
    // });
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
        <Dialog maxWidth="lg" open={this.state.finoUnAuthorizedDialogOpen}>
          <DialogTitle> Unauthorized access </DialogTitle>
          <DialogContent>
            <div style={{ textAlign: "center" }}>
              <img src={unauthorizedIcon} className="img-fluid" width="80px" />
              <br />
              <br />
              <h5> Unauthorized Access </h5>
            </div>
          </DialogContent>
          {/* <DialogActions>
                            <Button onClick={() => (window.location.href = "/login")}>
                              Go to login page?
                            </Button>
                          </DialogActions> */}
        </Dialog>
        <Dialog
          fullWidth
          maxWidth="xs"
          open={this.state.payNowDialogOpen}
          onClose={this.handlePayNowDialogClose}
        >
          <DialogTitle> Pay Money </DialogTitle>
          <DialogContent>
            Customer Name:
            {this.state.selectedUser.first_name +
              " " +
              this.state.selectedUser.last_name}
            <h6>
              To Pay: ₹
              {this.state.selectedUser.to_pay - this.state.selectedUser.paid < 0
                ? Math.abs(
                    this.state.selectedUser.to_pay -
                      this.state.selectedUser.paid
                  ) + "(Adv)"
                : this.state.selectedUser.to_pay -
                  this.state.selectedUser.paid}
            </h6>
            <div style={{ marginTop: "20px" }}>
              <TextField
                fullWidth
                label="User UPI ID"
                variant="filled"
                name="userUPIId"
                value={this.state.userUPIId}
                onChange={this.handleInputChange}
              />
              <br />
              <br />
              <TextField
                fullWidth
                label="Amount"
                variant="filled"
                name="UPIAmount"
                value={this.state.UPIAmount}
                onChange={this.handleInputChange}
              />
              <br />
              <br />
              <h6> Request via: </h6>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "green",
                  color: "white",
                  marginRight: "20px",
                }}
                onClick={() => {
                  if (
                    this.state.userUPIId.trim().length === 0 ||
                    this.state.UPIAmount.trim().length === 0
                  ) {
                    toast.error("Please enter all fields");
                  } else {
                    this.payNowLinkGenerator();
                  }
                }}
              >
                Open Payment URL
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog
          fullWidth
          maxWidth="xs"
          open={this.state.collectNowDialogOpen}
          onClose={this.handleCollectNowDialogClose}
        >
          <DialogTitle> Collect Money </DialogTitle>
          <DialogContent>
            Customer Name:
            {this.state.selectedUser.first_name +
              " " +
              this.state.selectedUser.last_name}
            <h6>
              Pending: ₹
              {this.state.selectedUser.to_collect -
                this.state.selectedUser.collected <
              0
                ? Math.abs(
                    this.state.selectedUser.to_collect -
                      this.state.selectedUser.collected
                  ) + "(Adv)"
                : this.state.selectedUser.to_collect -
                  this.state.selectedUser.collected}
            </h6>
            <div style={{ marginTop: "20px" }}>
              <TextField
                fullWidth
                label="Your UPI ID"
                variant="filled"
                name="userUPIId"
                value={this.state.userUPIId}
                onChange={this.handleInputChange}
              />
              <br />
              <br />
              <TextField
                fullWidth
                label="Amount"
                variant="filled"
                name="UPIAmount"
                value={this.state.UPIAmount}
                onChange={this.handleInputChange}
              />
              <br />
              <br />
              <h6> Request via: </h6>
              <Button
                variant="contained"
                startIcon={<WhatsApp />}
                style={{
                  backgroundColor: "green",
                  color: "white",
                  marginRight: "20px",
                }}
                onClick={() => {
                  if (
                    this.state.userUPIId.trim().length === 0 ||
                    this.state.UPIAmount.trim().length === 0
                  ) {
                    toast.error("Please enter all fields");
                  } else {
                    this.collectMoneyWhatsapp();
                  }
                }}
              >
                WhatsApp
              </Button>
              <Button
                variant="contained"
                startIcon={<Sms />}
                style={{ backgroundColor: "#01579B", color: "white" }}
                onClick={() => {
                  if (
                    this.state.userUPIId.trim().length === 0 ||
                    this.state.UPIAmount.trim().length === 0
                  ) {
                    toast.error("Please enter all fields");
                  } else {
                    this.collectMoneySMS();
                  }
                }}
              >
                SMS
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.mobileDialogOpen}
          onClose={this.handleMobileDialogClose}
        >
          <DialogContent>
            <div style={{ margin: "20px" }}>
              <h5>
                <LangConvertComponent name="customer_name" />:
                {this.state.selectedMobileNumber.name}
              </h5>
              <h6>
                <LangConvertComponent name="mobile_number" />:
                {this.state.selectedMobileNumber.mobile}
              </h6>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.addCustomerDialogOpen}
          onClose={this.handleAddCustomerDialogClose}
        >
          <DialogTitle> Enter details to add customer </DialogTitle>
          <DialogContent>
            <div>
              <Form onSubmit={this.handleSubmit}>
                <TextField
                  inputProps={{
                    style: { backgroundColor: "white" },
                  }}
                  variant="filled"
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={this.state.first_name}
                  onChange={this.handleInputChange}
                />
                <br />
                <br />
                <TextField
                  inputProps={{
                    style: { backgroundColor: "white" },
                  }}
                  variant="filled"
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={this.state.last_name}
                  onChange={this.handleInputChange}
                />
                <br />
                <br />
                <TextField
                  inputProps={{
                    style: { backgroundColor: "white" },
                  }}
                  variant="filled"
                  fullWidth
                  label="Mobile"
                  name="mobile"
                  value={this.state.mobile}
                  onChange={this.handleInputChange}
                />
                <br />
                <br />
                <div className="d-flex justify-content-center">
                  <input
                    className="HomeBlueButtonInput"
                    id=""
                    type="submit"
                    value="Add"
                  />
                </div>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-0 nopadding">
              <SidebarComponent activePage="Home" />
            </div>
            <div className="col-sm-12 nopadding">
              <div className="PageContentMainDiv">
                <div className="PageContentContentDiv">
                  <HeaderComponent />
                  <div className="HomeMainDiv">
                    <div className="HomeTopDiv">
                      <Row>
                        <Col sm xs="6">
                          <div>
                            <h6>
                              <LangConvertComponent name="to_collect" />
                            </h6>
                            <p id="BlueColorText">
                              
                              ₹
                              {this.state.data.to_collect -
                                this.state.data.collected}
                            </p>
                          </div>
                        </Col>
                        <Col sm xs="6">
                          <div>
                            <h6>
                              <LangConvertComponent name="collected" />
                            </h6>
                            <p id="BlueColorText">
                              
                              ₹{this.state.data.collected}
                            </p>
                          </div>
                        </Col>
                        <Col sm xs="6">
                          <div>
                            <h6>
                              <LangConvertComponent name="to_pay" />
                            </h6>
                            <p id="BlueColorText">
                              
                              ₹
                              {this.state.data.to_pay - this.state.data.paid < 0
                                ? Math.abs(
                                    this.state.data.to_pay -
                                      this.state.data.paid
                                  ) + "(Adv)"
                                : this.state.data.to_pay -
                                  this.state.data.paid}
                            </p>
                          </div>
                        </Col>
                        <Col sm xs="6">
                          <div>
                            <h6>
                              <LangConvertComponent name="paid" />
                            </h6>
                            <p id="BlueColorText"> ₹{this.state.data.paid} </p>
                          </div>
                        </Col>
                      </Row>
                      <div style={{ textAlign: "right" }}>
                        <Link to="/user/report" id="NoHoverLink">
                          <h6>
                            <LangConvertComponent name="view_reports" />
                            <span>
                              <img
                                src={RightArrowImg}
                                className="img-fluid"
                                style={{ width: "20px" }}
                              />
                            </span>
                          </h6>
                        </Link>
                      </div>
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
                          this.getHomeDetails(
                            this.state.cookies.get("userInfo"),
                            !this.state.mostRecent
                          );
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
                          this.getHomeDetails(
                            this.state.cookies.get("userInfo"),
                            !this.state.mostRecent
                          );
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
                                <LangConvertComponent name="search_customer" />
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
                        <span
                          className="HomeSecondDivRightIconItem"
                          style={{ cursor: "pointer" }}
                          onClick={() => this.handleAddCustomerDialogOpen()}
                        >
                          <img src={AddIcon} style={{ width: "20px" }} />
                        </span>
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
                          
                          {this.state.customers.length === 0 ? (
                            <div> </div>
                          ) : (
                            this.state.customers.map((item) => (
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
                                          
                                          {item.first_name[0] +
                                            item.last_name[0]}
                                        </Avatar>
                                      </span>
                                      <Link
                                        to={`/customer/${item.ID}`}
                                        id="NoHoverLink"
                                      >
                                        <span style={{ marginLeft: "10px" }}>
                                          
                                          {item.first_name +
                                            " " +
                                            item.last_name}
                                        </span>
                                      </Link>
                                      <span style={{ float: "right" }}>
                                        <img
                                          onClick={() =>
                                            this.handleMobileDialogOpen({
                                              name:
                                                item.first_name +
                                                " " +
                                                item.last_name,
                                              mobile: item.mobile,
                                            })
                                          }
                                          src={CallIcon}
                                          style={{ width: "20px" }}
                                        />
                                      </span>
                                    </h6>
                                    <br />
                                    <Row>
                                      <Col sm xs="6">
                                        <div className="HomeThirdDivPayItems">
                                          <h6 id="GreyColorText">
                                            <LangConvertComponent name="to_collect" />
                                          </h6>
                                          <p>
                                            <b>
                                              
                                              ₹
                                              {item.to_collect -
                                                item.collected <
                                              0
                                                ? Math.abs(
                                                    item.to_collect -
                                                      item.collected
                                                  ) + "(Adv)"
                                                : item.to_collect -
                                                  item.collected}
                                            </b>
                                          </p>
                                        </div>
                                      </Col>
                                      <Col sm xs="6">
                                        <div className="HomeThirdDivPayItems">
                                          <h6 id="GreyColorText">
                                            <LangConvertComponent name="to_pay" />
                                          </h6>
                                          <p>
                                            <b>
                                              
                                              ₹
                                              {item.to_pay - item.paid < 0
                                                ? Math.abs(
                                                    item.to_pay - item.paid
                                                  ) + "(Adv)"
                                                : item.to_pay - item.paid}
                                            </b>
                                          </p>
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col sm xs="6">
                                        <div className="HomeThirdDivPayItems">
                                          <h6 id="GreyColorText">
                                            <LangConvertComponent name="collected" />
                                          </h6>
                                          <p>
                                            <b> ₹{item.collected} </b>
                                          </p>
                                        </div>
                                      </Col>
                                      <Col sm xs="6">
                                        <div className="HomeThirdDivPayItems">
                                          <h6 id="GreyColorText">
                                            <LangConvertComponent name="paid" />
                                          </h6>
                                          <p>
                                            <b> ₹{item.paid} </b>
                                          </p>
                                        </div>
                                      </Col>
                                    </Row>
                                    <hr />
                                  </div>
                                  <Row>
                                    <Col sm xs className="nopadding">
                                      
                                      {/* <div className="HomeThirdDivPayItems">
                                                                    <h6>
                                                                      <img
                                                                        src={RemindIcon}
                                                                        style={{ width: "20px" }}
                                                                      />
                                                                      <a
                                                                        id="NoHoverLink"
                                                                        target="_blank"
                                                                        href={
                                                                          "https://wa.me/+91" +
                                                                          item.mobile +
                                                                          "?text=Dear%20Sir/Madam,%20Your%20payment%20of%20₹" +
                                                                          (item.to_collect -
                                                                            item.collected) +
                                                                          "%20is%20pending%20at%20" +
                                                                          this.state.data.business_name
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
                                                                        <span
                                                                          style={{
                                                                            marginLeft: "5px",
                                                                            paddingTop: "0px",
                                                                          }}
                                                                        >
                                                                          <LangConvertComponent name="remind" />
                                                                        </span>
                                                                      </a>
                                                                    </h6>
                                                                  </div> */}
                                      <Link
                                        to={`/customercreateinvoice/${
                                          item.first_name + " " + item.last_name
                                        }/${item.mobile}`}
                                        id="NoHoverLink"
                                      >
                                        <div className="HomeThirdDivPayItems">
                                          <h6>
                                            <img
                                              src={CustomerInvoiceIcon}
                                              style={{ width: "20px" }}
                                            />
                                            <span
                                              style={{
                                                marginLeft: "5px",
                                                paddingTop: "0px",
                                              }}
                                            >
                                              <LangConvertComponent name="create_invoice" />
                                            </span>
                                          </h6>
                                        </div>
                                      </Link>
                                    </Col>
                                    <Col sm xs className="nopadding">
                                      <Link
                                        to={`/addhisabentry/${item.ID}/${
                                          item.first_name + " " + item.last_name
                                        }/${item.mobile}`}
                                        id="NoHoverLink"
                                      >
                                        <div className="HomeThirdDivPayItems">
                                          <h6>
                                            <img
                                              src={AddIcon}
                                              style={{ width: "20px" }}
                                            />
                                            <span
                                              style={{
                                                marginLeft: "5px",
                                                paddingTop: "0px",
                                              }}
                                            >
                                              <LangConvertComponent name="add_entry" />
                                            </span>
                                          </h6>
                                        </div>
                                      </Link>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col sm xs className="nopadding">
                                      <div
                                        className="HomeThirdDivPayItems"
                                        onClick={() =>
                                          this.handlePayNowDialogOpen(item)
                                        }
                                      >
                                        <h6>
                                          <img
                                            src={PaynowIcon}
                                            style={{ width: "20px" }}
                                          />
                                          <span
                                            style={{
                                              marginLeft: "5px",
                                              paddingTop: "0px",
                                            }}
                                          >
                                            <LangConvertComponent name="pay_now" />
                                          </span>
                                        </h6>
                                      </div>
                                    </Col>
                                    <Col sm xs className="nopadding">
                                      <div
                                        className="HomeThirdDivPayItems"
                                        onClick={() =>
                                          this.handleCollectNowDialogOpen(item)
                                        }
                                      >
                                        <h6>
                                          <img
                                            src={CollectnowIcon}
                                            style={{ width: "20px" }}
                                          />
                                          <span
                                            style={{
                                              marginLeft: "5px",
                                              paddingTop: "0px",
                                            }}
                                          >
                                            <LangConvertComponent name="collect_now" />
                                          </span>
                                        </h6>
                                      </div>
                                    </Col>
                                  </Row>
                                </div>
                              </Col>
                            ))
                          )}
                        </Row>
                      </Container>
                    </div>
                    <BottomBarComponent />
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

export default HomeComponent;
