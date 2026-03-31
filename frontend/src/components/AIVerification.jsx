import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const steps = [
  "Uploading document...",
  "Analyzing document...",
  "Extracting details...",
  "Verifying authenticity..."
];

export default function AIVerification({ onVerifySuccess, onVerifyFail }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);

  const startVerification = async () => {
    setIsProcessing(true);
    setCurrentStep(0);
    setProgress(0);
    setResult(null);

    // Call backend
    const backendPromise = api.post('/ai/verify-doc');

    // Simulate UI steps (1.5s each)
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      setProgress((i + 1) * 25);
      await new Promise(resolve => setTimeout(resolve, 3500));
    }

    try {
      const res = await backendPromise;
      setResult(res.data);
      if (res.data.status === 'approved') {
        onVerifySuccess?.(res.data);
      } else {
        onVerifyFail?.(res.data);
      }
    } catch (err) {
      setResult({ status: 'error', message: 'Connection error during verification.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="ai-verify-container">
      {!isProcessing && !result && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '16px', color: 'var(--gray-600)' }}>
            Ready to verify your documents using AgroMart AI.
          </p>
          <button type="button" className="btn btn-primary" onClick={startVerification}>
            🚀 Start AI Verification
          </button>
        </div>
      )}

      {isProcessing && (
        <>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="verify-steps">
            {steps.map((step, idx) => (
              <div key={idx} className={`verify-step ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}>
                <div className="verify-step-icon">
                  {idx < currentStep ? '✓' : idx === currentStep ? '●' : idx + 1}
                </div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {result && (
        <div className={`result-card ${result.status === 'approved' ? 'success' : 'fail'}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, color: result.status === 'approved' ? 'var(--green-dark)' : 'var(--red)' }}>
              {result.status === 'approved' ? '✅ Verification Successful' : '❌ Verification Failed'}
            </h3>
            <span className="badge badge-outline" style={{ border: '1px solid currentColor' }}>
              {result.confidenceScore}% Confidence
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>{result.message}</p>
          
          {result.status !== 'Approved' && (
            <button type="button" className="btn btn-outline btn-sm" onClick={startVerification}>
              🔄 Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
