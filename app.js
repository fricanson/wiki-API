const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useUnifiedTopology: true
});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);
//TODO

app.route("/articles").get(async function (req, res) {
    try {
        const foundArticles = await Article.find().exec();
        res.send(foundArticles);
    } catch (err) {
        res.status(500).send(err);
    }
})
    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save() // Save the new article to the database
            .then(savedArticle => {
                res.send("Successfully added a new article");
            })
            .catch(err => {
                res.send(err); // Send the error as the response
            });
    })
    .delete(async function (req, res) {
        try {
            await Article.deleteMany(); // No need for a callback anymore
            res.send("Successfully deleted all articles.");
        } catch (err) {
            res.send(err);
        }
    });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});