import {Book, Answer, AuthorConnection, User, Prejudice} from '~/graphql';
import {Connection} from '~/common/common.entities';

export {Correctness} from '~/graphql';

export type AnswerEntity = Omit<Answer, 'prejudice'>;
export class PrejudiceConnection extends Connection<AnswerEntity> {}
