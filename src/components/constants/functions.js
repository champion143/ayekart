import Cookies from "universal-cookie/es6";

import firebase from "firebase";
import firebaseConfig from "../../firebaseConfig";
import { toast } from "react-toastify";

export const logOutUser = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      new Cookies().remove("userInfo");
      window.location.href = "/login";
    })
    .catch((error) => {
      // An error happened.
      toast.error("Something Error");
    });
};

export const validateLogin = new Promise((resolve, reject) => {
  var userInfo = new Cookies().get("userInfo");
  if (userInfo === undefined) {
    reject("Error");
  } else {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    } else {
      firebase.app(); // if already initialized, use that one
    }
    resolve("Success");
    // firebase.auth().onAuthStateChanged(function (user) {
    //   if (user) {
    //     // User is signed in.
    //     var fireBasePhoneNumber = user.phoneNumber;
    //     console.log(typeof fireBasePhoneNumber);

    //     var cookiePhoneNumber = "+91" + userInfo.mobile;
    //     console.log(typeof cookiePhoneNumber);
    //     if (fireBasePhoneNumber === cookiePhoneNumber) {
    //       resolve("Success");
    //     } else {
    //       reject("Error");
    //     }
    //   } else {
    //     // No user is signed in.

    //     reject("Error");
    //   }
    // });
  }
});
