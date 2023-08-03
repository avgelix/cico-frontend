document.addEventListener('DOMContentLoaded', () => {
  const activeLoans = document.getElementById('activeLoansContent');

  keycloak.init({ onLoad: 'login-required' }).then((auth) => {
    if (!auth) {
      console.error('Keycloak authentication failed.');
      return;
    }
    // Keycloak authentication succeeded, now fetch the token
    console.log(keycloak.token);
    fetchLenderLoans(); 
  }).catch((error) => {
    console.error('Error initializing Keycloak:', error);
  });

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
      console.log('so...');

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
          console.log(`Loan #${index + 1}:`, loan.amortization_data);
          console.log(`Loan #${index + 1}:`, loan.amortization_data.balance);
        
          // Use let to declare the loanIndex, loanBalance, loanInterest, and loanLender variables
          let loanIndex = index + 1;
          let loanBalance = loan.loan_amount;
          let loanInterest = loan.annual_interest;
          let loanLender = loan.lender_full_name;
        
          console.log(loanIndex, loanBalance, loanInterest, loanLender);
        
          // Store the request data in sessionStorage
          sessionStorage.setItem('index', Number(loanIndex));
          sessionStorage.setItem(`balance${loanIndex}`, loanBalance);
          sessionStorage.setItem(`interest${loanIndex}`, loanInterest);
          sessionStorage.setItem(`lender${loanIndex}`, loanLender);

      });
      displayLendeeLoans(data.loans);
      console.log('almost');
      return data.loans; // 
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
      html += `
            <div class="activeLoansHeader">
                    <div class="headerContent"><h2>Total Loaned:</h2> <p> $4000</p></div>
                    <div class="headerContent"><h2>Interest Gained to Date:</h2> <p> $200</p></div>
                </div>
                `;
      loans.forEach((loan, index) => {
        const amortization_data = loan.amortization_data;
        console.log('amortization_data:', JSON.stringify(amortization_data, null, 2));
        console.log(amortization_data);
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
                  <p><strong>Principal:</strong> $${loan.loan_amount}</p>
                </div>
              </div>
              <p><a id="viewLoan" href="#" onclick="loandetails.classList.remove('hidden')">View more details</a></p>
            </div> 

            <div class="hidden" id="loandetails">
            <p><a id="X" href="#" onclick="document.getElementById('loandetails').classList.add('hidden')">X</a></p>
                <div>
                  <p><strong>Lendee:</strong> ${loan.lendee_full_name}</p>
                </div>
                <div>
                  <p><strong>Interest Rate:</strong> ${loan.annual_interest}%</p>
                </div>
                <div>
                  <p><strong>Principal:</strong> $${loan.loan_amount}</p>
                </div>
            </div> `
          ;
      });
    }
    activeLoans.innerHTML = html;

  }

  function displayLendeeLoans(loans) {
    let lendeehtml = '';
    if (loans.length === 0) {
      lendeehtml = ' <div> <p>No lendee loans found.</p></div>';
    } else {
      lendeehtml += `
        <div class="activeLoansHeader">
            <div class="headerContent"> <h2>Total To Pay:</h2> <p> $6000</p></div>
            <div class="headerContent"> <h2>Interest Saved to Date:</h2> <p> $1000</p></div>
        </div>`;
      loans.forEach((loan, index) => {
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
                  <p><strong>Principal:</strong> $${loan.loan_amount}</p>
                </div>
                <div>
                  <p><strong>Next Payment Due:</strong> ...</p>
                </div>
              </div>
              <div class="loanActions">
              <p><a id="viewLoan" href="#0" onclick="document.getElementById('loandeets${index + 1}').classList.remove('hidden')">View more details</a></p>
                <form action="makepayment.html">
                  <button id="makePaymentButton" data-loan-index="${index + 1}" type="submit">Make a payment</button>
                </form>
              </div>
            </div>

            <div class="" id="loandeets${index + 1}">
            <p><a id="X" href="#0"  onclick="document.getElementById('loandeets${index + 1}').classList.add('hidden')">X</a></p>
              <div>
                <p><strong>Lendee:</strong> ${loan.lendee_full_name}</p>
              </div>
              <div>
                <p><strong>Interest Rate:</strong> ${loan.annual_interest}%</p>
              </div>
              <div>
                <p><strong>Principal:</strong> $${loan.loan_amount}</p>
              </div>
          </div> `
          ;
      });
    }
    activeLoans.innerHTML = lendeehtml;


  }

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

  // Initially show Lender loans on page load
  fetchLenderLoans();

});