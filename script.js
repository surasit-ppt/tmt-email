const SHEET_ID = '1kXbT9Ia6-rRGlDjGdwAtHShsw267eXxxLDk-wtn19f8';
const SHEET_NAME = 'Employees';

function initClient() {
    gapi.client.init({
        apiKey: 'AIzaSyAFnyXSAki4LiczKNhyEzbhHsvTC-abfAo',
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
    }).then(() => {
        // Explicitly load the Sheets API
        return gapi.client.load('sheets', 'v4');
    }).then(() => {
        console.log('API client initialized and Sheets API loaded.');
    }).catch(error => {
        console.error('Error during API initialization:', error);
    });
}

function formatBirthday(input) {
    let value = input.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (value.length >= 3) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length >= 6) {
        value = value.slice(0, 5) + '/' + value.slice(5, 9);
    }
    input.value = value.slice(0, 10); // Limit the length to 10 characters
}

function lookupEmail() {
    const employeeId = document.getElementById('employeeId').value.trim();
    const birthday = document.getElementById('birthday').value.trim();
    
    document.getElementById('result').innerText = '';
    document.getElementById('errorEmployee').innerText = !employeeId ? 'กรุณาใส่รหัสพนักงานให้ถูกต้อง' : '';
    document.getElementById('errorBirthday').innerText = !birthday ? 'กรุณาใส่วันเกิด' : '';

    // Validate birthday format (DD/MM/YYYY)
    const birthdayPattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!birthdayPattern.test(birthday)) {
        document.getElementById('errorBirthday').innerText = 'กรุณาใส่วันเกิดให้ถูกต้อง เช่น 1 มกราคม 2567 01/01/2567';
        return;
    }

     // Convert MM/DD/YYYY to DD/MM/YYYY
    const parts = birthday.split('/');
    const reformattedBirthday = `${parts[0]}/${parts[1]}/${parts[2]}`;


    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A:F`
    }).then(response => {
        const rows = response.result.values;
        if (!rows || rows.length === 0) {
            document.getElementById('result').innerText = 'ไม่พบข้อมูลในระบบ';
            document.getElementById('result').style.color = 'red';
            return;
        }

        let emailFound = false;
        for (let i = 1; i < rows.length; i++) {

            // Assuming the employeeId is in column 0 and the birthday is in column 1 (you can adjust if necessary)
            if (rows[i][0] === employeeId && rows[i][4] === reformattedBirthday) {
                console.log("rows[i][5] : ", rows[i][5])
                if (rows[i][5] === undefined) {
                    document.getElementById('result').innerText = 'ไม่พบข้อมูลในระบบ';
                    document.getElementById('result').style.color = 'red';
                    emailFound = true;
                } else {
                    document.getElementById('result').innerText = `อีเมลของคุณคือ : ${rows[i][5]}`;
                    document.getElementById('result').style.color = '';
                    emailFound = true;
                    break;
                }
            }
        }
        if (!emailFound) {
            document.getElementById('result').innerText = 'รหัสพนักงาน หรือ วันเกิดไม่ถูกต้อง';
            document.getElementById('result').style.color = 'red';
        }
    }).catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'Error fetching data.';
    });
}

gapi.load('client', initClient);
