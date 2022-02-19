import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router";
import AllCustomerReportComponent from "./Home/AllCustomerReportComponent";
import CustomerDetailsComponent from "./Home/CustomerDetailsComponent";
import CreateInvoiceComponent from "./Finance/CreateInvoiceComponent";
import FinanceComponent from "./Finance/FinanceComponent";
import InvoiceHistoryComponent from "./Finance/InvoiceHistoryComponent";
import RequestMoneyComponent from "./Finance/RequestMoneyComponent";
import HomeComponent from "./Home/HomeComponent";
import LoginComponent from "./PreLogin/LoginComponent";
import OTPComponent from "./PreLogin/OTPComponent";
import SignupComponent from "./PreLogin/SignupComponent";
import ProductsComponent from "./Products/ProductsComponent";
import ProductsEmptyComponent from "./Products/ProductsEmptyComponent";
import SpecificCustomerReportComponent from "./Home/SpecificCustomerReportComponent";
import StockReportComponent from "./Stock/StockReportComponent";
import UpdateProductComponent from "./Products/UpdateProductComponent";
import StockComponent from "./Stock/StockComponent";
import AddProductComponent from "./Products/AddProductComponent";
import AddStockEntryComponent from "./Stock/AddStockEntryComponent";
import StaffComponent from "./Staff/StaffComponent";
import { ToastContainer } from "react-toastify";
import firebaseConfig from "../firebaseConfig";
import firebase from "firebase/app";
import AddHisabEntryComponent from "./Home/AddHisabEntryComponent";
import AddStaffComponent from "./Staff/AddStaffComponent";
import CustomerProfileComponent from "./Home/CustomerProfileComponent";
import StaffReportComponent from "./Staff/StaffReportComponent";
import StaffProfileComponent from "./Staff/StaffProfileComponent";
import ProfileComponent from "./Home/ProfileComponent";
import EditProfileComponent from "./Home/EditProfileComponent";
import UpdateStockComponent from "./Stock/UpdateStockComponent";
import EditStaffProfileComponent from "./Staff/EditStaffProfileComponent";
import BottomBarComponent from "./BottomBarComponent";
import { validateLogin } from "./constants/functions";
import LangConvertComponent from "./LangConvertComponent";
import InventoryComponent from "./Inventory/InventoryComponent";
import CustomerCreateInvoiceComponent from "./Finance/CustomerCreateInvoiceComponent";
import SetPasswordComponent from "./PreLogin/SetPasswordComponent";
import AddBankDetailComponent from "./Finance/AddBankDetailComponent";

class MainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
    };
  }
  componentDidMount() {
    validateLogin
      .then((res) => {
        this.setState({
          isLogin: true,
        });
      })
      .catch((err) => {
        this.setState({
          isLogin: false,
        });
      });
  }
  render() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    } else {
      firebase.app(); // if already initialized, use that one
    }
    return (
      <React.Fragment>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Switch>
          {/* Home */}
          <Route path="/home" component={HomeComponent} />
          <Route
            exact
            path="/customer/:id"
            render={(routerProps) => (
              <CustomerDetailsComponent match={routerProps.match} />
            )}
          />
          <Route
            path="/addhisabentry/:id/:customerName/:customerMobile"
            render={(routerProps) => (
              <AddHisabEntryComponent match={routerProps.match} />
            )}
          />
          <Route
            exact
            path="/customer/report/:id"
            render={(routerProps) => (
              <SpecificCustomerReportComponent match={routerProps.match} />
            )}
          />
          <Route path="/user/report" component={AllCustomerReportComponent} />

          <Route
            path="/profile/customer/:id"
            render={(routerProps) => (
              <CustomerProfileComponent match={routerProps.match} />
            )}
          />

          <Route path="/userprofile" component={ProfileComponent} />
          <Route path="/editprofile" component={EditProfileComponent} />

          {/* Products */}
          <Route path="/productsempty" component={ProductsEmptyComponent} />
          <Route path="/products" component={ProductsComponent} />
          <Route
            path="/updateproduct/:id"
            render={(routerProps) => (
              <UpdateProductComponent match={routerProps.match} />
            )}
          />

          {/* Stocks */}
          <Route path="/stock" component={StockComponent} />
          <Route path="/stockreport" component={StockReportComponent} />
          <Route path="/addstockentry" component={AddStockEntryComponent} />
          <Route
            path="/updatestock/:id"
            render={(routerProps) => (
              <UpdateStockComponent match={routerProps.match} />
            )}
          />

          {/* Staff */}
          <Route path="/staff" component={StaffComponent} />
          <Route path="/addstaff" component={AddStaffComponent} />
          <Route path="/staffreport" component={StaffReportComponent} />
          <Route
            path="/staffprofile/:id"
            render={(routerProps) => (
              <StaffProfileComponent match={routerProps.match} />
            )}
          />

          <Route
            path="/editstaffprofile/:id"
            render={(routerProps) => (
              <EditStaffProfileComponent match={routerProps.match} />
            )}
          />

          <Route path="/finance" component={FinanceComponent} />
          <Route path="/createinvoice" component={CreateInvoiceComponent} />
          <Route
            path="/customercreateinvoice/:name/:mobile"
            render={(routerProps) => (
              <CustomerCreateInvoiceComponent match={routerProps.match} />
            )}
          />
          <Route path="/invoicehistory" component={InvoiceHistoryComponent} />
          <Route path="/requestmoney" component={RequestMoneyComponent} />
          <Route path="/login" component={LoginComponent} />
          <Route path="/loginwithpassword" component={SetPasswordComponent} />
          <Route path="/otpverify" component={OTPComponent} />
          <Route path="/signup" component={SignupComponent} />
          <Route path="/updateproduct" component={UpdateProductComponent} />

          <Route path="/addproduct" component={AddProductComponent} />

          {/* Inventory */}
          <Route path="/inventory" component={InventoryComponent} />
          
          <Route path="/bankdetail" component={AddBankDetailComponent} />

          <Redirect to="/login" />
        </Switch>
        {this.state.isLogin ? <BottomBarComponent /> : <div></div>}
      </React.Fragment>
    );
  }
}

export default MainComponent;
