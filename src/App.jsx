import { useState, useEffect, useRef } from 'react'
import RecipeForm from './components/RecipeForm'
import RecipeCard from './components/RecipeCard'
import ImportUrl from './components/ImportUrl'
import { fetchRecipeFromUrl } from './utils/recipeParser'
import './App.css'

function App() {
  const [recipe, setRecipe] = useState({
    title: '',
    servings: '',
    prepTime: '',
    cookTime: '',
    ingredients: '',
    instructions: '',
    sourceUrl: '',
  })
  const [autoImportLoading, setAutoImportLoading] = useState(false)
  const [autoImportError, setAutoImportError] = useState('')
  const hasCheckedUrl = useRef(false)

  // Auto-import from URL parameter
  useEffect(() => {
    if (hasCheckedUrl.current) return
    hasCheckedUrl.current = true

    const params = new URLSearchParams(window.location.search)
    const recipeUrl = params.get('recipe_url')

    if (recipeUrl) {
      setAutoImportLoading(true)
      setAutoImportError('')

      fetchRecipeFromUrl(recipeUrl)
        .then((importedRecipe) => {
          setRecipe({ ...importedRecipe, sourceUrl: recipeUrl })
          // Clean up URL without reload
          window.history.replaceState({}, '', window.location.pathname)
        })
        .catch((err) => {
          setAutoImportError(err.message || 'Failed to import recipe from URL')
        })
        .finally(() => {
          setAutoImportLoading(false)
        })
    }
  }, [])

  useEffect(() => {
    document.title = recipe.title ? `${recipe.title} - julia` : 'julia'
  }, [recipe.title])

  const handleChange = (field, value) => {
    setRecipe(prev => ({ ...prev, [field]: value }))
  }

  const handleImport = (importedRecipe) => {
    setRecipe(importedRecipe)
  }

  const handlePrint = () => {
    window.print()
  }

  const hasContent = recipe.title || recipe.ingredients || recipe.instructions

  return (
    <div className="app">
      <header className="app-header">
        <h1>Julia</h1>
        <p>Create 4x6" recipe cards for printing on thermal printers</p>
      </header>

      {autoImportLoading && (
        <div className="auto-import-status">Importing recipe from URL...</div>
      )}
      {autoImportError && (
        <div className="auto-import-error">{autoImportError}</div>
      )}

      <main className="app-main">
        <section className="input-section">
          <ImportUrl onImport={handleImport} />
          <RecipeForm recipe={recipe} onChange={handleChange} />
        </section>

        <section className="preview-section">
          <div className="preview-header">
            <h2>Preview</h2>
            {hasContent && (
              <button onClick={handlePrint} className="print-button">
                Print Card
              </button>
            )}
          </div>
          <div className="preview-container">
            <RecipeCard recipe={recipe} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
