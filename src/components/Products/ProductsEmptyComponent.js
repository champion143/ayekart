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
import ReportsIcon from "../../assets/ReportsIcon.png";

import ProdImage from "../../assets/ProdImage.png";

import ProductOne from "../../assets/Product1.png";
import ProductTwo from "../../assets/Product2.png";
import ProductThree from "../../assets/Product3.png";
import ProductFour from "../../assets/Product4.png";
import ProductFive from "../../assets/Product5.png";
import ProductSix from "../../assets/Product6.png";
import { validateLogin } from "../constants/functions";
import Cookies from "universal-cookie/es6";
import { Link } from "react-router-dom";

class ProductsEmptyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: new Cookies(),
      userInfo: {},
    };
  }
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
                  {/* <HeaderComponent /> */}

                  <Link to="/addproduct" id="NoHoverLink">
                    <div className="ProductsMainDiv">
                      <Container>
                        <div className="ProductsTopDiv">
                          <h4>
                            Add your <span id="BlueColorText">products</span>{" "}
                            here
                          </h4>
                        </div>

                        <Row>
                          <Col sm xs>
                            <div className="ProductItemDiv">
                              <img src={ProductOne} className="img-fluid" />
                            </div>
                          </Col>
                          <Col sm xs>
                            <div className="ProductItemDiv">
                              <img src={ProductTwo} className="img-fluid" />
                            </div>
                          </Col>
                          <Col sm xs>
                            <div className="ProductItemDiv">
                              <img src={ProductThree} className="img-fluid" />
                            </div>
                          </Col>
                        </Row>

                        <Row>
                          <Col sm xs>
                            <div className="ProductItemDiv">
                              <img src={ProductFour} className="img-fluid" />
                            </div>
                          </Col>
                          <Col sm xs>
                            <div className="ProductItemDiv">
                              <img src={ProductFive} className="img-fluid" />
                            </div>
                          </Col>
                          <Col sm xs>
                            <div className="ProductItemDiv">
                              <img src={ProductSix} className="img-fluid" />
                            </div>
                          </Col>
                        </Row>
                      </Container>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ProductsEmptyComponent;
