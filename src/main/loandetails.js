document.addEventListener('DOMContentLoaded', () => {

    const responseContainer = document.getElementById('responseContainer');

    // Retrieve the stored request data from session storage
    const requestData = JSON.parse(sessionStorage.getItem('requestData'));

    const lender = sessionStorage.getItem('lenderInput');
    const lendee = sessionStorage.getItem('lendeeInput');

    console.log(lender);
    console.log(requestData);

    function newLoan(data) {
        // Get the loan details and lender/lendee names from the user input in the UI
        const loan_amount = `${data.response.balance}`;
        const annual_interest = `${requestData.apr}`;
        const lender_name = lender;
        const lendee_name = lendee;
        const amortization_data = 
        {
            "response_Data": data,
        };
    
        // Create the request body with the loan details
        const requestBody = {
          loan_amount,
          annual_interest,
          lender_name,
          lendee_name,
          amortization_data,
        };
        console.log(typeof(amortization_data));
    
        // Make the POST request to create the loan
        fetch('http://localhost:3000/service/newLoan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + keycloak.token,
          },
          body: JSON.stringify(requestBody),
        })
          .then((response) => response.json())
          .then((data) => {
            // Handle the response from the backend
            console.log(data); // You can use this data in your UI to display a success message or perform other actions.
          })
          .catch((error) => {
            console.error('Error creating loan:', error);
            // Handle errors and display an error message to the user if needed.
          });
      }
    


    if (requestData) {
        fetch('http://localhost:3000/service/createLoan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })

        .then((response) => response.json())
        .then((data) => {


            //sanity check
            console.log('Request Data:', requestData);
            console.log('Response Data:', data);

            const options = { year: "numeric", month: "2-digit", day: "2-digit" };
            const formattedStartDate = new Date(data.response.startDate).toLocaleDateString("en-US", options);
            const formattedPayoffDate = new Date(data.response.endDate).toLocaleDateString("en-US", options);

            // Display the response data in the UI
            //responseContainer.textContent = JSON.stringify(data);
            responseContainer.innerHTML = 
            `Loan Amount: $${data.response.balance}<br>` +
            `Periodic Interest: ${data.response.periodicInterest.toFixed(5)}%<br>` +
            `Lender: ` + lender + `<br>` +
            `Lendee: ` + lendee + `<br>` +
            `Repayment Start Date: ` + formattedStartDate + `<br>` +
            `Monthly Payment: $${data.response.periodicPayment.toFixed(1)}<br>` +
            `Total To Pay: $${data.response.totalPayment.toFixed(2)}<br>` +
            `Total Interest: $${data.response.totalInterest.toFixed(2)}<br>` +
            `Payoff Date: ` + formattedPayoffDate + `<br>` +
            `Schedule:<br><br>`;

            /*data.response.schedule.forEach((item, index) => {
            const scheduleItem = `${index + 1}. Interest: ${item.interest}, Principal: ${item.principal}, Remaining Balance: ${item.remainingBalance}, Date: ${item.date}<br>`;
            responseContainer.innerHTML += scheduleItem;*/

            const scheduleTable = document.getElementById('amorTable');
            const tableBody = scheduleTable.querySelector('tbody');

            data.response.schedule.forEach((item, index) => {
            const row = document.createElement('tr');
            
            const indexCell = document.createElement('td');
            indexCell.textContent = `Payment #` + (index + 1);
            row.appendChild(indexCell);

            const totalCell = document.createElement('td');
            totalCell.textContent = `$` + (item.interest+item.principal).toFixed(2);
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

            newLoan(data);
         })
        .catch((error) => {
        // Handle any errors that occur during the request
        console.error('Error:', error);
        });
    };


    
  
  
    /* Show the hidden element
    const showButton = document.getElementById('showButton');
    const hiddenElement = document.getElementById('hiddenElement');

    showButton.addEventListener('click', () => {
        hiddenElement.classList.remove('hidden');
    });*/

});