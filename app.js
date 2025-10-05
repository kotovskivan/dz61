const path = require('path');
const express = require('express');

const users = require('./data/users');
const articles = require('./data/articles');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/public', express.static(path.join(__dirname, 'public')));

app.engine('pug', require('pug').__express);
app.engine('ejs', require('ejs').__express);

app.set('views', [
  path.join(__dirname, 'views', 'pug'),
  path.join(__dirname, 'views', 'ejs')
]);

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('users.pug', { title: 'Головна', users });
});

app.get('/users', (req, res) => {
  res.render('users.pug', { title: 'Користувачі', users });
});

app.get('/users/:userId', (req, res) => {
  const user = users.find(u => String(u.id) === req.params.userId);
  if (!user) return res.status(404).send('Користувача не знайдено');
  res.render('user-detail.pug', { title: 'Користувач', user });
});

app.get('/articles', (req, res) => {
  res.render('articles.ejs', { title: 'Статті', articles });
});

app.get('/articles/:articleId', (req, res) => {
  const article = articles.find(a => String(a.id) === req.params.articleId);
  if (!article) return res.status(404).send('Статтю не знайдено');
  res.render('article-detail.ejs', { title: 'Стаття', article });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));