import {Book, Answer, AuthorConnection, User, Prejudice} from '~/graphql';
import {Connection} from '~/common/common.entities';

export {Correctness, AnswerOrder, AnswerOrderField} from '~/graphql';

export type AnswerEntity = Omit<Answer, 'prejudice'>;
export class AnswerConnection extends Connection<AnswerEntity> {}
