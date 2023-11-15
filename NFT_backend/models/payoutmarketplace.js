const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes)=>{
	class PayoutMarketplace extends Model {
	}

	PayoutMarketplace.init({
		tokenid: DataTypes.STRING,
		sphereuserid: DataTypes.STRING,
		marketplacepayload: DataTypes.TEXT,
		marketplacetxkey: DataTypes.STRING,
		marketplace: DataTypes.STRING,
		payouttx: DataTypes.STRING,
		done: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
		},
	},{
		sequelize, 
		modelName: 'PayoutMarketplace',
		tableName: 'payoutrecords',
	});

	return PayoutMarketplace;
}
