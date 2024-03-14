import { User } from "../../models/user.ts";
import { pentagon } from "../pentagon.ts";

export const users = {
  async insert(user: User) {
    const res = await pentagon.users.create({ data: user });

    return res;
  },
  async get_by_id(id: string) {
    const res = await pentagon.users.findFirst({ where: { id } });

    return res;
  },
  async get_by_sub(sub: string) {
    const res = await pentagon.users.findFirst({ where: { sub } });

    return res;
  },
};
