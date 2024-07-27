const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Cart = require('./cart');

const Order = sequelize.define('Order', {
    orederID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cartID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cart,
            key: 'cartID'
        }
    },
    Harga: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

Order.belongsTo(Cart, { foreignKey: 'cartID' });
Cart.hasOne(Order, { foreignKey: 'cartID' });

module.exports = Order;