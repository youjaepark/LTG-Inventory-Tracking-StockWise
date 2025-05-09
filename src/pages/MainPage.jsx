import { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import "../styles/MainPage.css";

/**
 * MainPage Component
 *
 * Primary dashboard view of the inventory management system with:
 * 1. A responsive grid display of inventory category folders
 * 2. A folder-first navigation approach (only folders visible initially)
 * 3. Separate item views when a folder is selected
 *
 * The component implements a two-level navigation:
 * - First level: Grid of folder categories
 * - Second level: Items within the selected folder
 *
 * @component
 */
const MainPage = ({ setCurrentPage, setSelectedItem }) => {
  // Access inventory context for data and actions
  const { folders, addFolder, updateItem, deleteFolder } = useInventory();

  // Local state management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [openItemDetails, setOpenItemDetails] = useState(null);
  const [view, setView] = useState("folders"); // 'folders' or 'items'

  /**
   * Updates search query state as user types
   * @param {Object} e - Event object
   */
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  /**
   * Sets the currently selected folder and switches to items view
   * @param {Object} folder - The folder object that was clicked
   */
  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    setView("items");
  };

  /**
   * Navigate back to the folders grid view
   */
  const handleBackToFolders = () => {
    setSelectedFolder(null);
    setOpenItemDetails(null);
    setView("folders");
  };

  /**
   * Prompts user to delete the current folder and all its items
   * On confirmation, deletes the folder and returns to folders view
   */
  const handleDeleteFolder = () => {
    if (!selectedFolder) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete this folder and all its items?`
    );

    if (confirmDelete) {
      deleteFolder(selectedFolder.id);
      handleBackToFolders();
    }
  };

  /**
   * Opens the detail panel for the selected item
   * @param {Object} item - The item object that was clicked
   */
  const handleItemClick = (item) => {
    setOpenItemDetails(item);
  };

  /**
   * Prompts user to create a new folder
   */
  const handleAddFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName && folderName.trim()) {
      addFolder(folderName.trim());
    }
  };

  /**
   * Navigates to the Add Item page
   */
  const handleAddItem = () => {
    setSelectedItem(null);
    setCurrentPage("add");
  };

  /**
   * Navigates to the History page
   */
  const handleViewHistory = () => {
    setCurrentPage("history");
  };

  /**
   * Sets up the selected item for editing and navigates to the Edit Item page
   * @param {Object} item - The item object to edit
   */
  const handleEditItem = (item) => {
    setSelectedItem(item);
    setCurrentPage("add");
  };

  /**
   * Updates the quantity of an item by the specified change amount
   * Immediately updates the UI to reflect changes
   *
   * @param {Object} item - The item to modify
   * @param {number} change - Amount to change the quantity by (+/-)
   */
  const handleQuantityChange = (item, change) => {
    // Find the folder containing this item
    const folderWithItem = folders.find((folder) =>
      folder.items.some((i) => i.id === item.id)
    );

    if (folderWithItem) {
      const updatedItem = {
        ...item,
        currentNumber: Math.max(0, item.currentNumber + change),
      };

      updateItem(folderWithItem.id, item.id, updatedItem);

      // Update local state if the item details panel is open
      if (openItemDetails && openItemDetails.id === item.id) {
        setOpenItemDetails(updatedItem);
      }
    }
  };

  // Filter folders based on search query
  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get items from selected folder that match search query
  let itemsToDisplay = [];
  if (selectedFolder) {
    itemsToDisplay = selectedFolder.items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="main-page">
      {/* Header with search and action buttons */}
      <div className="header">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="action-buttons">
          <button className="add-folder-btn" onClick={handleAddFolder}>
            Add Folder
          </button>
          {view === "items" && (
            <button className="add-item-btn" onClick={handleAddItem}>
              Add Item
            </button>
          )}
          <button className="view-history-btn" onClick={handleViewHistory}>
            View History
          </button>
        </div>
      </div>

      <div className="content">
        {/* Folders View - grid of folder cards */}
        {view === "folders" && (
          <div className="folders-grid">
            {filteredFolders.map((folder) => (
              <div
                key={folder.id}
                className="folder-card"
                onClick={() => handleFolderClick(folder)}
              >
                <div className="folder-icon">📁</div>
                <div className="folder-name">{folder.name}</div>
              </div>
            ))}
          </div>
        )}

        {/* Items View - shows when a folder is selected */}
        {view === "items" && selectedFolder && (
          <div className="items-view">
            <div className="items-header">
              <button className="back-button" onClick={handleBackToFolders}>
                ← Back to Folders
              </button>
              <h2 className="folder-title">{selectedFolder.name}</h2>
              <button
                className="delete-folder-btn"
                onClick={handleDeleteFolder}
              >
                Delete Folder
              </button>
            </div>

            <div className="items-container">
              {itemsToDisplay.map((item) => (
                <div
                  key={item.id}
                  className={`item-card ${
                    openItemDetails?.id === item.id ? "selected" : ""
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="placeholder-image">🖼️</div>
                    )}
                  </div>
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-count">
                      Current: {item.currentNumber}
                    </div>
                    <div
                      className={`item-threshold ${
                        item.currentNumber <= item.purchaseAlertThreshold
                          ? "alert"
                          : ""
                      }`}
                    >
                      Threshold: {item.purchaseAlertThreshold}
                    </div>
                  </div>
                  <div className="item-actions">
                    <button
                      className="item-edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditItem(item);
                      }}
                    >
                      Edit
                    </button>
                    <div className="item-quantity-controls">
                      <button
                        className="decrease"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(item, -1);
                        }}
                      >
                        -
                      </button>
                      <button
                        className="increase"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(item, 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {/* Display when no items are found in the selected folder */}
              {itemsToDisplay.length === 0 && (
                <div className="no-items-message">
                  <p>No items found in this folder.</p>
                  <button onClick={handleAddItem}>Add an Item</button>
                </div>
              )}
            </div>

            {/* Item details panel - shows when an item is selected */}
            {openItemDetails && (
              <div className="item-details-panel">
                <div className="panel-header">
                  <h2>{openItemDetails.name}</h2>
                  <button
                    className="close-button"
                    onClick={() => setOpenItemDetails(null)}
                  >
                    ×
                  </button>
                </div>
                <div className="panel-content">
                  <p>
                    <strong>Description:</strong>{" "}
                    {openItemDetails.description || "No description"}
                  </p>
                  <p>
                    <strong>Current Number:</strong>{" "}
                    {openItemDetails.currentNumber}
                  </p>
                  <p>
                    <strong>Purchase Alert Threshold:</strong>{" "}
                    {openItemDetails.purchaseAlertThreshold}
                  </p>
                  <p>
                    <strong>Purchase Amount:</strong>{" "}
                    {openItemDetails.purchaseAmount || "Not specified"}
                  </p>
                  <p>
                    <strong>Buy Link:</strong>{" "}
                    {openItemDetails.buyLink || "Not specified"}
                  </p>
                  <p>
                    <strong>Shipping Location:</strong>{" "}
                    {openItemDetails.shippingLocation || "Not specified"}
                  </p>
                  <div className="panel-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEditItem(openItemDetails)}
                    >
                      Edit Item
                    </button>
                    <div className="quantity-controls">
                      <button
                        className="decrease"
                        onClick={() =>
                          handleQuantityChange(openItemDetails, -1)
                        }
                      >
                        -
                      </button>
                      <span className="quantity">
                        {openItemDetails.currentNumber}
                      </span>
                      <button
                        className="increase"
                        onClick={() => handleQuantityChange(openItemDetails, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
