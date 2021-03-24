class Properties {
  constructor() {}
  getProperties(callback) {
    let cred = {
      host: "localhost",
      user: "root",
      password: "root",
      //database: "dashboard",
      database: "dash", //amb15
      // database: "try",
    };
    callback(cred);
  }
}
module.exports = Properties;
