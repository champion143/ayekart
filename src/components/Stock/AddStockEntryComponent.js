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

import ProdImage from "../../assets/ProdImage.png";

import CrossIcon from "../../assets/cross.png";

import UploadIcon from "../../assets/uploadicon.png";
import {
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { validateLogin } from "../constants/functions";
import Cookies from "universal-cookie/es6";
import { APIURL } from "../constants/APIURL";
import { toast } from "react-toastify";
import LangConvertComponent from "../LangConvertComponent";

class AddStockEntryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      userInfo: {},
      selectedFiles: [],
      validFiles: [],
      errorMessage: "",

      productsList: [],
      isLoading: true,

      //Forms
      item_name: "",
      stock_value: "",
      item_purchased: "",
      inputValue: "",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  onProductChange = (event, value) => {
    this.setState({
      selectedProduct: value,
    });
    console.log(value);
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
    this.createEntry({
      business_id: Number(this.state.userInfo.business.ID),
      entry_type: "purchased",
      item_name: this.state.selectedProduct.product_name,
      item_purchased: Number(this.state.stock_value),
      purchased_value: Number(this.state.item_purchased),
      item_sold: 0,
      item_damaged: 0,
      item_returned: 0,
      item_available_units: 0,
      image_URL: [],
    });
  };
  createEntry = (creds) => {
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
        "/stock",
      requestOptions
    )
      .then((response) => {
        if (response.status !== 201) {
          throw Error("Error");
        }
        return response.json();
      })
      .then((result) => {
        toast.success("Entry created");
        window.location.href = "/stock";
      })
      .catch((error) => {
        console.log("error", error);
        toast.error("Something error");
      });
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
          selectedProduct: result.data[0],
        });
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
  render() {
    console.log("File name: " + this.state.selectedFiles);
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
                    <div className="ProductsFormDiv">
                      <Container>
                        <div
                          className="DragPhotoMainDiv"
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
                                      onClick={() => this.removeFile(data.name)}
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

                        <br />
                        <br />

                        <Row>
                          <Col sm style={{ marginBottom: "10px" }}>
                            {/* <div>
                              <TextField
                                inputProps={{
                                  style: { backgroundColor: "white" },
                                }}
                                variant="filled"
                                label="Type or speak about item details"
                                fullWidth
                              />
                            </div> */}
                            <div>
                              {/* <Autocomplete
                                value={this.state.item_name}
                                onChange={(event, newValue) => {
                                  this.setState({
                                    item_name: newValue.product_name,
                                  });
                                }}
                                inputValue={this.state.inputValue}
                                onInputChange={(event, newInputValue) => {
                                  this.setState({
                                    inputValue: newInputValue,
                                  });
                                  console.log(newInputValue);
                                }}
                                options={this.state.productsList}
                                getOptionLabel={(option) => option.product_name}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Enter Product name"
                                    value={this.state.inputValue}
                                  />
                                )}
                              /> */}
                              <Autocomplete
                                onChange={this.onProductChange}
                                defaultChecked={this.state.selectedProduct}
                                options={this.state.productsList}
                                getOptionLabel={(option) => option.product_name}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    variant="outlined"
                                    label={
                                      <LangConvertComponent name="product_name" />
                                    }
                                  />
                                )}
                              />
                            </div>
                          </Col>
                          <Col sm style={{ marginBottom: "10px" }}>
                            <div>
                              <TextField
                                value={this.state.stock_value}
                                onChange={this.handleInputChange}
                                name="stock_value"
                                inputProps={{
                                  style: { backgroundColor: "white" },
                                }}
                                variant="filled"
                                label={
                                  <LangConvertComponent name="enter_purchased_quantitiy" />
                                }
                                fullWidth
                              />
                            </div>
                          </Col>
                        </Row>
                        <br />
                        <br />
                        <Row>
                          <Col sm style={{ marginBottom: "10px" }}>
                            <div>
                              <TextField
                                value={this.state.item_purchased}
                                onChange={this.handleInputChange}
                                name="item_purchased"
                                inputProps={{
                                  style: { backgroundColor: "white" },
                                }}
                                variant="filled"
                                label={
                                  <LangConvertComponent name="enter_purchased_amount" />
                                }
                                fullWidth
                              />
                            </div>
                          </Col>
                          <Col sm>
                            <div></div>
                          </Col>
                        </Row>

                        <br />
                        <Row>
                          <Col sm>
                            <div></div>
                          </Col>
                          <Col sm>
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
                                <LangConvertComponent name="save" />
                              </h6>
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

export default AddStockEntryComponent;
