document.addEventListener('DOMContentLoaded', () => {
    const activeLoans = document.getElementById('activeLoansContent');
  
    keycloak.init({ onLoad: 'login-required' }).then((auth) => {
      if (!auth) {
        console.error('Keycloak authentication failed.');
        return;
      }
      // Keycloak authentication succeeded, now fetch the token
      console.log(keycloak.token);
      fetchLenderLoans(); // Changed the function name to follow camelCase convention
    }).catch((error) => {
      console.error('Error initializing Keycloak:', error);
    });
  
    async function fetchLenderLoans() { // Changed the function name to follow camelCase convention
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
        console.log('almost');
        return data.loans; // Assuming the "loans" property contains the loan data in the response
      } catch (error) {
        console.error('Error fetching lender loans:', error);
        return []; // Return an empty array to handle the case when there are no loans found.
      }
    }

    async function fetchLendeeLoans() { // Changed the function name to follow camelCase convention
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
            console.log(`Loan #${index + 1}:`, loan);
          });
          displayLendeeLoans(data.loans);
          console.log('almost');
          return data.loans; // Assuming the "loans" property contains the loan data in the response
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
          // Assuming you have a function to format the start date
          const formattedStartDate = '...';
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
                <div>
                  <p><strong>Start Date:</strong> ${formattedStartDate}</p>
                </div>
              </div>
              <p><a id="viewLoan" href="activeloans.html">View more details</a></p>
            </div> `
          ;
        });
      }
      console.log(html);
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
          // Assuming you have a function to format the next payment due date
          const formattedNextPaymentDue = '...';
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
                  <p><strong>Next Payment Due:</strong> ${formattedNextPaymentDue}</p>
                </div>
              </div>
              <div class="loanActions">
                <p><a id="viewLoan" href="activeloans.html">View more details</a></p>
                <form action="makepayment.html">
                  <button id="makePaymentButton" type="submit">Make a payment</button>
                </form>
              </div>
            </div>
          `;
        });
      }
      console.log(lendeehtml);
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
  











/*document.addEventListener('DOMContentLoaded', () => {
    const activeLoans = document.getElementById('activeLoansContent');

    keycloak.init({ onLoad: 'login-required' }).then((auth) => {
        if (!auth) {
          console.error('Keycloak authentication failed.');
          return;
        }
        // Keycloak authentication succeeded, now fetch the token
        console.log(keycloak.token);
        fetchLenderLoans(); // Changed the function name to follow camelCase convention
      }).catch((error) => {
        console.error('Error initializing Keycloak:', error);
      });
      
        function fetchLenderLoans() { // Changed the function name to follow camelCase convention
        try {
          console.log('starting....');
          const response = fetch('http://localhost:3000/service/lenderLoans', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${keycloak.token}`, // Fix the token format
            }
          })
          console.log('so...');
      
          if (!response.ok) {
            const errorText = response.text();
            throw new Error(`Fetch error: ${response.status} - ${errorText}`);
          }
      
          const data = response.json();
          console.log("let's go");
          return data.loans; // Assuming the "loans" property contains the loan data in the response
        } catch (error) {
          console.error('Error fetching lender loans:', error);
          return []; // Return an empty array to handle the case when there are no loans found.
        }
      }
      
      async function showLenderLoans() {
        try {
          const loans = await fetchLenderLoans(); // Use the correct function name here
          if (loans && loans.length > 0) {
            displayLenderLoans(loans);
            console.log(loans);
          } else {
            console.log('No lender loans found.');
            // Display a message to the user indicating no lender loans found.
          }
        } catch (error) {
          console.error('Error fetching lender loans:', error);
          // Handle the error or display an error message to the user if needed
        }
      }
      

      async function showLendeeLoans() {
        try {
          const loans = await fetchLoans('lendee');
          if (loans && loans.length > 0) {
            displayLendeeLoans(loans);
          } else {
            console.log('No lendee loans found.');
            // Display a message to the user indicating no lendee loans found.
          }
        } catch (error) {
          console.error('Error fetching lendee loans:', error);
          // Handle the error or display an error message to the user if needed
        }
      }
    
    function displayLenderLoans(loans) {
      let html = ''
      if (loans.length === 0) {
        html = '<p>No lender loans found.</p>';
      } else {
        html =  `
        <div class="loan">
            <h2>Loan #${index + 1}</h2>
            <div class="loanInfo">
                <div>
                    <p><strong>Lendee:</strong> ${loan.lendee_user_id}</p>
                </div>
                <div>
                    <p><strong>Interest Rate:</strong> ${loan.annual_interest}%</p>
                </div>
                <div>
                    <p><strong>Principal:</strong> $${loan.loan_amount}</p>
                </div>
                <div>
                    <p><strong>Start Date:</strong> ${formattedStartDate}</p>
                </div>
            </div>
            <p><a id="viewLoan" href="activeloans.html">View more details</a></p>
      </div>
       `;
      }
      activeLoans.innerHTML = html;
    }
  
    function displayLendeeLoans(loans) {
      let html = '';
      if (loans.length === 0) {
        html = '<p>No lendee loans found.</p>';
      } else {
        html =  `       
        <div class="loan">
            <h2>Loan #${index + 1}</h2>
            <div class="loanInfo">
                <div>
                    <p><strong>Lender:</strong> ${loan.lender_user_id}</p>
                </div>
                <div>
                    <p><strong>Interest Rate:</strong> ${loan.annual_interest}%</p>
                </div>
                <div>
                    <p><strong>Principal:</strong> $${loan.loan_amount}</p>
                </div>
                <div>
                    <p><strong>Next Payment Due:</strong> </p>
                </div>
            </div>
            <div class="loanActions">';
                <p><a id="viewLoan" href="activeloans.html">View more details </a></p>';
                <form action="makepayment.html">';
                    <button id="makePaymentButton" type="submit">Make a payment</button>';
                </form>';
            </div>';
      </div>
      `;
      }
      activeLoans.innerHTML = html;
    }
  
    // Initially show Lender loans on page load
    showLenderLoans();
  
  });
  */