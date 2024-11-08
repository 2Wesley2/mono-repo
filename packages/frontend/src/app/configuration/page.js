'use client';
import { useState, useCallback, useEffect } from 'react';
import CashbackList from '../../components/CashbackList';
import CashbackForm from '../../components/CashbackForm';
import CashbackDetails from '../../components/CashbackDetails';
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
  }, []);

  useEffect(() => {
    loadCashback();
  }, [loadCashback]);

  const handleNextStep = () => {
    setStep((prev) => {
      return prev + 1;
    });
  };

  const handlePreviousStep = () => {
    setStep((prev) => {
      return prev - 1;
    });
  };

  const handleSelectCashback = (cashback) => {
    setSelectedCashback(cashback);
    setStep2Mode('details');
    handleNextStep();
  };

  const handleCreateCashback = () => {
    setSelectedCashback(null);
    setStep2Mode('form');
    setStep(2);
  };

  const handleEditCashback = () => {
    setStep2Mode('form');
    setStep(3);
  };

  return (
    <div>
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
        <CashbackForm
          cashback={selectedCashback}
          onBack={() => {
            setStep(1);
            setSelectedCashback(null);
          }}
        />
      )}
      {step === 3 && step2Mode === 'form' && (
        <CashbackForm
          cashback={selectedCashback}
          onBack={() => {
            setStep(2);
            setStep2Mode('details');
          }}
        />
      )}
    </div>
  );
};

export default CashbackConfiguration;
