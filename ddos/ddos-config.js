const DDDoS = require('dddos');
module.exports = new DDDoS({
                        errorData: "Hãy bình tĩnh, đợi tý đi!",
                        //Data to be passes to the client on DDoS detection. Default: "Not so fast!".
                        errorCode: 429,
                        //HTTP error code to be set on DDoS detection. Default: 429 (Too Many Requests)
                        weight: 1,
                        maxWeight: 10,
                        checkInterval: 1000,
                        rules: [
                        { //cho phep trang chu truy cap 30 yeu cau / 1 giay
                            string: '/',
                            maxWeight: 1
                        },
                        { // Allow 4 requests accessing the application API per checkInterval 
                            regexp: "^/api/*",
                            flags: "i",
                            maxWeight: 4,
                            queueSize: 4 // If request limit is exceeded, new requests are added to the queue 
                        },
                        { // Allow up to 16 other requests per check interval.
                            regexp: ".*",
                            maxWeight: 16
                        }
                        ]
                    })
;
  