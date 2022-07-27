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
        let qry2 =
          'INSERT INTO `sites`(`id`, `name`, `address`, `site_date`) VALUES (?,?,?,?)';
        db.query(qry2, [id, name, address, date], (err, results) => {
          if (err) throw err;
          db.query(
            'INSERT INTO `estimates`(`SID`, `Bricks`, `Cement`, `Steel`, `Sand`, `Aggregate`) VALUES (?,?,?,?,?,?)',
            [id, brickno, cementno, steelno, sandno, aggregateno],
            (err, rows) => {
              if (err) throw err;
              else if (results.affectedRows > 0) {
                res.redirect('/');
              }
            }
          );
        });
      }
    }
  });
});

app.get('/viewsite/:id', (req, res) => {
  const id = req.params.id;
  db.query(
    'SELECT * FROM sites join estimates on sites.id=estimates.sid WHERE sites.id =?',
    [id],
    (err, sites) => {
      if (!err) {
        console.log(sites);
        res.render('page1', { sites });
      }
    }
  );
});

app.get('/addcartitem/1/:id', (req, res) => {
  const id = req.params.id;
  db.query(
    'insert into cartitems values(?,?,?,?,?,?,?)',
    [id, 1, 'bricks', 9, 0, 'Bricks.png', 0],
    (err, results) => {
      if (err) throw err;
      else if (results.affectedRows > 0) {
        res.status(204).send();
      }
    }
  );
});

app.get('/addcartitem/2/:id', (req, res) => {
  const id = req.params.id;
  db.query(
    'insert into cartitems values(?,?,?,?,?,?,?)',
    [id, 2, 'cement', 9, 0, 'Cement.png', 0],
    (err, results) => {
      if (err) throw err;
      else if (results.affectedRows > 0) {
        res.status(204).send();
      }
    }
  );
});
app.get('/addcartitem/3/:id', (req, res) => {
  const id = req.params.id;
  db.query(
    'insert into cartitems values(?,?,?,?,?,?,?)',
    [id, 3, 'steel', 9, 0, 'Steel.png', 0],
    (err, results) => {
      if (err) throw err;
      else if (results.affectedRows > 0) {
        res.status(204).send();
      }
    }
  );
});
app.get('/addcartitem/4/:id', (req, res) => {
  const id = req.params.id;
  db.query(
    'insert into cartitems values(?,?,?,?,?,?,?)',
    [id, 4, 'sand', 9, 0, 'Sand.png', 0],
    (err, results) => {
      if (err) throw err;
      else if (results.affectedRows > 0) {
        res.status(204).send();
      }
    }
  );
});

app.get('/addcartitem/5/:id', (req, res) => {
  const id = req.params.id;
  db.query(
    'insert into cartitems values(?,?,?,?,?,?,?)',
    [id, 5, 'aggregate', 9, 0, 'Aggregate.png', 0],
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

app.get('/cart/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  db.query('SELECT * FROM cartitems', (err, results) => {
    if (!err) {
      db.query('SELECT sid FROM `cartitems` LIMIT 1', (req, sid) => {
        res.render('cart', { results, sid });
      });
    }
  });
});

app.post('/getquantity/:id', async (req, res) => {
  const sid = req.params.id;
  console.log(sid);
  const { id, quantity } = req.body;
  let count = 0;
  let items = ['brickno', 'cementno', 'steelno', 'sandno', 'aggregteno'];
  for (count = 0; count < id.length; count++) {
    await db.query(
      'UPDATE cartitems SET Quantity=Quantity+? WHERE id =?',
      [quantity[count], id[count]],
      (err, results) => {
        if (err) throw err;
      }
    );
    db.query(
      'update sites set ?? = ? where id=?',
      [items[id[count] - 1], quantity[count], sid],
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
        else {
          db.query('SELECT sid FROM `cartitems` LIMIT 1', (req, sid) => {
            res.render('checkout', { rows, sid });
          });
        }
      });
    }
  });
});

app.get('/buy/:id', (req, res) => {
  const sid = req.params.id;
  db.query('DELETE FROM `cartitems`', (err, rows) => {
    if (err) throw err;
    else {
      res.redirect('/viewsite/' + sid);
    }
  });
});

app.post('/deletecartitem/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM `cartitems` WHERE id=?', [id], (err, results) => {
    if (err) throw err;
    else res.redirect('/cart/' + id);
  });
});

// app.get('/addestimate',(req,res)=>{
//   res.redirect('/')
// })

app.get('/addestimate', (req, res) => {
  const { id, brickno, cementno, steelno, sandno, aggregateno } = req.query;
  console.log(req.query);
  db.query(
    'UPDATE `estimates` SET `Bricks`= ?,`Cement`= ? ,`Steel`= ? ,`Sand`= ? ,`Aggregate`= ?  WHERE SID = ?',
    [brickno, cementno, steelno, sandno, aggregateno, id],
    (err, results) => {
      if (err) throw err;
      else res.redirect('/viewsite/' + id);
    }
  );
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
