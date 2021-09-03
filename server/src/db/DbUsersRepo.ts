import { IMain } from "pg-promise";

import { Position, User, UsersRepository } from "../entities/types";
import { Database } from "./database";

const TABLE = "users";

export function createUserRepo(db: Database, pg: IMain): UsersRepository {
  return {
    async getByAddress(addresses: User['address'][]) {
       return db.manyOrNone(
        'SELECT * FROM USERS WHERE "address" IN ($1:csv)',
        [addresses]
      );
    },

    async getByPosition(position: Position) {
      return db.manyOrNone(
        'SELECT * FROM USERS WHERE "x" = $1 and "y" = $2 AND "disconnected" = $3',
        [position.x, position.y, false],
      );
    },

    async upsertMulti(users: User[]) {
      const fields: (keyof User)[] = ['address', 'x', 'y', 'disconnected'];
      const cs = new pg.helpers.ColumnSet(
        fields,
        { table: new pg.helpers.TableName({ table: TABLE}) },
      );
      const query = pg.helpers.insert(users, cs) +
        ' ON CONFLICT(address) DO UPDATE SET ' +
        cs.assignColumns({ from: 'EXCLUDED', skip: 'address' });

      await db.none(query);

      return users;
    },

    async updateDisconnected(addresses: User['address'][]) {
      const values: Pick<User, 'address'|'disconnected'>[] = addresses.map(
        address => ({ address, disconnected: true })
      );
      const fields = ['?address', 'disconnected'];
      const cs = new pg.helpers.ColumnSet(
        fields,
        { table: new pg.helpers.TableName({ table: TABLE }) },
      );
      const query = pg.helpers.update(values, cs) + ' WHERE v.address = t.address';

      await db.none(query);
    },
  };
}
