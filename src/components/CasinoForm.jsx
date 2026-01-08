import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './CasinoForm.css';

const CasinoForm = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        tier: 'D',
        bonus: '',
        frequency: '24hr',
        collection_path: '',
        id: null
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                url: '',
                tier: 'D',
                bonus: '',
                frequency: '24hr',
                collection_path: '',
                id: null
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay">
                    <motion.div
                        className="modal-container glass-panel"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="modal-header">
                            <h2>{initialData ? 'Edit Casino' : 'Add New Casino'}</h2>
                            <button onClick={onClose} className="close-btn" aria-label="Close">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Casino Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="glass-input"
                                    placeholder="e.g. CrownCoins"
                                />
                            </div>

                            <div className="form-group">
                                <label>URL</label>
                                <input
                                    type="url"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleChange}
                                    required
                                    className="glass-input"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tier</label>
                                    <select
                                        name="tier"
                                        value={formData.tier}
                                        onChange={handleChange}
                                        className="glass-input"
                                    >
                                        <option value="A">Tier A (Gold)</option>
                                        <option value="B">Tier B (Silver)</option>
                                        <option value="C">Tier C</option>
                                        <option value="D">Tier D</option>
                                        <option value="F">Tier F</option>
                                        <option value="New">New</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Bonus Amount (Est.)</label>
                                    <input
                                        type="text"
                                        name="bonus"
                                        value={formData.bonus}
                                        onChange={handleChange}
                                        className="glass-input"
                                        placeholder="$1.00"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Frequency</label>
                                <input
                                    type="text"
                                    name="frequency"
                                    value={formData.frequency}
                                    onChange={handleChange}
                                    className="glass-input"
                                    placeholder="e.g. 24hr, 6hr"
                                />
                            </div>

                            <div className="form-group">
                                <label>Collection Path / Notes</label>
                                <input
                                    type="text"
                                    name="collection_path"
                                    value={formData.collection_path}
                                    onChange={handleChange}
                                    className="glass-input"
                                    placeholder="e.g. Profile -> Daily Bonus"
                                />
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={onClose} className="glass-button secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="glass-button primary">
                                    <Save size={18} />
                                    Save Casino
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CasinoForm;
