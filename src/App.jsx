import React, { useState, useEffect, useMemo } from 'react';
import { Plus, LayoutGrid, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CasinoCard from './components/CasinoCard';
import CasinoForm from './components/CasinoForm';
import SortControls from './components/SortControls';
import initialData from './data/casino_data.json';
import './index.css'; // Ensure global styles are active
import './App.css';   // Layout and Component styles

// Helper to parse frequency to milliseconds (Shared logic, could be util)
const parseFrequencyToMs = (freq) => {
  if (!freq) return 24 * 60 * 60 * 1000;
  const lower = freq.toLowerCase();
  let hours = 24;

  if (lower.includes('day') || lower.includes('24hr')) hours = 24;
  else if (lower.includes('6hr')) hours = 6;
  else if (lower.includes('1hr') || lower.includes('hour')) hours = 1;
  else {
    const match = lower.match(/(\d+)/);
    if (match) hours = parseInt(match[0], 10);
  }
  return hours * 60 * 60 * 1000;
};

function App() {
  const [casinos, setCasinos] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCasino, setEditingCasino] = useState(null);
  const [sortMode, setSortMode] = useState('longest-wait'); // 'longest-wait', 'alphabetical', 'tier'

  // Load data
  useEffect(() => {
    const savedData = localStorage.getItem('casinoTrackerData');
    let loadedCasinos = [];

    if (savedData) {
      const parsedSaved = JSON.parse(savedData);

      // Merge saved data with initial data to restore missing fields (like URL/Path) if they were lost/stripped
      const mergedSaved = parsedSaved.map(saved => {
        const defaultItem = initialData.find(d => d.name === saved.name);
        if (defaultItem) {
          // We merge defaultItem first, then saved. 
          // This ensures if 'saved' lacks keys (e.g. url), we keep default's.
          // If 'saved' has keys (e.g. user edited url), we keep saved's.
          return {
            ...defaultItem,
            ...saved,
            // Ensure ID exists
            id: saved.id || saved.name
          };
        }
        return saved; // User-added casino that is not in defaults
      });

      loadedCasinos = mergedSaved;

      // Check for any NEW defaults that haven't been saved yet
      initialData.forEach(def => {
        if (!loadedCasinos.find(c => c.name === def.name)) {
          loadedCasinos.push({ ...def, lastCollected: null, id: def.name });
        }
      });

    } else {
      loadedCasinos = initialData.map(c => ({ ...c, id: c.name }));
    }

    setCasinos(loadedCasinos);
    setIsLoaded(true);
  }, []);

  // Save changes
  const saveToStorage = (updatedList) => {
    setCasinos(updatedList);
    localStorage.setItem('casinoTrackerData', JSON.stringify(updatedList));
  };

  // Actions
  const handleCollect = (name) => {
    const now = Date.now();
    const updated = casinos.map(c => c.name === name ? { ...c, lastCollected: now } : c);
    saveToStorage(updated);
  };

  const handleSaveCasino = (casinoData) => {
    let updatedList;
    if (casinoData.id) {
      // Edit existing
      updatedList = casinos.map(c => (c.id === casinoData.id || c.name === casinoData.id) ? { ...c, ...casinoData } : c);
    } else {
      // Add new
      const newCasino = { ...casinoData, id: Date.now().toString(), lastCollected: null };
      updatedList = [...casinos, newCasino];
    }
    saveToStorage(updatedList);
  };

  const handleDelete = (id) => {
    // Confirm? (Skip for speed/prototype)
    if (window.confirm('Delete this casino?')) {
      const updatedList = casinos.filter(c => c.id !== id && c.name !== id);
      saveToStorage(updatedList);
    }
  };

  const handleEdit = (casino) => {
    setEditingCasino(casino);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingCasino(null);
    setIsFormOpen(true);
  };

  // Sorting Logic
  const sortedCasinos = useMemo(() => {
    const list = [...casinos];

    if (sortMode === 'alphabetical') {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortMode === 'tier') {
      // A > B > C > D > F > New (Special logic?)
      const tiers = { 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'F': 5, 'New': 0 }; // New first? or Last? Let's go A first.
      return list.sort((a, b) => {
        const tA = tiers[a.tier] || 99;
        const tB = tiers[b.tier] || 99;
        return tA - tB;
      });
    }

    // Default: Longest Wait
    // 1. Null (Never collected) -> Top
    // 2. Oldest timestamp -> Top
    return list.sort((a, b) => {
      if (a.lastCollected === null && b.lastCollected !== null) return -1;
      if (a.lastCollected !== null && b.lastCollected === null) return 1;
      if (a.lastCollected === null && b.lastCollected === null) return 0;
      return a.lastCollected - b.lastCollected;
    });

  }, [casinos, sortMode]);


  if (!isLoaded) return <div className="loading-screen">Loading Tracker...</div>;

  return (
    <div className="app-container">
      <div className="content-width">
        <header className="app-header">
          <div className="header-branding">
            <div className="logo-icon"><Trophy size={24} color="#fbbf24" /></div>
            <div>
              <h1>Bonus Tracker</h1>
              <p className="subtitle">Daily Claims Dashboard</p>
            </div>
          </div>
          <button className="glass-button primary-action" onClick={openAddForm}>
            <Plus size={20} />
            Add Casino
          </button>
        </header>

        <div className="toolbar">
          <SortControls currentSort={sortMode} onSortChange={setSortMode} />
        </div>

        <motion.div layout className="casino-grid">
          <AnimatePresence>
            {sortedCasinos.map((casino) => (
              <CasinoCard
                key={casino.id || casino.name}
                casino={casino}
                onCollect={handleCollect}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        <CasinoForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveCasino}
          initialData={editingCasino}
        />
      </div>
    </div>
  );
}

export default App;
