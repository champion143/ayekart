import {
  Avatar,
  Badge,
  Breadcrumbs,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import {
  ArrowDownwardSharp,
  ExpandMore,
  More,
  MoreVert,
  NavigateNext,
  NotificationImportant,
  Notifications,
  Translate,
} from "@material-ui/icons";
import AyekartHisabLogo from "../assets/AyekartHisabLogo.png";
import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";

import HeaderDP from "../assets/headerdp.png";
import AyekartHasibLogo from "../assets/AyekartHisabLogo.png";
import Cookies from "universal-cookie/es6";

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
import { logOutUser } from "./constants/functions";
import LangConvertComponent from "./LangConvertComponent";
import { set } from "idb-keyval";

class HeaderComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: new Cookies().get("userInfo"),
      headerLeft: this.props.headerLeft,
      headerCenter: this.props.headerCenter,
      cookies: new Cookies(),
      dialogOpen: false,

      //
      langDialogOpen: false,
    };
  }

  handleLangDialogOpen = () => {
    this.setState({
      langDialogOpen: true,
    });
  };
  handleLangDialogClose = () => {
    this.setState({
      langDialogOpen: false,
    });
  };
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
  changeLang = (key) => {
    set("lang", key)
      .then((val) => {
        window.location.reload();
      })
      .catch((err) => {});
  };
  render() {
    return (
      <React.Fragment>
        <Dialog
          open={this.state.langDialogOpen}
          onClose={this.handleLangDialogClose}
        >
          <DialogTitle>
            <h4>Set Language</h4>
          </DialogTitle>
          <DialogContent>
            <div className="LangItemsMainDiv">
              <div className="LangItem" onClick={() => this.changeLang("en")}>
                <h6>English</h6>
              </div>
              <div className="LangItem" onClick={() => this.changeLang("hi")}>
                <h6>हिंदी</h6>
              </div>
              <div className="LangItem" onClick={() => this.changeLang("as")}>
                <h6>অসমী</h6>
              </div>
              <div className="LangItem" onClick={() => this.changeLang("bn")}>
                <h6>বাংলা</h6>
              </div>
              <div className="LangItem" onClick={() => this.changeLang("gu")}>
                <h6>ગુજરાતી</h6>
              </div>
              <div className="LangItem" onClick={() => this.changeLang("kn")}>
                <h6>ಕನ್ನಡ</h6>
              </div>
              <div className="LangItem" onClick={() => this.changeLang("ml")}>
                <h6>മലയാളം</h6>
              </div>
              <div className="LangItem" onClick={() => this.changeLang("mr")}>
                <h6>मराठी</h6>
              </div>
              <div className="LangItem" onClick={() => this.changeLang("or")}>
                <h6>ଓଡିଆ</h6>
              </div>
              <div className="LangItem" onClick={() => this.changeLang("ta")}>
                <h6>தமிழ்</h6>
              </div>
              <div className="LangItem" onClick={() => this.changeLang("tel")}>
                <h6>తెలుగు</h6>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose}>
          <DialogTitle>
            <Row>
              <Col sm xs>
                <div></div>
              </Col>
              <Col sm xs>
                <div style={{ textAlign: "center" }}>
                  <img
                    src={AyekartHisabLogo}
                    className="img-fluid"
                    style={{ width: "900px" }}
                  />
                </div>
              </Col>
              <Col sm xs>
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
                  <h5>
                    <AccountCircleOutlined
                      style={{ fontSize: "30px", marginRight: "10px" }}
                    />
                    {this.state.userInfo.business.business_name}
                  </h5>
                </div>
              </Link>
              <div className="SideDialogMenuItem">
                <h5>
                  <CardGiftcardOutlined
                    style={{ fontSize: "30px", marginRight: "10px" }}
                  />
                  <LangConvertComponent name="offers" />
                </h5>
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
                <h5>
                  <VerifiedUserOutlined
                    style={{ fontSize: "30px", marginRight: "10px" }}
                  />
                  <LangConvertComponent name="privacy_policy" />
                </h5>
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
                <h5>
                  <ListAltOutlined
                    style={{ fontSize: "30px", marginRight: "10px" }}
                  />
                  <LangConvertComponent name="terms_amp_conditions" />
                </h5>
              </div>
              <div className="SideDialogMenuItem" onClick={() => logOutUser()}>
                <h5>
                  <PowerSettingsNewOutlined
                    style={{ fontSize: "30px", marginRight: "10px" }}
                  />
                  <LangConvertComponent name="logout" />
                </h5>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <div className="HeaderMainDiv d-none d-sm-block">
          <Container fluid>
            <Row>
              <Col sm>
                <div className="HeaderLeftDiv">
                  <h6>{this.state.headerLeft}</h6>
                  {/* <Breadcrumbs seperator="?" >
                    <Link color="inherit" href="">
                      Home
                    </Link>
                    <Typography color="textPrimary">Dashboard</Typography>
                  </Breadcrumbs> */}
                </div>
              </Col>

              <Col sm>
                <div className="HeaderCenterDiv">
                  {/* {this.state.headerCenter === "year" ? (
                    <h6>
                      Year: 2020 <ExpandMore />
                    </h6>
                  ) : this.state.headerCenter === "recents" ? (
                    <h6>
                      Recents <ExpandMore />
                    </h6>
                  ) : (
                    <h6></h6>
                  )} */}
                  <img
                    src={AyekartHasibLogo}
                    className="img-fluid"
                    style={{ width: "120px" }}
                  />
                </div>
              </Col>

              <Col sm>
                <div className="HeaderRightDiv">
                  <Row>
                    <Col sm>
                      <div>
                        <Translate onClick={this.handleLangDialogOpen} />
                      </div>
                    </Col>
                    <Col sm>
                      <div style={{ marginTop: "5px" }}>
                        <h6>{this.state.userInfo.first_name}</h6>
                      </div>
                    </Col>
                    <Col sm="0">
                      <div onClick={this.handleDialogOpen}>
                        <Avatar
                          style={{
                            backgroundColor: "#0D3293",
                            width: "40px",
                            height: "40px",
                          }}
                        >
                          {this.state.userInfo.first_name[0] +
                            this.state.userInfo.last_name[0]}
                        </Avatar>
                      </div>
                    </Col>
                  </Row>
                  {/* <h6>
                    <span>
                      <Badge badgeContent={0} color="primary">
                        <Notifications />
                      </Badge>
                      <Link to="/home" id="NoHoverLink">
                        <span style={{ paddingLeft: "20px" }}>
                          {this.state.userInfo.first_name}
                          <span style={{ float: "right", marginLeft: "20px" }}>
                            <Avatar
                              style={{
                                backgroundColor: "#0D3293",
                              }}
                            >
                              {this.state.userInfo.first_name[0] +
                                this.state.userInfo.last_name[0]}
                            </Avatar>
                          </span>
                        </span>
                      </Link>
                    </span>
                  </h6> */}
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <div className="MobileHeaderMainDiv d-block d-sm-none">
          <Container fluid>
            <Row>
              <Col xs>
                <div style={{ paddingTop: "15px" }}>
                  <div>
                    <Translate onClick={this.handleLangDialogOpen} />
                  </div>
                </div>
              </Col>
              <Col xs>
                <div style={{ textAlign: "center" }}>
                  <img
                    src={AyekartHasibLogo}
                    className="img-fluid"
                    style={{ width: "100px", paddingTop: "20px" }}
                  />
                </div>
              </Col>

              <Col xs>
                <div>
                  <div
                    style={{ textAlign: "right", paddingTop: "15px" }}
                    onClick={() => this.handleDialogOpen()}
                  >
                    <MoreVert />
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default HeaderComponent;
