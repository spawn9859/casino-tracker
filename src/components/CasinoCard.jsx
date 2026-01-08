import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Edit2, Trash2, Clock, CheckCircle } from 'lucide-react';
import './CasinoCard.css';

const parseFrequency = (freq) => {
    if (!freq) return 24;
    const lower = freq.toLowerCase();
    if (lower.includes('day') || lower.includes('24hr')) return 24;
    if (lower.includes('6hr')) return 6;
    if (lower.includes('1hr') || lower.includes('hour')) return 1;
    const match = lower.match(/(\d+)/);
    if (match) return parseInt(match[0], 10);
    return 24;
};

const formatTimeRemaining = (ms) => {
    const totalSeconds = ms / 1000;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

const CasinoCard = ({ casino, onCollect, onEdit, onDelete }) => {
    const [timeLeft, setTimeLeft] = useState(null);
    const [isReady, setIsReady] = useState(true);

    useEffect(() => {
        const checkStatus = () => {
            if (!casino.lastCollected) {
                setIsReady(true);
                setTimeLeft(null);
                return;
            }

            const now = Date.now();
            const freqHours = parseFrequency(casino.frequency);
            const nextAvailable = casino.lastCollected + (freqHours * 60 * 60 * 1000);

            if (now >= nextAvailable) {
                setIsReady(true);
                setTimeLeft(null);
            } else {
                setIsReady(false);
                setTimeLeft(nextAvailable - now);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 60000);
        return () => clearInterval(interval);
    }, [casino.lastCollected, casino.frequency]);

    const handleCollect = (e) => {
        e.stopPropagation();
        onCollect(casino.name); // Using name for now, but ID is better if we have it. Logic in App handles name.
    };

    const getTierColorClass = (tier) => {
        if (tier === 'A') return 'tier-gold';
        if (tier === 'B') return 'tier-silver';
        if (tier === 'New') return 'tier-new';
        return 'tier-standard';
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`casino-card glass-panel ${!isReady ? 'collected' : 'ready-glow'}`}
        >
            <div className="card-content-wrapper">
                <div className="card-top-row">
                    <div className="card-identity">
                        <h3 className="card-name">{casino.name}</h3>
                        <span className={`tier-badge ${getTierColorClass(casino.tier)}`}>{casino.tier}</span>
                    </div>
                    <div className="card-actions-mini">
                        <button onClick={() => onEdit(casino)} className="icon-btn" title="Edit">
                            <Edit2 size={14} />
                        </button>
                        <button onClick={() => onDelete(casino.id || casino.name)} className="icon-btn delete" title="Delete">
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                <div className="bonus-pill">
                    {casino.bonus} <span className="bonus-label">Daily</span>
                </div>

                {/* Prominent Collection Path */}
                {casino.collection_path && (
                    <div className="collection-instruction-box">
                        <span className="instruction-label">HOW TO COLLECT:</span>
                        <span className="instruction-text">{casino.collection_path}</span>
                    </div>
                )}

                <div className="card-details">
                    {casino.recommended_game && (
                        <div className="detail-row text-secondary">
                            <span className="icon">🎮</span>
                            <span className="truncate">Game: {casino.recommended_game}</span>
                        </div>
                    )}
                </div>

                <div className="card-footer-actions">
                    <a href={casino.url} target="_blank" rel="noopener noreferrer" className="glass-button visit-btn">
                        <ExternalLink size={16} />
                        <span className="btn-text">Open</span>
                    </a>

                    <button
                        className={`action-btn ${isReady ? 'btn-ready' : 'btn-waiting'}`}
                        onClick={handleCollect}
                        disabled={!isReady}
                    >
                        {isReady ? (
                            <>
                                <CheckCircle size={18} />
                                <span>Collect</span>
                            </>
                        ) : (
                            <>
                                <Clock size={16} />
                                <span>{formatTimeRemaining(timeLeft)}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </motion.div >
    );
};

export default CasinoCard;
