import {
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
    },
    {
      modelName: "GroupMember",
      sequelize,
    }
  );
};

export { GroupMember, initGroupMember };
