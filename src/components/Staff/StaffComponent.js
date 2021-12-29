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
import Cookies from "universal-cookie/es6";
import LoadingComponent from "../LoadingComponent";
import { validateLogin } from "../constants/functions";
import { APIURL } from "../constants/APIURL";
import { toast } from "react-toastify";

import moment from "moment";
import { Avatar, Dialog, DialogContent, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import LangConvertComponent from "../LangConvertComponent";

import LoaderGif from "../../assets/loader.gif";

class StaffComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      userInfo: {},
      data: {},
      isLoading: true,

      searchClicked: false,
      searchQuery: "",
      staff: [],

      //
      mobileDialogOpen: false,
      selectedMobileNumber: "",
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

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

  handleSearchChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });

    var SearchResult = this.state.staff.filter((item) =>
      item.full_name.toString().toLowerCase().includes(value.toLowerCase())
    );
    if (value.length <= 0) {
      this.setState({
        isLoading: true,
      });
      this.getStaff();
    } else {
      this.setState({
        staff: SearchResult,
      });
    }
  }

  createAttendance = (creds, staffId) => {
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
        "/staff/" +
        staffId +
        "/attendance",
      requestOptions
    )
      .then((response) => {
        if (response.status !== 201) {
          throw Error("Error");
        }
        return response.json();
      })
      .then((result) => {
        this.setState({
          isLoading: true,
        });
        this.getStaff();
      })
      .catch((error) => console.log("error", error));
  };

  changeAttendance = (key, value, staffId, attendanceId) => {
    this.setState({
      isLoading: true
    });
    if (key === "present") {
      this.updateStaffAttendance(
        {
          present: value,
          absent: false,
          halfday: false,
          overtime: false,
          staff_id: staffId,
        },
        staffId,
        attendanceId
      );
    }
    if (key === "halfday" || key == 'halfDay') {
      this.updateStaffAttendance(
        {
          present: false,
          absent: false,
          halfday: value,
          overtime: false,
          staff_id: staffId,
        },
        staffId,
        attendanceId
      );
    }
    if (key === "absent") {
      this.updateStaffAttendance(
        {
          present: false,
          absent: value,
          halfday: false,
          overtime: false,
          staff_id: staffId,
        },
        staffId,
        attendanceId
      );
    }
  };

  updateStaffAttendance = (creds, staffId, attendanceId) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(creds);

    var requestOptions = {
      method: "PUT",
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://proxycorsserversurya.herokuapp.com/" +
        APIURL +
        "/user/" +
        this.state.userInfo.ID +
        "/business/" +
        this.state.userInfo.business.ID +
        "/staff/" +
        staffId +
        "/attendance/" +
        attendanceId,
      requestOptions
    )
      .then((response) => {
        if (response.status !== 202) {
          throw Error("Error");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        toast.success("Attendance updated");
        this.setState({
          isLoading: true,
        });
        this.getStaff();
      })
      .catch((error) => {
        console.log("error", error);
        toast.error("Something error");
      });
  };
  getStaff = () => {
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
        "/staff",
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
        this.setState({
          isLoading: false,
          data: result.data,
          staff: result.data,
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
        this.getStaff();
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
        <Dialog
          open={this.state.mobileDialogOpen}
          onClose={this.handleMobileDialogClose}
        >
          <DialogContent>
            <div style={{ margin: "20px" }}>
              <h5>
                <LangConvertComponent name="name" />:{" "}
                {this.state.selectedMobileNumber.name}
              </h5>
              <h6>
                <LangConvertComponent name="mobile_number" />:{" "}
                {this.state.selectedMobileNumber.mobile}
              </h6>
            </div>
          </DialogContent>
        </Dialog>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-0 nopadding">
              <SidebarComponent activePage="Staff" />
            </div>

            <div className="col-sm-12 nopadding">
              <div className="PageContentMainDiv">
                <div className="PageContentContentDiv">
                  <HeaderComponent />

                  <div className="HomeMainDiv">
                    {/* <div className="HomeTopDiv">
                      <Row>
                        <Col sm xs>
                          <div>
                            <h6>Advance</h6>
                            <p id="BlueColorText">₹ 0</p>
                          </div>
                        </Col>

                        <Col sm xs>
                          <div>
                            <h6>Pending</h6>
                            <p id="BlueColorText">₹ 10000</p>
                          </div>
                        </Col>

                        <Col sm xs>
                          <div>
                            <h6>Present</h6>
                            <p id="BlueColorText">20</p>
                          </div>
                        </Col>

                        <Col sm xs>
                          <div>
                            <h6>Absent</h6>
                            <p id="BlueColorText">2</p>
                          </div>
                        </Col>
                        <Col sm>
                          <div style={{ textAlign: "right" }}>
                            <Link to="/staffreport" id="NoHoverLink">
                              <h6>
                                View Reports
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
                        </Col>
                      </Row>
                    </div> */}
                    <br />
                    <div style={{ textAlign: "right" }}>
                      <Link to="/staffreport" id="NoHoverLink">
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
                    <br />

                    <div className="HomeSecondDiv">
                      {/* <div
                        className="HomeBlueButton"
                        style={{ float: "left", margin: "6px" }}
                      >
                        <h6>Most Recent</h6>
                      </div> */}

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
                                <LangConvertComponent name="search_staff" />
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
                        <Link to="/addstaff">
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

                    <div className="HomeThirdDiv">
                      <Container fluid>
                        <Row>
                          {this.state.data.length > 0 &&
                            this.state.staff.reverse().map((item) => (
                              <Col sm="5" className="HomeThirdDivItemDiv">
                                <Row>
                                  <Col sm="0" xs="0" className="nopadding">
                                    <div>
                                      {/* <img
                                          src={HeaderDp}
                                          className="img-fluid"
                                          style={{
                                            width: "50px",
                                            marginLeft: "10px",
                                          }}
                                        /> */}
                                      <Avatar
                                        style={{
                                          backgroundColor: item.profile_image_URL == "" ? "#0D3293" : "",
                                          padding: item.profile_image_URL == "" ? "10px" : "",
                                          marginLeft: "10px",
                                        }}
                                      >
                                        { item.profile_image_URL == "" ? item.full_name[0] : <img
                                          src={
                                            item.profile_image_URL
                                          }
                                          className="img-fluid"
                                          style={{ width: "100px" }}
                                        />}
                                      </Avatar>
                                    </div>
                                  </Col>
                                  <Col sm xs>
                                    <div>
                                      <h6>
                                        <Link
                                          to={`/staffprofile/${item.ID}`}
                                          id="NoHoverLink"
                                        >
                                          {item.full_name}
                                        </Link>
                                        <span style={{ float: "right" }}>
                                          <img
                                            onClick={() =>
                                              this.handleMobileDialogOpen({
                                                name: item.full_name,
                                                mobile: item.mobile_number,
                                              })
                                            }
                                            src={CallIcon}
                                            style={{ width: "20px" }}
                                          />
                                        </span>
                                      </h6>
                                      <p>
                                        <LangConvertComponent name="salary_due" />
                                        <span className="BlueColorText">
                                          {" "}
                                          ₹ {item.staff_salary}
                                        </span>{" "}
                                        for{" "}
                                        {moment(new Date()).format("MMM YYYY")}
                                      </p>
                                    </div>
                                  </Col>
                                </Row>

                                {item.staff_attendence.length <= 0 ? (
                                  <Row>
                                    <Col sm xs>
                                      <div
                                        className="HomeBlueButtonSmallOutlined"
                                        style={{
                                          margin: "6px",
                                          textAlign: "center",
                                        }}
                                        onClick={() =>
                                          this.createAttendance(
                                            {
                                              present: true,
                                              absent: false,
                                              halfday: false,
                                              overtime: false,
                                              staff_id: item.ID,
                                            },
                                            item.ID
                                          )
                                        }
                                      >
                                        <h6>
                                          <LangConvertComponent name="present" />
                                        </h6>
                                      </div>
                                    </Col>

                                    <Col sm xs>
                                      <div
                                        className="HomeBlueButtonSmallOutlined"
                                        style={{
                                          margin: "6px",
                                          textAlign: "center",
                                        }}
                                        onClick={() =>
                                          this.createAttendance(
                                            {
                                              present: false,
                                              absent: false,
                                              halfday: true,
                                              overtime: false,
                                              staff_id: item.ID,
                                            },
                                            item.ID
                                          )
                                        }
                                      >
                                        <h6>
                                          <LangConvertComponent name="half_day" />
                                        </h6>
                                      </div>
                                    </Col>

                                    <Col sm xs>
                                      <div
                                        className="HomeBlueButtonSmallOutlined"
                                        style={{
                                          margin: "6px",
                                          textAlign: "center",
                                        }}
                                        onClick={() =>
                                          this.createAttendance(
                                            {
                                              present: false,
                                              absent: true,
                                              halfday: false,
                                              overtime: false,
                                              staff_id: item.ID,
                                            },
                                            item.ID
                                          )
                                        }
                                      >
                                        <h6>
                                          <LangConvertComponent name="absent" />
                                        </h6>
                                      </div>
                                    </Col>
                                  </Row>
                                ) : (
                                  <Row>
                                    <Col sm xs>
                                      <div
                                        className={
                                          item.staff_attendence[0].present ===
                                          true
                                            ? "HomeBlueButtonSmall"
                                            : "HomeBlueButtonSmallOutlined"
                                        }
                                        style={{
                                          margin: "6px",
                                          textAlign: "center",
                                        }}
                                        onClick={() =>
                                          this.changeAttendance(
                                            "present",
                                            !item.staff_attendence[0].present,
                                            item.ID,
                                            item.staff_attendence[0].ID
                                          )
                                        }
                                      >
                                        <h6>
                                          <LangConvertComponent name="present" />
                                        </h6>
                                      </div>
                                    </Col>
                                    <Col sm xs>
                                      <div
                                        className={
                                          item.staff_attendence[0].half_Day ===
                                          true
                                            ? "HomeBlueButtonSmall"
                                            : "HomeBlueButtonSmallOutlined"
                                        }
                                        style={{
                                          margin: "6px",
                                          textAlign: "center",
                                        }}
                                        onClick={() =>
                                          this.changeAttendance(
                                            "halfDay",
                                            !item.staff_attendence[0].half_Day,
                                            item.ID,
                                            item.staff_attendence[0].ID
                                          )
                                        }
                                      >
                                        <h6>
                                          <LangConvertComponent name="half_day" />
                                        </h6>
                                      </div>
                                    </Col>
                                    <Col sm xs>
                                      <div
                                        className={
                                          item.staff_attendence[0].absent ===
                                          true
                                            ? "HomeBlueButtonSmall"
                                            : "HomeBlueButtonSmallOutlined"
                                        }
                                        style={{
                                          margin: "6px",
                                          textAlign: "center",
                                        }}
                                        onClick={() =>
                                          this.changeAttendance(
                                            "absent",
                                            !item.staff_attendence[0].absent,
                                            item.ID,
                                            item.staff_attendence[0].ID
                                          )
                                        }
                                      >
                                        <h6>
                                          <LangConvertComponent name="absent" />
                                        </h6>
                                      </div>
                                    </Col>
                                  </Row>
                                )}
                              </Col>
                            ))}
                          <Col sm xs>
                            <div></div>
                          </Col>
                        </Row>
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

export default StaffComponent;
