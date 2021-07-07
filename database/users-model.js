const db = require('./config');

function find() {
    return db("users").select('id', 'username');
};

function findBy(filter){
    return db('users')
        .where(filter);
};

function findById(id) {
    return db('users')
        .where({id})
        .select('id', 'username', 'password')
        .first();
};

async function add(user) {
    const [id] = await db('users').insert(user);

    return findById(id);
};

module.exports = {
    add, 
    find,
    findBy,
    findById
};