var fs = require('fs');
var knex = require('knex')({
  client: 'pg',
  connection: 'postgress://localhost:5432/ccfBooks'
});

/*
ID,Book Title,Book Genre,Book Description,Book Cover URL,Author 1 First Name,Author 1 Last Name,Author 1 Biography,Author 1 Portrait URL,Author 2 First Name,Author 2 Last Name,Author 2 Biography,Author 2 Portrait URL,Author 3 First Name,Author 3 Last Name,Author 3 Biography,Author 3 Portrait URL
*/
var colArr = ['first_name','last_name','biography','img_url','first_name','last_name','biography','img_url','first_name','last_name','biography','img_url'];
fs.readFile('data.txt',function(err, data){
  if(err)
  {
    console.log(err);
  }
  else {
    var lines = String(data).split('\n');
    for(var i=1; i< lines.length -1; i++)
    {
      var items = lines[i].split(/[,](?=[^\s])/g);
      var count = 0;
      var bookObj = {
        id:items[0],
        title:items[1],
        genre:items[2],
        description:items[3],
        img_url:items[4]
      };
      var authors = [];
      var authorObj = {};
      for(var k=5; k < items.length && items[k] !=''; k+=4)
      {

        authors.push({
          [colArr[0]] : items[k],
          [colArr[1]] : items[k+1],
          [colArr[2]] : items[k+2],
          [colArr[3]] : items[k+3]
        });
      }

      console.log(bookObj);

      console.log('\n------\n');
      console.log(authors);
      knex('books').insert(bookObj)
      .then(function(data,err){
        if(err)
        {
          console.log(err);
        }
        console.log('Books Updated');
      });
      for(var m=0; m < authors.length; m++)
      {
        knex('authors').insert(authors[m])
        .then(function(data,err){
          if(err)
          {
            console.log(err);
          }
          else {
            for (var h=0; h < authors.length; h++)
            {
              knex('authors').select('id').where({first_name:authors[h].first_name, last_name:authors[h].last_name})
              .then(function(dataInner,err){
                if(err)
                {
                  console.log(err);
                }
                else {
                  knex('author_books').insert({author_id:dataInner.id, book_id:bookObj.id})
                  .then(function(data,err){
                    if(err)
                    {
                      console.log(err);
                    }
                    else {
                      console.log('Authors Updated');
                    }
                  });
                }
              });
            }
            /*
            knex('author_books').insert({author_id:authors[m], bookObj.id})
            .then(function(data,err){
              if(err)
              {
                console.log(err);
              }
              console.log('Authors Updated');
            });
            */
            console.log(data);
          }
          //console.log('Authors Updated');
        });
        /*
        knex('author_books').insert({author_id:authors[m], bookObj.id})
        .then(function(data,err){
          if(err)
          {
            console.log(err);
          }
          console.log('Authors Updated');
        });
        */
      }

    }
  }
});

function objCreate(obj)
{
  var thing = {};
  for(var item in obj)
  {
    thing[item] = obj[item];
  }
  return thing;
}
