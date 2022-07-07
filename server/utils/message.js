const moment = require('moment');

let generateMessage = (from,text) => {
    return { from ,text, createAt: moment().valueOf() };
};

let generateLocationMessage = (from,lat,lng) => {
    return {
        from,
        url : `https://www.google.com/maps?q=${lat},${lng}`,
        createAt: moment().valueOf()
    }
};

module.exports = {generateMessage,generateLocationMessage};