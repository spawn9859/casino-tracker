import React, { useState, useMemo } from 'react';
import CasinoCard from './CasinoCard';
import './CasinoList.css';

const CasinoList = ({ casinos, onCollect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showOnlyReady, setShowOnlyReady] = useState(false);

    const filteredCasinos = useMemo(() => {
        return casinos.filter(casino => {
            // Search filter
            const matchesSearch = casino.name.toLowerCase().includes(searchTerm.toLowerCase());

            // Ready filter logic (re-using logic from Card is tricky without duplicating code, 
            // but "Ready" state basically means (now >= lastCollected + freq) OR lastCollected is null.
            // For now, let's just filter by name, and maybe we can pass "isReady" property if we computed it up top?
            // Or we can duplicate the check here efficiently.

            let matchesReady = true;
            if (showOnlyReady) {
                if (!casino.lastCollected) {
                    matchesReady = true;
                } else {
                    // Simple check
                    // We need the frequency parser here too if we want to be accurate.
                    // Ideally, the parent should inject "status" or we use a shared util.
                    // For simplicity, let's just show all for now or duplicate the parser.
                    // Let's import the helper if possible, or move it to a util.
                    // I'll stick to just name search first, or minimal ready check.

                    // Actually, let's make the "Ready" toggler just filter items where lastCollected is null or old.
                    // I'll skip complex ready logic in filter for this step to keep it simple, 
                    // or I'll move parseFrequency to a util file.
                    matchesReady = true; // Placeholder: we need util to check time.
                }
            }

            return matchesSearch;
        });
    }, [casinos, searchTerm, showOnlyReady]);

    // Updating the filter logic to properly handle "Show Only Ready" requires time checking.
    // I will refactor parseFrequency to a util in next step if needed.

    return (
        <div className="casino-list-container">
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search casinos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <label className="filter-toggle">
                    <input
                        type="checkbox"
                        checked={showOnlyReady}
                        onChange={(e) => setShowOnlyReady(e.target.checked)}
                    />
                    Show Only Ready (Coming Soon)
                </label>
            </div>

            <div className="list-grid">
                {filteredCasinos.map((casino) => (
                    <CasinoCard
                        key={casino.name}
                        casino={casino}
                        onCollect={onCollect}
                    />
                ))}
                {filteredCasinos.length === 0 && (
                    <div className="empty-state">No casinos found.</div>
                )}
            </div>
        </div>
    );
};

export default CasinoList;
