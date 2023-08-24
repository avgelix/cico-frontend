// Get the loan index from the URL
var loanIndex = getParameterByName('loanIndex');
let debounceTimer;
let initialValue;
let inputText;
var amorTable = document.getElementById('paymentAmort');
var paymentinfo = document.getElementById('paymentContainer');
var paymentButton = document.getElementById('paymentSuccess');
var amorData = {};
var interest;
var principal;
let paymentAmor;

const thisLoan = document.getElementById('thisloan');

// Assuming the 'payment' input field is triggering the displayDetails function
const paymentInput = document.getElementById('payment');
paymentInput.addEventListener('input', hideStuff);
paymentInput.addEventListener('input', displayDetails);

// Get the current date
const today = new Date();
// Add one month to the current date
const oneMonthFromToday = new Date(today);
oneMonthFromToday.setMonth(oneMonthFromToday.getMonth() + 1);

//retrieve loan details from session storage
const loanIndexToRetrieve = loanIndex;
const retrievedLoanIndex = sessionStorage.getItem(`index${loanIndexToRetrieve}`);
const retrievedLatestBalance = sessionStorage.getItem(`latestBalance${loanIndexToRetrieve}`);
const retrievedInterest = sessionStorage.getItem(`interest${loanIndexToRetrieve}`);
const retrievedLender = sessionStorage.getItem(`lender${loanIndexToRetrieve}`);
const retrievedId = sessionStorage.getItem(`id${loanIndexToRetrieve}`);
const retrievedPeriodicPayment = sessionStorage.getItem(`periodicPayment${loanIndexToRetrieve}`);
const retrievedPeriodicInterest = sessionStorage.getItem(`periodicInterest${loanIndexToRetrieve}`);
const date = oneMonthFromToday;

//display retrieved loan details
const html = `
        <h2>Loan #${retrievedLoanIndex}</h2>
        <div class="loanInfo">
            <div>
                <p><strong>Lender:</strong> <br> ${retrievedLender}</p>
            </div>
            <div>
                <p><strong>Interest Rate:</strong> <br> ${retrievedInterest}%</p>
            </div>
            <div>
                <p><strong>Principal:</strong> <br> $${retrievedLatestBalance}</p>
            </div>
        </div> `;

thisLoan.innerHTML = html;


const paymentForm = document.getElementById('paymentSuccess');
console.log('Script loaded. Finding payment form...');

//FUNCTIONS 

//To retrieve the value of the 'loanIndex' parameter from the URL
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


//function to display details after session storage retrieval
function displayDetails() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(doSomething, 1500); // Adjust the time (in milliseconds) as needed
}


