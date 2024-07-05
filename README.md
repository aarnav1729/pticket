# Feedback Tool

## Introduction
This web application allows departments to submit and track feedback. It includes features for creating feedback tickets, viewing pending and resolved tickets, and sending automated email notifications.

## Features
- Submit feedback with attachments
- View feedback by department or status
- Automated weekly email notifications for unresolved issues
- Immediate email notifications upon ticket creation

## Installation

### Prerequisites
- Node.js
- MongoDB

### Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/feedback-tool.git
    cd feedback-tool
    ```
2. Install dependencies for both frontend and backend:
    ```bash
    cd backend
    npm install
    cd ../frontend
    npm install
    ```

3. Set up environment variables:
    - Create a `.env` file in the `backend` directory with the following contents:
      ```env
      MONGODB_URI=your_mongo_connection_string
      EMAIL_USER=your_email@example.com
      EMAIL_PASS=your_email_password
      ```

4. Start the application:
    - Backend:
      ```bash
      cd backend
      npm start
      ```
    - Frontend:
      ```bash
      cd frontend
      npm start
      ```

## Usage
1. **Submitting Feedback**: Go to the feedback form, fill in the details, and submit.
2. **Viewing Feedback**: Navigate to the appropriate view (Admin, Managerial) to see pending and resolved tickets.
3. **Email Notifications**: The system will automatically send emails as configured.

## Demo
https://github.com/aarnav1729/pticket/assets/72580375/06b30549-9b4c-4b2b-8630-aed439e24fc8


## Contribution
If you would like to contribute, please fork the repository and use a feature branch. Pull requests are welcome.

## License
[MIT License](LICENSE)
