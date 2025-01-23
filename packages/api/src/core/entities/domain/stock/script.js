import mongoose from 'mongoose';
import Database from '../../../infrastructure/database/index.js';
import UserModel from '../../../../resources/modules/user/base/UserModel.js';
import RoleModel from '../../../../resources/modules/auth/role/RoleModel.js';
import BackStockModel from '../../../../resources/modules/logistics/backStock/BackStockModel.js';
import ShowRoomModel from '../../../../resources/modules/logistics/showRoom/ShowRoomModel.js';
//import { authorizationService } from '../src/services/auth/authorization/index.js';
import loaders from '../../../loaders/index.js';
const test = async () => {
  console.log(' iniciando');

  try {
    console.log('Database iniciando');
    await Database.connect();
    console.log('Database instanciado');
    const userModel = new UserModel();
    console.log('userModel instanciado');
    const userData = {
      username: 'wesley',
      password: 'admin',
      role: ['677700456617d8a4134ab1cb'].map((id) => new mongoose.Types.ObjectId(id)),
    };
    const createdUser = await userModel.createUser(userData);
    console.log(createdUser);
    await Database.disconnect();
    console.log('Conexão encerrada.');
  } catch (err) {
    console.error('Erro durante o teste:', err);
  }
};

const test2 = async () => {
  console.log(' iniciando');

  try {
    console.log('Database iniciando');
    await Database.connect();
    console.log('Database instanciado');
    const roleModel = new RoleModel();
    console.log('roleModel instanciado');
    const roleData = {
      name: 'admin',
      permissions: ['6776fa3aae7ee3d7c505088b'].map((id) => new mongoose.Types.ObjectId(id)),
    };
    const createdRole = await roleModel.createRole(roleData);
    console.log(createdRole);
    await Database.disconnect();
    console.log('Conexão encerrada.');
  } catch (err) {
    console.error('Erro durante o teste:', err);
  }
};

const test3 = async () => {
  console.log(' iniciando');

  try {
    console.log('Database iniciando');
    await Database.connect();
    const authorized = await authorizationService.authorize('677700dfba541b06774c1808', 'create_user');
    console.log(`resultado: ${authorized}`);
    await Database.disconnect();
    console.log('Conexão encerrada.');
  } catch (err) {
    console.error('Erro durante o teste:', err);
  }
};

const test4 = async () => {
  console.log(' iniciando');

  try {
    console.log('Database iniciando');
    await Database.connect();
    console.log('criando ShowRoom');
    const showRoomModel = new ShowRoomModel();
    const data = {
      products: [
        {
          product: ['6745d9d3f7c376f561ad14ea'].map((id) => new mongoose.Types.ObjectId(id)),
          quantity: 100,
        },
        {
          product: ['6745d9d3f7c376f561ad14f8'].map((id) => new mongoose.Types.ObjectId(id)),
          quantity: 250,
        },
      ],
    };
    const insert = await showRoomModel.createShowRoom(data);
    console.log(JSON.stringify(insert));
    await Database.disconnect();
    console.log('Conexão encerrada.');
  } catch (err) {
    console.error('Erro durante o teste:', err);
  }
};

const test5 = async () => {
  console.log('Iniciando o teste do mergeduplicate');

  try {
    const data = {
      products: [
        {
          product: new mongoose.Types.ObjectId('6745d9d3f7c376f561ad14ea'),
          quantity: 10,
        },
        {
          product: new mongoose.Types.ObjectId('6745d9d3f7c376f561ad14f8'),
          quantity: 25,
        },
        {
          product: new mongoose.Types.ObjectId('6745d9d3f7c376f561ad14ea'),
          quantity: 10,
        },
        {
          product: new mongoose.Types.ObjectId('6745d9d3f7c376f561ad14f8'),
          quantity: 25,
        },
      ],
    };
    const mergeduplicate = loaders.stock.extractedProductIds(data.products);
    return mergeduplicate;
  } catch (err) {
    console.error('Erro durante o teste do ShowRoom:', err.message);
    console.error(err.stack);
  } finally {
    console.log('Encerrando a conexão com o banco de dados...');
    await Database.disconnect();
    console.log('Conexão com o banco de dados encerrada.');
  }
};

test5();
