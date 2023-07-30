let debounceTimer;
let initialValue;
let inputText;
var amorTable = document.getElementById('paymentAmort');

    function displayDetails() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(doSomething, 1500); // Adjust the time (in milliseconds) as needed
    }

    function doSomething() {
        // This function will be called after the user stops typing for 500 milliseconds
        inputText = document.getElementById('payment').value;
        console.log("User stopped typing. Input value: " + inputText);

        initialValue = inputText;

        // Display Amor Table
        if (inputText !== '') {
            // Input value is not empty
            amorTable.classList.remove('hidden');
            console.log('Input value is not empty:', inputText);
          } else {
            // Input value is empty
            console.log('Input value is empty');
          }
        }

    function hideAmort() {
        inputText = document.getElementById('payment').value;
        if (inputText !== initialValue) {
            amorTable.classList.add('hidden'); // Hide the amorTable if the input value matches the initial value
        }
    }
    
// Assuming the 'payment' input field is triggering the displayDetails function
const paymentInput = document.getElementById('payment');
paymentInput.addEventListener('input', hideAmort);
paymentInput.addEventListener('input', displayDetails);



   
    
    
    
    
    
    
        