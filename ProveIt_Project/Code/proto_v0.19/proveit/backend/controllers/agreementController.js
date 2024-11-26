const axios = require('axios');
const { raw } = require('body-parser');

require('dotenv').config();

const GET_PROPERTY_TENANT_LINK = 'https://apiqa.hometrumpeter.com/property-management/get-property/tenant/';
const AGREEMENT_INITIATE_LINK = 'https://apiqa.hometrumpeter.com/agreement/initiate';
const AGREEMENT_SUBMIT_LINK = 'https://apiqa.hometrumpeter.com/agreement/submit';
const AGREEMENT_VIEW_LINK = 'https://apiqa.hometrumpeter.com/agreement/tenant/{tenantId}/property/{propertyId}';
const AGREEMENT_APPROVE_LINK = 'https://apiqa.hometrumpeter.com/agreement/approved';

const HEADERS = {
    'xck': process.env.API_TOKEN,
    'Content-Type': 'application/json',
};

exports.sendAgreement = (req, res) => {
    let payload = {
        tenantId: req.query.userId,
        tenantPropertyRefId: ""
    };

    let headers = {...HEADERS, Authorization: req.headers.authorization};

    console.log("TENANT IN PROPERTY URL: " + GET_PROPERTY_TENANT_LINK);
    console.log("TENANT IN PROPERTY TENANT ID: " + req.query.userId);

    axios.get(GET_PROPERTY_TENANT_LINK + req.query.userId, { 'headers': headers })
        .then(response => {
            console.log("TENANT IN PROPERTY RESPONSE: isSuccess " + response.data?.isSuccess);

            if (!response.data?.isSuccess) {
                throw new Error(response.data.message);
            }
            payload.tenantPropertyRefId = response.data.data.tenantPropertyRefId;

            console.log("HOMEOWNER AGREEMENT INITIATE URL:" + AGREEMENT_INITIATE_LINK);

            return axios.post(AGREEMENT_INITIATE_LINK, payload, { 'headers': headers });
        })
        .then(agResponse => {
            console.log("HOMEOWNER AGREEMENT INITIATE RESPONSE: isSuccess " + agResponse.data?.isSuccess);
            if (!agResponse.data?.isSuccess) {
                throw new Error(agResponse.data.message);
            }
            res.send({ message: "Agreement sent successfully" });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send({ error: error.message || 'Internal server error' });
        });
};

