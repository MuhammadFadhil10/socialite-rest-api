import db from '../database/db.js';

export default class User {
	static create(userName, email, password) {
		return db.execute(
			`INSERT INTO user (user_name,email,password) VALUES (?,?,?)`,
			[userName, email, password]
		);
	}

	static findAll() {
		return db.execute(`SELECT * FROM user`);
	}

	static findByEmail(email) {
		return db.execute(`SELECT * FROM user WHERE email = '${email}'`);
	}

	static findByUsername(userName) {
		return db.execute(`SELECT * FROM user WHERE user_name = '${userName}'`);
	}

	static findById(userId) {
		return db.execute(`SELECT * FROM user WHERE user_id = ${userId}`);
	}

	static searchPerStrings(strings) {
		return db.query(`SELECT * FROM user WHERE user_name like '${strings}%'`);
	}

	static updateProfile(oldUserName, userName, name, profilePicture, bio, web) {
		return db.execute(
			`UPDATE user SET user_name = '${userName}', name= '${name}', profile_picture = '${profilePicture}', bio = '${bio}',web = '${web}' where user_name = '${oldUserName}'`
		);
	}
}
