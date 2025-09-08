"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  openCategoryModal,
  clearSelectedCategory,
} from "@/lib/store/features/transactionFormSlice";

export default function CategorySelectCard() {
  const dispatch = useAppDispatch();
  const { selectedCategory, formData } = useAppSelector(
    (state) => state.transactionForm,
  );

  const handleOpenModal = () => {
    dispatch(openCategoryModal());
  };

  return (
    <div className="form-control">
      <div
        className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-md hover:scale-[1.02] text-left cursor-pointer ${
          selectedCategory
            ? "border-primary bg-primary/5 shadow-sm"
            : "border-base-200 hover:border-primary/50 bg-base-100"
        }`}
        onClick={handleOpenModal}
      >
        <div className="flex items-center space-x-3">
          <span className="text-3xl">
            {selectedCategory?.icon ||
              (formData.type === "income" ? "💵" : "💸")}
          </span>
          <div className="flex-1 min-w-0">
            {selectedCategory ? (
              <>
                <p
                  className={`font-semibold text-base truncate ${
                    selectedCategory ? "text-primary" : "text-base-content"
                  }`}
                >
                  {selectedCategory.name}
                </p>
                {selectedCategory.budget && selectedCategory.budget > 0 && (
                  <p className="text-xs text-base-content/60 truncate">
                    Budget: ${Number(selectedCategory.budget).toFixed(2)}/
                    {selectedCategory.budgetPeriod || "month"}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="font-semibold text-base text-base-content/60">
                  Select a category
                </p>
                <p className="text-xs text-base-content/40">
                  Choose transaction category
                </p>
              </>
            )}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-base-content/60 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
