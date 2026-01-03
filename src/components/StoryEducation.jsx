import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const StoryEducation = () => {
    const { t, i18n } = useTranslation();
    const [selectedStory, setSelectedStory] = useState(null);
    const [videoLang, setVideoLang] = useState('en');

    const stories = [
        {
            id: 'story1',
            title: { en: t('learn.story1.title', { lng: 'en' }), hi: t('learn.story1.title', { lng: 'hi' }) },
            content: { en: t('learn.story1.content', { lng: 'en' }), hi: t('learn.story1.content', { lng: 'hi' }) },
            color: "#FFECB3",
            icon: "🌱",
            videos: { en: "lBCNCsWm6UA", hi: "VNvkPH8uDLE" }
        },
        {
            id: 'story2',
            title: { en: t('learn.story2.title', { lng: 'en' }), hi: t('learn.story2.title', { lng: 'hi' }) },
            content: { en: t('learn.story2.content', { lng: 'en' }), hi: t('learn.story2.content', { lng: 'hi' }) },
            color: "#C8E6C9",
            icon: "🥇",
            videos: { en: "gz7FNAYbxWs", hi: "20o0_aEIM6A" }
        },
        {
            id: 'story3',
            title: { en: t('learn.story3.title', { lng: 'en' }), hi: t('learn.story3.title', { lng: 'hi' }) },
            content: { en: t('learn.story3.content', { lng: 'en' }), hi: t('learn.story3.content', { lng: 'hi' }) },
            color: "#BBDEFB",
            icon: "📈",
            videos: { en: "TPS22HRRY1k", hi: "8KZdWtlCpuw" }
        },
        {
            id: 'story4',
            title: { en: t('learn.story4.title', { lng: 'en' }), hi: t('learn.story4.title', { lng: 'hi' }) },
            content: { en: t('learn.story4.content', { lng: 'en' }), hi: t('learn.story4.content', { lng: 'hi' }) },
            color: "#E1BEE7",
            icon: "📜",
            videos: { en: "rjgUetAKILA", hi: "yUAa_8gZvJo" }
        },
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
                        onClick={() => {
                            setSelectedStory(story);
                            setVideoLang(i18n.language === 'hi' ? 'hi' : 'en');
                        }}
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
                        {/* Display title in current app language for the card grid */}
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{story.title[i18n.language === 'hi' ? 'hi' : 'en']}</h3>
                    </div>
                ))}
            </div>

            {selectedStory && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
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
                            maxWidth: '600px',
                            width: '100%',
                            textAlign: 'center',
                            position: 'relative',
                            maxHeight: '90vh',
                            overflowY: 'auto'
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
                        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '8px' }}>{selectedStory.icon}</span>
                        {/* Dynamically show title based on selected VIDEO language */}
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{selectedStory.title[videoLang]}</h3>

                        {/* Language Toggle */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                            <button
                                onClick={() => setVideoLang('en')}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    border: '1px solid var(--color-primary)',
                                    background: videoLang === 'en' ? 'var(--color-primary)' : 'transparent',
                                    color: videoLang === 'en' ? 'white' : 'var(--color-primary)',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 600
                                }}
                            >
                                English 🇺🇸
                            </button>
                            <button
                                onClick={() => setVideoLang('hi')}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    border: '1px solid var(--color-primary)',
                                    background: videoLang === 'hi' ? 'var(--color-primary)' : 'transparent',
                                    color: videoLang === 'hi' ? 'white' : 'var(--color-primary)',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 600
                                }}
                            >
                                हिंदी 🇮🇳
                            </button>
                        </div>

                        {/* Video Container */}
                        <div style={{
                            position: 'relative',
                            paddingBottom: '56.25%',
                            height: 0,
                            marginBottom: '24px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            background: '#000'
                        }}>
                            <iframe
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%'
                                }}
                                key={videoLang}
                                src={`https://www.youtube.com/embed/${selectedStory.videos[videoLang]}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* Dynamically show content based on selected VIDEO language */}
                        <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555', textAlign: 'left', whiteSpace: 'pre-line' }}>
                            {selectedStory.content[videoLang]}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryEducation;
