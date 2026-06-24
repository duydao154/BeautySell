import { useState } from 'react'
import { categoryNameSchema } from '@/schemas/categorySchema'

export function useNewCategory({ createCategory, onCategoryCreated }) {
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [creatingCategory, setCreatingCategory] = useState(false)
  const [createCategoryError, setCreateCategoryError] = useState('')

  function handleShowNewCategory() {
    setShowNewCategory(true)
    setCreateCategoryError('')
  }

  function handleCancelNewCategory() {
    setShowNewCategory(false)
    setNewCategoryName('')
    setCreateCategoryError('')
  }

  async function handleCreateCategory() {
    setCreateCategoryError('')

    const parsed = categoryNameSchema.safeParse({ name: newCategoryName })
    if (!parsed.success) {
      setCreateCategoryError(parsed.error.issues[0]?.message ?? 'Invalid category name')
      return
    }

    setCreatingCategory(true)

    try {
      const category = await createCategory(parsed.data.name)
      onCategoryCreated(category.id)
      setNewCategoryName('')
      setShowNewCategory(false)
    } catch (error) {
      setCreateCategoryError(error.message ?? 'Failed to create category')
    } finally {
      setCreatingCategory(false)
    }
  }

  function handleNewCategoryKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleCreateCategory()
    }
  }

  return {
    showNewCategory,
    newCategoryName,
    creatingCategory,
    createCategoryError,
    setNewCategoryName,
    handleShowNewCategory,
    handleCancelNewCategory,
    handleCreateCategory,
    handleNewCategoryKeyDown,
  }
}
