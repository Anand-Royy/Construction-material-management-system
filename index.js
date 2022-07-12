const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//configuration
app.set('view engine', 'hbs');
app.set('views', './view');
app.use(express.static(__dirname + '/public'));

//Create connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'DBMS_Project',
});

//Connect
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySql Connected...');
});
//Create DB
app.get('/', (req, res) => {
  res.render('index');
});

// app.get('/createdb', (req, res) => {
//   let sql = 'CREATE DATABASE DBMS_Project';
//   db.query(sql, (err, result) => {
//     if (err) throw err;
//     console.log(result);
//     res.send('Database created...');
//   });
// });

// //Create table
// app.get('/createsitetable', (req, res) => {
//   let sql =
//     'CREATE TABLE sites(id int AUTO_INCREMENT, name VARCHAR(255), address VARCHAR(255), site_date int, brickno int, cementno int, steelno int, sandno int, aggregteno int, PRIMARY KEY (id))';
//   db.query(sql, (err, result) => {
//     if (err) throw err;
//     console.log(result);
//     res.send('Posts table created');
//   });
// });

// app.get('/', (req, res) => {
//   res.render('index');
// });

app.get('/addsite', (req, res) => {
  // fetching data from form

  const {
    id,
    name,
    address,
    date,
    brickno,
    cementno,
    steelno,
    sandno,
    aggregateno,
  } = req.query;

  // Sanitization XSS...
  let qry = 'select * from sites where id=?';
  db.query(qry, [id], (err, results) => {
    if (err) throw err;
    else {
      if (results.length > 0) {
        res.render('index', { checkmesg: true });
      } else {
        // insert query
        let qry2 = 'insert into sites values(?,?,?,?,?,?,?,?,?)';
        db.query(
          qry2,
          [
            id,
            name,
            address,
            date,
            brickno,
            cementno,
            steelno,
            sandno,
            aggregateno,
          ],
          (err, results) => {
            if (err) throw err;
            else if (results.affectedRows > 0) {
              res.render('index', { mesg: true, data: results });
            }
          }
        );
      }
    }
  });
});

app.listen('3000', () => {
  console.log('Server started on port 3000');
});
