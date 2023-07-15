var CryptoJS = require("crypto-js")
import cookieService from "./cookies"

const authService = {
  saveToken(token) {
    if (token) {
      localStorage.setItem(
        "accessToken",
        CryptoJS.AES.encrypt(
          token,
          navigator.userAgent + cookieService.getCookie("tlasphe")
        ).toString()
      )
      return
    }
  },
  getToken() {
    try {
      let token = localStorage.getItem("accessToken")
      return CryptoJS.AES.decrypt(
        token,
        navigator.userAgent + cookieService.getCookie("tlasphe")
      ).toString(CryptoJS.enc.Utf8)
    } catch (error) {
      return ""
    }
  }
}

export default authService
