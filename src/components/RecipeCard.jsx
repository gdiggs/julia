import { useRef, useEffect, useState } from 'react'

const MIN_SCALE = 0.6
const MULTI_PAGE_SCALE = 0.6

function RecipeCard({ recipe }) {
  const cardRef = useRef(null)
  const contentRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [pages, setPages] = useState(null) // null = single page, array = multi-page

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
      setPages(null)
      return
    }

    // Reset to measure true content size
    setScale(1)
    setPages(null)

    // Use requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(() => {
      const card = cardRef.current
      const content = contentRef.current

      if (!card || !content) return

      const cardHeight = card.clientHeight
      const contentHeight = content.scrollHeight

      if (contentHeight <= cardHeight) {
        // Content fits at scale 1
        setScale(1)
        setPages(null)
      } else {
        const neededScale = cardHeight / contentHeight

        if (neededScale >= MIN_SCALE) {
          // Content fits with scaling
          setScale(neededScale)
          setPages(null)
        } else {
          // Content doesn't fit even at min scale - need multiple pages
          setScale(MULTI_PAGE_SCALE)
          // Calculate content split for multiple pages
          const scaledContentHeight = contentHeight * MULTI_PAGE_SCALE
          const pageCount = Math.ceil(scaledContentHeight / cardHeight)
          setPages(splitContentIntoPages(pageCount, ingredients, instructions))
        }
      }
    })
  }, [recipe, hasContent, ingredients.length, instructions.length])

  // Split content into pages
  function splitContentIntoPages(pageCount, allIngredients, allInstructions) {
    // Estimate items per page (rough heuristic)
    const totalItems = allIngredients.length + allInstructions.length
    const itemsPerPage = Math.ceil(totalItems / pageCount)

    const pages = []
    let remainingIngredients = [...allIngredients]
    let remainingInstructions = [...allInstructions]
    let instructionStartIndex = 0

    for (let i = 0; i < pageCount; i++) {
      const isFirstPage = i === 0
      const page = {
        showHeader: isFirstPage,
        ingredients: [],
        instructions: [],
        instructionStartIndex: 0,
      }

      let itemsOnThisPage = 0
      const targetItems = itemsPerPage

      // First page gets title/meta, so fewer items
      const adjustedTarget = isFirstPage ? Math.floor(targetItems * 0.85) : targetItems

      // Add ingredients first
      while (remainingIngredients.length > 0 && itemsOnThisPage < adjustedTarget) {
        page.ingredients.push(remainingIngredients.shift())
        itemsOnThisPage++
      }

      // Then add instructions
      page.instructionStartIndex = instructionStartIndex
      while (remainingInstructions.length > 0 && itemsOnThisPage < adjustedTarget) {
        page.instructions.push(remainingInstructions.shift())
        instructionStartIndex++
        itemsOnThisPage++
      }

      pages.push(page)
    }

    // If there's remaining content, add to last page
    if (remainingIngredients.length > 0 || remainingInstructions.length > 0) {
      const lastPage = pages[pages.length - 1]
      lastPage.ingredients.push(...remainingIngredients)
      lastPage.instructions.push(...remainingInstructions)
    }

    return pages
  }

  // Single page render
  if (!pages) {
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

  // Multi-page render
  return (
    <div className="recipe-cards-multi">
      {pages.map((page, pageIndex) => (
        <div className="recipe-card" key={pageIndex}>
          <div
            className="recipe-card-content"
            style={{ fontSize: `${MULTI_PAGE_SCALE}em` }}
          >
            {page.showHeader && (
              <>
                {recipe.title && <h1 className="recipe-title">{recipe.title}</h1>}
                {hasMetadata && (
                  <div className="recipe-meta">
                    {recipe.servings && <span>Serves: {recipe.servings}</span>}
                    {recipe.prepTime && <span>Prep: {recipe.prepTime}</span>}
                    {recipe.cookTime && <span>Cook: {recipe.cookTime}</span>}
                  </div>
                )}
              </>
            )}

            {page.ingredients.length > 0 && (
              <div className="recipe-section">
                {(page.showHeader || pageIndex === 0 || pages[pageIndex - 1].ingredients.length === 0) && (
                  <h2>Ingredients{!page.showHeader && pages.some((p, i) => i < pageIndex && p.ingredients.length > 0) ? ' (continued)' : ''}</h2>
                )}
                <ul className="ingredients-list">
                  {page.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {page.instructions.length > 0 && (
              <div className="recipe-section">
                <h2>Instructions{page.instructionStartIndex > 0 ? ' (continued)' : ''}</h2>
                <ol className="instructions-list" start={page.instructionStartIndex + 1}>
                  {page.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            <div className="recipe-page-number">
              Page {pageIndex + 1} of {pages.length}
            </div>

            {pageIndex === pages.length - 1 && recipe.sourceUrl && (
              <div className="recipe-source">
                Source: {new URL(recipe.sourceUrl).hostname.replace(/^www\./, '')}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecipeCard
