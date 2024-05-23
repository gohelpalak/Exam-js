// script.js

document.addEventListener('DOMContentLoaded', () => {
    let form = document.getElementById('recipe-form');
    let recipesList = document.getElementById('recipes-list');
    let searchInput = document.getElementById('search');
    let filterSelect = document.getElementById('filter');

    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    function saveRecipes() {
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }

    function loadRecipes() {
        recipesList.innerHTML = '';
        filterSelect.innerHTML = '<option value="">Filter by Cuisine</option>';
        let cuisines = new Set();
        recipes.forEach(recipe => {
            displayRecipe(recipe);
            cuisines.add(recipe.cuisine);
        });
        cuisines.forEach(cuisine => {
            let option = document.createElement('option');
            option.value = cuisine;
            option.textContent = cuisine;
            filterSelect.appendChild(option);
        });
    }

    function displayRecipe(recipe) {
        let recipeItem = document.createElement('div');
        recipeItem.classList.add('mb-4', 'p-4', 'bg-gray-100', 'rounded', 'shadow-md');
        recipeItem.innerHTML = `
        <div class="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <img class="w-full h-48 object-cover object-center" src="img/1.jpg" alt="${recipe.title}">
        <div class="p-4">
            <h3 class="text-xl font-bold text-gray-900">${recipe.title}</h3>
            <p class="mt-2"><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p class="mt-2"><strong>Instructions:</strong> ${recipe.instructions}</p>
            <p class="mt-2"><strong>Cuisine Type:</strong> ${recipe.cuisine}</p>
            <div class="flex justify-end mt-4">
                <button class="edit-recipe bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded" data-id="${recipe.id}">Edit</button>
                <button class="delete-recipe bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2" data-id="${recipe.id}">Delete</button>
            </div>
        </div>
    </div>
   
    
        `;
        recipesList.appendChild(recipeItem);
    }

    function addRecipe(event) {
        event.preventDefault();
        let title = document.getElementById('title').value;
        let ingredients = document.getElementById('ingredients').value;
        let instructions = document.getElementById('instructions').value;
        let cuisine = document.getElementById('cuisine').value;

        if (!title || !ingredients) {
            alert('Title and Ingredients are required!');
            return;
        }

        let newRecipe = {
            id: Date.now(),
            title,
            ingredients,
            instructions,
            cuisine
        };

        recipes.push(newRecipe);
        saveRecipes();
        displayRecipe(newRecipe);
        form.reset();
    }

    function editRecipe(id) {
        let recipe = recipes.find(r => r.id == id);
        document.getElementById('title').value = recipe.title;
        document.getElementById('ingredients').value = recipe.ingredients;
        document.getElementById('instructions').value = recipe.instructions;
        document.getElementById('cuisine').value = recipe.cuisine;
        recipes = recipes.filter(r => r.id != id);
        saveRecipes();
        loadRecipes();
    }

    function deleteRecipe(id) {
        recipes = recipes.filter(r => r.id != id);
        saveRecipes();
        loadRecipes();
    }

    function searchRecipes(event) {
        let query = event.target.value.toLowerCase();
        let filteredRecipes = recipes.filter(recipe => 
            recipe.title.toLowerCase().includes(query) || 
            recipe.ingredients.toLowerCase().includes(query)
        );
        recipesList.innerHTML = '';
        filteredRecipes.forEach(recipe => displayRecipe(recipe));
    }

    function filterRecipes(event) {
        let cuisine = event.target.value;
        let filteredRecipes = cuisine ? recipes.filter(recipe => recipe.cuisine === cuisine) : recipes;
        recipesList.innerHTML = '';
        filteredRecipes.forEach(recipe => displayRecipe(recipe));
    }

    form.addEventListener('submit', addRecipe);
    recipesList.addEventListener('click', event => {
        if (event.target.classList.contains('edit-recipe')) {
            editRecipe(event.target.dataset.id);
        }
        if (event.target.classList.contains('delete-recipe')) {
            deleteRecipe(event.target.dataset.id);
        }
    });
    searchInput.addEventListener('input', searchRecipes);
    filterSelect.addEventListener('change', filterRecipes);

    loadRecipes();
});
let ClearAll =() =>{
    localStorage.removeItem("recipes");
    location.reload();
    console.log(localStorage);
}