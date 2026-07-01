import { useState } from 'react'
import { createCategoryNameSchema } from '@/schemas/categorySchema'
import { useI18n } from '@/i18n/useI18n'

export function useNewCategory({ createCategory, onCategoryCreated }) {
  const { t, mapError } = useI18n()
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

    const schema = createCategoryNameSchema(t)
    const parsed = schema.safeParse({ name: newCategoryName })
    if (!parsed.success) {
      setCreateCategoryError(parsed.error.issues[0]?.message ?? t('errors.invalidCategoryName'))
      return
    }

    setCreatingCategory(true)

    try {
      const category = await createCategory(parsed.data.name)
      onCategoryCreated(category.id)
      setNewCategoryName('')
      setShowNewCategory(false)
    } catch (error) {
      setCreateCategoryError(mapError(error) || t('errors.failedCreateCategory'))
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
