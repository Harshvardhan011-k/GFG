import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const StoryEducation = () => {
    const { t } = useTranslation();
    const [selectedStory, setSelectedStory] = useState(null);

    const stories = [
        { id: 'story1', title: t('learn.story1.title'), content: t('learn.story1.content'), color: "#FFECB3", icon: "🌱" },
        { id: 'story2', title: t('learn.story2.title'), content: t('learn.story2.content'), color: "#C8E6C9", icon: "📜" },
        { id: 'story3', title: t('learn.story3.title'), content: t('learn.story3.content'), color: "#BBDEFB", icon: "✨" },
        { id: 'story4', title: t('learn.story4.title'), content: t('learn.story4.content'), color: "#E1BEE7", icon: "🏦" },
    ];

    return (
        <div className="flex-col" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{t('learn.title')}</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>{t('learn.subtitle')}</p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
            }}>
                {stories.map((story, i) => (
                    <div
                        key={i}
                        className="card"
                        onClick={() => setSelectedStory(story)}
                        style={{
                            background: story.color,
                            height: '160px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            margin: 0
                        }}
                    >
                        <span style={{ fontSize: '2rem' }}>{story.icon}</span>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{story.title}</h3>
                    </div>
                ))}
            </div>

            {selectedStory && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    padding: '24px'
                }} onClick={() => setSelectedStory(null)}>
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: 'white',
                            padding: '32px',
                            borderRadius: '24px',
                            maxWidth: '400px',
                            width: '100%',
                            textAlign: 'center',
                            position: 'relative'
                        }}
                    >
                        <button
                            onClick={() => setSelectedStory(null)}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'none',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer'
                            }}
                        >
                            ✕
                        </button>
                        <span style={{ fontSize: '4rem', display: 'block', marginBottom: '16px' }}>{selectedStory.icon}</span>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>{selectedStory.title}</h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#555' }}>
                            {selectedStory.content}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryEducation;
