declare class Global {
    [key: string]: any;
}

declare const enum AppVersion {
    CS3 = 8.0,
    CS4 = 9.0,
    CS5 = 10.0,
    CS5_5 = 10.5,
    CS6 = 11.0,
    CC = 12.0,
    CC2014 = 13.0,
    CC2015 = 13.5,
    CC2015_1 = 13.6,
    CC2015_2 = 13.7,
    CC2015_3 = 13.8,
    CC2017 = 14.0,
    CC2017_2 = 14.2,
    CC2018 = 15.0,
    CC2018_2 = 15.1,
    CC2019 = 16.0,
    CC2020 = 17.0,
    CC2021 = 18.0,
    CC2022 = 22.0,
    CC2023 = 23.0,
}

interface $ {
    evalFile(path: string, timeout?: number): any;
    write(text: any, ...texts: any[]): void;
    writeln(text: any, ...texts: any[]): void
}

interface String {
    replace(searchValue: string, replaceValue: string): string;
    replace(searchValue: string, replaceValue: (substring: string, ...args: any[]) => string): string;
    replace(searchValue: RegExp, replaceValue: string): string;
    replace(searchValue: RegExp, replaceValue: (substring: string, ...args: any[]) => string): string;
    split(separator: RegExp, limit?: number): string[];
}

interface StringConstructor {
    fromCharCode(...codes: number[]): string;
}

interface RegExp {
    lastIndex: number;
}

interface Function {
    apply(thisArg: any, argArray?: any[]): any;
}

interface DateConstructor {
    now(): number;
}

interface EvalError extends Error {
}
declare var EvalError: {
    new(message?: string): EvalError;
    (message?: string): EvalError;
    prototype: EvalError;
}

interface RangeError extends Error {
}
declare var RangeError: {
    new(message?: string): RangeError;
    (message?: string): RangeError;
    prototype: RangeError;
}

interface ReferenceError extends Error {
}
declare var ReferenceError: {
    new(message?: string): ReferenceError;
    (message?: string): ReferenceError;
    prototype: ReferenceError;
}

interface SyntaxError extends Error {
}
declare var SyntaxError: {
    new(message?: string): SyntaxError;
    (message?: string): SyntaxError;
    prototype: SyntaxError;
}

interface TypeError extends Error {
}
declare var TypeError: {
    new(message?: string): TypeError;
    (message?: string): TypeError;
    prototype: TypeError;
}

interface URIError extends Error {
}
declare var URIError: {
    new(message?: string): URIError;
    (message?: string): URIError;
    prototype: URIError;
}

interface _Control {
    properties: any;
}

interface Panel {
    onResize(): void;
    onResizing(): void;
}

interface TabbedPanel {
    remove(what: any): void;
}

interface ScriptUIGraphics {
    BrushType: { SOLID_COLOR: number; THEME_COLOR: number; };
    PenType: { SOLID_COLOR: number; THEME_COLOR: number; };
}

declare class MouseEvent extends UIEvent {
    altKey: boolean;
    button: 0 | 1 | 2; // 0: left click, 1: middle click, 2: right click
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    detail: number;
    metaKey: boolean;
    relatedTarget: any;
    screenX: number;
    screenY: number;
    shiftKey: boolean;
    type: string;

    getModifierState(keyIdentifier: string): boolean;
    initMouseEvent(eventName: string, bubble: boolean, isCancelable: boolean, view: any, detail: number, screenX: number, screenY: number, clientX: number, clientY: number, ctrlKey: boolean, altKey: boolean, shiftKey: boolean, metaKey: boolean, button: number, relatedTarget?: any): void;
}

declare type PropertyValue = void | boolean | number | [number, number] | [number, number, number] | [number, number, number, number] | MarkerValue | Shape | TextDocument;

/**
 * toJSON
 */
interface Date {
    toJSON(): string;
}

interface Boolean {
    toJSON(): string;
}

interface Number {
    toJSON(): string;
}

interface String {
    toJSON(): string;
}

/**
* Make all properties in T required
*/
type Required<T> = {
    [P in keyof T]-?: T[P];
};

/**
* Exclude from T those types that are assignable to U
*/
type Exclude<T, U> = T extends U ? never : T;

/**
* Extract from T those types that are assignable to U
*/
type Extract<T, U> = T extends U ? T : never;

/**
* Construct a type with the properties of T except for those in type K.
*/
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

/**
* Exclude null and undefined from T
*/
type NonNullable<T> = T extends null | undefined ? never : T;

/**
* Obtain the parameters of a function type in a tuple
*/
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

/**
* Obtain the parameters of a constructor function type in a tuple
*/
type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;

/**
* Obtain the return type of a function type
*/
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

/**
* Obtain the return type of a constructor function type
*/
type InstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any;

/**
 * Marker for contextual 'this' type
 */
interface ThisType<T> { }

type Diff<T extends string | number | symbol, U extends string | number | symbol> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T]

// https://github.com/Microsoft/TypeScript/issues/26223#issuecomment-410733998
/**
 * Creates a union from the types of an Array or tuple
 */
type UnionOf<T extends any[]> = T[number];

/**
 * Returns the length of an array or tuple
 */
type LengthOf<T extends any[]> = T["length"];

/**
 * Returns all but the first item's type in a tuple/array
 */
type Tail<T extends any[]> = ((...args: T) => any) extends ((head: any, ...tail: infer R) => any) ? R : never;

/**
 * Returns all but the first item's type in a tuple/array
 */
type Head<T extends any[]> = ((...args: T) => any) extends ((head: infer R, ...tail: any) => any) ? R : never;

/**
 * Returns the given tuple/array with the item type prepended to it
 */
type Unshift<List extends any[], Item> = ((first: Item, ...rest: List) => any) extends ((...list: infer R) => any) ? R : never;

/**
 * Tests if two types are equal
 */
type Equals<T, S> = [T] extends [S] ? ([S] extends [T] ? true : false) : false;
