import { Tab, Tabs } from "@material-ui/core";
import React, { Component } from "react";
import { Container } from "reactstrap";
import HeaderComponent from "../HeaderComponent";
import ProductsComponent from "./../Products/ProductsComponent";
import StockComponent from "./../Stock/StockComponent";

class InventoryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
    };
  }
  handleTabs = (event, newValue) => {
    this.setState({
      selectedTab: newValue,
    });
  };
  render() {
    return (
      <React.Fragment>
        <HeaderComponent />
        <div style={{ marginTop: "10px" }}>
          <Tabs
            value={this.state.selectedTab}
            onChange={this.handleTabs}
            TabIndicatorProps={{
              style: {
                backgroundColor: "#0A246D",
              },
            }}
            style={{ color: "#0A246D" }}
            centered
          >
            <Tab label="Products" />
            <Tab label="Stock" />
          </Tabs>

          <div>
            {this.state.selectedTab === 0 && (
              <div style={{ marginTop: "20px" }}>
                <ProductsComponent />
              </div>
            )}
            {this.state.selectedTab === 1 && (
              <div style={{ marginTop: "20px" }}>
                <StockComponent />
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default InventoryComponent;
