'use client';
import { useState, useCallback, useEffect } from 'react';
import CashbackList from '../../components/cashback/CashbackList';
import CashbackForm from '../../components/cashback/CashbackForm';
import CashbackDetails from '../../components/cashback/CashbackDetails';
import { getAllCashbacks } from '../../service/cashback';

const CashbackConfiguration = () => {
  const [step, setStep] = useState(1);
  const [cashbacks, setCashbacks] = useState([]);
  const [selectedCashback, setSelectedCashback] = useState(null);
  const [step2Mode, setStep2Mode] = useState(null);

  const loadCashback = useCallback(async () => {
    try {
      const cashbackList = await getAllCashbacks();
      setCashbacks(cashbackList);
    } catch (error) {
      console.error('Erro ao carregar cashbacks:', error);
    }
  }, [cashbacks]);

  useEffect(() => {
    loadCashback();
  }, [loadCashback]);

  const handleNextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handlePreviousStep = useCallback(() => {
    setStep((prev) => prev - 1);
  }, []);

  const handleSelectCashback = useCallback(
    (cashback) => {
      setSelectedCashback(cashback);
      setStep2Mode('details');
      handleNextStep();
    },
    [handleNextStep],
  );

  const handleCreateCashback = useCallback(() => {
    setSelectedCashback(null);
    setStep2Mode('form');
    setStep(2);
  }, []);

  const handleEditCashback = useCallback(() => {
    setStep2Mode('form');
    setStep(3);
  }, []);

  const handleBackToStep1 = useCallback(() => {
    setStep(1);
    setSelectedCashback(null);
  }, []);

  const handleBackToDetails = useCallback(() => {
    setStep(2);
    setStep2Mode('details');
  }, []);

  return (
    <>
      {step === 1 && (
        <CashbackList
          cashbacks={cashbacks}
          onSelectCashback={handleSelectCashback}
          onCreateCashback={handleCreateCashback}
        />
      )}
      {step === 2 && step2Mode === 'details' && selectedCashback && (
        <CashbackDetails
          cashback={selectedCashback}
          onBack={handlePreviousStep}
          onEdit={handleEditCashback}
        />
      )}
      {step === 2 && step2Mode === 'form' && (
        <CashbackForm cashback={selectedCashback} onBack={handleBackToStep1} />
      )}
      {step === 3 && step2Mode === 'form' && (
        <CashbackForm
          cashback={selectedCashback}
          onBack={handleBackToDetails}
        />
      )}
    </>
  );
};

export default CashbackConfiguration;
