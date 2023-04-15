import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";

class Chat extends Model<InferAttributes<Chat>, InferCreationAttributes<Chat>> {
  declare id: number;
  declare name: string;
  declare description: CreationOptional<string>;
}

const initChat = (sequelize: Sequelize): void => {
  Chat.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(16),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
    },
    {
      modelName: "Chat",
      sequelize,
    }
  );
};

export { Chat, initChat };
