const express = require('express');
var cors = require('cors');
const fs = require('node:fs');
const { get } = require('node:http');

//configuration
const app = express();
const port = 3000;

//it should db conn, use file instead here
const db = 'scoredb.json';

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

const products = [];

app.get('/listScore', isAuthorized, (req, res) => {
    getScore(db);  //get data from file or db
    derepeatedScore(products); //de repetation of score
    sortScore(products);    //sort score

    res.json(products);
});

app.post('/addScore', (req, res) => {
    const content = req.body || 'test';
    try{
        const newScore = {
            id: content.id || null,
            name: content.name || null,
            scoreMark: content.scoreMark || 0
        };
        console.log(newScore);
        products.push(newScore);

        fs.writeFile(db, JSON.stringify(products), err => {
            if (err) {
              console.error(err);
            } else {
                res.json({result:'success',message:'Score Saved'});
            }
        });
    } catch (err) {
        console.error(err);
        res.json({result:'error', message:'Score not Saved'});
    }

    
});

app.listen(port, () => console.log(`Example app listening on port ${port}! http://localhost:${port}/`));


function isAuthorized(req, res, next) {
    const authHeader = req.headers.authorization;
 
    if (!authHeader || authHeader !== 'secretpassword') {
      return res.status(401).send('Unauthorized: Access Denied');
    }
 
    next();
  }

  function derepeatedScore(arr){
    const unique = arr.filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
    return unique;
  }

  function sortScore(arr){
    arr.sort(function(a,b){
        return b.scoreMark - a.scoreMark;
    });
  }

  function getScore(db){
    try {
        const data = fs.readFileSync(db, 'utf8');
        products.push(...JSON.parse(data));
    } catch (err) {
        console.error(err);
    }
  }