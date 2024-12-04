import {
  loadFromLocalStorage,
  saveToLocalStorage,
  clearLocalStorage,
} from '../utils/storageUtils';
import { OrderService } from '../service';

const expectedKeys = ['totalAmount', 'products'];

async function initializeCurrentOrder(orderNumber) {
  console.log('[initializeCurrentOrder] Iniciando execução...');
  const hasValidLocalStorageData = loadFromLocalStorage('currentOrder');
  if (
    hasValidLocalStorageData &&
    hasValidLocalStorageData.orderNumber === orderNumber
  ) {
    console.log('[initializeCurrentOrder] Dados encontrados no localStorage.');

    try {
      const isValid = validateCurrentOrderStructure(
        hasValidLocalStorageData,
        expectedKeys,
      );
      if (!isValid) {
        console.error(
          '[initializeCurrentOrder] Dados corrompidos no localStorage. Limpando...',
        );
        clearLocalStorage('currentOrder');
        return { error: 'estrutura de dados corrompida' };
      }

      console.log('[initializeCurrentOrder] Dados válidos. Retornando...');
      return hasValidLocalStorageData;
    } catch (error) {
      console.error(
        '[initializeCurrentOrder] Erro ao validar dados do localStorage:',
        error,
      );
      clearLocalStorage('currentOrder');
      return { error: 'dados no localStorage inválidos' };
    }
  } else {
    console.log(
      '[initializeCurrentOrder] Nenhum dado encontrado no localStorage. Fazendo fetch...',
    );
    try {
      const currentOrder = await OrderService.listProductsByOrder(orderNumber);
      if (
        !currentOrder ||
        !validateCurrentOrderStructure(currentOrder, expectedKeys)
      ) {
        console.error(
          '[initializeCurrentOrder] Fetch retornou dados inválidos.',
        );
        return { error: 'erro ao buscar dados da order do endpoint' };
      }

      console.log(
        '[initializeCurrentOrder] Dados encontrados. Salvando no localStorage...',
      );
      saveToLocalStorage('currentOrder', { ...currentOrder, orderNumber });

      console.log('[initializeCurrentOrder] Dados salvos e retornados.');
      return { ...currentOrder, orderNumber };
    } catch (error) {
      console.error(
        '[initializeCurrentOrder] Erro ao buscar dados do endpoint:',
        error,
      );
      return { error: 'erro ao buscar dados da order do endpoint' };
    }
  }
}

function validateCurrentOrderStructure(data, keys) {
  return keys.every((key) => Object.prototype.hasOwnProperty.call(data, key));
}

export default initializeCurrentOrder;
