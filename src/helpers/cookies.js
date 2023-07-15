const cookieService = {
  setCookie(cname, cvalue, expireDays = 10) {
    const d = new Date()
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000)
    let expires = "expires=" + d.toUTCString()
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
  },
  removeCookie(cname) {
    document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:00 UT; path=/;"
  },
  getCookie(cname) {
    let name = cname + "="
    let decodedCookie = decodeURIComponent(document.cookie)
    let ca = decodedCookie.split(";")
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) == " ") {
        c = c.substring(1)
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ""
  },
  createTlaspheCookie() {
    cookieService.setCookie(
      "tlasphe",
      String(Date.now().toString(32) + Math.random().toString(16)).replace(
        /\./g,
        ""
      )
    )
  }
}

export default cookieService
