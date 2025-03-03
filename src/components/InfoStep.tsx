import React from 'react';
import { CreditCard, DollarSign, PiggyBank, ArrowRight } from 'lucide-react';

const InfoStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Você pode ter Cashback não resgatado!
      </h2>
      
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <DollarSign className="text-green-500 mr-3" size={28} />
          <h3 className="text-xl font-semibold">O que é Cashback?</h3>
        </div>
        <p className="text-gray-700 ml-11">
          Cashback é um programa de recompensas que devolve parte do valor gasto em compras com cartão de crédito. 
          Muitas vezes, esse dinheiro fica esquecido e não é resgatado pelos consumidores.
        </p>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <CreditCard className="text-blue-500 mr-3" size={28} />
          <h3 className="text-xl font-semibold">Como funciona?</h3>
        </div>
        <ul className="list-disc ml-16 text-gray-700 space-y-2">
          <li>A cada compra realizada com seu cartão, você acumula um percentual de volta</li>
          <li>O valor varia de 0,5% a 5% dependendo do seu cartão e da categoria da compra</li>
          <li>Muitas pessoas não sabem que têm direito ou esquecem de resgatar</li>
          <li>Nosso serviço verifica e recupera esse dinheiro para você</li>
        </ul>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <PiggyBank className="text-purple-500 mr-3" size={28} />
          <h3 className="text-xl font-semibold">Benefícios</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-11">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-gray-800">Dinheiro de volta</p>
            <p className="text-gray-600 text-sm">Recupere valores que você nem sabia que tinha direito</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-gray-800">Processo simples</p>
            <p className="text-gray-600 text-sm">Apenas 3 passos para solicitar seu cashback</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-gray-800">Sem taxas iniciais</p>
            <p className="text-gray-600 text-sm">Você só paga uma pequena comissão sobre o valor recuperado</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-gray-800">Depósito direto</p>
            <p className="text-gray-600 text-sm">O valor é depositado diretamente na sua conta bancária</p>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-10">
        <button
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 flex items-center mx-auto"
        >
          Verificar meu Cashback
          <ArrowRight className="ml-2" size={20} />
        </button>
        <p className="text-gray-500 text-sm mt-4">
          Leva apenas 5 minutos para solicitar seu cashback não resgatado
        </p>
      </div>
    </div>
  );
};

export default InfoStep;