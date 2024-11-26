/*
Run order state -> setstate -> city -> setcity -> zip -> setzip
API property type require token from user
testlogin -> propertytype -> setpropertype -> addproperty
*/

const axios = require('axios');
require('dotenv').config();

const STATE_LINK = "https://apiqa.hometrumpeter.com/location/states";
const CITY_LINK = "https://apiqa.hometrumpeter.com/location/cities/state/";
const ZIP_LINK = "https://apiqa.hometrumpeter.com/location/zipcodes/city/";
const PROPERTY_TYPE_LINK = "https://apiqa.hometrumpeter.com/property-management/property-types";
const ADD_PROPERTY_LINK = "https://apiqa.hometrumpeter.com/property-management/property";
const OWNED_PROPERTIES_LINK = 'https://apiqa.hometrumpeter.com/property-management/properties/owner';
const VALIDATE_PROPERTY_LINK = 'https://apiqa.hometrumpeter.com/property-management/address/validate';
const DELETE_PROPERTY_LINK = 'https://apiqa.hometrumpeter.com/property-management/property/';


const HEADERS = {
  'xck': process.env.API_TOKEN,
  'Content-Type': 'application/json', 
};

//get all states
exports.state = (req, res) => {
    console.log("HOMEOWNER GET ALL STATE URL:" + STATE_LINK);
    axios.get(STATE_LINK, { 'headers': HEADERS })
    .then(response => {
      // Handle the data from the API response
        console.log("HOMEOWNER GET ALL STATE RESPONSE: isSuccess " + response.data?.isSuccess);
        res.send(response.data.data);
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching data:', error);
      res.send('Error: ' + error.message);
    });
};

//all city from selected state
exports.city = (req, res) => {
    requestedStateId = req.query.stateId;
    console.log("HOMEOWNER GET ALL CITY FROM STATE ID:" + requestedStateId);
    console.log("HOMEOWNER GET ALL CITY URL:" + CITY_LINK);
    axios.get(CITY_LINK + requestedStateId,{ 'headers': HEADERS })
    .then(response => {
      console.log("HOMEOWNER GET ALL CITY FROM STATE RESPONSE: isSuccess " + response.data?.isSuccess);
      //console.log(response.data);
      // Handle the data from the API response
        const rawData = response.data;
        cityData = rawData.data;
        const refinedData = rawData.data.map(item => ({
            countyId: item.countyId,
            cityId: item.id,
            name: item.name,
        }));

        res.send(refinedData);
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching data:', error);
      res.send('Error: ' + error.message);
    });
};

//all zip of selected city
exports.zip = (req, res) => {
    console.log("HOMEOWNER GET ALL ZIP URL:" + ZIP_LINK);
    console.log("HOMEOWNER GET ZIP FROM CITY ID:" + req.query.cityId);
    axios.get(ZIP_LINK + req.query.cityId,{ 'headers': HEADERS })
    .then(response => {
      // Handle the data from the API response
        console.log("HOMEOWNER GET ALL ZIP FROM CITY RESPONSE: isSuccess " + response.data?.isSuccess);
        const rawData = response.data;
        zipData = rawData.data;
        const refinedData = rawData.data.map(item => ({
            code: item.code,
            zipId: item.id
        }));

        res.send(refinedData);
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching data:', error);
      res.send('Error: ' + error.message);
    });
};

