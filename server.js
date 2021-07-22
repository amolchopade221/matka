const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app');
const hostname = '0.0.0.0';

mongoose
.connect(process.env.DATABASE_SERVER, {
// mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

.then(() => console.log('DB Connection Successful!'));

const port = process.env.PORT || 3000;

app.listen(port,() => {
    console.log(`app running on port ${port}...`);
});