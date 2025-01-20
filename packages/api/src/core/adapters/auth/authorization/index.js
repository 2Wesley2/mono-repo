import { isString } from '../../../../helpers/stringHelper.js';

class Authorization {
  static authorize(permission, permissions) {
    if (!isString(permission) || !isString(permissions)) {
      throw new TypeError('os tipos para permission e permissions requerem uma string');
    }
    try {
      const permissionsSet = new Set(permissions);
      return permissionsSet.has(permission);
    } catch (error) {
      console.error(`[Authorization] Erro durante o fluxo de autorização: ${error.message}`);
      throw error;
    }
  }
}
export default { authorize: (...args) => Authorization.authorize(...args) };
