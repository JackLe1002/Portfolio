const axios = require('axios');

require('dotenv').config();

const GET_SERVICE_PROVIDER = 'https://apiqa.hometrumpeter.com/service-provider/customer/sp';

const HEADERS = {
    'xck': process.env.API_TOKEN,
    'Content-Type': 'application/json', 
};

exports.getServiceProvider = (req, res) => {
    let getServiceProviderHeaders = HEADERS;
    getServiceProviderHeaders.Authorization = req.headers.authorization;

    console.log("HOMEOWNER GET SERVICE PROVIDER RESPONSE URL: " + GET_SERVICE_PROVIDER);

    axios.get(GET_SERVICE_PROVIDER, {'headers': getServiceProviderHeaders})
    .then(response => {
        console.log("HOMEOWNER GET SERVICE PROVIDER RESPONSE: isSuccess " + response.data?.isSuccess);
        if (response.data?.isSuccess) {
            const refinedData = response.data.data.map(item => ({
                firstName: item.serviceProvider.firstName,
                lastName: item.serviceProvider.lastName,
                email: item.serviceProvider.email,
                phone: item.serviceProvider.phone,
                address: item.serviceProvider.spDetail.address,
                company: item.serviceProvider.spDetail.company,
                distanceCovered: item.serviceProvider.spDetail.distanceCovered,
                perHourRate: item.serviceProvider.spDetail.perHourRate,
                isPublic: item.serviceProvider.spDetail.isPublic.toString()

            }));
            return res.send(refinedData);
        } else {
            return res.send({error: response.data.message});
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        res.send({error: error.message});
    });
}
