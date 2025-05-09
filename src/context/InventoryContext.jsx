import { createContext, useContext, useState } from "react";

/**
 * Create the InventoryContext to store and manage inventory state
 */
const InventoryContext = createContext();

/**
 * Custom hook to easily access the inventory context
 */
export const useInventory = () => useContext(InventoryContext);

/**
 * InventoryProvider Component
 *
 * Provides global state management for inventory data including:
 * 1. Folders/categories of items
 * 2. Individual inventory items
 * 3. History of inventory changes
 * 4. Actions to create, read, update, and delete inventory data
 */
export const InventoryProvider = ({ children }) => {
  // Initial state for folders and items
  const [folders, setFolders] = useState([
    { id: 1, name: "Mouse", items: [] },
    {
      id: 2,
      name: "Cables",
      items: [
        {
          id: 1,
          name: "DP Cable",
          image: null,
          description: "",
          currentNumber: 20,
          purchaseAlertThreshold: 5,
          purchaseAmount: "",
          buyLink: "",
          shippingLocation: "Memorial",
        },
        {
          id: 2,
          name: "DVI Cable",
          image: null,
          description: "",
          currentNumber: 5,
          purchaseAlertThreshold: 2,
          purchaseAmount: "",
          buyLink: "",
          shippingLocation: "",
        },
      ],
    },
    { id: 3, name: "Keyboards", items: [] },
    { id: 4, name: "Monitors", items: [] },
    { id: 5, name: "Laptops", items: [] },
    { id: 6, name: "Headphones", items: [] },
  ]);

  // Initial state for change history
  const [history, setHistory] = useState([
    {
      id: 1,
      item: "DP Cable",
      name: "Youjae",
      before: 35,
      after: 33,
      time: "4/30",
    },
  ]);

  /**
   * Adds a new folder to the inventory
   * @param {string} name - Name of the new folder
   */
  const addFolder = (name) => {
    const newFolder = {
      id: folders.length + 1,
      name,
      items: [],
    };
    setFolders([...folders, newFolder]);
  };

  /**
   * Adds a new item to a specified folder
   * @param {number} folderId - ID of the folder to add the item to
   * @param {object} item - Item data to add
   */
  const addItem = (folderId, item) => {
    setFolders(
      folders.map((folder) => {
        if (folder.id === folderId) {
          return {
            ...folder,
            items: [...folder.items, { ...item, id: folder.items.length + 1 }],
          };
        }
        return folder;
      })
    );
  };

  /**
   * Updates an existing item and records the change in history if quantity changed
   * @param {number} folderId - ID of the folder containing the item
   * @param {number} itemId - ID of the item to update
   * @param {object} updatedItem - New item data
   */
  const updateItem = (folderId, itemId, updatedItem) => {
    const folderIndex = folders.findIndex((folder) => folder.id === folderId);
    if (folderIndex === -1) return;

    const folder = folders[folderIndex];
    const itemIndex = folder.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) return;

    const oldItem = folder.items[itemIndex];

    // Add to history if the current number changed
    if (oldItem.currentNumber !== updatedItem.currentNumber) {
      addHistory(
        oldItem.name,
        "User", // Assuming current user
        oldItem.currentNumber,
        updatedItem.currentNumber
      );
    }

    const updatedItems = [...folder.items];
    updatedItems[itemIndex] = { ...updatedItem, id: itemId };

    const updatedFolders = [...folders];
    updatedFolders[folderIndex] = {
      ...folder,
      items: updatedItems,
    };

    setFolders(updatedFolders);
  };

  /**
   * Deletes an item from a folder
   * @param {number} folderId - ID of the folder containing the item
   * @param {number} itemId - ID of the item to delete
   */
  const deleteItem = (folderId, itemId) => {
    setFolders(
      folders.map((folder) => {
        if (folder.id === folderId) {
          return {
            ...folder,
            items: folder.items.filter((item) => item.id !== itemId),
          };
        }
        return folder;
      })
    );
  };

  /**
   * Deletes a folder and all its items
   * @param {number} folderId - ID of the folder to delete
   */
  const deleteFolder = (folderId) => {
    setFolders(folders.filter((folder) => folder.id !== folderId));
  };

  /**
   * Adds a new entry to the history log
   * @param {string} item - Name of the item that changed
   * @param {string} name - Name of the user who made the change
   * @param {number} before - Quantity before the change
   * @param {number} after - Quantity after the change
   */
  const addHistory = (item, name, before, after) => {
    const newHistory = {
      id: history.length + 1,
      item,
      name,
      before,
      after,
      time: new Date().toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
      }),
    };
    setHistory([...history, newHistory]);
  };

  // Create context value object with state and actions
  const value = {
    folders,
    history,
    addFolder,
    addItem,
    updateItem,
    deleteItem,
    deleteFolder,
    addHistory,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
