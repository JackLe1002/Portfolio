var express = require('express');
const router = express.Router();
const axios = require('axios');

const LOGIN_API = "https://apiqa.hometrumpeter.com/user/login";
const SIGNUP_API = "https://apiqa.hometrumpeter.com/user/signup";
const SEND_CONTACT_LINK = "https://apiqa.hometrumpeter.com/contact/send";
const authToken = process.env.API_TOKEN;

const headers = {
    'xck': authToken,
    'Content-Type': 'application/json', 
};

//handle login post request from front end
router.post('/login', function (req, res) {
    console.log(req.body);
    axios.post(LOGIN_API, req.body, { headers })
    .then(response => {
      // Handle the data from the API response
      console.log(response.data);
      res.send(response.data);      //send API response to frontend
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching data:', error);
      res.send(response.data);      //send API response to frontend
    });
});

//handle signup post request from frontend
router.post('/signup', function (req, res) {
  console.log(req.body);
  axios.post(SIGNUP_API, req.body, { headers })
  .then(response => {
    // Handle the data from the API response
    console.log(response.data);
    res.send(response.data);      //send API response to frontend
  })
  .catch(error => {
    // Handle errors
    console.error('Error fetching data:', error);
    res.send(response.data);      //send API response to frontend
  });
});

module.exports = router;


