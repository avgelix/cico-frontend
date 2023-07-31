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
                    <h2>Loan #1</h2>
                    <div class="loanInfo">
                        <div>
                            <p class="bold">Lendee</p>
                            <p>...</p>
                        </div>

                        <div>   
                            <p class="bold">Interest Rate</p>
                            <p>...</p>
                        </div>

                        <div>
                            <p class="bold">Principal</p>
                            <p>...</p>
                        </div>
                    </div>
                    <p><a id="viewLoan" href="activeloans.html">View more details ></a></p>
                </div>
                <div class="loan">
                    <h2>Loan #1</h2>
                    <div class="loanInfo">
                        <div>
                            <p class="bold">Lendee</p>
                            <p>...</p>
                        </div>
                        
                        <div>   
                            <p class="bold">Interest Rate</p>
                            <p>...</p>
                        </div>

                        <div>
                            <p class="bold">Principal</p>
                            <p>...</p>
                        </div>
                    </div>
                    <p><a id="viewLoan" href="activeloans.html">View more details ></a></p>
                </div>
            `;
            break;
        case 'lendee':
            activeLoans.innerHTML = `
                <div class="activeLoansHeader">
                    <div class="headerContent"> <h2>Total To Pay:</h2> <p> $6000</p></div>
                    <div class="headerContent"> <h2>Interest Saved to Date:</h2> <p> $1000</p></div>
                </div>
                
                <div class="loan">
                    <h2>Loan #1</h2>
                    <div class="loanInfo">
                        <div>
                            <p class="bold">Lender</p>
                            <p>...</p>
                        </div>
                        
                        <div>   
                            <p class="bold">Interest Rate</p>
                            <p>...</p>
                        </div>

                        <div>
                            <p class="bold">Principal</p>
                            <p>...</p>
                        </div>

                        <div>
                            <p class="bold">Next Payment Due</p>
                            <p>Date: mm/dd/yy</p>
                            <p>Amount: $</p>
                        </div>
                    </div>
                    <div class="loanActions">
                        <p><a id="viewLoan" href="activeloans.html">View more details > </a></p>
                        <form action="makepayment.html">
                            <button id="makePaymentButton" type="submit">Make a payment</button>
                        </form>
                    </div>
                </div>
                <div class="loan">
                    <h2>Loan #1</h2>
                    <div class="loanInfo">
                        <div>
                            <p class="bold">Lender</p>
                            <p>...</p>
                        </div>
                        
                        <div>   
                            <p class="bold">Interest Rate</p>
                            <p>...</p>
                        </div>

                        <div>
                            <p class="bold">Principal</p>
                            <p>...</p>
                        </div>

                        <div>
                            <p class="bold">Next Payment Due</p>
                            <p>Date: mm/dd/yy</p>
                            <p>Amount: $</p>
                        </div>
                    </div>

                    <div class="loanActions">
                        <p><a id="viewLoan" href="activeloans.html">View more details > </a></p>
                        <form action="makepayment.html">
                            <button id="makePaymentButton" type="submit">Make a payment</button>
                        </form>
                    </div>
                </div>
            `;
            break;
      default:
            contentDiv.innerHTML = "<h2>No Content Found</h2><p>Please select an option from the sidebar.</p>";
            break;
        }
      }

// Initially show Lender content on page load
showContent('lender');