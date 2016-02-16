var express = require('express');
var router = express.Router();
var knex = require('knex')({
  client: 'pg',
  connection: 'postgress://localhost:5432/ccfBooks'
});

function checkErr(err)
{
  var exists = false;
  if(err){
    console.log(err);
    res.render('error', {title:'Error',error:err})
    exists = true;
  }
  return exists;
}

/*
function getRandImg(data)
{
  console.log(data);
  return data[Math.floor(Math.random()*data.length)].img_url;
}
*/
/* GET home page. */
router.get('/', function(req, res, next) {
  //var author = '';
  //var book = '';
  console.log("BeforeKnex");
  res.render('index', { title: 'Main'});

  //For displaying random header images from the DB
/*
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
  */

});

router.get('/books', function(req, res, next) {

  knex('books')
  .then(function(data,err){
    if(checkErr(err));
    else {
      var count = 0;
      for(var i=0; i< data.length; i++)
      {
        //data[i].authors = [];
        knex.raw("SELECT * FROM author_books INNER JOIN authors on author_books.author_id = authors.id WHERE author_books.book_id = '" + data[i].id +"'")
        .then(function(dataA,err){
          count++;
          if(checkErr(err));
          else {
            for(var k=0; k< data.length; k++)
            {
              //console.log(dataA.rowCount);
              if(dataA.rowCount > 0 && data[k].id === dataA.rows[0].book_id)
              {
                data[k].authors = dataA.rows;
              }
              if(count === data.length)
              {
                res.render('books', {type:'none', title:'Books', books:data});
              }
            }

          }
        })
      }
    }
  });
});

router.get('/books/:id', function(req, res, next) {


  knex('books').where({id:req.params.id})
  .then(function(data,err){
    if(checkErr(err));
    else {
      var count = 0;
      for(var i=0; i< data.length; i++)
      {
        //data[i].authors = [];
        knex.raw("SELECT * FROM author_books INNER JOIN authors on author_books.author_id = authors.id WHERE author_books.book_id = '" + data[i].id +"'")
        .then(function(dataA,err){
          count++;
          if(checkErr(err));
          else {
            for(var k=0; k< data.length; k++)
            {
              if(dataA.rowCount > 0 && data[k].id === dataA.rows[0].book_id)
              {
                data[k].authors = dataA.rows;
              }
              if(count === data.length)
              {
                res.render('books', {type:'none', title:'Books', books:data});
              }
            }

          }
        })
      }
    }
  });
});

