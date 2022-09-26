const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/connection");

const Room = sequelize.define("Room", {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        unique: true
    },
    room_code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            async isAlreadyActive(value) {
                const rooms = await Room.findAll({
                    where: {
                        room_code: value,
                        active_ind: true
                    }
                })
                if (rooms.length > 0) {
                    throw new Error("Cannot have two active rooms with same room code")
                }
            }
        }
    },
    owner: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            async userHasRoom(value) {
                const rooms = await Room.findAll({
                    where: {
                        owner: value,
                        active_ind: true
                    }
                });
                if (rooms.length > 0) {
                    throw new Error("Cannot have two active rooms for one user")
                }
            }
        }
    },
    users: {
        type: DataTypes.JSON,
        allowNull: true
    },
    active_ind: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
},
    {
        sequelize,
        timestamps: true,
        createdAt: "created_tmstmp",
        updatedAt: "updated_tmstmp"
    }
)

module.exports = Room;