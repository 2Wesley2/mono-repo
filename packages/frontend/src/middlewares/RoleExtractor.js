
class RoleExtractor {
  constructor(tokenValidator) {
    this.tokenValidator = tokenValidator;
  }

  async extractRole(token) {
    const payload = await this.tokenValidator.getPayload(token);
    if (payload?.role && typeof payload.role === 'string') {
      console.log('Role extraído com sucesso.', 'INFO', { role: payload.role });
      return payload.role;
    }
    console.log('Falha ao extrair role do token ou role não presente.', 'WARN');
    return null;
  }
}
export default RoleExtractor;