import { useState, useEffect } from "react";
import { useInventory } from "../context/InventoryContext";
import "../styles/ItemAddPage.css";

/**
 * ItemAddPage Component
 *
 * Form interface for adding new inventory items or editing existing ones.
 * This component handles:
 * 1. Creating new items with required fields
 * 2. Editing existing items
 * 3. Image upload and preview
 * 4. Form validation
 *
 * The component determines if it's in edit mode based on whether a selectedItem prop is provided.
 */
const ItemAddPage = ({ setCurrentPage, selectedItem }) => {
  // Access inventory context for data and actions
  const { folders, addItem, updateItem } = useInventory();

  // Form state management
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    currentNumber: 0,
    purchaseAlertThreshold: 0,
    purchaseAmount: "",
    buyLink: "",
    shippingLocation: "",
    image: null,
    folderId: "",
  });

  // Determine if we're editing an existing item or adding a new one
  const isEditMode = !!selectedItem;

  /**
   * Effect hook to populate form with existing item data when in edit mode
   */
  useEffect(() => {
    if (selectedItem) {
      // Find the folder that contains this item
      const folderWithItem = folders.find((folder) =>
        folder.items.some((item) => item.id === selectedItem.id)
      );

      if (folderWithItem) {
        setFormData({
          ...selectedItem,
          folderId: folderWithItem.id,
        });
      }
    }
  }, [selectedItem, folders]);

  /**
   * Handle input changes for text and number fields
   */
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  /**
   * Handle image file uploads with preview
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Handle form submission to add or update an item
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.folderId) {
      alert("Please fill in required fields: Name and Folder");
      return;
    }

    if (isEditMode) {
      // Update existing item
      updateItem(parseInt(formData.folderId), selectedItem.id, formData);
    } else {
      // Add new item
      addItem(parseInt(formData.folderId), formData);
    }

    // Return to main page after submission
    setCurrentPage("main");
  };

  return (
    <div className="item-add-page">
      {/* Header with title and back button */}
      <div className="header">
        <h1>{isEditMode ? "Edit Item" : "Add New Item"}</h1>
        <button className="back-button" onClick={() => setCurrentPage("main")}>
          Back to Main
        </button>
      </div>

      {/* Main form */}
      <form className="item-form" onSubmit={handleSubmit}>
        {/* Left column - image upload */}
        <div className="form-left">
          <div className="image-upload-card">
            <h3 className="section-title">Item Image</h3>
            <div className="image-upload">
              <div className="image-preview">
                {formData.image ? (
                  <img src={formData.image} alt="Item preview" />
                ) : (
                  <div className="placeholder">
                    <span>+</span>
                    <p>Upload Image</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>

        {/* Right column - form fields */}
        <div className="form-right">
          {/* Basic Info Section */}
          <div className="form-section">
            <h3 className="section-title">Basic Info</h3>

            <div className="form-group">
              <label htmlFor="name">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </div>

          {/* Inventory Settings Section */}
          <div className="form-section">
            <h3 className="section-title">Inventory Settings</h3>

            <div className="form-group">
              <label htmlFor="currentNumber">Current Number</label>
              <input
                type="number"
                id="currentNumber"
                name="currentNumber"
                value={formData.currentNumber}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="purchaseAlertThreshold">
                Purchase Alert Threshold
              </label>
              <input
                type="number"
                id="purchaseAlertThreshold"
                name="purchaseAlertThreshold"
                value={formData.purchaseAlertThreshold}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="purchaseAmount">Purchase Amount</label>
              <input
                type="text"
                id="purchaseAmount"
                name="purchaseAmount"
                value={formData.purchaseAmount}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Purchase Details Section */}
          <div className="form-section">
            <h3 className="section-title">Purchase Details</h3>

            <div className="form-group">
              <label htmlFor="buyLink">Buy Link</label>
              <input
                type="url"
                id="buyLink"
                name="buyLink"
                value={formData.buyLink}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="shippingLocation">Shipping Location</label>
              <select
                id="shippingLocation"
                name="shippingLocation"
                value={formData.shippingLocation}
                onChange={handleChange}
              >
                <option value="">Select location</option>
                <option value="Memorial">Memorial</option>
                <option value="Downtown">Downtown</option>
                <option value="Warehouse">Warehouse</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="folderId">
                Folder <span className="required">*</span>
              </label>
              <select
                id="folderId"
                name="folderId"
                value={formData.folderId}
                onChange={handleChange}
                required
              >
                <option value="">Select folder</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Form action buttons - centered at the bottom */}
        <div className="form-actions-container">
          <div className="form-actions">
            <button type="submit" className="save-button">
              {isEditMode ? "Update Item" : "Save Item"}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setCurrentPage("main")}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ItemAddPage;
