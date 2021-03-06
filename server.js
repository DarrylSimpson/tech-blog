const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'Super secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};


const hbs = exphbs.create({
    helpers: {
        format_date: date => {
            return `${date.getMonth() + 1}/ ${date.getDate()}/${date.getFullYear()}`;
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./controllers'));
app.use(session(sess));


sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, function() {
      console.log('App listening on PORT ' + PORT);
    });
  });

// app.listen(PORT, () => {
//     console.log(`App listeningn on port ${PORT}!`);
//     sequelize.sync({ force: false });
// });