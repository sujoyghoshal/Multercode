const express=require('express');
const app=express();
const port=process.env.port||3000;
app.set('view engine','ejs');
const fs=require('fs');
app.use(express.static('./public'));
app.use(express.urlencoded({extended:true}));
const multer=require('multer');
const storage=multer.diskStorage({
    destination:function(req,file,cb){
      return cb(null,'./public/upload');
    },
    filename:function(req,file,cb){
        const ext=file.mimetype.split('/')[1];
        const imagename=`${file.originalname}`;
      return cb(null,imagename+"."+ext);
    }
})
const filter=(req,file,cb)=>{
    const ext=file.mimetype.split('/')[1];
    if(ext=='jpeg'){
      return cb(null,true);
    }
    else{
        return cb(new Error('file not supported'),false);
    }
}
const upload=multer({storage:storage,fileFilter:filter});
app.get('/',(req,res)=>{
    res.render('index',{mes:"Multer"});
})
app.post('/view',upload.single('profile'),(req,res)=>{
    if(fs.existsSync(`./public/upload/${req.file.filename}`)){
         res.send('Allready have this file');
    }
  else{ 
        res.render('view',{data:req.file.filename});
  }
})
app.listen(port,()=>{
    console.log(`Running the port no ${port}`);
})
