const axios = require('axios');
require('dotenv').config();

const GENERAL_SERVICE_TYPES_LINK = "https://apiqa.hometrumpeter.com/service-provider/service-type/domain";
const SPECIFIC_SERVICE_TYPES_LINK = "https://apiqa.hometrumpeter.com/service-provider/service-type/options/";
const TENANT_PROPERTY_LINK = "https://apiqa.hometrumpeter.com/property-management/get-property/tenant/";
const REQUEST_TIMELINES_LINK = "https://apiqa.hometrumpeter.com/service-provider/timelines";
const INITIATED_TICKET_LINK = "https://apiqa.hometrumpeter.com/ticket/initiated";
const GET_TENANT_TICKET_LINK = "https://apiqa.hometrumpeter.com/ticket/tenant/tickets";
const GET_MANAGER_TICKET_LINK = "https://apiqa.hometrumpeter.com/service-request/initiator/service-requests";
const ADD_SERVICE_LINK = "https://apiqa.hometrumpeter.com/service-provider/service";
const FIND_SERVICE_PROVIDER_LINK =  "https://apiqa.hometrumpeter.com/service-provider/sp";
const REQUEST_DETAILS_LINK = "https://apiqa.hometrumpeter.com/service-provider/services-request-detail/"
const SERVICE_REQUEST_TICKET_LINK = "https://apiqa.hometrumpeter.com/ticket/services-request";
const SEND_PROPOSAL_LINK = "https://apiqa.hometrumpeter.com/service-provider/send-proposal/";
const APPROVE_PROPOSAL_LINK = "https://apiqa.hometrumpeter.com/service-provider/approve-proposal/";
const REJECT_PROPOSAL_LINK = "https://apiqa.hometrumpeter.com/service-provider/reject-proposal/";
const MANAGER_REJECT_REQUEST_LINK = "https://apiqa.hometrumpeter.com/service-provider/reject-service/";
const WITHDRAW_PROPOSAL_LINK = "https://apiqa.hometrumpeter.com/service-provider/proposal-withdraw/";
const WITHDRAW_SERVICE_REQUEST_LINK = "https://apiqa.hometrumpeter.com/service-provider/service-request-withdraw/";

const HO_SERVICE_REQUEST_LINK = "https://apiqa.hometrumpeter.com/service-provider/services-request";

const HEADERS = {
    'xck': process.env.API_TOKEN,
    'Content-Type': 'application/json', 
};

exports.generalServiceTypes = (req, res) => {
    console.log(req.body);
    let genServiceTypeHeaders = HEADERS;
    genServiceTypeHeaders.Authorization = req.headers.authorization;

    console.log("HOMEOWNER/TEANANT GET GENERAL SERVICE TYPE URL: " + GENERAL_SERVICE_TYPES_LINK);

    axios.get(GENERAL_SERVICE_TYPES_LINK, {headers: genServiceTypeHeaders})
    .then(response => {
        console.log("HOMEOWNER/TEANANT GET GENERAL SERVICE TYPE RESPONSE: " +    response.data?.isSuccess);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message})
    })
}

