import { useState } from "react";
import "./App.css";
import { InventoryProvider } from "./context/InventoryContext";
import MainPage from "./pages/MainPage";
import ItemAddPage from "./pages/ItemAddPage";
import HistoryPage from "./pages/HistoryPage";

/**
 * App Component
 *
 * Root component that manages page navigation and wraps the application
 * with the inventory data context.
 *
 * This component:
 * 1. Handles navigation between main pages (MainPage, ItemAddPage, HistoryPage)
 * 2. Maintains selected item state for editing
 * 3. Provides the InventoryContext to all child components
 */
function App() {
  // State for current page and selected item
  const [currentPage, setCurrentPage] = useState("main");
  const [selectedItem, setSelectedItem] = useState(null);

  /**
   * Renders the appropriate page component based on currentPage state
   */
  const renderPage = () => {
    switch (currentPage) {
      case "main":
        return (
          <MainPage
            setCurrentPage={setCurrentPage}
            setSelectedItem={setSelectedItem}
          />
        );
      case "add":
        return (
          <ItemAddPage
            setCurrentPage={setCurrentPage}
            selectedItem={selectedItem}
          />
        );
      case "history":
        return <HistoryPage setCurrentPage={setCurrentPage} />;
      default:
        return (
          <MainPage
            setCurrentPage={setCurrentPage}
            setSelectedItem={setSelectedItem}
          />
        );
    }
  };

  return (
    <InventoryProvider>
      <div className="app-container">{renderPage()}</div>
    </InventoryProvider>
  );
}

export default App;
