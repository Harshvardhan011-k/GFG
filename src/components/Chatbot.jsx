import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Mic } from 'lucide-react';
import OpenAI from 'openai';
import { useToast } from '../context/ToastContext';
import { getBotResponse } from '../data/chatKnowledge';
import '../styles/Chatbot.css';

// Initialize OpenAI
// Note: dangerouslyAllowBrowser is required because we are calling the API directly from the frontend.
// In a production app with a backend, we would hide this key.
// Check if key exists to prevent crashes
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
let openai;
if (apiKey) {
    openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
    });
}

const SYSTEM_PROMPT = `You are 'FinGuide', a helpful and friendly financial advisor for everyday Indians. 
Your goal is to help first-time investors understand basic concepts like Bonds, Gold, and Savings.
Keep answers short (under 50 words), simple, and encouraging. 
Use emojis like 🚀, 💰, 🙏. 
If asked about 'safety', emphasize Government Bonds.
Never give specific "buy this stock" advice, just general educational guidance.`;

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Namaste! 🙏 I'm FinGuide. Ask me how to grow your wealth!", sender: 'bot' }
    ]);
    const { toast } = useToast();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isOpen, isLoading]);

    // Speech to Text (Input)
    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            toast.error("Voice input is not supported in this browser. Try Chrome or Edge!");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-IN'; // Indian English
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            // Auto-send after a brief pause for better UX
            setTimeout(() => handleSend(transcript), 500);
        };

        recognition.start();
    };

    // Text to Speech (Output)
    const speak = (text) => {
        if ('speechSynthesis' in window) {
            // Stop any current speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-IN'; // Prefer Indian accent if available
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSend = async (textOverride = null) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim() || isLoading) return;

        const userMsg = { text: textToSend, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            if (!openai) throw new Error("OpenAI API Key missing");

            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    ...messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
                    { role: "user", content: userMsg.text }
                ],
                model: "gpt-4o-mini",
            });

            const botReply = completion.choices[0].message.content;
            setMessages(prev => [...prev, { text: botReply, sender: 'bot' }]);
            speak(botReply); // Speak the response

        } catch (error) {
            console.error("API error", error);
            // Fallback to offline knowledge base
            setTimeout(() => {
                const offlineReply = getBotResponse(userMsg.text);
                const replyText = offlineReply + " (Offline Mode 📶)";
                setMessages(prev => [...prev, {
                    text: replyText,
                    sender: 'bot'
                }]);
                speak(offlineReply); // Speak the offline response
            }, 500);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <>
            <button
                className={`chat-toggle ${isOpen ? 'hidden' : ''}`}
                onClick={() => setIsOpen(true)}
            >
                <MessageCircle size={28} color="white" />
            </button>

            <div className={`chat-window ${isOpen ? 'open' : ''}`}>
                <div className="chat-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="bot-avatar">🤖</div>
                        <span>FinGuide (AI)</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} style={{ color: 'white' }}>
                        <X size={20} />
                    </button>
                </div>

                <div className="chat-body">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message bot">
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <span className="dot-pulse">typing...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-area">
                    <button
                        onClick={startListening}
                        className={`mic-btn ${isListening ? 'listening' : ''}`}
                        title="Speak"
                    >
                        <Mic size={18} color={isListening ? "red" : "#555"} />
                    </button>
                    <input
                        type="text"
                        placeholder={isListening ? "Listening..." : "Ask..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading || isListening}
                    />
                    <button onClick={() => handleSend()} className="send-btn" disabled={isLoading}>
                        {isLoading ? <Loader2 size={18} className="spin" color="white" /> : <Send size={18} color="white" />}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Chatbot;
