export default class Session {
  constructor({ session }) {
    this.session = session.openByUser;
  }
}
