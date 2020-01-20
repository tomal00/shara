const c = require('colors/safe')
const fs = require('fs')

const template = {
    websiteUrl: '',
    S3fileBucketName: '',
    accountsTableName: '',
    imagesTableName: '',
    collectionsTableName: ''
}


console.log(c.green('Creating config...'))

fs.writeFile("config.json", JSON.stringify(template), 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }

    console.log(`${c.yellow('config.json')} created. Please fill it with your config.`);
});