function RecipeForm({ recipe, onChange }) {
  return (
    <form className="recipe-form" onSubmit={(e) => e.preventDefault()}>
      <div className="form-group">
        <label htmlFor="title">Recipe Title</label>
        <input
          type="text"
          id="title"
          value={recipe.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="e.g., Grandma's Chocolate Chip Cookies"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="servings">Servings</label>
          <input
            type="text"
            id="servings"
            value={recipe.servings}
            onChange={(e) => onChange('servings', e.target.value)}
            placeholder="e.g., 24 cookies"
          />
        </div>

        <div className="form-group">
          <label htmlFor="prepTime">Prep Time</label>
          <input
            type="text"
            id="prepTime"
            value={recipe.prepTime}
            onChange={(e) => onChange('prepTime', e.target.value)}
            placeholder="e.g., 15 min"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cookTime">Cook Time</label>
          <input
            type="text"
            id="cookTime"
            value={recipe.cookTime}
            onChange={(e) => onChange('cookTime', e.target.value)}
            placeholder="e.g., 12 min"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="ingredients">Ingredients</label>
        <textarea
          id="ingredients"
          value={recipe.ingredients}
          onChange={(e) => onChange('ingredients', e.target.value)}
          placeholder="Enter each ingredient on a new line, e.g.:
2 cups flour
1 cup sugar
2 eggs"
          rows={8}
        />
      </div>

      <div className="form-group">
        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          value={recipe.instructions}
          onChange={(e) => onChange('instructions', e.target.value)}
          placeholder="Enter each step on a new line, e.g.:
Preheat oven to 375°F
Mix dry ingredients
Add wet ingredients and stir"
          rows={8}
        />
      </div>
    </form>
  )
}

export default RecipeForm
