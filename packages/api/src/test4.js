import Database from './database/index.js';
import RewardModel from './resources/modules/reward/RewardModel.js';
import RewardRepository from './resources/modules/reward/RewardRepository.js';
import RewardService from './resources/modules/reward/RewardService.js';
import RewardController from './resources/modules/reward/RewardController.js';
import CustomerModel from './resources/modules/customer/CustomerModel.js';
import CalcRefModel from './resources/modules/calcRef/CalcRefModel.js';
const customerData = {
  name: 'João Silva',
  cpf: '123.456.789-00',
  email: 'joao.silva@email.com',
  phone: '+5511987654321',
};

const customerId = '67573ddeed0dbe734eaaebd2';
const test = async () => {
  try {
    await Database.connect();
    console.log('Conectado ao banco de dados.');
    const customerModel = new CustomerModel();
    //const calcRefModel = new CalcRefModel();
    //const rewardModel = new RewardModel();
    //const rewardRepository = new RewardRepository(rewardModel);
    //const rewardService = new RewardService(rewardRepository, calcRefModel);
    //const rewardController = new RewardController(rewardService);
    const get = await customerModel.findDuplicatesByField('email');
    console.log(JSON.stringify(get));
    await Database.disconnect();
    console.log('Conexão encerrada.');
  } catch (err) {
    console.error('Erro durante o teste:', err);
  }
};

test();
