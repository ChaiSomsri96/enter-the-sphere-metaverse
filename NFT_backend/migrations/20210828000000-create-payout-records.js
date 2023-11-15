"use strict";
module.exports={
	up: async(query, DataTypes)=>{
		await query.createTable('payoutrecords',{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
			},
			createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
			done: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},

			marketplace: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			marketplacetxkey: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			sphereuserid: {
				type: DataTypes.UUID,
				allowNull: false,
			},

			tokenid: {
				type: DataTypes.STRING,
				allowNull: false,
			},

			marketplacepayload: {
				type: DataTypes.TEXT,
				allowNull: false,
			},

			payouttx: DataTypes.STRING,
		})
	},
	down: async(query, DataTypes)=>{
		await query.dropTable('payoutrecords');
	},
}
