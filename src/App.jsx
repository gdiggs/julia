import { useState, useEffect } from 'react'
import RecipeForm from './components/RecipeForm'
import RecipeCard from './components/RecipeCard'
import ImportUrl from './components/ImportUrl'
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
