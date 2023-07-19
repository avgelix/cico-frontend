function showContent(option) {
    var activeLoans = document.getElementById("activeLoansContent");
  
    // Populate content based on the selected option
    switch (option) {
      case 'lender':
        activeLoans.innerHTML = "<h2>Option 1 Content</h2><p>This is the content for lender</p>";
        break;
      case 'lendee':
        activeLoans.innerHTML = "<h2>Option 2 Content</h2><p>This is the content for lendee</p>";
        break;
      default:
            contentDiv.innerHTML = "<h2>No Content Found</h2><p>Please select an option from the sidebar.</p>";
            break;
        }
      }
// Initially show Option 1 content on page load
showContent('lender');