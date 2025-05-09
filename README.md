# StockWise - Inventory Tracking System

A modern inventory tracking application built with React to help manage and track inventory items across multiple locations.

## Features

- **Folder-based Organization**: Categorize inventory items into intuitive folders
- **Responsive Grid Layout**: View folders and items in an easy-to-navigate grid
- **Inventory Management**: Add, edit, and delete items with detailed information
- **Quantity Tracking**: Track current quantities with quick increment/decrement controls
- **Threshold Alerts**: Set alert thresholds for low inventory items
- **History Tracking**: Monitor changes to inventory quantities over time
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/youjaepark/LTG-Inventory-Tracking-StockWise.git
cd LTG-Inventory-Tracking-StockWise
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` by default.

## Project Structure

```
├── public/           # Static assets
├── src/              # Source files
│   ├── components/   # React components
│   ├── context/      # React context providers
│   │   └── InventoryContext.jsx   # Global state management
│   ├── pages/        # Page components
│   │   ├── MainPage.jsx          # Dashboard with folders and items
│   │   ├── ItemAddPage.jsx       # Add/edit item form
│   │   └── HistoryPage.jsx       # View inventory history
│   ├── styles/       # CSS stylesheets
│   └── App.jsx       # Main application component
├── index.html        # Entry HTML file
└── vite.config.js    # Vite configuration
```

## Current Implementation

The frontend currently implements:

- **User Interface**: Clean, modern UI with responsive design
- **Data Management**: Local state management using React Context
- **CRUD Operations**: Create, read, update, and delete operations for inventory items and folders
- **Categorization**: Folder-based organization of inventory items
- **Item Details**: Comprehensive item information with image upload support
- **History Tracking**: Basic tracking of inventory quantity changes

## Next Steps

1. **Backend Development**:

   - Create a backend server
   - Connect the frontend to the backend

2. **Authentication & Authorization(if needed)**:
   - Implement user authentication system
   - Create login/registration pages in the frontend
