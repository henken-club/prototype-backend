export {OrderDirection} from '~/graphql';

export abstract class Connection<T> {
  nodes!: T[];
}