// This function will be called after the user stops typing for 500 milliseconds
function doSomething() {
    inputText = document.getElementById('payment').value;
    console.log("User stopped typing. Input value: " + inputText);

    initialValue = inputText;


    // Display Amor Table

    //inputText= parseInt(String(inputText).trim(), 10);

    if (inputText !== '') {

        // Input value is not empty
        console.log('Input value is not empty:', inputText);

        //calculte percentage of payment to interest and percentage of payment to balance
        interest = (parseInt(retrievedLatestBalance) * (parseInt(retrievedInterest) / 12)).toFixed(2)
        principal = (parseInt(inputText) - parseInt(interest)).toFixed(2);

        console.log('Input value:', inputText);
        console.log('Interest:', interest);
        console.log('Balance:', principal);

        console.log('payment amount', parseInt(inputText));
        console.log('latest balance', parseInt(retrievedLatestBalance));

        if (parseInt(inputText) > parseInt(retrievedLatestBalance)) {
            console.log('input', 'balance');
            paymentinfo.innerHTML = `
            <p><strong>Invalid Payment Amount</strong></p>
            <p>Your payment amount exceeds the remaining loan balance</p>
            `;
            paymentinfo.classList.remove('hidden');
        } else {

            amorData = {};

            if (principal < 0) {
                principal = 0;
            };

            if (parseInt(inputText) < interest) {
                var added = interest - inputText;
                console.log('added', added);
                interest = inputText;

                console.log(interest);

                amorData = {
                    monthlyPayment: retrievedPeriodicPayment,
                    method: 'mortgage',
                    apr: retrievedInterest,
                    balance: (parseInt(retrievedLatestBalance) + added - (parseInt(inputText))) * (1 + parseInt(retrievedPeriodicInterest)),
                    loanTerm: Math.ceil(retrievedLatestBalance / retrievedPeriodicPayment),
                    date: date
                };

                console.log(amorData.balance)

            } else {

                amorData = {
                    monthlyPayment: parseInt(retrievedPeriodicPayment),
                    method: 'mortgage',
                    apr: parseInt(retrievedInterest),
                    balance: (parseInt(retrievedLatestBalance) - parseInt(inputText)), /** (1 + parseInt(retrievedPeriodicInterest)),*/
                    loanTerm: Math.ceil(parseInt(retrievedLatestBalance) / parseInt(retrievedPeriodicPayment)),
                    date: date
                };

                console.log(amorData.balance)

            };

            fetch('http://localhost:3000/service/createAmor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(amorData),
            })

                .then((response) => response.json())
                .then((data) => {

                    //sanity check
                    console.log('Amor Data:', amorData);
                    console.log('Response Data:', data);
                    paymentAmor = data.response;

                    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
                    const scheduleTable = document.getElementById('amorTable');
                    const tableBody = scheduleTable.querySelector('tbody');

                    inputText = document.getElementById('payment').value;

                    const firstrow = document.createElement('tr');

                    const indexCell = document.createElement('td');
                    indexCell.textContent = `Payment #1`;
                    firstrow.appendChild(indexCell);

                    const totalCell = document.createElement('td');
                    console.log(inputText);
                    totalCell.textContent = `$` + inputText;
                    firstrow.appendChild(totalCell);

                    const interestCell = document.createElement('td');
                    interestCell.textContent = `$` + parseInt(interest).toFixed(2);
                    firstrow.appendChild(interestCell);

                    const principalCell = document.createElement('td');
                    principalCell.textContent = `$` + parseInt(principal).toFixed(2);
                    firstrow.appendChild(principalCell);

                    const remainingBalanceCell = document.createElement('td');
                    if (added) {
                        remainingBalanceCell.textContent = `$` + (amorData.balance);
                    } else {
                        remainingBalanceCell.textContent = `$` + (retrievedLatestBalance - inputText).toFixed(2);
                    }
                    firstrow.appendChild(remainingBalanceCell);

                    const dateCell = document.createElement('td');
                    dateCell.textContent = today.toLocaleDateString("en-US", options);;
                    firstrow.appendChild(dateCell);

                    tableBody.appendChild(firstrow);

                    data.response.schedule.forEach((item, index) => {
                        const row = document.createElement('tr');

                        const indexCell = document.createElement('td');
                        indexCell.textContent = `Payment #` + (index + 2);
                        row.appendChild(indexCell);

                        const totalCell = document.createElement('td');
                        totalCell.textContent = `$` + (item.interest + item.principal).toFixed(2);
                        row.appendChild(totalCell);


                        const interestCell = document.createElement('td');
                        interestCell.textContent = `$` + item.interest.toFixed(2);
                        row.appendChild(interestCell);

                        const principalCell = document.createElement('td');
                        principalCell.textContent = `$` + item.principal.toFixed(2);
                        row.appendChild(principalCell);

                        const remainingBalanceCell = document.createElement('td');
                        remainingBalanceCell.textContent = `$` + item.remainingBalance.toFixed(2);
                        row.appendChild(remainingBalanceCell);

                        const dateCell = document.createElement('td');
                        const formatteditemDate = new Date(item.date).toLocaleDateString("en-US", options);
                        dateCell.textContent = formatteditemDate;
                        row.appendChild(dateCell);

                        tableBody.appendChild(row);
                    });

                    amorTable.classList.remove('hidden');

                })
                ;

            paymentinfo.innerHTML = `
            <p><strong>Interest:</strong> $${interest}</p>
            <p><strong>Balance:</strong> $${principal}</p>
            `;
            paymentinfo.classList.remove('hidden');


            paymentButton.classList.remove('hidden');

        }

    } else {
        // Input value is empty
        console.log('Input value is empty');
    }

    /*console.log('before', inputText);
    inputText = '';
    console.log('after', inputText);*/
}


//function to hide and clean content of elements when user changes payment amount
function hideStuff() {
    inputText = document.getElementById('payment').value;
    if (inputText !== initialValue) {
        amorTable.classList.add('hidden'); // Hide the amorTable if the input value matches the initial value
        paymentinfo.classList.add('hidden');
        paymentButton.classList.add('hidden');

        var table = document.getElementById('amorTable');
        var rowCount = table.rows.length;

        // Starting from the last row (excluding the first row) to the second row (index 1)
        for (var i = rowCount - 1; i >= 1; i--) {
            table.deleteRow(i);
        }
    }
}

async function newPayment() {
    console.log('called');

    // Get the payment details from the user input in the UI
    const loan_id = retrievedId;
    const payment_amount = document.getElementById('payment').value;
    const payment_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const payment_method = document.getElementById('paymentMethod').value;
    const payment_notes = document.getElementById('paymentNotes').value;
    const amortization_data = paymentAmor;

    // Create the request body with the payment details
    const requestBody = {
        loan_id,
        payment_amount,
        payment_date,
        payment_method,
        payment_notes,
        amortization_data,
    };

    console.log(payment_date);
    console.log(requestBody);

    try {
        // Make the POST request to record the payment
        const response = await fetch('http://localhost:3000/service/newPayment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + keycloak.token,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Fetch error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log(data); // You can use this data in your UI to display a success message or perform other actions.
    } catch (error) {
        console.error('Error creating payment:', error);
        // Handle errors and display an error message to the user if needed.
    }
}

paymentForm.addEventListener('submit', (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    console.log('prevented a disaster');

    // Call your function and make the POST request
    newPayment()
        .then(() => {
            console.log('now..');

            // Submit the form programmatically after your function finishes processing
            paymentForm.submit();
        })
        .catch(error => {
            console.error('Error:', error);
        });

    return false;
});





