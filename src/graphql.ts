
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum AnswerStatus {
    ALREADY_READ = "ALREADY_READ",
    READING = "READING",
    UNREAD = "UNREAD"
}

export enum AnswerOrderField {
    CREATED_AT = "CREATED_AT"
}

export enum AuthorOrderField {
    NAME = "NAME"
}

export enum BookOrderField {
    TITLE = "TITLE"
}

export enum OrderDirection {
    ASC = "ASC",
    DESC = "DESC"
}

export enum PrejudiceOrderField {
    CREATED_AT = "CREATED_AT"
}

export interface AnswerOrder {
    direction: OrderDirection;
    field: AnswerOrderField;
}

export interface AuthorOrder {
    direction: OrderDirection;
    field: AuthorOrderField;
}

export interface BookOrder {
    direction: OrderDirection;
    field: BookOrderField;
}

export interface AddBookInput {
    title: string;
}

export interface PrejudiceOrder {
    direction: OrderDirection;
    field: PrejudiceOrderField;
}

export interface Answer {
    id: string;
    createdAt: DateTime;
    status: AnswerStatus;
    text: string;
    prejudice: Prejudice;
}

export interface AnswerEdge {
    cursor: string;
    node: Answer;
}

export interface AnswerConnection {
    edges: AnswerEdge[];
    nodes: Answer[];
    pageInfo?: PageInfo;
}

export interface IQuery {
    answer(id: string): Answer | Promise<Answer>;
    author(id: string): Author | Promise<Author>;
    book(id: string): Book | Promise<Book>;
    prejudice(id: string): Prejudice | Promise<Prejudice>;
    user(alias: string): User | Promise<User>;
}

export interface Author {
    id: string;
    name: string;
    writedBooks: BookConnection;
}

export interface AuthorConnection {
    nodes: Author[];
}

export interface Book {
    id: string;
    title: string;
    authors: AuthorConnection;
}

export interface BookConnection {
    nodes: Book[];
}

export interface IMutation {
    addBook(input: AddBookInput): Book | Promise<Book>;
}

export interface PageInfo {
    startCursor?: string;
    endCursor?: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface Prejudice {
    id: string;
    createdAt: DateTime;
    book: Book;
    userFrom: User;
    userTo: User;
    answer?: Answer;
}

export interface PrejudiceEdge {
    cursor: string;
    node: Prejudice;
}

export interface PrejudiceConnection {
    edges: PrejudiceEdge[];
    nodes: Prejudice[];
    pageInfo?: PageInfo;
}

export interface User {
    id: string;
    alias: string;
    name?: string;
    following?: UserConnection;
    followers?: UserConnection;
    postPreduices?: PrejudiceConnection;
    recievedPreduices?: PrejudiceConnection;
    postAnswers?: AnswerConnection;
    recievedAnswers?: AnswerConnection;
}

export interface UserEdge {
    cursor: string;
    node: User;
}

export interface UserConnection {
    edges: UserEdge[];
    nodes: User[];
    pageInfo?: PageInfo;
}

export type DateTime = Date;
