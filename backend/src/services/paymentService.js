const {randomUUID} = require('crypto');

const FORCE=String(process.env.PAYMENT_FORCE_SUCCESS || "false")==="true";

async function processPayment({bookingId,amount}){
    await new Promise((resolve)=>setTimeout(resolve,1000));

    const success=FORCE ? true : Math.random() > 0.2;

    const transactionId=randomUUID();

    return {
        success,
        txnId: transactionId,
        amount
    };
}

module.exports={processPayment};