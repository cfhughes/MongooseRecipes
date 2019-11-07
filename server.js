const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/static"));
app.set('views', __dirname + '/views');
app.use(express.urlencoded());

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/recipes', { useNewUrlParser: true });

const RecipeSchema = new mongoose.Schema({
    name: String,
    description: String,
    ingredients: [{name: String, amount: String}]
})
// create an object to that contains methods for mongoose to interface with MongoDB
const Recipe = mongoose.model('Recipe', RecipeSchema);


app.post('/recipes', (req, res) => {
    const recipe = new Recipe();
    recipe.name = req.body.name;
    recipe.description = req.body.description;
    recipe.save()
        .then(newRecipeData => {
            console.log('recipe created: ', newRecipeData)
            res.redirect('/');
        })
        .catch(err => console.log(err));
})

app.post('/recipes/:id/ingredients', (req, res) => {
    var recipe_id = req.params.id;
    Recipe.findOne({_id: recipe_id})
        .then(recipe => {
            recipe.ingredients.push(req.body);
            return recipe.save();
        })
        .then(recipe => {
            res.redirect('/');
        })
        .catch(err => res.json(err));
})

app.get('/', (req, res) => {
    Recipe.find()
        .then(data => res.render("index", { recipes: data }))
        .catch(err => res.json(err));
});

app.listen(8000, function () {
    console.log("server running on port 8000");
});