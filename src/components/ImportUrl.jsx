import { useState } from 'react'
import { fetchRecipeFromUrl } from '../utils/recipeParser'

function ImportUrl({ onImport }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError('')

    try {
      const recipe = await fetchRecipeFromUrl(url.trim())
      onImport({ ...recipe, sourceUrl: url.trim() })
      setUrl('')
    } catch (err) {
      setError(err.message || 'Failed to import recipe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="import-url">
      <form onSubmit={handleSubmit} className="import-form">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste recipe URL..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !url.trim()}>
          {loading ? 'Importing...' : 'Import'}
        </button>
      </form>
      {error && <p className="import-error">{error}</p>}
    </div>
  )
}

export default ImportUrl
