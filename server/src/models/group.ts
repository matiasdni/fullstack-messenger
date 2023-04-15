import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import { Message } from "./message";

class Group extends Model<
  InferAttributes<Group>,
  InferCreationAttributes<Group>
> {
  declare id: number;
  declare name: string;
  declare description: string;
  declare messages: NonAttribute<Message>[] | Message[];
}

const initGroup = (sequelize: Sequelize): void => {
  Group.init(
    {
      messages: {
        type: DataTypes.VIRTUAL,
        get(this: Group) {
          return this.messages;
        },
      },
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
    },
    {
      hooks: {
        beforeCreate: (group: Group) => {
          if (!group.description) group.description = null;
        },
      },
      modelName: "Group",
      sequelize,
    }
  );
};

export { Group, initGroup };
