// Creates a hot reloading development environment

const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const  Promise = require('bluebird');
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;
var staticPath = path.join(__dirname, '../../build/client');

app.use(express.static(staticPath));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
Promise.promisifyAll(fs);


app.post('/scene/add', function(req, res){
  const DIRECTORY = path.join(__dirname, '../../src/client/assets/scenes/');
  
  const {name, scene} = req.body;
  
  var ts    = Date.now();
  var filename  = path.join(DIRECTORY, `${ts}_${name}.scene`);
  
  fs.writeFileAsync(filename, scene).then(function(){
    console.log("success!");
    res.send({success:true});
  },function(err){
    console.log(err);
    res.send({success:false});
  });

});

app.get('/scenes/:name', (req,res)=>{
  res.sendFile(path.join(__dirname, '../../src/client/assets/scenes/' + req.params.name));
})

app.get('/scenes/', (req,res)=>{
  fs.readdir('../../src/client/assets/scenes/', (err, files) => {
      
      const scenes = files.filter((fileName)=>{
        return fileName.indexOf(".scene") != -1
      });

      /*const scenes = images.map((fileName)=>{
         

          const f = path.join(__dirname, `./src/client/assets/images/${fileName}`);
         
          var contents = fs.readFileSync(f, 'utf8');
          
          return {
              image: fileName,
              body: contents,
          }
      });*/

      res.send(scenes);
  });
});
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

  var ts    = Date.now();
  var filename  = path.join(DIRECTORY, name);
  
  fs.writeFileAsync(filename, image).then(function(){
    console.log("success!");
    res.send({success:true});
  },function(err){
    console.log(err);
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
