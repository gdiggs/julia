import { useRef, useEffect, useState } from 'react'

function RecipeCard({ recipe }) {
  const cardRef = useRef(null)
  const contentRef = useRef(null)
  const [scale, setScale] = useState(1)

  const ingredients = recipe.ingredients
    .split('\n')
    .filter((line) => line.trim())

  const instructions = recipe.instructions
    .split('\n')
    .filter((line) => line.trim())

  const hasMetadata = recipe.servings || recipe.prepTime || recipe.cookTime
  const hasContent = recipe.title || ingredients.length || instructions.length

  useEffect(() => {
    if (!cardRef.current || !contentRef.current || !hasContent) {
      setScale(1)
      return
    }

    // Reset scale to measure true content size
    setScale(1)

    // Use requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(() => {
      const card = cardRef.current
      const content = contentRef.current

      if (!card || !content) return

      const cardHeight = card.clientHeight
      const contentHeight = content.scrollHeight

      if (contentHeight > cardHeight) {
        // Calculate scale needed to fit, with a minimum of 0.5
        const newScale = Math.max(0.5, cardHeight / contentHeight)
        setScale(newScale)
      } else {
        setScale(1)
      }
    })
  }, [recipe, hasContent])

  return (
    <div className="recipe-card" ref={cardRef}>
      <div
        className="recipe-card-content"
        ref={contentRef}
        style={{ fontSize: `${scale}em` }}
      >
        {recipe.title && <h1 className="recipe-title">{recipe.title}</h1>}

        {hasMetadata && (
          <div className="recipe-meta">
            {recipe.servings && <span>Serves: {recipe.servings}</span>}
            {recipe.prepTime && <span>Prep: {recipe.prepTime}</span>}
            {recipe.cookTime && <span>Cook: {recipe.cookTime}</span>}
          </div>
        )}

        {ingredients.length > 0 && (
          <div className="recipe-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        )}

        {instructions.length > 0 && (
          <div className="recipe-section">
            <h2>Instructions</h2>
            <ol className="instructions-list">
              {instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        {!hasContent && (
          <div className="recipe-placeholder">
            <p>Enter your recipe details to see a preview</p>
          </div>
        )}

        {recipe.sourceUrl && (
          <div className="recipe-source">
            Source: {new URL(recipe.sourceUrl).hostname.replace(/^www\./, '')}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecipeCard
