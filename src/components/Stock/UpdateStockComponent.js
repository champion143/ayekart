import { TextField } from "@material-ui/core";
import React, { Component } from "react";
import { Col, Container, Form, Row } from "reactstrap";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";

import CrossIcon from "../../assets/cross.png";

import UploadIcon from "../../assets/uploadicon.png";

import aws from "aws-sdk";
import { APIURL } from "../constants/APIURL";
import { validateLogin } from "../constants/functions";
import Cookies from "universal-cookie/es6";
import { toast } from "react-toastify";
import LoadingComponent from "../LoadingComponent";
import LangConvertComponent from "../LangConvertComponent";

class UpdateStockComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stockId: this.props.match.params.id,
      cookies: new Cookies(),
      userInfo: {},
      customerId: this.props.match.params.id,
      selectedOption: "purchase",
      data: {},
      stockItem: {},
      isLoading: true,

      //Form
      amount: "",
      qty: "",
      item_name: "",
      selectedFiles: [],
      validFiles: [],
      errorMessage: "",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  getStock = (key = "purchase") => {
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
        var stockItem = {};
        stockItem = result.data.filter(
          (item) => item.ID == this.state.stockId
        )[0];
        var amount = 0;
        var qty = 0;
        if (key === "purchase") {
          this.setState({
            isLoading: false,
            data: stockItem,
            amount: stockItem.purchased_value,
            qty: stockItem.item_purchased,
          });
        }
        if (key === "sold") {
          this.setState({
            isLoading: false,
            data: stockItem,
            amount: stockItem.sold_value,
            qty: stockItem.item_sold,
          });
        }
        if (key === "damaged") {
          this.setState({
            isLoading: false,
            data: stockItem,
            amount: stockItem.damaged_value,
            qty: stockItem.item_damaged,
          });
        }
        if (key === "returned") {
          this.setState({
            isLoading: false,
            data: stockItem,
            amount: stockItem.returned_value,
            qty: stockItem.item_returned,
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  handleSubmit = () => {
    if (this.state.selectedOption === "purchase") {
      this.updateStock({
        entry_type: this.state.selectedOption,
        item_name: this.state.data.item_name,
        stock_value: this.state.data.stock_value,
        item_purchased: Number(this.state.qty),
        item_sold: this.state.data.item_sold,
        item_damaged: this.state.data.item_damaged,
        item_returned: this.state.data.item_returned,
        item_available_units: this.state.data.item_available_units,
        //
        purchased_value: Number(this.state.amount),
        sold_value: this.state.data.sold_value,
        returned_value: this.state.data.returned_value,
        damaged_value: this.state.data.damaged_value,
        image_URL: [],
      });
    }

    if (this.state.selectedOption === "sold") {
      this.updateStock({
        entry_type: this.state.selectedOption,
        item_name: this.state.data.item_name,
        stock_value: this.state.data.stock_value,
        item_purchased: this.state.data.item_purchased,
        item_sold: Number(this.state.qty),
        item_damaged: this.state.data.item_damaged,
        item_returned: this.state.data.item_returned,
        item_available_units: this.state.data.item_available_units,
        //
        purchased_value: this.state.data.purchased_value,
        sold_value: Number(this.state.amount),
        returned_value: this.state.data.returned_value,
        damaged_value: this.state.data.damaged_value,
        image_URL: [],
      });
    }

    if (this.state.selectedOption === "damaged") {
      this.updateStock({
        entry_type: this.state.selectedOption,
        item_name: this.state.data.item_name,
        stock_value: this.state.data.stock_value,
        item_purchased: this.state.data.item_purchased,
        item_sold: this.state.data.item_sold,
        item_damaged: Number(this.state.qty),
        item_returned: this.state.data.item_returned,
        item_available_units: this.state.data.item_available_units,
        //
        purchased_value: this.state.data.purchased_value,
        sold_value: this.state.data.sold_value,
        returned_value: this.state.data.returned_value,
        damaged_value: Number(this.state.amount),
        image_URL: [],
      });
    }

    if (this.state.selectedOption === "returned") {
      this.updateStock({
        entry_type: this.state.selectedOption,
        item_name: this.state.data.item_name,
        stock_value: this.state.data.stock_value,
        item_purchased: this.state.data.item_purchased,
        item_sold: this.state.data.item_sold,
        item_damaged: this.state.data.item_damaged,
        item_returned: Number(this.state.qty),
        item_available_units: this.state.data.item_available_units,
        //
        purchased_value: this.state.data.purchased_value,
        sold_value: this.state.data.sold_value,
        returned_value: Number(this.state.amount),
        damaged_value: this.state.data.damaged_value,
        image_URL: [],
      });
    }
  };

  updateStock = (creds) => {
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
        " /stock/" +
        this.state.stockId,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast.success("Stock Updated");
        window.location.href = "/inventory";
      })
      .catch((error) => {
        console.log("error", error);
        toast.success("Stock Updated");
        window.location.href = "/inventory";
      });
  };

  getSignUrl = (file) => {
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
      Key: "sampleimage.jpg",
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
          console.log(data);
        }
      });
  };

  componentDidMount() {
    validateLogin
      .then((res) => {
        this.setState({
          userInfo: this.state.cookies.get("userInfo"),
        });
        this.getStock();
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
      isLoading: true,
      selectedOption: option,
    });
    this.getStock(option);
  };
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
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-0 nopadding">
              <SidebarComponent activePage="Stock" />
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
                              className="nopaddin HisabEntryRoundItem"
                              id={
                                this.state.selectedOption === "purchase"
                                  ? "HisabEntryRoundItemSelected"
                                  : ""
                              }
                              onClick={() => this.handleSelection("purchase")}
                            >
                              <div>
                                <h6>
                                  <LangConvertComponent name="purchase" />
                                </h6>
                              </div>
                            </Col>
                            <Col
                              sm
                              className="nopaddin HisabEntryRoundItem"
                              id={
                                this.state.selectedOption === "sold"
                                  ? "HisabEntryRoundItemSelected"
                                  : ""
                              }
                              onClick={() => this.handleSelection("sold")}
                            >
                              <div>
                                <h6>
                                  <LangConvertComponent name="sold" />
                                </h6>
                              </div>
                            </Col>
                            <Col
                              sm
                              className="nopaddin HisabEntryRoundItem"
                              id={
                                this.state.selectedOption === "damaged"
                                  ? "HisabEntryRoundItemSelected"
                                  : ""
                              }
                              onClick={() => this.handleSelection("damaged")}
                            >
                              <div>
                                <h6>
                                  <LangConvertComponent name="damaged" />
                                </h6>
                              </div>
                            </Col>
                            <Col
                              sm
                              className="nopaddin HisabEntryRoundItem"
                              id={
                                this.state.selectedOption === "returned"
                                  ? "HisabEntryRoundItemSelected"
                                  : ""
                              }
                              onClick={() => this.handleSelection("returned")}
                            >
                              <div>
                                <h6>
                                  <LangConvertComponent name="returned" />
                                </h6>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Container>
                    </div>

                    <Container>
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
                                <LangConvertComponent name="upload_image_files_about_items_bills_etc" />
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
                    </Container>

                    <br />

                    <Container>
                      <Row>
                        <Col sm>
                          <div>
                            <TextField
                              inputProps={{
                                style: { backgroundColor: "white" },
                              }}
                              label={
                                <LangConvertComponent name="type_about_item_details" />
                              }
                              variant="filled"
                              fullWidth
                              name="amount"
                              value={this.state.data.item_name}
                              disabled
                            />
                          </div>
                        </Col>
                        <Col sm>
                          <div>
                            <TextField
                              inputProps={{
                                style: { backgroundColor: "white" },
                              }}
                              variant="filled"
                              label={
                                <LangConvertComponent name="enter_stock_quantitiy" />
                              }
                              fullWidth
                              name="qty"
                              value={this.state.qty}
                              onChange={this.handleInputChange}
                            />
                          </div>
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col sm>
                          <div>
                            <TextField
                              inputProps={{
                                style: { backgroundColor: "white" },
                              }}
                              variant="filled"
                              label={
                                <LangConvertComponent name="enter_stock_amount" />
                              }
                              fullWidth
                              name="amount"
                              value={this.state.amount}
                              onChange={this.handleInputChange}
                            />
                          </div>
                        </Col>
                        <Col sm>
                          <div></div>
                        </Col>
                      </Row>
                    </Container>

                    <Container>
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

export default UpdateStockComponent;
