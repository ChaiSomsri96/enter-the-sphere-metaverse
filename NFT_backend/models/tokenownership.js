const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes)=>{

	class TokenOwnership extends Model {
	
	}

	TokenOwnership.init(
		{
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
			},

			tokenId: DataTypes.STRING,

			userId: {
				type: DataTypes.UUID,
				allowNull: false,
			},

			marketplaceUserId: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			price: DataTypes.STRING,
			listed: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},

			completed: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
			marketplace: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			depositedAt: {
				type: DataTypes.BIGINT,
				allowNull: false,
			},
			depositedTo: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			depositedFrom: {
				type: DataTypes.STRING,
				allowNull: false,
			},

		},

		{
			sequelize,
			modelName: "TokenOwnership",
			tableName: "tokenownerships",
		}

	);

	return TokenOwnership;

};
