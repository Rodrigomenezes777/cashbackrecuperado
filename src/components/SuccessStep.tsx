import React from 'react';
import { CheckCircle, Calendar, Clock, CreditCard } from 'lucide-react';

interface SuccessStepProps {
  claimId: string;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ claimId }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Solicitação Enviada com Sucesso!
        </h2>
        
        <p className="text-gray-600 mb-6">
          Sua solicitação de cashback foi recebida e está sendo processada.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-700 font-medium">Número da solicitação:</p>
          <p className="text-blue-600 font-bold text-lg">{claimId}</p>
          <p className="text-gray-500 text-sm mt-1">
            Guarde este número para consultas futuras
          </p>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Próximos passos:
        </h3>
        
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-gray-800 font-medium">Análise da solicitação</p>
              <p className="text-gray-600 text-sm">
                Nossa equipe irá analisar sua solicitação e verificar o valor do cashback disponível.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-gray-800 font-medium">Prazo de processamento</p>
              <p className="text-gray-600 text-sm">
                O processo de verificação leva em média 5 dias úteis. Você receberá atualizações por email.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0">
              <CreditCard className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-gray-800 font-medium">Depósito do cashback</p>
              <p className="text-gray-600 text-sm">
                Após a aprovação, o valor será depositado na conta bancária informada em até 3 dias úteis.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Dúvidas? Entre em contato com nosso suporte:
        </p>
        <p className="text-blue-600 font-medium">
          suporte@cashbackrecuperado.com.br
        </p>
      </div>
    </div>
  );
};

export default SuccessStep;