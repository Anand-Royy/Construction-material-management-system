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
  db.query(
    'insert into cartitems values(?,?,?,?,?,?)',
    [1, 'bricks', 9, 0, 'Bricks.png', 0],
    (err, results) => {
      if (err) throw err;
      else if (results.affectedRows > 0) {
        res.status(204).send();
      }
    }
  );
});

app.get('/addcartitem/2', (req, res) => {
  const id = req.params.id;
  db.query(
    'insert into cartitems values(?,?,?,?,?,?)',
    [2, 'cement', 9, 0, 'Cement.png', 0],
    (err, results) => {
      if (err) throw err;
      else if (results.affectedRows > 0) {
        res.status(204).send();
      }
    }
  );
});
app.get('/addcartitem/3', (req, res) => {
  const id = req.params.id;
  db.query(
    'insert into cartitems values(?,?,?,?,?,?)',
    [3, 'steel', 9, 0, 'Steel.png', 0],
    (err, results) => {
      if (err) throw err;
      else if (results.affectedRows > 0) {
        res.status(204).send();
      }
    }
  );
});
app.get('/addcartitem/4', (req, res) => {
  const id = req.params.id;
  db.query(
    'insert into cartitems values(?,?,?,?,?,?)',
    [4, 'sand', 9, 0, 'Sand.png', 0],
    (err, results) => {
      if (err) throw err;
      else if (results.affectedRows > 0) {
        res.status(204).send();
      }
    }
  );
});

app.get('/addcartitem/5', (req, res) => {
  const id = req.params.id;
  db.query(
    'insert into cartitems values(?,?,?,?,?,?)',
    [5, 'aggregate', 9, 0, 'Aggregate.png', 0],
    (err, results) => {
      if (err) throw err;
      else if (results.affectedRows > 0) {
        res.status(204).send();
      }
    }
  );
});

// var id = document.getElementById('objectID');
// console.log(id);

app.get('/cart', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM cartitems', (err, results) => {
    if (!err) {
      res.render('cart', { results, id: id });
    }
  });
});

app.post('/getquantity', async (req, res) => {
  const { id, quantity } = req.body;
  let count = 0;
  for (count = 0; count < id.length; count++) {
    await db.query(
      'UPDATE cartitems SET Quantity=Quantity+? WHERE id =?',
      [quantity[count], id[count]],
      (err, results) => {
        if (err) throw err;
      }
    );
  }
  db.query('UPDATE cartitems SET Total = Cost*Quantity', (err, results) => {
    if (err) throw err;
    else {
      db.query('SELECT * FROM `cartitems`', (err, rows) => {
        if (err) throw err;
        else res.render('checkout', { rows });
      });
    }
  });
});

app.post('/deletecartitem/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM `cartitems` WHERE id=?', [id], (err, results) => {
    if (err) throw err;
    else res.redirect('/cart');
  });
});

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
