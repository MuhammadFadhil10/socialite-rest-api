import mysql2 from 'mysql2';

const pool = mysql2.createPool({
	user: 'jkyylcyemnjwbg',
	host: 'ec2-44-206-89-185.compute-1.amazonaws.com',
	password: '4c749be0c05b0a4b2d657e10c78b929c9ddac3ab5935ee96920e47fb89d796c1',
	database: 'd9t6p0rju5qe1d',
	port: 5432,
});

export default pool.promise();
