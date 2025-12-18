import React, { useState } from 'react';
import { LoginScreen } from './LoginScreen';
import { VerificationScreen } from './VerificationScreen';

type LoginStep = 'email' | 'verification';

interface LoginFlowProps {
  onLoginSuccess: () => void;
}

export function LoginFlow({ onLoginSuccess }: LoginFlowProps) {
  const [currentStep, setCurrentStep] = useState<LoginStep>('email');
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setCurrentStep('verification');
  };

  const handleBackToEmail = () => {
    setCurrentStep('email');
  };

  const handleVerificationSuccess = () => {
    // TODO: Store authentication state/token
    onLoginSuccess();
  };

  if (currentStep === 'verification') {
    return (
      <VerificationScreen
        email={email}
        onBack={handleBackToEmail}
        onVerificationSuccess={handleVerificationSuccess}
      />
    );
  }

  return (
    <LoginScreen
      onEmailSubmit={handleEmailSubmit}
    />
  );
}
