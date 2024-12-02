# PTT Kargo API Integration

This application allows you to create, cancel, and track shipments for **PTT Kargo**.

---

## Requirements

- **Static IP Address:** It is recommended to register your server's **static IP address** with PTT Kargo for a more reliable connection when making API calls.
- **API Credentials:** Add the credentials (customer number and password) provided by PTT Kargo to the `soapController` file.

---

## API Configuration

You need to add the API credentials provided by PTT Kargo to the `soapController` file.

Below is a sample configuration:

```javascript
const config = {
    musterNo: 'your_musterino', // Customer number provided by PTT Kargo
    sifre: 'your_password' // Password provided by PTT Kargo
}
