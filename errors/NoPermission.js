module.exports = class NoPermission extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
};
