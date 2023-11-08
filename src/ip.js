var satelize = require("satelize");
var fetch = require("node-fetch");
var logger = require("./logger");

const getIpAddress = async () => {
  return await fetch("https://ipecho.io/json")
    .then((res) => res.json())
    .then((data) => {
      logger.debug("Detected IP Address is", data);
      return data.ip;
    });
};

const DetectIsp = async () => {
  const ipAddr = await getIpAddress();
  satelize.satelize({ ip: ipAddr }, function (err, geoData) {
    if (err) {
      logger.error("Unable to detect ISP");
    } else {
      logger.debug("Here is your Detected ISP", geoData);
      return { ip: ipAddr, isp: geoData };
    }
  });
};
module.exports = { DetectIsp };
