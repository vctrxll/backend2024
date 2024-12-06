const userQueries = {
    getAll: 'SELECT * FROM users',
    getById: 'SELECT * FROM users WHERE id = ?',
    getByEmail: 'SELECT * FROM users WHERE email = ?',
    create: 'INSERT INTO users (first_name, last_name, email, password) VALUES (?,?,?,?)',
    editUser: 'UPDATE users SET first_name=?, last_name=?, email=? WHERE id=?',
    emailvalid: 'SELECT * FROM users WHERE email = ? AND id <> ?',
    deleteUser: 'DELETE FROM users WHERE id=?'
}

module.exports = {userQueries};