// Google Sheets API initialization
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
const SHEET_NAME = 'Employees';

function initClient() {
    gapi.client.init({
        apiKey: 'YOUR_GOOGLE_API_KEY',
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
    }).then(() => {
        console.log('API client initialized.');
    });
}

function lookupEmail() {
    const employeeId = document.getElementById('employeeId').value.trim();
    if (!employeeId) {
        document.getElementById('result').innerText = 'Please enter an employee ID.';
        return;
    }

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A:B`
    }).then(response => {
        const rows = response.result.values;
        if (!rows || rows.length === 0) {
            document.getElementById('result').innerText = 'No data found.';
            return;
        }

        let emailFound = false;
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0] === employeeId) {
                document.getElementById('result').innerText = `Your email is: ${rows[i][1]}`;
                emailFound = true;
                break;
            }
        }
        if (!emailFound) {
            document.getElementById('result').innerText = 'Employee ID not found.';
        }
    }).catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'Error fetching data.';
    });
}

gapi.load('client', initClient);