import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { User } from "./user";
import { Group } from "./group";

class GroupMember extends Model<
  InferAttributes<GroupMember>,
  InferCreationAttributes<GroupMember>
> {
  declare user_id: ForeignKey<User["id"]>;
  declare group_id: ForeignKey<Group["id"]>;
  declare created_at: CreationOptional<Date>;
}

const initGroupMember = (sequelize: Sequelize): void => {
  GroupMember.init(
    {
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      group_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
      },
    },
    {
      modelName: "GroupMember",
      sequelize,
    }
  );
};

export { GroupMember, initGroupMember };
