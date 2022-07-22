const express = require('express');
const exphbs = require('express-handlebars');
const mysql = require('mysql');
const app = express();
const fileupload = require('express-fileupload');
// app.engine(
//   '.hbs',
//   exphbs.engine({ extname: '.hbs', defaultLayout: '', layoutsDir: '' })
// );

app.use(fileupload());

//configuration
app.set('view engine', 'hbs');
app.set('views', './view');
app.use(express.static(__dirname + '/public'));
app.use(express.static('upload'));
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
app.get('', (req, res) => {
  db.query('SELECT * FROM sites', (err, rows) => {
    if (!err) {
      res.render('index', { rows });
    }
  });
});
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
    img,
  } = req.query;

  // Sanitization XSS...
  let qry = 'select * from sites where id=?';
  db.query(qry, [id], (err, results) => {
    if (err) throw err;
    else {
      if (results.length > 0) {
        res.redirect('/');
      } else {
        // insert query
        let qry2 = 'insert into sites values(?,?,?,?,?,?,?,?,?,?)';
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
            img,
          ],
          (err, results) => {
            if (err) throw err;
            else if (results.affectedRows > 0) {
              res.redirect('/');
            }
          }
        );
      }
    }
  });
});

app.get('/viewsite/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM sites WHERE id =?', [id], (err, rows) => {
    if (!err) {
      res.render('page1', { rows });
    }
  });
});

app.get('/addcartitem/1', (req, res) => {
  const id = req.params.id;
  console.log(id);
  db.query('insert into cartitems values(?,?,?)', ['bricks',9,0], (err, results) => {
    if (err) throw err;
    else if (results.affectedRows > 0) {
      res.status(204).send();
    }
  });
});

app.get('/addcartitem/2', (req, res) => {
  const id = req.params.id;
  console.log(id);
  db.query('insert into cartitems values(?,?,?)', ['cement',9,0], (err, results) => {
    if (err) throw err;
    else if (results.affectedRows > 0) {
      res.status(204).send();
    }
  });
});
app.get('/addcartitem/3', (req, res) => {
  const id = req.params.id;
  console.log(id);
  db.query('insert into cartitems values(?,?,?)', ['steel',9,0], (err, results) => {
    if (err) throw err;
    else if (results.affectedRows > 0) {
      res.status(204).send();
    }
  });
});
app.get('/addcartitem/4', (req, res) => {
  const id = req.params.id;
  console.log(id);
  db.query('insert into cartitems values(?,?,?)', ['sand',9,0], (err, results) => {
    if (err) throw err;
    else if (results.affectedRows > 0) {
      res.status(204).send();
    }
  });
});

app.get('/addcartitem/5', (req, res) => {
  const id = req.params.id;
  console.log(id);
  db.query('insert into cartitems values(?,?,?)', ['aggregate',9,0], (err, results) => {
    if (err) throw err;
    else if (results.affectedRows > 0) {
      res.status(204).send();
    }
  });
});

app.get('/cart',(req,res)=>{
  res.render('cart');
})

// app.post('/addsiteimg', (req, res) => {
//   let sampleFile;
//   let uploadPath;
//   const id = req.params.id;
//   console.log(id);
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).send('No files were uploaded');
//   }

//   sampleFile = req.files.sampleFile;
//   uploadPath = __dirname + '/upload/' + sampleFile.name;
//   console.log(sampleFile);
//   sampleFile.mv(uploadPath, function (err) {
//     if (err) return res.status(500).send(err);
//     res.send('File uploaded');
//     db.query(
//       'update sites set site-img = ? where id = ?',
//       [sampleFile.name, id],
//       (err, rows) => {
//         if (!err) {
//           res.redirect('/');
//         } else {
//           console.log(err);
//         }
//       }
//     );
//   });
// });

app.listen('3000', () => {
  console.log('Server started on port 3000');
});
