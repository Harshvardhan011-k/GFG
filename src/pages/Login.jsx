import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [step, setStep] = useState('phone'); // 'phone' | 'otp'
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');

    const handleSendOtp = async () => {
        if (phone.length === 10) {
            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone })
                });
                const data = await res.json();
                if (res.ok) {
                    setStep('otp');
                    // For demo purposes, we might show the OTP in alert or console if needed, 
                    // but in real app user receives SMS. 
                    // The backend returns it in this demo for easy testing.
                    if (data.otp) console.log("OTP:", data.otp);
                } else {
                    alert(data.error);
                }
            } catch (err) {
                alert("Failed to send OTP");
            }
        } else {
            alert("Please enter a valid 10-digit number");
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const res = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp })
            });
            const data = await res.json();

            if (res.ok) {
                // Save user info and redirect
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('userPhone', data.phone);
                navigate('/dashboard');
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert("Verification failed");
        }
    };

    return (
        <div className="flex-col" style={{ height: '100vh', padding: '24px', justifyContent: 'center' }}>
            <div className="text-center" style={{ marginBottom: '40px' }}>
                <h1 style={{ color: 'var(--color-primary)', fontSize: '2.5rem', marginBottom: '8px' }}>
                    {t('login.welcome')}
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                    {t('login.subtitle')}
                </p>
            </div>

            <div className="card">
                {step === 'phone' ? (
                    <>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            {t('login.phoneLabel')}
                        </label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                            <span style={{ padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>+91</span>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                maxLength="10"
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: '1.1rem'
                                }}
                            />
                        </div>
                        <button className="btn-primary" onClick={handleSendOtp}>
                            {t('login.sendOtp')}
                        </button>
                    </>
                ) : (
                    <>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                            {t('login.enterOtp')}
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="1234"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1.1rem',
                                marginBottom: '24px',
                                textAlign: 'center',
                                letterSpacing: '4px'
                            }}
                        />
                        <button className="btn-primary" onClick={handleVerifyOtp}>
                            {t('login.verifyOtp')}
                        </button>
                        <p
                            className="text-center"
                            style={{ marginTop: '16px', color: 'var(--color-primary)', cursor: 'pointer' }}
                            onClick={() => setStep('phone')}
                        >
                            {t('login.resend')}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
