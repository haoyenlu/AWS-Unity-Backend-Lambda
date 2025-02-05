const AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-2",
});
const util = require("../utils/util");
const bcrypt = require("bcryptjs");
const auth = require("../utils/auth");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = "Choo-Choo-Zoo-User";

async function login(user) {
  const username = user.username;
  const password = user.password;
  if (!user || !username || !password) {
    return util.buildResponse(401, {
      message: "username and password are required!",
    });
  }
  const dynamoUser = await getUser(username);
  if (!dynamoUser || !dynamoUser.username) {
    return util.buildResponse(403, {
      message: "user does not exist",
    });
  }
  if (!bcrypt.compareSync(password, dynamoUser.password)) {
    return util.buildResponse(403, {
      message: "password is incorrect",
    });
  }
  const userInfo = {
    username: dynamoUser.username,
    name: dynamoUser.name,
    score: dynamoUser.score,
  };
  const token = auth.generateToken(userInfo);
  const response = {
    user: userInfo,
    token: token,
  };
  return util.buildResponse(200, response);
}

async function getUser(username) {
  const params = {
    TableName: userTable,
    Key: {
      username: username,
    },
  };
  return await dynamodb
    .get(params)
    .promise()
    .then(
      (response) => {
        console.log("Response received!", response.Item);
        return response.Item;
      },
      (error) => {
        console.error("There is an error: ", error);
      }
    );
}

module.exports.login = login;
