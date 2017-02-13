// Creates a hot reloading development environment

const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;
var staticPath = path.join(__dirname, '../../build/client');

app.use(express.static(staticPath));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//just dev, so blocking read of images dir
app.get('/images/', (req,res)=>{
  fs.readdir('../../src/client/assets/images/', (err, files) => {
      
      const images = files.filter((fileName)=>{
        return fileName.indexOf(".svg") != -1
      });

      const data = images.map((fileName)=>{
          const f = path.join(__dirname, `../../src/client/assets/images/${fileName}`);
         
          var contents = fs.readFileSync(f, 'utf8');
          
          return {
              image: fileName,
              body: contents,
          }
      });

      res.send(data);
  });
});

app.get('/images/:name', (req,res)=>{
   res.sendFile(path.join(__dirname, '../../src/client/assets/images/' + req.params.name));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build/client/index.html'));
});


app.post('/image/add', function(req, res){
  
  const DIRECTORY = path.join(__dirname, '../../src/client/assets/images/');
  const {name, image} = req.body;

  var data = image.replace(/^data:image\/\w+;base64,/, "");
  var buf = new Buffer(data, 'base64');

  var ts    = Date.now();
  var filename  = path.join(DIRECTORY, name);
  
  fs.writeFileAsync(filename, buf).then(function(){
    res.send({success:true});
  },function(err){
    res.send({success:false});
  });

});


app.listen(port, host, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('🚧  App is listening at http://%s:%s', host, port);
});
