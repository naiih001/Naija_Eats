export default function CustomItemsSection({
  customItems,
  searchTerm,
  showAddForm,
  setShowAddForm,
  newItemName,
  setNewItemName,
  newItemPrice,
  setNewItemPrice,
  addCustomItem,
  removeCustomItem,
  toggleCustomBought,
}) {
  return (
    <>
      {(customItems.length > 0 || showAddForm) && (
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex items-center gap-2 opacity-80">
            <span className="text-xl">✏️</span>
            <h2 className="text-lg font-display font-bold text-text-primary">
              Custom Items
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {customItems
              .filter(
                (item) =>
                  !searchTerm ||
                  item.name.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-transparent"
                >
                  <div
                    onClick={() => toggleCustomBought(item.id)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      item.bought
                        ? "bg-accent-orange border-accent-orange"
                        : "border-text-muted"
                    }`}
                  >
                    {item.bought && (
                      <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                        <path
                          d="M1 4L4.5 7.5L11 1"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div
                    className="flex-1 flex flex-col cursor-pointer"
                    onClick={() => toggleCustomBought(item.id)}
                  >
                    <span
                      className={`text-sm font-bold ${
                        item.bought
                          ? "text-text-muted line-through"
                          : "text-text-primary"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.price > 0 && (
                      <span
                        className={`text-xs font-bold ${
                          item.bought
                            ? "text-text-muted line-through"
                            : "text-text-primary"
                        }`}
                      >
                        ₦{item.price.toLocaleString()}
                      </span>
                    )}
                    <button
                      onClick={() => removeCustomItem(item.id)}
                      className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors text-red-500"
                      aria-label="Remove item"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Add Custom Item Form */}
      {showAddForm ? (
        <div className="bg-white rounded-2xl p-4 flex flex-col gap-3 shadow-sm border-2 border-accent-orange/30 mt-4">
          <p className="text-xs font-bold uppercase tracking-widest text-text-muted">
            New Item
          </p>
          <input
            type="text"
            placeholder="Item name (e.g. Ugwu leaves)"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomItem()}
            autoFocus
            className="w-full bg-[#F8F8DF] rounded-xl py-3 px-4 text-sm font-medium outline-none placeholder:text-text-muted border border-transparent focus:border-accent-orange/50 transition-colors"
          />
          <input
            type="number"
            placeholder="Estimated price (optional, ₦)"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomItem()}
            className="w-full bg-[#F8F8DF] rounded-xl py-3 px-4 text-sm font-medium outline-none placeholder:text-text-muted border border-transparent focus:border-accent-orange/50 transition-colors"
          />
          <div className="flex gap-2">
            <button
              onClick={addCustomItem}
              className="flex-1 bg-accent-orange text-white rounded-xl py-2.5 text-sm font-bold hover:bg-[#e66a13] transition-colors"
            >
              Add Item
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewItemName("");
                setNewItemPrice("");
              }}
              className="px-4 bg-black/5 text-text-muted rounded-xl py-2.5 text-sm font-bold hover:bg-black/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 text-sm font-bold text-accent-orange hover:underline mt-4"
        >
          <span className="w-7 h-7 rounded-full bg-accent-orange/10 flex items-center justify-center text-accent-orange font-bold text-lg leading-none">
            +
          </span>
          Add Custom Item
        </button>
      )}
    </>
  );
}
