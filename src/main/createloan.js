document.addEventListener('DOMContentLoaded', () => {      
  const createLoanForm = document.getElementById('loanTerms');

  // Function to validate the form fields
  function validateForm(event) {
    const monthlyPaymentInput1 = document.getElementById('monthlyPayment').value;
    const interestRateInput1 = document.getElementById('interestRate').value;
    const balanceInput1 = document.getElementById('balance').value;
    const startDateInput1 = document.getElementById('startDate').value;
    const lenderInput1 = document.getElementById('lender').value;
    const lendeeInput1 = document.getElementById('lendee').value;

      console.log("started")

          // Validate the input fields here
      if (monthlyPaymentInput1 === '') {
        alert('Monthly Payment is required.');
        console.log("no monthly payment")
        event.preventDefault(); // Prevent form submission
      }

      if (interestRateInput1 === '') {
        alert('Interest Rate is required.');
        event.preventDefault(); // Prevent form submission
      }
      
      if (balanceInput1 === '') {
        alert('Balance is required.');
        event.preventDefault(); // Prevent form submission
      }
      
      if (startDateInput1 === '') {
        alert('Start Date is required.');
        event.preventDefault(); // Prevent form submission
      }

      if (lenderInput1 === '') {
        alert('Lender is required.');
        event.preventDefault(); // Prevent form submission
      }

      if (lendeeInput1 === '') {
        alert('Lendee is required.');
        event.preventDefault(); // Prevent form submission
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


      // Create the request payload using user input
      const requestData = {
        monthlyPayment: monthlyPaymentInput,
        method: 'mortgage',
        apr: interestRateInput,
        balance: balanceInput,
        loanTerm: Math.ceil(balanceInput / monthlyPaymentInput),
        date: startDateInput
      };

      // Store the request data in session storage
      sessionStorage.setItem('requestData', JSON.stringify(requestData));
      sessionStorage.setItem('lenderInput', lenderInput);
      sessionStorage.setItem('lendeeInput', lendeeInput);

      window.location.href = 'loandetails.html';
      event.preventDefault(); // Prevent form submission
  }

  // Add event listener to the form's submit event
  createLoanForm.addEventListener('submit', validateForm);

});