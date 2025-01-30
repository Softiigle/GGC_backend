const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const getOtpExpiryTime = () => {
    const expiryTime = new Date(Date.now() + 60 * 1000); 
    console.log("Generated OTP Expiry Time:", expiryTime.toISOString());
    return expiryTime;
};


module.exports = {
    generateOtp,
    getOtpExpiryTime,
};
