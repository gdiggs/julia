const CORS_PROXY = 'https://corsproxy.io/?'
const CORS_PROXY_API_KEY = '92d0aa58'

function buildProxyUrl(url) {
  let proxyUrl = CORS_PROXY + encodeURIComponent(url)
  // corsproxy.io requires an API key outside of local development
  if (!import.meta.env.DEV) {
    proxyUrl += '&key=' + CORS_PROXY_API_KEY
  }
  return proxyUrl
}

export async function fetchRecipeFromUrl(url) {
  const response = await fetch(buildProxyUrl(url))
  if (!response.ok) {
    throw new Error('Failed to fetch URL')
  }
  const html = await response.text()
  return parseRecipeFromHtml(html)
}

function parseRecipeFromHtml(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Try JSON-LD first (most reliable)
  const jsonLdRecipe = extractJsonLd(doc)
  if (jsonLdRecipe) {
    return jsonLdRecipe
  }

  // Fall back to microdata
  const microdataRecipe = extractMicrodata(doc)
  if (microdataRecipe) {
    return microdataRecipe
  }

  throw new Error('Could not find recipe data on this page')
}

function extractJsonLd(doc) {
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]')

  for (const script of scripts) {
    try {
      const data = JSON.parse(script.textContent)
      const recipe = findRecipeInJsonLd(data)
      if (recipe) {
        return normalizeRecipe(recipe)
      }
    } catch (e) {
      continue
    }
  }
  return null
}

function findRecipeInJsonLd(data) {
  if (Array.isArray(data)) {
    for (const item of data) {
      const recipe = findRecipeInJsonLd(item)
      if (recipe) return recipe
    }
    return null
  }

  if (data && typeof data === 'object') {
    if (data['@type'] === 'Recipe') {
      return data
    }
    if (data['@graph']) {
      return findRecipeInJsonLd(data['@graph'])
    }
  }
  return null
}

function extractMicrodata(doc) {
  const recipeElement = doc.querySelector('[itemtype*="schema.org/Recipe"]')
  if (!recipeElement) return null

  const getProp = (name) => {
    const el = recipeElement.querySelector(`[itemprop="${name}"]`)
    return el?.textContent?.trim() || ''
  }

  const getProps = (name) => {
    const els = recipeElement.querySelectorAll(`[itemprop="${name}"]`)
    return Array.from(els).map(el => el.textContent?.trim()).filter(Boolean)
  }

  return {
    title: getProp('name'),
    servings: getProp('recipeYield'),
    prepTime: formatDuration(getProp('prepTime')),
    cookTime: formatDuration(getProp('cookTime')),
    ingredients: getProps('recipeIngredient').join('\n'),
    instructions: getProps('recipeInstructions').join('\n'),
  }
}

function normalizeRecipe(recipe) {
  return {
    title: recipe.name || '',
    servings: normalizeYield(recipe.recipeYield),
    prepTime: formatDuration(recipe.prepTime),
    cookTime: formatDuration(recipe.cookTime),
    ingredients: normalizeIngredients(recipe.recipeIngredient),
    instructions: normalizeInstructions(recipe.recipeInstructions),
  }
}

function normalizeYield(recipeYield) {
  if (!recipeYield) return ''
  if (Array.isArray(recipeYield)) {
    return recipeYield[0]?.toString() || ''
  }
  return recipeYield.toString()
}

function normalizeIngredients(ingredients) {
  if (!ingredients) return ''
  if (Array.isArray(ingredients)) {
    return ingredients.map(i => typeof i === 'string' ? i : i.text || i.name || '').join('\n')
  }
  return ingredients.toString()
}

function normalizeInstructions(instructions) {
  if (!instructions) return ''
  if (typeof instructions === 'string') {
    return instructions
  }
  if (Array.isArray(instructions)) {
    return instructions.map(step => {
      if (typeof step === 'string') return step
      if (step['@type'] === 'HowToStep') return step.text || ''
      if (step['@type'] === 'HowToSection') {
        const sectionSteps = step.itemListElement || []
        return sectionSteps.map(s => s.text || '').join('\n')
      }
      return step.text || ''
    }).join('\n')
  }
  return ''
}

function formatDuration(duration) {
  if (!duration) return ''

  // Handle ISO 8601 duration format (e.g., PT30M, PT1H30M)
  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i)
  if (match) {
    const hours = parseInt(match[1]) || 0
    const minutes = parseInt(match[2]) || 0

    if (hours && minutes) {
      return `${hours}h ${minutes}m`
    } else if (hours) {
      return `${hours}h`
    } else if (minutes) {
      return `${minutes}m`
    }
  }

  return duration
}
