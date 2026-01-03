import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const VoiceGuide = () => {
    const { t } = useTranslation();
    const [isPlaying, setIsPlaying] = useState(false);

    const toggleVoice = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="card" style={{ background: 'var(--color-primary-fade)', border: '1px solid var(--color-primary-light)' }}>
            <div className="flex-center" style={{ gap: '16px' }}>
                <button
                    onClick={toggleVoice}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'var(--color-primary)',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.5rem',
                        boxShadow: '0 4px 10px rgba(255, 159, 28, 0.4)',
                        cursor: 'pointer',
                        position: 'relative'
                    }}
                >
                    {isPlaying ? '⏸️' : '🎙️'}
                    {isPlaying && (
                        <div style={{
                            position: 'absolute',
                            top: -5, left: -5, right: -5, bottom: -5,
                            borderRadius: '50%',
                            border: '2px solid var(--color-primary)',
                            animation: 'pulse 1.5s infinite'
                        }} />
                    )}
                </button>
                <div className="flex-col">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{t('voice.guide')}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        {isPlaying ? t('voice.listening') : t('voice.tap')}
                    </p>
                </div>
            </div>
            <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
      `}</style>
        </div>
    );
};

export default VoiceGuide;
