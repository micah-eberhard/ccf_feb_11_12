var express = require('express');
var router = express.Router();
var knex = require('knex')({
  client: 'pg',
  connection: 'postgress://localhost:5432/ccfBooks'
});


function getRandImg(data)
{
  console.log(data);
  return data[Math.floor(Math.random()*data.length)].img_url;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var author = '';
  var book = '';
  console.log("BeforeKnex");

  knex('authors').select('img_url')
  .then(function(data,err){
    if(err){
      console.log(err);
      res.render('error', {error:err})
    }
    else {
      author = getRandImg(data);
      knex('books').select('img_url')
      .then(function(data2,err2){
        if(err){
          console.log(err2);
          res.render('error', {error:err})
        }
        else {
          book = getRandImg(data2);
          res.render('index', { title: 'Main', author_img : author, book_img : book });
        }
      });
    }
  });

});

router.get('/books', function(req, res, next) {
  var author = '';
  var book = '';
  console.log("BeforeKnex");

  knex('books')
  .then(function(data,err){
    if(err){
      console.log(err);
      res.render('error', {title:'Error',error:err})
    }
    else {
      var count = 0;
      for(var i=0; i< data.length; i++)
      {
        //data[i].authors = [];
        knex.raw("SELECT * FROM author_books INNER JOIN authors on author_books.author_id = authors.id WHERE author_books.book_id = '" + data[i].id +"'")
        .then(function(dataA,err){
          count++;
          if(err){
            console.log(err);
            res.render('error', {title:'Error',error:err})
          }
          else {
            for(var k=0; k< data.length; k++)
            {
              if(dataA && data[k].id === dataA.rows[0].book_id)
              {
                data[k].authors = dataA.rows;
                if(count === data.length)
                {
                  //console.log(data);
                  res.render('books', {type:'none', title:'Books', books:data});
                }
              }
            }

          }
        })
      }
    }
  });
});

router.get('/books/:id', function(req, res, next) {
  var author = '';
  var book = '';
  console.log("BeforeKnex");

  knex('books').where({id:req.params.id})
  .then(function(data,err){
    if(err){
      console.log(err);
      res.render('error', {title:'Error',error:err})
    }
    else {
      var count = 0;
      for(var i=0; i< data.length; i++)
      {
        //data[i].authors = [];
        knex.raw("SELECT * FROM author_books INNER JOIN authors on author_books.author_id = authors.id WHERE author_books.book_id = '" + data[i].id +"'")
        .then(function(dataA,err){
          count++;
          if(err){
            console.log(err);
            res.render('error', {title:'Error',error:err})
          }
          else {
            for(var k=0; k< data.length; k++)
            {
              if(dataA && data[k].id === dataA.rows[0].book_id)
              {
                data[k].authors = dataA.rows;
                if(count === data.length)
                {
                  //console.log(data);
                  res.render('books', {type:'none', title:'Books', books:data});
                }
              }
            }

          }
        })
      }
    }
  });
});

router.get('/books/:id/edit', function(req, res, next) {
  var author = '';
  var book = '';
  console.log("BeforeKnex");

  knex('books').where({id:req.params.id})
  .then(function(data,err){
    if(err){
      console.log(err);
      res.render('error', {title:'Error',error:err})
    }
    else {
      var count = 0;
      for(var i=0; i< data.length; i++)
      {
        //data[i].authors = [];
        knex.raw("SELECT * FROM author_books INNER JOIN authors on author_books.author_id = authors.id WHERE author_books.book_id = '" + data[i].id +"'")
        .then(function(dataA,err){
          count++;
          if(err){
            console.log(err);
            res.render('error', {title:'Error',error:err})
          }
          else {
            for(var k=0; k< data.length; k++)
            {
              if(dataA && data[k].id === dataA.rows[0].book_id)
              {
                data[k].authors = dataA.rows;
                if(count === data.length)
                {
                  knex('authors').select('first_name', 'last_name')
                  .then(function(authList, err){
                    //console.log(authList);
                    res.render('books', {type:'edit', title:'Books', books:data, authList:authList});
                  });
                }
              }
            }

          }
        })
      }
    }
  });
});
router.post('/books/:id/edit', function(req, res, next) {
  delete req.body.button;
  console.log(req.body);

  knex('books').update(req.body).where({id:req.params.id})
  .then(function(data,err){
    if(!err)
    {
      res.redirect('/books/'+req.params.id);
    }
    else {
      res.render('error', {title:'Error',error:err});
    }
  })
});
router.get('/books/:id/delete', function(req, res, next) {
  var author = '';
  var book = '';
  console.log("BeforeKnex");

  knex('books').where({id:req.params.id})
  .then(function(data,err){
    if(err){
      console.log(err);
      res.render('error', {title:'Error',error:err})
    }
    else {
      var count = 0;
      for(var i=0; i< data.length; i++)
      {
        //data[i].authors = [];
        knex.raw("SELECT * FROM author_books INNER JOIN authors on author_books.author_id = authors.id WHERE author_books.book_id = '" + data[i].id +"'")
        .then(function(dataA,err){
          count++;
          if(err){
            console.log(err);
            res.render('error', {title:'Error',error:err})
          }
          else {
            for(var k=0; k< data.length; k++)
            {
              if(dataA && data[k].id === dataA.rows[0].book_id)
              {
                data[k].authors = dataA.rows;
                if(count === data.length)
                {
                  res.render('books', {type:'delete', title:'Books', books:data});
                }
              }
            }

          }
        })
      }
    }
  });
});

