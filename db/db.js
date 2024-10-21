import mysql from 'mysql';

const connectionPool = mysql.createPool({
  connectionLimit: 10,
  database: 'webprog',
  host: 'localhost',
  multipleStatements: true,
  port: 3307,
  user: 'webprog',
  password: 'VgJUjBd8',
  enableKeepAlive: true,
});

export function executeQuery(query, options = []) {
  return new Promise((resolve, reject) => {
    connectionPool.query(query, options, (err, res) => {
      if (err) {
        reject(new Error(`Error while executing ${query}: ${err}`));
      }
      resolve(res);
    });
  });
}
