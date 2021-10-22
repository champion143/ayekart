import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import Cookies from "universal-cookie/es6";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

import CrossIcon from "../../assets/cross.png";

import UploadIcon from "../../assets/uploadicon.png";
import { APIURL } from "../constants/APIURL";
import { validateLogin } from "../constants/functions";
import { toast } from "react-toastify";
import LoadingComponent from "../LoadingComponent";
import LangConvertComponent from "../LangConvertComponent";

class EditStaffProfileComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staffId: this.props.match.params.id,
      staffDetails: {},
      isLoading: true,
      notFound: false,
      userInfo: {},
      cookies: new Cookies(),
      salaryType: "Monthly",
      monthlyDates: [],
      salaryCycleDialogOpen: false,

      selectedFiles: [],
      validFiles: [],
      errorMessage: "",

      //

      //form
      full_name: "",
      profile_image_URL: "",
      mobile_number: "",
      openingBalanceType: "Advance",
      staff_salary: "",
      daySelected: "1",
      amount: 0,
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
  }
  handleSubmit = () => {
    this.updateStaff({
      business_id: this.state.userInfo.business.ID,
      full_name: this.state.full_name,
      profile_image_URL: "",
      mobile_number: this.state.mobile_number,
      type_of_salary_payment:
        this.state.openingBalanceType === "Advance" ? "advance" : "pending",
      staff_salary: Number(this.state.staff_salary),
      salary_cycle: Number(this.state.daySelected),
      opening_balance_advance:
        this.state.openingBalanceType === "Advance"
          ? Number(this.state.amount)
          : 0,
      opening_balance_pending:
        this.state.openingBalanceType === "Advance"
          ? 0
          : Number(this.state.amount),
    });
  };

  updateStaff = (creds) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(creds);

    var requestOptions = {
      method: "PUT",
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://proxycorsserversurya.herokuapp.com/" + APIURL +
        "/user/" +
        this.state.userInfo.ID +
        "/business/" +
        this.state.userInfo.business.ID +
        "/staff/" +
        this.state.staffId,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        toast.success("Staff Details Updated");
        window.location.href = "/staffprofile/" + this.state.staffId;
      })
      .catch((error) => console.log("error", error));
  };
  handleOpeningBalanceType = (value) => {
    this.setState({
      openingBalanceType: value,
    });
  };
  handleSalaryTypeChange = (value) => {
    this.setState({
      salaryType: value,
    });
  };
  dragOver = (e) => {
    e.preventDefault();
  };

  dragEnter = (e) => {
    e.preventDefault();
  };

  dragLeave = (e) => {
    e.preventDefault();
  };

  fileSize = (size) => {
    if (size === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  fileType = (fileName) => {
    return (
      fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length) ||
      fileName
    );
  };

  validateFile = (file) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/x-icon",
    ];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  fileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      this.handleFiles(files);
    }
  };

  removeFile = (name) => {
    // find the index of the item
    // remove the item from array

    const selectedFileIndex = this.state.selectedFiles.findIndex(
      (e) => e.name === name
    );
    this.state.selectedFiles.splice(selectedFileIndex, 1);
    // update selectedFiles array

    this.setState({
      selectedFiles: [...this.state.selectedFiles],
    });
  };

  handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      if (this.validateFile(files[i])) {
        // add to an array so we can display the name of file
        this.setState({
          selectedFiles: [...this.state.selectedFiles, files[i]],
        });
      } else {
        // add a new property called invalid
        files[i]["invalid"] = true;
        // add to the same array so we can display the name of the file
        this.setState({
          selectedFiles: [...this.state.selectedFiles, files[i]],
          errorMessage: "File type not permitted",
        });
        // set error message
      }
    }
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
        var staffDetails = {};
        staffDetails = result.data.filter(
          (item) => item.ID == this.state.staffId
        )[0];
        console.log(staffDetails);
        this.setState({
          full_name: staffDetails.full_name,
          profile_image_URL: staffDetails.profile_image_URL,
          mobile_number: staffDetails.mobile_number,
          openingBalanceType:
            staffDetails.type_of_salary_account === "advance"
              ? "Advance"
              : "Pending",
          staff_salary: staffDetails.staff_salary + "",
          daySelected: staffDetails.day_of_salary + "",
          amount:
            staffDetails.type_of_salary_account === "advance"
              ? staffDetails.opening_balance_advance
              : staffDetails.opening_balance_pending,
          isLoading: false,
          data: result.data,
          staffDetails: staffDetails,
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
    var monthlyDates = [];
    for (var i = 1; i <= 30; i++) {
      monthlyDates.push("" + i);
    }
    this.setState({
      monthlyDates: monthlyDates,
    });
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
    if (this.state.notFound) {
      return (
        <React.Fragment>
          <div>User not found</div>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <Dialog open={this.state.salaryCycleDialogOpen}>
          <DialogTitle>
            <LangConvertComponent name="salary_cycle" />
          </DialogTitle>
          <DialogContent>
            <Row>
              {this.state.monthlyDates.map((item) => (
                <Col sm="2">
                  <div
                    className="MonthlyDayItem"
                    id={
                      this.state.daySelected === item
                        ? "MonthlyDayItemSelected"
                        : ""
                    }
                    onClick={() => {
                      this.setState({
                        daySelected: item,
                      });
                    }}
                  >
                    <h6>{item}</h6>
                  </div>
                </Col>
              ))}
            </Row>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ salaryCycleDialogOpen: false })}
            >
              <LangConvertComponent name="ok" />
            </Button>
          </DialogActions>
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

                  <div className="AddStaffMainDiv">
                    <Container>
                      <Row>
                        <Col sm>
                          <TextField
                            inputProps={{
                              style: { backgroundColor: "white" },
                            }}
                            variant="filled"
                            label={
                              <LangConvertComponent name="enter_staff_full_name" />
                            }
                            fullWidth
                            name="full_name"
                            value={this.state.full_name}
                            onChange={this.handleInputChange}
                          />
                        </Col>
                        <Col sm>
                          <TextField
                            inputProps={{
                              style: { backgroundColor: "white" },
                            }}
                            variant="filled"
                            label={
                              <LangConvertComponent name="enter_mobile_number" />
                            }
                            fullWidth
                            name="mobile_number"
                            value={this.state.mobile_number}
                            onChange={this.handleInputChange}
                          />
                        </Col>
                        <Col sm>
                          <TextField
                            inputProps={{
                              style: { backgroundColor: "white" },
                            }}
                            variant="filled"
                            label={
                              <LangConvertComponent name="monthly_salary_of_staff" />
                            }
                            fullWidth
                            name="staff_salary"
                            value={this.state.staff_salary}
                            onChange={this.handleInputChange}
                          />
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col sm className="salaryTypeMainDiv">
                          <div className="">
                            <div
                              style={{
                                textAlign: "center",
                                marginBottom: "30px",
                                marginTop: "20px",
                              }}
                            >
                              <h6>
                                <LangConvertComponent name="select_type_of_salary_payment" />
                              </h6>
                            </div>
                            <div className="salaryTypesMenu">
                              <div
                                className="salaryTypesItem"
                                id={
                                  this.state.salaryType === "Monthly"
                                    ? "salaryTypeSelectedItem"
                                    : ""
                                }
                                onClick={() =>
                                  this.handleSalaryTypeChange("Monthly")
                                }
                              >
                                <h6>
                                  <LangConvertComponent name="monthly" />
                                </h6>
                                <p>
                                  <LangConvertComponent name="fixed_salary_salary_payment_per_month_monthly_payment" />
                                </p>
                              </div>

                              {/* <div
                                className="salaryTypesItem"
                                id={
                                  this.state.salaryType === "Hour"
                                    ? "salaryTypeSelectedItem"
                                    : ""
                                }
                                onClick={() =>
                                  this.handleSalaryTypeChange("Hour")
                                }
                              >
                                <h6>Per hour Basis</h6>
                                <p>
                                  Punch in - Punch out time, Hourly payment
                                  system
                                </p>
                              </div>

                              <div
                                className="salaryTypesItem"
                                id={
                                  this.state.salaryType === "Daily"
                                    ? "salaryTypeSelectedItem"
                                    : ""
                                }
                                onClick={() =>
                                  this.handleSalaryTypeChange("Daily")
                                }
                              >
                                <h6>Daily</h6>
                                <p>
                                  Daily payment, payment on basis of number of
                                  days worked
                                </p>
                              </div>

                              <div
                                className="salaryTypesItem"
                                id={
                                  this.state.salaryType === "Work"
                                    ? "salaryTypeSelectedItem"
                                    : ""
                                }
                                onClick={() =>
                                  this.handleSalaryTypeChange("Work")
                                }
                              >
                                <h6>Work Basis</h6>
                                <p>Payment per piece, work basis Payment</p>
                              </div>

                              <div
                                className="salaryTypesItem"
                                id={
                                  this.state.salaryType === "Weekly"
                                    ? "salaryTypeSelectedItem"
                                    : ""
                                }
                                onClick={() =>
                                  this.handleSalaryTypeChange("Weekly")
                                }
                              >
                                <h6>Weekly</h6>
                                <p>Weekly payment, 7 days work cycle</p>
                              </div> */}
                            </div>
                          </div>
                        </Col>
                        <Col sm>
                          <div>
                            <div
                              className="salaryCycleInputDiv"
                              onClick={() =>
                                this.setState({ salaryCycleDialogOpen: true })
                              }
                            >
                              <p id="BlueColorText">
                                <LangConvertComponent name="salary_cycle" />
                              </p>
                              <h6>
                                {this.state.daySelected} to{" "}
                                {this.state.daySelected} of every Month
                              </h6>
                            </div>

                            <div className="openingBalanceMainDiv">
                              <p id="BlueColorText">
                                <LangConvertComponent name="opening_balance" />
                              </p>

                              <Row>
                                <Col sm xs>
                                  <div
                                    className={
                                      this.state.openingBalanceType ===
                                      "Advance"
                                        ? "HomeBlueButton"
                                        : "HomeWhiteButton"
                                    }
                                    onClick={() => {
                                      this.handleOpeningBalanceType("Advance");
                                    }}
                                    style={{ textAlign: "center" }}
                                  >
                                    <h6>
                                      <LangConvertComponent name="advance" />
                                    </h6>
                                  </div>
                                </Col>
                                <Col sm xs>
                                  <div
                                    className={
                                      this.state.openingBalanceType ===
                                      "Pending"
                                        ? "HomeBlueButton"
                                        : "HomeWhiteButton"
                                    }
                                    onClick={() => {
                                      this.handleOpeningBalanceType("Pending");
                                    }}
                                    style={{ textAlign: "center" }}
                                  >
                                    <h6>
                                      <LangConvertComponent name="pending" />
                                    </h6>
                                  </div>
                                </Col>
                              </Row>
                              <br />
                              <TextField
                                inputProps={{
                                  style: { backgroundColor: "white" },
                                }}
                                variant="filled"
                                label={
                                  <LangConvertComponent name="enter_amount" />
                                }
                                fullWidth
                                name="amount"
                                value={this.state.amount}
                                onChange={this.handleInputChange}
                              />
                            </div>
                          </div>

                          <div>
                            <Col sm className="DragPhotoMainDiv">
                              {this.state.profile_image_URL === "" ? (
                                <div
                                  onDragOver={this.dragOver}
                                  onDragEnter={this.dragEnter}
                                  onDragLeave={this.dragLeave}
                                  onDrop={this.fileDrop}
                                >
                                  <img
                                    src={UploadIcon}
                                    className="img-fluid"
                                    style={{ width: "60px" }}
                                  />
                                  <p>Drag and drop or browse</p>
                                  <h6>Upload Profile Picture (JPEG/PNG)</h6>
                                  <hr />
                                  <div>
                                    {this.state.selectedFiles.map((data, i) => (
                                      <div>
                                        <p>
                                          {data.name}
                                          <span style={{ marginLeft: "10px" }}>
                                            <img
                                              src={CrossIcon}
                                              className="img-fluid"
                                              style={{ width: "15px" }}
                                              onClick={() =>
                                                this.removeFile(data.name)
                                              }
                                            />
                                          </span>
                                        </p>
                                        <p>
                                          {data.invalid && (
                                            <span style={{ color: "red" }}>
                                              ({this.state.errorMessage})
                                            </span>
                                          )}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <img
                                    src={this.state.profile_image_URL}
                                    className="img-fluid"
                                    width="200px"
                                  />
                                  <h6>
                                    <span>
                                      <img
                                        src={CrossIcon}
                                        className="img-fluid"
                                        style={{
                                          width: "15px",
                                          marginLeft: "10px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          this.setState({
                                            profile_image_URL: "",
                                          })
                                        }
                                      />
                                    </span>
                                  </h6>
                                </div>
                              )}
                            </Col>
                          </div>

                          <br />

                          <div
                            className="HomeBlueButton"
                            style={{ textAlign: "center" }}
                            onClick={() => this.handleSubmit()}
                          >
                            <LangConvertComponent name="save" />
                          </div>
                        </Col>
                      </Row>
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

export default EditStaffProfileComponent;
