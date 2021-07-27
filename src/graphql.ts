
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum AnswerOrderField {
    CREATED_AT = "CREATED_AT"
}

export enum AuthorOrderField {
    NAME = "NAME"
}

export enum BookOrderField {
    TITLE = "TITLE"
}

export enum Correctness {
    CORRECT = "CORRECT",
    INCORRECT = "INCORRECT",
    PARTLY_CORRECT = "PARTLY_CORRECT"
}

export enum OrderDirection {
    ASC = "ASC",
    DESC = "DESC"
}

export enum PrejudiceOrderField {
    CREATED_AT = "CREATED_AT"
}

export enum PrejudicePostRule {
    ALL_FOLLOWERS = "ALL_FOLLOWERS",
    MUTUAL_ONLY = "MUTUAL_ONLY"
}

export interface AddAuthorInput {
    name: string;
}

export interface AddBookInput {
    authors: string[];
    title: string;
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

export interface FollowUserInput {
    userId: string;
}

export interface LoginInput {
    alias: string;
    password: string;
}

export interface PostAnswerInput {
    prejudiceId: string;
}

export interface PostPrejudiceInput {
    relatedBooks: string[];
    title: string;
    userId: string;
}

export interface PrejudiceOrder {
    direction: OrderDirection;
    field: PrejudiceOrderField;
}

export interface RefleshTokenInput {
    token: string;
}

export interface SignupInput {
    alias: string;
    displayName: string;
    password: string;
}

export interface UnfollowUserInput {
    userId: string;
}

export interface AddAuthorPayload {
    author: Author;
}

export interface AddBookPayload {
    book: Book;
}

export interface Answer {
    correctness: Correctness;
    createdAt: DateTime;
    id: string;
    prejudiceTo: Prejudice;
    text?: string;
}

export interface AnswerConnection {
    nodes: Answer[];
}

export interface Author {
    booksWrited: BookConnection;
    id: string;
    name: string;
    userResponsibleFor: User[];
}

export interface AuthorConnection {
    nodes: Author[];
}

export interface Book {
    authors: AuthorConnection;
    id: string;
    title: string;
    userResponsibleFor: User[];
}

export interface BookConnection {
    nodes: Book[];
}

export interface Follow {
    from: User;
    to: User;
}

export interface FollowUserPayload {
    follow: Follow;
}

export interface FollowerConnection {
    nodes: User[];
    totalCount: number;
}

export interface FollowingConnection {
    nodes: User[];
    totalCount: number;
}

export interface LoginPayload {
    tokens: TokensData;
}

export interface IMutation {
    addAuthor(input: AddAuthorInput): AddAuthorPayload | Promise<AddAuthorPayload>;
    addBook(input: AddBookInput): AddBookPayload | Promise<AddBookPayload>;
    followUser(input: FollowUserInput): FollowUserPayload | Promise<FollowUserPayload>;
    login(input: LoginInput): LoginPayload | Promise<LoginPayload>;
    postAnswer(input: PostAnswerInput): PostAnswerPayload | Promise<PostAnswerPayload>;
    postPrejudice(input: PostPrejudiceInput): PostPrejudicePayload | Promise<PostPrejudicePayload>;
    refleshToken(input: RefleshTokenInput): RefleshTokenPayload | Promise<RefleshTokenPayload>;
    signup(input: SignupInput): SignupPayload | Promise<SignupPayload>;
    unfollowUser(input: UnfollowUserInput): UnfollowUserPayload | Promise<UnfollowUserPayload>;
}

export interface PageInfo {
    endCursor?: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
}

export interface PostAnswerPayload {
    answer: Answer;
}

export interface PostPrejudicePayload {
    prejudice: Prejudice;
}

export interface Prejudice {
    answer?: Answer;
    book: Book;
    createdAt: DateTime;
    id: string;
    relatedBooks: BookConnection;
    title: string;
    userFrom: User;
    userTo: User;
}

export interface PrejudiceConnection {
    nodes: Prejudice[];
}

export interface IQuery {
    allUsers(): User[] | Promise<User[]>;
    answer(id: string): Answer | Promise<Answer>;
    author(id: string): Author | Promise<Author>;
    book(id: string): Book | Promise<Book>;
    prejudice(id: string): Prejudice | Promise<Prejudice>;
    user(alias: string): User | Promise<User>;
    viewer(): User | Promise<User>;
}

export interface RefleshTokenPayload {
    tokens: TokensData;
}

export interface Setting {
    rulePostPrejudice: PrejudicePostRule;
}

export interface SignupPayload {
    tokens: TokensData;
}

export interface TokensData {
    accessToken: string;
    refleshToken: string;
}

export interface Unfollow {
    from: User;
    to: User;
}

export interface UnfollowUserPayload {
    unfollow: Unfollow;
}

export interface User {
    alias: string;
    answersPosted: AnswerConnection;
    canPostPrejudiceTo: boolean;
    displayName?: string;
    followers: FollowerConnection;
    following: FollowingConnection;
    id: string;
    preduicesRecieved: PrejudiceConnection;
    prejudicesPosted: PrejudiceConnection;
}

export interface UserConnection {
    nodes: User[];
    totalCount: number;
}

export type DateTime = Date;
