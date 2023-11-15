"use strict";
module.exports={
	up: async(query, DataTypes)=>{
	
		await query.createTable("tokenownerships",{
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

			createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

		})
	}
}
