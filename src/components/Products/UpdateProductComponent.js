import "date-fns";
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

import DateFnsUtils from "@date-io/date-fns";
import {
  Button,
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@material-ui/core";
import Cookies from "universal-cookie/es6";
import { validateLogin } from "../constants/functions";
import { APIURL } from "../constants/APIURL";
import { toast } from "react-toastify";
import LoadingComponent from "../LoadingComponent";
import { Delete } from "@material-ui/icons";
import LangConvertComponent from "../LangConvertComponent";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

class UpdateProductComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      productId: this.props.match.params.id,
      cookies: new Cookies(),
      userInfo: {},
      isLoading: true,
      notFound: false,
      data: {},

      //Form
      product_image_URL: "",
      product_name: "",
      measurement_unit: "Kilograms",
      gst: 0,
      presence: false,
      buying_price: 0,
      selling_price: 0,
      originated_from: "",
      sku: "",
      pack_size: 0,
      expiry_date: new Date(),
      batch_number: "",
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  deleteProduct = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    fetch(
      "https://proxycorsserversurya.herokuapp.com/https://proxycorsserversurya.herokuapp.com/" +
        APIURL +
        "/user/" +
        this.state.userInfo.ID +
        "/business/" +
        this.state.userInfo.business.ID +
        "/products/" +
        this.state.productId,
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
        toast("Product has been deleted");
        window.location.href = "/inventory";
      })
      .catch((error) => console.log("error", error));
  };
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
    this.updateProduct({
      business_id: this.state.userInfo.business.ID,
      product_image_URL: "",
      product_name: this.state.product_name,
      measurement_unit: this.state.measurement_unit,
      gst: Number(this.state.gst),
      presence: true,
      buying_price: Number(this.state.buying_price),
      selling_price: Number(this.state.selling_price),
      originated_from: this.state.originated_from,
      sku: this.state.sku,
      pack_size: Number(this.state.pack_size),
    });
  };
  updateProduct = (creds) => {
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
        "/products/" +
        this.state.productId,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast.success("Product updated");
      })
      .catch((error) => console.log("error", error));
  };
  getProducts = () => {
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
        var specificProd;
        specificProd = result.data.filter(
          (item) => item.ID == this.state.productId
        )[0];
        this.setState({
          data: specificProd,
          product_image_URL: specificProd.product_image_URL,
          product_name: specificProd.product_name,
          measurement_unit: specificProd.measurement_unit,
          gst: specificProd.gst,
          presence: specificProd.presence,
          buying_price: specificProd.buying_price,
          selling_price: specificProd.selling_price,
          originated_from: specificProd.originated_from,
          sku: specificProd.sku,
          pack_size: specificProd.pack_size,
          expiry_date:
            specificProd.expiry_date !== undefined
              ? specificProd.expiry_date
              : "",
          batch_number:
            specificProd.batch_number !== undefined
              ? specificProd.batch_number
              : "",

          isLoading: false,
        });
        console.log(specificProd);
      })
      .catch((error) => console.log("error", error));
  };
  componentDidMount() {
    validateLogin
      .then((res) => {
        this.setState({
          userInfo: this.state.cookies.get("userInfo"),
        });
        this.getProducts();
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
                    <div
                      style={{
                        textAlign: "right",
                        marginRight: "20px",
                        marginTop: "20px",
                      }}
                      onClick={() => this.deleteProduct()}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<Delete style={{ fontSize: "25px" }} />}
                      >
                        <LangConvertComponent name="delete" />
                      </Button>
                    </div>
                    <div className="ProductsFormDiv">
                      <Container>
                        <h6>Add Product Photo</h6>
                        <Row>
                          <Col
                            sm
                            style={{
                              backgroundColor: "white",
                              padding: "20px",
                            }}
                          >
                            <div>
                              <Row>
                                <Col sm="0">
                                  <div>
                                    <img
                                      src={this.state.product_image_URL}
                                      className="img-fluid"
                                      style={{ width: "120px" }}
                                    />
                                  </div>
                                </Col>
                                <Col sm>
                                  <div>
                                    {this.state.product_image_URL === "" ? (
                                      <div>No Image Added</div>
                                    ) : (
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
                                                product_image_URL: "",
                                              })
                                            }
                                          />
                                        </span>
                                      </h6>
                                    )}
                                  </div>
                                </Col>
                              </Row>
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
                                required
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
                                <h6>Update Product</h6>
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

export default UpdateProductComponent;
