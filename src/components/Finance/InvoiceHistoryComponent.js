import React, { Component } from "react";

import SearchIcon from "../../assets/SearchIcon.png";
import FilterIcon from "../../assets/FilterIcon.png";
import AddIcon from "../../assets/AddIcon.png";
import HistoryIcon from "../../assets/history.png";
import HeaderComponent from "../HeaderComponent";
import SidebarComponent from "../SidebarComponent";
import PDFIcon from "../../assets/PDFIcon.png";
import { Col, Container, Row } from "reactstrap";
import Cookies from "universal-cookie/es6";
import { validateLogin } from "../constants/functions";
import { APIURL } from "../constants/APIURL";
import LoadingComponent from "../LoadingComponent";

import { alpha } from '@material-ui/core/styles';

import moment from "moment";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";

class InvoiceHistoryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      userInfo: {},
      data: {},

      isLoading: true,
    };
  }
  generatePDF = (InvoiceID) => {
    toast("Generating PDF");
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
        "/invoices",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        var data = result.data.filter((item) => item.ID === InvoiceID)[0];
        console.log(data);
        const doc = new jsPDF();
        const tableColums = [
          "Index",
          "Item",
          "Description",
          "Unit Price",
          "Qty",

          "Amount",
        ];
        const tableRows = [];
        const itemData = [
          1,
          data.invoice_items[0].product_service_name,
          data.invoice_items[0].description,
          data.invoice_items[0].quantity,

          data.total_amount,
        ];
        tableRows.push(itemData);
        doc.autoTable(tableColums, tableRows, { startY: 20 });
        doc.text("Invoice", 40, 250, "center");
        doc.save(`Invoice_${data.ID}`);
      })
      .catch((error) => console.log("error", error));
  };
  getInvoices = () => {
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
        "/invoices",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        this.setState({
          isLoading: false,
          data: result.data,
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
        this.getInvoices();
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
              <SidebarComponent activePage="Home" />
            </div>

            <div className="col-sm-12 nopadding">
              <div className="PageContentMainDiv">
                <div className="PageContentContentDiv">
                  <HeaderComponent />

                  <div className="HomeMainDiv">
                    {/* <p style={{ textAlign: "right", marginRight: "10px" }}>
                      {moment(new Date()).format("Do MMM YYYY")}
                    </p> */}

                    <div className="InvoiceHistorySecondDiv">
                      <Container fluid>
                        <Row>
                          {this.state.data.map((item, index) => (
                            <Col sm="5" className="HomeThirdDivItemDiv">
                              <div>
                                <h6>
                                  <img
                                    src={PDFIcon}
                                    className="img-fluid"
                                    style={{ width: "40px" }}
                                  />
                                  {`Invoice_${item.ID}`}
                                </h6>
                                <p>
                                  Date:{" "}
                                  {moment(item.CreatedAt).format("Do MMM YYYY")}
                                </p>
                                <p>Customer name: {item.customer_name}</p>
                                <div
                                  className="HomeBlueButtonSmall"
                                  style={{ float: "right", margin: "6px" }}
                                  onClick={() => window.open(item.image_url)}
                                >
                                    <h6>View Detail</h6>
                                </div>
                                <div
                                  className="HomeBlueButtonSmall"
                                  style={{ float: "right", margin: "6px" }}
                                  onClick={() => this.generatePDF(item.ID)}
                                >
                                  <h6>Download</h6>
                                </div>
                              </div>
                            </Col>
                          ))}
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

export default InvoiceHistoryComponent;
