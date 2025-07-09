const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // ✅ Built-in JSON body parser
app.use(express.urlencoded({ extended: true })); // ✅ For form submissions

const bookRoutes = require('./routes/book');
const contactRoutes = require('./routes/contact');
const trackRoutes = require('./routes/track');
const adminRoutes = require('./routes/admin');

app.use('/api/book', bookRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/track', trackRoutes);
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
