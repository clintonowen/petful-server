'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { PORT, CLIENT_ORIGIN } = require('./config');
// const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');
const { Queue, peek } = require('./model/queue');
const catData = require('./db/cats');
const dogData = require('./db/dogs');

const app = express();

let catQ;
let dogQ;

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.get('/api', (req, res, next) => {
  catQ = new Queue();
  catData.forEach(cat => {
    catQ.enqueue(cat);
  });

  dogQ = new Queue();
  dogData.forEach(dog => {
    dogQ.enqueue(dog);
  });
  
  const petInfo = [peek(catQ), peek(dogQ)];
  if (petInfo) {
    res.json(petInfo);
  } else {
    next();
  }
});

app.get('/api/cat', (req, res, next) => {
  const catInfo = peek(catQ);
  if (catInfo) {
    res.json(catInfo);
  } else {
    next();
  }
});

app.delete('/api/cat', (req, res, next) => {
  if (catData) {
    catQ.dequeue();
    res.sendStatus(204);
  } else {
    next();
  }
});

app.get('/api/dog', (req, res, next) => {
  const dogInfo = peek(dogQ);
  if (dogInfo) {
    res.json(dogInfo);
  } else {
    next();
  }
});

app.delete('/api/dog', (req, res, next) => {
  if (dogData) {
    dogQ.dequeue();
    res.sendStatus(204);
  } else {
    next();
  }
});

// Default 404 error
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Catch-all error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  // dbConnect();
  runServer();
}

module.exports = { app };
