var keycloak = new Keycloak();

function logoutAndRedirect() {
  keycloak.logout({ redirectUri: 'http://localhost:8080/dummy-frontend' });
}


document.addEventListener('DOMContentLoaded', () => {
  const activeLoans = document.getElementById('activeLoansContent');

  window.onload = function () {
    keycloak.init({ onLoad: 'check-sso', checkLoginIframe: false }).then(function (authenticated) {
      console.log(Object.entries(keycloak));
      if (authenticated) {
        console.log("authenticated");
        fetchLenderLoans();
      } else {
        console.log("nope");
      }
    });
  };

  async function fetchLenderLoans() {
    try {
      console.log('starting....');

      const response = await fetch('http://localhost:3000/service/lenderLoans', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`, // Fix the token format
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Fetch error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("let's go");
      data.loans.forEach((loan, index) => {
        console.log(`Loan #${index + 1}:`, loan);
      });
      displayLenderLoans(data.loans);
      return data.loans;
    } catch (error) {
      console.error('Error fetching lender loans:', error);
      return []; // Return an empty array to handle the case when there are no loans found.
    }

  }

  async function fetchLendeeLoans() {
    try {
      console.log('starting....');

      const response = await fetch('http://localhost:3000/service/lendeeLoans', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`, // Fix the token format
        }
      });

      console.log('so...');

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Fetch error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("let's go");

      data.loans.forEach((loan, index) => {
        //Use let to declare the loanIndex, loanBalance, loanInterest, and loanLender variables

        let loanIndex = index + 1;
        let loanLatestBalance = loan.latest_balance;
        let loanInterest = loan.annual_interest;
        let loanLender = loan.lender_full_name;
        let loanId = loan.loan_id;
        let loanPeriodicPayment = loan.amortization_data.periodicPayment;
        let loanPeriodicInterest = loan.amortization_data.periodicInterest;

        console.log(loanIndex, loanLatestBalance, loanInterest, loanLender, loanId);

        // Store the request data in sessionStorage
        sessionStorage.setItem(`index${loanIndex}`, loanIndex);
        sessionStorage.setItem(`latestBalance${loanIndex}`, loanLatestBalance);
        sessionStorage.setItem(`interest${loanIndex}`, loanInterest);
        sessionStorage.setItem(`lender${loanIndex}`, loanLender);
        sessionStorage.setItem(`id${loanIndex}`, loanId);
        sessionStorage.setItem(`periodicPayment${loanIndex}`, loanPeriodicPayment);
        sessionStorage.setItem(`periodicInterest${loanIndex}`, loanPeriodicInterest);
      });

      displayLendeeLoans(data.loans);

      return data.loans;
    } catch (error) {
      console.error('Error fetching lender loans:', error);
      return []; // Return an empty array to handle the case when there are no loans found.
    }
  }

  function displayLenderLoans(loans) {
    let html = '';
    if (loans.length === 0) {
      html = '<div><p>No lender loans found.</p></div>';
    } else {
      const totalLoaned = loans.reduce((total, loan) => total + loan.loan_amount, 0);
      const totalInterest = loans.reduce((total, loan) => total + loan.amortization_data.totalInterest, 0);

      html += `
            <div class="activeLoansHeader">
                    <div class="headerContent"><h2>Total Loaned:</h2> <p> $${totalLoaned}</p></div>
                    <div class="headerContent"><h2>Total Interest to Gain:</h2> <p> $${totalInterest.toFixed(2)}</p></div>
                </div>
                `;
      loans.forEach((loan, index) => {
        var options = { year: "numeric", month: "2-digit", day: "2-digit" };
        const formattedStartDate = new Date(loan.amortization_data.startDate).toLocaleDateString("en-US", options);
        const formattedendDate = new Date(loan.amortization_data.endDate).toLocaleDateString("en-US", options);
        const formattedDate = new Date(loan.loan_date).toLocaleDateString("en-US", options);

        html += `
            <div class="loan">
              <h2>Loan #${index + 1}</h2>
              <div class="loanInfo">
                <div>
                  <p><strong>Lendee:</strong> ${loan.lendee_full_name}</p>
                </div>
                <div>
                  <p><strong>Interest Rate:</strong> ${loan.annual_interest}%</p>
                </div>
                <div>
                  <p><strong>Original Principal:</strong> $${loan.loan_amount}</p>
                </div>
              </div>
              <p><a id="viewLoan" href="#0" onclick="document.getElementById('loandetails${index + 1}').classList.remove('hidden')">View more details</a></p>
            </div> 

            <div class="hidden loanDetails" id="loandetails${index + 1}">
            <p><a id="X" href="#0"  onclick="document.getElementById('loandetails${index + 1}').classList.add('hidden')">X</a></p>
                  <p><strong>Date:</strong> ${formattedDate}</p>
                  <p><strong>Outstanding Principal:</strong> $${loan.latest_balance}/$${loan.loan_amount} </p>                  <p><strong>Monthly Payment:</strong> $${loan.amortization_data.periodicPayment.toFixed(2)}</p>
                  <p><strong>Repayment Start Data:</strong> ${formattedStartDate}</p>
                  <p><strong>Payoff Date:</strong> ${formattedendDate}</p>
                  <p><strong>Interest To Accrue:</strong> $${loan.amortization_data.totalInterest.toFixed(2)}</p>

            <div id="moreLoanDetails">
              <div>
              <h2>Original Amortization Table</h2>
              <table id="amorTable${index + 1}">
                  <thead>
                      <tr>
                          <th></th>
                          <th>Total payment amount</th>
                          <th>Amount to interest</th>
                          <th>Amount to principal</th>
                          <th>Remaining loan balance</th>
                          <th>Payment Date</th>
                      </tr>
                  </thead>
                  <tbody id="amorBody${index + 1}">
                  </tbody>
              </table>
            </div>

            <div id="paymentHistoryContainer${index + 1}">
            </div>
          </div>

          <div id="latestAmorDiv">
          <h2>Latest Amortization Table</h2>
          <table id="latestAmorTable${index + 1}">
              <thead>
                  <tr>
                      <th></th>
                      <th>Total payment amount</th>
                      <th>Amount to interest</th>
                      <th>Amount to principal</th>
                      <th>Remaining loan balance</th>
                      <th>Payment Date</th>
                  </tr>
              </thead>
              <tbody id="latestAmorBody${index + 1}">
              </tbody>
          </table>
          </div>

        </div>
        `
          ;
      });
    }
    activeLoans.innerHTML = html;

    var options = { year: "numeric", month: "2-digit", day: "2-digit" };


    loans.forEach((loan, index) => {
      const scheduleTable = document.getElementById(`amorTable${index + 1}`);
      const tableBody = document.getElementById(`amorBody${index + 1}`);

      loan.amortization_data.schedule.forEach((item, index) => {
        const row = document.createElement('tr');

        const indexCell = document.createElement('td');
        indexCell.textContent = `Payment #` + (index + 1);
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

      const paymentContainer = document.getElementById(`paymentHistoryContainer${index + 1}`);
      const latestAmor = document.getElementById(`latestAmorTable${index + 1}`);
      fetchPaymentHistory(`${loan.loan_id}`, paymentContainer, latestAmor);

    });



  };

  function displayLendeeLoans(loans) {
    let lendeehtml = '';
    if (loans.length === 0) {
      lendeehtml = ' <div> <p>No lendee loans found.</p></div>';
    } else {
      const totalToPay = loans.reduce((total, loan) => total + loan.latest_balance, 0);

      lendeehtml += `
        <div class="activeLoansHeader">
            <div class="headerContent"> <h2>Total To Pay:</h2> <p> $${totalToPay}</p></div>
            <div class="headerContent"> <h2>Interest Saved to Date:</h2> <p> $...</p></div>
        </div>`;
      loans.forEach((loan, index) => {
        var options = { year: "numeric", month: "2-digit", day: "2-digit" };
        const formattedStartDate = new Date(loan.amortization_data.startDate).toLocaleDateString("en-US", options);
        const formattedendDate = new Date(loan.amortization_data.endDate).toLocaleDateString("en-US", options);
        const formattedNextPaymentDate = new Date(loan.amortization_data.schedule[0].date).toLocaleDateString("en-US", options);
        const formattedDate = new Date(loan.loan_date).toLocaleDateString("en-US", options);

        lendeehtml += `
            <div class="loan">
              <h2>Loan #${index + 1}</h2>
              <div class="loanInfo">
                <div>
                  <p><strong>Lender:</strong> ${loan.lender_full_name}</p>
                </div>
                <div>
                  <p><strong>Interest Rate:</strong> ${loan.annual_interest}%</p>
                </div>
                <div>
                <p><strong>Outstanding Principal:</strong> $${loan.latest_balance}/$${loan.loan_amount} </p>                </div>
                <div>
                  <p><strong>Next Payment Due:</strong> ${formattedNextPaymentDate}<p>
                </div>
              </div>
              <div class="loanActions">
              <p><a id="viewLoan" href="#0" onclick="document.getElementById('loandeets${index + 1}').classList.remove('hidden')">View more details</a></p>
                <form class="makePaymentForm">
                  <input type="hidden" name="loanIndex" value="${index + 1}">
                  <button class="makePaymentButton" id="makePaymentButton${index + 1}" type="submit">Make a payment</button>
                </form>
              </div>
            </div>

            <div class="hidden loanDetails" id="loandeets${index + 1}">
              <p><a id="X" href="#0"  onclick="document.getElementById('loandeets${index + 1}').classList.add('hidden')">X</a></p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Original Principal:</strong> $${loan.loan_amount}</p>
              <p><strong>Monthly Payment:</strong> $${loan.amortization_data.periodicPayment.toFixed(2)}</p>
              <p><strong>Repayment Start Date:</strong> ${formattedStartDate}</p>
              <p><strong>Payoff Date:</strong> ${formattedendDate}</p>
              <p><strong>Total To Interest:</strong> $${loan.amortization_data.totalInterest.toFixed(2)}</p>
              <p><strong> Schedule:</strong> </p>

              <div id="moreLoanDetails">
                <div>
                  <h2>Original Amortization Table</h2>
                  <table id="amorTable${index + 1}">
                      <thead>
                          <tr>
                              <th></th>
                              <th>Total payment amount</th>
                              <th>Amount to interest</th>
                              <th>Amount to principal</th>
                              <th>Remaining loan balance</th>
                              <th>Payment Date</th>
                          </tr>
                      </thead>
                      <tbody id="amorBody${index + 1}">
                      </tbody>
                  </table>
                </div>

                <div id="paymentHistoryContainer${index + 1}">
                </div>
            </div>

            <div>
              <h2>Latest Amortization Table</h2>
              <table id="latestAmorTable${index + 1}">
                  <thead>
                      <tr>
                          <th></th>
                          <th>Total payment amount</th>
                          <th>Amount to interest</th>
                          <th>Amount to principal</th>
                          <th>Remaining loan balance</th>
                          <th>Payment Date</th>
                      </tr>
                  </thead>
                  <tbody id="latestAmorBody${index + 1}">
                  </tbody>
              </table>
            </div>
          </div> `
          ;
      });
    }
    activeLoans.innerHTML = lendeehtml;

    const makePaymentForms = document.querySelectorAll(".makePaymentForm");
    makePaymentForms.forEach((form) => {
      form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the loanIndex from the hidden input field within the form
        const inputField = form.querySelector('input[name="loanIndex"]');
        const loanIndex = inputField.value;
        console.log(loanIndex);

        // Construct the URL with the loanIndex as a parameter
        const url = `makepayment.html?loanIndex=${loanIndex}`;

        // Redirect to the new URL
        window.location.href = url;
      });
    });

    var options = { year: "numeric", month: "2-digit", day: "2-digit" };

    loans.forEach((loan, index) => {
      const scheduleTable = document.getElementById(`amorTable${index + 1}`);
      const tableBody = document.getElementById(`amorBody${index + 1}`);
      loan.amortization_data.schedule.forEach((item, index) => {
        const row = document.createElement('tr');

        const indexCell = document.createElement('td');
        indexCell.textContent = `Payment #` + (index + 1);
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

      const paymentContainer = document.getElementById(`paymentHistoryContainer${index + 1}`);
      const latestAmor = document.getElementById(`latestAmorTable${index + 1}`);

      fetchPaymentHistory(`${loan.loan_id}`, paymentContainer, latestAmor);
    })
  };

  // Add a separate function to handle sidebar click
  function handleSidebarClick(event) {
    const action = event.target.dataset.action;
    if (action === 'lenderLoans') {
      fetchLenderLoans();
    } else if (action === 'lendeeLoans') {
      fetchLendeeLoans();
    }
  }

  // Add event listeners to sidebar links
  const sidebarLinks = document.querySelectorAll('.sidebarClick');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', handleSidebarClick);
  });


  async function fetchPaymentHistory(loanId, paymentHistoryContainer, latestAmor) {
    try {
      const response = await fetch(`http://localhost:3000/service/paymentHistory/${loanId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment history');
      }

      const data = await response.json();


      displayPaymentHistory(data.paymentHistory, paymentHistoryContainer, latestAmor);


      return data.paymentHistory;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  }


  function displayPaymentHistory(paymentHistory, paymentHistoryContainer, latestAmor) {
    console.log('payments loading...');

    // Check if there are any payments in the history
    if (paymentHistory.length === 0) {
      paymentHistoryContainer.innerHTML = '<p>No payment history found.</p>';

      const scheduleTable = latestAmor;
      scheduleTable.innerHTML = '<p>None</p>';
      return;
    }

    // Retrieve the last payment object
    const lastPayment = paymentHistory[paymentHistory.length - 1];
    console.log(JSON.stringify(lastPayment.amortization_data.schedule));

    paymentHistory.forEach((payment, index) => {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      const scheduleTable = latestAmor;
      const tableBody = scheduleTable.querySelector('tbody');
      payment.amortization_data.schedule.forEach((item, index) => {
        const row = document.createElement('tr');

        const indexCell = document.createElement('td');
        indexCell.textContent = `Payment #` + (index + 1);
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

    });

    let html = '<h2>Payment History</h2> <ul>';
    paymentHistory.forEach((payment) => {
      var options = { year: "numeric", month: "2-digit", day: "2-digit" };
      const formattePaymentDate = new Date(payment.payment_date).toLocaleDateString("en-US", options);

      html += `
      <li id="payments">
        <p><strong>Payment ID:</strong> ${payment.payment_id}</p>
        <p><strong>Payment Amount:</strong> $${parseFloat(payment.payment_amount).toFixed(2)}</p>
        <p><strong>Payment Date:</strong> ${formattePaymentDate}</p>
        <p><strong>Payment Method:</strong> ${payment.payment_method}</p>
      </li>
    `;
    });
    html += '</ul>';

    paymentHistoryContainer.innerHTML = html;
  }


});