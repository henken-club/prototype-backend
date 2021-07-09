import {Book, AuthorConnection} from '~/graphql';
import {Connection} from '~/common/common.entities';

export {BookOrder, BookOrderField, AddBookInput} from '~/graphql';

export type BookEntity = Omit<Book, 'authors'>;
export class BookConnection extends Connection<BookEntity> {}
