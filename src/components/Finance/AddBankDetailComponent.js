import "date-fns";
import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";
import {
  TextField,
} from "@material-ui/core";

import TrustedIcon from "../../assets/trusted.png";
import Cookies from "universal-cookie/es6";
import { validateLogin } from "../constants/functions";
import { APIURL1 } from "../constants/APIURL";
import { toast } from "react-toastify";
import "jspdf-autotable";
import LoadingComponent from "../LoadingComponent";
import LangConvertComponent from "../LangConvertComponent";

class AddBankDetailComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cookies: new Cookies(),
      userInfo: {},
      account_holder_name: "",
      ifsc_code: "",
      account_number: 0,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
    console.log(name + ":" + value);
  }
  handleSubmit = () => {
    if (
      this.state.account_holder_name === "" ||
      this.state.ifsc_code === "" ||
      this.state.account_number === ""
    ) {
      toast.error("Enter all the required fields");
    } else {
      this.addAccount({
        "business_id":this.state.userInfo?.business?.ID,
        "ifsc_code":this.state.ifsc_code,
        "account_holder_name":this.state.account_holder_name,
        "account_number":this.state.account_number,
        "branch_name":"Pune",
        "bank_name":"ICICI"
      });
    }
  };

  addAccount = (creds) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(creds);

    var requestOptions = {
      method: "POST",
      body: raw,
      redirect: "follow",
    };

    fetch(
      APIURL1 +
        "/hisab/bank_details/",
      requestOptions
    )
      .then((response) => {
        if (response.status !== 201) {
          throw Error("Error");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        toast.success("Account added");
      })
      .catch((error) => {
        console.log("error", error);
        toast.error("Something error");
      });
  };
  componentDidMount() {
    validateLogin
      .then((res) => {
        this.setState({
          userInfo: this.state.cookies.get("userInfo"),
        },() => console.log(this.state.userInfo));
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
        <div className="container-fluid" id="BankDetail">
          <div className="row">
            <div className="col-sm-0 nopadding">
              <SidebarComponent activePage="Finance" />
            </div>

            <div className="col-sm-12 nopadding">
              <div className="PageContentMainDiv">
                <div className="PageContentContentDiv">
                  <HeaderComponent />

                  <div className="HomeMainDiv" style={{ marginTop: "20px" }}>
                    <Container>
                      <Row>
                        <Col sm="12" md={{ offset: 4, order: 2, size: 4 }}   >
                          <div style={{textAlign:'center'}}>
                            <img className="bankDetailIcon" src={TrustedIcon} alt="trustedIcon" />
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="12" md={{ offset: 3, order: 2, size: 6 }}   >
                          <div style={{textAlign:'center'}}>
                            <span className="bankDetailHeading">
                              <LangConvertComponent name="all_payments_are_100_safe_and_secure" />
                            </span>
                            <span className="bankDetailSubHeading">                              
                              <LangConvertComponent name="enter_your_bank_details" />
                            </span>
                          </div>
                        </Col>
                      </Row>
                      <br />

                      <Row>
                        <Col sm>
                          <TextField
                            variant="filled"
                            label={
                              <LangConvertComponent name="account_holder_name" />
                            }
                            fullWidth
                            name="account_holder_name"
                            value={this.state.account_holder_name}
                            onChange={this.handleInputChange}
                          />
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col sm>
                          <TextField
                            variant="filled"
                            label={
                              <LangConvertComponent name="ifsc_code" />
                            }
                            fullWidth
                            name="ifsc_code"
                            value={this.state.ifsc_code}
                            onChange={this.handleInputChange}
                          />
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col sm>
                          <TextField
                            variant="filled"
                            label={
                              <LangConvertComponent name="account_number" />
                            }
                            fullWidth
                            name="account_number"
                            value={this.state.account_number}
                            onChange={this.handleInputChange}
                          />
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col sm="12" md={{ offset: 4, order: 2, size: 4 }}>                          
                          <div
                            className="HomeBlueButton"
                            style={{ margin: "0px", textAlign: "center" }}
                            onClick={() => this.handleSubmit()}
                          >
                            <h6>
                              <LangConvertComponent name="verify_and_add" />
                            </h6>
                          </div>
                        </Col>
                      </Row>
                      <br />
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

export default AddBankDetailComponent;
