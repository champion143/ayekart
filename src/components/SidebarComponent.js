import React, { Component } from "react";

import HeaderDp from "../assets/headerdp.png";
import DownArrowIcon from "../assets/DownArrow.png";

import HomeIcon from "../assets/HomeIcon.png";
import FinanceIcon from "../assets/FinanceIcon.png";
import ProductsIcon from "../assets/ProductsIcon.png";
import StockIcon from "../assets/StockIcon.png";
import StaffIcon from "../assets/StaffIcon.png";
import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import Cookies from "universal-cookie/es6";
import { logOutUser, validateLogin } from "./constants/functions";

import AyekartHisabLogo from "../assets/AyekartHisabLogo.png";
import { Col, Row } from "reactstrap";
import {
  AccountCircleOutlined,
  CardGiftcardOutlined,
  CloseOutlined,
  ListAltOutlined,
  PowerSettingsNewOutlined,
  VerifiedUser,
  VerifiedUserOutlined,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import LangConvertComponent from "./LangConvertComponent";

class SidebarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: this.props.activePage,
      cookies: new Cookies(),
      userInfo: new Cookies().get("userInfo"),
      dialogOpen: false,
    };
  }
  handleDialogOpen = () => {
    this.setState({
      dialogOpen: true,
    });
  };
  handleDialogClose = () => {
    this.setState({
      dialogOpen: false,
    });
  };
  componentDidMount() {
    validateLogin
      .then((res) => {
        this.setState({
          userInfo: this.state.cookies.get("userInfo"),
        });
      })
      .catch((err) => {
        window.location.href = "/login";
      });
  }
  render() {
    return (
      <React.Fragment>
        <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose}>
          <DialogTitle>
            <Row>
              <Col sm>
                <div></div>
              </Col>
              <Col sm>
                <div style={{ textAlign: "center" }}>
                  <img
                    src={AyekartHisabLogo}
                    className="img-fluid"
                    style={{ width: "500px" }}
                  />
                </div>
              </Col>
              <Col sm>
                <div style={{ float: "right" }}>
                  <CloseOutlined
                    onClick={() => this.handleDialogClose()}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </Col>
            </Row>
          </DialogTitle>
          <DialogContent>
            <div className="SideDialogMenuMainDiv">
              <Link to="/userprofile" id="NoHoverLink">
                <div className="SideDialogMenuItem">
                  <h4>
                    <AccountCircleOutlined
                      style={{ fontSize: "30px", marginRight: "10px" }}
                    />
                    {this.state.userInfo.business.business_name}
                  </h4>
                </div>
              </Link>
              <div className="SideDialogMenuItem">
                <h4>
                  <CardGiftcardOutlined
                    style={{ fontSize: "30px", marginRight: "10px" }}
                  />
                  <LangConvertComponent name="offers" />
                </h4>
              </div>
              <div
                className="SideDialogMenuItem"
                onClick={() =>
                  window.open(
                    "https://drive.google.com/file/d/1-ObpvisPFAyta50T7frZoQ13sdY1xH65/view?usp=sharing",
                    "_blank"
                  )
                }
              >
                <h4>
                  <VerifiedUserOutlined
                    style={{ fontSize: "30px", marginRight: "10px" }}
                  />
                  <LangConvertComponent name="privacy_policy" />
                </h4>
              </div>
              <div
                className="SideDialogMenuItem"
                onClick={() =>
                  window.open(
                    "https://drive.google.com/file/d/1QstQAXtaxIehtDS-d2kaX-m18L8RnTke/view?usp=sharing",
                    "_blank"
                  )
                }
              >
                <h4>
                  <ListAltOutlined
                    style={{ fontSize: "30px", marginRight: "10px" }}
                  />
                  <LangConvertComponent name="terms_amp_conditions" />
                </h4>
              </div>
              <div className="SideDialogMenuItem" onClick={() => logOutUser()}>
                <h4>
                  <PowerSettingsNewOutlined
                    style={{ fontSize: "30px", marginRight: "10px" }}
                  />
                  <LangConvertComponent name="logout" />
                </h4>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <div className="col-sm-0 nopadding d-none d-sm-block">
          <div className="SidePanel fixed-top">
            <div
              className="SidePanelTopImageDiv d-flex justify-content-center"
              style={{ textAlign: "center" }}
            >
              <Avatar
                style={{
                  backgroundColor: "#0D3293",
                  width: "120px",
                  height: "120px",
                  fontSize: "50px",
                }}
                className=""
              >
                {this.state.userInfo.business.business_name[0]}
              </Avatar>
              {/* <img src={this.state.userInfo.profile_img_url} /> */}
            </div>
            <div>
              <h6
                style={{
                  marginTop: "10px",
                  cursor: "pointer",
                  textAlign: "center",
                }}
                onClick={() => this.handleDialogOpen()}
              >
                {this.state.userInfo.business.business_name}
                <span>
                  <img
                    src={DownArrowIcon}
                    style={{ width: "30px", marginLeft: "10px" }}
                  />
                </span>
              </h6>
            </div>

            <div className="SidePanelMenuDiv">
              <Link to="/home" id="NoHoverLink">
                <div
                  className="SidePanelItemDiv"
                  id={
                    this.state.activePage === "Home" ? "ActiveSideMenuItem" : ""
                  }
                >
                  <h6>
                    <span>
                      <img
                        src={HomeIcon}
                        className="img-fluid"
                        style={{ width: "20px" }}
                      />
                    </span>
                    <span style={{ marginLeft: "10px", marginTop: "30px" }}>
                      <LangConvertComponent name="title_home" />
                    </span>
                  </h6>
                </div>
              </Link>

              <Link to="/finance" id="NoHoverLink">
                <div
                  className="SidePanelItemDiv"
                  id={
                    this.state.activePage === "Finance"
                      ? "ActiveSideMenuItem"
                      : ""
                  }
                >
                  <h6>
                    <span>
                      <img
                        src={FinanceIcon}
                        className="img-fluid"
                        style={{ width: "20px" }}
                      />
                    </span>
                    <span style={{ marginLeft: "10px" }}>
                      <LangConvertComponent name="title_finance" />
                    </span>
                  </h6>
                </div>
              </Link>

              <Link to="/inventory" id="NoHoverLink">
                <div
                  className="SidePanelItemDiv"
                  id={
                    (this.state.activePage === "Products" || this.state.activePage === "Stock")
                      ? "ActiveSideMenuItem"
                      : ""
                  }
                >
                  <h6>
                    <span>
                      <img
                        src={ProductsIcon}
                        className="img-fluid"
                        style={{ width: "20px" }}
                      />
                    </span>
                    <span style={{ marginLeft: "10px" }}>
                      <LangConvertComponent name="title_products" />
                    </span>
                  </h6>
                </div>
              </Link>

              {/* <Link to="/stock" id="NoHoverLink">
                <div
                  className="SidePanelItemDiv"
                  id={
                    this.state.activePage === "Stock"
                      ? "ActiveSideMenuItem"
                      : ""
                  }
                >
                  <h6>
                    <span>
                      <img
                        src={StockIcon}
                        className="img-fluid"
                        style={{ width: "20px" }}
                      />
                    </span>
                    <span style={{ marginLeft: "10px" }}>
                      <LangConvertComponent name="title_stock" />
                    </span>
                  </h6>
                </div>
              </Link> */}

              <Link to="/staff" id="NoHoverLink">
                <div
                  className="SidePanelItemDiv"
                  id={
                    this.state.activePage === "Staff"
                      ? "ActiveSideMenuItem"
                      : ""
                  }
                >
                  <h6>
                    <span>
                      <img
                        src={StaffIcon}
                        className="img-fluid"
                        style={{ width: "20px" }}
                      />
                    </span>
                    <span style={{ marginLeft: "10px" }}>
                      <LangConvertComponent name="title_staff" />
                    </span>
                  </h6>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SidebarComponent;
