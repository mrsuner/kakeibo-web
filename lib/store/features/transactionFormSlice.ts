import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Account } from './accountApi'
import type { Category } from './categoryApi'

interface TransactionFormData {
  type: 'income' | 'expense'
  amount: string
  description: string
  date: string
  tags: string[]
  necessityRating: number
  fileIds: string[]
}

interface TransactionFormState {
  // Form data
  formData: TransactionFormData
  
  // Selected entities
  selectedAccount: Account | null
  isAccountModalOpen: boolean
  selectedCategory: Category | null
  isCategoryModalOpen: boolean
  
  // UI state
  tagInput: string
  isSubmitting: boolean
  message: string
}

const initialState: TransactionFormState = {
  formData: {
    type: 'expense',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    necessityRating: 6,
    fileIds: [],
  },
  selectedAccount: null,
  isAccountModalOpen: false,
  selectedCategory: null,
  isCategoryModalOpen: false,
  tagInput: '',
  isSubmitting: false,
  message: '',
}

export const transactionFormSlice = createSlice({
  name: 'transactionForm',
  initialState,
  reducers: {
    // Form field updates
    updateFormField: (state, action: PayloadAction<{ field: keyof TransactionFormData; value: any }>) => {
      const { field, value } = action.payload
      ;(state.formData as any)[field] = value
      
      // Clear category when type changes
      if (field === 'type') {
        state.selectedCategory = null
      }
    },
    
    setTransactionType: (state, action: PayloadAction<'income' | 'expense'>) => {
      state.formData.type = action.payload
      // Clear category when type changes (frontend will fetch new default)
      state.selectedCategory = null
    },
    
    setAmount: (state, action: PayloadAction<string>) => {
      state.formData.amount = action.payload
    },
    
    setDescription: (state, action: PayloadAction<string>) => {
      state.formData.description = action.payload
    },
    
    setDate: (state, action: PayloadAction<string>) => {
      state.formData.date = action.payload
    },
    
    setNecessityRating: (state, action: PayloadAction<number>) => {
      state.formData.necessityRating = action.payload
    },
    
    // Tag management
    setTagInput: (state, action: PayloadAction<string>) => {
      state.tagInput = action.payload
    },
    
    addTag: (state, action: PayloadAction<string>) => {
      const tag = action.payload.trim().toLowerCase()
      if (tag && !state.formData.tags.includes(tag)) {
        state.formData.tags.push(tag)
      }
      state.tagInput = ''
    },
    
    removeTag: (state, action: PayloadAction<string>) => {
      state.formData.tags = state.formData.tags.filter(tag => tag !== action.payload)
    },
    
    // File management
    setFileIds: (state, action: PayloadAction<string[]>) => {
      state.formData.fileIds = action.payload
    },
    
    // Account management
    setSelectedAccount: (state, action: PayloadAction<Account>) => {
      state.selectedAccount = action.payload
      state.isAccountModalOpen = false
    },
    clearSelectedAccount: (state) => {
      state.selectedAccount = null
    },
    openAccountModal: (state) => {
      state.isAccountModalOpen = true
    },
    closeAccountModal: (state) => {
      state.isAccountModalOpen = false
    },
    
    // Category management
    setSelectedCategory: (state, action: PayloadAction<Category>) => {
      state.selectedCategory = action.payload
      state.isCategoryModalOpen = false
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null
    },
    openCategoryModal: (state) => {
      state.isCategoryModalOpen = true
    },
    closeCategoryModal: (state) => {
      state.isCategoryModalOpen = false
    },
    
    // UI state
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload
    },
    
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload
    },
    
    // Reset form
    resetTransactionForm: () => initialState,
  },
})

export const {
  updateFormField,
  setTransactionType,
  setAmount,
  setDescription,
  setDate,
  setNecessityRating,
  setTagInput,
  addTag,
  removeTag,
  setFileIds,
  setSelectedAccount,
  clearSelectedAccount,
  openAccountModal,
  closeAccountModal,
  setSelectedCategory,
  clearSelectedCategory,
  openCategoryModal,
  closeCategoryModal,
  setSubmitting,
  setMessage,
  resetTransactionForm,
} = transactionFormSlice.actions

export default transactionFormSlice.reducer