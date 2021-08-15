const {Sequelize, DataTypes} = require('sequelize')

const db = new Sequelize('postgres://username:password@localhost:5432/dbname')

const SalesTable = db.define('SalesTable', {
    userName : {
        type : DataTypes.STRING
    },
    amount : {
        type : DataTypes.STRING
    },
    date : {
        type : DataTypes.STRING
    },
    ts : {
        type : DataTypes.STRING
    }
})

SalesTable.sync()

try {
    db.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

module.exports = SalesTable