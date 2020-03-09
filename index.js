const express = require('express');
const app = express();
const mongoose = require('mongoose');

const ShortUrl = require('./models/shortUrl');

mongoose.connect('mongodb+srv://cyrus:Y1B97SO21fuMmiI7@cluster0-xp4l4.mongodb.net/urlShortener?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls: shortUrls});
});

app.post('/shortUrls',async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect('/')
});

app.get('/:shortUrl', async (req, res, next) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl});
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save();

    res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 5000);