# Azure AI Text-to-Speech Documentation

## Project Overview
This project uses Azure AI Text-to-Speech services to convert text into high-quality audio files. The server is hosted on a DigitalOcean droplet, allowing users to send text via an API and receive an MP3 file in return.

---

## Features
- Converts user-provided text into audio using Azure AI Text-to-Speech.
- Supports multiple voices and languages (default: `en-US-JennyNeural`).
- Outputs audio in MP3 format with 16kHz quality.
- Hosted on a publicly accessible DigitalOcean server.
- Secure handling of API keys with environment variables.
- Continuous server uptime using PM2.

---

## Prerequisites
1. Node.js (v18 or above).
2. npm (Node Package Manager).
3. Azure subscription with Text-to-Speech service enabled.
4. DigitalOcean account.
5. GitHub repository for version control.
6. Postman or any other API testing tool to test the endpoints.

---

## Setup Instructions

### 1. Clone the Repository

```bash
cd ~
git clone https://github.com/Tanvi09Garg/ITIS-final-project.git
cd ITIS-final-project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project directory:

```
SPEECH_KEY=your-azure-speech-key
SPEECH_REGION=your-region
```

Replace `your-azure-speech-key` with your Azure Text-to-Speech API key and `your-region` with the region you selected while generating keys and Endpoint.

### 4. Start the Server

Start the server using PM2:

```bash
pm2 start app.js --name text-to-speech
pm2 save
```

The server will be running on port `3000`.

---

## API Usage

### Endpoint
`POST http://<your-server-ip>:3000/synthesize`

### My Endpoint
`POST http://159.65.231.180:3000/synthesize`

### Request Body
Send a JSON payload:

```json
{
  "text": "Your text here."
}
```

### Response
The server returns an MP3 file for download on postman which you can download by selecting "Save Response".

## Using Postman

### To run my URL to the live API:

- Open Postman and create a new request.

- Set the request type to POST and the URL to http://159.65.231.180:3000/synthesize.

- Go to the Body tab and select raw.

- Choose JSON from the dropdown menu.

- Enter the JSON payload, e.g.,

{
  "text": "Hello, this is a test message."
}

- Click Send.

- Download the generated MP3 file from the response.

### To run your URL:

- Open Postman and create a new request.

- Set the request type to POST and the URL to http://your-server-ip:3000/synthesize.
- Go to Headears
- Uncheck the default Content-Type and generate a new one.
- In place of key pass "Content-Type" and for value pass "application/json"

- Go to the Body tab and select raw.

- Choose JSON from the dropdown menu.

- Enter the JSON payload, e.g.,

{
  "text": "Hello, this is a test message."
}

- Click Send.

- Download the generated MP3 file from the response.

---

## Security Measures
- API keys are stored in environment variables and not exposed in the code.
- Use `.gitignore` to exclude sensitive files like `.env` and `node_modules`.
- Ensure server access is secured with SSH keys.

---

## Error Handling
- **400 Bad Request**: Missing or invalid text in the request body.
- **500 Internal Server Error**: Issues during synthesis (e.g., timeout or invalid API key).

---

## Deployment on DigitalOcean

### 1. Create a Droplet
1. Log in to your DigitalOcean account.
2. Create a new droplet (CentOS preferred).

### 2. Connect to the Server
```bash
ssh root@<your-server-ip>
```

### 3. Install Node.js
```bash
yum install -y nodejs
```

### 4. Clone Repository and Start Server
Follow the steps mentioned in **Setup Instructions**.

---

## Documentation and Testing
### ReadMe File
Ensure your GitHub repository contains a detailed `README.md` file with:
- Project description.
- Setup instructions.
- API usage examples.
- Contribution guidelines.

### Testing
- Use Postman to test the API endpoint.
- Verify responses for various inputs and edge cases.

---

## References
- [Azure AI Text-to-Speech Documentation](https://azure.microsoft.com/en-us/products/ai-services/ai-speech/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [DigitalOcean Droplet Setup Guide](https://www.digitalocean.com/docs/)

---

Thank you for using this Text-to-Speech API!

