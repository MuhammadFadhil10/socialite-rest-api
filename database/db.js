import mysql2 from 'mysql2';

const pool = mysql2.createPool({
	user: 'admin',
	host: 'mysql-80362-0.cloudclusters.net',
	password: 'bDhzV75E',
	database: 'socialite',
	port: 19539,
});

export default pool.promise();