router.get('/books/:id/edit', function(req, res, next) {

  knex('books').where({id:req.params.id})
  .then(function(data,err){
    if(checkErr(err));
    else {
      var count = 0;
      for(var i=0; i< data.length; i++)
      {
        //data[i].authors = [];
        knex.raw("SELECT * FROM author_books INNER JOIN authors on author_books.author_id = authors.id WHERE author_books.book_id = '" + data[i].id +"'")
        .then(function(dataA,err){
          count++;
          if(checkErr(err));
          else {
            for(var k=0; k< data.length; k++)
            {
              if(dataA.rowCount > 0 && data[k].id === dataA.rows[0].book_id)
              {
                data[k].authors = dataA.rows;
              }
              if(count === data.length)
              {
                knex('authors').select('first_name', 'last_name')
                .then(function(authList, err){
                  if(checkErr(err));
                  else{
                    res.render('books', {type:'edit', title:'Books', books:data, authList:authList});
                  }
                });
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
    else if(checkErr(err));
  })
});
router.post('/books/:id/delete', function(req, res, next) {
  //delete req.body.button;
  console.log(req.body);
  if(req.body.delete === 'true')
  {
    knex('books').del().where({id:req.params.id})
    .then(function(data,err){
      if(!err)
      {
        knex('author_books').del().where({book_id:req.params.id})
        .then(function(data2,err2){
          if(!err2)
          {
            res.redirect('/books');
          }
          else if(checkErr(err));
        })
      }
      else if(checkErr(err));
    })
  }
});
router.get('/books/:id/delete', function(req, res, next) {

  knex('books').where({id:req.params.id})
  .then(function(data,err){
    if(checkErr(err));
    else {
      var count = 0;
      for(var i=0; i< data.length; i++)
      {
        //data[i].authors = [];
        knex.raw("SELECT * FROM author_books INNER JOIN authors on author_books.author_id = authors.id WHERE author_books.book_id = '" + data[i].id +"'")
        .then(function(dataA,err){
          count++;
          if(checkErr(err));
          else {
            for(var k=0; k< data.length; k++)
            {
              if(dataA.rowCount > 0 && data[k].id === dataA.rows[0].book_id)
              {
                data[k].authors = dataA.rows;
              }
              if(count === data.length)
              {
                res.render('books', {type:'delete', title:'Books', books:data});
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

  knex('authors')
  .then(function(data,err){
    if(checkErr(err));
    else {
      var count = 0;
      for(var i=0; i< data.length; i++)
      {
      knex.raw("SELECT * FROM author_books INNER JOIN books on author_books.book_id = books.id WHERE author_books.author_id = '" + data[i].id +"'")
      .then(function(dataA,err){
        count++;
        if(checkErr(err));
        else {
          for(var k=0; k< data.length; k++)
          {
            console.log(dataA.rowCount);
            if(dataA.rowCount > 0 && data[k].id === dataA.rows[0].author_id)
            {
              data[k].books = dataA.rows;
            }
            if(count === data.length)
            {
              res.render('authors', {type:'none', title:'Authors', authors:data});
            }
          }
        }
      })
    }
  }
});
});

router.get('/authors/:id', function(req, res, next) {

  knex('authors').where({id:req.params.id})
  .then(function(data,err){
    if(checkErr(err));
    else {
      var count = 0;
      for(var i=0; i< data.length; i++)
      {
      knex.raw("SELECT * FROM author_books INNER JOIN books on author_books.book_id = books.id WHERE author_books.author_id = '" + data[i].id +"'")
      .then(function(dataA,err){
        count++;
        if(checkErr(err));
        else {
          for(var k=0; k< data.length; k++)
          {
            if(dataA.rowCount > 0 && data[k].id === dataA.rows[0].author_id)
            {
              data[k].books = dataA.rows;
            }
            if(count === data.length)
            {
              res.render('authors', {type:'none', title:'Authors', authors:data});
            }
          }
        }
      })
    }
  }
  });
});

router.get('/authors/:id/edit', function(req, res, next) {

  knex('authors').where({id:req.params.id})
  .then(function(data,err){
    if(checkErr(err));
    else {
      var count = 0;
      for(var i=0; i< data.length; i++)
      {
      knex.raw("SELECT * FROM author_books INNER JOIN books on author_books.book_id = books.id WHERE author_books.author_id = '" + data[i].id +"'")
      .then(function(dataA,err){
        count++;
        if(checkErr(err));
        else {
          for(var k=0; k< data.length; k++)
          {
            if(dataA && data[k].id === dataA.rows[0].author_id)
            {
              if(dataA.rowCount > 0 && data[k].id === dataA.rows[0].author_id)
              {
                data[k].books = dataA.rows;
              }
              if(count === data.length)
              {
                knex('books').select('title')
                .then(function(bookList, err){
                  if(checkErr(err));
                  else{
                    res.render('authors', {type:'edit', title:'Authors', authors:data, bookList:bookList});
                  }
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
    else if(checkErr(err));
  })
});


router.post('/authors/:id/delete', function(req, res, next) {
  console.log(req.body);
  if(req.body.delete === 'true')
  {
    knex('authors').del().where({id:req.params.id})
    .then(function(data,err){
      if(!err)
      {
        knex('author_books').del().where({author_id:req.params.id})
        .then(function(data2,err2){
          if(!err2)
          {
            res.redirect('/authors');
          }
          else if(checkErr(err));
        })
      }
      else if(checkErr(err));
    })
  }
});
router.get('/authors/:id/delete', function(req, res, next) {

  knex('authors').where({id:req.params.id})
  .then(function(data,err){
    if(checkErr(err));
    else {
      var count = 0;
      for(var i=0; i< data.length; i++)
      {
      knex.raw("SELECT * FROM author_books INNER JOIN books on author_books.book_id = books.id WHERE author_books.author_id = '" + data[i].id +"'")
      .then(function(dataA,err){
        count++;
        if(checkErr(err));
        else {
          for(var k=0; k< data.length; k++)
          {
            if(dataA.rowCount > 0 && data[k].id === dataA.rows[0].author_id)
            {
              data[k].books = dataA.rows;
            }
            if(count === data.length)
            {
              res.render('authors', {type:'delete', title:'Authors', authors:data});
            }
          }
        }
      })
    }
  }
  });
});

module.exports = router;
