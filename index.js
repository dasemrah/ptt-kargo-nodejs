const express = require('express');
const app = express();
const soapRouter = require('./routes/soapRouter');

// SOAP Router'ını kullan
app.use(express.json()); // JSON verilerini parse etmek için
app.use(express.urlencoded({ extended: true })); // URL-encoded verileri parse etmek için

app.use(soapRouter);

// Ana uygulamayı dinle
const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});