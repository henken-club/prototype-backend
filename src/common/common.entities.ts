export abstract class Connection<T> {
  nodes!: T[];
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}
