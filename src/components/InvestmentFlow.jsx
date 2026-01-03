import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const InvestmentFlow = ({ onBack, onInvest, goals = [] }) => {
    const { t } = useTranslation();
    const [amount, setAmount] = useState(10);
    const [selectedGoalId, setSelectedGoalId] = useState(null);
    const [selectedAsset, setSelectedAsset] = useState('gold');

    const handleSliderChange = (e) => {
        setAmount(parseInt(e.target.value));
    };

    const increments = [10, 20, 50, 100, 500];

    const assets = [
        { id: 'gold', name: t('assets.gold'), icon: '🥇', color: '#FFF8E1', border: '#FFC107' },
        { id: 'bonds', name: t('assets.bonds'), icon: '📜', color: '#E8F5E9', border: '#4CAF50' },
        { id: 'funds', name: t('assets.funds'), icon: '📈', color: '#E3F2FD', border: '#2196F3' }
    ];

    return (
        <div className="flex-col" style={{ padding: '24px', height: '100%' }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '1.5rem', alignSelf: 'flex-start', marginBottom: '16px' }}>
                ←
            </button>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{t('invest.title')}</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
                {t('invest.subtitle')}
            </p>

            <div className="card flex-center flex-col" style={{ padding: '40px 20px', marginBottom: '24px' }}>
                <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>{t('invest.iWantToSave')}</span>
                <div style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--color-primary)', margin: '16px 0' }}>
                    ₹{amount}
                </div>

                <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={amount}
                    onChange={handleSliderChange}
                    style={{ width: '100%', accentColor: 'var(--color-primary)', marginBottom: '24px' }}
                />

                <div className="flex-center" style={{ gap: '8px', flexWrap: 'wrap' }}>
                    {increments.map(val => (
                        <button
                            key={val}
                            onClick={() => setAmount(val)}
                            style={{
                                background: val === amount ? 'var(--color-primary)' : '#eee',
                                color: val === amount ? 'white' : '#333',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '16px',
                                fontSize: '0.9rem'
                            }}
                        >
                            ₹{val}
                        </button>
                    ))}
                </div>
            </div>

            {/* Asset Selection */}
            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>Choose Asset Class:</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    {assets.map(asset => (
                        <button
                            key={asset.id}
                            onClick={() => setSelectedAsset(asset.id)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '12px 4px',
                                borderRadius: '12px',
                                border: selectedAsset === asset.id ? `2px solid ${asset.border}` : '1px solid #eee',
                                background: selectedAsset === asset.id ? asset.color : 'transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{asset.icon}</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, textAlign: 'center' }}>{asset.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Goal Selection */}
            {goals.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Save for (Optional):</label>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                        <button
                            onClick={() => setSelectedGoalId(null)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: selectedGoalId === null ? '2px solid var(--color-primary)' : '1px solid #eee',
                                background: selectedGoalId === null ? 'var(--color-primary-light)' : 'transparent',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            General Investing
                        </button>
                        {goals.map(goal => (
                            <button
                                key={goal.id}
                                onClick={() => setSelectedGoalId(goal.id)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: selectedGoalId === goal.id ? '2px solid var(--color-primary)' : '1px solid #eee',
                                    background: selectedGoalId === goal.id ? 'var(--color-primary-light)' : 'transparent',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {goal.icon} {goal.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ marginTop: 'auto' }}>
                <div className="flex-center" style={{ gap: '8px', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    <span>{t('invest.paymentMethods')}</span>
                </div>
                <button className="btn-primary" onClick={() => onInvest(amount, selectedGoalId, selectedAsset)}>
                    {t('invest.cta', { amount })}
                </button>
            </div>
        </div>
    );
};

export default InvestmentFlow;
