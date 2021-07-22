const express = require('express');
const app = express();
const userRouter = require('./routes/usersRoute');
const globalErrorHandler = require('./controllers/errorController');

app.use(express.json());

app.use('/api/v1/users/', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this serve!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;