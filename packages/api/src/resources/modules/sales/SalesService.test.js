import SalesService from './SalesService';
import { jest } from '@jest/globals';

describe('SalesService', () => {
  let salesService;
  let mockRepository;
  let mockTicketService;
  let mockCustomerRepository;
  let mockNotificationService;
  let mockCashbackService;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
    };
    mockTicketService = {
      create: jest.fn(),
    };
    mockCustomerRepository = {
      addPurchaseToHistory: jest.fn(),
      updateLifetimeValue: jest.fn(),
    };
    mockNotificationService = {
      sendToAllChannels: jest.fn(),
      register: jest.fn(),
    };
    mockCashbackService = {
      findActiveCashback: jest.fn(),
    };

    salesService = new SalesService(
      mockRepository,
      mockTicketService,
      mockCustomerRepository,
      mockNotificationService,
      mockCashbackService,
    );

    salesService._prepareSaleData = jest.fn();
    salesService._updateCustomerData = jest.fn();
    salesService.generateTicketIfEligible = jest.fn();
    salesService._handleNewTicketNotification = jest.fn();
  });

  describe('create', () => {});
});
