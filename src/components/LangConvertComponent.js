import { get, set } from "idb-keyval";
import React, { Component } from "react";

import { as } from "./constants/lang/as";
import { bn } from "./constants/lang/bn";
import { en } from "./constants/lang/en";
import { gu } from "./constants/lang/gu";
import { hi } from "./constants/lang/hi";
import { kn } from "./constants/lang/kn";
import { ml } from "./constants/lang/ml";
import { mr } from "./constants/lang/mr";
import { or } from "./constants/lang/or";
import { ta } from "./constants/lang/ta";
import { tel } from "./constants/lang/tel";

class LangConvertComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      text: "",

      lang: {
        as: as,
        bn: bn,
        en: en,
        gu: gu,
        hi: hi,
        kn: kn,
        ml: ml,
        mr: mr,
        or: or,
        ta: ta,
        tel: tel,
      },
    };
  }
  componentDidMount() {
    get("lang").then((val) => {
      if (val === undefined) {
        set("lang", "en");
        val = "en";
      }
      var lang = this.state.lang[val];
      var text = lang.filter((item) => item._name == this.state.name)[0];
      if (text !== undefined)
        this.setState({
          text: text.__text,
        });
    });
  }
  render() {
    return <span>{this.state.text}</span>;
  }
}

export default LangConvertComponent;
