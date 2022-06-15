import mysql2 from 'mysql2';

const pool = mysql2.createPool({
	user: '	sql6499852',
	host: 'sql6.freemysqlhosting.net',
	password: 'wSLMiByuyP',
	database: 'sql6499852',
});

export default pool.promise();
