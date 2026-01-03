import React from 'react';
import { useTranslation } from 'react-i18next';

const TransparencyScreen = () => {
    const { t } = useTranslation();
    return (
        <div className="flex-col" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>{t('transparency.title')}</h2>

            <div className="flex-col" style={{ gap: '16px', position: 'relative' }}>
                {/* Connecting Line */}
                <div style={{
                    position: 'absolute',
                    left: '24px',
                    top: '30px',
                    bottom: '30px',
                    width: '2px',
                    background: '#ddd',
                    zIndex: 0
                }} />

                <Step
                    icon="👤"
                    title={t('transparency.you')}
                    desc={t('transparency.youDesc')}
                    color="var(--color-primary)"
                />

                <Step
                    icon="📱"
                    title={t('transparency.app')}
                    desc={t('transparency.appDesc')}
                    color="#aaa"
                />

                <Step
                    icon="🏛️"
                    title={t('transparency.govt')}
                    desc={t('transparency.govtDesc')}
                    color="var(--color-secondary)"
                    isLast={true}
                />
            </div>

            <div className="card" style={{ marginTop: '32px', background: 'var(--color-secondary-light)' }}>
                <div className="flex-center" style={{ gap: '12px', justifyContent: 'flex-start' }}>
                    <span style={{ fontSize: '1.5rem' }}>✅</span>
                    <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{t('transparency.alwaysAvailable')}</h4>
                        <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>{t('transparency.alwaysAvailableDesc')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Step = ({ icon, title, desc, color }) => (
    <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '16px', zIndex: 1, background: 'var(--color-bg-app)', padding: '8px 0' }}>
        <div className="flex-center" style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: color,
            color: 'white',
            fontSize: '1.5rem',
            flexShrink: 0
        }}>
            {icon}
        </div>
        <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{title}</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{desc}</p>
        </div>
    </div>
);

export default TransparencyScreen;
