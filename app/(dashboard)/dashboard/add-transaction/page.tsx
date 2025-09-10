"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useCreateTransactionMutation } from "@/lib/store/features/transactionApi";
import { useGetDefaultCategoryQuery } from "@/features/categories";
import { useGetDefaultAccountQuery } from "@/lib/store/features/accountApi";
import {
  resetTransactionForm,
  setAmount,
  setDescription,
  setSubmitting,
  setMessage,
  setFileIds,
  setSelectedCategory,
  setSelectedAccount,
} from "@/lib/store/features/transactionFormSlice";
import TransactionTypeSelector from "@/components/domain/transaction/transaction-type-selector";
import AccountSelectModal from "@/components/domain/transaction/account-select-modal";
import CategorySelectModal from "@/components/domain/transaction/category-select-modal";
import CategorySelectCard from "@/components/domain/transaction/category-select-card";
import AccountSelectCard from "@/components/domain/transaction/account-select-card";
import TagInput from "@/components/domain/transaction/tag-input";
import NecessityRating from "@/components/domain/transaction/necessity-rating";
import DatePicker from "@/components/domain/transaction/date-picker";
import FileUpload from "@/components/domain/transaction/file-upload";

export default function AddTransactionPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { formData, selectedAccount, selectedCategory, message, isSubmitting } =
    useAppSelector((state) => state.transactionForm);

  // API hooks
  const [createTransaction] = useCreateTransactionMutation();
  const { data: defaultCategory } = useGetDefaultCategoryQuery(formData.type);
  const { data: defaultAccount } = useGetDefaultAccountQuery();

  // Set default category when it's loaded or when type changes
  useEffect(() => {
    if (defaultCategory && !selectedCategory) {
      dispatch(setSelectedCategory(defaultCategory));
    }
  }, [defaultCategory, selectedCategory, dispatch]);

  // Set default account when it's loaded
  useEffect(() => {
    if (defaultAccount && !selectedAccount) {
      dispatch(setSelectedAccount(defaultAccount));
    }
  }, [defaultAccount, selectedAccount, dispatch]);

  // Clean up Redux state on unmount
  useEffect(() => {
    return () => {
      dispatch(resetTransactionForm());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.amount ||
      !formData.description ||
      !selectedCategory ||
      !selectedAccount
    ) {
      dispatch(setMessage("Please fill in all required fields"));
      return;
    }

    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      dispatch(setMessage("Please enter a valid amount"));
      return;
    }

    dispatch(setMessage(""));
    dispatch(setSubmitting(true));

    try {
      await createTransaction({
        type: formData.type,
        amount: Number(formData.amount),
        description: formData.description,
        category_id: selectedCategory.id,
        account_id: selectedAccount.id,
        date: formData.date,
        tags: formData.tags.length > 0 ? formData.tags.join(",") : undefined,
        necessityRating:
          formData.type === "expense" ? formData.necessityRating : undefined,
        file_ids: formData.fileIds.length > 0 ? formData.fileIds : undefined,
      }).unwrap();

      dispatch(setMessage("Transaction added successfully!"));

      // Redirect to dashboard after successful submission
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      let errorMessage = "Failed to add transaction. Please try again.";
      if (error && typeof error === "object" && "data" in error) {
        const errorData = error as { data?: { meta?: { message?: string } } };
        errorMessage = errorData.data?.meta?.message || errorMessage;
      }
      dispatch(setMessage(errorMessage));
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => router.push("/dashboard/transactions")}
            className="btn btn-ghost btn-sm hover:bg-base-200"
            disabled={isSubmitting}
          >
            ← Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-base-content">
              Add Transaction
            </h1>
            <p className="text-base-content/60 mt-1">
              Record a new income or expense transaction
            </p>
          </div>
        </div>
      </div>

      <div className="bg-base-100 rounded-xl shadow-lg border border-base-200 relative overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Loading Overlay */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-base-100/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-50">
              <div className="bg-base-100 rounded-xl p-8 shadow-2xl flex items-center gap-4 border border-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <span className="text-base-content font-medium">
                  Creating transaction...
                </span>
              </div>
            </div>
          )}

          {/* Transaction Type */}
          <div
            className={`bg-base-200/50 rounded-xl p-6 ${isSubmitting ? "pointer-events-none opacity-50" : ""}`}
          >
            <TransactionTypeSelector />
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-base-200/30 rounded-xl p-6">
              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text font-semibold">Amount *</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/70 font-medium text-lg">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="input input-bordered input-lg w-full pl-10 pr-4 focus:input-primary text-lg font-medium"
                    value={formData.amount}
                    autoFocus
                    onChange={(e) => dispatch(setAmount(e.target.value))}
                    onKeyDown={(e) => {
                      // Allow: backspace, delete, tab, escape, enter, arrow keys, home, end
                      if (
                        [
                          "Backspace",
                          "Delete",
                          "Tab",
                          "Escape",
                          "Enter",
                          "Home",
                          "End",
                          "ArrowLeft",
                          "ArrowRight",
                          "ArrowUp",
                          "ArrowDown",
                        ].includes(e.key)
                      ) {
                        return;
                      }
                      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                      if (
                        e.ctrlKey &&
                        ["a", "c", "v", "x"].includes(e.key.toLowerCase())
                      ) {
                        return;
                      }
                      // Allow: numbers 0-9 and decimal point
                      if (!/^[0-9.]$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>
            </div>

            <div
              className={`bg-base-200/30 rounded-xl p-6 ${isSubmitting ? "pointer-events-none opacity-50" : ""}`}
            >
              <DatePicker />
            </div>
          </div>

          {/* Description */}
          <div className="bg-base-200/30 rounded-xl p-6">
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text font-semibold">Description *</span>
              </label>
              <textarea
                placeholder="What was this transaction for?"
                className="textarea textarea-bordered textarea-lg w-full h-24 focus:textarea-primary resize-none"
                value={formData.description}
                onChange={(e) => dispatch(setDescription(e.target.value))}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Category and Account */}
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${isSubmitting ? "pointer-events-none opacity-50" : ""}`}
          >
            <div className="bg-base-200/30 rounded-xl p-6">
              <CategorySelectCard />
            </div>
            <div className="bg-base-200/30 rounded-xl p-6">
              <AccountSelectCard />
            </div>
          </div>

          {/* Tags */}
          <div
            className={`bg-base-200/30 rounded-xl p-6 ${isSubmitting ? "pointer-events-none opacity-50" : ""}`}
          >
            <TagInput />
          </div>

          {/* Necessity Rating (only for expenses) */}
          <div
            className={`bg-base-200/30 rounded-xl p-6 ${isSubmitting ? "pointer-events-none opacity-50" : ""}`}
          >
            <NecessityRating />
          </div>

          {/* File Upload */}
          <div
            className={`bg-base-200/30 rounded-xl p-6 ${isSubmitting ? "pointer-events-none opacity-50" : ""}`}
          >
            <FileUpload
              onFilesUploaded={(fileIds) => dispatch(setFileIds(fileIds))}
              maxFiles={5}
            />
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`alert ${message.includes("success") ? "alert-success" : "alert-error"} shadow-lg`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                {message.includes("success") ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                )}
              </svg>
              <span className="font-medium">{message}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4 pt-8 border-t border-base-200">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="btn btn-outline btn-lg flex-1 hover:bg-base-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-md"></span>
                  Adding...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add {formData.type === "expense" ? "Expense" : "Income"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Account Select Modal */}
      <AccountSelectModal />

      {/* Category Select Modal */}
      <CategorySelectModal />
    </div>
  );
}
