function showContent(option) {
    var activeLoans = document.getElementById("activeLoansContent");
  
    // Populate content based on the selected option
    switch (option) {
        case 'lender':
            activeLoans.innerHTML = `
                <div class="activeLoansHeader">
                    <div class="headerContent"><h2>Total Loaned:</h2> <p> $4000</p></div>
                    <div class="headerContent"><h2>Interest Gained to Date:</h2> <p> $200</p></div>
                </div>

                <div class="loan">
                    <h2>Loan 1</h2>
                    <p>Loan details</p>
                </div>
                <div class="loan">
                    <h2>Loan 2</h2>
                    <p>Loan details</p>
                </div>
            `;
            break;
        case 'lendee':
            activeLoans.innerHTML = `
                <div class="activeLoansHeader">
                    <div class="headerContent"> <h2>Total To Pay:</h2> <p> $6000</p></div>
                    <div class="headerContent"> <h2>Interest Saved to Date:</h2> <p> $1000</p></div>
                </div>
                <div class="grid-item loan">
                    <h2>Loan 1</h2>
                    <p>Loan details</p>
                </div>
                <div class="grid-item loan">
                    <h2>Loan 2</h2>
                    <p>Loan details</p>
                </div>
            `;
            break;
      default:
            contentDiv.innerHTML = "<h2>No Content Found</h2><p>Please select an option from the sidebar.</p>";
            break;
        }
      }
// Initially show Option 1 content on page load
showContent('lender');