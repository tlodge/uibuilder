import request from 'superagent';

export function get(url, query){	
  return new Promise((resolve, reject)=>{
     request
      .get(url)
      .query(query || {})
      //.set('Accept', 'image/svg+xml')
      .end(function(err, res){
        if (err){
          reject(err);
        }else{
          resolve(res);
        }
     });
  })
}