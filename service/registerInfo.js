const AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-2",
});
const util = require("../utils/util");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = "Choo-Choo-Zoo-User";
const userInfoTable = "Choo-Choo-Zoo-User-Info";

async function registerInfo(userInfo) {
	const username = userInfo.username;
	const gender = userInfo.gender;
	const age = userInfo.age;
	const disability = userInfo.disability;

  if (!username || !gender || !age || !disability) {
    return util.buildResponse(401, {
      message: "All fields are required!",
    });
  }

  const dynamoUser = await getUser(username.toLowerCase().trim());
  if (!dynamoUser || !dynamoUser.username) {
    return util.buildResponse(403, {
      message: "user does not exist!",
    });
  }


  const userInformation = {
		username: username.toLowerCase().trim(),
		age: Number(age),
		gender: gender,
		disability: disability
  };

  const saveUserResponse = await saveUserInfo(userInformation);
  if (!saveUserResponse) {
    return util.buildResponse(503, {
      message: "Server error.",
    });
  }

  return util.buildResponse(200, {
    username: username,
  });
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
        return response.Item;
      },
      (error) => {
        console.error("There is an error: ", error);
      }
    );
}

async function saveUserInfo(userInfo) {
  const params = {
    TableName: userInfoTable,
    Item: userInfo,
  };
  return await dynamodb
    .put(params)
    .promise()
    .then(
      () => {
        return true;
      },
      (error) => {
        console.error("There is an error saving user: ", error);
      }
    );
}

module.exports.registerInfo = registerInfo;
