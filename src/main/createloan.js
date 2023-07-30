document.addEventListener('DOMContentLoaded', () => {      
      const responseContainer = document.getElementById('responseContainer');
      const createLoanForm = document.getElementById('loanTerms');
      const showButton = document.getElementById('showButton');

          showButton.addEventListener('click', (event) => {
          event.preventDefault();
      
          // Get user input from the UI
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
        });
    });

