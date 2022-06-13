import mysql2 from 'mysql2';

const pool = mysql2.createPool({
    user: 'root',
    host: 'localhost',
    password: 'Fadhil1010',
    database: 'social_media'
});

export default pool.promise();
