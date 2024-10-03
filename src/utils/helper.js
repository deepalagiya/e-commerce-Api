const { Product_details, RolePermition } = require("../models");
const config = require("../config/config");
const moment = require('moment');
const fs = require('fs');

const generateOtp = (digits) => {
    var OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

const imageHendeling = (image) => {
    if (Array.isArray(image)) {
        return image[0];
    } else {
        return image
    }
}



const saveFile = (files, uploadPath = '') => {
    let fileUploadPath = config.fileUploadPath + '/images/' + uploadPath;
    const fileName = moment().unix() + Math.floor(1000 + Math.random() * 9000) + '.' + files.name.split('.').pop();
    return new Promise(async (resolve, reject) => {

        fileUploadPath = fileUploadPath + '/' + fileName;

        files.mv(fileUploadPath, async (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    upload_path: '/images/' + uploadPath + '/' + fileName,
                    file_name: fileName
                });
            }
        });
    })
}


const removeFile = (file_name) => {
    let fileUploadPath = config.fileUploadPath;
    return new Promise(async (resolve, reject) => {
        fileUploadPath = fileUploadPath + file_name;
        fs.unlink(fileUploadPath, async (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    })
}




module.exports = { generateOtp, saveFile, removeFile, imageHendeling };