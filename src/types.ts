export interface UserData {
  cpf: string;
  annualSpending: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface DocumentData {
  idFront: File | null;
  idBack: File | null;
  selfie: File | null;
}

export interface BankData {
  bankName: string;
  accountType: string;
  agency: string;
  account: string;
  accountDigit: string;
}

export interface FormState {
  step: number;
  userData: UserData;
  documentData: DocumentData;
  bankData: BankData;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  claimId: string | null;
}