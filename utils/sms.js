const fetch = require("node-fetch");
const FormData = require("form-data");
function sms(to, message) {
  var formdata = new FormData();
  formdata.append("from", "KWGH");
  formdata.append("to", to);
  formdata.append("msg", message);
  fetch("https://api.giantsms.com/api/v1/send", {
    method: "POST",
    headers: {
      authorization: "Basic cUtaU0NPdVk6c1R6bUl4UHlxTw==",
    },
    body: formdata,
    redirect: "follow",
  })
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}
module.exports = sms;
