document.addEventListener('DOMContentLoaded', () => {
  const createLoanForm = document.getElementById('loanTerms');

  const lenderNameError = document.getElementById('LenderNameError');
  const lendeeNameError = document.getElementById('LendeeNameError');
  const monthlyPaymentError = document.getElementById('monthlyPaymentError');


  // Function to validate the form fields
  async function validateForm(event) {
    document.getElementById('lender').addEventListener('input', () => {
      lenderNameError.textContent = '';
    });

    document.getElementById('lendee').addEventListener('input', () => {
      lendeeNameError.textContent = '';
    });

    document.getElementById('monthlyPayment').addEventListener('input', () => {
      monthlyPaymentError.textContent = '';
    });

    // Validate the input fields here
    if (document.getElementById('monthlyPayment').value === '') {
      alert('Monthly Payment is required.');
      console.log("no monthly payment")
      event.preventDefault(); // Prevent form submission
    }

    if (document.getElementById('interestRate').value === '') {
      alert('Interest Rate is required.');
      return false; // Prevent form submission
    }

    if (parseInt(document.getElementById('monthlyPayment').value) > parseInt(document.getElementById('balance').value)) {
      monthlyPaymentError.textContent = "Monthly payment can't be bigger than loan amount";
      return false; // Prevent form submission
    }

    if (document.getElementById('balance').value === '') {
      alert('Balance is required.');
      return false;// Prevent form submission
    }

    if (document.getElementById('startDate').value === '') {
      alert('Start Date is required.');
      return false; // Prevent form submission
    }

    if (document.getElementById('lender').value === '') {
      alert('Lender is required.');
      event.preventDefault();// Prevent form submission
    } else {
      const lenderresponse = await fetch('http://localhost:3000/service/checkUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + keycloak.token
        },
        body: JSON.stringify({ username: document.getElementById('lender').value })// Send the username as an object
      });

      const lender = await lenderresponse.json();
      console.log(lender);

      if (!lender.exists) {
        lenderNameError.textContent = 'Not a valid user';
        return false;
      }
    }

    if (document.getElementById('lendee').value === '') {
      alert('Lendee is required.');
      event.preventDefault(); // Prevent form submission
    } else {
      const lendeeresponse = await fetch('http://localhost:3000/service/checkUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + keycloak.token
        },
        body: JSON.stringify({ username: document.getElementById('lendee').value }) // Send the username as an object
      });

      const lendee = await lendeeresponse.json();
      console.log(lendee);

      if (!lendee.exists) {
        lendeeNameError.textContent = 'Not a valid user';
        return false;
      }
    }

    // If all validations pass
    // Get user input from the UI
    // Redirect to loandetails.html

    const monthlyPaymentInput = parseInt(document.getElementById('monthlyPayment').value);
    const interestRateInput = parseInt(document.getElementById('interestRate').value);
    const balanceInput = parseInt(document.getElementById('balance').value);
    const startDateInput = new Date(document.getElementById('startDate').value).toISOString();
    const lenderInput = document.getElementById('lender').value;
    const lendeeInput = document.getElementById('lendee').value;

    // Create the request data for the amorTable using user input
    const requestData = {
      monthlyPayment: monthlyPaymentInput,
      method: 'mortgage',
      apr: interestRateInput,
      balance: balanceInput,
      loanTerm: -Math.log(1 - (((interestRateInput / 100) / 12) * balanceInput) / monthlyPaymentInput) / Math.log(1 + ((interestRateInput / 100) / 12)), /*Math.ceil(balanceInput / monthlyPaymentInput)*/
      date: startDateInput
    };

    // Store the request data in session storage
    sessionStorage.setItem('requestData', JSON.stringify(requestData));
    sessionStorage.setItem('lenderInput', lenderInput);
    sessionStorage.setItem('lendeeInput', lendeeInput);

    return true;
  }

  // Add event listener to the form's submit event
  /*createLoanForm.addEventListener('submit', (event) => {
     Prevent the default form submission behavior
    event.preventDefault();

    console.log('prevented a disaster');

    validateForm(event) 
    .then(() => {
        console.log('now..');
        
        if (validateForm(true)) {
        // Submit the form programmatically after your function finishes processing
        createLoanForm.submit();
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });*/

  // Add event listener to the form's submit event
  createLoanForm.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    console.log('prevented a disaster');

    const isValid = await validateForm(event);

    if (isValid) {
      console.log('now..');
      createLoanForm.submit();
    }

    return false;
  });

});