exports.submitAgreement = (req, res) => {

    // WIP : Build payload more dynamically by receiving values from client

    let payload = {
        tenantId: req.query.userId,
        ownerId: "",
        managerId: "",
        propertyId: "",
        rent: req.body.rent,
        integrationFee: req.body.integrationFee,
        htFee: req.body.htFee,
        managerFee: req.body.managerFee,
        advancePayment: req.body.advancePayment,
        rentDueDate: req.body.rentDueDate,
        isDepositPayable: true,
        isRentPayable: true,
        isCustomDueDate: true,
        isRecurringPayment: true,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        securityDepositStatus: 0,
        lateFee: req.body.lateFee,
        tenantPropertyRefId: ""
    }

    let headers = {...HEADERS, Authorization: req.headers.authorization};

    console.log("TENANT IN PROPERTY URL: " + GET_PROPERTY_TENANT_LINK);
    console.log("TENANT IN PROPERTY TENANT ID: " + req.query.userId);

    axios.get(GET_PROPERTY_TENANT_LINK + req.query.userId, { 'headers': headers })
        .then(response => {
            console.log("TENANT IN PROPERTY RESPONSE: isSuccess " + response.data?.isSuccess);

            if (!response.data?.isSuccess) {
                throw new Error(response.data.message);
            }
            payload.ownerId = response.data.data.property.ownerId;
            payload.managerId = response.data.data.property.ownerId;
            payload.propertyId = response.data.data.property.id;
            payload.tenantPropertyRefId = response.data.data.tenantPropertyRefId;

            console.log("HOMEOWNER AGREEMENT SUBMIT URL: " + AGREEMENT_SUBMIT_LINK);

            return axios.post(AGREEMENT_SUBMIT_LINK, payload, { 'headers': headers });
        })
        .then(agResponse => {
            console.log("HOMEOWNER AGREEMENT SUBMIT RESPONSE: isSuccess " + agResponse.data?.isSuccess);
            if (!agResponse.data?.isSuccess) {
                res.send({ message: agResponse.data.message, isSuccess: false });
            } else {
                res.send({ message: "Agreement submitted successfully", isSuccess: true });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send({ error: error.message || 'Internal server error' });
        });
}

exports.approveAgreement = (req, res) => {
    let payload = {
        id: "",
        tenantId: req.query.userId,
        propertyId: ""
    };

    let headers = {...HEADERS, Authorization: req.headers.authorization};

    axios.get(GET_PROPERTY_TENANT_LINK + req.query.userId, { 'headers': headers })
        .then(response => {
            if (!response.data?.isSuccess) {
                throw new Error(response.data.message);
            }

            payload.propertyId = response.data.data.property.id;

            return axios.get(AGREEMENT_VIEW_LINK.replace('{tenantId}', req.query.userId).replace('{propertyId}', payload.propertyId), { 'headers': headers });
        })
        .then(agResponse => {
            if (!agResponse.data?.isSuccess) {
                throw new Error(agResponse.data.message);
            }

            payload.id = agResponse.data.data.agreement.id;

            return axios.post(AGREEMENT_APPROVE_LINK, payload, { 'headers': headers });
        })
        .then(finalResponse => {
            console.log("TENANT APPROVE AGREEEMNT RESPONSE:");
            console.log(finalResponse.data);
            if (!finalResponse.data?.isSuccess) {
                throw new Error(finalResponse.data.message);
            }
            res.send({ message: "Agreement approved successfully" });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send({ error: error.message || 'Internal server error' });
        });
};

exports.seeAgreement = (req, res) => {
    let payload = {
        tenantId: req.body.id,
        propertyId: ""
    };

    let headers = {...HEADERS, Authorization: req.headers.authorization};

    console.log("TENANT IN PROPERTY URL: " + GET_PROPERTY_TENANT_LINK);
    console.log("TENANT IN PROPERTY TENANT ID: " + req.query.userId);

    axios.get(GET_PROPERTY_TENANT_LINK + req.body.id, { 'headers': headers })
        .then(response => {
            if (!response.data?.isSuccess) {
                throw new Error(response.data.message);
            }

            payload.propertyId = response.data.data.property.id;

            console.log("TENANT SEE AGREEMENT URL: " + AGREEMENT_VIEW_LINK);
            console.log("TENANT SEE AGREEMENT PROPERTY ID: " + payload.propertyId);

            return axios.get(AGREEMENT_VIEW_LINK.replace('{tenantId}', payload.tenantId).replace('{propertyId}', payload.propertyId), { 'headers': headers });
        })
        .then(agResponse => {
            console.log("TENANT SEE AGREEMENT RESPONSE: isSuccess " + agResponse.data?.isSuccess);
            if (!agResponse.data?.isSuccess && agResponse.data.message == "No Data Found") {
                res.send({status: "not found"});
            } else if (agResponse.data.isSuccess) {
                const rawData = agResponse.data.data.agreement;
                refinedData = {
                    id: rawData.id,
                    rent: rawData.rent,
                    rentDueDate: rawData.rentDueDate,
                    lateFee: rawData.lateFee,
                    advancePayment: rawData.advancePayment,
                    startDate: rawData.startDate,
                    endDate: rawData.endDate,
                    securityDepositStatus: rawData.securityDepositStatus,
                    status: rawData.status
                }
                res.send(refinedData);
            } else {
                throw new Error(agResponse.data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send({ error: error.message || 'Internal server error' });
        });
};



