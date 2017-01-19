// Creates a hot reloading development environment

const path = require('path');
const fs = require('fs');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const DashboardPlugin = require('webpack-dashboard/plugin');
const config = require('./config/webpack.config.development');

const app = express();
const compiler = webpack(config);

// Apply CLI dashboard for your webpack dev server
compiler.apply(new DashboardPlugin());

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

function log() {
  arguments[0] = '\nWebpack: ' + arguments[0];
  console.log.apply(console, arguments);
}

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  },
  historyApiFallback: true
}));

app.use(webpackHotMiddleware(compiler));


//just dev, so blocking read of images dir
app.get('/images/', (req,res)=>{
  fs.readdir('./src/client/assets/images/', (err, files) => {
      
      const images = files.filter((fileName)=>{
        return fileName.indexOf(".svg") != -1
      });

      const data = images.map((fileName)=>{
          const f = path.join(__dirname, `./src/client/assets/images/${fileName}`);
         
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
   res.sendFile(path.join(__dirname, './src/client/assets/images/' + req.params.name));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './src/client/assets/index.html'));
});

app.listen(port, host, (err) => {
  if (err) {
    log(err);
    return;
  }

  log('🚧  App is listening at http://%s:%s', host, port);
});
