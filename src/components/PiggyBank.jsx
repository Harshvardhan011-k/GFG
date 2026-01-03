import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../context/ToastContext';
import './PiggyBank.css'; // We'll create this or use inline/standard styles

const PiggyBank = ({ userId, piggyBalance, onUpdate }) => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showDestinationSelect, setShowDestinationSelect] = useState(false);

    const addMoney = async (amount) => {
        setLoading(true);
        try {
            const response = await fetch('/api/piggy-bank/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, amount })
            });
            if (response.ok) {
                onUpdate();
                toast.success(`₹${amount} added!`);
            } else {
                toast.error("Failed to add money");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    const breakPiggyBank = async (destination) => {
        console.log("breakPiggyBank called with destination:", destination);
        console.log("Current userId:", userId);
        if (!userId) {
            toast.error("User session expired. Please login again.");
            return;
        }
        setLoading(true);
        try {
            console.log("Sending break request...");
            const response = await fetch('/api/piggy-bank/break', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, destination })
            });
            console.log("Response status:", response.status);
            if (response.ok) {
                const data = await response.json();
                console.log("Break success data:", data);
                onUpdate();
                toast.success(`Piggy bank broken! ₹${piggyBalance} added to ${destination}.`);
                setShowConfirm(false);
                setShowDestinationSelect(false);
            } else {
                const errorData = await response.json();
                console.error("Break failed data:", errorData);
                toast.error(errorData.error || "Failed to break piggy bank");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="piggy-bank-card">
            <div className="piggy-icon">🐷</div>
            <h3>{t('piggy.title')}</h3>
            <p className="piggy-balance">₹{piggyBalance}</p>

            <div className="piggy-actions">
                <button disabled={loading} onClick={() => addMoney(10)}>+ ₹10</button>
                <button disabled={loading} onClick={() => addMoney(20)}>+ ₹20</button>
                <button disabled={loading} onClick={() => addMoney(50)}>+ ₹50</button>
            </div>

            {piggyBalance > 0 && (
                <button
                    className="break-btn"
                    disabled={loading}
                    onClick={() => setShowConfirm(true)}
                >
                    🔨 {t('piggy.break')}
                </button>
            )}

            {showConfirm && !showDestinationSelect && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(255,255,255,0.95)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    textAlign: 'center',
                    zIndex: 10
                }}>
                    <p style={{ fontWeight: 600, marginBottom: '16px', color: '#333' }}>
                        {t('piggy.confirmBreak')}
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => setShowConfirm(false)}
                            style={{ background: '#eee', color: '#333', border: 'none', padding: '8px 16px', borderRadius: '8px' }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => setShowDestinationSelect(true)}
                            style={{ background: '#F44336', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px' }}
                        >
                            Break it!
                        </button>
                    </div>
                </div>
            )}

            {showDestinationSelect && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(255,255,255,0.95)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    textAlign: 'center',
                    zIndex: 11
                }}>
                    <p style={{ fontWeight: 600, marginBottom: '16px', color: '#333', fontSize: '1.1rem' }}>
                        Where should the money go?
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '200px' }}>
                        <button
                            onClick={() => breakPiggyBank('gold')}
                            className="dest-btn gold"
                            style={{ background: '#FFD700', color: '#333', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600 }}
                        >
                            🥇 Gold
                        </button>
                        <button
                            onClick={() => breakPiggyBank('bonds')}
                            className="dest-btn bonds"
                            style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600 }}
                        >
                            📜 Bonds
                        </button>
                        <button
                            onClick={() => breakPiggyBank('funds')}
                            className="dest-btn funds"
                            style={{ background: '#2196F3', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600 }}
                        >
                            📈 Funds
                        </button>
                        <button
                            onClick={() => { setShowDestinationSelect(false); setShowConfirm(false); }}
                            style={{ background: 'none', border: 'none', color: '#666', marginTop: '10px', fontSize: '0.9rem' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PiggyBank;
