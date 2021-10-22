import { TextField } from "@material-ui/core";
import React, { Component } from "react";
import { Col, Container, Form, Row } from "reactstrap";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

import {
  Avatar,
  Badge,
  Breadcrumbs,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";

import CrossIcon from "../../assets/cross.png";

import UploadIcon from "../../assets/uploadicon.png";

import aws from "aws-sdk";
import { APIURL } from "../constants/APIURL";
import { validateLogin } from "../constants/functions";
import Cookies from "universal-cookie/es6";
import { toast } from "react-toastify";
import BottomBarComponent from "../BottomBarComponent";
import LangConvertComponent from "../LangConvertComponent";
import { Autocomplete } from "@material-ui/lab";

class AddHisabEntryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      userInfo: {},
      customerId: this.props.match.params.id,
      customerName: this.props.match.params.customerName,
      customerMobile: this.props.match.params.customerMobile,
      selectedOption: "to_collect",
      data: {},
      upload_image_url: [],
      //Form
      amount: "",
      item_name: "",
      selectedFiles: [],
      validFiles: [],
      errorMessage: "",
      productsList: [],

      isProductChooseFromList: false,
      confirmDialogOpen:false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = () => {

    this.setState({
      isProductChooseFromList:false
    });
    this.state.productsList.forEach((element) => {
      if(element.product_name == this.state.item_name.trim()) {
        this.setState({
          isProductChooseFromList:true
        });
      }
    })

    if (this.state.selectedOption === "to_collect") {
      this.addHisabEntry({
        entry_type: "to_collect",
        item_name: this.state.item_name,
        paid: 0,
        collected: 0,
        to_collect: Number(this.state.amount),
        to_pay: 0,
        // image_url: [],
        image_url: this.state.upload_image_url,
      });
    }
    if (this.state.selectedOption === "to_pay") {
      this.addHisabEntry({
        entry_type: "to_pay",
        item_name: this.state.item_name,
        paid: 0,
        collected: 0,
        to_collect: 0,
        to_pay: Number(this.state.amount),
        // image_url: [],
        image_url: this.state.upload_image_url,
      });
    }
    if (this.state.selectedOption === "collected") {
      this.addHisabEntry({
        entry_type: "collected",
        item_name: "Amount Collected",
        paid: 0,
        to_collect: 0,
        to_pay: 0,
        // image_url: [],
        image_url: this.state.upload_image_url,
        collected: Number(this.state.amount),
      });
    }
    if (this.state.selectedOption === "paid") {
      this.addHisabEntry({
        entry_type: "paid",
        item_name: "Amount Paid",
        collected: 0,
        to_collect: 0,
        to_pay: 0,
        // image_url: [],
        image_url: this.state.upload_image_url,
        paid: Number(this.state.amount),
      });
    }
  };

  onProductChange = (event, value) => {
    this.setState({
      item_name: value.product_name
    })
  };

  getProductsList = () => {
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
        this.setState({
          productsList: result.data,
          isLoading: false,
        });
      })
      .catch((error) => console.log("error", error));
  };

  addHisabEntry = (creds) => {
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
        "/customer/" +
        this.state.customerId +
        "/hisab-entry",
      requestOptions
    )
      .then((response) => {
        console.log(response.status);
        if (response.status !== 201) {
          throw Error("Error");
        }
        return response.text();
      })
      .then((result) => {
        toast.success("Created successfully");
        if(this.state.isProductChooseFromList) {
          this.setState({
            confirmDialogOpen:true
          });
        } else {
          window.location.href = "/customer/" + this.state.customerId;
        }
      })
      .catch((error) => console.log("error", error));
  };

  getSignUrl = (file) => {
    this.setState({
      upload_image_url: []
    });
    const s3 = new aws.S3({
      endpoint: "https://ayekart-mobile.sfo2.digitaloceanspaces.com",
      accessKeyId: "JZXLSMYTTPFGOUKX46ZW",
      secretAccessKey: "iOU3OJckYIMvOiQSsjImYSP8KjJ1b1GnBh3TNKIQkTo",
    });
    // const url = s3.getSignedUrl("getObject", {
    //   Bucket:
    //     "a4920e07cf09ce0e60dff28729322c22fbbf4bbb4d9663ca8428d0a8b73fe03a",
    //   Key: "Test/sampleimage.jpg",
    //   ResponseContentType: "image/jpg",
    // });

    // s3.putObject(
    //   {
    //     Body: file,
    //     Bucket:
    //       "a4920e07cf09ce0e60dff28729322c22fbbf4bbb4d9663ca8428d0a8b73fe03a",
    //     Key: "Test/sampleimage.jpg",
    //   },
    //   (err, data) => {
    //     if (err) console.log(err);
    //     else console.log(data);
    //   }
    // );

    var config = {
      Body: file,
      Bucket:
        "a4920e07cf09ce0e60dff28729322c22fbbf4bbb4d9663ca8428d0a8b73fe03a",
      // Key: "Test/sampleisssmage.jpg", 
      Key: file.name,
    };

    s3.putObject(config)
      .on("build", (request) => {
        request.httpRequest.headers.Host =
          "https://ayekart-mobile.sfo2.digitaloceanspaces.com";
        request.httpRequest.headers.Host =
          "http://ayekart-mobile.sfo2.digitaloceanspaces.com";
        request.httpRequest.headers["Content-Length"] = file.size;
        request.httpRequest.headers["Content-Type"] = "image/jpg";
        request.httpRequest.headers["x-amz-acl"] = "public-read";
        request.httpRequest.headers["Access-Control-Allow-Origin"] = "*";
      })
      .send((err, data) => {
        if (err) {
          console.log("Failed to upload file", `${err}`);
        } else {
          this.setState({
            upload_image_url: ['https://ayekart-mobile.sfo2.digitaloceanspaces.com/a4920e07cf09ce0e60dff28729322c22fbbf4bbb4d9663ca8428d0a8b73fe03a/'+file.name]
          })
        }
      });
  };

  componentDidMount() {
    validateLogin
      .then((res) => {
        this.setState({
          userInfo: this.state.cookies.get("userInfo"),
        });
        this.getProductsList();
      })
      .catch((err) => {
        window.location.href = "/login";
      });
  }

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
    this.getSignUrl(files[0]);
  };
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }
  handleSelection = (option) => {
    this.setState({
      selectedOption: option,
    });
  };
  
  render() {
    return (
      <React.Fragment>


        <Dialog
          open={this.state.confirmDialogOpen}
          // onClose={this.handleConfirmDialogClose}
        >
          <DialogTitle>
            <h4>Confirm</h4>
          </DialogTitle>
          <DialogContent>
              <p>would you like to create invoice for this entry ?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => window.location.href = "/customer/" + this.state.customerId } autoFocus color="primary">
              No
            </Button>
            <Button onClick={() => window.location.href = "/customercreateinvoice/" + this.state.customerName+'/'+this.state.customerMobile } color="primary">
              Yes
            </Button>
          </DialogActions>
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
                    <div className="HisabEntryTopDiv">
                      <Container>
                        <div className="HisabEntryRoundMain nopadding">
                          <Row>
                            <Col
                              sm
                              xs="6"
                              className="nopaddin HisabEntryRoundItem"
                              id={
                                this.state.selectedOption === "to_collect"
                                  ? "HisabEntryRoundItemSelected"
                                  : ""
                              }
                              onClick={() => this.handleSelection("to_collect")}
                            >
                              <div>
                                <h6>
                                  <LangConvertComponent name="to_collect" />
                                </h6>
                              </div>
                            </Col>
                            <Col
                              sm
                              xs="6"
                              className="nopaddin HisabEntryRoundItem"
                              id={
                                this.state.selectedOption === "to_pay"
                                  ? "HisabEntryRoundItemSelected"
                                  : ""
                              }
                              onClick={() => this.handleSelection("to_pay")}
                            >
                              <div>
                                <h6>
                                  <LangConvertComponent name="to_pay" />
                                </h6>
                              </div>
                            </Col>
                            <Col
                              sm
                              xs="6"
                              className="nopaddin HisabEntryRoundItem"
                              id={
                                this.state.selectedOption === "collected"
                                  ? "HisabEntryRoundItemSelected"
                                  : ""
                              }
                              onClick={() => this.handleSelection("collected")}
                            >
                              <div>
                                <h6>
                                  <LangConvertComponent name="collected" />
                                </h6>
                              </div>
                            </Col>
                            <Col
                              sm
                              xs="6"
                              className="nopaddin HisabEntryRoundItem"
                              id={
                                this.state.selectedOption === "paid"
                                  ? "HisabEntryRoundItemSelected"
                                  : ""
                              }
                              onClick={() => this.handleSelection("paid")}
                            >
                              <div>
                                <h6>
                                  <LangConvertComponent name="paid" />
                                </h6>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Container>
                    </div>

                    <Container>
                      <div className="HisabEntryFormDiv">
                        <Form>
                          <Row>
                            <Col sm>
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
                            </Col>
                            {(this.state.selectedOption === "to_collect" ||
                              this.state.selectedOption === "to_pay") && (
                              <Col sm>
                                  <Autocomplete
                                    clearOnBlur={false}
                                    onChange={(e, v) =>
                                      this.onProductChange(e, v)
                                    }
                                    onInputChange={(e, v) =>
                                      this.onProductChange(e, v)
                                    }
                                    defaultChecked={this.state.selectedProduct}
                                    options={this.state.productsList}
                                    getOptionLabel={(option) =>
                                      option.product_name
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        name="item_name"
                                        value={this.state.item_name}
                                        variant="outlined"
                                        label={
                                          <LangConvertComponent name="type_about_item_details" />
                                        }
                                      />
                                    )}
                                  />
                                {/* <TextField
                                  inputProps={{
                                    style: { backgroundColor: "white" },
                                  }}
                                  variant="filled"
                                  label={
                                    <LangConvertComponent name="type_about_item_details" />
                                  }
                                  fullWidth
                                  name="item_name"
                                  value={this.state.item_name}
                                  onChange={this.handleInputChange}
                                /> */}

                              </Col>
                            )}
                          </Row>
                          <br />

                          {(this.state.selectedOption === "to_collect" ||
                            this.state.selectedOption === "to_pay") && (
                            <Row>
                              <Col sm className="DragPhotoMainDiv">
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
                                  <br />
                                  <p>Drag and drop or browse</p>
                                  <p>
                                    <b>
                                      <LangConvertComponent name="upload_image_files_about_stock" />
                                    </b>
                                  </p>
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
                              </Col>
                            </Row>
                          )}
                        </Form>
                        <Row>
                          <Col sm>
                            <div></div>
                          </Col>
                          <Col sm>
                            <div
                              className="HomeBlueButton"
                              style={{
                                margin: "6px",
                                marginTop: "50px",
                                textAlign: "center",
                              }}
                              onClick={() => this.handleSubmit()}
                            >
                              <h4>
                                <LangConvertComponent name="save" />
                              </h4>
                            </div>
                          </Col>
                          <Col sm>
                            <div></div>
                          </Col>
                        </Row>
                      </div>
                    </Container>
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

export default AddHisabEntryComponent;
