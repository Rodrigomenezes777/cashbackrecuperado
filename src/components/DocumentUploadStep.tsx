import React, { useState } from 'react';
import { DocumentData, UserData } from '../types';
import { ArrowRight, ArrowLeft, Check, AlertCircle, Camera, FileText } from 'lucide-react';
import axios from 'axios';

interface DocumentUploadStepProps {
  userData: UserData;
  documentData: DocumentData;
  onUpdateDocumentData: (data: Partial<DocumentData>) => void;
  onNext: () => void;
  onPrev: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string | null) => void;
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({
  userData,
  documentData,
  onUpdateDocumentData,
  onNext,
  onPrev,
  setIsSubmitting,
  setError
}) => {
  const [errors, setErrors] = useState<Partial<Record<keyof DocumentData, string>>>({});
  const [previews, setPreviews] = useState<Partial<Record<keyof DocumentData, string>>>({});

  const handleFileChange = (field: keyof DocumentData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, [field]: 'Apenas imagens são permitidas' }));
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [field]: 'Arquivo muito grande (máximo 5MB)' }));
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviews(prev => ({ ...prev, [field]: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
      
      // Update document data
      onUpdateDocumentData({ [field]: file } as Partial<DocumentData>);
      
      // Clear error if exists
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<Record<keyof DocumentData, string>> = {};
    
    // Validate all required files
    if (!documentData.idFront) {
      newErrors.idFront = 'Foto da frente do RG é obrigatória';
    }
    
    if (!documentData.idBack) {
      newErrors.idBack = 'Foto do verso do RG é obrigatória';
    }
    
    if (!documentData.selfie) {
      newErrors.selfie = 'Selfie com documento é obrigatória';
    }
    
    setErrors(newErrors);
    
    // If no errors, proceed to next step
    if (Object.keys(newErrors).length === 0) {
      try {
        setIsSubmitting(true);
        setError(null);
        
        // Create form data
        const formData = new FormData();
        formData.append('cpf', userData.cpf);
        formData.append('annualSpending', userData.annualSpending);
        if (userData.name) formData.append('name', userData.name);
        if (userData.email) formData.append('email', userData.email);
        if (userData.phone) formData.append('phone', userData.phone);
        
        // Append files
        if (documentData.idFront) formData.append('idFront', documentData.idFront);
        if (documentData.idBack) formData.append('idBack', documentData.idBack);
        if (documentData.selfie) formData.append('selfie', documentData.selfie);
        
        // Send to API
        const response = await axios.post('http://67.211.45.154:3001/api/upload-documents', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Check response
        if (response.data && response.data.success) {
          // If successful, proceed to next step
          onNext();
        } else {
          throw new Error(response.data?.message || 'Erro ao enviar documentos');
        }
      } catch (error) {
        console.error('Error uploading documents:', error);
        setError('Erro ao enviar documentos. Por favor, tente novamente.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Confirme sua identidade
      </h2>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Para sua segurança e para evitar fraudes, precisamos confirmar sua identidade.
              Envie fotos claras dos documentos solicitados.
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* RG Frente */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Foto da frente do RG <span className="text-red-500">*</span>
            </label>
            <div className={`border-2 border-dashed rounded-lg p-4 ${
              errors.idFront ? 'border-red-500' : previews.idFront ? 'border-green-500' : 'border-gray-300'
            }`}>
              {previews.idFront ? (
                <div className="relative">
                  <img 
                    src={previews.idFront} 
                    alt="Frente do RG" 
                    className="mx-auto max-h-48 rounded"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <Check size={16} />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateDocumentData({ idFront: null });
                      setPreviews(prev => {
                        const newPreviews = { ...prev };
                        delete newPreviews.idFront;
                        return newPreviews;
                      });
                    }}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Trocar imagem
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="idFront"
                      className="relative cursor-pointer bg-blue-600 py-2 px-4 rounded-lg text-white font-medium hover:bg-blue-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Selecionar arquivo</span>
                      <input
                        id="idFront"
                        name="idFront"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileChange('idFront')}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, GIF até 5MB
                  </p>
                </div>
              )}
            </div>
            {errors.idFront && <p className="text-red-500 text-sm mt-1">{errors.idFront}</p>}
          </div>
          
          {/* RG Verso */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Foto do verso do RG <span className="text-red-500">*</span>
            </label>
            <div className={`border-2 border-dashed rounded-lg p-4 ${
              errors.idBack ? 'border-red-500' : previews.idBack ? 'border-green-500' : 'border-gray-300'
            }`}>
              {previews.idBack ? (
                <div className="relative">
                  <img 
                    src={previews.idBack} 
                    alt="Verso do RG" 
                    className="mx-auto max-h-48 rounded"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <Check size={16} />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateDocumentData({ idBack: null });
                      setPreviews(prev => {
                        const newPreviews = { ...prev };
                        delete newPreviews.idBack;
                        return newPreviews;
                      });
                    }}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Trocar imagem
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="idBack"
                      className="relative cursor-pointer bg-blue-600 py-2 px-4 rounded-lg text-white font-medium hover:bg-blue-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Selecionar arquivo</span>
                      <input
                        id="idBack"
                        name="idBack"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileChange('idBack')}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, GIF até 5MB
                  </p>
                </div>
              )}
            </div>
            {errors.idBack && <p className="text-red-500 text-sm mt-1">{errors.idBack}</p>}
          </div>
          
          {/* Selfie com documento */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Selfie segurando o RG <span className="text-red-500">*</span>
            </label>
            <div className={`border-2 border-dashed rounded-lg p-4 ${
              errors.selfie ? 'border-red-500' : previews.selfie ? 'border-green-500' : 'border-gray-300'
            }`}>
              {previews.selfie ? (
                <div className="relative">
                  <img 
                    src={previews.selfie} 
                    alt="Selfie com documento" 
                    className="mx-auto max-h-48 rounded"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <Check size={16} />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateDocumentData({ selfie: null });
                      setPreviews(prev => {
                        const newPreviews = { ...prev };
                        delete newPreviews.selfie;
                        return newPreviews;
                      });
                    }}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Trocar imagem
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="selfie"
                      className="relative cursor-pointer bg-blue-600 py-2 px-4 rounded-lg text-white font-medium hover:bg-blue-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Selecionar arquivo</span>
                      <input
                        id="selfie"
                        name="selfie"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileChange('selfie')}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, GIF até 5MB
                  </p>
                </div>
              )}
            </div>
            {errors.selfie && <p className="text-red-500 text-sm mt-1">{errors.selfie}</p>}
          </div>
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
        <p className="text-gray-500 text-xs">
          Suas informações são protegidas e usadas apenas para verificar sua identidade.
          Não compartilhamos seus documentos com terceiros.
        </p>
      </div>
    </div>
  );
};

export default DocumentUploadStep;