import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const InvestmentFlow = ({ onBack, onInvest, goals = [] }) => {
    const { t } = useTranslation();
    const [amount, setAmount] = useState(10);
    const [selectedGoalId, setSelectedGoalId] = useState(null);

    const handleSliderChange = (e) => {
        setAmount(parseInt(e.target.value));
    };

    const increments = [10, 20, 50, 100, 500];

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
                            General Savings
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
                <button className="btn-primary" onClick={() => onInvest(amount, selectedGoalId)}>
                    {t('invest.cta', { amount })}
                </button>
            </div>
        </div>
    );
};

export default InvestmentFlow;