exports.specificServiceTypes = (req, res) => {

    if (!req.query.parentId) {
        res.status(400).json({error: "Please specify the parentId to get unique service types"});
        return;
    }

    let specServiceTypeHeaders = HEADERS;
    specServiceTypeHeaders.Authorization = req.headers.authorization;

    console.log("HOMEOWNER/TEANANT GET SPECIFIC SERVICE TYPE URL: " + SPECIFIC_SERVICE_TYPES_LINK);
    console.log("HOMEOWNER/TEANANT GET SPECIFIC SERVICE TYPE GENERAL ID: " + req.query.parentId);

    axios.get(SPECIFIC_SERVICE_TYPES_LINK + req.query.parentId, {headers: HEADERS})
    .then(response => {
        console.log("HOMEOWNER/TEANANT GET SPECIFIC SERVICE TYPE RESPONSE: " + response.data?.isSuccess);
        res.send(response.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.tenantProperty = (req, res) => {
    

    if (!req.query.tenantId) {
        res.status(400).json({error: "Please specify the tenantId to get tenant property"});
    }

    let tenantPropertyHeaders = HEADERS;
    tenantPropertyHeaders.Authorization = req.headers.authorization;

    console.log("GET TENANT PROPERTY FOR TENANT ID URL:" + TENANT_PROPERTY_LINK);
    console.log("GET TENANT PROPERTY FOR TENANT ID:" + req.query.tenantId);

    axios.get(TENANT_PROPERTY_LINK + req.query.tenantId, {headers: HEADERS})
    .then(response => {
        console.log("GET TENANT PROPERTY FOR TENANT ID RESPONSE:" + response.data?.isSuccess);
        res.send(response.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.requestTimelines = (req, res) => {

    let requestTimelineHeaders = HEADERS;
    requestTimelineHeaders.Authorization = req.headers.authorization;

    console.log("HOMEOWNER/TEANANT GET REQUEST TIMELINES URL: " + REQUEST_TIMELINES_LINK);

    axios.get(REQUEST_TIMELINES_LINK, {headers: requestTimelineHeaders})
    .then(response => {
        console.log("HOMEOWNER/TEANANT GET REQUEST TIMELINES RESPONSE: " + response.data?.isSuccess);
        res.send(response.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.tenantTicket = (req, res) => {

    let tenantTicketHeaders = HEADERS;
    tenantTicketHeaders.Authorization = req.headers.authorization;

    console.log("TENANT POST SERVICE TICKET URL: " + INITIATED_TICKET_LINK);
    console.log("TENANT POST SERVICE TICKET PROPERTY ID: " + req.body.propertyId);

    axios.post(INITIATED_TICKET_LINK, req.body, {headers: tenantTicketHeaders})
    .then(response => {
        console.log("TENANT POST SERVICE TICKET RESPONSE: isSuccess " + response.data?.isSuccess);
        res.send(response.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.getTenantTicket = (req, res) => {

    let Headers = HEADERS;
    Headers.Authorization = req.headers.authorization;

    console.log("TENANT GET TENANT TICKETS URL: " + GET_TENANT_TICKET_LINK);

    axios.get(GET_TENANT_TICKET_LINK, {headers: Headers})
    .then(response => {
        console.log("TENANT GET TENANT TICKETS RESPONSE: isSuccess" + response.data?.isSuccess);
        res.send(response.data.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.addService = (req, res) => {

    let addServiceHeaders = HEADERS;
    addServiceHeaders.Authorization = req.headers.authorization;

    console.log("SERVICE PROVIDER ADD NEW SERVICE URL: " + ADD_SERVICE_LINK);

    axios.post(ADD_SERVICE_LINK, req.body, {headers: addServiceHeaders})
    .then(response => {
        console.log("SERVICE PROVIDER ADD NEW SERVICE RESPONSE: isSuccess " + response.data?.isSuccess);
        res.send(response.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.getManagerTicket = (req, res) => {

    let Headers = HEADERS;
    Headers.Authorization = req.headers.authorization;

    console.log("MANAGER GET TICKET URL: " + GET_MANAGER_TICKET_LINK);
    
    axios.get(GET_MANAGER_TICKET_LINK, {headers: Headers})
    .then(response => {
        console.log("MANAGER GET TICKET RESPONSE: isSuccess" + response.data?.isSuccess);
        service_requests = response.data.data.serviceRequests;
        res.send(service_requests);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.getPrivateProviders = (req, res) => {

    let headers = HEADERS;
    headers.Authorization = req.headers.authorization;

    let findServiceProviderObject =
        {
            "typeId": req.body.childId,
            "propertyId": req.body.propertyId,
            "serviceProviderType":"0",
            "cities":[],
            "city":"",
            "showMiles":false,
            "showTime":false,
            "showBounded":false,
            "showLicensed":false,
            "skipedLicensed":true,
            "showInsured":false,
            "showVerified":false
        };

    console.log("HOMEOWNER GET SERVICE PROVIDER FOR QUOTE URL: " + FIND_SERVICE_PROVIDER_LINK);
    console.log("HOMEOWNER GET SERVICE PROVIDER FOR QUOTE PROPERTY ID: " + req.body.propertyId);
    console.log("HOMEOWNER GET SERVICE PROVIDER FOR QUOTE SERVICE ID: " + req.body.childId);

    axios.post(FIND_SERVICE_PROVIDER_LINK, findServiceProviderObject, {headers: headers})
    .then(response => {
        console.log("HOMEOWNER GET SERVICE PROVIDER FOR QUOTE RESPONSE: isSuccess" + response.data?.isSuccess);

        if (response.data.isSuccess) {
            let refinedData = [];
            //extract the service provider information from the reponse objects
            for (let i=0; i<response.data.data.length; i++) {
                refinedData.push(response.data.data[i].serviceProvider);
            }

            res.send({isSuccess: true, data: refinedData});
        } else {
            res.send(response.data);
        }
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.getRequestDetails = (req, res) => {

    console.log("HOMEOWNER/SERVICE PROVIDER GET REQUEST DETAIL FOR SERVICE REQUEST URL: " + REQUEST_DETAILS_LINK);
    console.log("HOMEOWNER/SERVICE PROVIDER GET REQUEST DETAIL FOR SERVICE REQUEST ID: " + req.query.id);

    let requestDetailHeaders = HEADERS;
    requestDetailHeaders.Authorization = req.headers.authorization;

    axios.get(REQUEST_DETAILS_LINK + req.query.id, {headers: requestDetailHeaders})
    .then(response => {
        console.log("HOMEOWNER/SERVICE PROVIDER GET REQUEST DETAIL FOR SERVICE REQUEST RESPONSE: " + response.data?.isSuccess);
        res.send(response.data)
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.serviceRequestTicket = (req, res) => {

    let serviceRequestTicketHeaders = HEADERS;
    serviceRequestTicketHeaders.Authorization = req.headers.authorization;

    console.log("HOMEOWNER POST TICKET AS SERVICE REQUEST URL: " + SERVICE_REQUEST_TICKET_LINK);
    console.log("HOMEOWNER POST TICKET AS SERVICE REQUEST ID: " + req.body);

    axios.post(SERVICE_REQUEST_TICKET_LINK, req.body, {headers: serviceRequestTicketHeaders})
    .then(response => {
        console.log("HOMEOWNER POST TICKET AS SERVICE REQUEST RESPONSE: " + response.data?.isSuccess);
        res.send(response.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.sendProposal = (req, res) => {
  console.log("Sending proposal from service provider");

  let sendProposalHeaders = HEADERS;
  sendProposalHeaders.Authorization = req.headers.authorization;

  console.log("SERVICE PROVIDER SEND PROPOSAL URL: " + SEND_PROPOSAL_LINK);
  console.log("SERVICE PROVIDER SEND PROPOSAL TICKET ID: " + req.body.id);

  axios.post(SEND_PROPOSAL_LINK, req.body, {headers: sendProposalHeaders})
  .then(response => {
      console.log("SERVICE PROVIDER SEND PROPOSAL RESPONSE: isSuccess " + response.data?.isSuccess);
      res.send(response.data);
  })
  .catch(error => {
      console.error(error);
      res.status(500).json({error: error.message});
  })
}

exports.approveProposal = (req, res) => {

    let approveProposalHeaders = HEADERS;
    approveProposalHeaders.Authorization = req.headers.authorization;

    console.log("HOMEOWNER APPROVE PROPOSAL URL: " + APPROVE_PROPOSAL_LINK);
    console.log("HOMEOWNER APPROVE PROPOSAL ID: " + req.query.id);

    axios.get(APPROVE_PROPOSAL_LINK + req.query.id, {headers: approveProposalHeaders})
    .then(response => {
        console.log("HOMEOWNER APPROVE PROPOSAL RESPONSE: isSuccess " + response.data?.isSuccess);
        res.send(response.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}

exports.rejectProposal = (req, res) => {

  let rejectProposalHeaders = HEADERS;
  rejectProposalHeaders.Authorization = req.headers.authorization;

  console.log("HOMEOWNER REJECT PROPOSAL URL: " + REJECT_PROPOSAL_LINK);
  console.log("HOMEOWNER REJECT PROPOSAL ID: " + req.query.id);

  axios.delete(REJECT_PROPOSAL_LINK + req.query.id, {headers: rejectProposalHeaders})
  .then(response => {
      console.log("HOMEOWNER REJECT PROPOSAL RESPONSE: isSuccess " + response.data?.isSuccess);
      res.send(response.data)
  })
  .catch(error => {
      console.error(error);
      res.status(500).json({error: error.message});
  })
}

exports.managerRejectRequest = (req, res) => {

  let managerRejectRequestHeaders = HEADERS;
  managerRejectRequestHeaders.Authorization = req.headers.authorization;

  console.log("MANAGER REJECT PROPOSAL URL: " +MANAGER_REJECT_REQUEST_LINK);
  console.log("MANAGER REJECT PROPOSAL ID: " + req.query.reqId);

  axios.delete(MANAGER_REJECT_REQUEST_LINK + req.query.reqId, {headers: managerRejectRequestHeaders})
  .then(response => {
      console.log("MANAGER REJECT PROPOSAL RESPONSE: isSuccess " + response.data?.isSuccess);
      res.send(response.data)
  })
  .catch(error => {
      console.error(error);
      res.status(500).json({error: error.message});
  })
}

exports.spWithdrawProposal = (req, res) => {

  let withdrawProposalHeaders = HEADERS;
  withdrawProposalHeaders.Authorization = req.headers.authorization;

  console.log("SERVICE PROVIDER WITHDRAW PROPOSAL URL: " + WITHDRAW_PROPOSAL_LINK);
  console.log("SERVICE PROVIDER WITHDRAW PROPOSAL ID: " + req.query.id);

  axios.post(WITHDRAW_PROPOSAL_LINK + req.query.id, req.body, {headers: withdrawProposalHeaders})
  .then(response => {
    console.log("SERVICE PROVIDER WITHDRAW PROPOSAL RESPONSE: isSuccess" + response.data?.isSuccess);
      res.send(response.data);
  })
  .catch(error => {
      console.error(error);
      res.status(500).json({error: error.message});
  })
}

exports.tenWithdrawServiceRequest = (req, res) => {
  console.log("Withdrawing service request submitted by tenant: " + req.query.id);

  let withdrawServiceRequestHeaders = HEADERS;
  withdrawServiceRequestHeaders.Authorization = req.headers.authorization;

  console.log("HOMEOWNER WITHDRAW PROPOSAL MADE BY TENANT URL: " + WITHDRAW_SERVICE_REQUEST_LINK);
  console.log("HOMEOWNER WITHDRAW PROPOSAL MADE BY TENANT ID: " + req.query.id);

  axios.post(WITHDRAW_SERVICE_REQUEST_LINK + req.query.id, req.body, {headers: withdrawServiceRequestHeaders})
  .then(response => {
      console.log("HOMEOWNER WITHDRAW PROPOSAL MADE BY TENANT RESPONSE: isSuccess " + response.data?.isSuccess);
      res.send(response.data);
  })
  .catch(error => {
      console.error(error);
      res.status(500).json({error: error.message});
  })
}

exports.hoServiceRequest = (req, res) => {
    console.log("Posting service request for HO");

    let hoServiceRequestHeaders = HEADERS;
    hoServiceRequestHeaders.Authorization = req.headers.authorization;

    console.log("HOMEOWNER CREATE SERVICE REQUEST URL: " + HO_SERVICE_REQUEST_LINK);
    console.log("HOMEOWNER CREATE SERVICE REQUEST PROPERTY ID: " + req.body.propertyId);
    console.log("HOMEOWNER CREATE SERVICE REQUEST SERVICE ID: " + req.body.childId);

    axios.post(HO_SERVICE_REQUEST_LINK, req.body, {headers: hoServiceRequestHeaders})
    .then(response => {
        console.log("HOMEOWNER CREATE SERVICE REQUEST RESPONSE: isSuccess" + response.data?.isSuccess);
        res.send(response.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({error: error.message});
    })
}