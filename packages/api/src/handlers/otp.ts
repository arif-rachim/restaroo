//const twilio = require('twilio');
import {Handler} from "./Handler";
import twilio from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTHTOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

export const otpHandler:Handler = (params,resolve) => {
    const {phone, otp, app} = params;
    const body = {
        body: `Your ${app} OTP code : ${otp}`,
        messagingServiceSid,
        to: phone
    };
    console.log('Sending message',body);
    // lets disable following message
    // twilio(accountSid, authToken).messages
    //     .create(body).then(message => {
    //     resolve({status: message.status, error: message.errorCode, errorMessage: message.errorMessage});
    // }).done();
    resolve({status: 'accepted', error: null, errorMessage: null});
}