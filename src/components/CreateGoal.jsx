import React, { useState } from 'react';

const CreateGoal = ({ onGoalCreated, onCancel }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [icon, setIcon] = useState('🎯');

    const icons = ['🛵', '📱', '💻', '🏠', '💍', '🎓', '✈️', '💰'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        if (!name || !targetAmount) return;

        try {
            const res = await fetch('/api/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, name, targetAmount, icon })
            });
            if (res.ok) {
                onGoalCreated();
            }
        } catch (err) {
            console.error("Failed to create goal", err);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div className="card" style={{ width: '90%', maxWidth: '400px', padding: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>Create New Goal</h3>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Goal Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. New Phone"
                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd' }}
                    />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Target Amount (₹)</label>
                    <input
                        type="number"
                        value={targetAmount}
                        onChange={e => setTargetAmount(e.target.value)}
                        placeholder="e.g. 20000"
                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd' }}
                    />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Choose Icon</label>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                        {icons.map(ic => (
                            <button
                                key={ic}
                                onClick={() => setIcon(ic)}
                                style={{
                                    fontSize: '1.5rem',
                                    padding: '8px',
                                    background: icon === ic ? 'var(--color-secondary-light)' : 'transparent',
                                    border: icon === ic ? '2px solid var(--color-secondary)' : '1px solid #eee',
                                    borderRadius: '50%',
                                    cursor: 'pointer'
                                }}
                            >
                                {ic}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-center" style={{ gap: '12px' }}>
                    <button
                        onClick={onCancel}
                        style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#f5f5f5', color: '#555' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="btn-primary"
                        style={{ flex: 1, margin: 0 }}
                    >
                        Create Goal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGoal;