//add property post
exports.addProperty = (req, res) => {
    //console.log(HEADERS);
    const propertyObject = req.body;
    let addPropertyHeaders = JSON.parse(JSON.stringify(HEADERS));
    addPropertyHeaders.Authorization = req.headers.authorization ?? null;

    console.log("HOMEOWNER ADD PROPERTY URL:" + ADD_PROPERTY_LINK);
    console.log("HOMEOWNER ADD PROPERTY USING OBJECT" + propertyObject);

    axios.post(ADD_PROPERTY_LINK, propertyObject,{ 'headers': addPropertyHeaders })
    .then(response => {
      // Handle the data from the API response
        console.log("HOMEOWNER ADD PROPERTY RESPONSE: isSuccess " + response.data?.isSuccess);
        const rawData = response.data;
        
        if (rawData.isSuccess){
          // Validate address
          axios.get(OWNED_PROPERTIES_LINK, {'headers': addPropertyHeaders})
          .then(response => {
            // Get just added property from owner
            const propertyData = (response.data.data ?? [])[0];
            console.log(propertyData);
            let validatePropertyJSON = {
              id: propertyData.id,
              countyId: propertyData.countyId,
              cityId: propertyData.cityId,
              stateId: propertyData.id,
              zipcodeId: propertyData.zipcodeId,
              propertyTypeId: propertyData.propertyTypeId,
              ownerId: propertyData.ownerId,
      
              name: propertyData.name,
              streetAddress: propertyData.streetAddress,
              rent: propertyData.rent,
              isPrimary: propertyData.isPrimary,
              canTenantInitiate: propertyData.canTenantInitiate,
              status: propertyData.status,
              longitude: 0,
              latitude: 0,
              isTenantActive: propertyData.isTenantActive,
              applicationFeeOnRent: propertyData.applicationFeeOnRent,
              registrationFee: propertyData.registrationFee
            }
            console.log("HOMEOWNER VALIDATE PROPERTY URL:" + VALIDATE_PROPERTY_LINK);
            console.log("HOMEOWNER VALIDATE PROPERTY USING OBJECT:" + validatePropertyJSON);
            
            //post propertyData to validate street address
            axios.post(VALIDATE_PROPERTY_LINK, validatePropertyJSON,{ 'headers': addPropertyHeaders })
            .then(response => {
              console.log("HOMEOWNER VALIDATE PROPERTY RESPONSE: isSuccess " + response.data?.isSuccess);
              if (response.data.isSuccess){
                res.send(response.data);
              } else if (!response.data.isSuccess){
                //delete invalid property
                console.log("HOMEOWNER DELETE INVALID PROPERTY URL: " + DELETE_PROPERTY_LINK);
                console.log("HOMEOWNER DELETE INVALID PROPERTY ID: " + validatePropertyJSON.id);
                axios.delete(DELETE_PROPERTY_LINK + validatePropertyJSON.id, { 'headers': addPropertyHeaders })
                .then(response => {
                  console.log("HOMEOWNER DELETE PROPERTY RESPONSE: isSuccess " + response.data?.isSuccess);
                  
                })
                .catch(error => {
                  // Handle errors
                  console.error('Error fetching data:', error);
                  res.send('Error: ' + error.message);
                });
                res.send(response.data); 
              }
            })
            .catch(error => {
              console.error('Error fetching data:', error);
              res.send({error: error.message});
            })
          })
          .catch(error => {
            console.error('Error fetching data:', error);
            res.send({error: error.message});
          })
        } else if (!rawData.isSuccess){
            //send error of addproperty to front like existed property name or same street address
            res.send(rawData);
        }
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching data:', error);
      res.send('Error: ' + error.message);
    });
};

exports.getPropertyTypes = (req,res) => {
  let propertyTypesHeaders = HEADERS;
  propertyTypesHeaders.Authorization = req.headers.authorization ?? null;

  console.log("HOMEOWNER GET ALL PROPERTY TYPE URL:" + PROPERTY_TYPE_LINK);

  axios.get(PROPERTY_TYPE_LINK, {'headers': propertyTypesHeaders}).then(response => {
    console.log("HOMEOWNER GET PROPERTY TYPE RESPONSE: isSuccess " + response.data?.isSuccess);
    if (response.data.isSuccess){
      const rawData = response.data;
      const refinedData = rawData.data.map(item => ({
        name: item.type,
        propertyTypeId: item.id
      }));
    res.send(refinedData);
    }
  })
};

exports.validateAddress = (req, res) => {
  axios.post(VALIDATE_PROPERTY_LINK, req.body, {'headers': HEADERS})
  .then(response => {
    console.log("HOMEOWNER VALIDATE PROPERTY RESPONSE:")
    console.log(response.data);
    res.send(response.data);
  })
  .catch(error => {
    console.error('Error fetching data:', error)
    res.send('Error:', error.message);
  });
}
