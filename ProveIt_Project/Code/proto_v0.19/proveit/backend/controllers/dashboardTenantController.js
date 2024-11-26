const axios = require('axios');

require('dotenv').config();

const TENANT_LINK = 'https://apiqa.hometrumpeter.com/property-management/get-property/tenant/';
const OWNER_LINK = 'https://apiqa.hometrumpeter.com/user/';
const TENANT_REQUESTS_LINK = 'https://apiqa.hometrumpeter.com/service-request/tenant/service-requests';


const HEADERS = {
    'xck': process.env.API_TOKEN,
    'Content-Type': 'application/json', 
};

exports.getProperties = (req, res) => {
    let getTenantInfoHeaders = HEADERS;
    getTenantInfoHeaders.Authorization = req.headers.authorization;

    console.log("TENANT GET PROPERTY URL: " + TENANT_LINK);
    console.log("TENANT GET PROPERTY TENANT ID: " + req.query.tenantId);
    //get tenant info from user item in localStorage
    axios.get(TENANT_LINK + req.query.tenantId , {'headers': getTenantInfoHeaders})
    .then(response => {
        if (response.data?.isSuccess) {
            //select only some field for display
            console.log("TENANT GET PROPERTY RESPONSE: isSuccess " + response.data?.isSuccess);
            const propertyData = response.data.data.property;
            refinedData = {
                name: propertyData.name,
                streetAddress: propertyData.streetAddress,
                owner: propertyData.ownerId,
                id: propertyData.id
            };

            //get owner first and last name
            console.log("TENANT GET DETAIL OF HOMEOWNER URL: " +OWNER_LINK);
            axios.get(OWNER_LINK + refinedData.owner , {'headers': getTenantInfoHeaders})
            .then(response => {
                if (response.data?.isSuccess) {
                    console.log("TENANT DETAIL OF HOMEOWNER RESPONSE: isSuccess " + response.data?.isSuccess);
                    refinedData.owner = response.data.data.user.firstName + " " + response.data.data.user.lastName;
                    refinedData.ownerContact = {
                        name: response.data.data.user.firstName = " " + response.data.data.user.lastName,
                        phone: response.data.data.user.phone,
                        email: response.data.data.user.email,
                    }
                    //change to array to use map in display
                    const refinedDataArray = [refinedData];
                    return res.send(refinedDataArray ?? []);
                } else {
                    console.log(response.data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                res.send({error: error.message});
            })
            //return res.send(response.data.data ?? []);
        } else {
            return res.send({error: response.data.message});
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        res.send({error: error.message});
    })

}

exports.getTenantRequests = (req, res) => {
    let tenantRequestHeaders = HEADERS;
    tenantRequestHeaders.Authorization = req.headers.authorization;

    console.log("TENANT SERVICE REQUESTS URL: " + TENANT_REQUESTS_LINK);

    axios.get(TENANT_REQUESTS_LINK, {headers: tenantRequestHeaders})
    .then(response => {
        console.log("TENANT SERVICE REQUESTS RESPONSE: isSuccess " + response.data?.isSuccess);
        res.send(response.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

