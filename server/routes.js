import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import db from './db.js';

dotenv.config();

const router = express.Router();

// Mock OTP Store (In-memory)
const otpStore = {};

// Login - Send OTP
router.post('/login', (req, res) => {
    const { phone } = req.body;
    if (!phone || phone.length !== 10) {
        return res.status(400).json({ error: 'Invalid phone number' });
    }

    // Generate Mock OTP
    const otp = '1234';
    otpStore[phone] = otp;

    console.log(`OTP for ${phone}: ${otp}`);
    res.json({ message: 'OTP sent successfully', otp: '1234' });
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
    const { phone, otp } = req.body;

    if (otpStore[phone] === otp) {
        // Create or get user
        db.get('SELECT * FROM users WHERE phone = ?', [phone], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });

            if (row) {
                delete otpStore[phone];
                res.json({ message: 'Login successful', userId: row.id, phone: row.phone });
            } else {
                // Register new user
                db.run('INSERT INTO users (phone, balance) VALUES (?, ?)', [phone, 0], function (err) {
                    if (err) return res.status(500).json({ error: err.message });
                    delete otpStore[phone];
                    res.json({ message: 'Login successful', userId: this.lastID, phone });
                });
            }
        });
    } else {
        res.status(400).json({ error: 'Invalid OTP' });
    }
});

// Get user info
router.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

// Get user goals
router.get('/goals/:userId', (req, res) => {
    const userId = req.params.userId;
    db.all('SELECT * FROM goals WHERE user_id = ?', [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create new goal
router.post('/goals', (req, res) => {
    const { userId, name, targetAmount, icon } = req.body;
    db.run(
        'INSERT INTO goals (user_id, name, target_amount, icon) VALUES (?, ?, ?, ?)',
        [userId, name, targetAmount, icon],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: 'Goal created' });
        }
    );
});

// Invest Money
router.post('/invest', (req, res) => {
    const { userId, amount, goalId } = req.body;

    db.serialize(() => {
        // Update user balance
        db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [amount, userId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
        });

        // If goalId is present, update goal amount
        if (goalId) {
            db.run('UPDATE goals SET current_amount = current_amount + ? WHERE id = ?', [amount, goalId], (err) => {
                if (err) console.error("Error updating goal: " + err.message);
            });
        }

        // Record transaction
        db.run(
            'INSERT INTO transactions (user_id, amount, type, goal_id) VALUES (?, ?, ?, ?)',
            [userId, amount, 'credit', goalId || null],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Investment successful', transactionId: this.lastID });
            }
        );
    });
});

// Initialize Gemini
let genAI;
let model;

if (process.env.GEMINI_API_KEY) {
    try {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        model = genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log("Gemini AI initialized");
    } catch (error) {
        console.error("Failed to initialize Gemini:", error);
    }
}

// Chatbot
router.post('/chat', async (req, res) => {
    const { message, language = 'en' } = req.body;

    // Default fallback
    let reply = "I can help you with saving money in government bonds.";

    // Try using Gemini if available
    if (model) {
        try {
            const prompt = `
            You are Didi, a helpful and friendly micro-investment assistant for the detailed "Micro Invest India" app.
            Your goal is to help first-time investors understand government bonds and saving small amounts (starting ₹10).
            The user is speaking in ${language === 'hi' ? 'Hindi' : 'English'}.
            
            Context:
            - Min investment: ₹10
            - Security: 100% Gov Bonds
            - Withdrawal: Anytime (24h to bank)
            
            User says: "${message}"
            
            Reply slightly briefly and in a friendly, encouraging tone in ${language === 'hi' ? 'Hindi' : 'English'}.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            reply = response.text();

            return res.json({ reply });
        } catch (error) {
            console.error("Gemini Error:", error);
            // Fallthrough to rule-based on error
        }
    }

    const lowerMsg = message.toLowerCase();

    // Hindi Logic (Fallback)
    if (language === 'hi') {
        reply = "मैं सरकारी बॉन्ड में पैसे बचाने में आपकी मदद कर सकता हूँ। (AI Offline)";

        if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('namaste') || lowerMsg.includes('नमस्ते')) {
            reply = "नमस्ते! आज मैं आपकी बचत में कैसे मदद कर सकता हूँ?";
        } else if (lowerMsg.includes('bachat') || lowerMsg.includes('save') || lowerMsg.includes('invest') || lowerMsg.includes('पैसे')) {
            reply = "आप सिर्फ ₹10 से बचत शुरू कर सकते हैं। शुरू करने के लिए बटन पर क्लिक करें!";
        } else if (lowerMsg.includes('safe') || lowerMsg.includes('secure') || lowerMsg.includes('surakshit') || lowerMsg.includes('सुरक्षित')) {
            reply = "हाँ! आपका पैसा भारत सरकार के बॉन्ड में 100% सुरक्षित है।";
        } else if (lowerMsg.includes('withdraw') || lowerMsg.includes('money') || lowerMsg.includes('nikal') || lowerMsg.includes('nakaasi')) {
            reply = "आप कभी भी अपना पैसा निकाल सकते हैं। आपके बैंक तक पहुँचने में 24 घंटे लगते हैं।";
        }
    }
    // English Logic (Fallback)
    else {
        if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('namaste')) {
            reply = "Namaste! How can I help you save today?";
        } else if (lowerMsg.includes('save') || lowerMsg.includes('invest')) {
            reply = "You can start saving with just ₹10. Click the button to start!";
        } else if (lowerMsg.includes('safe') || lowerMsg.includes('secure')) {
            reply = "Yes! Your money is 100% safe in Government of India bonds.";
        } else if (lowerMsg.includes('withdraw') || lowerMsg.includes('money')) {
            reply = "You can withdraw your money anytime. It takes 24 hours to reach your bank.";
        }
    }

    // Simulate network delay for fallback
    setTimeout(() => {
        res.json({ reply });
    }, 500);
});

export default router;
