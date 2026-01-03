import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import InvestmentFlow from '../components/InvestmentFlow';
import StoryEducation from '../components/StoryEducation';
import TransparencyScreen from '../components/TransparencyScreen';
import Chatbot from '../components/Chatbot';
import CreateGoal from '../components/CreateGoal';

const Dashboard = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('home');
    const [balance, setBalance] = useState(0);
    const [goals, setGoals] = useState([]);
    const [showCreateGoal, setShowCreateGoal] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetchUser(userId);
            fetchGoals(userId);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchUser = (userId) => {
        fetch(`/api/user/${userId}`)
            .then(res => res.json())
            .then(data => {
                if (data.balance !== undefined) setBalance(data.balance);
            })
            .catch(err => console.error("Failed to fetch user data", err));
    };

    const fetchGoals = (userId) => {
        fetch(`/api/goals/${userId}`)
            .then(res => res.json())
            .then(data => setGoals(data))
            .catch(err => console.error("Failed to fetch goals", err));
    };

    const handleInvest = async (amount, goalId = null) => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        try {
            const res = await fetch('/api/invest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, amount, goalId })
            });
            if (res.ok) {
                setBalance(prev => prev + amount);
                fetchGoals(userId);
                setActiveTab('home');
            } else {
                alert("Investment failed");
            }
        } catch (err) {
            alert("Error processing investment");
        }
    };

    const handleGoalCreated = () => {
        setShowCreateGoal(false);
        const userId = localStorage.getItem('userId');
        fetchGoals(userId);
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(newLang);
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('userPhone');
        navigate('/login');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div className="flex-col" style={{ padding: '24px', gap: '24px' }}>
                        {/* Header */}
                        <div className="flex-center" style={{ justifyContent: 'space-between' }}>
                            <div>
                                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{t('dashboard.greeting')}, Ravi! 🙏</h1>
                                <p style={{ color: 'var(--color-text-muted)' }}>{t('dashboard.subtitle')}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

                                <select
                                    value={i18n.language}
                                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                                    style={{
                                        padding: '4px 8px',
                                        border: '1px solid var(--color-primary)',
                                        borderRadius: '4px',
                                        background: 'white',
                                        color: 'var(--color-primary)',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="en">English</option>
                                    <option value="hi">हिंदी</option>
                                    <option value="bn">বাংলা</option>
                                    <option value="mr">मराठी</option>
                                    <option value="ta">தமிழ்</option>
                                    <option value="te">తెలుగు</option>
                                    <option value="kn">ಕನ್ನಡ</option>
                                    <option value="gu">ગુજરાતી</option>
                                </select>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        background: '#f44336', // Red color for logout
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '4px 8px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {t('Logout') || 'Logout'}
                                </button>
                                <div
                                    className="flex-center"
                                    style={{ width: 40, height: 40, background: 'var(--color-primary-fade)', borderRadius: '50%' }}
                                >
                                    👤
                                </div>
                            </div>
                        </div>

                        {/* Voice Guide Hero */}


                        {/* Goals Section */}
                        <div style={{ marginTop: '24px' }}>
                            <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>My Goals</h3>
                                <button
                                    onClick={() => setShowCreateGoal(true)}
                                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 600 }}
                                >
                                    + Add Goal
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {goals.length === 0 && (
                                    <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '20px', background: '#f9f9f9', borderRadius: '12px', color: '#888', fontSize: '0.9rem' }}>
                                        No goals yet. Start saving for something special!
                                    </div>
                                )}
                                {goals.map(goal => (
                                    <div key={goal.id} className="card" style={{ padding: '16px', margin: 0 }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{goal.icon}</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>{goal.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px' }}>₹{goal.current_amount} / ₹{goal.target_amount}</div>
                                        <div style={{ width: '100%', height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${Math.min((goal.current_amount / goal.target_amount) * 100, 100)}%`, height: '100%', background: 'var(--color-primary)' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Action Card */}
                        <div className="card" style={{ marginTop: '24px', background: 'linear-gradient(135deg, var(--color-secondary), #26A69A)', color: 'white' }}>
                            <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>{t('dashboard.currentSavings')}</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>₹{balance}</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '16px' }}>{t('dashboard.safeInBonds')}</p>
                            <button
                                onClick={() => setActiveTab('invest')}
                                style={{
                                    background: 'white',
                                    color: 'var(--color-secondary)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-pill)',
                                    padding: '10px 20px',
                                    fontWeight: 600,
                                    width: '100%'
                                }}
                            >
                                {t('dashboard.startSaving')}
                            </button>
                        </div>
                    </div>
                );
            case 'invest':
                return <InvestmentFlow onBack={() => setActiveTab('home')} onInvest={handleInvest} goals={goals} />;
            case 'learn':
                return <StoryEducation />;
            case 'transparency':
                return <TransparencyScreen />;
            default:
                return <div>Home</div>;
        }
    };

    return (
        <div style={{ paddingBottom: '80px' }}> {/* Padding for bottom nav */}

            {renderContent()}

            {showCreateGoal && (
                <CreateGoal
                    onGoalCreated={handleGoalCreated}
                    onCancel={() => setShowCreateGoal(false)}
                />
            )}

            <Chatbot />

            {/* Bottom Navigation */}
            <nav
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    maxWidth: '420px',
                    background: 'white',
                    borderTop: '1px solid #eee',
                    padding: '12px 0 24px 0',
                    display: 'flex',
                    justifyContent: 'space-around',
                    zIndex: 100
                }}
            >
                <NavIcon icon="🏠" label={t('dashboard.nav.home')} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
                <NavIcon icon="📚" label={t('dashboard.nav.learn')} active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} />
                <NavIcon icon="🛡️" label={t('dashboard.nav.trust')} active={activeTab === 'transparency'} onClick={() => setActiveTab('transparency')} />
            </nav>
        </div>
    );
};

const NavIcon = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
            gap: '4px'
        }}
    >
        <span style={{ fontSize: '1.5rem', filter: active ? 'none' : 'grayscale(100%)' }}>{icon}</span>
        <span style={{ fontSize: '0.75rem', fontWeight: active ? 600 : 400 }}>{label}</span>
    </button>
);

export default Dashboard;
