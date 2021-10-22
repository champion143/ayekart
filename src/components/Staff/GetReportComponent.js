import { Divider } from "@material-ui/core";
import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import Cookies from "universal-cookie/es6";
import { APIURL } from "../constants/APIURL";
import LangConvertComponent from "../LangConvertComponent";

class GetReportComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      staffId: this.props.staffId,
      present: 0,
      absent: 0,
      halfDay: 0,
    };
  }
  getStaffAttendance = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      APIURL +
        "/user/" +
        new Cookies().get("userInfo").ID +
        "/business/" +
        new Cookies().get("userInfo").business.ID +
        "/staff/" +
        this.state.staffId +
        "/attendance",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        var present = 0;
        var absent = 0;
        var halfDay = 0;
        if (result.data.length <= 0) {
          this.setState({
            present: 0,
            absent: 0,
            halfDay: 0,
          });
        } else {
          result.data.forEach((item) => {
            if (item.present === true) {
              present += 1;
            }
            if (item.absent === true) {
              absent += 1;
            }
            if (item.half_Day === true) {
              halfDay += 1;
            }
          });
          this.setState({
            present: present,
            absent: absent,
            halfDay: halfDay,
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  componentDidMount() {
    this.getStaffAttendance();
  }
  render() {
    return (
      <React.Fragment>
        <Row>
          <Col sm xs>
            <div style={{ textAlign: "center" }}>
              <p>
                <LangConvertComponent name="present" />
              </p>
              <h6 style={{ color: "rgba(13, 50, 147, 0.9)" }}>
                {this.state.present} Day(s)
              </h6>
            </div>
          </Col>
          <Divider orientation="horizontal" />
          <Col sm xs>
            <div style={{ textAlign: "center" }}>
              <p>
                <LangConvertComponent name="absent" />
              </p>
              <h6 style={{ color: "rgba(147, 13, 45, 0.9)" }}>
                {this.state.absent} Day(s)
              </h6>
            </div>
          </Col>
          <Divider orientation="horizontal" />
          <Col sm xs>
            <div style={{ textAlign: "center" }}>
              <p>
                <LangConvertComponent name="half_day" />
              </p>
              <h6 style={{ color: "rgba(0, 0, 0, 0.9)" }}>
                {this.state.halfDay} Day(s)
              </h6>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default GetReportComponent;
