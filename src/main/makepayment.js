let debounceTimer;
let initialValue;
let inputText;
var amorTable = document.getElementById('paymentAmort');

const thisLoan = document.getElementById('thisloan');

function displayDetails() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(doSomething, 1500); // Adjust the time (in milliseconds) as needed
}

function doSomething() {
    // This function will be called after the user stops typing for 500 milliseconds
    inputText = document.getElementById('payment').value;
    console.log("User stopped typing. Input value: " + inputText);

    initialValue = inputText;

    // Display Amor Table
    if (inputText !== '') {
        // Input value is not empty
        amorTable.classList.remove('hidden');
        console.log('Input value is not empty:', inputText);
    } else {
        // Input value is empty
        console.log('Input value is empty');
    }
}

function hideAmort() {
    inputText = document.getElementById('payment').value;
    if (inputText !== initialValue) {
        amorTable.classList.add('hidden'); // Hide the amorTable if the input value matches the initial value
    }
}



// Assuming the 'payment' input field is triggering the displayDetails function
const paymentInput = document.getElementById('payment');
paymentInput.addEventListener('input', hideAmort);
paymentInput.addEventListener('input', displayDetails);


/*const loanIndex = sessionStorage.getItem('index');

// Retrieve the loan data from sessionStorage based on the loan index
const balance = sessionStorage.getItem(`balance${loanIndex}`);
const interest = sessionStorage.getItem(`interest${loanIndex}`);
const lender = sessionStorage.getItem(`lender${loanIndex}`);

// Use the retrieved data as needed
console.log(loanIndex, balance, interest, lender);*/

const loanIndexToRetrieve = parseInt(sessionStorage.getItem('index'), 10);
const retrievedLoanIndex = sessionStorage.getItem(`index${loanIndexToRetrieve}`);
const retrievedBalance = sessionStorage.getItem(`balance${loanIndexToRetrieve}`);
const retrievedInterest = sessionStorage.getItem(`interest${loanIndexToRetrieve}`);
const retrievedLender = sessionStorage.getItem(`lender${loanIndexToRetrieve}`);

console.log("Retrieved Data for Loan Index:", loanIndexToRetrieve);
console.log("Loan Index:", retrievedLoanIndex);
console.log("Balance:", retrievedBalance);
console.log("Interest:", retrievedInterest);
console.log("Lender:", retrievedLender);


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
            <p><strong>Principal:</strong> <br> $${retrievedBalance}</p>
        </div>
    </div> `;

thisLoan.innerHTML = html;







