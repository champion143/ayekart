import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import { Favorite, HomeOutlined } from "@material-ui/icons";
import React, { Component } from "react";

import HomeIcon from "../assets/HomeIcon.png";
import FinanceIcon from "../assets/FinanceIcon.png";
import ProductsIcon from "../assets/ProductsIcon.png";
import StockIcon from "../assets/StockIcon.png";
import StaffIcon from "../assets/StaffIcon.png";
import { Link } from "react-router-dom";
import LangConvertComponent from "./LangConvertComponent";

class BottomBarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }
  handleChange = (event, newValue) => {
    this.setState({
      value: newValue,
    });
  };
  render() {
    return (
      <React.Fragment>
        <div className="d-block d-sm-none">
          <BottomNavigation
            value={this.state.value}
            onChange={(event, newValue) => this.handleChange(event, newValue)}
            showLabels
            style={{
              width: "100%",
              position: "fixed",
              bottom: 0,
              "&$selected": {
                color: "#FF6F00 !important",
                backgroundColor: "#FF6F00 !important",
              },
              selected: {},
            }}
          >
            <BottomNavigationAction
              label={<LangConvertComponent name="title_home" />}
              icon={<img src={HomeIcon} style={{ width: "20px" }} />}
              component={Link}
              to="/home"
              id="NoHoverLink"
            />

            <BottomNavigationAction
              label={<LangConvertComponent name="title_finance" />}
              icon={<img src={FinanceIcon} style={{ width: "20px" }} />}
              component={Link}
              to="/finance"
              id="NoHoverLink"
            />
            <BottomNavigationAction
              label={<LangConvertComponent name="title_products" />}
              icon={<img src={ProductsIcon} style={{ width: "20px" }} />}
              component={Link}
              to="/inventory"
              id="NoHoverLink"
            />
            {/* <BottomNavigationAction
              label={<LangConvertComponent name="title_stock" />}
              icon={<img src={StockIcon} style={{ width: "20px" }} />}
              component={Link}
              to="/stock"
              id="NoHoverLink"
            /> */}
            <BottomNavigationAction
              label={<LangConvertComponent name="title_staff" />}
              icon={<img src={StaffIcon} style={{ width: "20px" }} />}
              component={Link}
              to="/staff"
              id="NoHoverLink"
            />
          </BottomNavigation>
        </div>
      </React.Fragment>
    );
  }
}

export default BottomBarComponent;
