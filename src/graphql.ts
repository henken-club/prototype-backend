
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum Correctness {
    CORRECT = "CORRECT",
    PARTLY_CORRECT = "PARTLY_CORRECT",
    INCORRECT = "INCORRECT"
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

export interface CreatePrejudiceInput {
    to: string;
    title: string;
    relatedBooks: string[];
}

export interface Answer {
    id: string;
    createdAt: DateTime;
    correctness: Correctness;
    text?: string;
    prejudice: Prejudice;
}

export interface AnswerConnection {
    nodes: Answer[];
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
    createPrejudice(input: CreatePrejudiceInput): Prejudice | Promise<Prejudice>;
}

export interface PageInfo {
    startCursor?: string;
    endCursor?: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface Prejudice {
    id: string;
    title: string;
    createdAt: DateTime;
    book: Book;
    from: User;
    to: User;
    answer?: Answer;
    relatedBooks: BookConnection;
}

export interface PrejudiceConnection {
    nodes: Prejudice[];
}

export interface User {
    id: string;
    alias: string;
    displayName?: string;
    following?: UserConnection;
    followers?: UserConnection;
    postPreduices: PrejudiceConnection;
    recievedPreduices: PrejudiceConnection;
    postAnswers: AnswerConnection;
}

export interface UserConnection {
    nodes: User[];
}

export type DateTime = Date;
