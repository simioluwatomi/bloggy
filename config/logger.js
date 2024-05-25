const path = require('path');
const rfs = require('rotating-file-stream');
const { format } = require('date-fns');

const generator = () => {
    const today = new Date();

    const formattedDate = format(today, 'yyyy-MM-dd')

    return `express-${formattedDate}.log`
};

// create a write stream (in append mode)
const rotatingFileStream = rfs.createStream(generator, {
    interval: '1d',
    path: path.join(__dirname, '../storage/logs')
})

module.exports = rotatingFileStream;