"use client";

import { useMenuManagement } from "@/hooks/use-menu-management";

export default function MenuManagementPage() {
  const {
    menu,
    loading,
    openModal,
    editing,

    setOpenModal,
    setEditing,

    toggleAvailability,
    removeItem,
    saveItem,
  } = useMenuManagement();

  if (loading) {
    return (
      <div className="p-10 text-muted-foreground">
        Loading menu...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Menu Management</h1>
            <p className="text-muted-foreground">
              Manage dishes, prices, and availability
            </p>
          </div>

          <button
            onClick={() => {
              setEditing({
                name: "",
                price: 0,
                description: "",
                image: "",
                inStock: true,
              });
              setOpenModal(true);
            }}
            className="px-5 py-3 rounded-xl font-bold bg-primary text-primary-foreground shadow"
          >
            + Add Item
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menu.map(item => (
            <div
              key={item._id}
              className="bg-card border rounded-2xl overflow-hidden"
            >
              {/* IMAGE */}
              <div
                className={`h-48 bg-cover bg-center relative ${
                  !item.inStock ? "grayscale opacity-70" : ""
                }`}
                style={{
                  backgroundImage: `url(${item.image || "/food.jpg"})`,
                }}
              >
                <span className="absolute top-3 right-3 bg-card px-3 py-1 rounded-lg font-bold">
                  ${item.price}
                </span>

                {!item.inStock && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-black/70 text-white px-4 py-2 rounded-full text-xs font-bold">
                      SOLD OUT
                    </span>
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-3">
                <h3 className="font-bold text-lg">{item.name}</h3>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between pt-2">
                  {/* TOGGLE */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.inStock}
                      onChange={() => toggleAvailability(item)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-muted rounded-full peer-checked:bg-green-500 transition" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-background rounded-full peer-checked:translate-x-4 transition" />
                  </label>

                  {/* ACTIONS */}
                  <div className="flex gap-3 text-sm font-semibold">
                    <button
                      onClick={() => {
                        setEditing(item);
                        setOpenModal(true);
                      }}
                      className="text-primary"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => removeItem(item._id!)}
                      className="text-destructive"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {openModal && editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">
              {editing._id ? "Edit Item" : "Add Item"}
            </h2>

            <input
              className="w-full p-2 border rounded"
              placeholder="Name"
              value={editing.name}
              onChange={e =>
                setEditing({ ...editing, name: e.target.value })
              }
            />

            <input
              type="number"
              className="w-full p-2 border rounded"
              placeholder="Price"
              value={editing.price}
              onChange={e =>
                setEditing({
                  ...editing,
                  price: Number(e.target.value),
                })
              }
            />

            <input
              className="w-full p-2 border rounded"
              placeholder="Image URL"
              value={editing.image}
              onChange={e =>
                setEditing({
                  ...editing,
                  image: e.target.value,
                })
              }
            />

            <textarea
              className="w-full p-2 border rounded"
              placeholder="Description"
              value={editing.description}
              onChange={e =>
                setEditing({
                  ...editing,
                  description: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveItem}
                className="px-4 py-2 bg-primary text-primary-foreground rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
