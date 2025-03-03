import React from 'react';
import { UserData } from '../types';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface UserDataStepProps {
  userData: UserData;
  onUpdateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const UserDataStep: React.FC<UserDataStepProps> = ({ 
  userData, 
  onUpdateUserData, 
  onNext, 
  onPrev 
}) => {
  const [errors, setErrors] = React.useState<Partial<Record<keyof UserData, string>>>({});

  const validateCPF = (cpf: string): boolean => {
    // Remove non-numeric characters
    const cleanCPF = cpf.replace(/\D/g, '');
    
    // Check if it has 11 digits
    if (cleanCPF.length !== 11) return false;
    
    // Check if all digits are the same (invalid CPF)
    if (/^(\d)\1+$/.test(cleanCPF)) return false;
    
    // This is a simplified validation - in a real app you'd want to check the verification digits
    return true;
  };

  const formatCPF = (cpf: string): string => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length <= 3) return cleanCPF;
    if (cleanCPF.length <= 6) return `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3)}`;
    if (cleanCPF.length <= 9) return `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3, 6)}.${cleanCPF.slice(6)}`;
    return `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3, 6)}.${cleanCPF.slice(6, 9)}-${cleanCPF.slice(9, 11)}`;
  };

  const formatCurrency = (value: string): string => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // Convert to number and format as currency
    const amount = parseInt(numericValue, 10) / 100;
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value);
    onUpdateUserData({ cpf: formattedCPF });
  };

  const handleSpendingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCurrency(e.target.value);
    onUpdateUserData({ annualSpending: formattedValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<Record<keyof UserData, string>> = {};
    
    // Validate CPF
    if (!userData.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(userData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }
    
    // Validate annual spending
    if (!userData.annualSpending) {
      newErrors.annualSpending = 'Valor gasto é obrigatório';
    }
    
    // Optional fields validation
    if (userData.email && !/^\S+@\S+\.\S+$/.test(userData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (userData.phone && userData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Telefone inválido';
    }
    
    setErrors(newErrors);
    
    // If no errors, proceed to next step
    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Informe seus dados para verificação
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="cpf" className="block text-gray-700 font-medium mb-2">
            CPF <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="cpf"
            value={userData.cpf || ''}
            onChange={handleCPFChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.cpf ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="000.000.000-00"
            maxLength={14}
          />
          {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
        </div>
        
        <div className="mb-6">
          <label htmlFor="annualSpending" className="block text-gray-700 font-medium mb-2">
            Valor aproximado gasto com cartão no último ano <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="annualSpending"
            value={userData.annualSpending || ''}
            onChange={handleSpendingChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.annualSpending ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="R$ 0,00"
          />
          {errors.annualSpending && (
            <p className="text-red-500 text-sm mt-1">{errors.annualSpending}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Nome completo
          </label>
          <input
            type="text"
            id="name"
            value={userData.name || ''}
            onChange={(e) => onUpdateUserData({ name: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Seu nome completo"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={userData.email || ''}
            onChange={(e) => onUpdateUserData({ email: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="seu@email.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        
        <div className="mb-8">
          <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
            Telefone
          </label>
          <input
            type="tel"
            id="phone"
            value={userData.phone || ''}
            onChange={(e) => onUpdateUserData({ phone: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="(00) 00000-0000"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
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
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 flex items-center"
          >
            Próximo
            <ArrowRight className="ml-2" size={18} />
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-500 text-sm">
          * Campos obrigatórios
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Seus dados estão seguros e serão usados apenas para verificar seu cashback.
        </p>
      </div>
    </div>
  );
};

export default UserDataStep;