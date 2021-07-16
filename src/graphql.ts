
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

export interface PostAnswerInput {
    prejudiceId: string;
}

export interface LoginInput {
    alias: string;
    password: string;
}

export interface SignupInput {
    alias: string;
    displayName: string;
    password: string;
}

export interface AuthorOrder {
    direction: OrderDirection;
    field: AuthorOrderField;
}

export interface AddAuthorInput {
    name: string;
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

export interface PostPrejudiceInput {
    userId: string;
    title: string;
    relatedBooks: string[];
}

export interface FollowUserInput {
    userId: string;
}

export interface UnfollowUserInput {
    userId: string;
}

export interface Answer {
    id: string;
    createdAt: DateTime;
    correctness: Correctness;
    text?: string;
    prejudiceTo: Prejudice;
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
    viewer(): User | Promise<User>;
}

export interface IMutation {
    postAnswer(input: PostAnswerInput): PostAnswerPayload | Promise<PostAnswerPayload>;
    login(input: LoginInput): LoginPayload | Promise<LoginPayload>;
    signup(input: SignupInput): SignupPayload | Promise<SignupPayload>;
    addAuthor(input: AddAuthorInput): AddAuthorPayload | Promise<AddAuthorPayload>;
    addBook(input: AddBookInput): AddBookPayload | Promise<AddBookPayload>;
    postPrejudice(input: PostPrejudiceInput): PostPrejudicePayload | Promise<PostPrejudicePayload>;
    followUser(input: FollowUserInput): FollowUserPayload | Promise<FollowUserPayload>;
    unfollowUser(input: UnfollowUserInput): UnfollowUserPayload | Promise<UnfollowUserPayload>;
}

export interface PostAnswerPayload {
    answer: Answer;
}

export interface LoginPayload {
    accessToken: string;
}

export interface SignupPayload {
    accessToken: string;
}

export interface Author {
    id: string;
    name: string;
    userResponsibleFor: User[];
    booksWrited: BookConnection;
}

export interface AuthorConnection {
    nodes: Author[];
}

export interface AddAuthorPayload {
    author: Author;
}

export interface Book {
    id: string;
    title: string;
    userResponsibleFor: User[];
    authors: AuthorConnection;
}

export interface BookConnection {
    nodes: Book[];
}

export interface AddBookPayload {
    book: Book;
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
    userFrom: User;
    userTo: User;
    answer?: Answer;
    relatedBooks: BookConnection;
}

export interface PrejudiceConnection {
    nodes: Prejudice[];
}

export interface PostPrejudicePayload {
    prejudice: Prejudice;
}

export interface User {
    id: string;
    alias: string;
    displayName?: string;
    following: FollowingConnection;
    followers: FollowerConnection;
    prejudicesPosted: PrejudiceConnection;
    preduicesRecieved: PrejudiceConnection;
    answersPosted: AnswerConnection;
}

export interface UserConnection {
    nodes: User[];
    totalCount: number;
}

export interface FollowingConnection {
    nodes: User[];
    totalCount: number;
}

export interface FollowerConnection {
    nodes: User[];
    totalCount: number;
}

export interface Follow {
    from: User;
    to: User;
}

export interface Unfollow {
    from: User;
    to: User;
}

export interface FollowUserPayload {
    follow: Follow;
}

export interface UnfollowUserPayload {
    unfollow: Unfollow;
}

export type DateTime = Date;
