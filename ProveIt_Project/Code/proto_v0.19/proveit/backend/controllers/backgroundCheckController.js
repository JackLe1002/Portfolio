const axios = require('axios');
const { raw } = require('body-parser');

require('dotenv').config();

const GET_PROPERTY_TENANT_LINK = 'https://apiqa.hometrumpeter.com/property-management/get-property/tenant/';
const BACKGROUND_CHECK_INITIATE_LINK = 'https://apiqa.hometrumpeter.com/background-check/initiate';
const BACKGROUND_CHECK_STATUS_LINK = 'https://apiqa.hometrumpeter.com/background-check/status/';
const BACKGROUND_CHECK_APPROVE_LINK = 'https://apiqa.hometrumpeter.com/background-check/approve';
const BACKGROUND_CHECK_REJECT_LINK = 'https://apiqa.hometrumpeter.com/background-check/reject';
const SP_DETAIL_LINK = "https://apiqa.hometrumpeter.com/customer/sp/detail";
const BG_CHECK_STATUS_LINK = "https://apiqa.hometrumpeter.com/background-check/status/";
const GET_SP_DETAIL_LINK = "https://apiqa.hometrumpeter.com/customer/sp/detail"

const HEADERS = {
    'xck': process.env.API_TOKEN,
    'Content-Type': 'application/json',
};

// Function to validate userId
function getValidatedUserId(req, res) {
    const userId = req.query.userId;
    if (typeof userId !== 'string' || userId.trim() === '') {
        res.status(400).send({ error: 'Invalid or missing userId' });
        return null;
    }
    return userId.trim();
}

