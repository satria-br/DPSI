const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Product = require('./produk');

const Cart = sequelize.define('Cart', {
    cartID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    productID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'productID'
        }
    },
    jumlah: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

Cart.belongsTo(Product, { foreignKey: 'productID' });
Product.hasMany(Cart, { foreignKey: 'productID' });

module.exports = Cart;