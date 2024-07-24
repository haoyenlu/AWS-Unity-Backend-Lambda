const registerService = require("./service/register");
const loginService = require("./service/login");
const verifyService = require("./service/verify");
const updateService = require("./service/update");
const scoreService = require("./service/score");
const registerInfoService = require("./service/registerInfo");
const util = require("./utils/util");

const healthPath = "/health";
const registerPath = "/register";
const loginPath = "/login";
const verifyPath = "/verify";
const scorePath = "/score";
const updatePath = "/update";
const registerInfoPath = "/registerInfo";

exports.handler = async (event) => {
  console.log("Request Event : ", event);
  let response;
  switch (true) {

    // Check connection health using "GET" method
    case event.httpMethod === "GET" && event.path === healthPath:
      console.log("healthEvent");
      response = util.buildResponse(200);
      break;
    
    // User registration using "POST" method
    case event.httpMethod === "POST" && event.path === registerPath:
      console.log("registerEvent");
      const registerBody = JSON.parse(event.body);
      response = await registerService.register(registerBody);
      break;
    
    // User Login using "POST" method
    case event.httpMethod === "POST" && event.path === loginPath:
      console.log("loginEvent");
      const loginBody = JSON.parse(event.body);
      response = await loginService.login(loginBody);
      break;
    
    // Verify token using "POST" method
    case event.httpMethod === "POST" && event.path === verifyPath:
      console.log("verifyEvent");
      const verifyBody = JSON.parse(event.body);
      response = verifyService.verify(verifyBody);
      break;
    
    // Update score using "PUT" method
    case event.httpMethod === "PUT" && event.path === updatePath:
      console.log("updateEvent");
      const updateBody = JSON.parse(event.body);
      response = updateService.update(updateBody);
      break;

    // Get score using "POST" method
    case event.httpMethod === "POST" && event.path === scorePath:
      console.log("scoreEvent");
      const scoreBody = JSON.parse(event.body);
      response = scoreService.score(scoreBody);
      break;
    
    // Register user information using "POST" method
    case event.httpMethod === "POST" && event.path === registerInfoPath:
      console.log("registerInfoEvent");
      const infoBody = JSON.parse(event.body);
      response = registerInfoService.registerInfo(infoBody);
      break;
    
    // event not include 
    default:
      console.log("nullEvent");
      response = util.buildResponse(404, "404 Not Found!");
  }
  return response;
};
