// Creates a hot reloading development environment

const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;
var staticPath = path.join(__dirname, '../../build/client');
app.use(express.static(staticPath));

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

app.listen(port, host, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('🚧  App is listening at http://%s:%s', host, port);
});
