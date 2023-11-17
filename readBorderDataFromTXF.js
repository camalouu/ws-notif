const fs = require('fs');

const startString = '81110000';
const endString = 'Belarus';

const readStream = fs.createReadStream('9999.txf', { encoding: 'utf8' });
const writeStream = fs.createWriteStream('resultTXF.txt', { encoding: 'utf8' })

let foundStart = false;

readStream.on('data', (chunk) => {
    chunk = chunk.toString()
    if (!foundStart) {
        const startIndex = chunk.indexOf(startString);
        if (startIndex !== -1) {
            foundStart = true;
            console.log("Starts is found")
            writeStream.write(chunk.slice(startIndex, chunk.length))
        }
    } else {
        const endIndex = chunk.indexOf(endString);
        if (endIndex !== -1) {
            console.log("End is found")
            writeStream.write(chunk.slice(0, endIndex + endString.length))
            readStream.close();
        } else {
            writeStream.write(chunk)
        }
    }
});

readStream.on('end', () => {
    console.log('Reading ended (possibly end string is not found)');
});

readStream.on('error', (err) => {
    console.error('Error reading file:', err);
});