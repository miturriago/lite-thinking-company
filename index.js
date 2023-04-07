"use strict";
require("dotenv").config();
const dynamoDb = require("./services/dynamo.service");
const ajvO = require("ajv");
const ajvRq = new ajvO();

module.exports.createCompany = async (event) => {
  const data = JSON.parse(event.body);
  const { fullName, nit, address, phone } = data;
  const creationDate = new Date().toDateString();
  const updateDate = creationDate;
  const PK = "#COMPANIES";
  const SK = "#COMPANY#" + nit;
  const payload = {
    PK,
    SK,
    fullName,
    nit,
    address,
    phone,
    creationDate,
    updateDate,
  };

  try {
    await dynamoDb.putItem(
      payload,
      process.env.TABLE_NAME + "-" + process.env.STAGE
    );
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      error: JSON.stringify(error),
    };
  }
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({ message: "success", payload }),
  };
};
