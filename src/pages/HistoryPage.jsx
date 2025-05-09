import { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import "../styles/HistoryPage.css";

/**
 * HistoryPage Component
 *
 * Displays a searchable and sortable table of inventory change history.
 * This component:
 * 1. Shows inventory quantity change history
 * 2. Allows filtering via search
 * 3. Permits sorting by any column
 * 4. Provides navigation back to the main view
 */
const HistoryPage = ({ setCurrentPage }) => {
  // Access inventory context for history data
  const { history } = useInventory();

  // Local state for search and sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "time",
    direction: "desc",
  });

  /**
   * Updates search query as user types
   */
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  /**
   * Handles column header clicks to update sorting
   * Toggles between ascending and descending when clicking the same column
   */
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Apply filtering to history based on search query
  let filteredHistory = [...history];
  if (searchQuery) {
    filteredHistory = filteredHistory.filter(
      (item) =>
        item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort the filtered history based on current sort configuration
  filteredHistory.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  /**
   * Returns the appropriate CSS class for a column header based on current sort
   */
  const getHeaderClass = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? "sorted-asc" : "sorted-desc";
  };

  return (
    <div className="history-page">
      {/* Header with title, search, and navigation */}
      <div className="header">
        <h1>Inventory History</h1>
        <div className="action-bar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by item or name..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <button
            className="back-button"
            onClick={() => setCurrentPage("main")}
          >
            Back to Main
          </button>
        </div>
      </div>

      {/* History table container */}
      <div className="history-table-container">
        <table className="history-table">
          {/* Table header with sortable columns */}
          <thead>
            <tr>
              <th
                onClick={() => requestSort("id")}
                className={getHeaderClass("id")}
              >
                #
              </th>
              <th
                onClick={() => requestSort("item")}
                className={getHeaderClass("item")}
              >
                Item
              </th>
              <th
                onClick={() => requestSort("name")}
                className={getHeaderClass("name")}
              >
                Name
              </th>
              <th
                onClick={() => requestSort("before")}
                className={getHeaderClass("before")}
              >
                Before
              </th>
              <th
                onClick={() => requestSort("after")}
                className={getHeaderClass("after")}
              >
                After
              </th>
              <th
                onClick={() => requestSort("time")}
                className={getHeaderClass("time")}
              >
                Time
              </th>
            </tr>
          </thead>
          {/* Table body with history entries */}
          <tbody>
            {filteredHistory.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.id}</td>
                <td>{entry.item}</td>
                <td>{entry.name}</td>
                <td>{entry.before}</td>
                <td>{entry.after}</td>
                <td>{entry.time}</td>
              </tr>
            ))}
            {/* Empty state when no records match the filter */}
            {filteredHistory.length === 0 && (
              <tr>
                <td colSpan="6" className="no-records">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPage;
