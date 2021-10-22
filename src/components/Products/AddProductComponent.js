import "date-fns";
import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";
import aws from "aws-sdk";

import RightArrowImg from "../../assets/RightArrow.png";

import SearchIcon from "../../assets/SearchIcon.png";
import FilterIcon from "../../assets/FilterIcon.png";
import AddIcon from "../../assets/AddIcon.png";

import HeaderDp from "../../assets/headerdp.png";

import CallIcon from "../../assets/CallIcon.png";

import RemindIcon from "../../assets/RemindIcon.png";
import PaynowIcon from "../../assets/PaynowIcon.png";
import CollectnowIcon from "../../assets/CollectnowIcon.png";

import ProdImage from "../../assets/ProdImage.png";

import CrossIcon from "../../assets/cross.png";

import UploadIcon from "../../assets/uploadicon.png";
import DateFnsUtils from "@date-io/date-fns";
import {
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@material-ui/core";
import { validateLogin } from "../constants/functions";
import Cookies from "universal-cookie/es6";
import { toast } from "react-toastify";

import { APIURL } from "../constants/APIURL";
import LangConvertComponent from "../LangConvertComponent";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

class AddProductComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      cookies: new Cookies(),
      selectedFiles: [],
      validFiles: [],
      errorMessage: "",

      //
      product_image_URL: "",
      product_name: "",
      measurement_unit: "Kilograms",
      gst: "",
      presence: false,
      buying_price: "",
      selling_price: "",
      originated_from: "",
      sku: "",
      pack_size: "",
      expiry_date: new Date(),
      batch_number: "",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleProductPresence = () => {
    this.setState({
      presence: !this.state.presence,
    });
  };
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
    console.log(name + ":" + value);
  }
  handleSubmit = () => {
    if (
      this.state.product_name === "" ||
      this.state.gst === "" ||
      this.state.buying_price === "" ||
      this.state.selling_price === ""
    ) {
      toast.error("Please fill all the required fields");
    } else {
      this.addProduct({
        business_id: this.state.userInfo.business.ID,
        // product_image_URL: "",
        product_image_URL: this.state.product_image_URL,
        product_name: this.state.product_name,
        measurement_unit: this.state.measurement_unit,
        gst: Number(this.state.gst),
        presence: true,
        buying_price: Number(this.state.buying_price),
        selling_price: Number(this.state.selling_price),
        originated_from: this.state.originated_from,
        sku: this.state.sku,
        pack_size: Number(this.state.pack_size),
        expiry_date: this.state.expiry_date,
        batch_number: this.state.batch_number,
      });
    }
  };
  addProduct = (creds) => {
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
        "/product",
      requestOptions
    )
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          throw Error("Something error");
        }
      })
      .then((result) => {
        console.log(result);
        toast.success("Product added");
        window.location.href = "/inventory";
      })
      .catch((error) => console.log("error", error));
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
    this.getSignUrl(files[0]);
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
    var config = {
      Body: file,
      Bucket:
        "a4920e07cf09ce0e60dff28729322c22fbbf4bbb4d9663ca8428d0a8b73fe03a",
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
            product_image_URL: 'https://ayekart-mobile.sfo2.digitaloceanspaces.com/a4920e07cf09ce0e60dff28729322c22fbbf4bbb4d9663ca8428d0a8b73fe03a/'+file.name
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
      })
      .catch((err) => (window.location.href = "/login"));
  }
  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-0 nopadding">
              <SidebarComponent activePage="Products" />
            </div>

            <div className="col-sm-12 nopadding">
              <div className="PageContentMainDiv">
                <div className="PageContentContentDiv">
                  <HeaderComponent />
                  <div className="HomeMainDiv">
                    <div className="ProductsFormDiv">
                      <Container>
                        <h6>Add Product Photo</h6>
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
                              <p>Drag and drop or browse</p>
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

                          <Col sm>
                            <div>
                              <TextField
                                inputProps={{
                                  style: { backgroundColor: "white" },
                                }}
                                required
                                variant="filled"
                                label={
                                  <LangConvertComponent name="product_name" />
                                }
                                fullWidth
                                name="product_name"
                                value={this.state.product_name}
                                onChange={this.handleInputChange}
                              />
                              <br />
                              <br />

                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                fullWidth
                                inputProps={{
                                  style: { backgroundColor: "white" },
                                }}
                                defaultValue={this.state.measurement_unit}
                                name="measurement_unit"
                                value={this.state.measurement_unit}
                                onChange={this.handleInputChange}
                              >
                                <MenuItem value="Gram" selected>
                                  Gram
                                </MenuItem>
                                <MenuItem value="Kilogram">Kilogram</MenuItem>
                                <MenuItem value="Millilitre">
                                  Millilitre
                                </MenuItem>
                                <MenuItem value="Litre">Litre</MenuItem>
                                <MenuItem value="Dozen">Dozen</MenuItem>
                                <MenuItem value="Pieces">Pieces</MenuItem>
                              </Select>
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
                                required
                                variant="filled"
                                label={<LangConvertComponent name="gst_in" />}
                                fullWidth
                                name="gst"
                                value={this.state.gst}
                                onChange={this.handleInputChange}
                              />
                            </div>
                          </Col>
                          <Col
                            sm
                            style={{
                              backgroundColor: "white",
                              textAlign: "center",
                            }}
                          >
                            <div>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={this.state.presence}
                                    onChange={this.handleProductPresence}
                                    name="checkedB"
                                    color="primary"
                                  />
                                }
                                label="Presence"
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
                                label="Pack Size"
                                fullWidth
                                name="pack_size"
                                value={this.state.pack_size}
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
                                label="Storage Keeping Unit (SKU)"
                                fullWidth
                                name="sku"
                                value={this.state.sku}
                                onChange={this.handleInputChange}
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
                                label="Originated from"
                                fullWidth
                                name="originated_from"
                                value={this.state.originated_from}
                                onChange={this.handleInputChange}
                              />
                            </div>
                          </Col>
                          <Col sm>
                            <div>
                              <TextField
                                inputProps={{
                                  style: { backgroundColor: "white" },
                                }}
                                required
                                variant="filled"
                                label={
                                  <LangConvertComponent name="selling_price" />
                                }
                                fullWidth
                                name="selling_price"
                                value={this.state.selling_price}
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
                                required
                                variant="filled"
                                label={
                                  <LangConvertComponent name="buying_price" />
                                }
                                fullWidth
                                name="buying_price"
                                value={this.state.buying_price}
                                onChange={this.handleInputChange}
                              />
                            </div>
                          </Col>
                          <Col sm>
                            <div>
                              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                  // margin="normal"
                                  id="date-picker-dialog"
                                  label="Expiry Date"
                                  format="MM/dd/yyyy"
                                  value={this.state.expiry_date}
                                  onChange={(date) => {
                                    console.log(new Date(date).toISOString());
                                    this.setState({
                                      expiry_date: new Date(date).toISOString(),
                                    });
                                  }}
                                  KeyboardButtonProps={{
                                    "aria-label": "change date",
                                  }}
                                />
                              </MuiPickersUtilsProvider>
                            </div>
                          </Col>
                          <Col sm>
                            <div>
                              <TextField
                                inputProps={{
                                  style: { backgroundColor: "white" },
                                }}
                                variant="filled"
                                label={"Batch Number"}
                                fullWidth
                                name="batch_number"
                                value={this.state.batch_number}
                                onChange={this.handleInputChange}
                              />
                            </div>
                          </Col>
                        </Row>
                        <br />
                        <Row>
                          <Col sm>
                            <div></div>
                          </Col>
                          <Col sm>
                            <div>
                              <div
                                className="HomeBlueButton d-flex justify-content-center"
                                style={{
                                  margin: "6px",
                                  marginTop: "30px",
                                  textAlign: "center",
                                }}
                                onClick={() => this.handleSubmit()}
                              >
                                <h6>
                                  <LangConvertComponent name="add_product" />
                                </h6>
                              </div>
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
        </div>
      </React.Fragment>
    );
  }
}

export default AddProductComponent;