exports.checkTenant = (req, res) => {
    const userId = getValidatedUserId(req, res);
    if (!userId) return; // Stop execution if userId is invalid

    let payload = {
        userId: userId,
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        email: req.query.email,
        tenantPropertyRefId: "",

        // WIP : Add as requested
        packages: {
            request_equifax: true,
            request_enhanced_identity_verification: true
        }
    };

    console.log("TENANT IN PROPERTY URL: " + GET_PROPERTY_TENANT_LINK);
    console.log("TENANT IN PROPERTY TENANT ID: " + userId);

    let checkHeaders = {...HEADERS}
    checkHeaders.Authorization = req.headers.authorization

    axios.get(GET_PROPERTY_TENANT_LINK + userId, {'headers': checkHeaders})
        .then(response => {
            console.log("TENANT IN PROPERTY RESPONSE: isSuccess " + response.data?.isSuccess);

            if (response.data?.isSuccess) {
                const tenantDetails = response.data.data;

                payload.tenantPropertyRefId = tenantDetails.tenantPropertyRefId;

                console.log("HOMEOWNER BACKGROUND CHECK INITIATE URL: " + BACKGROUND_CHECK_INITIATE_LINK);
                console.log("HOMEOWNER BACKGROUND CHECK INITIATE TENANT PROPERTY REF ID: " + payload.tenantPropertyRefId);

                return axios.post(BACKGROUND_CHECK_INITIATE_LINK, payload, { 'headers': checkHeaders })
                    .then(bgCheckResponse => {
                        console.log("HOMEOWNER BACKGROUND CHECK INITIATE RESPONSE: isSuccess " + bgCheckResponse.data?.isSuccess);
                        if (bgCheckResponse.data?.isSuccess) {
                            res.send({
                                isSuccess: bgCheckResponse.data.isSuccess,
                                message: bgCheckResponse.data.message
                            });
                        } else {
                            res.status(400).send({ error: bgCheckResponse.data.message });
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        res.status(500).send({ error: error.message || 'Internal server error' });
                    });

            } else {
                return res.send({error: response.data.message});
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            res.send({error: error.message});
        }
    );
}

exports.approveTenant = (req, res) => {
    const userId = getValidatedUserId(req, res);
    if (!userId) return;

    // WIP : Need to fix comments

    let payload = {
        applicantId: "",
        comments: "Good",
        userId: userId,
        tenantPropertyRefId: ""
    };

    console.log("TENANT IN PROPERTY URL: " + GET_PROPERTY_TENANT_LINK);
    console.log("TENANT IN PROPERTY TENANT ID: " + userId);

    let checkHeaders = {...HEADERS, Authorization: req.headers.authorization};

    // Need to get applicant id first
    // If it doesn't work try setting downloadURL to false

    axios.get(GET_PROPERTY_TENANT_LINK + userId, { "headers": checkHeaders })
        .then(response => {
            console.log("TENANT IN PROPERTY RESPONSE: isSuccess " + response.data?.isSuccess);

            if (!response.data?.isSuccess) {
                throw new Error(response.data.message);
            }

            payload.tenantPropertyRefId = response.data.data.tenantPropertyRefId;

            console.log("HOMEOWNER BACKGROUND CHECK STATUS URL: " + BACKGROUND_CHECK_STATUS_LINK);
            console.log("HOMEOWNER BACKGROUND CHECK HOMEOWNER ID: " + userId);

            return axios.get(BACKGROUND_CHECK_STATUS_LINK + userId, { "headers": checkHeaders });
        })
        .then(statusResponse => {
            console.log("HOMEOWNER BACKGROUND CHECK STATUS RESPONSE: isSuccess " + statusResponse.data?.isSuccess);
            if (!statusResponse.data.isSuccess) {
                throw new Error(statusResponse.data.message);
            }

            payload.applicantId = statusResponse.data.data.status.applicantId;

            console.log("HOMEOWNER BACKGROUND CHECK APPROVE URL: " + BACKGROUND_CHECK_APPROVE_LINK);
            console.log("HOMEOWNER BACKGROUND CHECK APPROVE APPLICANT ID: " + payload.applicantId);

            return axios.post(BACKGROUND_CHECK_APPROVE_LINK, payload, { "headers": checkHeaders });
        })
        .then(approveResponse => {
            console.log("HOMEOWNER BACKGROUND CHECK APPROVE RESPONSE: isSuccess " + approveResponse.data?.isSuccess);
            if (!approveResponse.data.isSuccess) {
                throw new Error(approveResponse.data.message);
            }

            res.send({ message: "Tenant approved successfully" });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send({ error: error.message || 'Internal server error' });
        });
};

exports.applyPublic = (req, res) => {
    let applyPublicHeaders = HEADERS;
    applyPublicHeaders.Authorization = req.headers.authorization;

    console.log("SERVICE PROVIDER BACKGROUND CHECK INITIATE URL: " + BACKGROUND_CHECK_INITIATE_LINK);
    console.log("SERVICE PROVIDER BACKGROUND CHECK INITIATE SERVICE PROVIDER ID: " + req.body.bgCheck.userId);

    axios.post(BACKGROUND_CHECK_INITIATE_LINK, req.body.bgCheck, {headers: applyPublicHeaders})
    .then(bgCheckResponse => {
        console.log("SERVICE PROVIDER BACKGROUND CHECK INITIATE RESPONSE: isSuccess " + bgCheckResponse.data?.isSuccess);
        if (bgCheckResponse.data.isSuccess) {
            console.log("SERVICE PROVIDER APPLY FOR PUBLIC STATUS URL: " + SP_DETAIL_LINK);
            console.log("SERVICE PROVIDER APPLY FOR PUBLIC STATUS SERVICE PROVIDER ID: " + req.body.spDetail.id);

            axios.post(SP_DETAIL_LINK, req.body.spDetail, {headers: applyPublicHeaders})
            .then(spDetailResponse => {
                console.log("SERVICE PROVIDER APPLY FOR PUBLIC STATUS RESPONSE: isSuccess " + spDetailResponse.data?.isSuccess);
                if (spDetailResponse.data.isSuccess) {
                    res.send({isSuccess: true, message: "Successfully Applied for public status"})
                } else {
                    throw new Error("Error saving SP Details: " + spDetailResponse.message);
                }
            })

        } else {
            throw new Error("Error initiating background check: " + bgCheckResponse.message);
        }

    }).catch(error => {
        res.send({isSuccess: false, message: error.message});
    })

}

exports.rejectTenant = (req, res) => {

    const userId = getValidatedUserId(req, res);
    if (!userId) return;

    let payload = {
        applicantId: "",
        comments: "Bad",
        userId: userId,
        tenantPropertyRefId: ""
    };

    let checkHeaders = {...HEADERS, Authorization: req.headers.authorization};

    console.log("TENANT IN PROPERTY URL: " + GET_PROPERTY_TENANT_LINK);
    console.log("TENANT IN PROPERTY TENANT ID: " + userId);

    axios.get(GET_PROPERTY_TENANT_LINK + userId, { "headers": checkHeaders })
        .then(response => {
            console.log("TENANT IN PROPERTY RESPONSE: isSuccess " + response.data?.isSuccess);
            
            if (!response.data?.isSuccess) {
                throw new Error(response.data.message);
            }

            payload.tenantPropertyRefId = response.data.data.tenantPropertyRefId;

            console.log("HOMEOWNER BACKGROUND CHECK STATUS URL: " + BACKGROUND_CHECK_STATUS_LINK);
            console.log("HOMEOWNER BACKGROUND CHECK HOMEOWNER ID: " + userId);

            return axios.get(BACKGROUND_CHECK_STATUS_LINK + userId, { "headers": checkHeaders });
        })
        .then(statusResponse => {
            console.log("HOMEOWNER BACKGROUND CHECK STATUS RESPONSE: isSuccess " + statusResponse.data?.isSuccess);

            if (!statusResponse.data.isSuccess) {
                throw new Error(statusResponse.data.message);
            }

            payload.applicantId = statusResponse.data.data.status.applicantId;

            console.log("HOMEOWNER BACKGROUND CHECK REJECT URL: " + BACKGROUND_CHECK_REJECT_LINK);
            console.log("HOMEOWNER BACKGROUND CHECK REJECT APPLICANT ID: " + payload.applicantId);

            return axios.post(BACKGROUND_CHECK_REJECT_LINK, payload, { "headers": checkHeaders });
        })
        .then(rejectResponse => {
            console.log("HOMEOWNER BACKGROUND CHECK REJECT RESPONSE: isSuccess " + rejectResponse.data?.isSuccess);
            if (!rejectResponse.data.isSuccess) {
                throw new Error(rejectResponse.data.message);
            }
            console.log("reject background check of tenant: %s", userId);
            res.send({ message: "Tenant rejected successfully" });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send({ error: error.message || 'Internal server error' });
        });
};

exports.spApplicationStatus = (req, res) => {
    
    const userId = getValidatedUserId(req, res);
    if (!userId) return; 

    let appStatusHeaders = HEADERS;
    appStatusHeaders.Authorization = req.headers.authorization;
    const PASSING_RESULTS = ["REVIEW", "CLEARED"]



    const bgCheck = axios.get(BG_CHECK_STATUS_LINK + userId + "?downloadUrl=false", {headers: appStatusHeaders})
    const spDetail = axios.get(GET_SP_DETAIL_LINK, {headers: appStatusHeaders})

    console.log("BACKGROUND CHECK URL: " + BG_CHECK_STATUS_LINK);
    console.log('BACKGROUND CHECK FOR USER ID: ' + userId);
 
    Promise.all([bgCheck, spDetail])
    .then(responses => {
        const bgCheckResponse = responses[0];
        const spDetailResponse = responses[1];
        
        console.log("SERVICE PROVIDER BACKGROUND CHECK STATUS RESPONSE: isSuccess " + bgCheckResponse.data?.isSuccess);
        console.log("SERVICE PROVIDER GET DETAIL RESPONSE: isSuccess " + spDetailResponse.data?.isSuccess);

        if (!bgCheckResponse.data.isSuccess) {
            throw new Error(bgCheckResponse.data.message ?? "Failed to fetch background check");
        }

        if (!spDetailResponse.data.isSuccess) {
            throw new Error(spDetailResponse.data.message ?? "Failed to fetch SP Detail");
        }

        if (!bgCheckResponse.data.data.status.isSubmitted) {
            return res.send({isSuccess: true, status: "pending", message: "You have not yet submitted your background check. Check your email for an invitation from certn to complete the check."})
        }

        const REPORT_RESULT = bgCheckResponse.data?.data?.status?.application?.result;
        const APPLICANT_ID = bgCheckResponse.data?.data?.status?.applicantId;

        console.log("REPORT RESULT FOR SERVICE PROVIDER WITH ID: %s ", userId, REPORT_RESULT);

        if (!REPORT_RESULT) {
            throw new Error("Could not parse report status from background check");
        }

        if (!APPLICANT_ID) {
            throw new Error("Could not parse applicantID from background check");
        }

        let spDetail = spDetailResponse.data.data;
        
        if (PASSING_RESULTS.includes(REPORT_RESULT)) {
            console.log("SERVICE PROVIDER WITH ID %s IS APPROVED", userId);
            spDetail.isPublic = true;
            spDetail.isAppliedForPublic = false;
            spDetail.isBGChecked = true;

            const approveBgCheckBody = {
                applicantId: APPLICANT_ID,
                userId: userId,
                comments: "Automatically passed by ProveIT system"
            }

            console.log("POSTING SERVICE PROVIDER DETAILS ON APPROVAL FOR SERVICE PROVIDER ID %s", userId);
            const postSpDetail = axios.post(SP_DETAIL_LINK, spDetail, {headers: appStatusHeaders});

            console.log("POSTING BACKGROUND CHECK APPROVAL FOR SERVICE PROVIDER WITH ID %s", userId);
            const approveBGCheck = axios.post(BACKGROUND_CHECK_APPROVE_LINK, approveBgCheckBody, {headers: appStatusHeaders});
            
            Promise.all([postSpDetail, approveBGCheck])
            .then(responses => {
                let spDetailResponse = responses[0];
                let bgCheckApprovalResponse = responses[1];

                console.log("SP DETAIL API RESPONSE: isSuccess ", spDetailResponse.data?.isSuccess);
                console.log("BACKGROUND CHECK APPROVAL RESPONSE: isSuccess ", bgCheckApprovalResponse.data?.isSuccess);

                if (!spDetailResponse.data.isSuccess) {
                    throw new Error(spDetailResponse.data.message ?? "Error updating SP Detail on approval");
                }

                if (!bgCheckApprovalResponse.data.isSuccess) {
                    throw new Error(bgCheckApprovalResponse.data.message ?? "Error posting BG Check approval");
                }

                res.send({isSuccess: true, status: "accepted", message: "Your background check has been approved. You have now been granted public provider status. Please log in again to activate your public status."})
            })
        } else {
            console.log("SERVICE PROVIDER WITH ID %s IS REJECTED", userId);
            res.send({isSuccess: true, status: "rejected", message: "Sorry, but your background check has been rejected. You are not approved for public provider status."});
        }
    }).catch(error => {
        console.log(error);
        res.send({isSuccess: false, message: error.message});
    })
}

exports.tenantApplicationStatus = (req, res) => {
    let appStatusHeaders = HEADERS;
    appStatusHeaders.Authorization = req.headers.authorization;

    console.log("HOMEOWNER BACKGROUND CHECK STATUS URL: " + BG_CHECK_STATUS_LINK);
    console.log("HOMEOWNER BACKGROUND CHECK STATUS ID: " + req.body.id);
    axios.get(BG_CHECK_STATUS_LINK + req.body.id + "?downloadUrl=false", {headers: appStatusHeaders})
    .then(response => {
        console.log("HOMEOWNER BACKGROUND CHECK STATUS RESPONSE: isSuccess " + response.data?.isSuccess);
        if (response.data?.isSuccess || response.data.message == "Background check status not found") {
            const rawData = response.data.data;
            console.log("HOMEOWNER BACKGROUND CHECK STATUS ID " + req.body.id + "NOT FOUND");
            if (response.data.message == "Background check status not found"){
                const refinedData = {
                    isSuccess : false
                }
                return res.send(refinedData);
            } else {
                const refinedData = {
                    id : rawData.status.applicantId,
                    tenantId : req.body.id,
                    checksResult : rawData.status.checksResult ?? [],
                    isSuccess : true
                }
                return res.send(refinedData);
            }
        } else {
            return res.send({error: response.data.message});
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        res.send({error: error.message});
    });
}

exports.tenantApplicationStatusDownload = (req, res) => {
    let appStatusHeaders = HEADERS;
    appStatusHeaders.Authorization = req.headers.authorization;

    console.log("HOMEOWNER BACKGROUND CHECK STATUS WITH DOWNLOAD URL: " + BG_CHECK_STATUS_LINK);
    console.log("HOMEOWNER BACKGROUND CHECK STATUS WITH DOWNLOAD ID: " + req.body.id);

    axios.get(BG_CHECK_STATUS_LINK + req.body.id + "?downloadUrl=true" + "&applicantId=" + req.body.applicantId, {headers: appStatusHeaders})
    .then(response => {
        console.log("HOMEOWNER BACKGROUND CHECK STATUS WITH DOWNLOAD RESPONSE: isSuccess " + response.data?.isSuccess);
        
        if (response.data?.isSuccess) {
            const refinedData = {
                reportUrl: response.data.data.reportUrl,
                isSuccess: true
            }
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

