const express=require('express');
const path=require('path');
const fs=require('fs');
const app=express();
const users=JSON.parse(fs.readFileSync(path.join(__dirname,'data','users.json'),'utf-8'));
const articles=JSON.parse(fs.readFileSync(path.join(__dirname,'data','articles.json'),'utf-8'));
app.set('views',path.join(__dirname,'views'));
app.engine('pug',require('pug').__express);
app.engine('ejs',require('ejs').__express);
app.use('/public',express.static(path.join(__dirname,'public')));
app.get('/',(req,res)=>{res.redirect('/articles')});
app.get('/users',(req,res)=>{res.render('users.pug',{title:'Користувачі',users})});
app.get('/users/:userId',(req,res)=>{
  const id=parseInt(req.params.userId,10);
  const user=users.find(u=>u.id===id);
  if(!user){return res.status(404).render('error.pug',{title:'404',message:'Користувача не знайдено'})}
  const userArticles=articles.filter(a=>a.authorId===id);
  res.render('user.pug',{title:user.name,user,articles:userArticles});
});
app.get('/articles',(req,res)=>{res.render('articles.ejs',{title:'Статті',articles,users})});
app.get('/articles/:slug',(req,res)=>{
  const art=articles.find(a=>a.slug===req.params.slug);
  if(!art){return res.status(404).render('error.pug',{title:'404',message:'Статтю не знайдено'})}
  const author=users.find(u=>u.id===art.authorId);
  const related=articles.filter(a=>a.slug!==art.slug).slice(0,3);
  res.render('article.ejs',{title:art.title,article:art,author,related,users});
});
app.use((req,res)=>{res.status(404).render('error.pug',{title:'404',message:'Сторінку не знайдено'})});
if(require.main===module){const port=process.env.PORT||3000;app.listen(port,()=>console.log('http://localhost:'+port))}
module.exports=app;