/*************
Authors
*************/


router.get('/authors', function(req, res, next) {
  var author = '';
  var book = '';
  console.log("BeforeKnex");

  knex('authors')
  .then(function(data,err){
    if(err){
      console.log(err);
      res.render('error', {title:'Error',error:err})
    }
    else {
      var count = 0;
      for(var i=0; i< data.length; i++)
      {
      knex.raw("SELECT * FROM author_books INNER JOIN books on author_books.book_id = books.id WHERE author_books.author_id = '" + data[i].id +"'")
      .then(function(dataA,err){
        count++;
        if(err){
          console.log(err);
          res.render('error', {title:'Error',error:err})
        }
        else {
          for(var k=0; k< data.length; k++)
          {
            if(dataA && data[k].id === dataA.rows[0].author_id)
            {
              data[k].books = dataA.rows;
              if(count === data.length)
              {
                //console.log(data);
                res.render('authors', {type:'none', title:'Authors', authors:data});
              }
            }
          }
        }
      })
    }
  }
  });
});

router.get('/authors/:id', function(req, res, next) {
  var author = '';
  var book = '';
  console.log("BeforeKnex");

  knex('authors').where({id:req.params.id})
  .then(function(data,err){
    if(err){
      console.log(err);
      res.render('error', {title:'Error',error:err})
    }
    else {
      var count = 0;
      for(var i=0; i< data.length; i++)
      {
      knex.raw("SELECT * FROM author_books INNER JOIN books on author_books.book_id = books.id WHERE author_books.author_id = '" + data[i].id +"'")
      .then(function(dataA,err){
        count++;
        if(err){
          console.log(err);
          res.render('error', {title:'Error',error:err})
        }
        else {
          for(var k=0; k< data.length; k++)
          {
            if(dataA && data[k].id === dataA.rows[0].author_id)
            {
              data[k].books = dataA.rows;
              if(count === data.length)
              {
                res.render('authors', {type:'none', title:'Authors', authors:data});
              }
            }
          }
        }
      })
    }
  }
  });
});

router.get('/authors/:id/edit', function(req, res, next) {
  var author = '';
  var book = '';
  console.log("BeforeKnex");

  knex('authors').where({id:req.params.id})
  .then(function(data,err){
    if(err){
      console.log(err);
      res.render('error', {title:'Error',error:err})
    }
    else {
      var count = 0;
      for(var i=0; i< data.length; i++)
      {
      knex.raw("SELECT * FROM author_books INNER JOIN books on author_books.book_id = books.id WHERE author_books.author_id = '" + data[i].id +"'")
      .then(function(dataA,err){
        count++;
        if(err){
          console.log(err);
          res.render('error', {title:'Error',error:err})
        }
        else {
          for(var k=0; k< data.length; k++)
          {
            if(dataA && data[k].id === dataA.rows[0].author_id)
            {
              data[k].books = dataA.rows;
              if(count === data.length)
              {
                knex('books').select('title')
                .then(function(bookList, err){
                  //console.log(authList);
                  res.render('authors', {type:'edit', title:'Authors', authors:data, bookList:bookList});
                });
              }
            }
          }
        }
      })
    }
  }
  });
});
router.post('/authors/:id/edit', function(req, res, next) {
  console.log(req.body);
  delete req.body.button;
  knex('authors').update(req.body).where({id:req.params.id})
  .then(function(data,err){
    if(!err)
    {
      res.redirect('/authors/'+req.params.id);
    }
    else {
      res.render('error', {title:'Error',error:err});
    }
  })
});

module.exports = router;
