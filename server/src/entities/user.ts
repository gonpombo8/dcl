export interface UsersRepository {
  getByAddress(address: User['address'][]): Promise<User[]>;
  getByPosition(position: Position): Promise<User[]>;
  upsertMulti(users: User[]): Promise<User[]>;
  updateDisconnected(addresses: User['address'][]): Promise<void>;
}

export interface Position {
  x: number;
  y: number;
}

export interface User {
  address: string;
  x: Position['x'];
  y: Position['y'];
  disconnected: boolean;
}