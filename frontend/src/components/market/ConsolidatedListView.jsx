export default function ConsolidatedListView({
  consolidatedIngredients,
  checkedIngredients,
  toggleIngredientChecked,
}) {
  if (Object.keys(consolidatedIngredients).length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-black/5 text-text-muted">
        No matching ingredients found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(consolidatedIngredients).map(([category, items]) => (
        <div key={category} className="flex flex-col gap-3">
          <h3 className="text-md font-display font-extrabold text-text-primary flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-[#2d4a1e]"></span>
            {category}
          </h3>
          <div className="bg-white rounded-3xl p-5 border border-black/5 shadow-sm flex flex-col gap-3">
            {items.map((item) => {
              const key = `all-ing-${item.name}`;
              const isChecked = !!checkedIngredients[key];
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between py-1 border-b border-black/5 last:border-0"
                >
                  <div
                    className="flex items-center gap-3 cursor-pointer flex-1"
                    onClick={() => toggleIngredientChecked(key)}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isChecked
                          ? "bg-[#2d4a1e] border-[#2d4a1e] text-white"
                          : "border-text-muted"
                      }`}
                    >
                      {isChecked && (
                        <svg width="10" height="8" viewBox="0 0 12 9" fill="none">
                          <path
                            d="M1 4L4.5 7.5L11 1"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        isChecked
                          ? "text-text-muted line-through"
                          : "text-text-primary font-bold"
                      }`}
                    >
                      {item.name}{" "}
                      <span className="text-xs text-text-muted/70 font-normal">
                        ({item.count} {item.count > 1 ? "meals" : "meal"})
                      </span>
                    </span>
                  </div>
                  {item.qty && (
                    <span className="text-xs text-text-muted bg-black/5 px-2 py-0.5 rounded-md font-semibold font-sans">
                      {item.qty}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
