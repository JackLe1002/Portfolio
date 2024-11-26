const axios = require('axios');

require('dotenv').config();

const OWNED_PROPERTIES_LINK = 'https://apiqa.hometrumpeter.com/property-management/properties/owner';
const GET_PROPERTY_TENANTS = 'https://apiqa.hometrumpeter.com/property-management/tenants/property/';

const HEADERS = {
    'xck': process.env.API_TOKEN,
    'Content-Type': 'application/json',
};

exports.getTenants = async (req, res) => {
    let getPropertiesHeaders = {...HEADERS};
    getPropertiesHeaders.Authorization = req.headers.authorization;

    console.log("HOMEOWNER GET ALL OWNED PROPERTY URL:" + OWNED_PROPERTIES_LINK);

    try {
        let propertiesResponse = await axios.get(OWNED_PROPERTIES_LINK, {'headers': getPropertiesHeaders});
        console.log("HOMEOWNER GET ALL OWNED PROPERTY RESPONSE: isSuccess " + propertiesResponse.data?.isSuccess);
        if (!propertiesResponse.data?.isSuccess) {
            return res.send({error: propertiesResponse.data.message});
        }

        const properties = propertiesResponse.data.data ?? [];
        const tenantRequests = properties.map(property =>
            axios.get(GET_PROPERTY_TENANTS + property.id, {'headers': getPropertiesHeaders})
                .then(response => 
                    console.log("HOMEOWNER GET TENANT IN PROPERTY ID:" + property.id)
                    //console.log(response.data.data.tenants)
                    (
                    { propertyId: property.id, tenants: response.data.data.tenants ?? [] }))
                .catch(error => ({ propertyId: property.id, error: error.message }))
        );

        const tenantsResults = await Promise.all(tenantRequests);
        let tenantsWithProperties = {};
        
        tenantsResults.forEach(result => {
            if (!result.error) {
                const property = properties.find(p => p.id === result.propertyId);
                if (property) {

                    tenantsWithProperties[property.name] = result.tenants;
                }
            }
        });

        console.log("TENANT LIST:");
        console.log(tenantsWithProperties);
        
        return res.send(tenantsWithProperties);
    } catch (error) {
        console.error('Error fetching properties:', error.message);
        return res.send({error: error.message});
    }
}

exports.getTenantInProperty = (req,res) => {
    let getPropertiesHeaders = HEADERS;
    getPropertiesHeaders.Authorization =  req.headers.authorization;  
    console.log("HOMEOWNER GET TENANT IN PROPERTY URL:" + GET_PROPERTY_TENANTS); 
    console.log("HOMEOWNER GET TENANT IN PROPERTY ID:" + req.body.id);       
    axios.get(GET_PROPERTY_TENANTS + req.body.id , {'headers': getPropertiesHeaders})
    .then(response => {
        
        console.log("HOMEOWNER GET TENANT IN PROPERTY RESPONSE: isSuccess " + response.data?.isSuccess);
        if (response.data?.isSuccess) {
            rawData = response.data.data.tenants ?? [];
            const refinedData = rawData.map(item => ({
                firstName: item.firstName,
                lastName: item.lastName,
                phone: item.phone,
                email: item.email
            }));

            const tenant = {
                "tenants": refinedData,
                "isSuccess": true,
            }

            res.send(tenant);
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        res.send({error: error.message});
    })
}
