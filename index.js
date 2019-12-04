const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), controller);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

let ubiqumStudents = []
let ubiqumAlumni = []
let ubiqumLeads = []

function listStudents(auth, sheet) {
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.get({
        spreadsheetId: sheet[1],
        range: 'Students!A2:P',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (rows.length) {
            students = []
            rows.map((row) => {
                ubiqumStudents.push({
                    program: row[1],
                    city: sheet[0],
                    cohort: row[2],
                    startDate: row[15],
                    name: row[3],
                    email: row[4],
                    jobCenter: row[0],
                    progress: {
                        module: row[5],
                        sprint: row[6],
                        day: row[7],
                        refDay: row[8]
                    },
                    gitHub: row[11]

                })
                console.log(`${sheet[0]}: ${row}`);
            });
            // ubiqumStudent.push(
            //     students
            // )
        } else {
            console.log('No data found.');
        }

    });

}

const controller = (auth) => {
    // getAllAllumni(auth)
    // getAllStudents(auth)
    getAllLeads(auth)
}

const getAllLeads = (auth) => {
    console.log('auth :', auth);
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.get({
        spreadsheetId: '1_8b6UoSXgnJmy-5M5ZW_nEyin8U8Gcp36wlG5pvEgXo',
        range: 'Leads!A2:R',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;


        if (rows.length) {
            rows.map((row, i) => {

                ubiqumLeads.push({
                    contactID: row[0],
                    name: row[1],
                    surname: row[2],
                    fullname: row[3],
                    email: row[4],
                    phone: row[5],
                    contactOwner: row[6],
                    lastActivity: row[7],
                    status: row[8],
                    createDate: row[9],
                    lifecycle: row[10],
                    age: row[11],
                    gender: row[12],
                    nationality: row[13],
                    english: row[14],
                    createdDate: row[15],
                }

                )
                console.log('ubiqumLeads :', ubiqumLeads);
            });
        } else {
            console.log('No data found.');
        }


    });
}
const getAllAllumni = (auth) => {
    console.log('auth :', auth);
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.get({
        spreadsheetId: '1ZY8mslTSqK7pBFLZECwBVnz7q_Kd3kSOlSCwOU-8i2s',
        range: 'Backgrounds!A2:L',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;

        if (rows.length) {
            rows.map((row, i) => {
                // console.log('row :', row);
                let almni = {
                    name: row[0],
                    dob: row[1],
                    country: row[2],
                    program: row[3],
                    education: row[4],
                    degree: row[5],
                    related: row[6],
                    professional: row[7],
                    workType: row[8],
                    workTime: row[9],
                    previousExt: row[10],
                    categories: row[12],
                }

                ubiqumAlumni.push({

                    ...almni
                })

            });
        } else {
            console.log('No data found.');
        }


    });
}

const getAllStudents = (auth) => {
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.get({
        spreadsheetId: '1uYc8ytyybHLdQlWGUnrluh6ZusI7f_Ooum6g2SDy6eg',
        range: 'Ubiqum!A2:B5',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;

        if (rows.length) {
            rows.map((row) => {

                listStudents(auth, row)


            });
        } else {
            console.log('No data found.');
        }
        console.log('ubiqumStudent :', ubiqumStudents);

    });

}



const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Express server running on port ${port}`)
});



app.use("/students", (req, res) => {
    let mapstudents = ubiqumStudents.map(student => {
        const split = student.startDate.split('/')

        const id = student.city.substring(0, 2).toUpperCase() + '-' + student.program.substring(0, 2).toUpperCase() + '-' + student.name.substring(0, 2).toUpperCase() + '-' + split[0] + '.' + split[2];
        return {
            ...student,
            id,
            surname: ''
        }
    })
    res.send(mapstudents)
})
app.use("/allumni", (req, res) => {
    // let mapAlumni = ubiqumAlumni.map(student => {
    //     const split = student.startDate.split('/')

    //     const id = student.city.substring(0, 2).toUpperCase() + '-' + student.program.substring(0, 2).toUpperCase() + '-' + student.name.substring(0, 2).toUpperCase() + '-' + split[0] + '.' + split[2];
    //     return {
    //         ...student,
    //         id,
    //         surname: ''
    //     }
    // })
    res.send(ubiqumAlumni)
})
app.use("/leads", (req, res) => {
    console.log('ubiqumLeads :', ubiqumLeads);
    res.send(ubiqumLeads)
})


module.exports = {
    SCOPES,
    getAllStudents,
};