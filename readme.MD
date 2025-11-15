# CICO - Loan Management System

## Overview

CICO is a web-based loan management application that enables users to create, track, and manage loans between lenders and lendees. The application provides a user-friendly interface for creating new loans, viewing active loans from both lender and lendee perspectives, and generating detailed amortization schedules.

## Features

- **Create New Loans**: Input loan details including amount, interest rate, monthly payment, lender/lendee information, and start date
- **View Active Loans**: Separate views for lenders and lendees showing:
  - Total amount loaned/borrowed
  - Interest gained/saved to date
  - Individual loan details
- **Amortization Calculator**: Automatically generates detailed payment schedules showing:
  - Payment breakdown (principal vs. interest)
  - Remaining balance after each payment
  - Payment dates throughout the loan term
- **Loan Confirmation**: Review loan details and amortization table before finalizing
- **Success Confirmation**: Visual confirmation when a loan is successfully created

## Technologies Used

### Frontend

- **HTML5**: Semantic markup for structuring web pages
- **CSS3**: Custom styling for responsive and clean UI (screen.css)
- **JavaScript (Vanilla)**: Client-side scripting for:
  - Form handling and validation
  - Dynamic content rendering
  - Session storage management
  - Fetch API for backend communication
  - DOM manipulation

### Backend Integration

- **REST API**: Communicates with a backend service running on `http://localhost:3000`
- **JSON**: Data exchange format for loan creation and amortization calculations

### Data Storage

- **Session Storage**: Browser-based temporary storage for maintaining loan data across pages

## Project Structure

```
cico-frontend/
├── index.html              # Home page with navigation to create/view loans
├── createloan.html         # Loan creation form
├── createloan.js           # Form handling and data collection
├── loandetails.html        # Loan confirmation and amortization display
├── loandetails.js          # Backend API integration and table generation
├── activeloans.html        # View active loans (lender/lendee perspectives)
├── activeloans.js          # Dynamic content switching for loan views
├── loansuccess.html        # Success confirmation page
├── screen.css              # Global styles for the application
├── package.json            # Project metadata
└── readme.MD               # This file
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Backend API service running on `http://localhost:3000` (required for loan creation functionality)

### Running the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/avgelix/cico-frontend.git
   cd cico-frontend
   ```

2. Open `index.html` in your web browser, or serve the files using a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js http-server (install with: npm install -g http-server)
   http-server
   ```

3. Ensure the backend API is running on `http://localhost:3000` for full functionality

## Usage Flow

1. **Home Page**: Choose to create a new loan or view active loans
2. **Create Loan**: Fill in the loan details form with:
   - Loan amount
   - Interest rate
   - Lender and lendee names
   - Monthly payment amount
   - Repayment start date
3. **Confirm Details**: Review the loan details and generated amortization schedule
4. **Create Loan**: Finalize the loan creation
5. **Success**: Receive confirmation that the loan has been recorded

## API Endpoints

The application expects the following backend endpoint:

- **POST** `/dummy-backend/createLoan`
  - Request body: JSON object with loan parameters
  - Response: Loan details with calculated amortization schedule

## License

© 2023 TOCA. All rights reserved.

## Notes

This is a frontend application designed to work with a corresponding backend service. The backend must implement the loan calculation logic and amortization schedule generation.
