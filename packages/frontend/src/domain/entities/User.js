class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  changeEmail(newEmail) {
    if (!this.validateEmail(newEmail)) {
      throw new Error('Email inválido');
    }
    this.email = newEmail;
  }

  validateEmail(email) {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }
}

export default User;
