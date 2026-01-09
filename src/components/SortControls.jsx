import React from 'react';
import { ArrowUpDown, Clock, Trophy } from 'lucide-react';
import './SortControls.css';

const SortControls = ({ currentSort, onSortChange }) => {
    return (
        <div className="sort-controls glass-panel">
            <button
                className={`sort-btn ${currentSort === 'longest-wait' ? 'active' : ''}`}
                onClick={() => onSortChange('longest-wait')}
                title="Longest Wait"
            >
                <Clock size={16} />
                <span>Wait Time</span>
            </button>

            <button
                className={`sort-btn ${currentSort === 'alphabetical' ? 'active' : ''}`}
                onClick={() => onSortChange('alphabetical')}
                title="Alphabetical"
            >
                <ArrowUpDown size={16} />
                <span>A-Z</span>
            </button>

            <button
                className={`sort-btn ${currentSort === 'tier' ? 'active' : ''}`}
                onClick={() => onSortChange('tier')}
                title="By Tier"
            >
                <Trophy size={16} />
                <span>Tier</span>
            </button>
        </div>
    );
};

export default SortControls;
