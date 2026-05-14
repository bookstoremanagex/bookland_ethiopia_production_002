
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model accounts
 * 
 */
export type accounts = $Result.DefaultSelection<Prisma.$accountsPayload>
/**
 * Model bookedition
 * 
 */
export type bookedition = $Result.DefaultSelection<Prisma.$bookeditionPayload>
/**
 * Model bookeditionstores
 * 
 */
export type bookeditionstores = $Result.DefaultSelection<Prisma.$bookeditionstoresPayload>
/**
 * Model books
 * 
 */
export type books = $Result.DefaultSelection<Prisma.$booksPayload>
/**
 * Model bookshopeditions
 * 
 */
export type bookshopeditions = $Result.DefaultSelection<Prisma.$bookshopeditionsPayload>
/**
 * Model bookshopes
 * 
 */
export type bookshopes = $Result.DefaultSelection<Prisma.$bookshopesPayload>
/**
 * Model damagedbooks
 * 
 */
export type damagedbooks = $Result.DefaultSelection<Prisma.$damagedbooksPayload>
/**
 * Model dashboardmenu
 * 
 */
export type dashboardmenu = $Result.DefaultSelection<Prisma.$dashboardmenuPayload>
/**
 * Model printer
 * 
 */
export type printer = $Result.DefaultSelection<Prisma.$printerPayload>
/**
 * Model printorder
 * 
 */
export type printorder = $Result.DefaultSelection<Prisma.$printorderPayload>
/**
 * Model roles
 * 
 */
export type roles = $Result.DefaultSelection<Prisma.$rolesPayload>
/**
 * Model stores
 * 
 */
export type stores = $Result.DefaultSelection<Prisma.$storesPayload>
/**
 * Model translator
 * 
 */
export type translator = $Result.DefaultSelection<Prisma.$translatorPayload>
/**
 * Model translatorbook
 * 
 */
export type translatorbook = $Result.DefaultSelection<Prisma.$translatorbookPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const damagedbooks_type: {
  STORE: 'STORE',
  PRINTING: 'PRINTING',
  DESIGN: 'DESIGN',
  PREPRINTING: 'PREPRINTING',
  DISTRIBUTION: 'DISTRIBUTION',
  SALES: 'SALES',
  LOST: 'LOST'
};

export type damagedbooks_type = (typeof damagedbooks_type)[keyof typeof damagedbooks_type]


export const printorder_status: {
  NOT_STARTED: 'NOT_STARTED',
  STARTED: 'STARTED',
  ONPROGRESS: 'ONPROGRESS',
  FAILED: 'FAILED',
  COMPLETED: 'COMPLETED',
  REPRINT: 'REPRINT'
};

export type printorder_status = (typeof printorder_status)[keyof typeof printorder_status]


export const translatorbook_Status: {
  NOT_STARTED: 'NOT_STARTED',
  STARTED: 'STARTED',
  ONPROGRESS: 'ONPROGRESS',
  COMPLETED: 'COMPLETED'
};

export type translatorbook_Status = (typeof translatorbook_Status)[keyof typeof translatorbook_Status]


export const printorder_tracking: {
  NOT_SET: 'NOT_SET',
  SHORTAGE_DETECTED: 'SHORTAGE_DETECTED',
  NOT_READY: 'NOT_READY',
  PRINTING: 'PRINTING',
  DISTRIBUTION: 'DISTRIBUTION',
  SALES: 'SALES'
};

export type printorder_tracking = (typeof printorder_tracking)[keyof typeof printorder_tracking]


export const books_productionstatus: {
  ON_PRODUCTION: 'ON_PRODUCTION',
  TRANSLATION: 'TRANSLATION',
  DESIGN: 'DESIGN',
  PRINTING: 'PRINTING',
  PREPRINTING: 'PREPRINTING',
  DISTRIBUTION: 'DISTRIBUTION',
  SALES: 'SALES'
};

export type books_productionstatus = (typeof books_productionstatus)[keyof typeof books_productionstatus]

}

export type damagedbooks_type = $Enums.damagedbooks_type

export const damagedbooks_type: typeof $Enums.damagedbooks_type

export type printorder_status = $Enums.printorder_status

export const printorder_status: typeof $Enums.printorder_status

export type translatorbook_Status = $Enums.translatorbook_Status

export const translatorbook_Status: typeof $Enums.translatorbook_Status

export type printorder_tracking = $Enums.printorder_tracking

export const printorder_tracking: typeof $Enums.printorder_tracking

export type books_productionstatus = $Enums.books_productionstatus

export const books_productionstatus: typeof $Enums.books_productionstatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Accounts
 * const accounts = await prisma.accounts.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Accounts
   * const accounts = await prisma.accounts.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.accounts`: Exposes CRUD operations for the **accounts** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.accounts.findMany()
    * ```
    */
  get accounts(): Prisma.accountsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bookedition`: Exposes CRUD operations for the **bookedition** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bookeditions
    * const bookeditions = await prisma.bookedition.findMany()
    * ```
    */
  get bookedition(): Prisma.bookeditionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bookeditionstores`: Exposes CRUD operations for the **bookeditionstores** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bookeditionstores
    * const bookeditionstores = await prisma.bookeditionstores.findMany()
    * ```
    */
  get bookeditionstores(): Prisma.bookeditionstoresDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.books`: Exposes CRUD operations for the **books** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Books
    * const books = await prisma.books.findMany()
    * ```
    */
  get books(): Prisma.booksDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bookshopeditions`: Exposes CRUD operations for the **bookshopeditions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bookshopeditions
    * const bookshopeditions = await prisma.bookshopeditions.findMany()
    * ```
    */
  get bookshopeditions(): Prisma.bookshopeditionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bookshopes`: Exposes CRUD operations for the **bookshopes** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bookshopes
    * const bookshopes = await prisma.bookshopes.findMany()
    * ```
    */
  get bookshopes(): Prisma.bookshopesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.damagedbooks`: Exposes CRUD operations for the **damagedbooks** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Damagedbooks
    * const damagedbooks = await prisma.damagedbooks.findMany()
    * ```
    */
  get damagedbooks(): Prisma.damagedbooksDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dashboardmenu`: Exposes CRUD operations for the **dashboardmenu** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Dashboardmenus
    * const dashboardmenus = await prisma.dashboardmenu.findMany()
    * ```
    */
  get dashboardmenu(): Prisma.dashboardmenuDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.printer`: Exposes CRUD operations for the **printer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Printers
    * const printers = await prisma.printer.findMany()
    * ```
    */
  get printer(): Prisma.printerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.printorder`: Exposes CRUD operations for the **printorder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Printorders
    * const printorders = await prisma.printorder.findMany()
    * ```
    */
  get printorder(): Prisma.printorderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.roles`: Exposes CRUD operations for the **roles** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roles
    * const roles = await prisma.roles.findMany()
    * ```
    */
  get roles(): Prisma.rolesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.stores`: Exposes CRUD operations for the **stores** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Stores
    * const stores = await prisma.stores.findMany()
    * ```
    */
  get stores(): Prisma.storesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.translator`: Exposes CRUD operations for the **translator** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Translators
    * const translators = await prisma.translator.findMany()
    * ```
    */
  get translator(): Prisma.translatorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.translatorbook`: Exposes CRUD operations for the **translatorbook** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Translatorbooks
    * const translatorbooks = await prisma.translatorbook.findMany()
    * ```
    */
  get translatorbook(): Prisma.translatorbookDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    accounts: 'accounts',
    bookedition: 'bookedition',
    bookeditionstores: 'bookeditionstores',
    books: 'books',
    bookshopeditions: 'bookshopeditions',
    bookshopes: 'bookshopes',
    damagedbooks: 'damagedbooks',
    dashboardmenu: 'dashboardmenu',
    printer: 'printer',
    printorder: 'printorder',
    roles: 'roles',
    stores: 'stores',
    translator: 'translator',
    translatorbook: 'translatorbook'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "accounts" | "bookedition" | "bookeditionstores" | "books" | "bookshopeditions" | "bookshopes" | "damagedbooks" | "dashboardmenu" | "printer" | "printorder" | "roles" | "stores" | "translator" | "translatorbook"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      accounts: {
        payload: Prisma.$accountsPayload<ExtArgs>
        fields: Prisma.accountsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.accountsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.accountsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          findFirst: {
            args: Prisma.accountsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.accountsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          findMany: {
            args: Prisma.accountsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>[]
          }
          create: {
            args: Prisma.accountsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          createMany: {
            args: Prisma.accountsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.accountsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          update: {
            args: Prisma.accountsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          deleteMany: {
            args: Prisma.accountsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.accountsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.accountsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$accountsPayload>
          }
          aggregate: {
            args: Prisma.AccountsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccounts>
          }
          groupBy: {
            args: Prisma.accountsGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountsGroupByOutputType>[]
          }
          count: {
            args: Prisma.accountsCountArgs<ExtArgs>
            result: $Utils.Optional<AccountsCountAggregateOutputType> | number
          }
        }
      }
      bookedition: {
        payload: Prisma.$bookeditionPayload<ExtArgs>
        fields: Prisma.bookeditionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.bookeditionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookeditionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.bookeditionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookeditionPayload>
          }
          findFirst: {
            args: Prisma.bookeditionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookeditionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.bookeditionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookeditionPayload>
          }
          findMany: {
            args: Prisma.bookeditionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookeditionPayload>[]
          }
          create: {
            args: Prisma.bookeditionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookeditionPayload>
          }
          createMany: {
            args: Prisma.bookeditionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.bookeditionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookeditionPayload>
          }
          update: {
            args: Prisma.bookeditionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookeditionPayload>
          }
          deleteMany: {
            args: Prisma.bookeditionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.bookeditionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.bookeditionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookeditionPayload>
          }
          aggregate: {
            args: Prisma.BookeditionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookedition>
          }
          groupBy: {
            args: Prisma.bookeditionGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookeditionGroupByOutputType>[]
          }
          count: {
            args: Prisma.bookeditionCountArgs<ExtArgs>
            result: $Utils.Optional<BookeditionCountAggregateOutputType> | number
          }
        }
      }
      bookeditionstores: {
        payload: Prisma.$bookeditionstoresPayload<ExtArgs>
        fields: Prisma.bookeditionstoresFieldRefs
        operations: {
          findUnique: {
            args: Prisma.bookeditionstoresFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookeditionstoresPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.bookeditionstoresFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookeditionstoresPayload>
          }
          findFirst: {
            args: Prisma.bookeditionstoresFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookeditionstoresPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.bookeditionstoresFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookeditionstoresPayload>
          }
          findMany: {
            args: Prisma.bookeditionstoresFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookeditionstoresPayload>[]
          }
          create: {
            args: Prisma.bookeditionstoresCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookeditionstoresPayload>
          }
          createMany: {
            args: Prisma.bookeditionstoresCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.bookeditionstoresDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookeditionstoresPayload>
          }
          update: {
            args: Prisma.bookeditionstoresUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookeditionstoresPayload>
          }
          deleteMany: {
            args: Prisma.bookeditionstoresDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.bookeditionstoresUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.bookeditionstoresUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookeditionstoresPayload>
          }
          aggregate: {
            args: Prisma.BookeditionstoresAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookeditionstores>
          }
          groupBy: {
            args: Prisma.bookeditionstoresGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookeditionstoresGroupByOutputType>[]
          }
          count: {
            args: Prisma.bookeditionstoresCountArgs<ExtArgs>
            result: $Utils.Optional<BookeditionstoresCountAggregateOutputType> | number
          }
        }
      }
      books: {
        payload: Prisma.$booksPayload<ExtArgs>
        fields: Prisma.booksFieldRefs
        operations: {
          findUnique: {
            args: Prisma.booksFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$booksPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.booksFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$booksPayload>
          }
          findFirst: {
            args: Prisma.booksFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$booksPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.booksFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$booksPayload>
          }
          findMany: {
            args: Prisma.booksFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$booksPayload>[]
          }
          create: {
            args: Prisma.booksCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$booksPayload>
          }
          createMany: {
            args: Prisma.booksCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.booksDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$booksPayload>
          }
          update: {
            args: Prisma.booksUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$booksPayload>
          }
          deleteMany: {
            args: Prisma.booksDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.booksUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.booksUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$booksPayload>
          }
          aggregate: {
            args: Prisma.BooksAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBooks>
          }
          groupBy: {
            args: Prisma.booksGroupByArgs<ExtArgs>
            result: $Utils.Optional<BooksGroupByOutputType>[]
          }
          count: {
            args: Prisma.booksCountArgs<ExtArgs>
            result: $Utils.Optional<BooksCountAggregateOutputType> | number
          }
        }
      }
      bookshopeditions: {
        payload: Prisma.$bookshopeditionsPayload<ExtArgs>
        fields: Prisma.bookshopeditionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.bookshopeditionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookshopeditionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.bookshopeditionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookshopeditionsPayload>
          }
          findFirst: {
            args: Prisma.bookshopeditionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookshopeditionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.bookshopeditionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookshopeditionsPayload>
          }
          findMany: {
            args: Prisma.bookshopeditionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookshopeditionsPayload>[]
          }
          create: {
            args: Prisma.bookshopeditionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookshopeditionsPayload>
          }
          createMany: {
            args: Prisma.bookshopeditionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.bookshopeditionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookshopeditionsPayload>
          }
          update: {
            args: Prisma.bookshopeditionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookshopeditionsPayload>
          }
          deleteMany: {
            args: Prisma.bookshopeditionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.bookshopeditionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.bookshopeditionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookshopeditionsPayload>
          }
          aggregate: {
            args: Prisma.BookshopeditionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookshopeditions>
          }
          groupBy: {
            args: Prisma.bookshopeditionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookshopeditionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.bookshopeditionsCountArgs<ExtArgs>
            result: $Utils.Optional<BookshopeditionsCountAggregateOutputType> | number
          }
        }
      }
      bookshopes: {
        payload: Prisma.$bookshopesPayload<ExtArgs>
        fields: Prisma.bookshopesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.bookshopesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookshopesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.bookshopesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookshopesPayload>
          }
          findFirst: {
            args: Prisma.bookshopesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookshopesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.bookshopesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookshopesPayload>
          }
          findMany: {
            args: Prisma.bookshopesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookshopesPayload>[]
          }
          create: {
            args: Prisma.bookshopesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookshopesPayload>
          }
          createMany: {
            args: Prisma.bookshopesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.bookshopesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookshopesPayload>
          }
          update: {
            args: Prisma.bookshopesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookshopesPayload>
          }
          deleteMany: {
            args: Prisma.bookshopesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.bookshopesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.bookshopesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$bookshopesPayload>
          }
          aggregate: {
            args: Prisma.BookshopesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookshopes>
          }
          groupBy: {
            args: Prisma.bookshopesGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookshopesGroupByOutputType>[]
          }
          count: {
            args: Prisma.bookshopesCountArgs<ExtArgs>
            result: $Utils.Optional<BookshopesCountAggregateOutputType> | number
          }
        }
      }
      damagedbooks: {
        payload: Prisma.$damagedbooksPayload<ExtArgs>
        fields: Prisma.damagedbooksFieldRefs
        operations: {
          findUnique: {
            args: Prisma.damagedbooksFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$damagedbooksPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.damagedbooksFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$damagedbooksPayload>
          }
          findFirst: {
            args: Prisma.damagedbooksFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$damagedbooksPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.damagedbooksFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$damagedbooksPayload>
          }
          findMany: {
            args: Prisma.damagedbooksFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$damagedbooksPayload>[]
          }
          create: {
            args: Prisma.damagedbooksCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$damagedbooksPayload>
          }
          createMany: {
            args: Prisma.damagedbooksCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.damagedbooksDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$damagedbooksPayload>
          }
          update: {
            args: Prisma.damagedbooksUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$damagedbooksPayload>
          }
          deleteMany: {
            args: Prisma.damagedbooksDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.damagedbooksUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.damagedbooksUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$damagedbooksPayload>
          }
          aggregate: {
            args: Prisma.DamagedbooksAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDamagedbooks>
          }
          groupBy: {
            args: Prisma.damagedbooksGroupByArgs<ExtArgs>
            result: $Utils.Optional<DamagedbooksGroupByOutputType>[]
          }
          count: {
            args: Prisma.damagedbooksCountArgs<ExtArgs>
            result: $Utils.Optional<DamagedbooksCountAggregateOutputType> | number
          }
        }
      }
      dashboardmenu: {
        payload: Prisma.$dashboardmenuPayload<ExtArgs>
        fields: Prisma.dashboardmenuFieldRefs
        operations: {
          findUnique: {
            args: Prisma.dashboardmenuFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dashboardmenuPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.dashboardmenuFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dashboardmenuPayload>
          }
          findFirst: {
            args: Prisma.dashboardmenuFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dashboardmenuPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.dashboardmenuFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dashboardmenuPayload>
          }
          findMany: {
            args: Prisma.dashboardmenuFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dashboardmenuPayload>[]
          }
          create: {
            args: Prisma.dashboardmenuCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dashboardmenuPayload>
          }
          createMany: {
            args: Prisma.dashboardmenuCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.dashboardmenuDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dashboardmenuPayload>
          }
          update: {
            args: Prisma.dashboardmenuUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dashboardmenuPayload>
          }
          deleteMany: {
            args: Prisma.dashboardmenuDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.dashboardmenuUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.dashboardmenuUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$dashboardmenuPayload>
          }
          aggregate: {
            args: Prisma.DashboardmenuAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDashboardmenu>
          }
          groupBy: {
            args: Prisma.dashboardmenuGroupByArgs<ExtArgs>
            result: $Utils.Optional<DashboardmenuGroupByOutputType>[]
          }
          count: {
            args: Prisma.dashboardmenuCountArgs<ExtArgs>
            result: $Utils.Optional<DashboardmenuCountAggregateOutputType> | number
          }
        }
      }
      printer: {
        payload: Prisma.$printerPayload<ExtArgs>
        fields: Prisma.printerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.printerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$printerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.printerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$printerPayload>
          }
          findFirst: {
            args: Prisma.printerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$printerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.printerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$printerPayload>
          }
          findMany: {
            args: Prisma.printerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$printerPayload>[]
          }
          create: {
            args: Prisma.printerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$printerPayload>
          }
          createMany: {
            args: Prisma.printerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.printerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$printerPayload>
          }
          update: {
            args: Prisma.printerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$printerPayload>
          }
          deleteMany: {
            args: Prisma.printerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.printerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.printerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$printerPayload>
          }
          aggregate: {
            args: Prisma.PrinterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePrinter>
          }
          groupBy: {
            args: Prisma.printerGroupByArgs<ExtArgs>
            result: $Utils.Optional<PrinterGroupByOutputType>[]
          }
          count: {
            args: Prisma.printerCountArgs<ExtArgs>
            result: $Utils.Optional<PrinterCountAggregateOutputType> | number
          }
        }
      }
      printorder: {
        payload: Prisma.$printorderPayload<ExtArgs>
        fields: Prisma.printorderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.printorderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$printorderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.printorderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$printorderPayload>
          }
          findFirst: {
            args: Prisma.printorderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$printorderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.printorderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$printorderPayload>
          }
          findMany: {
            args: Prisma.printorderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$printorderPayload>[]
          }
          create: {
            args: Prisma.printorderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$printorderPayload>
          }
          createMany: {
            args: Prisma.printorderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.printorderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$printorderPayload>
          }
          update: {
            args: Prisma.printorderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$printorderPayload>
          }
          deleteMany: {
            args: Prisma.printorderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.printorderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.printorderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$printorderPayload>
          }
          aggregate: {
            args: Prisma.PrintorderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePrintorder>
          }
          groupBy: {
            args: Prisma.printorderGroupByArgs<ExtArgs>
            result: $Utils.Optional<PrintorderGroupByOutputType>[]
          }
          count: {
            args: Prisma.printorderCountArgs<ExtArgs>
            result: $Utils.Optional<PrintorderCountAggregateOutputType> | number
          }
        }
      }
      roles: {
        payload: Prisma.$rolesPayload<ExtArgs>
        fields: Prisma.rolesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.rolesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$rolesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.rolesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$rolesPayload>
          }
          findFirst: {
            args: Prisma.rolesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$rolesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.rolesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$rolesPayload>
          }
          findMany: {
            args: Prisma.rolesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$rolesPayload>[]
          }
          create: {
            args: Prisma.rolesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$rolesPayload>
          }
          createMany: {
            args: Prisma.rolesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.rolesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$rolesPayload>
          }
          update: {
            args: Prisma.rolesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$rolesPayload>
          }
          deleteMany: {
            args: Prisma.rolesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.rolesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.rolesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$rolesPayload>
          }
          aggregate: {
            args: Prisma.RolesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoles>
          }
          groupBy: {
            args: Prisma.rolesGroupByArgs<ExtArgs>
            result: $Utils.Optional<RolesGroupByOutputType>[]
          }
          count: {
            args: Prisma.rolesCountArgs<ExtArgs>
            result: $Utils.Optional<RolesCountAggregateOutputType> | number
          }
        }
      }
      stores: {
        payload: Prisma.$storesPayload<ExtArgs>
        fields: Prisma.storesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.storesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$storesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.storesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$storesPayload>
          }
          findFirst: {
            args: Prisma.storesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$storesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.storesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$storesPayload>
          }
          findMany: {
            args: Prisma.storesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$storesPayload>[]
          }
          create: {
            args: Prisma.storesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$storesPayload>
          }
          createMany: {
            args: Prisma.storesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.storesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$storesPayload>
          }
          update: {
            args: Prisma.storesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$storesPayload>
          }
          deleteMany: {
            args: Prisma.storesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.storesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.storesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$storesPayload>
          }
          aggregate: {
            args: Prisma.StoresAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStores>
          }
          groupBy: {
            args: Prisma.storesGroupByArgs<ExtArgs>
            result: $Utils.Optional<StoresGroupByOutputType>[]
          }
          count: {
            args: Prisma.storesCountArgs<ExtArgs>
            result: $Utils.Optional<StoresCountAggregateOutputType> | number
          }
        }
      }
      translator: {
        payload: Prisma.$translatorPayload<ExtArgs>
        fields: Prisma.translatorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.translatorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$translatorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.translatorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$translatorPayload>
          }
          findFirst: {
            args: Prisma.translatorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$translatorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.translatorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$translatorPayload>
          }
          findMany: {
            args: Prisma.translatorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$translatorPayload>[]
          }
          create: {
            args: Prisma.translatorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$translatorPayload>
          }
          createMany: {
            args: Prisma.translatorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.translatorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$translatorPayload>
          }
          update: {
            args: Prisma.translatorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$translatorPayload>
          }
          deleteMany: {
            args: Prisma.translatorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.translatorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.translatorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$translatorPayload>
          }
          aggregate: {
            args: Prisma.TranslatorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTranslator>
          }
          groupBy: {
            args: Prisma.translatorGroupByArgs<ExtArgs>
            result: $Utils.Optional<TranslatorGroupByOutputType>[]
          }
          count: {
            args: Prisma.translatorCountArgs<ExtArgs>
            result: $Utils.Optional<TranslatorCountAggregateOutputType> | number
          }
        }
      }
      translatorbook: {
        payload: Prisma.$translatorbookPayload<ExtArgs>
        fields: Prisma.translatorbookFieldRefs
        operations: {
          findUnique: {
            args: Prisma.translatorbookFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$translatorbookPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.translatorbookFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$translatorbookPayload>
          }
          findFirst: {
            args: Prisma.translatorbookFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$translatorbookPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.translatorbookFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$translatorbookPayload>
          }
          findMany: {
            args: Prisma.translatorbookFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$translatorbookPayload>[]
          }
          create: {
            args: Prisma.translatorbookCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$translatorbookPayload>
          }
          createMany: {
            args: Prisma.translatorbookCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.translatorbookDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$translatorbookPayload>
          }
          update: {
            args: Prisma.translatorbookUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$translatorbookPayload>
          }
          deleteMany: {
            args: Prisma.translatorbookDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.translatorbookUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.translatorbookUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$translatorbookPayload>
          }
          aggregate: {
            args: Prisma.TranslatorbookAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTranslatorbook>
          }
          groupBy: {
            args: Prisma.translatorbookGroupByArgs<ExtArgs>
            result: $Utils.Optional<TranslatorbookGroupByOutputType>[]
          }
          count: {
            args: Prisma.translatorbookCountArgs<ExtArgs>
            result: $Utils.Optional<TranslatorbookCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    accounts?: accountsOmit
    bookedition?: bookeditionOmit
    bookeditionstores?: bookeditionstoresOmit
    books?: booksOmit
    bookshopeditions?: bookshopeditionsOmit
    bookshopes?: bookshopesOmit
    damagedbooks?: damagedbooksOmit
    dashboardmenu?: dashboardmenuOmit
    printer?: printerOmit
    printorder?: printorderOmit
    roles?: rolesOmit
    stores?: storesOmit
    translator?: translatorOmit
    translatorbook?: translatorbookOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AccountsCountOutputType
   */

  export type AccountsCountOutputType = {
    damagedbooks: number
    roles: number
  }

  export type AccountsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    damagedbooks?: boolean | AccountsCountOutputTypeCountDamagedbooksArgs
    roles?: boolean | AccountsCountOutputTypeCountRolesArgs
  }

  // Custom InputTypes
  /**
   * AccountsCountOutputType without action
   */
  export type AccountsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountsCountOutputType
     */
    select?: AccountsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AccountsCountOutputType without action
   */
  export type AccountsCountOutputTypeCountDamagedbooksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: damagedbooksWhereInput
  }

  /**
   * AccountsCountOutputType without action
   */
  export type AccountsCountOutputTypeCountRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: rolesWhereInput
  }


  /**
   * Count Type BookeditionCountOutputType
   */

  export type BookeditionCountOutputType = {
    bookeditionstores: number
    bookshopeditions: number
    damagedbooks: number
  }

  export type BookeditionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookeditionstores?: boolean | BookeditionCountOutputTypeCountBookeditionstoresArgs
    bookshopeditions?: boolean | BookeditionCountOutputTypeCountBookshopeditionsArgs
    damagedbooks?: boolean | BookeditionCountOutputTypeCountDamagedbooksArgs
  }

  // Custom InputTypes
  /**
   * BookeditionCountOutputType without action
   */
  export type BookeditionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookeditionCountOutputType
     */
    select?: BookeditionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BookeditionCountOutputType without action
   */
  export type BookeditionCountOutputTypeCountBookeditionstoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: bookeditionstoresWhereInput
  }

  /**
   * BookeditionCountOutputType without action
   */
  export type BookeditionCountOutputTypeCountBookshopeditionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: bookshopeditionsWhereInput
  }

  /**
   * BookeditionCountOutputType without action
   */
  export type BookeditionCountOutputTypeCountDamagedbooksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: damagedbooksWhereInput
  }


  /**
   * Count Type BooksCountOutputType
   */

  export type BooksCountOutputType = {
    bookedition: number
    damagedbooks: number
    translatorbook: number
  }

  export type BooksCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookedition?: boolean | BooksCountOutputTypeCountBookeditionArgs
    damagedbooks?: boolean | BooksCountOutputTypeCountDamagedbooksArgs
    translatorbook?: boolean | BooksCountOutputTypeCountTranslatorbookArgs
  }

  // Custom InputTypes
  /**
   * BooksCountOutputType without action
   */
  export type BooksCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BooksCountOutputType
     */
    select?: BooksCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BooksCountOutputType without action
   */
  export type BooksCountOutputTypeCountBookeditionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: bookeditionWhereInput
  }

  /**
   * BooksCountOutputType without action
   */
  export type BooksCountOutputTypeCountDamagedbooksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: damagedbooksWhereInput
  }

  /**
   * BooksCountOutputType without action
   */
  export type BooksCountOutputTypeCountTranslatorbookArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: translatorbookWhereInput
  }


  /**
   * Count Type BookshopesCountOutputType
   */

  export type BookshopesCountOutputType = {
    bookshopeditions: number
  }

  export type BookshopesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookshopeditions?: boolean | BookshopesCountOutputTypeCountBookshopeditionsArgs
  }

  // Custom InputTypes
  /**
   * BookshopesCountOutputType without action
   */
  export type BookshopesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookshopesCountOutputType
     */
    select?: BookshopesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BookshopesCountOutputType without action
   */
  export type BookshopesCountOutputTypeCountBookshopeditionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: bookshopeditionsWhereInput
  }


  /**
   * Count Type PrinterCountOutputType
   */

  export type PrinterCountOutputType = {
    printorder: number
  }

  export type PrinterCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    printorder?: boolean | PrinterCountOutputTypeCountPrintorderArgs
  }

  // Custom InputTypes
  /**
   * PrinterCountOutputType without action
   */
  export type PrinterCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrinterCountOutputType
     */
    select?: PrinterCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PrinterCountOutputType without action
   */
  export type PrinterCountOutputTypeCountPrintorderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: printorderWhereInput
  }


  /**
   * Count Type StoresCountOutputType
   */

  export type StoresCountOutputType = {
    bookeditionstores: number
    damagedbooks: number
  }

  export type StoresCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookeditionstores?: boolean | StoresCountOutputTypeCountBookeditionstoresArgs
    damagedbooks?: boolean | StoresCountOutputTypeCountDamagedbooksArgs
  }

  // Custom InputTypes
  /**
   * StoresCountOutputType without action
   */
  export type StoresCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoresCountOutputType
     */
    select?: StoresCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StoresCountOutputType without action
   */
  export type StoresCountOutputTypeCountBookeditionstoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: bookeditionstoresWhereInput
  }

  /**
   * StoresCountOutputType without action
   */
  export type StoresCountOutputTypeCountDamagedbooksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: damagedbooksWhereInput
  }


  /**
   * Count Type TranslatorCountOutputType
   */

  export type TranslatorCountOutputType = {
    translatorbook: number
  }

  export type TranslatorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    translatorbook?: boolean | TranslatorCountOutputTypeCountTranslatorbookArgs
  }

  // Custom InputTypes
  /**
   * TranslatorCountOutputType without action
   */
  export type TranslatorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatorCountOutputType
     */
    select?: TranslatorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TranslatorCountOutputType without action
   */
  export type TranslatorCountOutputTypeCountTranslatorbookArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: translatorbookWhereInput
  }


  /**
   * Models
   */

  /**
   * Model accounts
   */

  export type AggregateAccounts = {
    _count: AccountsCountAggregateOutputType | null
    _avg: AccountsAvgAggregateOutputType | null
    _sum: AccountsSumAggregateOutputType | null
    _min: AccountsMinAggregateOutputType | null
    _max: AccountsMaxAggregateOutputType | null
  }

  export type AccountsAvgAggregateOutputType = {
    id: number | null
  }

  export type AccountsSumAggregateOutputType = {
    id: number | null
  }

  export type AccountsMinAggregateOutputType = {
    id: number | null
    account_type: string | null
    account_email: string | null
    password: string | null
    account_status: boolean | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
    name: string | null
  }

  export type AccountsMaxAggregateOutputType = {
    id: number | null
    account_type: string | null
    account_email: string | null
    password: string | null
    account_status: boolean | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
    name: string | null
  }

  export type AccountsCountAggregateOutputType = {
    id: number
    account_type: number
    account_email: number
    password: number
    account_status: number
    is_deleted: number
    updatedAt: number
    createdAt: number
    deletedAt: number
    name: number
    _all: number
  }


  export type AccountsAvgAggregateInputType = {
    id?: true
  }

  export type AccountsSumAggregateInputType = {
    id?: true
  }

  export type AccountsMinAggregateInputType = {
    id?: true
    account_type?: true
    account_email?: true
    password?: true
    account_status?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    name?: true
  }

  export type AccountsMaxAggregateInputType = {
    id?: true
    account_type?: true
    account_email?: true
    password?: true
    account_status?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    name?: true
  }

  export type AccountsCountAggregateInputType = {
    id?: true
    account_type?: true
    account_email?: true
    password?: true
    account_status?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    name?: true
    _all?: true
  }

  export type AccountsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which accounts to aggregate.
     */
    where?: accountsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
     */
    orderBy?: accountsOrderByWithRelationInput | accountsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: accountsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned accounts
    **/
    _count?: true | AccountsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountsMaxAggregateInputType
  }

  export type GetAccountsAggregateType<T extends AccountsAggregateArgs> = {
        [P in keyof T & keyof AggregateAccounts]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccounts[P]>
      : GetScalarType<T[P], AggregateAccounts[P]>
  }




  export type accountsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: accountsWhereInput
    orderBy?: accountsOrderByWithAggregationInput | accountsOrderByWithAggregationInput[]
    by: AccountsScalarFieldEnum[] | AccountsScalarFieldEnum
    having?: accountsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountsCountAggregateInputType | true
    _avg?: AccountsAvgAggregateInputType
    _sum?: AccountsSumAggregateInputType
    _min?: AccountsMinAggregateInputType
    _max?: AccountsMaxAggregateInputType
  }

  export type AccountsGroupByOutputType = {
    id: number
    account_type: string
    account_email: string
    password: string
    account_status: boolean
    is_deleted: boolean
    updatedAt: Date
    createdAt: Date
    deletedAt: Date
    name: string
    _count: AccountsCountAggregateOutputType | null
    _avg: AccountsAvgAggregateOutputType | null
    _sum: AccountsSumAggregateOutputType | null
    _min: AccountsMinAggregateOutputType | null
    _max: AccountsMaxAggregateOutputType | null
  }

  type GetAccountsGroupByPayload<T extends accountsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountsGroupByOutputType[P]>
            : GetScalarType<T[P], AccountsGroupByOutputType[P]>
        }
      >
    >


  export type accountsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    account_type?: boolean
    account_email?: boolean
    password?: boolean
    account_status?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    name?: boolean
    damagedbooks?: boolean | accounts$damagedbooksArgs<ExtArgs>
    roles?: boolean | accounts$rolesArgs<ExtArgs>
    _count?: boolean | AccountsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["accounts"]>



  export type accountsSelectScalar = {
    id?: boolean
    account_type?: boolean
    account_email?: boolean
    password?: boolean
    account_status?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    name?: boolean
  }

  export type accountsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "account_type" | "account_email" | "password" | "account_status" | "is_deleted" | "updatedAt" | "createdAt" | "deletedAt" | "name", ExtArgs["result"]["accounts"]>
  export type accountsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    damagedbooks?: boolean | accounts$damagedbooksArgs<ExtArgs>
    roles?: boolean | accounts$rolesArgs<ExtArgs>
    _count?: boolean | AccountsCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $accountsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "accounts"
    objects: {
      damagedbooks: Prisma.$damagedbooksPayload<ExtArgs>[]
      roles: Prisma.$rolesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      account_type: string
      account_email: string
      password: string
      account_status: boolean
      is_deleted: boolean
      updatedAt: Date
      createdAt: Date
      deletedAt: Date
      name: string
    }, ExtArgs["result"]["accounts"]>
    composites: {}
  }

  type accountsGetPayload<S extends boolean | null | undefined | accountsDefaultArgs> = $Result.GetResult<Prisma.$accountsPayload, S>

  type accountsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<accountsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountsCountAggregateInputType | true
    }

  export interface accountsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['accounts'], meta: { name: 'accounts' } }
    /**
     * Find zero or one Accounts that matches the filter.
     * @param {accountsFindUniqueArgs} args - Arguments to find a Accounts
     * @example
     * // Get one Accounts
     * const accounts = await prisma.accounts.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends accountsFindUniqueArgs>(args: SelectSubset<T, accountsFindUniqueArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Accounts that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {accountsFindUniqueOrThrowArgs} args - Arguments to find a Accounts
     * @example
     * // Get one Accounts
     * const accounts = await prisma.accounts.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends accountsFindUniqueOrThrowArgs>(args: SelectSubset<T, accountsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsFindFirstArgs} args - Arguments to find a Accounts
     * @example
     * // Get one Accounts
     * const accounts = await prisma.accounts.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends accountsFindFirstArgs>(args?: SelectSubset<T, accountsFindFirstArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Accounts that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsFindFirstOrThrowArgs} args - Arguments to find a Accounts
     * @example
     * // Get one Accounts
     * const accounts = await prisma.accounts.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends accountsFindFirstOrThrowArgs>(args?: SelectSubset<T, accountsFindFirstOrThrowArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.accounts.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.accounts.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountsWithIdOnly = await prisma.accounts.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends accountsFindManyArgs>(args?: SelectSubset<T, accountsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Accounts.
     * @param {accountsCreateArgs} args - Arguments to create a Accounts.
     * @example
     * // Create one Accounts
     * const Accounts = await prisma.accounts.create({
     *   data: {
     *     // ... data to create a Accounts
     *   }
     * })
     * 
     */
    create<T extends accountsCreateArgs>(args: SelectSubset<T, accountsCreateArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {accountsCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const accounts = await prisma.accounts.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends accountsCreateManyArgs>(args?: SelectSubset<T, accountsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Accounts.
     * @param {accountsDeleteArgs} args - Arguments to delete one Accounts.
     * @example
     * // Delete one Accounts
     * const Accounts = await prisma.accounts.delete({
     *   where: {
     *     // ... filter to delete one Accounts
     *   }
     * })
     * 
     */
    delete<T extends accountsDeleteArgs>(args: SelectSubset<T, accountsDeleteArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Accounts.
     * @param {accountsUpdateArgs} args - Arguments to update one Accounts.
     * @example
     * // Update one Accounts
     * const accounts = await prisma.accounts.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends accountsUpdateArgs>(args: SelectSubset<T, accountsUpdateArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {accountsDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.accounts.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends accountsDeleteManyArgs>(args?: SelectSubset<T, accountsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const accounts = await prisma.accounts.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends accountsUpdateManyArgs>(args: SelectSubset<T, accountsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Accounts.
     * @param {accountsUpsertArgs} args - Arguments to update or create a Accounts.
     * @example
     * // Update or create a Accounts
     * const accounts = await prisma.accounts.upsert({
     *   create: {
     *     // ... data to create a Accounts
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Accounts we want to update
     *   }
     * })
     */
    upsert<T extends accountsUpsertArgs>(args: SelectSubset<T, accountsUpsertArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.accounts.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends accountsCountArgs>(
      args?: Subset<T, accountsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountsAggregateArgs>(args: Subset<T, AccountsAggregateArgs>): Prisma.PrismaPromise<GetAccountsAggregateType<T>>

    /**
     * Group by Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends accountsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: accountsGroupByArgs['orderBy'] }
        : { orderBy?: accountsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, accountsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the accounts model
   */
  readonly fields: accountsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for accounts.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__accountsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    damagedbooks<T extends accounts$damagedbooksArgs<ExtArgs> = {}>(args?: Subset<T, accounts$damagedbooksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$damagedbooksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    roles<T extends accounts$rolesArgs<ExtArgs> = {}>(args?: Subset<T, accounts$rolesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the accounts model
   */
  interface accountsFieldRefs {
    readonly id: FieldRef<"accounts", 'Int'>
    readonly account_type: FieldRef<"accounts", 'String'>
    readonly account_email: FieldRef<"accounts", 'String'>
    readonly password: FieldRef<"accounts", 'String'>
    readonly account_status: FieldRef<"accounts", 'Boolean'>
    readonly is_deleted: FieldRef<"accounts", 'Boolean'>
    readonly updatedAt: FieldRef<"accounts", 'DateTime'>
    readonly createdAt: FieldRef<"accounts", 'DateTime'>
    readonly deletedAt: FieldRef<"accounts", 'DateTime'>
    readonly name: FieldRef<"accounts", 'String'>
  }
    

  // Custom InputTypes
  /**
   * accounts findUnique
   */
  export type accountsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where: accountsWhereUniqueInput
  }

  /**
   * accounts findUniqueOrThrow
   */
  export type accountsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where: accountsWhereUniqueInput
  }

  /**
   * accounts findFirst
   */
  export type accountsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where?: accountsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
     */
    orderBy?: accountsOrderByWithRelationInput | accountsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for accounts.
     */
    cursor?: accountsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of accounts.
     */
    distinct?: AccountsScalarFieldEnum | AccountsScalarFieldEnum[]
  }

  /**
   * accounts findFirstOrThrow
   */
  export type accountsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where?: accountsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
     */
    orderBy?: accountsOrderByWithRelationInput | accountsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for accounts.
     */
    cursor?: accountsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of accounts.
     */
    distinct?: AccountsScalarFieldEnum | AccountsScalarFieldEnum[]
  }

  /**
   * accounts findMany
   */
  export type accountsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter, which accounts to fetch.
     */
    where?: accountsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
     */
    orderBy?: accountsOrderByWithRelationInput | accountsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing accounts.
     */
    cursor?: accountsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
     */
    skip?: number
    distinct?: AccountsScalarFieldEnum | AccountsScalarFieldEnum[]
  }

  /**
   * accounts create
   */
  export type accountsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * The data needed to create a accounts.
     */
    data: XOR<accountsCreateInput, accountsUncheckedCreateInput>
  }

  /**
   * accounts createMany
   */
  export type accountsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many accounts.
     */
    data: accountsCreateManyInput | accountsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * accounts update
   */
  export type accountsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * The data needed to update a accounts.
     */
    data: XOR<accountsUpdateInput, accountsUncheckedUpdateInput>
    /**
     * Choose, which accounts to update.
     */
    where: accountsWhereUniqueInput
  }

  /**
   * accounts updateMany
   */
  export type accountsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update accounts.
     */
    data: XOR<accountsUpdateManyMutationInput, accountsUncheckedUpdateManyInput>
    /**
     * Filter which accounts to update
     */
    where?: accountsWhereInput
    /**
     * Limit how many accounts to update.
     */
    limit?: number
  }

  /**
   * accounts upsert
   */
  export type accountsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * The filter to search for the accounts to update in case it exists.
     */
    where: accountsWhereUniqueInput
    /**
     * In case the accounts found by the `where` argument doesn't exist, create a new accounts with this data.
     */
    create: XOR<accountsCreateInput, accountsUncheckedCreateInput>
    /**
     * In case the accounts was found with the provided `where` argument, update it with this data.
     */
    update: XOR<accountsUpdateInput, accountsUncheckedUpdateInput>
  }

  /**
   * accounts delete
   */
  export type accountsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    /**
     * Filter which accounts to delete.
     */
    where: accountsWhereUniqueInput
  }

  /**
   * accounts deleteMany
   */
  export type accountsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which accounts to delete
     */
    where?: accountsWhereInput
    /**
     * Limit how many accounts to delete.
     */
    limit?: number
  }

  /**
   * accounts.damagedbooks
   */
  export type accounts$damagedbooksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the damagedbooks
     */
    select?: damagedbooksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the damagedbooks
     */
    omit?: damagedbooksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: damagedbooksInclude<ExtArgs> | null
    where?: damagedbooksWhereInput
    orderBy?: damagedbooksOrderByWithRelationInput | damagedbooksOrderByWithRelationInput[]
    cursor?: damagedbooksWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DamagedbooksScalarFieldEnum | DamagedbooksScalarFieldEnum[]
  }

  /**
   * accounts.roles
   */
  export type accounts$rolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
    where?: rolesWhereInput
    orderBy?: rolesOrderByWithRelationInput | rolesOrderByWithRelationInput[]
    cursor?: rolesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RolesScalarFieldEnum | RolesScalarFieldEnum[]
  }

  /**
   * accounts without action
   */
  export type accountsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
  }


  /**
   * Model bookedition
   */

  export type AggregateBookedition = {
    _count: BookeditionCountAggregateOutputType | null
    _avg: BookeditionAvgAggregateOutputType | null
    _sum: BookeditionSumAggregateOutputType | null
    _min: BookeditionMinAggregateOutputType | null
    _max: BookeditionMaxAggregateOutputType | null
  }

  export type BookeditionAvgAggregateOutputType = {
    id: number | null
    selling_price: number | null
    production_price: number | null
    printing_cost: number | null
    binding_cost: number | null
    design_cost: number | null
    translation_cost: number | null
    total_print_count: number | null
    book_id: number | null
    number_of_pages: number | null
    bookId: number | null
    editing_cost: number | null
    other_expenses: number | null
    transportation_cost: number | null
  }

  export type BookeditionSumAggregateOutputType = {
    id: number | null
    selling_price: number | null
    production_price: number | null
    printing_cost: number | null
    binding_cost: number | null
    design_cost: number | null
    translation_cost: number | null
    total_print_count: number | null
    book_id: number | null
    number_of_pages: number | null
    bookId: number | null
    editing_cost: number | null
    other_expenses: number | null
    transportation_cost: number | null
  }

  export type BookeditionMinAggregateOutputType = {
    id: number | null
    edition_name: string | null
    selling_price: number | null
    production_price: number | null
    printing_cost: number | null
    binding_cost: number | null
    design_cost: number | null
    translation_cost: number | null
    memo: string | null
    book_image_url: string | null
    total_print_count: number | null
    book_id: number | null
    number_of_pages: number | null
    bookId: number | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
    editing_cost: number | null
    other_expenses: number | null
    transportation_cost: number | null
  }

  export type BookeditionMaxAggregateOutputType = {
    id: number | null
    edition_name: string | null
    selling_price: number | null
    production_price: number | null
    printing_cost: number | null
    binding_cost: number | null
    design_cost: number | null
    translation_cost: number | null
    memo: string | null
    book_image_url: string | null
    total_print_count: number | null
    book_id: number | null
    number_of_pages: number | null
    bookId: number | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
    editing_cost: number | null
    other_expenses: number | null
    transportation_cost: number | null
  }

  export type BookeditionCountAggregateOutputType = {
    id: number
    edition_name: number
    selling_price: number
    production_price: number
    printing_cost: number
    binding_cost: number
    design_cost: number
    translation_cost: number
    memo: number
    book_image_url: number
    total_print_count: number
    book_id: number
    number_of_pages: number
    bookId: number
    is_deleted: number
    updatedAt: number
    createdAt: number
    deletedAt: number
    editing_cost: number
    other_expenses: number
    transportation_cost: number
    _all: number
  }


  export type BookeditionAvgAggregateInputType = {
    id?: true
    selling_price?: true
    production_price?: true
    printing_cost?: true
    binding_cost?: true
    design_cost?: true
    translation_cost?: true
    total_print_count?: true
    book_id?: true
    number_of_pages?: true
    bookId?: true
    editing_cost?: true
    other_expenses?: true
    transportation_cost?: true
  }

  export type BookeditionSumAggregateInputType = {
    id?: true
    selling_price?: true
    production_price?: true
    printing_cost?: true
    binding_cost?: true
    design_cost?: true
    translation_cost?: true
    total_print_count?: true
    book_id?: true
    number_of_pages?: true
    bookId?: true
    editing_cost?: true
    other_expenses?: true
    transportation_cost?: true
  }

  export type BookeditionMinAggregateInputType = {
    id?: true
    edition_name?: true
    selling_price?: true
    production_price?: true
    printing_cost?: true
    binding_cost?: true
    design_cost?: true
    translation_cost?: true
    memo?: true
    book_image_url?: true
    total_print_count?: true
    book_id?: true
    number_of_pages?: true
    bookId?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    editing_cost?: true
    other_expenses?: true
    transportation_cost?: true
  }

  export type BookeditionMaxAggregateInputType = {
    id?: true
    edition_name?: true
    selling_price?: true
    production_price?: true
    printing_cost?: true
    binding_cost?: true
    design_cost?: true
    translation_cost?: true
    memo?: true
    book_image_url?: true
    total_print_count?: true
    book_id?: true
    number_of_pages?: true
    bookId?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    editing_cost?: true
    other_expenses?: true
    transportation_cost?: true
  }

  export type BookeditionCountAggregateInputType = {
    id?: true
    edition_name?: true
    selling_price?: true
    production_price?: true
    printing_cost?: true
    binding_cost?: true
    design_cost?: true
    translation_cost?: true
    memo?: true
    book_image_url?: true
    total_print_count?: true
    book_id?: true
    number_of_pages?: true
    bookId?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    editing_cost?: true
    other_expenses?: true
    transportation_cost?: true
    _all?: true
  }

  export type BookeditionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which bookedition to aggregate.
     */
    where?: bookeditionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bookeditions to fetch.
     */
    orderBy?: bookeditionOrderByWithRelationInput | bookeditionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: bookeditionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bookeditions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bookeditions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned bookeditions
    **/
    _count?: true | BookeditionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookeditionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookeditionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookeditionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookeditionMaxAggregateInputType
  }

  export type GetBookeditionAggregateType<T extends BookeditionAggregateArgs> = {
        [P in keyof T & keyof AggregateBookedition]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookedition[P]>
      : GetScalarType<T[P], AggregateBookedition[P]>
  }




  export type bookeditionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: bookeditionWhereInput
    orderBy?: bookeditionOrderByWithAggregationInput | bookeditionOrderByWithAggregationInput[]
    by: BookeditionScalarFieldEnum[] | BookeditionScalarFieldEnum
    having?: bookeditionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookeditionCountAggregateInputType | true
    _avg?: BookeditionAvgAggregateInputType
    _sum?: BookeditionSumAggregateInputType
    _min?: BookeditionMinAggregateInputType
    _max?: BookeditionMaxAggregateInputType
  }

  export type BookeditionGroupByOutputType = {
    id: number
    edition_name: string
    selling_price: number | null
    production_price: number | null
    printing_cost: number | null
    binding_cost: number | null
    design_cost: number | null
    translation_cost: number | null
    memo: string | null
    book_image_url: string | null
    total_print_count: number | null
    book_id: number | null
    number_of_pages: number | null
    bookId: number
    is_deleted: boolean
    updatedAt: Date
    createdAt: Date
    deletedAt: Date
    editing_cost: number | null
    other_expenses: number | null
    transportation_cost: number | null
    _count: BookeditionCountAggregateOutputType | null
    _avg: BookeditionAvgAggregateOutputType | null
    _sum: BookeditionSumAggregateOutputType | null
    _min: BookeditionMinAggregateOutputType | null
    _max: BookeditionMaxAggregateOutputType | null
  }

  type GetBookeditionGroupByPayload<T extends bookeditionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookeditionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookeditionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookeditionGroupByOutputType[P]>
            : GetScalarType<T[P], BookeditionGroupByOutputType[P]>
        }
      >
    >


  export type bookeditionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    edition_name?: boolean
    selling_price?: boolean
    production_price?: boolean
    printing_cost?: boolean
    binding_cost?: boolean
    design_cost?: boolean
    translation_cost?: boolean
    memo?: boolean
    book_image_url?: boolean
    total_print_count?: boolean
    book_id?: boolean
    number_of_pages?: boolean
    bookId?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    editing_cost?: boolean
    other_expenses?: boolean
    transportation_cost?: boolean
    books?: boolean | booksDefaultArgs<ExtArgs>
    bookeditionstores?: boolean | bookedition$bookeditionstoresArgs<ExtArgs>
    bookshopeditions?: boolean | bookedition$bookshopeditionsArgs<ExtArgs>
    damagedbooks?: boolean | bookedition$damagedbooksArgs<ExtArgs>
    _count?: boolean | BookeditionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookedition"]>



  export type bookeditionSelectScalar = {
    id?: boolean
    edition_name?: boolean
    selling_price?: boolean
    production_price?: boolean
    printing_cost?: boolean
    binding_cost?: boolean
    design_cost?: boolean
    translation_cost?: boolean
    memo?: boolean
    book_image_url?: boolean
    total_print_count?: boolean
    book_id?: boolean
    number_of_pages?: boolean
    bookId?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    editing_cost?: boolean
    other_expenses?: boolean
    transportation_cost?: boolean
  }

  export type bookeditionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "edition_name" | "selling_price" | "production_price" | "printing_cost" | "binding_cost" | "design_cost" | "translation_cost" | "memo" | "book_image_url" | "total_print_count" | "book_id" | "number_of_pages" | "bookId" | "is_deleted" | "updatedAt" | "createdAt" | "deletedAt" | "editing_cost" | "other_expenses" | "transportation_cost", ExtArgs["result"]["bookedition"]>
  export type bookeditionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    books?: boolean | booksDefaultArgs<ExtArgs>
    bookeditionstores?: boolean | bookedition$bookeditionstoresArgs<ExtArgs>
    bookshopeditions?: boolean | bookedition$bookshopeditionsArgs<ExtArgs>
    damagedbooks?: boolean | bookedition$damagedbooksArgs<ExtArgs>
    _count?: boolean | BookeditionCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $bookeditionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "bookedition"
    objects: {
      books: Prisma.$booksPayload<ExtArgs>
      bookeditionstores: Prisma.$bookeditionstoresPayload<ExtArgs>[]
      bookshopeditions: Prisma.$bookshopeditionsPayload<ExtArgs>[]
      damagedbooks: Prisma.$damagedbooksPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      edition_name: string
      selling_price: number | null
      production_price: number | null
      printing_cost: number | null
      binding_cost: number | null
      design_cost: number | null
      translation_cost: number | null
      memo: string | null
      book_image_url: string | null
      total_print_count: number | null
      book_id: number | null
      number_of_pages: number | null
      bookId: number
      is_deleted: boolean
      updatedAt: Date
      createdAt: Date
      deletedAt: Date
      editing_cost: number | null
      other_expenses: number | null
      transportation_cost: number | null
    }, ExtArgs["result"]["bookedition"]>
    composites: {}
  }

  type bookeditionGetPayload<S extends boolean | null | undefined | bookeditionDefaultArgs> = $Result.GetResult<Prisma.$bookeditionPayload, S>

  type bookeditionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<bookeditionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookeditionCountAggregateInputType | true
    }

  export interface bookeditionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['bookedition'], meta: { name: 'bookedition' } }
    /**
     * Find zero or one Bookedition that matches the filter.
     * @param {bookeditionFindUniqueArgs} args - Arguments to find a Bookedition
     * @example
     * // Get one Bookedition
     * const bookedition = await prisma.bookedition.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends bookeditionFindUniqueArgs>(args: SelectSubset<T, bookeditionFindUniqueArgs<ExtArgs>>): Prisma__bookeditionClient<$Result.GetResult<Prisma.$bookeditionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Bookedition that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {bookeditionFindUniqueOrThrowArgs} args - Arguments to find a Bookedition
     * @example
     * // Get one Bookedition
     * const bookedition = await prisma.bookedition.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends bookeditionFindUniqueOrThrowArgs>(args: SelectSubset<T, bookeditionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__bookeditionClient<$Result.GetResult<Prisma.$bookeditionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bookedition that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookeditionFindFirstArgs} args - Arguments to find a Bookedition
     * @example
     * // Get one Bookedition
     * const bookedition = await prisma.bookedition.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends bookeditionFindFirstArgs>(args?: SelectSubset<T, bookeditionFindFirstArgs<ExtArgs>>): Prisma__bookeditionClient<$Result.GetResult<Prisma.$bookeditionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bookedition that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookeditionFindFirstOrThrowArgs} args - Arguments to find a Bookedition
     * @example
     * // Get one Bookedition
     * const bookedition = await prisma.bookedition.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends bookeditionFindFirstOrThrowArgs>(args?: SelectSubset<T, bookeditionFindFirstOrThrowArgs<ExtArgs>>): Prisma__bookeditionClient<$Result.GetResult<Prisma.$bookeditionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bookeditions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookeditionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bookeditions
     * const bookeditions = await prisma.bookedition.findMany()
     * 
     * // Get first 10 Bookeditions
     * const bookeditions = await prisma.bookedition.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookeditionWithIdOnly = await prisma.bookedition.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends bookeditionFindManyArgs>(args?: SelectSubset<T, bookeditionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$bookeditionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Bookedition.
     * @param {bookeditionCreateArgs} args - Arguments to create a Bookedition.
     * @example
     * // Create one Bookedition
     * const Bookedition = await prisma.bookedition.create({
     *   data: {
     *     // ... data to create a Bookedition
     *   }
     * })
     * 
     */
    create<T extends bookeditionCreateArgs>(args: SelectSubset<T, bookeditionCreateArgs<ExtArgs>>): Prisma__bookeditionClient<$Result.GetResult<Prisma.$bookeditionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bookeditions.
     * @param {bookeditionCreateManyArgs} args - Arguments to create many Bookeditions.
     * @example
     * // Create many Bookeditions
     * const bookedition = await prisma.bookedition.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends bookeditionCreateManyArgs>(args?: SelectSubset<T, bookeditionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Bookedition.
     * @param {bookeditionDeleteArgs} args - Arguments to delete one Bookedition.
     * @example
     * // Delete one Bookedition
     * const Bookedition = await prisma.bookedition.delete({
     *   where: {
     *     // ... filter to delete one Bookedition
     *   }
     * })
     * 
     */
    delete<T extends bookeditionDeleteArgs>(args: SelectSubset<T, bookeditionDeleteArgs<ExtArgs>>): Prisma__bookeditionClient<$Result.GetResult<Prisma.$bookeditionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Bookedition.
     * @param {bookeditionUpdateArgs} args - Arguments to update one Bookedition.
     * @example
     * // Update one Bookedition
     * const bookedition = await prisma.bookedition.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends bookeditionUpdateArgs>(args: SelectSubset<T, bookeditionUpdateArgs<ExtArgs>>): Prisma__bookeditionClient<$Result.GetResult<Prisma.$bookeditionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bookeditions.
     * @param {bookeditionDeleteManyArgs} args - Arguments to filter Bookeditions to delete.
     * @example
     * // Delete a few Bookeditions
     * const { count } = await prisma.bookedition.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends bookeditionDeleteManyArgs>(args?: SelectSubset<T, bookeditionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookeditions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookeditionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bookeditions
     * const bookedition = await prisma.bookedition.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends bookeditionUpdateManyArgs>(args: SelectSubset<T, bookeditionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Bookedition.
     * @param {bookeditionUpsertArgs} args - Arguments to update or create a Bookedition.
     * @example
     * // Update or create a Bookedition
     * const bookedition = await prisma.bookedition.upsert({
     *   create: {
     *     // ... data to create a Bookedition
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Bookedition we want to update
     *   }
     * })
     */
    upsert<T extends bookeditionUpsertArgs>(args: SelectSubset<T, bookeditionUpsertArgs<ExtArgs>>): Prisma__bookeditionClient<$Result.GetResult<Prisma.$bookeditionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bookeditions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookeditionCountArgs} args - Arguments to filter Bookeditions to count.
     * @example
     * // Count the number of Bookeditions
     * const count = await prisma.bookedition.count({
     *   where: {
     *     // ... the filter for the Bookeditions we want to count
     *   }
     * })
    **/
    count<T extends bookeditionCountArgs>(
      args?: Subset<T, bookeditionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookeditionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Bookedition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookeditionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookeditionAggregateArgs>(args: Subset<T, BookeditionAggregateArgs>): Prisma.PrismaPromise<GetBookeditionAggregateType<T>>

    /**
     * Group by Bookedition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookeditionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends bookeditionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: bookeditionGroupByArgs['orderBy'] }
        : { orderBy?: bookeditionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, bookeditionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookeditionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the bookedition model
   */
  readonly fields: bookeditionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for bookedition.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__bookeditionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    books<T extends booksDefaultArgs<ExtArgs> = {}>(args?: Subset<T, booksDefaultArgs<ExtArgs>>): Prisma__booksClient<$Result.GetResult<Prisma.$booksPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    bookeditionstores<T extends bookedition$bookeditionstoresArgs<ExtArgs> = {}>(args?: Subset<T, bookedition$bookeditionstoresArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$bookeditionstoresPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    bookshopeditions<T extends bookedition$bookshopeditionsArgs<ExtArgs> = {}>(args?: Subset<T, bookedition$bookshopeditionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$bookshopeditionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    damagedbooks<T extends bookedition$damagedbooksArgs<ExtArgs> = {}>(args?: Subset<T, bookedition$damagedbooksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$damagedbooksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the bookedition model
   */
  interface bookeditionFieldRefs {
    readonly id: FieldRef<"bookedition", 'Int'>
    readonly edition_name: FieldRef<"bookedition", 'String'>
    readonly selling_price: FieldRef<"bookedition", 'Float'>
    readonly production_price: FieldRef<"bookedition", 'Float'>
    readonly printing_cost: FieldRef<"bookedition", 'Float'>
    readonly binding_cost: FieldRef<"bookedition", 'Float'>
    readonly design_cost: FieldRef<"bookedition", 'Float'>
    readonly translation_cost: FieldRef<"bookedition", 'Float'>
    readonly memo: FieldRef<"bookedition", 'String'>
    readonly book_image_url: FieldRef<"bookedition", 'String'>
    readonly total_print_count: FieldRef<"bookedition", 'Int'>
    readonly book_id: FieldRef<"bookedition", 'Int'>
    readonly number_of_pages: FieldRef<"bookedition", 'Int'>
    readonly bookId: FieldRef<"bookedition", 'Int'>
    readonly is_deleted: FieldRef<"bookedition", 'Boolean'>
    readonly updatedAt: FieldRef<"bookedition", 'DateTime'>
    readonly createdAt: FieldRef<"bookedition", 'DateTime'>
    readonly deletedAt: FieldRef<"bookedition", 'DateTime'>
    readonly editing_cost: FieldRef<"bookedition", 'Float'>
    readonly other_expenses: FieldRef<"bookedition", 'Float'>
    readonly transportation_cost: FieldRef<"bookedition", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * bookedition findUnique
   */
  export type bookeditionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookedition
     */
    select?: bookeditionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookedition
     */
    omit?: bookeditionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionInclude<ExtArgs> | null
    /**
     * Filter, which bookedition to fetch.
     */
    where: bookeditionWhereUniqueInput
  }

  /**
   * bookedition findUniqueOrThrow
   */
  export type bookeditionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookedition
     */
    select?: bookeditionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookedition
     */
    omit?: bookeditionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionInclude<ExtArgs> | null
    /**
     * Filter, which bookedition to fetch.
     */
    where: bookeditionWhereUniqueInput
  }

  /**
   * bookedition findFirst
   */
  export type bookeditionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookedition
     */
    select?: bookeditionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookedition
     */
    omit?: bookeditionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionInclude<ExtArgs> | null
    /**
     * Filter, which bookedition to fetch.
     */
    where?: bookeditionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bookeditions to fetch.
     */
    orderBy?: bookeditionOrderByWithRelationInput | bookeditionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for bookeditions.
     */
    cursor?: bookeditionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bookeditions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bookeditions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of bookeditions.
     */
    distinct?: BookeditionScalarFieldEnum | BookeditionScalarFieldEnum[]
  }

  /**
   * bookedition findFirstOrThrow
   */
  export type bookeditionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookedition
     */
    select?: bookeditionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookedition
     */
    omit?: bookeditionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionInclude<ExtArgs> | null
    /**
     * Filter, which bookedition to fetch.
     */
    where?: bookeditionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bookeditions to fetch.
     */
    orderBy?: bookeditionOrderByWithRelationInput | bookeditionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for bookeditions.
     */
    cursor?: bookeditionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bookeditions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bookeditions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of bookeditions.
     */
    distinct?: BookeditionScalarFieldEnum | BookeditionScalarFieldEnum[]
  }

  /**
   * bookedition findMany
   */
  export type bookeditionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookedition
     */
    select?: bookeditionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookedition
     */
    omit?: bookeditionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionInclude<ExtArgs> | null
    /**
     * Filter, which bookeditions to fetch.
     */
    where?: bookeditionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bookeditions to fetch.
     */
    orderBy?: bookeditionOrderByWithRelationInput | bookeditionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing bookeditions.
     */
    cursor?: bookeditionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bookeditions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bookeditions.
     */
    skip?: number
    distinct?: BookeditionScalarFieldEnum | BookeditionScalarFieldEnum[]
  }

  /**
   * bookedition create
   */
  export type bookeditionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookedition
     */
    select?: bookeditionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookedition
     */
    omit?: bookeditionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionInclude<ExtArgs> | null
    /**
     * The data needed to create a bookedition.
     */
    data: XOR<bookeditionCreateInput, bookeditionUncheckedCreateInput>
  }

  /**
   * bookedition createMany
   */
  export type bookeditionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many bookeditions.
     */
    data: bookeditionCreateManyInput | bookeditionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * bookedition update
   */
  export type bookeditionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookedition
     */
    select?: bookeditionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookedition
     */
    omit?: bookeditionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionInclude<ExtArgs> | null
    /**
     * The data needed to update a bookedition.
     */
    data: XOR<bookeditionUpdateInput, bookeditionUncheckedUpdateInput>
    /**
     * Choose, which bookedition to update.
     */
    where: bookeditionWhereUniqueInput
  }

  /**
   * bookedition updateMany
   */
  export type bookeditionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update bookeditions.
     */
    data: XOR<bookeditionUpdateManyMutationInput, bookeditionUncheckedUpdateManyInput>
    /**
     * Filter which bookeditions to update
     */
    where?: bookeditionWhereInput
    /**
     * Limit how many bookeditions to update.
     */
    limit?: number
  }

  /**
   * bookedition upsert
   */
  export type bookeditionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookedition
     */
    select?: bookeditionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookedition
     */
    omit?: bookeditionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionInclude<ExtArgs> | null
    /**
     * The filter to search for the bookedition to update in case it exists.
     */
    where: bookeditionWhereUniqueInput
    /**
     * In case the bookedition found by the `where` argument doesn't exist, create a new bookedition with this data.
     */
    create: XOR<bookeditionCreateInput, bookeditionUncheckedCreateInput>
    /**
     * In case the bookedition was found with the provided `where` argument, update it with this data.
     */
    update: XOR<bookeditionUpdateInput, bookeditionUncheckedUpdateInput>
  }

  /**
   * bookedition delete
   */
  export type bookeditionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookedition
     */
    select?: bookeditionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookedition
     */
    omit?: bookeditionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionInclude<ExtArgs> | null
    /**
     * Filter which bookedition to delete.
     */
    where: bookeditionWhereUniqueInput
  }

  /**
   * bookedition deleteMany
   */
  export type bookeditionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which bookeditions to delete
     */
    where?: bookeditionWhereInput
    /**
     * Limit how many bookeditions to delete.
     */
    limit?: number
  }

  /**
   * bookedition.bookeditionstores
   */
  export type bookedition$bookeditionstoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookeditionstores
     */
    select?: bookeditionstoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookeditionstores
     */
    omit?: bookeditionstoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionstoresInclude<ExtArgs> | null
    where?: bookeditionstoresWhereInput
    orderBy?: bookeditionstoresOrderByWithRelationInput | bookeditionstoresOrderByWithRelationInput[]
    cursor?: bookeditionstoresWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookeditionstoresScalarFieldEnum | BookeditionstoresScalarFieldEnum[]
  }

  /**
   * bookedition.bookshopeditions
   */
  export type bookedition$bookshopeditionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopeditions
     */
    select?: bookshopeditionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopeditions
     */
    omit?: bookshopeditionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopeditionsInclude<ExtArgs> | null
    where?: bookshopeditionsWhereInput
    orderBy?: bookshopeditionsOrderByWithRelationInput | bookshopeditionsOrderByWithRelationInput[]
    cursor?: bookshopeditionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookshopeditionsScalarFieldEnum | BookshopeditionsScalarFieldEnum[]
  }

  /**
   * bookedition.damagedbooks
   */
  export type bookedition$damagedbooksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the damagedbooks
     */
    select?: damagedbooksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the damagedbooks
     */
    omit?: damagedbooksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: damagedbooksInclude<ExtArgs> | null
    where?: damagedbooksWhereInput
    orderBy?: damagedbooksOrderByWithRelationInput | damagedbooksOrderByWithRelationInput[]
    cursor?: damagedbooksWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DamagedbooksScalarFieldEnum | DamagedbooksScalarFieldEnum[]
  }

  /**
   * bookedition without action
   */
  export type bookeditionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookedition
     */
    select?: bookeditionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookedition
     */
    omit?: bookeditionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionInclude<ExtArgs> | null
  }


  /**
   * Model bookeditionstores
   */

  export type AggregateBookeditionstores = {
    _count: BookeditionstoresCountAggregateOutputType | null
    _avg: BookeditionstoresAvgAggregateOutputType | null
    _sum: BookeditionstoresSumAggregateOutputType | null
    _min: BookeditionstoresMinAggregateOutputType | null
    _max: BookeditionstoresMaxAggregateOutputType | null
  }

  export type BookeditionstoresAvgAggregateOutputType = {
    id: number | null
    editionId: number | null
    quantity: number | null
    storeId: number | null
  }

  export type BookeditionstoresSumAggregateOutputType = {
    id: number | null
    editionId: number | null
    quantity: number | null
    storeId: number | null
  }

  export type BookeditionstoresMinAggregateOutputType = {
    id: number | null
    editionId: number | null
    quantity: number | null
    storeId: number | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type BookeditionstoresMaxAggregateOutputType = {
    id: number | null
    editionId: number | null
    quantity: number | null
    storeId: number | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type BookeditionstoresCountAggregateOutputType = {
    id: number
    editionId: number
    quantity: number
    storeId: number
    is_deleted: number
    updatedAt: number
    createdAt: number
    deletedAt: number
    _all: number
  }


  export type BookeditionstoresAvgAggregateInputType = {
    id?: true
    editionId?: true
    quantity?: true
    storeId?: true
  }

  export type BookeditionstoresSumAggregateInputType = {
    id?: true
    editionId?: true
    quantity?: true
    storeId?: true
  }

  export type BookeditionstoresMinAggregateInputType = {
    id?: true
    editionId?: true
    quantity?: true
    storeId?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
  }

  export type BookeditionstoresMaxAggregateInputType = {
    id?: true
    editionId?: true
    quantity?: true
    storeId?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
  }

  export type BookeditionstoresCountAggregateInputType = {
    id?: true
    editionId?: true
    quantity?: true
    storeId?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    _all?: true
  }

  export type BookeditionstoresAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which bookeditionstores to aggregate.
     */
    where?: bookeditionstoresWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bookeditionstores to fetch.
     */
    orderBy?: bookeditionstoresOrderByWithRelationInput | bookeditionstoresOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: bookeditionstoresWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bookeditionstores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bookeditionstores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned bookeditionstores
    **/
    _count?: true | BookeditionstoresCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookeditionstoresAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookeditionstoresSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookeditionstoresMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookeditionstoresMaxAggregateInputType
  }

  export type GetBookeditionstoresAggregateType<T extends BookeditionstoresAggregateArgs> = {
        [P in keyof T & keyof AggregateBookeditionstores]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookeditionstores[P]>
      : GetScalarType<T[P], AggregateBookeditionstores[P]>
  }




  export type bookeditionstoresGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: bookeditionstoresWhereInput
    orderBy?: bookeditionstoresOrderByWithAggregationInput | bookeditionstoresOrderByWithAggregationInput[]
    by: BookeditionstoresScalarFieldEnum[] | BookeditionstoresScalarFieldEnum
    having?: bookeditionstoresScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookeditionstoresCountAggregateInputType | true
    _avg?: BookeditionstoresAvgAggregateInputType
    _sum?: BookeditionstoresSumAggregateInputType
    _min?: BookeditionstoresMinAggregateInputType
    _max?: BookeditionstoresMaxAggregateInputType
  }

  export type BookeditionstoresGroupByOutputType = {
    id: number
    editionId: number
    quantity: number | null
    storeId: number
    is_deleted: boolean
    updatedAt: Date
    createdAt: Date
    deletedAt: Date
    _count: BookeditionstoresCountAggregateOutputType | null
    _avg: BookeditionstoresAvgAggregateOutputType | null
    _sum: BookeditionstoresSumAggregateOutputType | null
    _min: BookeditionstoresMinAggregateOutputType | null
    _max: BookeditionstoresMaxAggregateOutputType | null
  }

  type GetBookeditionstoresGroupByPayload<T extends bookeditionstoresGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookeditionstoresGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookeditionstoresGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookeditionstoresGroupByOutputType[P]>
            : GetScalarType<T[P], BookeditionstoresGroupByOutputType[P]>
        }
      >
    >


  export type bookeditionstoresSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    editionId?: boolean
    quantity?: boolean
    storeId?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    bookedition?: boolean | bookeditionDefaultArgs<ExtArgs>
    stores?: boolean | storesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookeditionstores"]>



  export type bookeditionstoresSelectScalar = {
    id?: boolean
    editionId?: boolean
    quantity?: boolean
    storeId?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
  }

  export type bookeditionstoresOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "editionId" | "quantity" | "storeId" | "is_deleted" | "updatedAt" | "createdAt" | "deletedAt", ExtArgs["result"]["bookeditionstores"]>
  export type bookeditionstoresInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookedition?: boolean | bookeditionDefaultArgs<ExtArgs>
    stores?: boolean | storesDefaultArgs<ExtArgs>
  }

  export type $bookeditionstoresPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "bookeditionstores"
    objects: {
      bookedition: Prisma.$bookeditionPayload<ExtArgs>
      stores: Prisma.$storesPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      editionId: number
      quantity: number | null
      storeId: number
      is_deleted: boolean
      updatedAt: Date
      createdAt: Date
      deletedAt: Date
    }, ExtArgs["result"]["bookeditionstores"]>
    composites: {}
  }

  type bookeditionstoresGetPayload<S extends boolean | null | undefined | bookeditionstoresDefaultArgs> = $Result.GetResult<Prisma.$bookeditionstoresPayload, S>

  type bookeditionstoresCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<bookeditionstoresFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookeditionstoresCountAggregateInputType | true
    }

  export interface bookeditionstoresDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['bookeditionstores'], meta: { name: 'bookeditionstores' } }
    /**
     * Find zero or one Bookeditionstores that matches the filter.
     * @param {bookeditionstoresFindUniqueArgs} args - Arguments to find a Bookeditionstores
     * @example
     * // Get one Bookeditionstores
     * const bookeditionstores = await prisma.bookeditionstores.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends bookeditionstoresFindUniqueArgs>(args: SelectSubset<T, bookeditionstoresFindUniqueArgs<ExtArgs>>): Prisma__bookeditionstoresClient<$Result.GetResult<Prisma.$bookeditionstoresPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Bookeditionstores that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {bookeditionstoresFindUniqueOrThrowArgs} args - Arguments to find a Bookeditionstores
     * @example
     * // Get one Bookeditionstores
     * const bookeditionstores = await prisma.bookeditionstores.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends bookeditionstoresFindUniqueOrThrowArgs>(args: SelectSubset<T, bookeditionstoresFindUniqueOrThrowArgs<ExtArgs>>): Prisma__bookeditionstoresClient<$Result.GetResult<Prisma.$bookeditionstoresPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bookeditionstores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookeditionstoresFindFirstArgs} args - Arguments to find a Bookeditionstores
     * @example
     * // Get one Bookeditionstores
     * const bookeditionstores = await prisma.bookeditionstores.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends bookeditionstoresFindFirstArgs>(args?: SelectSubset<T, bookeditionstoresFindFirstArgs<ExtArgs>>): Prisma__bookeditionstoresClient<$Result.GetResult<Prisma.$bookeditionstoresPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bookeditionstores that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookeditionstoresFindFirstOrThrowArgs} args - Arguments to find a Bookeditionstores
     * @example
     * // Get one Bookeditionstores
     * const bookeditionstores = await prisma.bookeditionstores.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends bookeditionstoresFindFirstOrThrowArgs>(args?: SelectSubset<T, bookeditionstoresFindFirstOrThrowArgs<ExtArgs>>): Prisma__bookeditionstoresClient<$Result.GetResult<Prisma.$bookeditionstoresPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bookeditionstores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookeditionstoresFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bookeditionstores
     * const bookeditionstores = await prisma.bookeditionstores.findMany()
     * 
     * // Get first 10 Bookeditionstores
     * const bookeditionstores = await prisma.bookeditionstores.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookeditionstoresWithIdOnly = await prisma.bookeditionstores.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends bookeditionstoresFindManyArgs>(args?: SelectSubset<T, bookeditionstoresFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$bookeditionstoresPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Bookeditionstores.
     * @param {bookeditionstoresCreateArgs} args - Arguments to create a Bookeditionstores.
     * @example
     * // Create one Bookeditionstores
     * const Bookeditionstores = await prisma.bookeditionstores.create({
     *   data: {
     *     // ... data to create a Bookeditionstores
     *   }
     * })
     * 
     */
    create<T extends bookeditionstoresCreateArgs>(args: SelectSubset<T, bookeditionstoresCreateArgs<ExtArgs>>): Prisma__bookeditionstoresClient<$Result.GetResult<Prisma.$bookeditionstoresPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bookeditionstores.
     * @param {bookeditionstoresCreateManyArgs} args - Arguments to create many Bookeditionstores.
     * @example
     * // Create many Bookeditionstores
     * const bookeditionstores = await prisma.bookeditionstores.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends bookeditionstoresCreateManyArgs>(args?: SelectSubset<T, bookeditionstoresCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Bookeditionstores.
     * @param {bookeditionstoresDeleteArgs} args - Arguments to delete one Bookeditionstores.
     * @example
     * // Delete one Bookeditionstores
     * const Bookeditionstores = await prisma.bookeditionstores.delete({
     *   where: {
     *     // ... filter to delete one Bookeditionstores
     *   }
     * })
     * 
     */
    delete<T extends bookeditionstoresDeleteArgs>(args: SelectSubset<T, bookeditionstoresDeleteArgs<ExtArgs>>): Prisma__bookeditionstoresClient<$Result.GetResult<Prisma.$bookeditionstoresPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Bookeditionstores.
     * @param {bookeditionstoresUpdateArgs} args - Arguments to update one Bookeditionstores.
     * @example
     * // Update one Bookeditionstores
     * const bookeditionstores = await prisma.bookeditionstores.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends bookeditionstoresUpdateArgs>(args: SelectSubset<T, bookeditionstoresUpdateArgs<ExtArgs>>): Prisma__bookeditionstoresClient<$Result.GetResult<Prisma.$bookeditionstoresPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bookeditionstores.
     * @param {bookeditionstoresDeleteManyArgs} args - Arguments to filter Bookeditionstores to delete.
     * @example
     * // Delete a few Bookeditionstores
     * const { count } = await prisma.bookeditionstores.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends bookeditionstoresDeleteManyArgs>(args?: SelectSubset<T, bookeditionstoresDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookeditionstores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookeditionstoresUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bookeditionstores
     * const bookeditionstores = await prisma.bookeditionstores.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends bookeditionstoresUpdateManyArgs>(args: SelectSubset<T, bookeditionstoresUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Bookeditionstores.
     * @param {bookeditionstoresUpsertArgs} args - Arguments to update or create a Bookeditionstores.
     * @example
     * // Update or create a Bookeditionstores
     * const bookeditionstores = await prisma.bookeditionstores.upsert({
     *   create: {
     *     // ... data to create a Bookeditionstores
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Bookeditionstores we want to update
     *   }
     * })
     */
    upsert<T extends bookeditionstoresUpsertArgs>(args: SelectSubset<T, bookeditionstoresUpsertArgs<ExtArgs>>): Prisma__bookeditionstoresClient<$Result.GetResult<Prisma.$bookeditionstoresPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bookeditionstores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookeditionstoresCountArgs} args - Arguments to filter Bookeditionstores to count.
     * @example
     * // Count the number of Bookeditionstores
     * const count = await prisma.bookeditionstores.count({
     *   where: {
     *     // ... the filter for the Bookeditionstores we want to count
     *   }
     * })
    **/
    count<T extends bookeditionstoresCountArgs>(
      args?: Subset<T, bookeditionstoresCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookeditionstoresCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Bookeditionstores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookeditionstoresAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookeditionstoresAggregateArgs>(args: Subset<T, BookeditionstoresAggregateArgs>): Prisma.PrismaPromise<GetBookeditionstoresAggregateType<T>>

    /**
     * Group by Bookeditionstores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookeditionstoresGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends bookeditionstoresGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: bookeditionstoresGroupByArgs['orderBy'] }
        : { orderBy?: bookeditionstoresGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, bookeditionstoresGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookeditionstoresGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the bookeditionstores model
   */
  readonly fields: bookeditionstoresFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for bookeditionstores.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__bookeditionstoresClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bookedition<T extends bookeditionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, bookeditionDefaultArgs<ExtArgs>>): Prisma__bookeditionClient<$Result.GetResult<Prisma.$bookeditionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    stores<T extends storesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, storesDefaultArgs<ExtArgs>>): Prisma__storesClient<$Result.GetResult<Prisma.$storesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the bookeditionstores model
   */
  interface bookeditionstoresFieldRefs {
    readonly id: FieldRef<"bookeditionstores", 'Int'>
    readonly editionId: FieldRef<"bookeditionstores", 'Int'>
    readonly quantity: FieldRef<"bookeditionstores", 'Int'>
    readonly storeId: FieldRef<"bookeditionstores", 'Int'>
    readonly is_deleted: FieldRef<"bookeditionstores", 'Boolean'>
    readonly updatedAt: FieldRef<"bookeditionstores", 'DateTime'>
    readonly createdAt: FieldRef<"bookeditionstores", 'DateTime'>
    readonly deletedAt: FieldRef<"bookeditionstores", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * bookeditionstores findUnique
   */
  export type bookeditionstoresFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookeditionstores
     */
    select?: bookeditionstoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookeditionstores
     */
    omit?: bookeditionstoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionstoresInclude<ExtArgs> | null
    /**
     * Filter, which bookeditionstores to fetch.
     */
    where: bookeditionstoresWhereUniqueInput
  }

  /**
   * bookeditionstores findUniqueOrThrow
   */
  export type bookeditionstoresFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookeditionstores
     */
    select?: bookeditionstoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookeditionstores
     */
    omit?: bookeditionstoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionstoresInclude<ExtArgs> | null
    /**
     * Filter, which bookeditionstores to fetch.
     */
    where: bookeditionstoresWhereUniqueInput
  }

  /**
   * bookeditionstores findFirst
   */
  export type bookeditionstoresFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookeditionstores
     */
    select?: bookeditionstoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookeditionstores
     */
    omit?: bookeditionstoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionstoresInclude<ExtArgs> | null
    /**
     * Filter, which bookeditionstores to fetch.
     */
    where?: bookeditionstoresWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bookeditionstores to fetch.
     */
    orderBy?: bookeditionstoresOrderByWithRelationInput | bookeditionstoresOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for bookeditionstores.
     */
    cursor?: bookeditionstoresWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bookeditionstores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bookeditionstores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of bookeditionstores.
     */
    distinct?: BookeditionstoresScalarFieldEnum | BookeditionstoresScalarFieldEnum[]
  }

  /**
   * bookeditionstores findFirstOrThrow
   */
  export type bookeditionstoresFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookeditionstores
     */
    select?: bookeditionstoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookeditionstores
     */
    omit?: bookeditionstoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionstoresInclude<ExtArgs> | null
    /**
     * Filter, which bookeditionstores to fetch.
     */
    where?: bookeditionstoresWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bookeditionstores to fetch.
     */
    orderBy?: bookeditionstoresOrderByWithRelationInput | bookeditionstoresOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for bookeditionstores.
     */
    cursor?: bookeditionstoresWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bookeditionstores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bookeditionstores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of bookeditionstores.
     */
    distinct?: BookeditionstoresScalarFieldEnum | BookeditionstoresScalarFieldEnum[]
  }

  /**
   * bookeditionstores findMany
   */
  export type bookeditionstoresFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookeditionstores
     */
    select?: bookeditionstoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookeditionstores
     */
    omit?: bookeditionstoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionstoresInclude<ExtArgs> | null
    /**
     * Filter, which bookeditionstores to fetch.
     */
    where?: bookeditionstoresWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bookeditionstores to fetch.
     */
    orderBy?: bookeditionstoresOrderByWithRelationInput | bookeditionstoresOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing bookeditionstores.
     */
    cursor?: bookeditionstoresWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bookeditionstores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bookeditionstores.
     */
    skip?: number
    distinct?: BookeditionstoresScalarFieldEnum | BookeditionstoresScalarFieldEnum[]
  }

  /**
   * bookeditionstores create
   */
  export type bookeditionstoresCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookeditionstores
     */
    select?: bookeditionstoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookeditionstores
     */
    omit?: bookeditionstoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionstoresInclude<ExtArgs> | null
    /**
     * The data needed to create a bookeditionstores.
     */
    data: XOR<bookeditionstoresCreateInput, bookeditionstoresUncheckedCreateInput>
  }

  /**
   * bookeditionstores createMany
   */
  export type bookeditionstoresCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many bookeditionstores.
     */
    data: bookeditionstoresCreateManyInput | bookeditionstoresCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * bookeditionstores update
   */
  export type bookeditionstoresUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookeditionstores
     */
    select?: bookeditionstoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookeditionstores
     */
    omit?: bookeditionstoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionstoresInclude<ExtArgs> | null
    /**
     * The data needed to update a bookeditionstores.
     */
    data: XOR<bookeditionstoresUpdateInput, bookeditionstoresUncheckedUpdateInput>
    /**
     * Choose, which bookeditionstores to update.
     */
    where: bookeditionstoresWhereUniqueInput
  }

  /**
   * bookeditionstores updateMany
   */
  export type bookeditionstoresUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update bookeditionstores.
     */
    data: XOR<bookeditionstoresUpdateManyMutationInput, bookeditionstoresUncheckedUpdateManyInput>
    /**
     * Filter which bookeditionstores to update
     */
    where?: bookeditionstoresWhereInput
    /**
     * Limit how many bookeditionstores to update.
     */
    limit?: number
  }

  /**
   * bookeditionstores upsert
   */
  export type bookeditionstoresUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookeditionstores
     */
    select?: bookeditionstoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookeditionstores
     */
    omit?: bookeditionstoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionstoresInclude<ExtArgs> | null
    /**
     * The filter to search for the bookeditionstores to update in case it exists.
     */
    where: bookeditionstoresWhereUniqueInput
    /**
     * In case the bookeditionstores found by the `where` argument doesn't exist, create a new bookeditionstores with this data.
     */
    create: XOR<bookeditionstoresCreateInput, bookeditionstoresUncheckedCreateInput>
    /**
     * In case the bookeditionstores was found with the provided `where` argument, update it with this data.
     */
    update: XOR<bookeditionstoresUpdateInput, bookeditionstoresUncheckedUpdateInput>
  }

  /**
   * bookeditionstores delete
   */
  export type bookeditionstoresDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookeditionstores
     */
    select?: bookeditionstoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookeditionstores
     */
    omit?: bookeditionstoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionstoresInclude<ExtArgs> | null
    /**
     * Filter which bookeditionstores to delete.
     */
    where: bookeditionstoresWhereUniqueInput
  }

  /**
   * bookeditionstores deleteMany
   */
  export type bookeditionstoresDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which bookeditionstores to delete
     */
    where?: bookeditionstoresWhereInput
    /**
     * Limit how many bookeditionstores to delete.
     */
    limit?: number
  }

  /**
   * bookeditionstores without action
   */
  export type bookeditionstoresDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookeditionstores
     */
    select?: bookeditionstoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookeditionstores
     */
    omit?: bookeditionstoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionstoresInclude<ExtArgs> | null
  }


  /**
   * Model books
   */

  export type AggregateBooks = {
    _count: BooksCountAggregateOutputType | null
    _avg: BooksAvgAggregateOutputType | null
    _sum: BooksSumAggregateOutputType | null
    _min: BooksMinAggregateOutputType | null
    _max: BooksMaxAggregateOutputType | null
  }

  export type BooksAvgAggregateOutputType = {
    id: number | null
    number_of_pages: number | null
  }

  export type BooksSumAggregateOutputType = {
    id: number | null
    number_of_pages: number | null
  }

  export type BooksMinAggregateOutputType = {
    id: number | null
    unique_identification_code: string | null
    isbn: string | null
    title: string | null
    author: string | null
    translator: string | null
    designer: string | null
    language: string | null
    edition: string | null
    category: string | null
    publication_year: string | null
    print_batch_id: string | null
    book_sku: string | null
    number_of_pages: number | null
    info: string | null
    book_image_url: string | null
    status: string | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
    productionstatus: $Enums.books_productionstatus | null
    default_edition_id: string | null
  }

  export type BooksMaxAggregateOutputType = {
    id: number | null
    unique_identification_code: string | null
    isbn: string | null
    title: string | null
    author: string | null
    translator: string | null
    designer: string | null
    language: string | null
    edition: string | null
    category: string | null
    publication_year: string | null
    print_batch_id: string | null
    book_sku: string | null
    number_of_pages: number | null
    info: string | null
    book_image_url: string | null
    status: string | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
    productionstatus: $Enums.books_productionstatus | null
    default_edition_id: string | null
  }

  export type BooksCountAggregateOutputType = {
    id: number
    unique_identification_code: number
    isbn: number
    title: number
    author: number
    translator: number
    designer: number
    language: number
    edition: number
    category: number
    publication_year: number
    print_batch_id: number
    book_sku: number
    number_of_pages: number
    info: number
    book_image_url: number
    status: number
    is_deleted: number
    updatedAt: number
    createdAt: number
    deletedAt: number
    productionstatus: number
    default_edition_id: number
    _all: number
  }


  export type BooksAvgAggregateInputType = {
    id?: true
    number_of_pages?: true
  }

  export type BooksSumAggregateInputType = {
    id?: true
    number_of_pages?: true
  }

  export type BooksMinAggregateInputType = {
    id?: true
    unique_identification_code?: true
    isbn?: true
    title?: true
    author?: true
    translator?: true
    designer?: true
    language?: true
    edition?: true
    category?: true
    publication_year?: true
    print_batch_id?: true
    book_sku?: true
    number_of_pages?: true
    info?: true
    book_image_url?: true
    status?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    productionstatus?: true
    default_edition_id?: true
  }

  export type BooksMaxAggregateInputType = {
    id?: true
    unique_identification_code?: true
    isbn?: true
    title?: true
    author?: true
    translator?: true
    designer?: true
    language?: true
    edition?: true
    category?: true
    publication_year?: true
    print_batch_id?: true
    book_sku?: true
    number_of_pages?: true
    info?: true
    book_image_url?: true
    status?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    productionstatus?: true
    default_edition_id?: true
  }

  export type BooksCountAggregateInputType = {
    id?: true
    unique_identification_code?: true
    isbn?: true
    title?: true
    author?: true
    translator?: true
    designer?: true
    language?: true
    edition?: true
    category?: true
    publication_year?: true
    print_batch_id?: true
    book_sku?: true
    number_of_pages?: true
    info?: true
    book_image_url?: true
    status?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    productionstatus?: true
    default_edition_id?: true
    _all?: true
  }

  export type BooksAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which books to aggregate.
     */
    where?: booksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of books to fetch.
     */
    orderBy?: booksOrderByWithRelationInput | booksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: booksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` books from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` books.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned books
    **/
    _count?: true | BooksCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BooksAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BooksSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BooksMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BooksMaxAggregateInputType
  }

  export type GetBooksAggregateType<T extends BooksAggregateArgs> = {
        [P in keyof T & keyof AggregateBooks]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBooks[P]>
      : GetScalarType<T[P], AggregateBooks[P]>
  }




  export type booksGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: booksWhereInput
    orderBy?: booksOrderByWithAggregationInput | booksOrderByWithAggregationInput[]
    by: BooksScalarFieldEnum[] | BooksScalarFieldEnum
    having?: booksScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BooksCountAggregateInputType | true
    _avg?: BooksAvgAggregateInputType
    _sum?: BooksSumAggregateInputType
    _min?: BooksMinAggregateInputType
    _max?: BooksMaxAggregateInputType
  }

  export type BooksGroupByOutputType = {
    id: number
    unique_identification_code: string
    isbn: string | null
    title: string
    author: string
    translator: string | null
    designer: string | null
    language: string
    edition: string
    category: string
    publication_year: string
    print_batch_id: string | null
    book_sku: string
    number_of_pages: number | null
    info: string | null
    book_image_url: string | null
    status: string
    is_deleted: boolean
    updatedAt: Date
    createdAt: Date
    deletedAt: Date
    productionstatus: $Enums.books_productionstatus | null
    default_edition_id: string | null
    _count: BooksCountAggregateOutputType | null
    _avg: BooksAvgAggregateOutputType | null
    _sum: BooksSumAggregateOutputType | null
    _min: BooksMinAggregateOutputType | null
    _max: BooksMaxAggregateOutputType | null
  }

  type GetBooksGroupByPayload<T extends booksGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BooksGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BooksGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BooksGroupByOutputType[P]>
            : GetScalarType<T[P], BooksGroupByOutputType[P]>
        }
      >
    >


  export type booksSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    unique_identification_code?: boolean
    isbn?: boolean
    title?: boolean
    author?: boolean
    translator?: boolean
    designer?: boolean
    language?: boolean
    edition?: boolean
    category?: boolean
    publication_year?: boolean
    print_batch_id?: boolean
    book_sku?: boolean
    number_of_pages?: boolean
    info?: boolean
    book_image_url?: boolean
    status?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    productionstatus?: boolean
    default_edition_id?: boolean
    bookedition?: boolean | books$bookeditionArgs<ExtArgs>
    damagedbooks?: boolean | books$damagedbooksArgs<ExtArgs>
    translatorbook?: boolean | books$translatorbookArgs<ExtArgs>
    _count?: boolean | BooksCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["books"]>



  export type booksSelectScalar = {
    id?: boolean
    unique_identification_code?: boolean
    isbn?: boolean
    title?: boolean
    author?: boolean
    translator?: boolean
    designer?: boolean
    language?: boolean
    edition?: boolean
    category?: boolean
    publication_year?: boolean
    print_batch_id?: boolean
    book_sku?: boolean
    number_of_pages?: boolean
    info?: boolean
    book_image_url?: boolean
    status?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    productionstatus?: boolean
    default_edition_id?: boolean
  }

  export type booksOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "unique_identification_code" | "isbn" | "title" | "author" | "translator" | "designer" | "language" | "edition" | "category" | "publication_year" | "print_batch_id" | "book_sku" | "number_of_pages" | "info" | "book_image_url" | "status" | "is_deleted" | "updatedAt" | "createdAt" | "deletedAt" | "productionstatus" | "default_edition_id", ExtArgs["result"]["books"]>
  export type booksInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookedition?: boolean | books$bookeditionArgs<ExtArgs>
    damagedbooks?: boolean | books$damagedbooksArgs<ExtArgs>
    translatorbook?: boolean | books$translatorbookArgs<ExtArgs>
    _count?: boolean | BooksCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $booksPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "books"
    objects: {
      bookedition: Prisma.$bookeditionPayload<ExtArgs>[]
      damagedbooks: Prisma.$damagedbooksPayload<ExtArgs>[]
      translatorbook: Prisma.$translatorbookPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      unique_identification_code: string
      isbn: string | null
      title: string
      author: string
      translator: string | null
      designer: string | null
      language: string
      edition: string
      category: string
      publication_year: string
      print_batch_id: string | null
      book_sku: string
      number_of_pages: number | null
      info: string | null
      book_image_url: string | null
      status: string
      is_deleted: boolean
      updatedAt: Date
      createdAt: Date
      deletedAt: Date
      productionstatus: $Enums.books_productionstatus | null
      default_edition_id: string | null
    }, ExtArgs["result"]["books"]>
    composites: {}
  }

  type booksGetPayload<S extends boolean | null | undefined | booksDefaultArgs> = $Result.GetResult<Prisma.$booksPayload, S>

  type booksCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<booksFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BooksCountAggregateInputType | true
    }

  export interface booksDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['books'], meta: { name: 'books' } }
    /**
     * Find zero or one Books that matches the filter.
     * @param {booksFindUniqueArgs} args - Arguments to find a Books
     * @example
     * // Get one Books
     * const books = await prisma.books.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends booksFindUniqueArgs>(args: SelectSubset<T, booksFindUniqueArgs<ExtArgs>>): Prisma__booksClient<$Result.GetResult<Prisma.$booksPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Books that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {booksFindUniqueOrThrowArgs} args - Arguments to find a Books
     * @example
     * // Get one Books
     * const books = await prisma.books.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends booksFindUniqueOrThrowArgs>(args: SelectSubset<T, booksFindUniqueOrThrowArgs<ExtArgs>>): Prisma__booksClient<$Result.GetResult<Prisma.$booksPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Books that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {booksFindFirstArgs} args - Arguments to find a Books
     * @example
     * // Get one Books
     * const books = await prisma.books.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends booksFindFirstArgs>(args?: SelectSubset<T, booksFindFirstArgs<ExtArgs>>): Prisma__booksClient<$Result.GetResult<Prisma.$booksPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Books that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {booksFindFirstOrThrowArgs} args - Arguments to find a Books
     * @example
     * // Get one Books
     * const books = await prisma.books.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends booksFindFirstOrThrowArgs>(args?: SelectSubset<T, booksFindFirstOrThrowArgs<ExtArgs>>): Prisma__booksClient<$Result.GetResult<Prisma.$booksPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Books that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {booksFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Books
     * const books = await prisma.books.findMany()
     * 
     * // Get first 10 Books
     * const books = await prisma.books.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const booksWithIdOnly = await prisma.books.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends booksFindManyArgs>(args?: SelectSubset<T, booksFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$booksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Books.
     * @param {booksCreateArgs} args - Arguments to create a Books.
     * @example
     * // Create one Books
     * const Books = await prisma.books.create({
     *   data: {
     *     // ... data to create a Books
     *   }
     * })
     * 
     */
    create<T extends booksCreateArgs>(args: SelectSubset<T, booksCreateArgs<ExtArgs>>): Prisma__booksClient<$Result.GetResult<Prisma.$booksPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Books.
     * @param {booksCreateManyArgs} args - Arguments to create many Books.
     * @example
     * // Create many Books
     * const books = await prisma.books.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends booksCreateManyArgs>(args?: SelectSubset<T, booksCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Books.
     * @param {booksDeleteArgs} args - Arguments to delete one Books.
     * @example
     * // Delete one Books
     * const Books = await prisma.books.delete({
     *   where: {
     *     // ... filter to delete one Books
     *   }
     * })
     * 
     */
    delete<T extends booksDeleteArgs>(args: SelectSubset<T, booksDeleteArgs<ExtArgs>>): Prisma__booksClient<$Result.GetResult<Prisma.$booksPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Books.
     * @param {booksUpdateArgs} args - Arguments to update one Books.
     * @example
     * // Update one Books
     * const books = await prisma.books.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends booksUpdateArgs>(args: SelectSubset<T, booksUpdateArgs<ExtArgs>>): Prisma__booksClient<$Result.GetResult<Prisma.$booksPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Books.
     * @param {booksDeleteManyArgs} args - Arguments to filter Books to delete.
     * @example
     * // Delete a few Books
     * const { count } = await prisma.books.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends booksDeleteManyArgs>(args?: SelectSubset<T, booksDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Books.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {booksUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Books
     * const books = await prisma.books.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends booksUpdateManyArgs>(args: SelectSubset<T, booksUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Books.
     * @param {booksUpsertArgs} args - Arguments to update or create a Books.
     * @example
     * // Update or create a Books
     * const books = await prisma.books.upsert({
     *   create: {
     *     // ... data to create a Books
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Books we want to update
     *   }
     * })
     */
    upsert<T extends booksUpsertArgs>(args: SelectSubset<T, booksUpsertArgs<ExtArgs>>): Prisma__booksClient<$Result.GetResult<Prisma.$booksPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Books.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {booksCountArgs} args - Arguments to filter Books to count.
     * @example
     * // Count the number of Books
     * const count = await prisma.books.count({
     *   where: {
     *     // ... the filter for the Books we want to count
     *   }
     * })
    **/
    count<T extends booksCountArgs>(
      args?: Subset<T, booksCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BooksCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Books.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BooksAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BooksAggregateArgs>(args: Subset<T, BooksAggregateArgs>): Prisma.PrismaPromise<GetBooksAggregateType<T>>

    /**
     * Group by Books.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {booksGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends booksGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: booksGroupByArgs['orderBy'] }
        : { orderBy?: booksGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, booksGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBooksGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the books model
   */
  readonly fields: booksFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for books.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__booksClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bookedition<T extends books$bookeditionArgs<ExtArgs> = {}>(args?: Subset<T, books$bookeditionArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$bookeditionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    damagedbooks<T extends books$damagedbooksArgs<ExtArgs> = {}>(args?: Subset<T, books$damagedbooksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$damagedbooksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    translatorbook<T extends books$translatorbookArgs<ExtArgs> = {}>(args?: Subset<T, books$translatorbookArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$translatorbookPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the books model
   */
  interface booksFieldRefs {
    readonly id: FieldRef<"books", 'Int'>
    readonly unique_identification_code: FieldRef<"books", 'String'>
    readonly isbn: FieldRef<"books", 'String'>
    readonly title: FieldRef<"books", 'String'>
    readonly author: FieldRef<"books", 'String'>
    readonly translator: FieldRef<"books", 'String'>
    readonly designer: FieldRef<"books", 'String'>
    readonly language: FieldRef<"books", 'String'>
    readonly edition: FieldRef<"books", 'String'>
    readonly category: FieldRef<"books", 'String'>
    readonly publication_year: FieldRef<"books", 'String'>
    readonly print_batch_id: FieldRef<"books", 'String'>
    readonly book_sku: FieldRef<"books", 'String'>
    readonly number_of_pages: FieldRef<"books", 'Int'>
    readonly info: FieldRef<"books", 'String'>
    readonly book_image_url: FieldRef<"books", 'String'>
    readonly status: FieldRef<"books", 'String'>
    readonly is_deleted: FieldRef<"books", 'Boolean'>
    readonly updatedAt: FieldRef<"books", 'DateTime'>
    readonly createdAt: FieldRef<"books", 'DateTime'>
    readonly deletedAt: FieldRef<"books", 'DateTime'>
    readonly productionstatus: FieldRef<"books", 'books_productionstatus'>
    readonly default_edition_id: FieldRef<"books", 'String'>
  }
    

  // Custom InputTypes
  /**
   * books findUnique
   */
  export type booksFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the books
     */
    select?: booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the books
     */
    omit?: booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: booksInclude<ExtArgs> | null
    /**
     * Filter, which books to fetch.
     */
    where: booksWhereUniqueInput
  }

  /**
   * books findUniqueOrThrow
   */
  export type booksFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the books
     */
    select?: booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the books
     */
    omit?: booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: booksInclude<ExtArgs> | null
    /**
     * Filter, which books to fetch.
     */
    where: booksWhereUniqueInput
  }

  /**
   * books findFirst
   */
  export type booksFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the books
     */
    select?: booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the books
     */
    omit?: booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: booksInclude<ExtArgs> | null
    /**
     * Filter, which books to fetch.
     */
    where?: booksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of books to fetch.
     */
    orderBy?: booksOrderByWithRelationInput | booksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for books.
     */
    cursor?: booksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` books from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` books.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of books.
     */
    distinct?: BooksScalarFieldEnum | BooksScalarFieldEnum[]
  }

  /**
   * books findFirstOrThrow
   */
  export type booksFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the books
     */
    select?: booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the books
     */
    omit?: booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: booksInclude<ExtArgs> | null
    /**
     * Filter, which books to fetch.
     */
    where?: booksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of books to fetch.
     */
    orderBy?: booksOrderByWithRelationInput | booksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for books.
     */
    cursor?: booksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` books from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` books.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of books.
     */
    distinct?: BooksScalarFieldEnum | BooksScalarFieldEnum[]
  }

  /**
   * books findMany
   */
  export type booksFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the books
     */
    select?: booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the books
     */
    omit?: booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: booksInclude<ExtArgs> | null
    /**
     * Filter, which books to fetch.
     */
    where?: booksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of books to fetch.
     */
    orderBy?: booksOrderByWithRelationInput | booksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing books.
     */
    cursor?: booksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` books from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` books.
     */
    skip?: number
    distinct?: BooksScalarFieldEnum | BooksScalarFieldEnum[]
  }

  /**
   * books create
   */
  export type booksCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the books
     */
    select?: booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the books
     */
    omit?: booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: booksInclude<ExtArgs> | null
    /**
     * The data needed to create a books.
     */
    data: XOR<booksCreateInput, booksUncheckedCreateInput>
  }

  /**
   * books createMany
   */
  export type booksCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many books.
     */
    data: booksCreateManyInput | booksCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * books update
   */
  export type booksUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the books
     */
    select?: booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the books
     */
    omit?: booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: booksInclude<ExtArgs> | null
    /**
     * The data needed to update a books.
     */
    data: XOR<booksUpdateInput, booksUncheckedUpdateInput>
    /**
     * Choose, which books to update.
     */
    where: booksWhereUniqueInput
  }

  /**
   * books updateMany
   */
  export type booksUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update books.
     */
    data: XOR<booksUpdateManyMutationInput, booksUncheckedUpdateManyInput>
    /**
     * Filter which books to update
     */
    where?: booksWhereInput
    /**
     * Limit how many books to update.
     */
    limit?: number
  }

  /**
   * books upsert
   */
  export type booksUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the books
     */
    select?: booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the books
     */
    omit?: booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: booksInclude<ExtArgs> | null
    /**
     * The filter to search for the books to update in case it exists.
     */
    where: booksWhereUniqueInput
    /**
     * In case the books found by the `where` argument doesn't exist, create a new books with this data.
     */
    create: XOR<booksCreateInput, booksUncheckedCreateInput>
    /**
     * In case the books was found with the provided `where` argument, update it with this data.
     */
    update: XOR<booksUpdateInput, booksUncheckedUpdateInput>
  }

  /**
   * books delete
   */
  export type booksDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the books
     */
    select?: booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the books
     */
    omit?: booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: booksInclude<ExtArgs> | null
    /**
     * Filter which books to delete.
     */
    where: booksWhereUniqueInput
  }

  /**
   * books deleteMany
   */
  export type booksDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which books to delete
     */
    where?: booksWhereInput
    /**
     * Limit how many books to delete.
     */
    limit?: number
  }

  /**
   * books.bookedition
   */
  export type books$bookeditionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookedition
     */
    select?: bookeditionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookedition
     */
    omit?: bookeditionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionInclude<ExtArgs> | null
    where?: bookeditionWhereInput
    orderBy?: bookeditionOrderByWithRelationInput | bookeditionOrderByWithRelationInput[]
    cursor?: bookeditionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookeditionScalarFieldEnum | BookeditionScalarFieldEnum[]
  }

  /**
   * books.damagedbooks
   */
  export type books$damagedbooksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the damagedbooks
     */
    select?: damagedbooksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the damagedbooks
     */
    omit?: damagedbooksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: damagedbooksInclude<ExtArgs> | null
    where?: damagedbooksWhereInput
    orderBy?: damagedbooksOrderByWithRelationInput | damagedbooksOrderByWithRelationInput[]
    cursor?: damagedbooksWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DamagedbooksScalarFieldEnum | DamagedbooksScalarFieldEnum[]
  }

  /**
   * books.translatorbook
   */
  export type books$translatorbookArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translatorbook
     */
    select?: translatorbookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translatorbook
     */
    omit?: translatorbookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorbookInclude<ExtArgs> | null
    where?: translatorbookWhereInput
    orderBy?: translatorbookOrderByWithRelationInput | translatorbookOrderByWithRelationInput[]
    cursor?: translatorbookWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TranslatorbookScalarFieldEnum | TranslatorbookScalarFieldEnum[]
  }

  /**
   * books without action
   */
  export type booksDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the books
     */
    select?: booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the books
     */
    omit?: booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: booksInclude<ExtArgs> | null
  }


  /**
   * Model bookshopeditions
   */

  export type AggregateBookshopeditions = {
    _count: BookshopeditionsCountAggregateOutputType | null
    _avg: BookshopeditionsAvgAggregateOutputType | null
    _sum: BookshopeditionsSumAggregateOutputType | null
    _min: BookshopeditionsMinAggregateOutputType | null
    _max: BookshopeditionsMaxAggregateOutputType | null
  }

  export type BookshopeditionsAvgAggregateOutputType = {
    id: number | null
    bookShopId: number | null
    bookEditionId: number | null
    quantity: number | null
    price_per_peice: number | null
    total_price: number | null
    already_paid: number | null
    remaining_amount: number | null
  }

  export type BookshopeditionsSumAggregateOutputType = {
    id: number | null
    bookShopId: number | null
    bookEditionId: number | null
    quantity: number | null
    price_per_peice: number | null
    total_price: number | null
    already_paid: number | null
    remaining_amount: number | null
  }

  export type BookshopeditionsMinAggregateOutputType = {
    id: number | null
    bookShopId: number | null
    bookEditionId: number | null
    quantity: number | null
    price_per_peice: number | null
    total_price: number | null
    memo: string | null
    already_paid: number | null
    remaining_amount: number | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type BookshopeditionsMaxAggregateOutputType = {
    id: number | null
    bookShopId: number | null
    bookEditionId: number | null
    quantity: number | null
    price_per_peice: number | null
    total_price: number | null
    memo: string | null
    already_paid: number | null
    remaining_amount: number | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type BookshopeditionsCountAggregateOutputType = {
    id: number
    bookShopId: number
    bookEditionId: number
    quantity: number
    price_per_peice: number
    total_price: number
    memo: number
    already_paid: number
    remaining_amount: number
    is_deleted: number
    updatedAt: number
    createdAt: number
    deletedAt: number
    _all: number
  }


  export type BookshopeditionsAvgAggregateInputType = {
    id?: true
    bookShopId?: true
    bookEditionId?: true
    quantity?: true
    price_per_peice?: true
    total_price?: true
    already_paid?: true
    remaining_amount?: true
  }

  export type BookshopeditionsSumAggregateInputType = {
    id?: true
    bookShopId?: true
    bookEditionId?: true
    quantity?: true
    price_per_peice?: true
    total_price?: true
    already_paid?: true
    remaining_amount?: true
  }

  export type BookshopeditionsMinAggregateInputType = {
    id?: true
    bookShopId?: true
    bookEditionId?: true
    quantity?: true
    price_per_peice?: true
    total_price?: true
    memo?: true
    already_paid?: true
    remaining_amount?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
  }

  export type BookshopeditionsMaxAggregateInputType = {
    id?: true
    bookShopId?: true
    bookEditionId?: true
    quantity?: true
    price_per_peice?: true
    total_price?: true
    memo?: true
    already_paid?: true
    remaining_amount?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
  }

  export type BookshopeditionsCountAggregateInputType = {
    id?: true
    bookShopId?: true
    bookEditionId?: true
    quantity?: true
    price_per_peice?: true
    total_price?: true
    memo?: true
    already_paid?: true
    remaining_amount?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    _all?: true
  }

  export type BookshopeditionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which bookshopeditions to aggregate.
     */
    where?: bookshopeditionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bookshopeditions to fetch.
     */
    orderBy?: bookshopeditionsOrderByWithRelationInput | bookshopeditionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: bookshopeditionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bookshopeditions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bookshopeditions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned bookshopeditions
    **/
    _count?: true | BookshopeditionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookshopeditionsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookshopeditionsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookshopeditionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookshopeditionsMaxAggregateInputType
  }

  export type GetBookshopeditionsAggregateType<T extends BookshopeditionsAggregateArgs> = {
        [P in keyof T & keyof AggregateBookshopeditions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookshopeditions[P]>
      : GetScalarType<T[P], AggregateBookshopeditions[P]>
  }




  export type bookshopeditionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: bookshopeditionsWhereInput
    orderBy?: bookshopeditionsOrderByWithAggregationInput | bookshopeditionsOrderByWithAggregationInput[]
    by: BookshopeditionsScalarFieldEnum[] | BookshopeditionsScalarFieldEnum
    having?: bookshopeditionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookshopeditionsCountAggregateInputType | true
    _avg?: BookshopeditionsAvgAggregateInputType
    _sum?: BookshopeditionsSumAggregateInputType
    _min?: BookshopeditionsMinAggregateInputType
    _max?: BookshopeditionsMaxAggregateInputType
  }

  export type BookshopeditionsGroupByOutputType = {
    id: number
    bookShopId: number
    bookEditionId: number
    quantity: number
    price_per_peice: number | null
    total_price: number | null
    memo: string | null
    already_paid: number | null
    remaining_amount: number | null
    is_deleted: boolean
    updatedAt: Date
    createdAt: Date
    deletedAt: Date
    _count: BookshopeditionsCountAggregateOutputType | null
    _avg: BookshopeditionsAvgAggregateOutputType | null
    _sum: BookshopeditionsSumAggregateOutputType | null
    _min: BookshopeditionsMinAggregateOutputType | null
    _max: BookshopeditionsMaxAggregateOutputType | null
  }

  type GetBookshopeditionsGroupByPayload<T extends bookshopeditionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookshopeditionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookshopeditionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookshopeditionsGroupByOutputType[P]>
            : GetScalarType<T[P], BookshopeditionsGroupByOutputType[P]>
        }
      >
    >


  export type bookshopeditionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookShopId?: boolean
    bookEditionId?: boolean
    quantity?: boolean
    price_per_peice?: boolean
    total_price?: boolean
    memo?: boolean
    already_paid?: boolean
    remaining_amount?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    bookedition?: boolean | bookeditionDefaultArgs<ExtArgs>
    bookshopes?: boolean | bookshopesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookshopeditions"]>



  export type bookshopeditionsSelectScalar = {
    id?: boolean
    bookShopId?: boolean
    bookEditionId?: boolean
    quantity?: boolean
    price_per_peice?: boolean
    total_price?: boolean
    memo?: boolean
    already_paid?: boolean
    remaining_amount?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
  }

  export type bookshopeditionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "bookShopId" | "bookEditionId" | "quantity" | "price_per_peice" | "total_price" | "memo" | "already_paid" | "remaining_amount" | "is_deleted" | "updatedAt" | "createdAt" | "deletedAt", ExtArgs["result"]["bookshopeditions"]>
  export type bookshopeditionsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookedition?: boolean | bookeditionDefaultArgs<ExtArgs>
    bookshopes?: boolean | bookshopesDefaultArgs<ExtArgs>
  }

  export type $bookshopeditionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "bookshopeditions"
    objects: {
      bookedition: Prisma.$bookeditionPayload<ExtArgs>
      bookshopes: Prisma.$bookshopesPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      bookShopId: number
      bookEditionId: number
      quantity: number
      price_per_peice: number | null
      total_price: number | null
      memo: string | null
      already_paid: number | null
      remaining_amount: number | null
      is_deleted: boolean
      updatedAt: Date
      createdAt: Date
      deletedAt: Date
    }, ExtArgs["result"]["bookshopeditions"]>
    composites: {}
  }

  type bookshopeditionsGetPayload<S extends boolean | null | undefined | bookshopeditionsDefaultArgs> = $Result.GetResult<Prisma.$bookshopeditionsPayload, S>

  type bookshopeditionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<bookshopeditionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookshopeditionsCountAggregateInputType | true
    }

  export interface bookshopeditionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['bookshopeditions'], meta: { name: 'bookshopeditions' } }
    /**
     * Find zero or one Bookshopeditions that matches the filter.
     * @param {bookshopeditionsFindUniqueArgs} args - Arguments to find a Bookshopeditions
     * @example
     * // Get one Bookshopeditions
     * const bookshopeditions = await prisma.bookshopeditions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends bookshopeditionsFindUniqueArgs>(args: SelectSubset<T, bookshopeditionsFindUniqueArgs<ExtArgs>>): Prisma__bookshopeditionsClient<$Result.GetResult<Prisma.$bookshopeditionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Bookshopeditions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {bookshopeditionsFindUniqueOrThrowArgs} args - Arguments to find a Bookshopeditions
     * @example
     * // Get one Bookshopeditions
     * const bookshopeditions = await prisma.bookshopeditions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends bookshopeditionsFindUniqueOrThrowArgs>(args: SelectSubset<T, bookshopeditionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__bookshopeditionsClient<$Result.GetResult<Prisma.$bookshopeditionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bookshopeditions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookshopeditionsFindFirstArgs} args - Arguments to find a Bookshopeditions
     * @example
     * // Get one Bookshopeditions
     * const bookshopeditions = await prisma.bookshopeditions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends bookshopeditionsFindFirstArgs>(args?: SelectSubset<T, bookshopeditionsFindFirstArgs<ExtArgs>>): Prisma__bookshopeditionsClient<$Result.GetResult<Prisma.$bookshopeditionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bookshopeditions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookshopeditionsFindFirstOrThrowArgs} args - Arguments to find a Bookshopeditions
     * @example
     * // Get one Bookshopeditions
     * const bookshopeditions = await prisma.bookshopeditions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends bookshopeditionsFindFirstOrThrowArgs>(args?: SelectSubset<T, bookshopeditionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__bookshopeditionsClient<$Result.GetResult<Prisma.$bookshopeditionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bookshopeditions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookshopeditionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bookshopeditions
     * const bookshopeditions = await prisma.bookshopeditions.findMany()
     * 
     * // Get first 10 Bookshopeditions
     * const bookshopeditions = await prisma.bookshopeditions.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookshopeditionsWithIdOnly = await prisma.bookshopeditions.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends bookshopeditionsFindManyArgs>(args?: SelectSubset<T, bookshopeditionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$bookshopeditionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Bookshopeditions.
     * @param {bookshopeditionsCreateArgs} args - Arguments to create a Bookshopeditions.
     * @example
     * // Create one Bookshopeditions
     * const Bookshopeditions = await prisma.bookshopeditions.create({
     *   data: {
     *     // ... data to create a Bookshopeditions
     *   }
     * })
     * 
     */
    create<T extends bookshopeditionsCreateArgs>(args: SelectSubset<T, bookshopeditionsCreateArgs<ExtArgs>>): Prisma__bookshopeditionsClient<$Result.GetResult<Prisma.$bookshopeditionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bookshopeditions.
     * @param {bookshopeditionsCreateManyArgs} args - Arguments to create many Bookshopeditions.
     * @example
     * // Create many Bookshopeditions
     * const bookshopeditions = await prisma.bookshopeditions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends bookshopeditionsCreateManyArgs>(args?: SelectSubset<T, bookshopeditionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Bookshopeditions.
     * @param {bookshopeditionsDeleteArgs} args - Arguments to delete one Bookshopeditions.
     * @example
     * // Delete one Bookshopeditions
     * const Bookshopeditions = await prisma.bookshopeditions.delete({
     *   where: {
     *     // ... filter to delete one Bookshopeditions
     *   }
     * })
     * 
     */
    delete<T extends bookshopeditionsDeleteArgs>(args: SelectSubset<T, bookshopeditionsDeleteArgs<ExtArgs>>): Prisma__bookshopeditionsClient<$Result.GetResult<Prisma.$bookshopeditionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Bookshopeditions.
     * @param {bookshopeditionsUpdateArgs} args - Arguments to update one Bookshopeditions.
     * @example
     * // Update one Bookshopeditions
     * const bookshopeditions = await prisma.bookshopeditions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends bookshopeditionsUpdateArgs>(args: SelectSubset<T, bookshopeditionsUpdateArgs<ExtArgs>>): Prisma__bookshopeditionsClient<$Result.GetResult<Prisma.$bookshopeditionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bookshopeditions.
     * @param {bookshopeditionsDeleteManyArgs} args - Arguments to filter Bookshopeditions to delete.
     * @example
     * // Delete a few Bookshopeditions
     * const { count } = await prisma.bookshopeditions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends bookshopeditionsDeleteManyArgs>(args?: SelectSubset<T, bookshopeditionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookshopeditions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookshopeditionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bookshopeditions
     * const bookshopeditions = await prisma.bookshopeditions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends bookshopeditionsUpdateManyArgs>(args: SelectSubset<T, bookshopeditionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Bookshopeditions.
     * @param {bookshopeditionsUpsertArgs} args - Arguments to update or create a Bookshopeditions.
     * @example
     * // Update or create a Bookshopeditions
     * const bookshopeditions = await prisma.bookshopeditions.upsert({
     *   create: {
     *     // ... data to create a Bookshopeditions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Bookshopeditions we want to update
     *   }
     * })
     */
    upsert<T extends bookshopeditionsUpsertArgs>(args: SelectSubset<T, bookshopeditionsUpsertArgs<ExtArgs>>): Prisma__bookshopeditionsClient<$Result.GetResult<Prisma.$bookshopeditionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bookshopeditions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookshopeditionsCountArgs} args - Arguments to filter Bookshopeditions to count.
     * @example
     * // Count the number of Bookshopeditions
     * const count = await prisma.bookshopeditions.count({
     *   where: {
     *     // ... the filter for the Bookshopeditions we want to count
     *   }
     * })
    **/
    count<T extends bookshopeditionsCountArgs>(
      args?: Subset<T, bookshopeditionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookshopeditionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Bookshopeditions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookshopeditionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookshopeditionsAggregateArgs>(args: Subset<T, BookshopeditionsAggregateArgs>): Prisma.PrismaPromise<GetBookshopeditionsAggregateType<T>>

    /**
     * Group by Bookshopeditions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookshopeditionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends bookshopeditionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: bookshopeditionsGroupByArgs['orderBy'] }
        : { orderBy?: bookshopeditionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, bookshopeditionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookshopeditionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the bookshopeditions model
   */
  readonly fields: bookshopeditionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for bookshopeditions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__bookshopeditionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bookedition<T extends bookeditionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, bookeditionDefaultArgs<ExtArgs>>): Prisma__bookeditionClient<$Result.GetResult<Prisma.$bookeditionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    bookshopes<T extends bookshopesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, bookshopesDefaultArgs<ExtArgs>>): Prisma__bookshopesClient<$Result.GetResult<Prisma.$bookshopesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the bookshopeditions model
   */
  interface bookshopeditionsFieldRefs {
    readonly id: FieldRef<"bookshopeditions", 'Int'>
    readonly bookShopId: FieldRef<"bookshopeditions", 'Int'>
    readonly bookEditionId: FieldRef<"bookshopeditions", 'Int'>
    readonly quantity: FieldRef<"bookshopeditions", 'Int'>
    readonly price_per_peice: FieldRef<"bookshopeditions", 'Float'>
    readonly total_price: FieldRef<"bookshopeditions", 'Float'>
    readonly memo: FieldRef<"bookshopeditions", 'String'>
    readonly already_paid: FieldRef<"bookshopeditions", 'Float'>
    readonly remaining_amount: FieldRef<"bookshopeditions", 'Float'>
    readonly is_deleted: FieldRef<"bookshopeditions", 'Boolean'>
    readonly updatedAt: FieldRef<"bookshopeditions", 'DateTime'>
    readonly createdAt: FieldRef<"bookshopeditions", 'DateTime'>
    readonly deletedAt: FieldRef<"bookshopeditions", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * bookshopeditions findUnique
   */
  export type bookshopeditionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopeditions
     */
    select?: bookshopeditionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopeditions
     */
    omit?: bookshopeditionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopeditionsInclude<ExtArgs> | null
    /**
     * Filter, which bookshopeditions to fetch.
     */
    where: bookshopeditionsWhereUniqueInput
  }

  /**
   * bookshopeditions findUniqueOrThrow
   */
  export type bookshopeditionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopeditions
     */
    select?: bookshopeditionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopeditions
     */
    omit?: bookshopeditionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopeditionsInclude<ExtArgs> | null
    /**
     * Filter, which bookshopeditions to fetch.
     */
    where: bookshopeditionsWhereUniqueInput
  }

  /**
   * bookshopeditions findFirst
   */
  export type bookshopeditionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopeditions
     */
    select?: bookshopeditionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopeditions
     */
    omit?: bookshopeditionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopeditionsInclude<ExtArgs> | null
    /**
     * Filter, which bookshopeditions to fetch.
     */
    where?: bookshopeditionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bookshopeditions to fetch.
     */
    orderBy?: bookshopeditionsOrderByWithRelationInput | bookshopeditionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for bookshopeditions.
     */
    cursor?: bookshopeditionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bookshopeditions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bookshopeditions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of bookshopeditions.
     */
    distinct?: BookshopeditionsScalarFieldEnum | BookshopeditionsScalarFieldEnum[]
  }

  /**
   * bookshopeditions findFirstOrThrow
   */
  export type bookshopeditionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopeditions
     */
    select?: bookshopeditionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopeditions
     */
    omit?: bookshopeditionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopeditionsInclude<ExtArgs> | null
    /**
     * Filter, which bookshopeditions to fetch.
     */
    where?: bookshopeditionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bookshopeditions to fetch.
     */
    orderBy?: bookshopeditionsOrderByWithRelationInput | bookshopeditionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for bookshopeditions.
     */
    cursor?: bookshopeditionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bookshopeditions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bookshopeditions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of bookshopeditions.
     */
    distinct?: BookshopeditionsScalarFieldEnum | BookshopeditionsScalarFieldEnum[]
  }

  /**
   * bookshopeditions findMany
   */
  export type bookshopeditionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopeditions
     */
    select?: bookshopeditionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopeditions
     */
    omit?: bookshopeditionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopeditionsInclude<ExtArgs> | null
    /**
     * Filter, which bookshopeditions to fetch.
     */
    where?: bookshopeditionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bookshopeditions to fetch.
     */
    orderBy?: bookshopeditionsOrderByWithRelationInput | bookshopeditionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing bookshopeditions.
     */
    cursor?: bookshopeditionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bookshopeditions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bookshopeditions.
     */
    skip?: number
    distinct?: BookshopeditionsScalarFieldEnum | BookshopeditionsScalarFieldEnum[]
  }

  /**
   * bookshopeditions create
   */
  export type bookshopeditionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopeditions
     */
    select?: bookshopeditionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopeditions
     */
    omit?: bookshopeditionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopeditionsInclude<ExtArgs> | null
    /**
     * The data needed to create a bookshopeditions.
     */
    data: XOR<bookshopeditionsCreateInput, bookshopeditionsUncheckedCreateInput>
  }

  /**
   * bookshopeditions createMany
   */
  export type bookshopeditionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many bookshopeditions.
     */
    data: bookshopeditionsCreateManyInput | bookshopeditionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * bookshopeditions update
   */
  export type bookshopeditionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopeditions
     */
    select?: bookshopeditionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopeditions
     */
    omit?: bookshopeditionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopeditionsInclude<ExtArgs> | null
    /**
     * The data needed to update a bookshopeditions.
     */
    data: XOR<bookshopeditionsUpdateInput, bookshopeditionsUncheckedUpdateInput>
    /**
     * Choose, which bookshopeditions to update.
     */
    where: bookshopeditionsWhereUniqueInput
  }

  /**
   * bookshopeditions updateMany
   */
  export type bookshopeditionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update bookshopeditions.
     */
    data: XOR<bookshopeditionsUpdateManyMutationInput, bookshopeditionsUncheckedUpdateManyInput>
    /**
     * Filter which bookshopeditions to update
     */
    where?: bookshopeditionsWhereInput
    /**
     * Limit how many bookshopeditions to update.
     */
    limit?: number
  }

  /**
   * bookshopeditions upsert
   */
  export type bookshopeditionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopeditions
     */
    select?: bookshopeditionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopeditions
     */
    omit?: bookshopeditionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopeditionsInclude<ExtArgs> | null
    /**
     * The filter to search for the bookshopeditions to update in case it exists.
     */
    where: bookshopeditionsWhereUniqueInput
    /**
     * In case the bookshopeditions found by the `where` argument doesn't exist, create a new bookshopeditions with this data.
     */
    create: XOR<bookshopeditionsCreateInput, bookshopeditionsUncheckedCreateInput>
    /**
     * In case the bookshopeditions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<bookshopeditionsUpdateInput, bookshopeditionsUncheckedUpdateInput>
  }

  /**
   * bookshopeditions delete
   */
  export type bookshopeditionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopeditions
     */
    select?: bookshopeditionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopeditions
     */
    omit?: bookshopeditionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopeditionsInclude<ExtArgs> | null
    /**
     * Filter which bookshopeditions to delete.
     */
    where: bookshopeditionsWhereUniqueInput
  }

  /**
   * bookshopeditions deleteMany
   */
  export type bookshopeditionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which bookshopeditions to delete
     */
    where?: bookshopeditionsWhereInput
    /**
     * Limit how many bookshopeditions to delete.
     */
    limit?: number
  }

  /**
   * bookshopeditions without action
   */
  export type bookshopeditionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopeditions
     */
    select?: bookshopeditionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopeditions
     */
    omit?: bookshopeditionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopeditionsInclude<ExtArgs> | null
  }


  /**
   * Model bookshopes
   */

  export type AggregateBookshopes = {
    _count: BookshopesCountAggregateOutputType | null
    _avg: BookshopesAvgAggregateOutputType | null
    _sum: BookshopesSumAggregateOutputType | null
    _min: BookshopesMinAggregateOutputType | null
    _max: BookshopesMaxAggregateOutputType | null
  }

  export type BookshopesAvgAggregateOutputType = {
    id: number | null
  }

  export type BookshopesSumAggregateOutputType = {
    id: number | null
  }

  export type BookshopesMinAggregateOutputType = {
    id: number | null
    name: string | null
    location: string | null
    branch: string | null
    phone: string | null
    email: string | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type BookshopesMaxAggregateOutputType = {
    id: number | null
    name: string | null
    location: string | null
    branch: string | null
    phone: string | null
    email: string | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type BookshopesCountAggregateOutputType = {
    id: number
    name: number
    location: number
    branch: number
    phone: number
    email: number
    is_deleted: number
    updatedAt: number
    createdAt: number
    deletedAt: number
    _all: number
  }


  export type BookshopesAvgAggregateInputType = {
    id?: true
  }

  export type BookshopesSumAggregateInputType = {
    id?: true
  }

  export type BookshopesMinAggregateInputType = {
    id?: true
    name?: true
    location?: true
    branch?: true
    phone?: true
    email?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
  }

  export type BookshopesMaxAggregateInputType = {
    id?: true
    name?: true
    location?: true
    branch?: true
    phone?: true
    email?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
  }

  export type BookshopesCountAggregateInputType = {
    id?: true
    name?: true
    location?: true
    branch?: true
    phone?: true
    email?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    _all?: true
  }

  export type BookshopesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which bookshopes to aggregate.
     */
    where?: bookshopesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bookshopes to fetch.
     */
    orderBy?: bookshopesOrderByWithRelationInput | bookshopesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: bookshopesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bookshopes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bookshopes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned bookshopes
    **/
    _count?: true | BookshopesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookshopesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookshopesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookshopesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookshopesMaxAggregateInputType
  }

  export type GetBookshopesAggregateType<T extends BookshopesAggregateArgs> = {
        [P in keyof T & keyof AggregateBookshopes]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookshopes[P]>
      : GetScalarType<T[P], AggregateBookshopes[P]>
  }




  export type bookshopesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: bookshopesWhereInput
    orderBy?: bookshopesOrderByWithAggregationInput | bookshopesOrderByWithAggregationInput[]
    by: BookshopesScalarFieldEnum[] | BookshopesScalarFieldEnum
    having?: bookshopesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookshopesCountAggregateInputType | true
    _avg?: BookshopesAvgAggregateInputType
    _sum?: BookshopesSumAggregateInputType
    _min?: BookshopesMinAggregateInputType
    _max?: BookshopesMaxAggregateInputType
  }

  export type BookshopesGroupByOutputType = {
    id: number
    name: string
    location: string
    branch: string | null
    phone: string | null
    email: string | null
    is_deleted: boolean
    updatedAt: Date
    createdAt: Date
    deletedAt: Date
    _count: BookshopesCountAggregateOutputType | null
    _avg: BookshopesAvgAggregateOutputType | null
    _sum: BookshopesSumAggregateOutputType | null
    _min: BookshopesMinAggregateOutputType | null
    _max: BookshopesMaxAggregateOutputType | null
  }

  type GetBookshopesGroupByPayload<T extends bookshopesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookshopesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookshopesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookshopesGroupByOutputType[P]>
            : GetScalarType<T[P], BookshopesGroupByOutputType[P]>
        }
      >
    >


  export type bookshopesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    location?: boolean
    branch?: boolean
    phone?: boolean
    email?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    bookshopeditions?: boolean | bookshopes$bookshopeditionsArgs<ExtArgs>
    _count?: boolean | BookshopesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookshopes"]>



  export type bookshopesSelectScalar = {
    id?: boolean
    name?: boolean
    location?: boolean
    branch?: boolean
    phone?: boolean
    email?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
  }

  export type bookshopesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "location" | "branch" | "phone" | "email" | "is_deleted" | "updatedAt" | "createdAt" | "deletedAt", ExtArgs["result"]["bookshopes"]>
  export type bookshopesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookshopeditions?: boolean | bookshopes$bookshopeditionsArgs<ExtArgs>
    _count?: boolean | BookshopesCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $bookshopesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "bookshopes"
    objects: {
      bookshopeditions: Prisma.$bookshopeditionsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      location: string
      branch: string | null
      phone: string | null
      email: string | null
      is_deleted: boolean
      updatedAt: Date
      createdAt: Date
      deletedAt: Date
    }, ExtArgs["result"]["bookshopes"]>
    composites: {}
  }

  type bookshopesGetPayload<S extends boolean | null | undefined | bookshopesDefaultArgs> = $Result.GetResult<Prisma.$bookshopesPayload, S>

  type bookshopesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<bookshopesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookshopesCountAggregateInputType | true
    }

  export interface bookshopesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['bookshopes'], meta: { name: 'bookshopes' } }
    /**
     * Find zero or one Bookshopes that matches the filter.
     * @param {bookshopesFindUniqueArgs} args - Arguments to find a Bookshopes
     * @example
     * // Get one Bookshopes
     * const bookshopes = await prisma.bookshopes.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends bookshopesFindUniqueArgs>(args: SelectSubset<T, bookshopesFindUniqueArgs<ExtArgs>>): Prisma__bookshopesClient<$Result.GetResult<Prisma.$bookshopesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Bookshopes that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {bookshopesFindUniqueOrThrowArgs} args - Arguments to find a Bookshopes
     * @example
     * // Get one Bookshopes
     * const bookshopes = await prisma.bookshopes.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends bookshopesFindUniqueOrThrowArgs>(args: SelectSubset<T, bookshopesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__bookshopesClient<$Result.GetResult<Prisma.$bookshopesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bookshopes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookshopesFindFirstArgs} args - Arguments to find a Bookshopes
     * @example
     * // Get one Bookshopes
     * const bookshopes = await prisma.bookshopes.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends bookshopesFindFirstArgs>(args?: SelectSubset<T, bookshopesFindFirstArgs<ExtArgs>>): Prisma__bookshopesClient<$Result.GetResult<Prisma.$bookshopesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bookshopes that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookshopesFindFirstOrThrowArgs} args - Arguments to find a Bookshopes
     * @example
     * // Get one Bookshopes
     * const bookshopes = await prisma.bookshopes.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends bookshopesFindFirstOrThrowArgs>(args?: SelectSubset<T, bookshopesFindFirstOrThrowArgs<ExtArgs>>): Prisma__bookshopesClient<$Result.GetResult<Prisma.$bookshopesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bookshopes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookshopesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bookshopes
     * const bookshopes = await prisma.bookshopes.findMany()
     * 
     * // Get first 10 Bookshopes
     * const bookshopes = await prisma.bookshopes.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookshopesWithIdOnly = await prisma.bookshopes.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends bookshopesFindManyArgs>(args?: SelectSubset<T, bookshopesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$bookshopesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Bookshopes.
     * @param {bookshopesCreateArgs} args - Arguments to create a Bookshopes.
     * @example
     * // Create one Bookshopes
     * const Bookshopes = await prisma.bookshopes.create({
     *   data: {
     *     // ... data to create a Bookshopes
     *   }
     * })
     * 
     */
    create<T extends bookshopesCreateArgs>(args: SelectSubset<T, bookshopesCreateArgs<ExtArgs>>): Prisma__bookshopesClient<$Result.GetResult<Prisma.$bookshopesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bookshopes.
     * @param {bookshopesCreateManyArgs} args - Arguments to create many Bookshopes.
     * @example
     * // Create many Bookshopes
     * const bookshopes = await prisma.bookshopes.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends bookshopesCreateManyArgs>(args?: SelectSubset<T, bookshopesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Bookshopes.
     * @param {bookshopesDeleteArgs} args - Arguments to delete one Bookshopes.
     * @example
     * // Delete one Bookshopes
     * const Bookshopes = await prisma.bookshopes.delete({
     *   where: {
     *     // ... filter to delete one Bookshopes
     *   }
     * })
     * 
     */
    delete<T extends bookshopesDeleteArgs>(args: SelectSubset<T, bookshopesDeleteArgs<ExtArgs>>): Prisma__bookshopesClient<$Result.GetResult<Prisma.$bookshopesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Bookshopes.
     * @param {bookshopesUpdateArgs} args - Arguments to update one Bookshopes.
     * @example
     * // Update one Bookshopes
     * const bookshopes = await prisma.bookshopes.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends bookshopesUpdateArgs>(args: SelectSubset<T, bookshopesUpdateArgs<ExtArgs>>): Prisma__bookshopesClient<$Result.GetResult<Prisma.$bookshopesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bookshopes.
     * @param {bookshopesDeleteManyArgs} args - Arguments to filter Bookshopes to delete.
     * @example
     * // Delete a few Bookshopes
     * const { count } = await prisma.bookshopes.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends bookshopesDeleteManyArgs>(args?: SelectSubset<T, bookshopesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookshopes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookshopesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bookshopes
     * const bookshopes = await prisma.bookshopes.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends bookshopesUpdateManyArgs>(args: SelectSubset<T, bookshopesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Bookshopes.
     * @param {bookshopesUpsertArgs} args - Arguments to update or create a Bookshopes.
     * @example
     * // Update or create a Bookshopes
     * const bookshopes = await prisma.bookshopes.upsert({
     *   create: {
     *     // ... data to create a Bookshopes
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Bookshopes we want to update
     *   }
     * })
     */
    upsert<T extends bookshopesUpsertArgs>(args: SelectSubset<T, bookshopesUpsertArgs<ExtArgs>>): Prisma__bookshopesClient<$Result.GetResult<Prisma.$bookshopesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bookshopes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookshopesCountArgs} args - Arguments to filter Bookshopes to count.
     * @example
     * // Count the number of Bookshopes
     * const count = await prisma.bookshopes.count({
     *   where: {
     *     // ... the filter for the Bookshopes we want to count
     *   }
     * })
    **/
    count<T extends bookshopesCountArgs>(
      args?: Subset<T, bookshopesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookshopesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Bookshopes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookshopesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookshopesAggregateArgs>(args: Subset<T, BookshopesAggregateArgs>): Prisma.PrismaPromise<GetBookshopesAggregateType<T>>

    /**
     * Group by Bookshopes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {bookshopesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends bookshopesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: bookshopesGroupByArgs['orderBy'] }
        : { orderBy?: bookshopesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, bookshopesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookshopesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the bookshopes model
   */
  readonly fields: bookshopesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for bookshopes.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__bookshopesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bookshopeditions<T extends bookshopes$bookshopeditionsArgs<ExtArgs> = {}>(args?: Subset<T, bookshopes$bookshopeditionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$bookshopeditionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the bookshopes model
   */
  interface bookshopesFieldRefs {
    readonly id: FieldRef<"bookshopes", 'Int'>
    readonly name: FieldRef<"bookshopes", 'String'>
    readonly location: FieldRef<"bookshopes", 'String'>
    readonly branch: FieldRef<"bookshopes", 'String'>
    readonly phone: FieldRef<"bookshopes", 'String'>
    readonly email: FieldRef<"bookshopes", 'String'>
    readonly is_deleted: FieldRef<"bookshopes", 'Boolean'>
    readonly updatedAt: FieldRef<"bookshopes", 'DateTime'>
    readonly createdAt: FieldRef<"bookshopes", 'DateTime'>
    readonly deletedAt: FieldRef<"bookshopes", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * bookshopes findUnique
   */
  export type bookshopesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopes
     */
    select?: bookshopesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopes
     */
    omit?: bookshopesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopesInclude<ExtArgs> | null
    /**
     * Filter, which bookshopes to fetch.
     */
    where: bookshopesWhereUniqueInput
  }

  /**
   * bookshopes findUniqueOrThrow
   */
  export type bookshopesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopes
     */
    select?: bookshopesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopes
     */
    omit?: bookshopesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopesInclude<ExtArgs> | null
    /**
     * Filter, which bookshopes to fetch.
     */
    where: bookshopesWhereUniqueInput
  }

  /**
   * bookshopes findFirst
   */
  export type bookshopesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopes
     */
    select?: bookshopesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopes
     */
    omit?: bookshopesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopesInclude<ExtArgs> | null
    /**
     * Filter, which bookshopes to fetch.
     */
    where?: bookshopesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bookshopes to fetch.
     */
    orderBy?: bookshopesOrderByWithRelationInput | bookshopesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for bookshopes.
     */
    cursor?: bookshopesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bookshopes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bookshopes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of bookshopes.
     */
    distinct?: BookshopesScalarFieldEnum | BookshopesScalarFieldEnum[]
  }

  /**
   * bookshopes findFirstOrThrow
   */
  export type bookshopesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopes
     */
    select?: bookshopesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopes
     */
    omit?: bookshopesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopesInclude<ExtArgs> | null
    /**
     * Filter, which bookshopes to fetch.
     */
    where?: bookshopesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bookshopes to fetch.
     */
    orderBy?: bookshopesOrderByWithRelationInput | bookshopesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for bookshopes.
     */
    cursor?: bookshopesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bookshopes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bookshopes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of bookshopes.
     */
    distinct?: BookshopesScalarFieldEnum | BookshopesScalarFieldEnum[]
  }

  /**
   * bookshopes findMany
   */
  export type bookshopesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopes
     */
    select?: bookshopesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopes
     */
    omit?: bookshopesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopesInclude<ExtArgs> | null
    /**
     * Filter, which bookshopes to fetch.
     */
    where?: bookshopesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of bookshopes to fetch.
     */
    orderBy?: bookshopesOrderByWithRelationInput | bookshopesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing bookshopes.
     */
    cursor?: bookshopesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` bookshopes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` bookshopes.
     */
    skip?: number
    distinct?: BookshopesScalarFieldEnum | BookshopesScalarFieldEnum[]
  }

  /**
   * bookshopes create
   */
  export type bookshopesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopes
     */
    select?: bookshopesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopes
     */
    omit?: bookshopesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopesInclude<ExtArgs> | null
    /**
     * The data needed to create a bookshopes.
     */
    data: XOR<bookshopesCreateInput, bookshopesUncheckedCreateInput>
  }

  /**
   * bookshopes createMany
   */
  export type bookshopesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many bookshopes.
     */
    data: bookshopesCreateManyInput | bookshopesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * bookshopes update
   */
  export type bookshopesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopes
     */
    select?: bookshopesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopes
     */
    omit?: bookshopesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopesInclude<ExtArgs> | null
    /**
     * The data needed to update a bookshopes.
     */
    data: XOR<bookshopesUpdateInput, bookshopesUncheckedUpdateInput>
    /**
     * Choose, which bookshopes to update.
     */
    where: bookshopesWhereUniqueInput
  }

  /**
   * bookshopes updateMany
   */
  export type bookshopesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update bookshopes.
     */
    data: XOR<bookshopesUpdateManyMutationInput, bookshopesUncheckedUpdateManyInput>
    /**
     * Filter which bookshopes to update
     */
    where?: bookshopesWhereInput
    /**
     * Limit how many bookshopes to update.
     */
    limit?: number
  }

  /**
   * bookshopes upsert
   */
  export type bookshopesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopes
     */
    select?: bookshopesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopes
     */
    omit?: bookshopesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopesInclude<ExtArgs> | null
    /**
     * The filter to search for the bookshopes to update in case it exists.
     */
    where: bookshopesWhereUniqueInput
    /**
     * In case the bookshopes found by the `where` argument doesn't exist, create a new bookshopes with this data.
     */
    create: XOR<bookshopesCreateInput, bookshopesUncheckedCreateInput>
    /**
     * In case the bookshopes was found with the provided `where` argument, update it with this data.
     */
    update: XOR<bookshopesUpdateInput, bookshopesUncheckedUpdateInput>
  }

  /**
   * bookshopes delete
   */
  export type bookshopesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopes
     */
    select?: bookshopesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopes
     */
    omit?: bookshopesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopesInclude<ExtArgs> | null
    /**
     * Filter which bookshopes to delete.
     */
    where: bookshopesWhereUniqueInput
  }

  /**
   * bookshopes deleteMany
   */
  export type bookshopesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which bookshopes to delete
     */
    where?: bookshopesWhereInput
    /**
     * Limit how many bookshopes to delete.
     */
    limit?: number
  }

  /**
   * bookshopes.bookshopeditions
   */
  export type bookshopes$bookshopeditionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopeditions
     */
    select?: bookshopeditionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopeditions
     */
    omit?: bookshopeditionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopeditionsInclude<ExtArgs> | null
    where?: bookshopeditionsWhereInput
    orderBy?: bookshopeditionsOrderByWithRelationInput | bookshopeditionsOrderByWithRelationInput[]
    cursor?: bookshopeditionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookshopeditionsScalarFieldEnum | BookshopeditionsScalarFieldEnum[]
  }

  /**
   * bookshopes without action
   */
  export type bookshopesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookshopes
     */
    select?: bookshopesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookshopes
     */
    omit?: bookshopesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookshopesInclude<ExtArgs> | null
  }


  /**
   * Model damagedbooks
   */

  export type AggregateDamagedbooks = {
    _count: DamagedbooksCountAggregateOutputType | null
    _avg: DamagedbooksAvgAggregateOutputType | null
    _sum: DamagedbooksSumAggregateOutputType | null
    _min: DamagedbooksMinAggregateOutputType | null
    _max: DamagedbooksMaxAggregateOutputType | null
  }

  export type DamagedbooksAvgAggregateOutputType = {
    id: number | null
    book_id: number | null
    store_id: number | null
    edition_id: number | null
    count: number | null
    account_id: number | null
  }

  export type DamagedbooksSumAggregateOutputType = {
    id: number | null
    book_id: number | null
    store_id: number | null
    edition_id: number | null
    count: number | null
    account_id: number | null
  }

  export type DamagedbooksMinAggregateOutputType = {
    id: number | null
    type: $Enums.damagedbooks_type | null
    book_id: number | null
    store_id: number | null
    edition_id: number | null
    count: number | null
    memo: string | null
    account_id: number | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type DamagedbooksMaxAggregateOutputType = {
    id: number | null
    type: $Enums.damagedbooks_type | null
    book_id: number | null
    store_id: number | null
    edition_id: number | null
    count: number | null
    memo: string | null
    account_id: number | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type DamagedbooksCountAggregateOutputType = {
    id: number
    type: number
    book_id: number
    store_id: number
    edition_id: number
    count: number
    memo: number
    account_id: number
    is_deleted: number
    updatedAt: number
    createdAt: number
    deletedAt: number
    _all: number
  }


  export type DamagedbooksAvgAggregateInputType = {
    id?: true
    book_id?: true
    store_id?: true
    edition_id?: true
    count?: true
    account_id?: true
  }

  export type DamagedbooksSumAggregateInputType = {
    id?: true
    book_id?: true
    store_id?: true
    edition_id?: true
    count?: true
    account_id?: true
  }

  export type DamagedbooksMinAggregateInputType = {
    id?: true
    type?: true
    book_id?: true
    store_id?: true
    edition_id?: true
    count?: true
    memo?: true
    account_id?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
  }

  export type DamagedbooksMaxAggregateInputType = {
    id?: true
    type?: true
    book_id?: true
    store_id?: true
    edition_id?: true
    count?: true
    memo?: true
    account_id?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
  }

  export type DamagedbooksCountAggregateInputType = {
    id?: true
    type?: true
    book_id?: true
    store_id?: true
    edition_id?: true
    count?: true
    memo?: true
    account_id?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    _all?: true
  }

  export type DamagedbooksAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which damagedbooks to aggregate.
     */
    where?: damagedbooksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of damagedbooks to fetch.
     */
    orderBy?: damagedbooksOrderByWithRelationInput | damagedbooksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: damagedbooksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` damagedbooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` damagedbooks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned damagedbooks
    **/
    _count?: true | DamagedbooksCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DamagedbooksAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DamagedbooksSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DamagedbooksMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DamagedbooksMaxAggregateInputType
  }

  export type GetDamagedbooksAggregateType<T extends DamagedbooksAggregateArgs> = {
        [P in keyof T & keyof AggregateDamagedbooks]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDamagedbooks[P]>
      : GetScalarType<T[P], AggregateDamagedbooks[P]>
  }




  export type damagedbooksGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: damagedbooksWhereInput
    orderBy?: damagedbooksOrderByWithAggregationInput | damagedbooksOrderByWithAggregationInput[]
    by: DamagedbooksScalarFieldEnum[] | DamagedbooksScalarFieldEnum
    having?: damagedbooksScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DamagedbooksCountAggregateInputType | true
    _avg?: DamagedbooksAvgAggregateInputType
    _sum?: DamagedbooksSumAggregateInputType
    _min?: DamagedbooksMinAggregateInputType
    _max?: DamagedbooksMaxAggregateInputType
  }

  export type DamagedbooksGroupByOutputType = {
    id: number
    type: $Enums.damagedbooks_type | null
    book_id: number | null
    store_id: number | null
    edition_id: number | null
    count: number | null
    memo: string | null
    account_id: number | null
    is_deleted: boolean
    updatedAt: Date
    createdAt: Date
    deletedAt: Date
    _count: DamagedbooksCountAggregateOutputType | null
    _avg: DamagedbooksAvgAggregateOutputType | null
    _sum: DamagedbooksSumAggregateOutputType | null
    _min: DamagedbooksMinAggregateOutputType | null
    _max: DamagedbooksMaxAggregateOutputType | null
  }

  type GetDamagedbooksGroupByPayload<T extends damagedbooksGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DamagedbooksGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DamagedbooksGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DamagedbooksGroupByOutputType[P]>
            : GetScalarType<T[P], DamagedbooksGroupByOutputType[P]>
        }
      >
    >


  export type damagedbooksSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    book_id?: boolean
    store_id?: boolean
    edition_id?: boolean
    count?: boolean
    memo?: boolean
    account_id?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    accounts?: boolean | damagedbooks$accountsArgs<ExtArgs>
    books?: boolean | damagedbooks$booksArgs<ExtArgs>
    bookedition?: boolean | damagedbooks$bookeditionArgs<ExtArgs>
    stores?: boolean | damagedbooks$storesArgs<ExtArgs>
  }, ExtArgs["result"]["damagedbooks"]>



  export type damagedbooksSelectScalar = {
    id?: boolean
    type?: boolean
    book_id?: boolean
    store_id?: boolean
    edition_id?: boolean
    count?: boolean
    memo?: boolean
    account_id?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
  }

  export type damagedbooksOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "book_id" | "store_id" | "edition_id" | "count" | "memo" | "account_id" | "is_deleted" | "updatedAt" | "createdAt" | "deletedAt", ExtArgs["result"]["damagedbooks"]>
  export type damagedbooksInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | damagedbooks$accountsArgs<ExtArgs>
    books?: boolean | damagedbooks$booksArgs<ExtArgs>
    bookedition?: boolean | damagedbooks$bookeditionArgs<ExtArgs>
    stores?: boolean | damagedbooks$storesArgs<ExtArgs>
  }

  export type $damagedbooksPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "damagedbooks"
    objects: {
      accounts: Prisma.$accountsPayload<ExtArgs> | null
      books: Prisma.$booksPayload<ExtArgs> | null
      bookedition: Prisma.$bookeditionPayload<ExtArgs> | null
      stores: Prisma.$storesPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      type: $Enums.damagedbooks_type | null
      book_id: number | null
      store_id: number | null
      edition_id: number | null
      count: number | null
      memo: string | null
      account_id: number | null
      is_deleted: boolean
      updatedAt: Date
      createdAt: Date
      deletedAt: Date
    }, ExtArgs["result"]["damagedbooks"]>
    composites: {}
  }

  type damagedbooksGetPayload<S extends boolean | null | undefined | damagedbooksDefaultArgs> = $Result.GetResult<Prisma.$damagedbooksPayload, S>

  type damagedbooksCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<damagedbooksFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DamagedbooksCountAggregateInputType | true
    }

  export interface damagedbooksDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['damagedbooks'], meta: { name: 'damagedbooks' } }
    /**
     * Find zero or one Damagedbooks that matches the filter.
     * @param {damagedbooksFindUniqueArgs} args - Arguments to find a Damagedbooks
     * @example
     * // Get one Damagedbooks
     * const damagedbooks = await prisma.damagedbooks.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends damagedbooksFindUniqueArgs>(args: SelectSubset<T, damagedbooksFindUniqueArgs<ExtArgs>>): Prisma__damagedbooksClient<$Result.GetResult<Prisma.$damagedbooksPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Damagedbooks that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {damagedbooksFindUniqueOrThrowArgs} args - Arguments to find a Damagedbooks
     * @example
     * // Get one Damagedbooks
     * const damagedbooks = await prisma.damagedbooks.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends damagedbooksFindUniqueOrThrowArgs>(args: SelectSubset<T, damagedbooksFindUniqueOrThrowArgs<ExtArgs>>): Prisma__damagedbooksClient<$Result.GetResult<Prisma.$damagedbooksPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Damagedbooks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {damagedbooksFindFirstArgs} args - Arguments to find a Damagedbooks
     * @example
     * // Get one Damagedbooks
     * const damagedbooks = await prisma.damagedbooks.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends damagedbooksFindFirstArgs>(args?: SelectSubset<T, damagedbooksFindFirstArgs<ExtArgs>>): Prisma__damagedbooksClient<$Result.GetResult<Prisma.$damagedbooksPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Damagedbooks that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {damagedbooksFindFirstOrThrowArgs} args - Arguments to find a Damagedbooks
     * @example
     * // Get one Damagedbooks
     * const damagedbooks = await prisma.damagedbooks.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends damagedbooksFindFirstOrThrowArgs>(args?: SelectSubset<T, damagedbooksFindFirstOrThrowArgs<ExtArgs>>): Prisma__damagedbooksClient<$Result.GetResult<Prisma.$damagedbooksPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Damagedbooks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {damagedbooksFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Damagedbooks
     * const damagedbooks = await prisma.damagedbooks.findMany()
     * 
     * // Get first 10 Damagedbooks
     * const damagedbooks = await prisma.damagedbooks.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const damagedbooksWithIdOnly = await prisma.damagedbooks.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends damagedbooksFindManyArgs>(args?: SelectSubset<T, damagedbooksFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$damagedbooksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Damagedbooks.
     * @param {damagedbooksCreateArgs} args - Arguments to create a Damagedbooks.
     * @example
     * // Create one Damagedbooks
     * const Damagedbooks = await prisma.damagedbooks.create({
     *   data: {
     *     // ... data to create a Damagedbooks
     *   }
     * })
     * 
     */
    create<T extends damagedbooksCreateArgs>(args: SelectSubset<T, damagedbooksCreateArgs<ExtArgs>>): Prisma__damagedbooksClient<$Result.GetResult<Prisma.$damagedbooksPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Damagedbooks.
     * @param {damagedbooksCreateManyArgs} args - Arguments to create many Damagedbooks.
     * @example
     * // Create many Damagedbooks
     * const damagedbooks = await prisma.damagedbooks.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends damagedbooksCreateManyArgs>(args?: SelectSubset<T, damagedbooksCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Damagedbooks.
     * @param {damagedbooksDeleteArgs} args - Arguments to delete one Damagedbooks.
     * @example
     * // Delete one Damagedbooks
     * const Damagedbooks = await prisma.damagedbooks.delete({
     *   where: {
     *     // ... filter to delete one Damagedbooks
     *   }
     * })
     * 
     */
    delete<T extends damagedbooksDeleteArgs>(args: SelectSubset<T, damagedbooksDeleteArgs<ExtArgs>>): Prisma__damagedbooksClient<$Result.GetResult<Prisma.$damagedbooksPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Damagedbooks.
     * @param {damagedbooksUpdateArgs} args - Arguments to update one Damagedbooks.
     * @example
     * // Update one Damagedbooks
     * const damagedbooks = await prisma.damagedbooks.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends damagedbooksUpdateArgs>(args: SelectSubset<T, damagedbooksUpdateArgs<ExtArgs>>): Prisma__damagedbooksClient<$Result.GetResult<Prisma.$damagedbooksPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Damagedbooks.
     * @param {damagedbooksDeleteManyArgs} args - Arguments to filter Damagedbooks to delete.
     * @example
     * // Delete a few Damagedbooks
     * const { count } = await prisma.damagedbooks.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends damagedbooksDeleteManyArgs>(args?: SelectSubset<T, damagedbooksDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Damagedbooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {damagedbooksUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Damagedbooks
     * const damagedbooks = await prisma.damagedbooks.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends damagedbooksUpdateManyArgs>(args: SelectSubset<T, damagedbooksUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Damagedbooks.
     * @param {damagedbooksUpsertArgs} args - Arguments to update or create a Damagedbooks.
     * @example
     * // Update or create a Damagedbooks
     * const damagedbooks = await prisma.damagedbooks.upsert({
     *   create: {
     *     // ... data to create a Damagedbooks
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Damagedbooks we want to update
     *   }
     * })
     */
    upsert<T extends damagedbooksUpsertArgs>(args: SelectSubset<T, damagedbooksUpsertArgs<ExtArgs>>): Prisma__damagedbooksClient<$Result.GetResult<Prisma.$damagedbooksPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Damagedbooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {damagedbooksCountArgs} args - Arguments to filter Damagedbooks to count.
     * @example
     * // Count the number of Damagedbooks
     * const count = await prisma.damagedbooks.count({
     *   where: {
     *     // ... the filter for the Damagedbooks we want to count
     *   }
     * })
    **/
    count<T extends damagedbooksCountArgs>(
      args?: Subset<T, damagedbooksCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DamagedbooksCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Damagedbooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DamagedbooksAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DamagedbooksAggregateArgs>(args: Subset<T, DamagedbooksAggregateArgs>): Prisma.PrismaPromise<GetDamagedbooksAggregateType<T>>

    /**
     * Group by Damagedbooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {damagedbooksGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends damagedbooksGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: damagedbooksGroupByArgs['orderBy'] }
        : { orderBy?: damagedbooksGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, damagedbooksGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDamagedbooksGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the damagedbooks model
   */
  readonly fields: damagedbooksFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for damagedbooks.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__damagedbooksClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends damagedbooks$accountsArgs<ExtArgs> = {}>(args?: Subset<T, damagedbooks$accountsArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    books<T extends damagedbooks$booksArgs<ExtArgs> = {}>(args?: Subset<T, damagedbooks$booksArgs<ExtArgs>>): Prisma__booksClient<$Result.GetResult<Prisma.$booksPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    bookedition<T extends damagedbooks$bookeditionArgs<ExtArgs> = {}>(args?: Subset<T, damagedbooks$bookeditionArgs<ExtArgs>>): Prisma__bookeditionClient<$Result.GetResult<Prisma.$bookeditionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    stores<T extends damagedbooks$storesArgs<ExtArgs> = {}>(args?: Subset<T, damagedbooks$storesArgs<ExtArgs>>): Prisma__storesClient<$Result.GetResult<Prisma.$storesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the damagedbooks model
   */
  interface damagedbooksFieldRefs {
    readonly id: FieldRef<"damagedbooks", 'Int'>
    readonly type: FieldRef<"damagedbooks", 'damagedbooks_type'>
    readonly book_id: FieldRef<"damagedbooks", 'Int'>
    readonly store_id: FieldRef<"damagedbooks", 'Int'>
    readonly edition_id: FieldRef<"damagedbooks", 'Int'>
    readonly count: FieldRef<"damagedbooks", 'Int'>
    readonly memo: FieldRef<"damagedbooks", 'String'>
    readonly account_id: FieldRef<"damagedbooks", 'Int'>
    readonly is_deleted: FieldRef<"damagedbooks", 'Boolean'>
    readonly updatedAt: FieldRef<"damagedbooks", 'DateTime'>
    readonly createdAt: FieldRef<"damagedbooks", 'DateTime'>
    readonly deletedAt: FieldRef<"damagedbooks", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * damagedbooks findUnique
   */
  export type damagedbooksFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the damagedbooks
     */
    select?: damagedbooksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the damagedbooks
     */
    omit?: damagedbooksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: damagedbooksInclude<ExtArgs> | null
    /**
     * Filter, which damagedbooks to fetch.
     */
    where: damagedbooksWhereUniqueInput
  }

  /**
   * damagedbooks findUniqueOrThrow
   */
  export type damagedbooksFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the damagedbooks
     */
    select?: damagedbooksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the damagedbooks
     */
    omit?: damagedbooksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: damagedbooksInclude<ExtArgs> | null
    /**
     * Filter, which damagedbooks to fetch.
     */
    where: damagedbooksWhereUniqueInput
  }

  /**
   * damagedbooks findFirst
   */
  export type damagedbooksFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the damagedbooks
     */
    select?: damagedbooksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the damagedbooks
     */
    omit?: damagedbooksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: damagedbooksInclude<ExtArgs> | null
    /**
     * Filter, which damagedbooks to fetch.
     */
    where?: damagedbooksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of damagedbooks to fetch.
     */
    orderBy?: damagedbooksOrderByWithRelationInput | damagedbooksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for damagedbooks.
     */
    cursor?: damagedbooksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` damagedbooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` damagedbooks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of damagedbooks.
     */
    distinct?: DamagedbooksScalarFieldEnum | DamagedbooksScalarFieldEnum[]
  }

  /**
   * damagedbooks findFirstOrThrow
   */
  export type damagedbooksFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the damagedbooks
     */
    select?: damagedbooksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the damagedbooks
     */
    omit?: damagedbooksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: damagedbooksInclude<ExtArgs> | null
    /**
     * Filter, which damagedbooks to fetch.
     */
    where?: damagedbooksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of damagedbooks to fetch.
     */
    orderBy?: damagedbooksOrderByWithRelationInput | damagedbooksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for damagedbooks.
     */
    cursor?: damagedbooksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` damagedbooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` damagedbooks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of damagedbooks.
     */
    distinct?: DamagedbooksScalarFieldEnum | DamagedbooksScalarFieldEnum[]
  }

  /**
   * damagedbooks findMany
   */
  export type damagedbooksFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the damagedbooks
     */
    select?: damagedbooksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the damagedbooks
     */
    omit?: damagedbooksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: damagedbooksInclude<ExtArgs> | null
    /**
     * Filter, which damagedbooks to fetch.
     */
    where?: damagedbooksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of damagedbooks to fetch.
     */
    orderBy?: damagedbooksOrderByWithRelationInput | damagedbooksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing damagedbooks.
     */
    cursor?: damagedbooksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` damagedbooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` damagedbooks.
     */
    skip?: number
    distinct?: DamagedbooksScalarFieldEnum | DamagedbooksScalarFieldEnum[]
  }

  /**
   * damagedbooks create
   */
  export type damagedbooksCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the damagedbooks
     */
    select?: damagedbooksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the damagedbooks
     */
    omit?: damagedbooksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: damagedbooksInclude<ExtArgs> | null
    /**
     * The data needed to create a damagedbooks.
     */
    data: XOR<damagedbooksCreateInput, damagedbooksUncheckedCreateInput>
  }

  /**
   * damagedbooks createMany
   */
  export type damagedbooksCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many damagedbooks.
     */
    data: damagedbooksCreateManyInput | damagedbooksCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * damagedbooks update
   */
  export type damagedbooksUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the damagedbooks
     */
    select?: damagedbooksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the damagedbooks
     */
    omit?: damagedbooksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: damagedbooksInclude<ExtArgs> | null
    /**
     * The data needed to update a damagedbooks.
     */
    data: XOR<damagedbooksUpdateInput, damagedbooksUncheckedUpdateInput>
    /**
     * Choose, which damagedbooks to update.
     */
    where: damagedbooksWhereUniqueInput
  }

  /**
   * damagedbooks updateMany
   */
  export type damagedbooksUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update damagedbooks.
     */
    data: XOR<damagedbooksUpdateManyMutationInput, damagedbooksUncheckedUpdateManyInput>
    /**
     * Filter which damagedbooks to update
     */
    where?: damagedbooksWhereInput
    /**
     * Limit how many damagedbooks to update.
     */
    limit?: number
  }

  /**
   * damagedbooks upsert
   */
  export type damagedbooksUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the damagedbooks
     */
    select?: damagedbooksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the damagedbooks
     */
    omit?: damagedbooksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: damagedbooksInclude<ExtArgs> | null
    /**
     * The filter to search for the damagedbooks to update in case it exists.
     */
    where: damagedbooksWhereUniqueInput
    /**
     * In case the damagedbooks found by the `where` argument doesn't exist, create a new damagedbooks with this data.
     */
    create: XOR<damagedbooksCreateInput, damagedbooksUncheckedCreateInput>
    /**
     * In case the damagedbooks was found with the provided `where` argument, update it with this data.
     */
    update: XOR<damagedbooksUpdateInput, damagedbooksUncheckedUpdateInput>
  }

  /**
   * damagedbooks delete
   */
  export type damagedbooksDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the damagedbooks
     */
    select?: damagedbooksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the damagedbooks
     */
    omit?: damagedbooksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: damagedbooksInclude<ExtArgs> | null
    /**
     * Filter which damagedbooks to delete.
     */
    where: damagedbooksWhereUniqueInput
  }

  /**
   * damagedbooks deleteMany
   */
  export type damagedbooksDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which damagedbooks to delete
     */
    where?: damagedbooksWhereInput
    /**
     * Limit how many damagedbooks to delete.
     */
    limit?: number
  }

  /**
   * damagedbooks.accounts
   */
  export type damagedbooks$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the accounts
     */
    select?: accountsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the accounts
     */
    omit?: accountsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: accountsInclude<ExtArgs> | null
    where?: accountsWhereInput
  }

  /**
   * damagedbooks.books
   */
  export type damagedbooks$booksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the books
     */
    select?: booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the books
     */
    omit?: booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: booksInclude<ExtArgs> | null
    where?: booksWhereInput
  }

  /**
   * damagedbooks.bookedition
   */
  export type damagedbooks$bookeditionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookedition
     */
    select?: bookeditionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookedition
     */
    omit?: bookeditionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionInclude<ExtArgs> | null
    where?: bookeditionWhereInput
  }

  /**
   * damagedbooks.stores
   */
  export type damagedbooks$storesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the stores
     */
    select?: storesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the stores
     */
    omit?: storesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: storesInclude<ExtArgs> | null
    where?: storesWhereInput
  }

  /**
   * damagedbooks without action
   */
  export type damagedbooksDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the damagedbooks
     */
    select?: damagedbooksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the damagedbooks
     */
    omit?: damagedbooksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: damagedbooksInclude<ExtArgs> | null
  }


  /**
   * Model dashboardmenu
   */

  export type AggregateDashboardmenu = {
    _count: DashboardmenuCountAggregateOutputType | null
    _avg: DashboardmenuAvgAggregateOutputType | null
    _sum: DashboardmenuSumAggregateOutputType | null
    _min: DashboardmenuMinAggregateOutputType | null
    _max: DashboardmenuMaxAggregateOutputType | null
  }

  export type DashboardmenuAvgAggregateOutputType = {
    id: number | null
  }

  export type DashboardmenuSumAggregateOutputType = {
    id: number | null
  }

  export type DashboardmenuMinAggregateOutputType = {
    id: number | null
    role: string | null
    menus: string | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type DashboardmenuMaxAggregateOutputType = {
    id: number | null
    role: string | null
    menus: string | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type DashboardmenuCountAggregateOutputType = {
    id: number
    role: number
    menus: number
    updatedAt: number
    createdAt: number
    _all: number
  }


  export type DashboardmenuAvgAggregateInputType = {
    id?: true
  }

  export type DashboardmenuSumAggregateInputType = {
    id?: true
  }

  export type DashboardmenuMinAggregateInputType = {
    id?: true
    role?: true
    menus?: true
    updatedAt?: true
    createdAt?: true
  }

  export type DashboardmenuMaxAggregateInputType = {
    id?: true
    role?: true
    menus?: true
    updatedAt?: true
    createdAt?: true
  }

  export type DashboardmenuCountAggregateInputType = {
    id?: true
    role?: true
    menus?: true
    updatedAt?: true
    createdAt?: true
    _all?: true
  }

  export type DashboardmenuAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which dashboardmenu to aggregate.
     */
    where?: dashboardmenuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dashboardmenus to fetch.
     */
    orderBy?: dashboardmenuOrderByWithRelationInput | dashboardmenuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: dashboardmenuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dashboardmenus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dashboardmenus.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned dashboardmenus
    **/
    _count?: true | DashboardmenuCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DashboardmenuAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DashboardmenuSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DashboardmenuMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DashboardmenuMaxAggregateInputType
  }

  export type GetDashboardmenuAggregateType<T extends DashboardmenuAggregateArgs> = {
        [P in keyof T & keyof AggregateDashboardmenu]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDashboardmenu[P]>
      : GetScalarType<T[P], AggregateDashboardmenu[P]>
  }




  export type dashboardmenuGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: dashboardmenuWhereInput
    orderBy?: dashboardmenuOrderByWithAggregationInput | dashboardmenuOrderByWithAggregationInput[]
    by: DashboardmenuScalarFieldEnum[] | DashboardmenuScalarFieldEnum
    having?: dashboardmenuScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DashboardmenuCountAggregateInputType | true
    _avg?: DashboardmenuAvgAggregateInputType
    _sum?: DashboardmenuSumAggregateInputType
    _min?: DashboardmenuMinAggregateInputType
    _max?: DashboardmenuMaxAggregateInputType
  }

  export type DashboardmenuGroupByOutputType = {
    id: number
    role: string
    menus: string
    updatedAt: Date
    createdAt: Date
    _count: DashboardmenuCountAggregateOutputType | null
    _avg: DashboardmenuAvgAggregateOutputType | null
    _sum: DashboardmenuSumAggregateOutputType | null
    _min: DashboardmenuMinAggregateOutputType | null
    _max: DashboardmenuMaxAggregateOutputType | null
  }

  type GetDashboardmenuGroupByPayload<T extends dashboardmenuGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DashboardmenuGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DashboardmenuGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DashboardmenuGroupByOutputType[P]>
            : GetScalarType<T[P], DashboardmenuGroupByOutputType[P]>
        }
      >
    >


  export type dashboardmenuSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    menus?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["dashboardmenu"]>



  export type dashboardmenuSelectScalar = {
    id?: boolean
    role?: boolean
    menus?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }

  export type dashboardmenuOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "role" | "menus" | "updatedAt" | "createdAt", ExtArgs["result"]["dashboardmenu"]>

  export type $dashboardmenuPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "dashboardmenu"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      role: string
      menus: string
      updatedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["dashboardmenu"]>
    composites: {}
  }

  type dashboardmenuGetPayload<S extends boolean | null | undefined | dashboardmenuDefaultArgs> = $Result.GetResult<Prisma.$dashboardmenuPayload, S>

  type dashboardmenuCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<dashboardmenuFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DashboardmenuCountAggregateInputType | true
    }

  export interface dashboardmenuDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['dashboardmenu'], meta: { name: 'dashboardmenu' } }
    /**
     * Find zero or one Dashboardmenu that matches the filter.
     * @param {dashboardmenuFindUniqueArgs} args - Arguments to find a Dashboardmenu
     * @example
     * // Get one Dashboardmenu
     * const dashboardmenu = await prisma.dashboardmenu.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends dashboardmenuFindUniqueArgs>(args: SelectSubset<T, dashboardmenuFindUniqueArgs<ExtArgs>>): Prisma__dashboardmenuClient<$Result.GetResult<Prisma.$dashboardmenuPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Dashboardmenu that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {dashboardmenuFindUniqueOrThrowArgs} args - Arguments to find a Dashboardmenu
     * @example
     * // Get one Dashboardmenu
     * const dashboardmenu = await prisma.dashboardmenu.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends dashboardmenuFindUniqueOrThrowArgs>(args: SelectSubset<T, dashboardmenuFindUniqueOrThrowArgs<ExtArgs>>): Prisma__dashboardmenuClient<$Result.GetResult<Prisma.$dashboardmenuPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Dashboardmenu that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dashboardmenuFindFirstArgs} args - Arguments to find a Dashboardmenu
     * @example
     * // Get one Dashboardmenu
     * const dashboardmenu = await prisma.dashboardmenu.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends dashboardmenuFindFirstArgs>(args?: SelectSubset<T, dashboardmenuFindFirstArgs<ExtArgs>>): Prisma__dashboardmenuClient<$Result.GetResult<Prisma.$dashboardmenuPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Dashboardmenu that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dashboardmenuFindFirstOrThrowArgs} args - Arguments to find a Dashboardmenu
     * @example
     * // Get one Dashboardmenu
     * const dashboardmenu = await prisma.dashboardmenu.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends dashboardmenuFindFirstOrThrowArgs>(args?: SelectSubset<T, dashboardmenuFindFirstOrThrowArgs<ExtArgs>>): Prisma__dashboardmenuClient<$Result.GetResult<Prisma.$dashboardmenuPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Dashboardmenus that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dashboardmenuFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Dashboardmenus
     * const dashboardmenus = await prisma.dashboardmenu.findMany()
     * 
     * // Get first 10 Dashboardmenus
     * const dashboardmenus = await prisma.dashboardmenu.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dashboardmenuWithIdOnly = await prisma.dashboardmenu.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends dashboardmenuFindManyArgs>(args?: SelectSubset<T, dashboardmenuFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$dashboardmenuPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Dashboardmenu.
     * @param {dashboardmenuCreateArgs} args - Arguments to create a Dashboardmenu.
     * @example
     * // Create one Dashboardmenu
     * const Dashboardmenu = await prisma.dashboardmenu.create({
     *   data: {
     *     // ... data to create a Dashboardmenu
     *   }
     * })
     * 
     */
    create<T extends dashboardmenuCreateArgs>(args: SelectSubset<T, dashboardmenuCreateArgs<ExtArgs>>): Prisma__dashboardmenuClient<$Result.GetResult<Prisma.$dashboardmenuPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Dashboardmenus.
     * @param {dashboardmenuCreateManyArgs} args - Arguments to create many Dashboardmenus.
     * @example
     * // Create many Dashboardmenus
     * const dashboardmenu = await prisma.dashboardmenu.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends dashboardmenuCreateManyArgs>(args?: SelectSubset<T, dashboardmenuCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Dashboardmenu.
     * @param {dashboardmenuDeleteArgs} args - Arguments to delete one Dashboardmenu.
     * @example
     * // Delete one Dashboardmenu
     * const Dashboardmenu = await prisma.dashboardmenu.delete({
     *   where: {
     *     // ... filter to delete one Dashboardmenu
     *   }
     * })
     * 
     */
    delete<T extends dashboardmenuDeleteArgs>(args: SelectSubset<T, dashboardmenuDeleteArgs<ExtArgs>>): Prisma__dashboardmenuClient<$Result.GetResult<Prisma.$dashboardmenuPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Dashboardmenu.
     * @param {dashboardmenuUpdateArgs} args - Arguments to update one Dashboardmenu.
     * @example
     * // Update one Dashboardmenu
     * const dashboardmenu = await prisma.dashboardmenu.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends dashboardmenuUpdateArgs>(args: SelectSubset<T, dashboardmenuUpdateArgs<ExtArgs>>): Prisma__dashboardmenuClient<$Result.GetResult<Prisma.$dashboardmenuPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Dashboardmenus.
     * @param {dashboardmenuDeleteManyArgs} args - Arguments to filter Dashboardmenus to delete.
     * @example
     * // Delete a few Dashboardmenus
     * const { count } = await prisma.dashboardmenu.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends dashboardmenuDeleteManyArgs>(args?: SelectSubset<T, dashboardmenuDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Dashboardmenus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dashboardmenuUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Dashboardmenus
     * const dashboardmenu = await prisma.dashboardmenu.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends dashboardmenuUpdateManyArgs>(args: SelectSubset<T, dashboardmenuUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Dashboardmenu.
     * @param {dashboardmenuUpsertArgs} args - Arguments to update or create a Dashboardmenu.
     * @example
     * // Update or create a Dashboardmenu
     * const dashboardmenu = await prisma.dashboardmenu.upsert({
     *   create: {
     *     // ... data to create a Dashboardmenu
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Dashboardmenu we want to update
     *   }
     * })
     */
    upsert<T extends dashboardmenuUpsertArgs>(args: SelectSubset<T, dashboardmenuUpsertArgs<ExtArgs>>): Prisma__dashboardmenuClient<$Result.GetResult<Prisma.$dashboardmenuPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Dashboardmenus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dashboardmenuCountArgs} args - Arguments to filter Dashboardmenus to count.
     * @example
     * // Count the number of Dashboardmenus
     * const count = await prisma.dashboardmenu.count({
     *   where: {
     *     // ... the filter for the Dashboardmenus we want to count
     *   }
     * })
    **/
    count<T extends dashboardmenuCountArgs>(
      args?: Subset<T, dashboardmenuCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DashboardmenuCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Dashboardmenu.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DashboardmenuAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DashboardmenuAggregateArgs>(args: Subset<T, DashboardmenuAggregateArgs>): Prisma.PrismaPromise<GetDashboardmenuAggregateType<T>>

    /**
     * Group by Dashboardmenu.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {dashboardmenuGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends dashboardmenuGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: dashboardmenuGroupByArgs['orderBy'] }
        : { orderBy?: dashboardmenuGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, dashboardmenuGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDashboardmenuGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the dashboardmenu model
   */
  readonly fields: dashboardmenuFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for dashboardmenu.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__dashboardmenuClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the dashboardmenu model
   */
  interface dashboardmenuFieldRefs {
    readonly id: FieldRef<"dashboardmenu", 'Int'>
    readonly role: FieldRef<"dashboardmenu", 'String'>
    readonly menus: FieldRef<"dashboardmenu", 'String'>
    readonly updatedAt: FieldRef<"dashboardmenu", 'DateTime'>
    readonly createdAt: FieldRef<"dashboardmenu", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * dashboardmenu findUnique
   */
  export type dashboardmenuFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboardmenu
     */
    select?: dashboardmenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboardmenu
     */
    omit?: dashboardmenuOmit<ExtArgs> | null
    /**
     * Filter, which dashboardmenu to fetch.
     */
    where: dashboardmenuWhereUniqueInput
  }

  /**
   * dashboardmenu findUniqueOrThrow
   */
  export type dashboardmenuFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboardmenu
     */
    select?: dashboardmenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboardmenu
     */
    omit?: dashboardmenuOmit<ExtArgs> | null
    /**
     * Filter, which dashboardmenu to fetch.
     */
    where: dashboardmenuWhereUniqueInput
  }

  /**
   * dashboardmenu findFirst
   */
  export type dashboardmenuFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboardmenu
     */
    select?: dashboardmenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboardmenu
     */
    omit?: dashboardmenuOmit<ExtArgs> | null
    /**
     * Filter, which dashboardmenu to fetch.
     */
    where?: dashboardmenuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dashboardmenus to fetch.
     */
    orderBy?: dashboardmenuOrderByWithRelationInput | dashboardmenuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for dashboardmenus.
     */
    cursor?: dashboardmenuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dashboardmenus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dashboardmenus.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of dashboardmenus.
     */
    distinct?: DashboardmenuScalarFieldEnum | DashboardmenuScalarFieldEnum[]
  }

  /**
   * dashboardmenu findFirstOrThrow
   */
  export type dashboardmenuFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboardmenu
     */
    select?: dashboardmenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboardmenu
     */
    omit?: dashboardmenuOmit<ExtArgs> | null
    /**
     * Filter, which dashboardmenu to fetch.
     */
    where?: dashboardmenuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dashboardmenus to fetch.
     */
    orderBy?: dashboardmenuOrderByWithRelationInput | dashboardmenuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for dashboardmenus.
     */
    cursor?: dashboardmenuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dashboardmenus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dashboardmenus.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of dashboardmenus.
     */
    distinct?: DashboardmenuScalarFieldEnum | DashboardmenuScalarFieldEnum[]
  }

  /**
   * dashboardmenu findMany
   */
  export type dashboardmenuFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboardmenu
     */
    select?: dashboardmenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboardmenu
     */
    omit?: dashboardmenuOmit<ExtArgs> | null
    /**
     * Filter, which dashboardmenus to fetch.
     */
    where?: dashboardmenuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of dashboardmenus to fetch.
     */
    orderBy?: dashboardmenuOrderByWithRelationInput | dashboardmenuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing dashboardmenus.
     */
    cursor?: dashboardmenuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` dashboardmenus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` dashboardmenus.
     */
    skip?: number
    distinct?: DashboardmenuScalarFieldEnum | DashboardmenuScalarFieldEnum[]
  }

  /**
   * dashboardmenu create
   */
  export type dashboardmenuCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboardmenu
     */
    select?: dashboardmenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboardmenu
     */
    omit?: dashboardmenuOmit<ExtArgs> | null
    /**
     * The data needed to create a dashboardmenu.
     */
    data: XOR<dashboardmenuCreateInput, dashboardmenuUncheckedCreateInput>
  }

  /**
   * dashboardmenu createMany
   */
  export type dashboardmenuCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many dashboardmenus.
     */
    data: dashboardmenuCreateManyInput | dashboardmenuCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * dashboardmenu update
   */
  export type dashboardmenuUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboardmenu
     */
    select?: dashboardmenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboardmenu
     */
    omit?: dashboardmenuOmit<ExtArgs> | null
    /**
     * The data needed to update a dashboardmenu.
     */
    data: XOR<dashboardmenuUpdateInput, dashboardmenuUncheckedUpdateInput>
    /**
     * Choose, which dashboardmenu to update.
     */
    where: dashboardmenuWhereUniqueInput
  }

  /**
   * dashboardmenu updateMany
   */
  export type dashboardmenuUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update dashboardmenus.
     */
    data: XOR<dashboardmenuUpdateManyMutationInput, dashboardmenuUncheckedUpdateManyInput>
    /**
     * Filter which dashboardmenus to update
     */
    where?: dashboardmenuWhereInput
    /**
     * Limit how many dashboardmenus to update.
     */
    limit?: number
  }

  /**
   * dashboardmenu upsert
   */
  export type dashboardmenuUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboardmenu
     */
    select?: dashboardmenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboardmenu
     */
    omit?: dashboardmenuOmit<ExtArgs> | null
    /**
     * The filter to search for the dashboardmenu to update in case it exists.
     */
    where: dashboardmenuWhereUniqueInput
    /**
     * In case the dashboardmenu found by the `where` argument doesn't exist, create a new dashboardmenu with this data.
     */
    create: XOR<dashboardmenuCreateInput, dashboardmenuUncheckedCreateInput>
    /**
     * In case the dashboardmenu was found with the provided `where` argument, update it with this data.
     */
    update: XOR<dashboardmenuUpdateInput, dashboardmenuUncheckedUpdateInput>
  }

  /**
   * dashboardmenu delete
   */
  export type dashboardmenuDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboardmenu
     */
    select?: dashboardmenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboardmenu
     */
    omit?: dashboardmenuOmit<ExtArgs> | null
    /**
     * Filter which dashboardmenu to delete.
     */
    where: dashboardmenuWhereUniqueInput
  }

  /**
   * dashboardmenu deleteMany
   */
  export type dashboardmenuDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which dashboardmenus to delete
     */
    where?: dashboardmenuWhereInput
    /**
     * Limit how many dashboardmenus to delete.
     */
    limit?: number
  }

  /**
   * dashboardmenu without action
   */
  export type dashboardmenuDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the dashboardmenu
     */
    select?: dashboardmenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the dashboardmenu
     */
    omit?: dashboardmenuOmit<ExtArgs> | null
  }


  /**
   * Model printer
   */

  export type AggregatePrinter = {
    _count: PrinterCountAggregateOutputType | null
    _avg: PrinterAvgAggregateOutputType | null
    _sum: PrinterSumAggregateOutputType | null
    _min: PrinterMinAggregateOutputType | null
    _max: PrinterMaxAggregateOutputType | null
  }

  export type PrinterAvgAggregateOutputType = {
    id: number | null
  }

  export type PrinterSumAggregateOutputType = {
    id: number | null
  }

  export type PrinterMinAggregateOutputType = {
    id: number | null
    name: string | null
    location: string | null
    phone: string | null
    email: string | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type PrinterMaxAggregateOutputType = {
    id: number | null
    name: string | null
    location: string | null
    phone: string | null
    email: string | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type PrinterCountAggregateOutputType = {
    id: number
    name: number
    location: number
    phone: number
    email: number
    is_deleted: number
    updatedAt: number
    createdAt: number
    deletedAt: number
    _all: number
  }


  export type PrinterAvgAggregateInputType = {
    id?: true
  }

  export type PrinterSumAggregateInputType = {
    id?: true
  }

  export type PrinterMinAggregateInputType = {
    id?: true
    name?: true
    location?: true
    phone?: true
    email?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
  }

  export type PrinterMaxAggregateInputType = {
    id?: true
    name?: true
    location?: true
    phone?: true
    email?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
  }

  export type PrinterCountAggregateInputType = {
    id?: true
    name?: true
    location?: true
    phone?: true
    email?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    _all?: true
  }

  export type PrinterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which printer to aggregate.
     */
    where?: printerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of printers to fetch.
     */
    orderBy?: printerOrderByWithRelationInput | printerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: printerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` printers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` printers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned printers
    **/
    _count?: true | PrinterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PrinterAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PrinterSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PrinterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PrinterMaxAggregateInputType
  }

  export type GetPrinterAggregateType<T extends PrinterAggregateArgs> = {
        [P in keyof T & keyof AggregatePrinter]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePrinter[P]>
      : GetScalarType<T[P], AggregatePrinter[P]>
  }




  export type printerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: printerWhereInput
    orderBy?: printerOrderByWithAggregationInput | printerOrderByWithAggregationInput[]
    by: PrinterScalarFieldEnum[] | PrinterScalarFieldEnum
    having?: printerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PrinterCountAggregateInputType | true
    _avg?: PrinterAvgAggregateInputType
    _sum?: PrinterSumAggregateInputType
    _min?: PrinterMinAggregateInputType
    _max?: PrinterMaxAggregateInputType
  }

  export type PrinterGroupByOutputType = {
    id: number
    name: string
    location: string
    phone: string | null
    email: string | null
    is_deleted: boolean
    updatedAt: Date
    createdAt: Date
    deletedAt: Date
    _count: PrinterCountAggregateOutputType | null
    _avg: PrinterAvgAggregateOutputType | null
    _sum: PrinterSumAggregateOutputType | null
    _min: PrinterMinAggregateOutputType | null
    _max: PrinterMaxAggregateOutputType | null
  }

  type GetPrinterGroupByPayload<T extends printerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PrinterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PrinterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PrinterGroupByOutputType[P]>
            : GetScalarType<T[P], PrinterGroupByOutputType[P]>
        }
      >
    >


  export type printerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    location?: boolean
    phone?: boolean
    email?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    printorder?: boolean | printer$printorderArgs<ExtArgs>
    _count?: boolean | PrinterCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["printer"]>



  export type printerSelectScalar = {
    id?: boolean
    name?: boolean
    location?: boolean
    phone?: boolean
    email?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
  }

  export type printerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "location" | "phone" | "email" | "is_deleted" | "updatedAt" | "createdAt" | "deletedAt", ExtArgs["result"]["printer"]>
  export type printerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    printorder?: boolean | printer$printorderArgs<ExtArgs>
    _count?: boolean | PrinterCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $printerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "printer"
    objects: {
      printorder: Prisma.$printorderPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      location: string
      phone: string | null
      email: string | null
      is_deleted: boolean
      updatedAt: Date
      createdAt: Date
      deletedAt: Date
    }, ExtArgs["result"]["printer"]>
    composites: {}
  }

  type printerGetPayload<S extends boolean | null | undefined | printerDefaultArgs> = $Result.GetResult<Prisma.$printerPayload, S>

  type printerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<printerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PrinterCountAggregateInputType | true
    }

  export interface printerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['printer'], meta: { name: 'printer' } }
    /**
     * Find zero or one Printer that matches the filter.
     * @param {printerFindUniqueArgs} args - Arguments to find a Printer
     * @example
     * // Get one Printer
     * const printer = await prisma.printer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends printerFindUniqueArgs>(args: SelectSubset<T, printerFindUniqueArgs<ExtArgs>>): Prisma__printerClient<$Result.GetResult<Prisma.$printerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Printer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {printerFindUniqueOrThrowArgs} args - Arguments to find a Printer
     * @example
     * // Get one Printer
     * const printer = await prisma.printer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends printerFindUniqueOrThrowArgs>(args: SelectSubset<T, printerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__printerClient<$Result.GetResult<Prisma.$printerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Printer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {printerFindFirstArgs} args - Arguments to find a Printer
     * @example
     * // Get one Printer
     * const printer = await prisma.printer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends printerFindFirstArgs>(args?: SelectSubset<T, printerFindFirstArgs<ExtArgs>>): Prisma__printerClient<$Result.GetResult<Prisma.$printerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Printer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {printerFindFirstOrThrowArgs} args - Arguments to find a Printer
     * @example
     * // Get one Printer
     * const printer = await prisma.printer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends printerFindFirstOrThrowArgs>(args?: SelectSubset<T, printerFindFirstOrThrowArgs<ExtArgs>>): Prisma__printerClient<$Result.GetResult<Prisma.$printerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Printers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {printerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Printers
     * const printers = await prisma.printer.findMany()
     * 
     * // Get first 10 Printers
     * const printers = await prisma.printer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const printerWithIdOnly = await prisma.printer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends printerFindManyArgs>(args?: SelectSubset<T, printerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$printerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Printer.
     * @param {printerCreateArgs} args - Arguments to create a Printer.
     * @example
     * // Create one Printer
     * const Printer = await prisma.printer.create({
     *   data: {
     *     // ... data to create a Printer
     *   }
     * })
     * 
     */
    create<T extends printerCreateArgs>(args: SelectSubset<T, printerCreateArgs<ExtArgs>>): Prisma__printerClient<$Result.GetResult<Prisma.$printerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Printers.
     * @param {printerCreateManyArgs} args - Arguments to create many Printers.
     * @example
     * // Create many Printers
     * const printer = await prisma.printer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends printerCreateManyArgs>(args?: SelectSubset<T, printerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Printer.
     * @param {printerDeleteArgs} args - Arguments to delete one Printer.
     * @example
     * // Delete one Printer
     * const Printer = await prisma.printer.delete({
     *   where: {
     *     // ... filter to delete one Printer
     *   }
     * })
     * 
     */
    delete<T extends printerDeleteArgs>(args: SelectSubset<T, printerDeleteArgs<ExtArgs>>): Prisma__printerClient<$Result.GetResult<Prisma.$printerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Printer.
     * @param {printerUpdateArgs} args - Arguments to update one Printer.
     * @example
     * // Update one Printer
     * const printer = await prisma.printer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends printerUpdateArgs>(args: SelectSubset<T, printerUpdateArgs<ExtArgs>>): Prisma__printerClient<$Result.GetResult<Prisma.$printerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Printers.
     * @param {printerDeleteManyArgs} args - Arguments to filter Printers to delete.
     * @example
     * // Delete a few Printers
     * const { count } = await prisma.printer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends printerDeleteManyArgs>(args?: SelectSubset<T, printerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Printers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {printerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Printers
     * const printer = await prisma.printer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends printerUpdateManyArgs>(args: SelectSubset<T, printerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Printer.
     * @param {printerUpsertArgs} args - Arguments to update or create a Printer.
     * @example
     * // Update or create a Printer
     * const printer = await prisma.printer.upsert({
     *   create: {
     *     // ... data to create a Printer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Printer we want to update
     *   }
     * })
     */
    upsert<T extends printerUpsertArgs>(args: SelectSubset<T, printerUpsertArgs<ExtArgs>>): Prisma__printerClient<$Result.GetResult<Prisma.$printerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Printers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {printerCountArgs} args - Arguments to filter Printers to count.
     * @example
     * // Count the number of Printers
     * const count = await prisma.printer.count({
     *   where: {
     *     // ... the filter for the Printers we want to count
     *   }
     * })
    **/
    count<T extends printerCountArgs>(
      args?: Subset<T, printerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PrinterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Printer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrinterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PrinterAggregateArgs>(args: Subset<T, PrinterAggregateArgs>): Prisma.PrismaPromise<GetPrinterAggregateType<T>>

    /**
     * Group by Printer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {printerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends printerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: printerGroupByArgs['orderBy'] }
        : { orderBy?: printerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, printerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPrinterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the printer model
   */
  readonly fields: printerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for printer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__printerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    printorder<T extends printer$printorderArgs<ExtArgs> = {}>(args?: Subset<T, printer$printorderArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$printorderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the printer model
   */
  interface printerFieldRefs {
    readonly id: FieldRef<"printer", 'Int'>
    readonly name: FieldRef<"printer", 'String'>
    readonly location: FieldRef<"printer", 'String'>
    readonly phone: FieldRef<"printer", 'String'>
    readonly email: FieldRef<"printer", 'String'>
    readonly is_deleted: FieldRef<"printer", 'Boolean'>
    readonly updatedAt: FieldRef<"printer", 'DateTime'>
    readonly createdAt: FieldRef<"printer", 'DateTime'>
    readonly deletedAt: FieldRef<"printer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * printer findUnique
   */
  export type printerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printer
     */
    select?: printerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printer
     */
    omit?: printerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printerInclude<ExtArgs> | null
    /**
     * Filter, which printer to fetch.
     */
    where: printerWhereUniqueInput
  }

  /**
   * printer findUniqueOrThrow
   */
  export type printerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printer
     */
    select?: printerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printer
     */
    omit?: printerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printerInclude<ExtArgs> | null
    /**
     * Filter, which printer to fetch.
     */
    where: printerWhereUniqueInput
  }

  /**
   * printer findFirst
   */
  export type printerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printer
     */
    select?: printerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printer
     */
    omit?: printerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printerInclude<ExtArgs> | null
    /**
     * Filter, which printer to fetch.
     */
    where?: printerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of printers to fetch.
     */
    orderBy?: printerOrderByWithRelationInput | printerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for printers.
     */
    cursor?: printerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` printers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` printers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of printers.
     */
    distinct?: PrinterScalarFieldEnum | PrinterScalarFieldEnum[]
  }

  /**
   * printer findFirstOrThrow
   */
  export type printerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printer
     */
    select?: printerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printer
     */
    omit?: printerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printerInclude<ExtArgs> | null
    /**
     * Filter, which printer to fetch.
     */
    where?: printerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of printers to fetch.
     */
    orderBy?: printerOrderByWithRelationInput | printerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for printers.
     */
    cursor?: printerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` printers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` printers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of printers.
     */
    distinct?: PrinterScalarFieldEnum | PrinterScalarFieldEnum[]
  }

  /**
   * printer findMany
   */
  export type printerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printer
     */
    select?: printerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printer
     */
    omit?: printerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printerInclude<ExtArgs> | null
    /**
     * Filter, which printers to fetch.
     */
    where?: printerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of printers to fetch.
     */
    orderBy?: printerOrderByWithRelationInput | printerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing printers.
     */
    cursor?: printerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` printers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` printers.
     */
    skip?: number
    distinct?: PrinterScalarFieldEnum | PrinterScalarFieldEnum[]
  }

  /**
   * printer create
   */
  export type printerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printer
     */
    select?: printerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printer
     */
    omit?: printerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printerInclude<ExtArgs> | null
    /**
     * The data needed to create a printer.
     */
    data: XOR<printerCreateInput, printerUncheckedCreateInput>
  }

  /**
   * printer createMany
   */
  export type printerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many printers.
     */
    data: printerCreateManyInput | printerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * printer update
   */
  export type printerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printer
     */
    select?: printerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printer
     */
    omit?: printerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printerInclude<ExtArgs> | null
    /**
     * The data needed to update a printer.
     */
    data: XOR<printerUpdateInput, printerUncheckedUpdateInput>
    /**
     * Choose, which printer to update.
     */
    where: printerWhereUniqueInput
  }

  /**
   * printer updateMany
   */
  export type printerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update printers.
     */
    data: XOR<printerUpdateManyMutationInput, printerUncheckedUpdateManyInput>
    /**
     * Filter which printers to update
     */
    where?: printerWhereInput
    /**
     * Limit how many printers to update.
     */
    limit?: number
  }

  /**
   * printer upsert
   */
  export type printerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printer
     */
    select?: printerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printer
     */
    omit?: printerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printerInclude<ExtArgs> | null
    /**
     * The filter to search for the printer to update in case it exists.
     */
    where: printerWhereUniqueInput
    /**
     * In case the printer found by the `where` argument doesn't exist, create a new printer with this data.
     */
    create: XOR<printerCreateInput, printerUncheckedCreateInput>
    /**
     * In case the printer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<printerUpdateInput, printerUncheckedUpdateInput>
  }

  /**
   * printer delete
   */
  export type printerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printer
     */
    select?: printerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printer
     */
    omit?: printerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printerInclude<ExtArgs> | null
    /**
     * Filter which printer to delete.
     */
    where: printerWhereUniqueInput
  }

  /**
   * printer deleteMany
   */
  export type printerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which printers to delete
     */
    where?: printerWhereInput
    /**
     * Limit how many printers to delete.
     */
    limit?: number
  }

  /**
   * printer.printorder
   */
  export type printer$printorderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printorder
     */
    select?: printorderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printorder
     */
    omit?: printorderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printorderInclude<ExtArgs> | null
    where?: printorderWhereInput
    orderBy?: printorderOrderByWithRelationInput | printorderOrderByWithRelationInput[]
    cursor?: printorderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PrintorderScalarFieldEnum | PrintorderScalarFieldEnum[]
  }

  /**
   * printer without action
   */
  export type printerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printer
     */
    select?: printerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printer
     */
    omit?: printerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printerInclude<ExtArgs> | null
  }


  /**
   * Model printorder
   */

  export type AggregatePrintorder = {
    _count: PrintorderCountAggregateOutputType | null
    _avg: PrintorderAvgAggregateOutputType | null
    _sum: PrintorderSumAggregateOutputType | null
    _min: PrintorderMinAggregateOutputType | null
    _max: PrintorderMaxAggregateOutputType | null
  }

  export type PrintorderAvgAggregateOutputType = {
    id: number | null
    count: number | null
    printerId: number | null
  }

  export type PrintorderSumAggregateOutputType = {
    id: number | null
    count: number | null
    printerId: number | null
  }

  export type PrintorderMinAggregateOutputType = {
    id: number | null
    quality: string | null
    count: number | null
    status: $Enums.printorder_status | null
    memo: string | null
    tracking: $Enums.printorder_tracking | null
    startDate: Date | null
    endDate: Date | null
    printerId: number | null
    edition: string | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type PrintorderMaxAggregateOutputType = {
    id: number | null
    quality: string | null
    count: number | null
    status: $Enums.printorder_status | null
    memo: string | null
    tracking: $Enums.printorder_tracking | null
    startDate: Date | null
    endDate: Date | null
    printerId: number | null
    edition: string | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type PrintorderCountAggregateOutputType = {
    id: number
    quality: number
    count: number
    status: number
    memo: number
    tracking: number
    startDate: number
    endDate: number
    printerId: number
    edition: number
    is_deleted: number
    updatedAt: number
    createdAt: number
    deletedAt: number
    _all: number
  }


  export type PrintorderAvgAggregateInputType = {
    id?: true
    count?: true
    printerId?: true
  }

  export type PrintorderSumAggregateInputType = {
    id?: true
    count?: true
    printerId?: true
  }

  export type PrintorderMinAggregateInputType = {
    id?: true
    quality?: true
    count?: true
    status?: true
    memo?: true
    tracking?: true
    startDate?: true
    endDate?: true
    printerId?: true
    edition?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
  }

  export type PrintorderMaxAggregateInputType = {
    id?: true
    quality?: true
    count?: true
    status?: true
    memo?: true
    tracking?: true
    startDate?: true
    endDate?: true
    printerId?: true
    edition?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
  }

  export type PrintorderCountAggregateInputType = {
    id?: true
    quality?: true
    count?: true
    status?: true
    memo?: true
    tracking?: true
    startDate?: true
    endDate?: true
    printerId?: true
    edition?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    _all?: true
  }

  export type PrintorderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which printorder to aggregate.
     */
    where?: printorderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of printorders to fetch.
     */
    orderBy?: printorderOrderByWithRelationInput | printorderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: printorderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` printorders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` printorders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned printorders
    **/
    _count?: true | PrintorderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PrintorderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PrintorderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PrintorderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PrintorderMaxAggregateInputType
  }

  export type GetPrintorderAggregateType<T extends PrintorderAggregateArgs> = {
        [P in keyof T & keyof AggregatePrintorder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePrintorder[P]>
      : GetScalarType<T[P], AggregatePrintorder[P]>
  }




  export type printorderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: printorderWhereInput
    orderBy?: printorderOrderByWithAggregationInput | printorderOrderByWithAggregationInput[]
    by: PrintorderScalarFieldEnum[] | PrintorderScalarFieldEnum
    having?: printorderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PrintorderCountAggregateInputType | true
    _avg?: PrintorderAvgAggregateInputType
    _sum?: PrintorderSumAggregateInputType
    _min?: PrintorderMinAggregateInputType
    _max?: PrintorderMaxAggregateInputType
  }

  export type PrintorderGroupByOutputType = {
    id: number
    quality: string
    count: number
    status: $Enums.printorder_status
    memo: string | null
    tracking: $Enums.printorder_tracking
    startDate: Date | null
    endDate: Date | null
    printerId: number
    edition: string | null
    is_deleted: boolean
    updatedAt: Date
    createdAt: Date
    deletedAt: Date
    _count: PrintorderCountAggregateOutputType | null
    _avg: PrintorderAvgAggregateOutputType | null
    _sum: PrintorderSumAggregateOutputType | null
    _min: PrintorderMinAggregateOutputType | null
    _max: PrintorderMaxAggregateOutputType | null
  }

  type GetPrintorderGroupByPayload<T extends printorderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PrintorderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PrintorderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PrintorderGroupByOutputType[P]>
            : GetScalarType<T[P], PrintorderGroupByOutputType[P]>
        }
      >
    >


  export type printorderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    quality?: boolean
    count?: boolean
    status?: boolean
    memo?: boolean
    tracking?: boolean
    startDate?: boolean
    endDate?: boolean
    printerId?: boolean
    edition?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    printer?: boolean | printerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["printorder"]>



  export type printorderSelectScalar = {
    id?: boolean
    quality?: boolean
    count?: boolean
    status?: boolean
    memo?: boolean
    tracking?: boolean
    startDate?: boolean
    endDate?: boolean
    printerId?: boolean
    edition?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
  }

  export type printorderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "quality" | "count" | "status" | "memo" | "tracking" | "startDate" | "endDate" | "printerId" | "edition" | "is_deleted" | "updatedAt" | "createdAt" | "deletedAt", ExtArgs["result"]["printorder"]>
  export type printorderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    printer?: boolean | printerDefaultArgs<ExtArgs>
  }

  export type $printorderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "printorder"
    objects: {
      printer: Prisma.$printerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      quality: string
      count: number
      status: $Enums.printorder_status
      memo: string | null
      tracking: $Enums.printorder_tracking
      startDate: Date | null
      endDate: Date | null
      printerId: number
      edition: string | null
      is_deleted: boolean
      updatedAt: Date
      createdAt: Date
      deletedAt: Date
    }, ExtArgs["result"]["printorder"]>
    composites: {}
  }

  type printorderGetPayload<S extends boolean | null | undefined | printorderDefaultArgs> = $Result.GetResult<Prisma.$printorderPayload, S>

  type printorderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<printorderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PrintorderCountAggregateInputType | true
    }

  export interface printorderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['printorder'], meta: { name: 'printorder' } }
    /**
     * Find zero or one Printorder that matches the filter.
     * @param {printorderFindUniqueArgs} args - Arguments to find a Printorder
     * @example
     * // Get one Printorder
     * const printorder = await prisma.printorder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends printorderFindUniqueArgs>(args: SelectSubset<T, printorderFindUniqueArgs<ExtArgs>>): Prisma__printorderClient<$Result.GetResult<Prisma.$printorderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Printorder that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {printorderFindUniqueOrThrowArgs} args - Arguments to find a Printorder
     * @example
     * // Get one Printorder
     * const printorder = await prisma.printorder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends printorderFindUniqueOrThrowArgs>(args: SelectSubset<T, printorderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__printorderClient<$Result.GetResult<Prisma.$printorderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Printorder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {printorderFindFirstArgs} args - Arguments to find a Printorder
     * @example
     * // Get one Printorder
     * const printorder = await prisma.printorder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends printorderFindFirstArgs>(args?: SelectSubset<T, printorderFindFirstArgs<ExtArgs>>): Prisma__printorderClient<$Result.GetResult<Prisma.$printorderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Printorder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {printorderFindFirstOrThrowArgs} args - Arguments to find a Printorder
     * @example
     * // Get one Printorder
     * const printorder = await prisma.printorder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends printorderFindFirstOrThrowArgs>(args?: SelectSubset<T, printorderFindFirstOrThrowArgs<ExtArgs>>): Prisma__printorderClient<$Result.GetResult<Prisma.$printorderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Printorders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {printorderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Printorders
     * const printorders = await prisma.printorder.findMany()
     * 
     * // Get first 10 Printorders
     * const printorders = await prisma.printorder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const printorderWithIdOnly = await prisma.printorder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends printorderFindManyArgs>(args?: SelectSubset<T, printorderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$printorderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Printorder.
     * @param {printorderCreateArgs} args - Arguments to create a Printorder.
     * @example
     * // Create one Printorder
     * const Printorder = await prisma.printorder.create({
     *   data: {
     *     // ... data to create a Printorder
     *   }
     * })
     * 
     */
    create<T extends printorderCreateArgs>(args: SelectSubset<T, printorderCreateArgs<ExtArgs>>): Prisma__printorderClient<$Result.GetResult<Prisma.$printorderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Printorders.
     * @param {printorderCreateManyArgs} args - Arguments to create many Printorders.
     * @example
     * // Create many Printorders
     * const printorder = await prisma.printorder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends printorderCreateManyArgs>(args?: SelectSubset<T, printorderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Printorder.
     * @param {printorderDeleteArgs} args - Arguments to delete one Printorder.
     * @example
     * // Delete one Printorder
     * const Printorder = await prisma.printorder.delete({
     *   where: {
     *     // ... filter to delete one Printorder
     *   }
     * })
     * 
     */
    delete<T extends printorderDeleteArgs>(args: SelectSubset<T, printorderDeleteArgs<ExtArgs>>): Prisma__printorderClient<$Result.GetResult<Prisma.$printorderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Printorder.
     * @param {printorderUpdateArgs} args - Arguments to update one Printorder.
     * @example
     * // Update one Printorder
     * const printorder = await prisma.printorder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends printorderUpdateArgs>(args: SelectSubset<T, printorderUpdateArgs<ExtArgs>>): Prisma__printorderClient<$Result.GetResult<Prisma.$printorderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Printorders.
     * @param {printorderDeleteManyArgs} args - Arguments to filter Printorders to delete.
     * @example
     * // Delete a few Printorders
     * const { count } = await prisma.printorder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends printorderDeleteManyArgs>(args?: SelectSubset<T, printorderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Printorders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {printorderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Printorders
     * const printorder = await prisma.printorder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends printorderUpdateManyArgs>(args: SelectSubset<T, printorderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Printorder.
     * @param {printorderUpsertArgs} args - Arguments to update or create a Printorder.
     * @example
     * // Update or create a Printorder
     * const printorder = await prisma.printorder.upsert({
     *   create: {
     *     // ... data to create a Printorder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Printorder we want to update
     *   }
     * })
     */
    upsert<T extends printorderUpsertArgs>(args: SelectSubset<T, printorderUpsertArgs<ExtArgs>>): Prisma__printorderClient<$Result.GetResult<Prisma.$printorderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Printorders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {printorderCountArgs} args - Arguments to filter Printorders to count.
     * @example
     * // Count the number of Printorders
     * const count = await prisma.printorder.count({
     *   where: {
     *     // ... the filter for the Printorders we want to count
     *   }
     * })
    **/
    count<T extends printorderCountArgs>(
      args?: Subset<T, printorderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PrintorderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Printorder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrintorderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PrintorderAggregateArgs>(args: Subset<T, PrintorderAggregateArgs>): Prisma.PrismaPromise<GetPrintorderAggregateType<T>>

    /**
     * Group by Printorder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {printorderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends printorderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: printorderGroupByArgs['orderBy'] }
        : { orderBy?: printorderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, printorderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPrintorderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the printorder model
   */
  readonly fields: printorderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for printorder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__printorderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    printer<T extends printerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, printerDefaultArgs<ExtArgs>>): Prisma__printerClient<$Result.GetResult<Prisma.$printerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the printorder model
   */
  interface printorderFieldRefs {
    readonly id: FieldRef<"printorder", 'Int'>
    readonly quality: FieldRef<"printorder", 'String'>
    readonly count: FieldRef<"printorder", 'Int'>
    readonly status: FieldRef<"printorder", 'printorder_status'>
    readonly memo: FieldRef<"printorder", 'String'>
    readonly tracking: FieldRef<"printorder", 'printorder_tracking'>
    readonly startDate: FieldRef<"printorder", 'DateTime'>
    readonly endDate: FieldRef<"printorder", 'DateTime'>
    readonly printerId: FieldRef<"printorder", 'Int'>
    readonly edition: FieldRef<"printorder", 'String'>
    readonly is_deleted: FieldRef<"printorder", 'Boolean'>
    readonly updatedAt: FieldRef<"printorder", 'DateTime'>
    readonly createdAt: FieldRef<"printorder", 'DateTime'>
    readonly deletedAt: FieldRef<"printorder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * printorder findUnique
   */
  export type printorderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printorder
     */
    select?: printorderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printorder
     */
    omit?: printorderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printorderInclude<ExtArgs> | null
    /**
     * Filter, which printorder to fetch.
     */
    where: printorderWhereUniqueInput
  }

  /**
   * printorder findUniqueOrThrow
   */
  export type printorderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printorder
     */
    select?: printorderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printorder
     */
    omit?: printorderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printorderInclude<ExtArgs> | null
    /**
     * Filter, which printorder to fetch.
     */
    where: printorderWhereUniqueInput
  }

  /**
   * printorder findFirst
   */
  export type printorderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printorder
     */
    select?: printorderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printorder
     */
    omit?: printorderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printorderInclude<ExtArgs> | null
    /**
     * Filter, which printorder to fetch.
     */
    where?: printorderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of printorders to fetch.
     */
    orderBy?: printorderOrderByWithRelationInput | printorderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for printorders.
     */
    cursor?: printorderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` printorders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` printorders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of printorders.
     */
    distinct?: PrintorderScalarFieldEnum | PrintorderScalarFieldEnum[]
  }

  /**
   * printorder findFirstOrThrow
   */
  export type printorderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printorder
     */
    select?: printorderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printorder
     */
    omit?: printorderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printorderInclude<ExtArgs> | null
    /**
     * Filter, which printorder to fetch.
     */
    where?: printorderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of printorders to fetch.
     */
    orderBy?: printorderOrderByWithRelationInput | printorderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for printorders.
     */
    cursor?: printorderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` printorders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` printorders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of printorders.
     */
    distinct?: PrintorderScalarFieldEnum | PrintorderScalarFieldEnum[]
  }

  /**
   * printorder findMany
   */
  export type printorderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printorder
     */
    select?: printorderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printorder
     */
    omit?: printorderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printorderInclude<ExtArgs> | null
    /**
     * Filter, which printorders to fetch.
     */
    where?: printorderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of printorders to fetch.
     */
    orderBy?: printorderOrderByWithRelationInput | printorderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing printorders.
     */
    cursor?: printorderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` printorders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` printorders.
     */
    skip?: number
    distinct?: PrintorderScalarFieldEnum | PrintorderScalarFieldEnum[]
  }

  /**
   * printorder create
   */
  export type printorderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printorder
     */
    select?: printorderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printorder
     */
    omit?: printorderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printorderInclude<ExtArgs> | null
    /**
     * The data needed to create a printorder.
     */
    data: XOR<printorderCreateInput, printorderUncheckedCreateInput>
  }

  /**
   * printorder createMany
   */
  export type printorderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many printorders.
     */
    data: printorderCreateManyInput | printorderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * printorder update
   */
  export type printorderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printorder
     */
    select?: printorderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printorder
     */
    omit?: printorderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printorderInclude<ExtArgs> | null
    /**
     * The data needed to update a printorder.
     */
    data: XOR<printorderUpdateInput, printorderUncheckedUpdateInput>
    /**
     * Choose, which printorder to update.
     */
    where: printorderWhereUniqueInput
  }

  /**
   * printorder updateMany
   */
  export type printorderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update printorders.
     */
    data: XOR<printorderUpdateManyMutationInput, printorderUncheckedUpdateManyInput>
    /**
     * Filter which printorders to update
     */
    where?: printorderWhereInput
    /**
     * Limit how many printorders to update.
     */
    limit?: number
  }

  /**
   * printorder upsert
   */
  export type printorderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printorder
     */
    select?: printorderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printorder
     */
    omit?: printorderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printorderInclude<ExtArgs> | null
    /**
     * The filter to search for the printorder to update in case it exists.
     */
    where: printorderWhereUniqueInput
    /**
     * In case the printorder found by the `where` argument doesn't exist, create a new printorder with this data.
     */
    create: XOR<printorderCreateInput, printorderUncheckedCreateInput>
    /**
     * In case the printorder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<printorderUpdateInput, printorderUncheckedUpdateInput>
  }

  /**
   * printorder delete
   */
  export type printorderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printorder
     */
    select?: printorderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printorder
     */
    omit?: printorderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printorderInclude<ExtArgs> | null
    /**
     * Filter which printorder to delete.
     */
    where: printorderWhereUniqueInput
  }

  /**
   * printorder deleteMany
   */
  export type printorderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which printorders to delete
     */
    where?: printorderWhereInput
    /**
     * Limit how many printorders to delete.
     */
    limit?: number
  }

  /**
   * printorder without action
   */
  export type printorderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the printorder
     */
    select?: printorderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the printorder
     */
    omit?: printorderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: printorderInclude<ExtArgs> | null
  }


  /**
   * Model roles
   */

  export type AggregateRoles = {
    _count: RolesCountAggregateOutputType | null
    _avg: RolesAvgAggregateOutputType | null
    _sum: RolesSumAggregateOutputType | null
    _min: RolesMinAggregateOutputType | null
    _max: RolesMaxAggregateOutputType | null
  }

  export type RolesAvgAggregateOutputType = {
    id: number | null
    accountId: number | null
  }

  export type RolesSumAggregateOutputType = {
    id: number | null
    accountId: number | null
  }

  export type RolesMinAggregateOutputType = {
    id: number | null
    role_status: boolean | null
    role_name: string | null
    accountId: number | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type RolesMaxAggregateOutputType = {
    id: number | null
    role_status: boolean | null
    role_name: string | null
    accountId: number | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type RolesCountAggregateOutputType = {
    id: number
    role_status: number
    role_name: number
    accountId: number
    is_deleted: number
    updatedAt: number
    createdAt: number
    deletedAt: number
    _all: number
  }


  export type RolesAvgAggregateInputType = {
    id?: true
    accountId?: true
  }

  export type RolesSumAggregateInputType = {
    id?: true
    accountId?: true
  }

  export type RolesMinAggregateInputType = {
    id?: true
    role_status?: true
    role_name?: true
    accountId?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
  }

  export type RolesMaxAggregateInputType = {
    id?: true
    role_status?: true
    role_name?: true
    accountId?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
  }

  export type RolesCountAggregateInputType = {
    id?: true
    role_status?: true
    role_name?: true
    accountId?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    _all?: true
  }

  export type RolesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which roles to aggregate.
     */
    where?: rolesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of roles to fetch.
     */
    orderBy?: rolesOrderByWithRelationInput | rolesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: rolesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned roles
    **/
    _count?: true | RolesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RolesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RolesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RolesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RolesMaxAggregateInputType
  }

  export type GetRolesAggregateType<T extends RolesAggregateArgs> = {
        [P in keyof T & keyof AggregateRoles]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoles[P]>
      : GetScalarType<T[P], AggregateRoles[P]>
  }




  export type rolesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: rolesWhereInput
    orderBy?: rolesOrderByWithAggregationInput | rolesOrderByWithAggregationInput[]
    by: RolesScalarFieldEnum[] | RolesScalarFieldEnum
    having?: rolesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RolesCountAggregateInputType | true
    _avg?: RolesAvgAggregateInputType
    _sum?: RolesSumAggregateInputType
    _min?: RolesMinAggregateInputType
    _max?: RolesMaxAggregateInputType
  }

  export type RolesGroupByOutputType = {
    id: number
    role_status: boolean
    role_name: string
    accountId: number
    is_deleted: boolean
    updatedAt: Date
    createdAt: Date
    deletedAt: Date
    _count: RolesCountAggregateOutputType | null
    _avg: RolesAvgAggregateOutputType | null
    _sum: RolesSumAggregateOutputType | null
    _min: RolesMinAggregateOutputType | null
    _max: RolesMaxAggregateOutputType | null
  }

  type GetRolesGroupByPayload<T extends rolesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RolesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RolesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RolesGroupByOutputType[P]>
            : GetScalarType<T[P], RolesGroupByOutputType[P]>
        }
      >
    >


  export type rolesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role_status?: boolean
    role_name?: boolean
    accountId?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    accounts?: boolean | accountsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roles"]>



  export type rolesSelectScalar = {
    id?: boolean
    role_status?: boolean
    role_name?: boolean
    accountId?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
  }

  export type rolesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "role_status" | "role_name" | "accountId" | "is_deleted" | "updatedAt" | "createdAt" | "deletedAt", ExtArgs["result"]["roles"]>
  export type rolesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | accountsDefaultArgs<ExtArgs>
  }

  export type $rolesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "roles"
    objects: {
      accounts: Prisma.$accountsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      role_status: boolean
      role_name: string
      accountId: number
      is_deleted: boolean
      updatedAt: Date
      createdAt: Date
      deletedAt: Date
    }, ExtArgs["result"]["roles"]>
    composites: {}
  }

  type rolesGetPayload<S extends boolean | null | undefined | rolesDefaultArgs> = $Result.GetResult<Prisma.$rolesPayload, S>

  type rolesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<rolesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RolesCountAggregateInputType | true
    }

  export interface rolesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['roles'], meta: { name: 'roles' } }
    /**
     * Find zero or one Roles that matches the filter.
     * @param {rolesFindUniqueArgs} args - Arguments to find a Roles
     * @example
     * // Get one Roles
     * const roles = await prisma.roles.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends rolesFindUniqueArgs>(args: SelectSubset<T, rolesFindUniqueArgs<ExtArgs>>): Prisma__rolesClient<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Roles that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {rolesFindUniqueOrThrowArgs} args - Arguments to find a Roles
     * @example
     * // Get one Roles
     * const roles = await prisma.roles.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends rolesFindUniqueOrThrowArgs>(args: SelectSubset<T, rolesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__rolesClient<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {rolesFindFirstArgs} args - Arguments to find a Roles
     * @example
     * // Get one Roles
     * const roles = await prisma.roles.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends rolesFindFirstArgs>(args?: SelectSubset<T, rolesFindFirstArgs<ExtArgs>>): Prisma__rolesClient<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Roles that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {rolesFindFirstOrThrowArgs} args - Arguments to find a Roles
     * @example
     * // Get one Roles
     * const roles = await prisma.roles.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends rolesFindFirstOrThrowArgs>(args?: SelectSubset<T, rolesFindFirstOrThrowArgs<ExtArgs>>): Prisma__rolesClient<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {rolesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roles
     * const roles = await prisma.roles.findMany()
     * 
     * // Get first 10 Roles
     * const roles = await prisma.roles.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rolesWithIdOnly = await prisma.roles.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends rolesFindManyArgs>(args?: SelectSubset<T, rolesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Roles.
     * @param {rolesCreateArgs} args - Arguments to create a Roles.
     * @example
     * // Create one Roles
     * const Roles = await prisma.roles.create({
     *   data: {
     *     // ... data to create a Roles
     *   }
     * })
     * 
     */
    create<T extends rolesCreateArgs>(args: SelectSubset<T, rolesCreateArgs<ExtArgs>>): Prisma__rolesClient<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Roles.
     * @param {rolesCreateManyArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const roles = await prisma.roles.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends rolesCreateManyArgs>(args?: SelectSubset<T, rolesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Roles.
     * @param {rolesDeleteArgs} args - Arguments to delete one Roles.
     * @example
     * // Delete one Roles
     * const Roles = await prisma.roles.delete({
     *   where: {
     *     // ... filter to delete one Roles
     *   }
     * })
     * 
     */
    delete<T extends rolesDeleteArgs>(args: SelectSubset<T, rolesDeleteArgs<ExtArgs>>): Prisma__rolesClient<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Roles.
     * @param {rolesUpdateArgs} args - Arguments to update one Roles.
     * @example
     * // Update one Roles
     * const roles = await prisma.roles.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends rolesUpdateArgs>(args: SelectSubset<T, rolesUpdateArgs<ExtArgs>>): Prisma__rolesClient<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Roles.
     * @param {rolesDeleteManyArgs} args - Arguments to filter Roles to delete.
     * @example
     * // Delete a few Roles
     * const { count } = await prisma.roles.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends rolesDeleteManyArgs>(args?: SelectSubset<T, rolesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {rolesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roles
     * const roles = await prisma.roles.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends rolesUpdateManyArgs>(args: SelectSubset<T, rolesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Roles.
     * @param {rolesUpsertArgs} args - Arguments to update or create a Roles.
     * @example
     * // Update or create a Roles
     * const roles = await prisma.roles.upsert({
     *   create: {
     *     // ... data to create a Roles
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Roles we want to update
     *   }
     * })
     */
    upsert<T extends rolesUpsertArgs>(args: SelectSubset<T, rolesUpsertArgs<ExtArgs>>): Prisma__rolesClient<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {rolesCountArgs} args - Arguments to filter Roles to count.
     * @example
     * // Count the number of Roles
     * const count = await prisma.roles.count({
     *   where: {
     *     // ... the filter for the Roles we want to count
     *   }
     * })
    **/
    count<T extends rolesCountArgs>(
      args?: Subset<T, rolesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RolesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RolesAggregateArgs>(args: Subset<T, RolesAggregateArgs>): Prisma.PrismaPromise<GetRolesAggregateType<T>>

    /**
     * Group by Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {rolesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends rolesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: rolesGroupByArgs['orderBy'] }
        : { orderBy?: rolesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, rolesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRolesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the roles model
   */
  readonly fields: rolesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for roles.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__rolesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends accountsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, accountsDefaultArgs<ExtArgs>>): Prisma__accountsClient<$Result.GetResult<Prisma.$accountsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the roles model
   */
  interface rolesFieldRefs {
    readonly id: FieldRef<"roles", 'Int'>
    readonly role_status: FieldRef<"roles", 'Boolean'>
    readonly role_name: FieldRef<"roles", 'String'>
    readonly accountId: FieldRef<"roles", 'Int'>
    readonly is_deleted: FieldRef<"roles", 'Boolean'>
    readonly updatedAt: FieldRef<"roles", 'DateTime'>
    readonly createdAt: FieldRef<"roles", 'DateTime'>
    readonly deletedAt: FieldRef<"roles", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * roles findUnique
   */
  export type rolesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
    /**
     * Filter, which roles to fetch.
     */
    where: rolesWhereUniqueInput
  }

  /**
   * roles findUniqueOrThrow
   */
  export type rolesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
    /**
     * Filter, which roles to fetch.
     */
    where: rolesWhereUniqueInput
  }

  /**
   * roles findFirst
   */
  export type rolesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
    /**
     * Filter, which roles to fetch.
     */
    where?: rolesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of roles to fetch.
     */
    orderBy?: rolesOrderByWithRelationInput | rolesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for roles.
     */
    cursor?: rolesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of roles.
     */
    distinct?: RolesScalarFieldEnum | RolesScalarFieldEnum[]
  }

  /**
   * roles findFirstOrThrow
   */
  export type rolesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
    /**
     * Filter, which roles to fetch.
     */
    where?: rolesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of roles to fetch.
     */
    orderBy?: rolesOrderByWithRelationInput | rolesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for roles.
     */
    cursor?: rolesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of roles.
     */
    distinct?: RolesScalarFieldEnum | RolesScalarFieldEnum[]
  }

  /**
   * roles findMany
   */
  export type rolesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
    /**
     * Filter, which roles to fetch.
     */
    where?: rolesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of roles to fetch.
     */
    orderBy?: rolesOrderByWithRelationInput | rolesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing roles.
     */
    cursor?: rolesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` roles.
     */
    skip?: number
    distinct?: RolesScalarFieldEnum | RolesScalarFieldEnum[]
  }

  /**
   * roles create
   */
  export type rolesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
    /**
     * The data needed to create a roles.
     */
    data: XOR<rolesCreateInput, rolesUncheckedCreateInput>
  }

  /**
   * roles createMany
   */
  export type rolesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many roles.
     */
    data: rolesCreateManyInput | rolesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * roles update
   */
  export type rolesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
    /**
     * The data needed to update a roles.
     */
    data: XOR<rolesUpdateInput, rolesUncheckedUpdateInput>
    /**
     * Choose, which roles to update.
     */
    where: rolesWhereUniqueInput
  }

  /**
   * roles updateMany
   */
  export type rolesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update roles.
     */
    data: XOR<rolesUpdateManyMutationInput, rolesUncheckedUpdateManyInput>
    /**
     * Filter which roles to update
     */
    where?: rolesWhereInput
    /**
     * Limit how many roles to update.
     */
    limit?: number
  }

  /**
   * roles upsert
   */
  export type rolesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
    /**
     * The filter to search for the roles to update in case it exists.
     */
    where: rolesWhereUniqueInput
    /**
     * In case the roles found by the `where` argument doesn't exist, create a new roles with this data.
     */
    create: XOR<rolesCreateInput, rolesUncheckedCreateInput>
    /**
     * In case the roles was found with the provided `where` argument, update it with this data.
     */
    update: XOR<rolesUpdateInput, rolesUncheckedUpdateInput>
  }

  /**
   * roles delete
   */
  export type rolesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
    /**
     * Filter which roles to delete.
     */
    where: rolesWhereUniqueInput
  }

  /**
   * roles deleteMany
   */
  export type rolesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which roles to delete
     */
    where?: rolesWhereInput
    /**
     * Limit how many roles to delete.
     */
    limit?: number
  }

  /**
   * roles without action
   */
  export type rolesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
  }


  /**
   * Model stores
   */

  export type AggregateStores = {
    _count: StoresCountAggregateOutputType | null
    _avg: StoresAvgAggregateOutputType | null
    _sum: StoresSumAggregateOutputType | null
    _min: StoresMinAggregateOutputType | null
    _max: StoresMaxAggregateOutputType | null
  }

  export type StoresAvgAggregateOutputType = {
    id: number | null
  }

  export type StoresSumAggregateOutputType = {
    id: number | null
  }

  export type StoresMinAggregateOutputType = {
    id: number | null
    name: string | null
    location: string | null
    phone: string | null
    email: string | null
    status: string | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type StoresMaxAggregateOutputType = {
    id: number | null
    name: string | null
    location: string | null
    phone: string | null
    email: string | null
    status: string | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type StoresCountAggregateOutputType = {
    id: number
    name: number
    location: number
    phone: number
    email: number
    status: number
    is_deleted: number
    updatedAt: number
    createdAt: number
    deletedAt: number
    _all: number
  }


  export type StoresAvgAggregateInputType = {
    id?: true
  }

  export type StoresSumAggregateInputType = {
    id?: true
  }

  export type StoresMinAggregateInputType = {
    id?: true
    name?: true
    location?: true
    phone?: true
    email?: true
    status?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
  }

  export type StoresMaxAggregateInputType = {
    id?: true
    name?: true
    location?: true
    phone?: true
    email?: true
    status?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
  }

  export type StoresCountAggregateInputType = {
    id?: true
    name?: true
    location?: true
    phone?: true
    email?: true
    status?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    _all?: true
  }

  export type StoresAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which stores to aggregate.
     */
    where?: storesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of stores to fetch.
     */
    orderBy?: storesOrderByWithRelationInput | storesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: storesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` stores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` stores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned stores
    **/
    _count?: true | StoresCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StoresAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StoresSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StoresMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StoresMaxAggregateInputType
  }

  export type GetStoresAggregateType<T extends StoresAggregateArgs> = {
        [P in keyof T & keyof AggregateStores]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStores[P]>
      : GetScalarType<T[P], AggregateStores[P]>
  }




  export type storesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: storesWhereInput
    orderBy?: storesOrderByWithAggregationInput | storesOrderByWithAggregationInput[]
    by: StoresScalarFieldEnum[] | StoresScalarFieldEnum
    having?: storesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StoresCountAggregateInputType | true
    _avg?: StoresAvgAggregateInputType
    _sum?: StoresSumAggregateInputType
    _min?: StoresMinAggregateInputType
    _max?: StoresMaxAggregateInputType
  }

  export type StoresGroupByOutputType = {
    id: number
    name: string
    location: string
    phone: string | null
    email: string | null
    status: string
    is_deleted: boolean
    updatedAt: Date
    createdAt: Date
    deletedAt: Date
    _count: StoresCountAggregateOutputType | null
    _avg: StoresAvgAggregateOutputType | null
    _sum: StoresSumAggregateOutputType | null
    _min: StoresMinAggregateOutputType | null
    _max: StoresMaxAggregateOutputType | null
  }

  type GetStoresGroupByPayload<T extends storesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StoresGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StoresGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StoresGroupByOutputType[P]>
            : GetScalarType<T[P], StoresGroupByOutputType[P]>
        }
      >
    >


  export type storesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    location?: boolean
    phone?: boolean
    email?: boolean
    status?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    bookeditionstores?: boolean | stores$bookeditionstoresArgs<ExtArgs>
    damagedbooks?: boolean | stores$damagedbooksArgs<ExtArgs>
    _count?: boolean | StoresCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stores"]>



  export type storesSelectScalar = {
    id?: boolean
    name?: boolean
    location?: boolean
    phone?: boolean
    email?: boolean
    status?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
  }

  export type storesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "location" | "phone" | "email" | "status" | "is_deleted" | "updatedAt" | "createdAt" | "deletedAt", ExtArgs["result"]["stores"]>
  export type storesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookeditionstores?: boolean | stores$bookeditionstoresArgs<ExtArgs>
    damagedbooks?: boolean | stores$damagedbooksArgs<ExtArgs>
    _count?: boolean | StoresCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $storesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "stores"
    objects: {
      bookeditionstores: Prisma.$bookeditionstoresPayload<ExtArgs>[]
      damagedbooks: Prisma.$damagedbooksPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      location: string
      phone: string | null
      email: string | null
      status: string
      is_deleted: boolean
      updatedAt: Date
      createdAt: Date
      deletedAt: Date
    }, ExtArgs["result"]["stores"]>
    composites: {}
  }

  type storesGetPayload<S extends boolean | null | undefined | storesDefaultArgs> = $Result.GetResult<Prisma.$storesPayload, S>

  type storesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<storesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StoresCountAggregateInputType | true
    }

  export interface storesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['stores'], meta: { name: 'stores' } }
    /**
     * Find zero or one Stores that matches the filter.
     * @param {storesFindUniqueArgs} args - Arguments to find a Stores
     * @example
     * // Get one Stores
     * const stores = await prisma.stores.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends storesFindUniqueArgs>(args: SelectSubset<T, storesFindUniqueArgs<ExtArgs>>): Prisma__storesClient<$Result.GetResult<Prisma.$storesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Stores that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {storesFindUniqueOrThrowArgs} args - Arguments to find a Stores
     * @example
     * // Get one Stores
     * const stores = await prisma.stores.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends storesFindUniqueOrThrowArgs>(args: SelectSubset<T, storesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__storesClient<$Result.GetResult<Prisma.$storesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Stores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {storesFindFirstArgs} args - Arguments to find a Stores
     * @example
     * // Get one Stores
     * const stores = await prisma.stores.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends storesFindFirstArgs>(args?: SelectSubset<T, storesFindFirstArgs<ExtArgs>>): Prisma__storesClient<$Result.GetResult<Prisma.$storesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Stores that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {storesFindFirstOrThrowArgs} args - Arguments to find a Stores
     * @example
     * // Get one Stores
     * const stores = await prisma.stores.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends storesFindFirstOrThrowArgs>(args?: SelectSubset<T, storesFindFirstOrThrowArgs<ExtArgs>>): Prisma__storesClient<$Result.GetResult<Prisma.$storesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Stores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {storesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Stores
     * const stores = await prisma.stores.findMany()
     * 
     * // Get first 10 Stores
     * const stores = await prisma.stores.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const storesWithIdOnly = await prisma.stores.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends storesFindManyArgs>(args?: SelectSubset<T, storesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$storesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Stores.
     * @param {storesCreateArgs} args - Arguments to create a Stores.
     * @example
     * // Create one Stores
     * const Stores = await prisma.stores.create({
     *   data: {
     *     // ... data to create a Stores
     *   }
     * })
     * 
     */
    create<T extends storesCreateArgs>(args: SelectSubset<T, storesCreateArgs<ExtArgs>>): Prisma__storesClient<$Result.GetResult<Prisma.$storesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Stores.
     * @param {storesCreateManyArgs} args - Arguments to create many Stores.
     * @example
     * // Create many Stores
     * const stores = await prisma.stores.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends storesCreateManyArgs>(args?: SelectSubset<T, storesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Stores.
     * @param {storesDeleteArgs} args - Arguments to delete one Stores.
     * @example
     * // Delete one Stores
     * const Stores = await prisma.stores.delete({
     *   where: {
     *     // ... filter to delete one Stores
     *   }
     * })
     * 
     */
    delete<T extends storesDeleteArgs>(args: SelectSubset<T, storesDeleteArgs<ExtArgs>>): Prisma__storesClient<$Result.GetResult<Prisma.$storesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Stores.
     * @param {storesUpdateArgs} args - Arguments to update one Stores.
     * @example
     * // Update one Stores
     * const stores = await prisma.stores.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends storesUpdateArgs>(args: SelectSubset<T, storesUpdateArgs<ExtArgs>>): Prisma__storesClient<$Result.GetResult<Prisma.$storesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Stores.
     * @param {storesDeleteManyArgs} args - Arguments to filter Stores to delete.
     * @example
     * // Delete a few Stores
     * const { count } = await prisma.stores.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends storesDeleteManyArgs>(args?: SelectSubset<T, storesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Stores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {storesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Stores
     * const stores = await prisma.stores.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends storesUpdateManyArgs>(args: SelectSubset<T, storesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Stores.
     * @param {storesUpsertArgs} args - Arguments to update or create a Stores.
     * @example
     * // Update or create a Stores
     * const stores = await prisma.stores.upsert({
     *   create: {
     *     // ... data to create a Stores
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Stores we want to update
     *   }
     * })
     */
    upsert<T extends storesUpsertArgs>(args: SelectSubset<T, storesUpsertArgs<ExtArgs>>): Prisma__storesClient<$Result.GetResult<Prisma.$storesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Stores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {storesCountArgs} args - Arguments to filter Stores to count.
     * @example
     * // Count the number of Stores
     * const count = await prisma.stores.count({
     *   where: {
     *     // ... the filter for the Stores we want to count
     *   }
     * })
    **/
    count<T extends storesCountArgs>(
      args?: Subset<T, storesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StoresCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Stores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoresAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StoresAggregateArgs>(args: Subset<T, StoresAggregateArgs>): Prisma.PrismaPromise<GetStoresAggregateType<T>>

    /**
     * Group by Stores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {storesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends storesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: storesGroupByArgs['orderBy'] }
        : { orderBy?: storesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, storesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStoresGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the stores model
   */
  readonly fields: storesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for stores.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__storesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bookeditionstores<T extends stores$bookeditionstoresArgs<ExtArgs> = {}>(args?: Subset<T, stores$bookeditionstoresArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$bookeditionstoresPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    damagedbooks<T extends stores$damagedbooksArgs<ExtArgs> = {}>(args?: Subset<T, stores$damagedbooksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$damagedbooksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the stores model
   */
  interface storesFieldRefs {
    readonly id: FieldRef<"stores", 'Int'>
    readonly name: FieldRef<"stores", 'String'>
    readonly location: FieldRef<"stores", 'String'>
    readonly phone: FieldRef<"stores", 'String'>
    readonly email: FieldRef<"stores", 'String'>
    readonly status: FieldRef<"stores", 'String'>
    readonly is_deleted: FieldRef<"stores", 'Boolean'>
    readonly updatedAt: FieldRef<"stores", 'DateTime'>
    readonly createdAt: FieldRef<"stores", 'DateTime'>
    readonly deletedAt: FieldRef<"stores", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * stores findUnique
   */
  export type storesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the stores
     */
    select?: storesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the stores
     */
    omit?: storesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: storesInclude<ExtArgs> | null
    /**
     * Filter, which stores to fetch.
     */
    where: storesWhereUniqueInput
  }

  /**
   * stores findUniqueOrThrow
   */
  export type storesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the stores
     */
    select?: storesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the stores
     */
    omit?: storesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: storesInclude<ExtArgs> | null
    /**
     * Filter, which stores to fetch.
     */
    where: storesWhereUniqueInput
  }

  /**
   * stores findFirst
   */
  export type storesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the stores
     */
    select?: storesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the stores
     */
    omit?: storesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: storesInclude<ExtArgs> | null
    /**
     * Filter, which stores to fetch.
     */
    where?: storesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of stores to fetch.
     */
    orderBy?: storesOrderByWithRelationInput | storesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for stores.
     */
    cursor?: storesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` stores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` stores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of stores.
     */
    distinct?: StoresScalarFieldEnum | StoresScalarFieldEnum[]
  }

  /**
   * stores findFirstOrThrow
   */
  export type storesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the stores
     */
    select?: storesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the stores
     */
    omit?: storesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: storesInclude<ExtArgs> | null
    /**
     * Filter, which stores to fetch.
     */
    where?: storesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of stores to fetch.
     */
    orderBy?: storesOrderByWithRelationInput | storesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for stores.
     */
    cursor?: storesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` stores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` stores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of stores.
     */
    distinct?: StoresScalarFieldEnum | StoresScalarFieldEnum[]
  }

  /**
   * stores findMany
   */
  export type storesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the stores
     */
    select?: storesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the stores
     */
    omit?: storesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: storesInclude<ExtArgs> | null
    /**
     * Filter, which stores to fetch.
     */
    where?: storesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of stores to fetch.
     */
    orderBy?: storesOrderByWithRelationInput | storesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing stores.
     */
    cursor?: storesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` stores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` stores.
     */
    skip?: number
    distinct?: StoresScalarFieldEnum | StoresScalarFieldEnum[]
  }

  /**
   * stores create
   */
  export type storesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the stores
     */
    select?: storesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the stores
     */
    omit?: storesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: storesInclude<ExtArgs> | null
    /**
     * The data needed to create a stores.
     */
    data: XOR<storesCreateInput, storesUncheckedCreateInput>
  }

  /**
   * stores createMany
   */
  export type storesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many stores.
     */
    data: storesCreateManyInput | storesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * stores update
   */
  export type storesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the stores
     */
    select?: storesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the stores
     */
    omit?: storesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: storesInclude<ExtArgs> | null
    /**
     * The data needed to update a stores.
     */
    data: XOR<storesUpdateInput, storesUncheckedUpdateInput>
    /**
     * Choose, which stores to update.
     */
    where: storesWhereUniqueInput
  }

  /**
   * stores updateMany
   */
  export type storesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update stores.
     */
    data: XOR<storesUpdateManyMutationInput, storesUncheckedUpdateManyInput>
    /**
     * Filter which stores to update
     */
    where?: storesWhereInput
    /**
     * Limit how many stores to update.
     */
    limit?: number
  }

  /**
   * stores upsert
   */
  export type storesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the stores
     */
    select?: storesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the stores
     */
    omit?: storesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: storesInclude<ExtArgs> | null
    /**
     * The filter to search for the stores to update in case it exists.
     */
    where: storesWhereUniqueInput
    /**
     * In case the stores found by the `where` argument doesn't exist, create a new stores with this data.
     */
    create: XOR<storesCreateInput, storesUncheckedCreateInput>
    /**
     * In case the stores was found with the provided `where` argument, update it with this data.
     */
    update: XOR<storesUpdateInput, storesUncheckedUpdateInput>
  }

  /**
   * stores delete
   */
  export type storesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the stores
     */
    select?: storesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the stores
     */
    omit?: storesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: storesInclude<ExtArgs> | null
    /**
     * Filter which stores to delete.
     */
    where: storesWhereUniqueInput
  }

  /**
   * stores deleteMany
   */
  export type storesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which stores to delete
     */
    where?: storesWhereInput
    /**
     * Limit how many stores to delete.
     */
    limit?: number
  }

  /**
   * stores.bookeditionstores
   */
  export type stores$bookeditionstoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the bookeditionstores
     */
    select?: bookeditionstoresSelect<ExtArgs> | null
    /**
     * Omit specific fields from the bookeditionstores
     */
    omit?: bookeditionstoresOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: bookeditionstoresInclude<ExtArgs> | null
    where?: bookeditionstoresWhereInput
    orderBy?: bookeditionstoresOrderByWithRelationInput | bookeditionstoresOrderByWithRelationInput[]
    cursor?: bookeditionstoresWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookeditionstoresScalarFieldEnum | BookeditionstoresScalarFieldEnum[]
  }

  /**
   * stores.damagedbooks
   */
  export type stores$damagedbooksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the damagedbooks
     */
    select?: damagedbooksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the damagedbooks
     */
    omit?: damagedbooksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: damagedbooksInclude<ExtArgs> | null
    where?: damagedbooksWhereInput
    orderBy?: damagedbooksOrderByWithRelationInput | damagedbooksOrderByWithRelationInput[]
    cursor?: damagedbooksWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DamagedbooksScalarFieldEnum | DamagedbooksScalarFieldEnum[]
  }

  /**
   * stores without action
   */
  export type storesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the stores
     */
    select?: storesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the stores
     */
    omit?: storesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: storesInclude<ExtArgs> | null
  }


  /**
   * Model translator
   */

  export type AggregateTranslator = {
    _count: TranslatorCountAggregateOutputType | null
    _avg: TranslatorAvgAggregateOutputType | null
    _sum: TranslatorSumAggregateOutputType | null
    _min: TranslatorMinAggregateOutputType | null
    _max: TranslatorMaxAggregateOutputType | null
  }

  export type TranslatorAvgAggregateOutputType = {
    id: number | null
  }

  export type TranslatorSumAggregateOutputType = {
    id: number | null
  }

  export type TranslatorMinAggregateOutputType = {
    id: number | null
    name: string | null
    phoneNumber: string | null
    email: string | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type TranslatorMaxAggregateOutputType = {
    id: number | null
    name: string | null
    phoneNumber: string | null
    email: string | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type TranslatorCountAggregateOutputType = {
    id: number
    name: number
    phoneNumber: number
    email: number
    is_deleted: number
    updatedAt: number
    createdAt: number
    deletedAt: number
    _all: number
  }


  export type TranslatorAvgAggregateInputType = {
    id?: true
  }

  export type TranslatorSumAggregateInputType = {
    id?: true
  }

  export type TranslatorMinAggregateInputType = {
    id?: true
    name?: true
    phoneNumber?: true
    email?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
  }

  export type TranslatorMaxAggregateInputType = {
    id?: true
    name?: true
    phoneNumber?: true
    email?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
  }

  export type TranslatorCountAggregateInputType = {
    id?: true
    name?: true
    phoneNumber?: true
    email?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    _all?: true
  }

  export type TranslatorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which translator to aggregate.
     */
    where?: translatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of translators to fetch.
     */
    orderBy?: translatorOrderByWithRelationInput | translatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: translatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` translators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` translators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned translators
    **/
    _count?: true | TranslatorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TranslatorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TranslatorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TranslatorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TranslatorMaxAggregateInputType
  }

  export type GetTranslatorAggregateType<T extends TranslatorAggregateArgs> = {
        [P in keyof T & keyof AggregateTranslator]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTranslator[P]>
      : GetScalarType<T[P], AggregateTranslator[P]>
  }




  export type translatorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: translatorWhereInput
    orderBy?: translatorOrderByWithAggregationInput | translatorOrderByWithAggregationInput[]
    by: TranslatorScalarFieldEnum[] | TranslatorScalarFieldEnum
    having?: translatorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TranslatorCountAggregateInputType | true
    _avg?: TranslatorAvgAggregateInputType
    _sum?: TranslatorSumAggregateInputType
    _min?: TranslatorMinAggregateInputType
    _max?: TranslatorMaxAggregateInputType
  }

  export type TranslatorGroupByOutputType = {
    id: number
    name: string
    phoneNumber: string | null
    email: string | null
    is_deleted: boolean
    updatedAt: Date
    createdAt: Date
    deletedAt: Date
    _count: TranslatorCountAggregateOutputType | null
    _avg: TranslatorAvgAggregateOutputType | null
    _sum: TranslatorSumAggregateOutputType | null
    _min: TranslatorMinAggregateOutputType | null
    _max: TranslatorMaxAggregateOutputType | null
  }

  type GetTranslatorGroupByPayload<T extends translatorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TranslatorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TranslatorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TranslatorGroupByOutputType[P]>
            : GetScalarType<T[P], TranslatorGroupByOutputType[P]>
        }
      >
    >


  export type translatorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phoneNumber?: boolean
    email?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    translatorbook?: boolean | translator$translatorbookArgs<ExtArgs>
    _count?: boolean | TranslatorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["translator"]>



  export type translatorSelectScalar = {
    id?: boolean
    name?: boolean
    phoneNumber?: boolean
    email?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
  }

  export type translatorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "phoneNumber" | "email" | "is_deleted" | "updatedAt" | "createdAt" | "deletedAt", ExtArgs["result"]["translator"]>
  export type translatorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    translatorbook?: boolean | translator$translatorbookArgs<ExtArgs>
    _count?: boolean | TranslatorCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $translatorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "translator"
    objects: {
      translatorbook: Prisma.$translatorbookPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      phoneNumber: string | null
      email: string | null
      is_deleted: boolean
      updatedAt: Date
      createdAt: Date
      deletedAt: Date
    }, ExtArgs["result"]["translator"]>
    composites: {}
  }

  type translatorGetPayload<S extends boolean | null | undefined | translatorDefaultArgs> = $Result.GetResult<Prisma.$translatorPayload, S>

  type translatorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<translatorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TranslatorCountAggregateInputType | true
    }

  export interface translatorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['translator'], meta: { name: 'translator' } }
    /**
     * Find zero or one Translator that matches the filter.
     * @param {translatorFindUniqueArgs} args - Arguments to find a Translator
     * @example
     * // Get one Translator
     * const translator = await prisma.translator.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends translatorFindUniqueArgs>(args: SelectSubset<T, translatorFindUniqueArgs<ExtArgs>>): Prisma__translatorClient<$Result.GetResult<Prisma.$translatorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Translator that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {translatorFindUniqueOrThrowArgs} args - Arguments to find a Translator
     * @example
     * // Get one Translator
     * const translator = await prisma.translator.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends translatorFindUniqueOrThrowArgs>(args: SelectSubset<T, translatorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__translatorClient<$Result.GetResult<Prisma.$translatorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Translator that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {translatorFindFirstArgs} args - Arguments to find a Translator
     * @example
     * // Get one Translator
     * const translator = await prisma.translator.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends translatorFindFirstArgs>(args?: SelectSubset<T, translatorFindFirstArgs<ExtArgs>>): Prisma__translatorClient<$Result.GetResult<Prisma.$translatorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Translator that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {translatorFindFirstOrThrowArgs} args - Arguments to find a Translator
     * @example
     * // Get one Translator
     * const translator = await prisma.translator.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends translatorFindFirstOrThrowArgs>(args?: SelectSubset<T, translatorFindFirstOrThrowArgs<ExtArgs>>): Prisma__translatorClient<$Result.GetResult<Prisma.$translatorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Translators that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {translatorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Translators
     * const translators = await prisma.translator.findMany()
     * 
     * // Get first 10 Translators
     * const translators = await prisma.translator.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const translatorWithIdOnly = await prisma.translator.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends translatorFindManyArgs>(args?: SelectSubset<T, translatorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$translatorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Translator.
     * @param {translatorCreateArgs} args - Arguments to create a Translator.
     * @example
     * // Create one Translator
     * const Translator = await prisma.translator.create({
     *   data: {
     *     // ... data to create a Translator
     *   }
     * })
     * 
     */
    create<T extends translatorCreateArgs>(args: SelectSubset<T, translatorCreateArgs<ExtArgs>>): Prisma__translatorClient<$Result.GetResult<Prisma.$translatorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Translators.
     * @param {translatorCreateManyArgs} args - Arguments to create many Translators.
     * @example
     * // Create many Translators
     * const translator = await prisma.translator.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends translatorCreateManyArgs>(args?: SelectSubset<T, translatorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Translator.
     * @param {translatorDeleteArgs} args - Arguments to delete one Translator.
     * @example
     * // Delete one Translator
     * const Translator = await prisma.translator.delete({
     *   where: {
     *     // ... filter to delete one Translator
     *   }
     * })
     * 
     */
    delete<T extends translatorDeleteArgs>(args: SelectSubset<T, translatorDeleteArgs<ExtArgs>>): Prisma__translatorClient<$Result.GetResult<Prisma.$translatorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Translator.
     * @param {translatorUpdateArgs} args - Arguments to update one Translator.
     * @example
     * // Update one Translator
     * const translator = await prisma.translator.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends translatorUpdateArgs>(args: SelectSubset<T, translatorUpdateArgs<ExtArgs>>): Prisma__translatorClient<$Result.GetResult<Prisma.$translatorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Translators.
     * @param {translatorDeleteManyArgs} args - Arguments to filter Translators to delete.
     * @example
     * // Delete a few Translators
     * const { count } = await prisma.translator.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends translatorDeleteManyArgs>(args?: SelectSubset<T, translatorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Translators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {translatorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Translators
     * const translator = await prisma.translator.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends translatorUpdateManyArgs>(args: SelectSubset<T, translatorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Translator.
     * @param {translatorUpsertArgs} args - Arguments to update or create a Translator.
     * @example
     * // Update or create a Translator
     * const translator = await prisma.translator.upsert({
     *   create: {
     *     // ... data to create a Translator
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Translator we want to update
     *   }
     * })
     */
    upsert<T extends translatorUpsertArgs>(args: SelectSubset<T, translatorUpsertArgs<ExtArgs>>): Prisma__translatorClient<$Result.GetResult<Prisma.$translatorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Translators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {translatorCountArgs} args - Arguments to filter Translators to count.
     * @example
     * // Count the number of Translators
     * const count = await prisma.translator.count({
     *   where: {
     *     // ... the filter for the Translators we want to count
     *   }
     * })
    **/
    count<T extends translatorCountArgs>(
      args?: Subset<T, translatorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TranslatorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Translator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslatorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TranslatorAggregateArgs>(args: Subset<T, TranslatorAggregateArgs>): Prisma.PrismaPromise<GetTranslatorAggregateType<T>>

    /**
     * Group by Translator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {translatorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends translatorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: translatorGroupByArgs['orderBy'] }
        : { orderBy?: translatorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, translatorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTranslatorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the translator model
   */
  readonly fields: translatorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for translator.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__translatorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    translatorbook<T extends translator$translatorbookArgs<ExtArgs> = {}>(args?: Subset<T, translator$translatorbookArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$translatorbookPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the translator model
   */
  interface translatorFieldRefs {
    readonly id: FieldRef<"translator", 'Int'>
    readonly name: FieldRef<"translator", 'String'>
    readonly phoneNumber: FieldRef<"translator", 'String'>
    readonly email: FieldRef<"translator", 'String'>
    readonly is_deleted: FieldRef<"translator", 'Boolean'>
    readonly updatedAt: FieldRef<"translator", 'DateTime'>
    readonly createdAt: FieldRef<"translator", 'DateTime'>
    readonly deletedAt: FieldRef<"translator", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * translator findUnique
   */
  export type translatorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translator
     */
    select?: translatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translator
     */
    omit?: translatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorInclude<ExtArgs> | null
    /**
     * Filter, which translator to fetch.
     */
    where: translatorWhereUniqueInput
  }

  /**
   * translator findUniqueOrThrow
   */
  export type translatorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translator
     */
    select?: translatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translator
     */
    omit?: translatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorInclude<ExtArgs> | null
    /**
     * Filter, which translator to fetch.
     */
    where: translatorWhereUniqueInput
  }

  /**
   * translator findFirst
   */
  export type translatorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translator
     */
    select?: translatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translator
     */
    omit?: translatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorInclude<ExtArgs> | null
    /**
     * Filter, which translator to fetch.
     */
    where?: translatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of translators to fetch.
     */
    orderBy?: translatorOrderByWithRelationInput | translatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for translators.
     */
    cursor?: translatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` translators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` translators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of translators.
     */
    distinct?: TranslatorScalarFieldEnum | TranslatorScalarFieldEnum[]
  }

  /**
   * translator findFirstOrThrow
   */
  export type translatorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translator
     */
    select?: translatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translator
     */
    omit?: translatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorInclude<ExtArgs> | null
    /**
     * Filter, which translator to fetch.
     */
    where?: translatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of translators to fetch.
     */
    orderBy?: translatorOrderByWithRelationInput | translatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for translators.
     */
    cursor?: translatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` translators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` translators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of translators.
     */
    distinct?: TranslatorScalarFieldEnum | TranslatorScalarFieldEnum[]
  }

  /**
   * translator findMany
   */
  export type translatorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translator
     */
    select?: translatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translator
     */
    omit?: translatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorInclude<ExtArgs> | null
    /**
     * Filter, which translators to fetch.
     */
    where?: translatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of translators to fetch.
     */
    orderBy?: translatorOrderByWithRelationInput | translatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing translators.
     */
    cursor?: translatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` translators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` translators.
     */
    skip?: number
    distinct?: TranslatorScalarFieldEnum | TranslatorScalarFieldEnum[]
  }

  /**
   * translator create
   */
  export type translatorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translator
     */
    select?: translatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translator
     */
    omit?: translatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorInclude<ExtArgs> | null
    /**
     * The data needed to create a translator.
     */
    data: XOR<translatorCreateInput, translatorUncheckedCreateInput>
  }

  /**
   * translator createMany
   */
  export type translatorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many translators.
     */
    data: translatorCreateManyInput | translatorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * translator update
   */
  export type translatorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translator
     */
    select?: translatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translator
     */
    omit?: translatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorInclude<ExtArgs> | null
    /**
     * The data needed to update a translator.
     */
    data: XOR<translatorUpdateInput, translatorUncheckedUpdateInput>
    /**
     * Choose, which translator to update.
     */
    where: translatorWhereUniqueInput
  }

  /**
   * translator updateMany
   */
  export type translatorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update translators.
     */
    data: XOR<translatorUpdateManyMutationInput, translatorUncheckedUpdateManyInput>
    /**
     * Filter which translators to update
     */
    where?: translatorWhereInput
    /**
     * Limit how many translators to update.
     */
    limit?: number
  }

  /**
   * translator upsert
   */
  export type translatorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translator
     */
    select?: translatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translator
     */
    omit?: translatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorInclude<ExtArgs> | null
    /**
     * The filter to search for the translator to update in case it exists.
     */
    where: translatorWhereUniqueInput
    /**
     * In case the translator found by the `where` argument doesn't exist, create a new translator with this data.
     */
    create: XOR<translatorCreateInput, translatorUncheckedCreateInput>
    /**
     * In case the translator was found with the provided `where` argument, update it with this data.
     */
    update: XOR<translatorUpdateInput, translatorUncheckedUpdateInput>
  }

  /**
   * translator delete
   */
  export type translatorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translator
     */
    select?: translatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translator
     */
    omit?: translatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorInclude<ExtArgs> | null
    /**
     * Filter which translator to delete.
     */
    where: translatorWhereUniqueInput
  }

  /**
   * translator deleteMany
   */
  export type translatorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which translators to delete
     */
    where?: translatorWhereInput
    /**
     * Limit how many translators to delete.
     */
    limit?: number
  }

  /**
   * translator.translatorbook
   */
  export type translator$translatorbookArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translatorbook
     */
    select?: translatorbookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translatorbook
     */
    omit?: translatorbookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorbookInclude<ExtArgs> | null
    where?: translatorbookWhereInput
    orderBy?: translatorbookOrderByWithRelationInput | translatorbookOrderByWithRelationInput[]
    cursor?: translatorbookWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TranslatorbookScalarFieldEnum | TranslatorbookScalarFieldEnum[]
  }

  /**
   * translator without action
   */
  export type translatorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translator
     */
    select?: translatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translator
     */
    omit?: translatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorInclude<ExtArgs> | null
  }


  /**
   * Model translatorbook
   */

  export type AggregateTranslatorbook = {
    _count: TranslatorbookCountAggregateOutputType | null
    _avg: TranslatorbookAvgAggregateOutputType | null
    _sum: TranslatorbookSumAggregateOutputType | null
    _min: TranslatorbookMinAggregateOutputType | null
    _max: TranslatorbookMaxAggregateOutputType | null
  }

  export type TranslatorbookAvgAggregateOutputType = {
    id: number | null
    book_id: number | null
    bookId: number | null
    translator_id: number | null
  }

  export type TranslatorbookSumAggregateOutputType = {
    id: number | null
    book_id: number | null
    bookId: number | null
    translator_id: number | null
  }

  export type TranslatorbookMinAggregateOutputType = {
    id: number | null
    book_id: number | null
    bookId: number | null
    translator_id: number | null
    Status: $Enums.translatorbook_Status | null
    startDate: Date | null
    endDate: Date | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type TranslatorbookMaxAggregateOutputType = {
    id: number | null
    book_id: number | null
    bookId: number | null
    translator_id: number | null
    Status: $Enums.translatorbook_Status | null
    startDate: Date | null
    endDate: Date | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
  }

  export type TranslatorbookCountAggregateOutputType = {
    id: number
    book_id: number
    bookId: number
    translator_id: number
    Status: number
    startDate: number
    endDate: number
    is_deleted: number
    updatedAt: number
    createdAt: number
    deletedAt: number
    _all: number
  }


  export type TranslatorbookAvgAggregateInputType = {
    id?: true
    book_id?: true
    bookId?: true
    translator_id?: true
  }

  export type TranslatorbookSumAggregateInputType = {
    id?: true
    book_id?: true
    bookId?: true
    translator_id?: true
  }

  export type TranslatorbookMinAggregateInputType = {
    id?: true
    book_id?: true
    bookId?: true
    translator_id?: true
    Status?: true
    startDate?: true
    endDate?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
  }

  export type TranslatorbookMaxAggregateInputType = {
    id?: true
    book_id?: true
    bookId?: true
    translator_id?: true
    Status?: true
    startDate?: true
    endDate?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
  }

  export type TranslatorbookCountAggregateInputType = {
    id?: true
    book_id?: true
    bookId?: true
    translator_id?: true
    Status?: true
    startDate?: true
    endDate?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    _all?: true
  }

  export type TranslatorbookAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which translatorbook to aggregate.
     */
    where?: translatorbookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of translatorbooks to fetch.
     */
    orderBy?: translatorbookOrderByWithRelationInput | translatorbookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: translatorbookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` translatorbooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` translatorbooks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned translatorbooks
    **/
    _count?: true | TranslatorbookCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TranslatorbookAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TranslatorbookSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TranslatorbookMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TranslatorbookMaxAggregateInputType
  }

  export type GetTranslatorbookAggregateType<T extends TranslatorbookAggregateArgs> = {
        [P in keyof T & keyof AggregateTranslatorbook]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTranslatorbook[P]>
      : GetScalarType<T[P], AggregateTranslatorbook[P]>
  }




  export type translatorbookGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: translatorbookWhereInput
    orderBy?: translatorbookOrderByWithAggregationInput | translatorbookOrderByWithAggregationInput[]
    by: TranslatorbookScalarFieldEnum[] | TranslatorbookScalarFieldEnum
    having?: translatorbookScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TranslatorbookCountAggregateInputType | true
    _avg?: TranslatorbookAvgAggregateInputType
    _sum?: TranslatorbookSumAggregateInputType
    _min?: TranslatorbookMinAggregateInputType
    _max?: TranslatorbookMaxAggregateInputType
  }

  export type TranslatorbookGroupByOutputType = {
    id: number
    book_id: number | null
    bookId: number
    translator_id: number
    Status: $Enums.translatorbook_Status
    startDate: Date | null
    endDate: Date | null
    is_deleted: boolean
    updatedAt: Date
    createdAt: Date
    deletedAt: Date
    _count: TranslatorbookCountAggregateOutputType | null
    _avg: TranslatorbookAvgAggregateOutputType | null
    _sum: TranslatorbookSumAggregateOutputType | null
    _min: TranslatorbookMinAggregateOutputType | null
    _max: TranslatorbookMaxAggregateOutputType | null
  }

  type GetTranslatorbookGroupByPayload<T extends translatorbookGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TranslatorbookGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TranslatorbookGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TranslatorbookGroupByOutputType[P]>
            : GetScalarType<T[P], TranslatorbookGroupByOutputType[P]>
        }
      >
    >


  export type translatorbookSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    book_id?: boolean
    bookId?: boolean
    translator_id?: boolean
    Status?: boolean
    startDate?: boolean
    endDate?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    books?: boolean | booksDefaultArgs<ExtArgs>
    translator?: boolean | translatorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["translatorbook"]>



  export type translatorbookSelectScalar = {
    id?: boolean
    book_id?: boolean
    bookId?: boolean
    translator_id?: boolean
    Status?: boolean
    startDate?: boolean
    endDate?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
  }

  export type translatorbookOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "book_id" | "bookId" | "translator_id" | "Status" | "startDate" | "endDate" | "is_deleted" | "updatedAt" | "createdAt" | "deletedAt", ExtArgs["result"]["translatorbook"]>
  export type translatorbookInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    books?: boolean | booksDefaultArgs<ExtArgs>
    translator?: boolean | translatorDefaultArgs<ExtArgs>
  }

  export type $translatorbookPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "translatorbook"
    objects: {
      books: Prisma.$booksPayload<ExtArgs>
      translator: Prisma.$translatorPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      book_id: number | null
      bookId: number
      translator_id: number
      Status: $Enums.translatorbook_Status
      startDate: Date | null
      endDate: Date | null
      is_deleted: boolean
      updatedAt: Date
      createdAt: Date
      deletedAt: Date
    }, ExtArgs["result"]["translatorbook"]>
    composites: {}
  }

  type translatorbookGetPayload<S extends boolean | null | undefined | translatorbookDefaultArgs> = $Result.GetResult<Prisma.$translatorbookPayload, S>

  type translatorbookCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<translatorbookFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TranslatorbookCountAggregateInputType | true
    }

  export interface translatorbookDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['translatorbook'], meta: { name: 'translatorbook' } }
    /**
     * Find zero or one Translatorbook that matches the filter.
     * @param {translatorbookFindUniqueArgs} args - Arguments to find a Translatorbook
     * @example
     * // Get one Translatorbook
     * const translatorbook = await prisma.translatorbook.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends translatorbookFindUniqueArgs>(args: SelectSubset<T, translatorbookFindUniqueArgs<ExtArgs>>): Prisma__translatorbookClient<$Result.GetResult<Prisma.$translatorbookPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Translatorbook that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {translatorbookFindUniqueOrThrowArgs} args - Arguments to find a Translatorbook
     * @example
     * // Get one Translatorbook
     * const translatorbook = await prisma.translatorbook.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends translatorbookFindUniqueOrThrowArgs>(args: SelectSubset<T, translatorbookFindUniqueOrThrowArgs<ExtArgs>>): Prisma__translatorbookClient<$Result.GetResult<Prisma.$translatorbookPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Translatorbook that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {translatorbookFindFirstArgs} args - Arguments to find a Translatorbook
     * @example
     * // Get one Translatorbook
     * const translatorbook = await prisma.translatorbook.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends translatorbookFindFirstArgs>(args?: SelectSubset<T, translatorbookFindFirstArgs<ExtArgs>>): Prisma__translatorbookClient<$Result.GetResult<Prisma.$translatorbookPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Translatorbook that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {translatorbookFindFirstOrThrowArgs} args - Arguments to find a Translatorbook
     * @example
     * // Get one Translatorbook
     * const translatorbook = await prisma.translatorbook.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends translatorbookFindFirstOrThrowArgs>(args?: SelectSubset<T, translatorbookFindFirstOrThrowArgs<ExtArgs>>): Prisma__translatorbookClient<$Result.GetResult<Prisma.$translatorbookPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Translatorbooks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {translatorbookFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Translatorbooks
     * const translatorbooks = await prisma.translatorbook.findMany()
     * 
     * // Get first 10 Translatorbooks
     * const translatorbooks = await prisma.translatorbook.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const translatorbookWithIdOnly = await prisma.translatorbook.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends translatorbookFindManyArgs>(args?: SelectSubset<T, translatorbookFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$translatorbookPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Translatorbook.
     * @param {translatorbookCreateArgs} args - Arguments to create a Translatorbook.
     * @example
     * // Create one Translatorbook
     * const Translatorbook = await prisma.translatorbook.create({
     *   data: {
     *     // ... data to create a Translatorbook
     *   }
     * })
     * 
     */
    create<T extends translatorbookCreateArgs>(args: SelectSubset<T, translatorbookCreateArgs<ExtArgs>>): Prisma__translatorbookClient<$Result.GetResult<Prisma.$translatorbookPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Translatorbooks.
     * @param {translatorbookCreateManyArgs} args - Arguments to create many Translatorbooks.
     * @example
     * // Create many Translatorbooks
     * const translatorbook = await prisma.translatorbook.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends translatorbookCreateManyArgs>(args?: SelectSubset<T, translatorbookCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Translatorbook.
     * @param {translatorbookDeleteArgs} args - Arguments to delete one Translatorbook.
     * @example
     * // Delete one Translatorbook
     * const Translatorbook = await prisma.translatorbook.delete({
     *   where: {
     *     // ... filter to delete one Translatorbook
     *   }
     * })
     * 
     */
    delete<T extends translatorbookDeleteArgs>(args: SelectSubset<T, translatorbookDeleteArgs<ExtArgs>>): Prisma__translatorbookClient<$Result.GetResult<Prisma.$translatorbookPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Translatorbook.
     * @param {translatorbookUpdateArgs} args - Arguments to update one Translatorbook.
     * @example
     * // Update one Translatorbook
     * const translatorbook = await prisma.translatorbook.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends translatorbookUpdateArgs>(args: SelectSubset<T, translatorbookUpdateArgs<ExtArgs>>): Prisma__translatorbookClient<$Result.GetResult<Prisma.$translatorbookPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Translatorbooks.
     * @param {translatorbookDeleteManyArgs} args - Arguments to filter Translatorbooks to delete.
     * @example
     * // Delete a few Translatorbooks
     * const { count } = await prisma.translatorbook.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends translatorbookDeleteManyArgs>(args?: SelectSubset<T, translatorbookDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Translatorbooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {translatorbookUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Translatorbooks
     * const translatorbook = await prisma.translatorbook.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends translatorbookUpdateManyArgs>(args: SelectSubset<T, translatorbookUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Translatorbook.
     * @param {translatorbookUpsertArgs} args - Arguments to update or create a Translatorbook.
     * @example
     * // Update or create a Translatorbook
     * const translatorbook = await prisma.translatorbook.upsert({
     *   create: {
     *     // ... data to create a Translatorbook
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Translatorbook we want to update
     *   }
     * })
     */
    upsert<T extends translatorbookUpsertArgs>(args: SelectSubset<T, translatorbookUpsertArgs<ExtArgs>>): Prisma__translatorbookClient<$Result.GetResult<Prisma.$translatorbookPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Translatorbooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {translatorbookCountArgs} args - Arguments to filter Translatorbooks to count.
     * @example
     * // Count the number of Translatorbooks
     * const count = await prisma.translatorbook.count({
     *   where: {
     *     // ... the filter for the Translatorbooks we want to count
     *   }
     * })
    **/
    count<T extends translatorbookCountArgs>(
      args?: Subset<T, translatorbookCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TranslatorbookCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Translatorbook.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslatorbookAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TranslatorbookAggregateArgs>(args: Subset<T, TranslatorbookAggregateArgs>): Prisma.PrismaPromise<GetTranslatorbookAggregateType<T>>

    /**
     * Group by Translatorbook.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {translatorbookGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends translatorbookGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: translatorbookGroupByArgs['orderBy'] }
        : { orderBy?: translatorbookGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, translatorbookGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTranslatorbookGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the translatorbook model
   */
  readonly fields: translatorbookFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for translatorbook.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__translatorbookClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    books<T extends booksDefaultArgs<ExtArgs> = {}>(args?: Subset<T, booksDefaultArgs<ExtArgs>>): Prisma__booksClient<$Result.GetResult<Prisma.$booksPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    translator<T extends translatorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, translatorDefaultArgs<ExtArgs>>): Prisma__translatorClient<$Result.GetResult<Prisma.$translatorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the translatorbook model
   */
  interface translatorbookFieldRefs {
    readonly id: FieldRef<"translatorbook", 'Int'>
    readonly book_id: FieldRef<"translatorbook", 'Int'>
    readonly bookId: FieldRef<"translatorbook", 'Int'>
    readonly translator_id: FieldRef<"translatorbook", 'Int'>
    readonly Status: FieldRef<"translatorbook", 'translatorbook_Status'>
    readonly startDate: FieldRef<"translatorbook", 'DateTime'>
    readonly endDate: FieldRef<"translatorbook", 'DateTime'>
    readonly is_deleted: FieldRef<"translatorbook", 'Boolean'>
    readonly updatedAt: FieldRef<"translatorbook", 'DateTime'>
    readonly createdAt: FieldRef<"translatorbook", 'DateTime'>
    readonly deletedAt: FieldRef<"translatorbook", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * translatorbook findUnique
   */
  export type translatorbookFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translatorbook
     */
    select?: translatorbookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translatorbook
     */
    omit?: translatorbookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorbookInclude<ExtArgs> | null
    /**
     * Filter, which translatorbook to fetch.
     */
    where: translatorbookWhereUniqueInput
  }

  /**
   * translatorbook findUniqueOrThrow
   */
  export type translatorbookFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translatorbook
     */
    select?: translatorbookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translatorbook
     */
    omit?: translatorbookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorbookInclude<ExtArgs> | null
    /**
     * Filter, which translatorbook to fetch.
     */
    where: translatorbookWhereUniqueInput
  }

  /**
   * translatorbook findFirst
   */
  export type translatorbookFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translatorbook
     */
    select?: translatorbookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translatorbook
     */
    omit?: translatorbookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorbookInclude<ExtArgs> | null
    /**
     * Filter, which translatorbook to fetch.
     */
    where?: translatorbookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of translatorbooks to fetch.
     */
    orderBy?: translatorbookOrderByWithRelationInput | translatorbookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for translatorbooks.
     */
    cursor?: translatorbookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` translatorbooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` translatorbooks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of translatorbooks.
     */
    distinct?: TranslatorbookScalarFieldEnum | TranslatorbookScalarFieldEnum[]
  }

  /**
   * translatorbook findFirstOrThrow
   */
  export type translatorbookFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translatorbook
     */
    select?: translatorbookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translatorbook
     */
    omit?: translatorbookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorbookInclude<ExtArgs> | null
    /**
     * Filter, which translatorbook to fetch.
     */
    where?: translatorbookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of translatorbooks to fetch.
     */
    orderBy?: translatorbookOrderByWithRelationInput | translatorbookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for translatorbooks.
     */
    cursor?: translatorbookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` translatorbooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` translatorbooks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of translatorbooks.
     */
    distinct?: TranslatorbookScalarFieldEnum | TranslatorbookScalarFieldEnum[]
  }

  /**
   * translatorbook findMany
   */
  export type translatorbookFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translatorbook
     */
    select?: translatorbookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translatorbook
     */
    omit?: translatorbookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorbookInclude<ExtArgs> | null
    /**
     * Filter, which translatorbooks to fetch.
     */
    where?: translatorbookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of translatorbooks to fetch.
     */
    orderBy?: translatorbookOrderByWithRelationInput | translatorbookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing translatorbooks.
     */
    cursor?: translatorbookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` translatorbooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` translatorbooks.
     */
    skip?: number
    distinct?: TranslatorbookScalarFieldEnum | TranslatorbookScalarFieldEnum[]
  }

  /**
   * translatorbook create
   */
  export type translatorbookCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translatorbook
     */
    select?: translatorbookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translatorbook
     */
    omit?: translatorbookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorbookInclude<ExtArgs> | null
    /**
     * The data needed to create a translatorbook.
     */
    data: XOR<translatorbookCreateInput, translatorbookUncheckedCreateInput>
  }

  /**
   * translatorbook createMany
   */
  export type translatorbookCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many translatorbooks.
     */
    data: translatorbookCreateManyInput | translatorbookCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * translatorbook update
   */
  export type translatorbookUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translatorbook
     */
    select?: translatorbookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translatorbook
     */
    omit?: translatorbookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorbookInclude<ExtArgs> | null
    /**
     * The data needed to update a translatorbook.
     */
    data: XOR<translatorbookUpdateInput, translatorbookUncheckedUpdateInput>
    /**
     * Choose, which translatorbook to update.
     */
    where: translatorbookWhereUniqueInput
  }

  /**
   * translatorbook updateMany
   */
  export type translatorbookUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update translatorbooks.
     */
    data: XOR<translatorbookUpdateManyMutationInput, translatorbookUncheckedUpdateManyInput>
    /**
     * Filter which translatorbooks to update
     */
    where?: translatorbookWhereInput
    /**
     * Limit how many translatorbooks to update.
     */
    limit?: number
  }

  /**
   * translatorbook upsert
   */
  export type translatorbookUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translatorbook
     */
    select?: translatorbookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translatorbook
     */
    omit?: translatorbookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorbookInclude<ExtArgs> | null
    /**
     * The filter to search for the translatorbook to update in case it exists.
     */
    where: translatorbookWhereUniqueInput
    /**
     * In case the translatorbook found by the `where` argument doesn't exist, create a new translatorbook with this data.
     */
    create: XOR<translatorbookCreateInput, translatorbookUncheckedCreateInput>
    /**
     * In case the translatorbook was found with the provided `where` argument, update it with this data.
     */
    update: XOR<translatorbookUpdateInput, translatorbookUncheckedUpdateInput>
  }

  /**
   * translatorbook delete
   */
  export type translatorbookDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translatorbook
     */
    select?: translatorbookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translatorbook
     */
    omit?: translatorbookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorbookInclude<ExtArgs> | null
    /**
     * Filter which translatorbook to delete.
     */
    where: translatorbookWhereUniqueInput
  }

  /**
   * translatorbook deleteMany
   */
  export type translatorbookDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which translatorbooks to delete
     */
    where?: translatorbookWhereInput
    /**
     * Limit how many translatorbooks to delete.
     */
    limit?: number
  }

  /**
   * translatorbook without action
   */
  export type translatorbookDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the translatorbook
     */
    select?: translatorbookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the translatorbook
     */
    omit?: translatorbookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: translatorbookInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AccountsScalarFieldEnum: {
    id: 'id',
    account_type: 'account_type',
    account_email: 'account_email',
    password: 'password',
    account_status: 'account_status',
    is_deleted: 'is_deleted',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt',
    name: 'name'
  };

  export type AccountsScalarFieldEnum = (typeof AccountsScalarFieldEnum)[keyof typeof AccountsScalarFieldEnum]


  export const BookeditionScalarFieldEnum: {
    id: 'id',
    edition_name: 'edition_name',
    selling_price: 'selling_price',
    production_price: 'production_price',
    printing_cost: 'printing_cost',
    binding_cost: 'binding_cost',
    design_cost: 'design_cost',
    translation_cost: 'translation_cost',
    memo: 'memo',
    book_image_url: 'book_image_url',
    total_print_count: 'total_print_count',
    book_id: 'book_id',
    number_of_pages: 'number_of_pages',
    bookId: 'bookId',
    is_deleted: 'is_deleted',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt',
    editing_cost: 'editing_cost',
    other_expenses: 'other_expenses',
    transportation_cost: 'transportation_cost'
  };

  export type BookeditionScalarFieldEnum = (typeof BookeditionScalarFieldEnum)[keyof typeof BookeditionScalarFieldEnum]


  export const BookeditionstoresScalarFieldEnum: {
    id: 'id',
    editionId: 'editionId',
    quantity: 'quantity',
    storeId: 'storeId',
    is_deleted: 'is_deleted',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt'
  };

  export type BookeditionstoresScalarFieldEnum = (typeof BookeditionstoresScalarFieldEnum)[keyof typeof BookeditionstoresScalarFieldEnum]


  export const BooksScalarFieldEnum: {
    id: 'id',
    unique_identification_code: 'unique_identification_code',
    isbn: 'isbn',
    title: 'title',
    author: 'author',
    translator: 'translator',
    designer: 'designer',
    language: 'language',
    edition: 'edition',
    category: 'category',
    publication_year: 'publication_year',
    print_batch_id: 'print_batch_id',
    book_sku: 'book_sku',
    number_of_pages: 'number_of_pages',
    info: 'info',
    book_image_url: 'book_image_url',
    status: 'status',
    is_deleted: 'is_deleted',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt',
    productionstatus: 'productionstatus',
    default_edition_id: 'default_edition_id'
  };

  export type BooksScalarFieldEnum = (typeof BooksScalarFieldEnum)[keyof typeof BooksScalarFieldEnum]


  export const BookshopeditionsScalarFieldEnum: {
    id: 'id',
    bookShopId: 'bookShopId',
    bookEditionId: 'bookEditionId',
    quantity: 'quantity',
    price_per_peice: 'price_per_peice',
    total_price: 'total_price',
    memo: 'memo',
    already_paid: 'already_paid',
    remaining_amount: 'remaining_amount',
    is_deleted: 'is_deleted',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt'
  };

  export type BookshopeditionsScalarFieldEnum = (typeof BookshopeditionsScalarFieldEnum)[keyof typeof BookshopeditionsScalarFieldEnum]


  export const BookshopesScalarFieldEnum: {
    id: 'id',
    name: 'name',
    location: 'location',
    branch: 'branch',
    phone: 'phone',
    email: 'email',
    is_deleted: 'is_deleted',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt'
  };

  export type BookshopesScalarFieldEnum = (typeof BookshopesScalarFieldEnum)[keyof typeof BookshopesScalarFieldEnum]


  export const DamagedbooksScalarFieldEnum: {
    id: 'id',
    type: 'type',
    book_id: 'book_id',
    store_id: 'store_id',
    edition_id: 'edition_id',
    count: 'count',
    memo: 'memo',
    account_id: 'account_id',
    is_deleted: 'is_deleted',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt'
  };

  export type DamagedbooksScalarFieldEnum = (typeof DamagedbooksScalarFieldEnum)[keyof typeof DamagedbooksScalarFieldEnum]


  export const DashboardmenuScalarFieldEnum: {
    id: 'id',
    role: 'role',
    menus: 'menus',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt'
  };

  export type DashboardmenuScalarFieldEnum = (typeof DashboardmenuScalarFieldEnum)[keyof typeof DashboardmenuScalarFieldEnum]


  export const PrinterScalarFieldEnum: {
    id: 'id',
    name: 'name',
    location: 'location',
    phone: 'phone',
    email: 'email',
    is_deleted: 'is_deleted',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt'
  };

  export type PrinterScalarFieldEnum = (typeof PrinterScalarFieldEnum)[keyof typeof PrinterScalarFieldEnum]


  export const PrintorderScalarFieldEnum: {
    id: 'id',
    quality: 'quality',
    count: 'count',
    status: 'status',
    memo: 'memo',
    tracking: 'tracking',
    startDate: 'startDate',
    endDate: 'endDate',
    printerId: 'printerId',
    edition: 'edition',
    is_deleted: 'is_deleted',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt'
  };

  export type PrintorderScalarFieldEnum = (typeof PrintorderScalarFieldEnum)[keyof typeof PrintorderScalarFieldEnum]


  export const RolesScalarFieldEnum: {
    id: 'id',
    role_status: 'role_status',
    role_name: 'role_name',
    accountId: 'accountId',
    is_deleted: 'is_deleted',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt'
  };

  export type RolesScalarFieldEnum = (typeof RolesScalarFieldEnum)[keyof typeof RolesScalarFieldEnum]


  export const StoresScalarFieldEnum: {
    id: 'id',
    name: 'name',
    location: 'location',
    phone: 'phone',
    email: 'email',
    status: 'status',
    is_deleted: 'is_deleted',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt'
  };

  export type StoresScalarFieldEnum = (typeof StoresScalarFieldEnum)[keyof typeof StoresScalarFieldEnum]


  export const TranslatorScalarFieldEnum: {
    id: 'id',
    name: 'name',
    phoneNumber: 'phoneNumber',
    email: 'email',
    is_deleted: 'is_deleted',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt'
  };

  export type TranslatorScalarFieldEnum = (typeof TranslatorScalarFieldEnum)[keyof typeof TranslatorScalarFieldEnum]


  export const TranslatorbookScalarFieldEnum: {
    id: 'id',
    book_id: 'book_id',
    bookId: 'bookId',
    translator_id: 'translator_id',
    Status: 'Status',
    startDate: 'startDate',
    endDate: 'endDate',
    is_deleted: 'is_deleted',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt'
  };

  export type TranslatorbookScalarFieldEnum = (typeof TranslatorbookScalarFieldEnum)[keyof typeof TranslatorbookScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const accountsOrderByRelevanceFieldEnum: {
    account_type: 'account_type',
    account_email: 'account_email',
    password: 'password',
    name: 'name'
  };

  export type accountsOrderByRelevanceFieldEnum = (typeof accountsOrderByRelevanceFieldEnum)[keyof typeof accountsOrderByRelevanceFieldEnum]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const bookeditionOrderByRelevanceFieldEnum: {
    edition_name: 'edition_name',
    memo: 'memo',
    book_image_url: 'book_image_url'
  };

  export type bookeditionOrderByRelevanceFieldEnum = (typeof bookeditionOrderByRelevanceFieldEnum)[keyof typeof bookeditionOrderByRelevanceFieldEnum]


  export const booksOrderByRelevanceFieldEnum: {
    unique_identification_code: 'unique_identification_code',
    isbn: 'isbn',
    title: 'title',
    author: 'author',
    translator: 'translator',
    designer: 'designer',
    language: 'language',
    edition: 'edition',
    category: 'category',
    publication_year: 'publication_year',
    print_batch_id: 'print_batch_id',
    book_sku: 'book_sku',
    info: 'info',
    book_image_url: 'book_image_url',
    status: 'status',
    default_edition_id: 'default_edition_id'
  };

  export type booksOrderByRelevanceFieldEnum = (typeof booksOrderByRelevanceFieldEnum)[keyof typeof booksOrderByRelevanceFieldEnum]


  export const bookshopeditionsOrderByRelevanceFieldEnum: {
    memo: 'memo'
  };

  export type bookshopeditionsOrderByRelevanceFieldEnum = (typeof bookshopeditionsOrderByRelevanceFieldEnum)[keyof typeof bookshopeditionsOrderByRelevanceFieldEnum]


  export const bookshopesOrderByRelevanceFieldEnum: {
    name: 'name',
    location: 'location',
    branch: 'branch',
    phone: 'phone',
    email: 'email'
  };

  export type bookshopesOrderByRelevanceFieldEnum = (typeof bookshopesOrderByRelevanceFieldEnum)[keyof typeof bookshopesOrderByRelevanceFieldEnum]


  export const damagedbooksOrderByRelevanceFieldEnum: {
    memo: 'memo'
  };

  export type damagedbooksOrderByRelevanceFieldEnum = (typeof damagedbooksOrderByRelevanceFieldEnum)[keyof typeof damagedbooksOrderByRelevanceFieldEnum]


  export const dashboardmenuOrderByRelevanceFieldEnum: {
    role: 'role',
    menus: 'menus'
  };

  export type dashboardmenuOrderByRelevanceFieldEnum = (typeof dashboardmenuOrderByRelevanceFieldEnum)[keyof typeof dashboardmenuOrderByRelevanceFieldEnum]


  export const printerOrderByRelevanceFieldEnum: {
    name: 'name',
    location: 'location',
    phone: 'phone',
    email: 'email'
  };

  export type printerOrderByRelevanceFieldEnum = (typeof printerOrderByRelevanceFieldEnum)[keyof typeof printerOrderByRelevanceFieldEnum]


  export const printorderOrderByRelevanceFieldEnum: {
    quality: 'quality',
    memo: 'memo',
    edition: 'edition'
  };

  export type printorderOrderByRelevanceFieldEnum = (typeof printorderOrderByRelevanceFieldEnum)[keyof typeof printorderOrderByRelevanceFieldEnum]


  export const rolesOrderByRelevanceFieldEnum: {
    role_name: 'role_name'
  };

  export type rolesOrderByRelevanceFieldEnum = (typeof rolesOrderByRelevanceFieldEnum)[keyof typeof rolesOrderByRelevanceFieldEnum]


  export const storesOrderByRelevanceFieldEnum: {
    name: 'name',
    location: 'location',
    phone: 'phone',
    email: 'email',
    status: 'status'
  };

  export type storesOrderByRelevanceFieldEnum = (typeof storesOrderByRelevanceFieldEnum)[keyof typeof storesOrderByRelevanceFieldEnum]


  export const translatorOrderByRelevanceFieldEnum: {
    name: 'name',
    phoneNumber: 'phoneNumber',
    email: 'email'
  };

  export type translatorOrderByRelevanceFieldEnum = (typeof translatorOrderByRelevanceFieldEnum)[keyof typeof translatorOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'books_productionstatus'
   */
  export type Enumbooks_productionstatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'books_productionstatus'>
    


  /**
   * Reference to a field of type 'damagedbooks_type'
   */
  export type Enumdamagedbooks_typeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'damagedbooks_type'>
    


  /**
   * Reference to a field of type 'printorder_status'
   */
  export type Enumprintorder_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'printorder_status'>
    


  /**
   * Reference to a field of type 'printorder_tracking'
   */
  export type Enumprintorder_trackingFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'printorder_tracking'>
    


  /**
   * Reference to a field of type 'translatorbook_Status'
   */
  export type Enumtranslatorbook_StatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'translatorbook_Status'>
    
  /**
   * Deep Input Types
   */


  export type accountsWhereInput = {
    AND?: accountsWhereInput | accountsWhereInput[]
    OR?: accountsWhereInput[]
    NOT?: accountsWhereInput | accountsWhereInput[]
    id?: IntFilter<"accounts"> | number
    account_type?: StringFilter<"accounts"> | string
    account_email?: StringFilter<"accounts"> | string
    password?: StringFilter<"accounts"> | string
    account_status?: BoolFilter<"accounts"> | boolean
    is_deleted?: BoolFilter<"accounts"> | boolean
    updatedAt?: DateTimeFilter<"accounts"> | Date | string
    createdAt?: DateTimeFilter<"accounts"> | Date | string
    deletedAt?: DateTimeFilter<"accounts"> | Date | string
    name?: StringFilter<"accounts"> | string
    damagedbooks?: DamagedbooksListRelationFilter
    roles?: RolesListRelationFilter
  }

  export type accountsOrderByWithRelationInput = {
    id?: SortOrder
    account_type?: SortOrder
    account_email?: SortOrder
    password?: SortOrder
    account_status?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    name?: SortOrder
    damagedbooks?: damagedbooksOrderByRelationAggregateInput
    roles?: rolesOrderByRelationAggregateInput
    _relevance?: accountsOrderByRelevanceInput
  }

  export type accountsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: accountsWhereInput | accountsWhereInput[]
    OR?: accountsWhereInput[]
    NOT?: accountsWhereInput | accountsWhereInput[]
    account_type?: StringFilter<"accounts"> | string
    account_email?: StringFilter<"accounts"> | string
    password?: StringFilter<"accounts"> | string
    account_status?: BoolFilter<"accounts"> | boolean
    is_deleted?: BoolFilter<"accounts"> | boolean
    updatedAt?: DateTimeFilter<"accounts"> | Date | string
    createdAt?: DateTimeFilter<"accounts"> | Date | string
    deletedAt?: DateTimeFilter<"accounts"> | Date | string
    name?: StringFilter<"accounts"> | string
    damagedbooks?: DamagedbooksListRelationFilter
    roles?: RolesListRelationFilter
  }, "id">

  export type accountsOrderByWithAggregationInput = {
    id?: SortOrder
    account_type?: SortOrder
    account_email?: SortOrder
    password?: SortOrder
    account_status?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    name?: SortOrder
    _count?: accountsCountOrderByAggregateInput
    _avg?: accountsAvgOrderByAggregateInput
    _max?: accountsMaxOrderByAggregateInput
    _min?: accountsMinOrderByAggregateInput
    _sum?: accountsSumOrderByAggregateInput
  }

  export type accountsScalarWhereWithAggregatesInput = {
    AND?: accountsScalarWhereWithAggregatesInput | accountsScalarWhereWithAggregatesInput[]
    OR?: accountsScalarWhereWithAggregatesInput[]
    NOT?: accountsScalarWhereWithAggregatesInput | accountsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"accounts"> | number
    account_type?: StringWithAggregatesFilter<"accounts"> | string
    account_email?: StringWithAggregatesFilter<"accounts"> | string
    password?: StringWithAggregatesFilter<"accounts"> | string
    account_status?: BoolWithAggregatesFilter<"accounts"> | boolean
    is_deleted?: BoolWithAggregatesFilter<"accounts"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"accounts"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"accounts"> | Date | string
    deletedAt?: DateTimeWithAggregatesFilter<"accounts"> | Date | string
    name?: StringWithAggregatesFilter<"accounts"> | string
  }

  export type bookeditionWhereInput = {
    AND?: bookeditionWhereInput | bookeditionWhereInput[]
    OR?: bookeditionWhereInput[]
    NOT?: bookeditionWhereInput | bookeditionWhereInput[]
    id?: IntFilter<"bookedition"> | number
    edition_name?: StringFilter<"bookedition"> | string
    selling_price?: FloatNullableFilter<"bookedition"> | number | null
    production_price?: FloatNullableFilter<"bookedition"> | number | null
    printing_cost?: FloatNullableFilter<"bookedition"> | number | null
    binding_cost?: FloatNullableFilter<"bookedition"> | number | null
    design_cost?: FloatNullableFilter<"bookedition"> | number | null
    translation_cost?: FloatNullableFilter<"bookedition"> | number | null
    memo?: StringNullableFilter<"bookedition"> | string | null
    book_image_url?: StringNullableFilter<"bookedition"> | string | null
    total_print_count?: IntNullableFilter<"bookedition"> | number | null
    book_id?: IntNullableFilter<"bookedition"> | number | null
    number_of_pages?: IntNullableFilter<"bookedition"> | number | null
    bookId?: IntFilter<"bookedition"> | number
    is_deleted?: BoolFilter<"bookedition"> | boolean
    updatedAt?: DateTimeFilter<"bookedition"> | Date | string
    createdAt?: DateTimeFilter<"bookedition"> | Date | string
    deletedAt?: DateTimeFilter<"bookedition"> | Date | string
    editing_cost?: FloatNullableFilter<"bookedition"> | number | null
    other_expenses?: FloatNullableFilter<"bookedition"> | number | null
    transportation_cost?: FloatNullableFilter<"bookedition"> | number | null
    books?: XOR<BooksScalarRelationFilter, booksWhereInput>
    bookeditionstores?: BookeditionstoresListRelationFilter
    bookshopeditions?: BookshopeditionsListRelationFilter
    damagedbooks?: DamagedbooksListRelationFilter
  }

  export type bookeditionOrderByWithRelationInput = {
    id?: SortOrder
    edition_name?: SortOrder
    selling_price?: SortOrderInput | SortOrder
    production_price?: SortOrderInput | SortOrder
    printing_cost?: SortOrderInput | SortOrder
    binding_cost?: SortOrderInput | SortOrder
    design_cost?: SortOrderInput | SortOrder
    translation_cost?: SortOrderInput | SortOrder
    memo?: SortOrderInput | SortOrder
    book_image_url?: SortOrderInput | SortOrder
    total_print_count?: SortOrderInput | SortOrder
    book_id?: SortOrderInput | SortOrder
    number_of_pages?: SortOrderInput | SortOrder
    bookId?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    editing_cost?: SortOrderInput | SortOrder
    other_expenses?: SortOrderInput | SortOrder
    transportation_cost?: SortOrderInput | SortOrder
    books?: booksOrderByWithRelationInput
    bookeditionstores?: bookeditionstoresOrderByRelationAggregateInput
    bookshopeditions?: bookshopeditionsOrderByRelationAggregateInput
    damagedbooks?: damagedbooksOrderByRelationAggregateInput
    _relevance?: bookeditionOrderByRelevanceInput
  }

  export type bookeditionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: bookeditionWhereInput | bookeditionWhereInput[]
    OR?: bookeditionWhereInput[]
    NOT?: bookeditionWhereInput | bookeditionWhereInput[]
    edition_name?: StringFilter<"bookedition"> | string
    selling_price?: FloatNullableFilter<"bookedition"> | number | null
    production_price?: FloatNullableFilter<"bookedition"> | number | null
    printing_cost?: FloatNullableFilter<"bookedition"> | number | null
    binding_cost?: FloatNullableFilter<"bookedition"> | number | null
    design_cost?: FloatNullableFilter<"bookedition"> | number | null
    translation_cost?: FloatNullableFilter<"bookedition"> | number | null
    memo?: StringNullableFilter<"bookedition"> | string | null
    book_image_url?: StringNullableFilter<"bookedition"> | string | null
    total_print_count?: IntNullableFilter<"bookedition"> | number | null
    book_id?: IntNullableFilter<"bookedition"> | number | null
    number_of_pages?: IntNullableFilter<"bookedition"> | number | null
    bookId?: IntFilter<"bookedition"> | number
    is_deleted?: BoolFilter<"bookedition"> | boolean
    updatedAt?: DateTimeFilter<"bookedition"> | Date | string
    createdAt?: DateTimeFilter<"bookedition"> | Date | string
    deletedAt?: DateTimeFilter<"bookedition"> | Date | string
    editing_cost?: FloatNullableFilter<"bookedition"> | number | null
    other_expenses?: FloatNullableFilter<"bookedition"> | number | null
    transportation_cost?: FloatNullableFilter<"bookedition"> | number | null
    books?: XOR<BooksScalarRelationFilter, booksWhereInput>
    bookeditionstores?: BookeditionstoresListRelationFilter
    bookshopeditions?: BookshopeditionsListRelationFilter
    damagedbooks?: DamagedbooksListRelationFilter
  }, "id">

  export type bookeditionOrderByWithAggregationInput = {
    id?: SortOrder
    edition_name?: SortOrder
    selling_price?: SortOrderInput | SortOrder
    production_price?: SortOrderInput | SortOrder
    printing_cost?: SortOrderInput | SortOrder
    binding_cost?: SortOrderInput | SortOrder
    design_cost?: SortOrderInput | SortOrder
    translation_cost?: SortOrderInput | SortOrder
    memo?: SortOrderInput | SortOrder
    book_image_url?: SortOrderInput | SortOrder
    total_print_count?: SortOrderInput | SortOrder
    book_id?: SortOrderInput | SortOrder
    number_of_pages?: SortOrderInput | SortOrder
    bookId?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    editing_cost?: SortOrderInput | SortOrder
    other_expenses?: SortOrderInput | SortOrder
    transportation_cost?: SortOrderInput | SortOrder
    _count?: bookeditionCountOrderByAggregateInput
    _avg?: bookeditionAvgOrderByAggregateInput
    _max?: bookeditionMaxOrderByAggregateInput
    _min?: bookeditionMinOrderByAggregateInput
    _sum?: bookeditionSumOrderByAggregateInput
  }

  export type bookeditionScalarWhereWithAggregatesInput = {
    AND?: bookeditionScalarWhereWithAggregatesInput | bookeditionScalarWhereWithAggregatesInput[]
    OR?: bookeditionScalarWhereWithAggregatesInput[]
    NOT?: bookeditionScalarWhereWithAggregatesInput | bookeditionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"bookedition"> | number
    edition_name?: StringWithAggregatesFilter<"bookedition"> | string
    selling_price?: FloatNullableWithAggregatesFilter<"bookedition"> | number | null
    production_price?: FloatNullableWithAggregatesFilter<"bookedition"> | number | null
    printing_cost?: FloatNullableWithAggregatesFilter<"bookedition"> | number | null
    binding_cost?: FloatNullableWithAggregatesFilter<"bookedition"> | number | null
    design_cost?: FloatNullableWithAggregatesFilter<"bookedition"> | number | null
    translation_cost?: FloatNullableWithAggregatesFilter<"bookedition"> | number | null
    memo?: StringNullableWithAggregatesFilter<"bookedition"> | string | null
    book_image_url?: StringNullableWithAggregatesFilter<"bookedition"> | string | null
    total_print_count?: IntNullableWithAggregatesFilter<"bookedition"> | number | null
    book_id?: IntNullableWithAggregatesFilter<"bookedition"> | number | null
    number_of_pages?: IntNullableWithAggregatesFilter<"bookedition"> | number | null
    bookId?: IntWithAggregatesFilter<"bookedition"> | number
    is_deleted?: BoolWithAggregatesFilter<"bookedition"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"bookedition"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"bookedition"> | Date | string
    deletedAt?: DateTimeWithAggregatesFilter<"bookedition"> | Date | string
    editing_cost?: FloatNullableWithAggregatesFilter<"bookedition"> | number | null
    other_expenses?: FloatNullableWithAggregatesFilter<"bookedition"> | number | null
    transportation_cost?: FloatNullableWithAggregatesFilter<"bookedition"> | number | null
  }

  export type bookeditionstoresWhereInput = {
    AND?: bookeditionstoresWhereInput | bookeditionstoresWhereInput[]
    OR?: bookeditionstoresWhereInput[]
    NOT?: bookeditionstoresWhereInput | bookeditionstoresWhereInput[]
    id?: IntFilter<"bookeditionstores"> | number
    editionId?: IntFilter<"bookeditionstores"> | number
    quantity?: IntNullableFilter<"bookeditionstores"> | number | null
    storeId?: IntFilter<"bookeditionstores"> | number
    is_deleted?: BoolFilter<"bookeditionstores"> | boolean
    updatedAt?: DateTimeFilter<"bookeditionstores"> | Date | string
    createdAt?: DateTimeFilter<"bookeditionstores"> | Date | string
    deletedAt?: DateTimeFilter<"bookeditionstores"> | Date | string
    bookedition?: XOR<BookeditionScalarRelationFilter, bookeditionWhereInput>
    stores?: XOR<StoresScalarRelationFilter, storesWhereInput>
  }

  export type bookeditionstoresOrderByWithRelationInput = {
    id?: SortOrder
    editionId?: SortOrder
    quantity?: SortOrderInput | SortOrder
    storeId?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    bookedition?: bookeditionOrderByWithRelationInput
    stores?: storesOrderByWithRelationInput
  }

  export type bookeditionstoresWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: bookeditionstoresWhereInput | bookeditionstoresWhereInput[]
    OR?: bookeditionstoresWhereInput[]
    NOT?: bookeditionstoresWhereInput | bookeditionstoresWhereInput[]
    editionId?: IntFilter<"bookeditionstores"> | number
    quantity?: IntNullableFilter<"bookeditionstores"> | number | null
    storeId?: IntFilter<"bookeditionstores"> | number
    is_deleted?: BoolFilter<"bookeditionstores"> | boolean
    updatedAt?: DateTimeFilter<"bookeditionstores"> | Date | string
    createdAt?: DateTimeFilter<"bookeditionstores"> | Date | string
    deletedAt?: DateTimeFilter<"bookeditionstores"> | Date | string
    bookedition?: XOR<BookeditionScalarRelationFilter, bookeditionWhereInput>
    stores?: XOR<StoresScalarRelationFilter, storesWhereInput>
  }, "id">

  export type bookeditionstoresOrderByWithAggregationInput = {
    id?: SortOrder
    editionId?: SortOrder
    quantity?: SortOrderInput | SortOrder
    storeId?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    _count?: bookeditionstoresCountOrderByAggregateInput
    _avg?: bookeditionstoresAvgOrderByAggregateInput
    _max?: bookeditionstoresMaxOrderByAggregateInput
    _min?: bookeditionstoresMinOrderByAggregateInput
    _sum?: bookeditionstoresSumOrderByAggregateInput
  }

  export type bookeditionstoresScalarWhereWithAggregatesInput = {
    AND?: bookeditionstoresScalarWhereWithAggregatesInput | bookeditionstoresScalarWhereWithAggregatesInput[]
    OR?: bookeditionstoresScalarWhereWithAggregatesInput[]
    NOT?: bookeditionstoresScalarWhereWithAggregatesInput | bookeditionstoresScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"bookeditionstores"> | number
    editionId?: IntWithAggregatesFilter<"bookeditionstores"> | number
    quantity?: IntNullableWithAggregatesFilter<"bookeditionstores"> | number | null
    storeId?: IntWithAggregatesFilter<"bookeditionstores"> | number
    is_deleted?: BoolWithAggregatesFilter<"bookeditionstores"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"bookeditionstores"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"bookeditionstores"> | Date | string
    deletedAt?: DateTimeWithAggregatesFilter<"bookeditionstores"> | Date | string
  }

  export type booksWhereInput = {
    AND?: booksWhereInput | booksWhereInput[]
    OR?: booksWhereInput[]
    NOT?: booksWhereInput | booksWhereInput[]
    id?: IntFilter<"books"> | number
    unique_identification_code?: StringFilter<"books"> | string
    isbn?: StringNullableFilter<"books"> | string | null
    title?: StringFilter<"books"> | string
    author?: StringFilter<"books"> | string
    translator?: StringNullableFilter<"books"> | string | null
    designer?: StringNullableFilter<"books"> | string | null
    language?: StringFilter<"books"> | string
    edition?: StringFilter<"books"> | string
    category?: StringFilter<"books"> | string
    publication_year?: StringFilter<"books"> | string
    print_batch_id?: StringNullableFilter<"books"> | string | null
    book_sku?: StringFilter<"books"> | string
    number_of_pages?: IntNullableFilter<"books"> | number | null
    info?: StringNullableFilter<"books"> | string | null
    book_image_url?: StringNullableFilter<"books"> | string | null
    status?: StringFilter<"books"> | string
    is_deleted?: BoolFilter<"books"> | boolean
    updatedAt?: DateTimeFilter<"books"> | Date | string
    createdAt?: DateTimeFilter<"books"> | Date | string
    deletedAt?: DateTimeFilter<"books"> | Date | string
    productionstatus?: Enumbooks_productionstatusNullableFilter<"books"> | $Enums.books_productionstatus | null
    default_edition_id?: StringNullableFilter<"books"> | string | null
    bookedition?: BookeditionListRelationFilter
    damagedbooks?: DamagedbooksListRelationFilter
    translatorbook?: TranslatorbookListRelationFilter
  }

  export type booksOrderByWithRelationInput = {
    id?: SortOrder
    unique_identification_code?: SortOrder
    isbn?: SortOrderInput | SortOrder
    title?: SortOrder
    author?: SortOrder
    translator?: SortOrderInput | SortOrder
    designer?: SortOrderInput | SortOrder
    language?: SortOrder
    edition?: SortOrder
    category?: SortOrder
    publication_year?: SortOrder
    print_batch_id?: SortOrderInput | SortOrder
    book_sku?: SortOrder
    number_of_pages?: SortOrderInput | SortOrder
    info?: SortOrderInput | SortOrder
    book_image_url?: SortOrderInput | SortOrder
    status?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    productionstatus?: SortOrderInput | SortOrder
    default_edition_id?: SortOrderInput | SortOrder
    bookedition?: bookeditionOrderByRelationAggregateInput
    damagedbooks?: damagedbooksOrderByRelationAggregateInput
    translatorbook?: translatorbookOrderByRelationAggregateInput
    _relevance?: booksOrderByRelevanceInput
  }

  export type booksWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    unique_identification_code?: string
    book_sku?: string
    AND?: booksWhereInput | booksWhereInput[]
    OR?: booksWhereInput[]
    NOT?: booksWhereInput | booksWhereInput[]
    isbn?: StringNullableFilter<"books"> | string | null
    title?: StringFilter<"books"> | string
    author?: StringFilter<"books"> | string
    translator?: StringNullableFilter<"books"> | string | null
    designer?: StringNullableFilter<"books"> | string | null
    language?: StringFilter<"books"> | string
    edition?: StringFilter<"books"> | string
    category?: StringFilter<"books"> | string
    publication_year?: StringFilter<"books"> | string
    print_batch_id?: StringNullableFilter<"books"> | string | null
    number_of_pages?: IntNullableFilter<"books"> | number | null
    info?: StringNullableFilter<"books"> | string | null
    book_image_url?: StringNullableFilter<"books"> | string | null
    status?: StringFilter<"books"> | string
    is_deleted?: BoolFilter<"books"> | boolean
    updatedAt?: DateTimeFilter<"books"> | Date | string
    createdAt?: DateTimeFilter<"books"> | Date | string
    deletedAt?: DateTimeFilter<"books"> | Date | string
    productionstatus?: Enumbooks_productionstatusNullableFilter<"books"> | $Enums.books_productionstatus | null
    default_edition_id?: StringNullableFilter<"books"> | string | null
    bookedition?: BookeditionListRelationFilter
    damagedbooks?: DamagedbooksListRelationFilter
    translatorbook?: TranslatorbookListRelationFilter
  }, "id" | "unique_identification_code" | "book_sku">

  export type booksOrderByWithAggregationInput = {
    id?: SortOrder
    unique_identification_code?: SortOrder
    isbn?: SortOrderInput | SortOrder
    title?: SortOrder
    author?: SortOrder
    translator?: SortOrderInput | SortOrder
    designer?: SortOrderInput | SortOrder
    language?: SortOrder
    edition?: SortOrder
    category?: SortOrder
    publication_year?: SortOrder
    print_batch_id?: SortOrderInput | SortOrder
    book_sku?: SortOrder
    number_of_pages?: SortOrderInput | SortOrder
    info?: SortOrderInput | SortOrder
    book_image_url?: SortOrderInput | SortOrder
    status?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    productionstatus?: SortOrderInput | SortOrder
    default_edition_id?: SortOrderInput | SortOrder
    _count?: booksCountOrderByAggregateInput
    _avg?: booksAvgOrderByAggregateInput
    _max?: booksMaxOrderByAggregateInput
    _min?: booksMinOrderByAggregateInput
    _sum?: booksSumOrderByAggregateInput
  }

  export type booksScalarWhereWithAggregatesInput = {
    AND?: booksScalarWhereWithAggregatesInput | booksScalarWhereWithAggregatesInput[]
    OR?: booksScalarWhereWithAggregatesInput[]
    NOT?: booksScalarWhereWithAggregatesInput | booksScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"books"> | number
    unique_identification_code?: StringWithAggregatesFilter<"books"> | string
    isbn?: StringNullableWithAggregatesFilter<"books"> | string | null
    title?: StringWithAggregatesFilter<"books"> | string
    author?: StringWithAggregatesFilter<"books"> | string
    translator?: StringNullableWithAggregatesFilter<"books"> | string | null
    designer?: StringNullableWithAggregatesFilter<"books"> | string | null
    language?: StringWithAggregatesFilter<"books"> | string
    edition?: StringWithAggregatesFilter<"books"> | string
    category?: StringWithAggregatesFilter<"books"> | string
    publication_year?: StringWithAggregatesFilter<"books"> | string
    print_batch_id?: StringNullableWithAggregatesFilter<"books"> | string | null
    book_sku?: StringWithAggregatesFilter<"books"> | string
    number_of_pages?: IntNullableWithAggregatesFilter<"books"> | number | null
    info?: StringNullableWithAggregatesFilter<"books"> | string | null
    book_image_url?: StringNullableWithAggregatesFilter<"books"> | string | null
    status?: StringWithAggregatesFilter<"books"> | string
    is_deleted?: BoolWithAggregatesFilter<"books"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"books"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"books"> | Date | string
    deletedAt?: DateTimeWithAggregatesFilter<"books"> | Date | string
    productionstatus?: Enumbooks_productionstatusNullableWithAggregatesFilter<"books"> | $Enums.books_productionstatus | null
    default_edition_id?: StringNullableWithAggregatesFilter<"books"> | string | null
  }

  export type bookshopeditionsWhereInput = {
    AND?: bookshopeditionsWhereInput | bookshopeditionsWhereInput[]
    OR?: bookshopeditionsWhereInput[]
    NOT?: bookshopeditionsWhereInput | bookshopeditionsWhereInput[]
    id?: IntFilter<"bookshopeditions"> | number
    bookShopId?: IntFilter<"bookshopeditions"> | number
    bookEditionId?: IntFilter<"bookshopeditions"> | number
    quantity?: IntFilter<"bookshopeditions"> | number
    price_per_peice?: FloatNullableFilter<"bookshopeditions"> | number | null
    total_price?: FloatNullableFilter<"bookshopeditions"> | number | null
    memo?: StringNullableFilter<"bookshopeditions"> | string | null
    already_paid?: FloatNullableFilter<"bookshopeditions"> | number | null
    remaining_amount?: FloatNullableFilter<"bookshopeditions"> | number | null
    is_deleted?: BoolFilter<"bookshopeditions"> | boolean
    updatedAt?: DateTimeFilter<"bookshopeditions"> | Date | string
    createdAt?: DateTimeFilter<"bookshopeditions"> | Date | string
    deletedAt?: DateTimeFilter<"bookshopeditions"> | Date | string
    bookedition?: XOR<BookeditionScalarRelationFilter, bookeditionWhereInput>
    bookshopes?: XOR<BookshopesScalarRelationFilter, bookshopesWhereInput>
  }

  export type bookshopeditionsOrderByWithRelationInput = {
    id?: SortOrder
    bookShopId?: SortOrder
    bookEditionId?: SortOrder
    quantity?: SortOrder
    price_per_peice?: SortOrderInput | SortOrder
    total_price?: SortOrderInput | SortOrder
    memo?: SortOrderInput | SortOrder
    already_paid?: SortOrderInput | SortOrder
    remaining_amount?: SortOrderInput | SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    bookedition?: bookeditionOrderByWithRelationInput
    bookshopes?: bookshopesOrderByWithRelationInput
    _relevance?: bookshopeditionsOrderByRelevanceInput
  }

  export type bookshopeditionsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: bookshopeditionsWhereInput | bookshopeditionsWhereInput[]
    OR?: bookshopeditionsWhereInput[]
    NOT?: bookshopeditionsWhereInput | bookshopeditionsWhereInput[]
    bookShopId?: IntFilter<"bookshopeditions"> | number
    bookEditionId?: IntFilter<"bookshopeditions"> | number
    quantity?: IntFilter<"bookshopeditions"> | number
    price_per_peice?: FloatNullableFilter<"bookshopeditions"> | number | null
    total_price?: FloatNullableFilter<"bookshopeditions"> | number | null
    memo?: StringNullableFilter<"bookshopeditions"> | string | null
    already_paid?: FloatNullableFilter<"bookshopeditions"> | number | null
    remaining_amount?: FloatNullableFilter<"bookshopeditions"> | number | null
    is_deleted?: BoolFilter<"bookshopeditions"> | boolean
    updatedAt?: DateTimeFilter<"bookshopeditions"> | Date | string
    createdAt?: DateTimeFilter<"bookshopeditions"> | Date | string
    deletedAt?: DateTimeFilter<"bookshopeditions"> | Date | string
    bookedition?: XOR<BookeditionScalarRelationFilter, bookeditionWhereInput>
    bookshopes?: XOR<BookshopesScalarRelationFilter, bookshopesWhereInput>
  }, "id">

  export type bookshopeditionsOrderByWithAggregationInput = {
    id?: SortOrder
    bookShopId?: SortOrder
    bookEditionId?: SortOrder
    quantity?: SortOrder
    price_per_peice?: SortOrderInput | SortOrder
    total_price?: SortOrderInput | SortOrder
    memo?: SortOrderInput | SortOrder
    already_paid?: SortOrderInput | SortOrder
    remaining_amount?: SortOrderInput | SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    _count?: bookshopeditionsCountOrderByAggregateInput
    _avg?: bookshopeditionsAvgOrderByAggregateInput
    _max?: bookshopeditionsMaxOrderByAggregateInput
    _min?: bookshopeditionsMinOrderByAggregateInput
    _sum?: bookshopeditionsSumOrderByAggregateInput
  }

  export type bookshopeditionsScalarWhereWithAggregatesInput = {
    AND?: bookshopeditionsScalarWhereWithAggregatesInput | bookshopeditionsScalarWhereWithAggregatesInput[]
    OR?: bookshopeditionsScalarWhereWithAggregatesInput[]
    NOT?: bookshopeditionsScalarWhereWithAggregatesInput | bookshopeditionsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"bookshopeditions"> | number
    bookShopId?: IntWithAggregatesFilter<"bookshopeditions"> | number
    bookEditionId?: IntWithAggregatesFilter<"bookshopeditions"> | number
    quantity?: IntWithAggregatesFilter<"bookshopeditions"> | number
    price_per_peice?: FloatNullableWithAggregatesFilter<"bookshopeditions"> | number | null
    total_price?: FloatNullableWithAggregatesFilter<"bookshopeditions"> | number | null
    memo?: StringNullableWithAggregatesFilter<"bookshopeditions"> | string | null
    already_paid?: FloatNullableWithAggregatesFilter<"bookshopeditions"> | number | null
    remaining_amount?: FloatNullableWithAggregatesFilter<"bookshopeditions"> | number | null
    is_deleted?: BoolWithAggregatesFilter<"bookshopeditions"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"bookshopeditions"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"bookshopeditions"> | Date | string
    deletedAt?: DateTimeWithAggregatesFilter<"bookshopeditions"> | Date | string
  }

  export type bookshopesWhereInput = {
    AND?: bookshopesWhereInput | bookshopesWhereInput[]
    OR?: bookshopesWhereInput[]
    NOT?: bookshopesWhereInput | bookshopesWhereInput[]
    id?: IntFilter<"bookshopes"> | number
    name?: StringFilter<"bookshopes"> | string
    location?: StringFilter<"bookshopes"> | string
    branch?: StringNullableFilter<"bookshopes"> | string | null
    phone?: StringNullableFilter<"bookshopes"> | string | null
    email?: StringNullableFilter<"bookshopes"> | string | null
    is_deleted?: BoolFilter<"bookshopes"> | boolean
    updatedAt?: DateTimeFilter<"bookshopes"> | Date | string
    createdAt?: DateTimeFilter<"bookshopes"> | Date | string
    deletedAt?: DateTimeFilter<"bookshopes"> | Date | string
    bookshopeditions?: BookshopeditionsListRelationFilter
  }

  export type bookshopesOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    location?: SortOrder
    branch?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    bookshopeditions?: bookshopeditionsOrderByRelationAggregateInput
    _relevance?: bookshopesOrderByRelevanceInput
  }

  export type bookshopesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: bookshopesWhereInput | bookshopesWhereInput[]
    OR?: bookshopesWhereInput[]
    NOT?: bookshopesWhereInput | bookshopesWhereInput[]
    name?: StringFilter<"bookshopes"> | string
    location?: StringFilter<"bookshopes"> | string
    branch?: StringNullableFilter<"bookshopes"> | string | null
    phone?: StringNullableFilter<"bookshopes"> | string | null
    email?: StringNullableFilter<"bookshopes"> | string | null
    is_deleted?: BoolFilter<"bookshopes"> | boolean
    updatedAt?: DateTimeFilter<"bookshopes"> | Date | string
    createdAt?: DateTimeFilter<"bookshopes"> | Date | string
    deletedAt?: DateTimeFilter<"bookshopes"> | Date | string
    bookshopeditions?: BookshopeditionsListRelationFilter
  }, "id">

  export type bookshopesOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    location?: SortOrder
    branch?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    _count?: bookshopesCountOrderByAggregateInput
    _avg?: bookshopesAvgOrderByAggregateInput
    _max?: bookshopesMaxOrderByAggregateInput
    _min?: bookshopesMinOrderByAggregateInput
    _sum?: bookshopesSumOrderByAggregateInput
  }

  export type bookshopesScalarWhereWithAggregatesInput = {
    AND?: bookshopesScalarWhereWithAggregatesInput | bookshopesScalarWhereWithAggregatesInput[]
    OR?: bookshopesScalarWhereWithAggregatesInput[]
    NOT?: bookshopesScalarWhereWithAggregatesInput | bookshopesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"bookshopes"> | number
    name?: StringWithAggregatesFilter<"bookshopes"> | string
    location?: StringWithAggregatesFilter<"bookshopes"> | string
    branch?: StringNullableWithAggregatesFilter<"bookshopes"> | string | null
    phone?: StringNullableWithAggregatesFilter<"bookshopes"> | string | null
    email?: StringNullableWithAggregatesFilter<"bookshopes"> | string | null
    is_deleted?: BoolWithAggregatesFilter<"bookshopes"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"bookshopes"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"bookshopes"> | Date | string
    deletedAt?: DateTimeWithAggregatesFilter<"bookshopes"> | Date | string
  }

  export type damagedbooksWhereInput = {
    AND?: damagedbooksWhereInput | damagedbooksWhereInput[]
    OR?: damagedbooksWhereInput[]
    NOT?: damagedbooksWhereInput | damagedbooksWhereInput[]
    id?: IntFilter<"damagedbooks"> | number
    type?: Enumdamagedbooks_typeNullableFilter<"damagedbooks"> | $Enums.damagedbooks_type | null
    book_id?: IntNullableFilter<"damagedbooks"> | number | null
    store_id?: IntNullableFilter<"damagedbooks"> | number | null
    edition_id?: IntNullableFilter<"damagedbooks"> | number | null
    count?: IntNullableFilter<"damagedbooks"> | number | null
    memo?: StringNullableFilter<"damagedbooks"> | string | null
    account_id?: IntNullableFilter<"damagedbooks"> | number | null
    is_deleted?: BoolFilter<"damagedbooks"> | boolean
    updatedAt?: DateTimeFilter<"damagedbooks"> | Date | string
    createdAt?: DateTimeFilter<"damagedbooks"> | Date | string
    deletedAt?: DateTimeFilter<"damagedbooks"> | Date | string
    accounts?: XOR<AccountsNullableScalarRelationFilter, accountsWhereInput> | null
    books?: XOR<BooksNullableScalarRelationFilter, booksWhereInput> | null
    bookedition?: XOR<BookeditionNullableScalarRelationFilter, bookeditionWhereInput> | null
    stores?: XOR<StoresNullableScalarRelationFilter, storesWhereInput> | null
  }

  export type damagedbooksOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrderInput | SortOrder
    book_id?: SortOrderInput | SortOrder
    store_id?: SortOrderInput | SortOrder
    edition_id?: SortOrderInput | SortOrder
    count?: SortOrderInput | SortOrder
    memo?: SortOrderInput | SortOrder
    account_id?: SortOrderInput | SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    accounts?: accountsOrderByWithRelationInput
    books?: booksOrderByWithRelationInput
    bookedition?: bookeditionOrderByWithRelationInput
    stores?: storesOrderByWithRelationInput
    _relevance?: damagedbooksOrderByRelevanceInput
  }

  export type damagedbooksWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: damagedbooksWhereInput | damagedbooksWhereInput[]
    OR?: damagedbooksWhereInput[]
    NOT?: damagedbooksWhereInput | damagedbooksWhereInput[]
    type?: Enumdamagedbooks_typeNullableFilter<"damagedbooks"> | $Enums.damagedbooks_type | null
    book_id?: IntNullableFilter<"damagedbooks"> | number | null
    store_id?: IntNullableFilter<"damagedbooks"> | number | null
    edition_id?: IntNullableFilter<"damagedbooks"> | number | null
    count?: IntNullableFilter<"damagedbooks"> | number | null
    memo?: StringNullableFilter<"damagedbooks"> | string | null
    account_id?: IntNullableFilter<"damagedbooks"> | number | null
    is_deleted?: BoolFilter<"damagedbooks"> | boolean
    updatedAt?: DateTimeFilter<"damagedbooks"> | Date | string
    createdAt?: DateTimeFilter<"damagedbooks"> | Date | string
    deletedAt?: DateTimeFilter<"damagedbooks"> | Date | string
    accounts?: XOR<AccountsNullableScalarRelationFilter, accountsWhereInput> | null
    books?: XOR<BooksNullableScalarRelationFilter, booksWhereInput> | null
    bookedition?: XOR<BookeditionNullableScalarRelationFilter, bookeditionWhereInput> | null
    stores?: XOR<StoresNullableScalarRelationFilter, storesWhereInput> | null
  }, "id">

  export type damagedbooksOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrderInput | SortOrder
    book_id?: SortOrderInput | SortOrder
    store_id?: SortOrderInput | SortOrder
    edition_id?: SortOrderInput | SortOrder
    count?: SortOrderInput | SortOrder
    memo?: SortOrderInput | SortOrder
    account_id?: SortOrderInput | SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    _count?: damagedbooksCountOrderByAggregateInput
    _avg?: damagedbooksAvgOrderByAggregateInput
    _max?: damagedbooksMaxOrderByAggregateInput
    _min?: damagedbooksMinOrderByAggregateInput
    _sum?: damagedbooksSumOrderByAggregateInput
  }

  export type damagedbooksScalarWhereWithAggregatesInput = {
    AND?: damagedbooksScalarWhereWithAggregatesInput | damagedbooksScalarWhereWithAggregatesInput[]
    OR?: damagedbooksScalarWhereWithAggregatesInput[]
    NOT?: damagedbooksScalarWhereWithAggregatesInput | damagedbooksScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"damagedbooks"> | number
    type?: Enumdamagedbooks_typeNullableWithAggregatesFilter<"damagedbooks"> | $Enums.damagedbooks_type | null
    book_id?: IntNullableWithAggregatesFilter<"damagedbooks"> | number | null
    store_id?: IntNullableWithAggregatesFilter<"damagedbooks"> | number | null
    edition_id?: IntNullableWithAggregatesFilter<"damagedbooks"> | number | null
    count?: IntNullableWithAggregatesFilter<"damagedbooks"> | number | null
    memo?: StringNullableWithAggregatesFilter<"damagedbooks"> | string | null
    account_id?: IntNullableWithAggregatesFilter<"damagedbooks"> | number | null
    is_deleted?: BoolWithAggregatesFilter<"damagedbooks"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"damagedbooks"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"damagedbooks"> | Date | string
    deletedAt?: DateTimeWithAggregatesFilter<"damagedbooks"> | Date | string
  }

  export type dashboardmenuWhereInput = {
    AND?: dashboardmenuWhereInput | dashboardmenuWhereInput[]
    OR?: dashboardmenuWhereInput[]
    NOT?: dashboardmenuWhereInput | dashboardmenuWhereInput[]
    id?: IntFilter<"dashboardmenu"> | number
    role?: StringFilter<"dashboardmenu"> | string
    menus?: StringFilter<"dashboardmenu"> | string
    updatedAt?: DateTimeFilter<"dashboardmenu"> | Date | string
    createdAt?: DateTimeFilter<"dashboardmenu"> | Date | string
  }

  export type dashboardmenuOrderByWithRelationInput = {
    id?: SortOrder
    role?: SortOrder
    menus?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    _relevance?: dashboardmenuOrderByRelevanceInput
  }

  export type dashboardmenuWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    role?: string
    AND?: dashboardmenuWhereInput | dashboardmenuWhereInput[]
    OR?: dashboardmenuWhereInput[]
    NOT?: dashboardmenuWhereInput | dashboardmenuWhereInput[]
    menus?: StringFilter<"dashboardmenu"> | string
    updatedAt?: DateTimeFilter<"dashboardmenu"> | Date | string
    createdAt?: DateTimeFilter<"dashboardmenu"> | Date | string
  }, "id" | "role">

  export type dashboardmenuOrderByWithAggregationInput = {
    id?: SortOrder
    role?: SortOrder
    menus?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    _count?: dashboardmenuCountOrderByAggregateInput
    _avg?: dashboardmenuAvgOrderByAggregateInput
    _max?: dashboardmenuMaxOrderByAggregateInput
    _min?: dashboardmenuMinOrderByAggregateInput
    _sum?: dashboardmenuSumOrderByAggregateInput
  }

  export type dashboardmenuScalarWhereWithAggregatesInput = {
    AND?: dashboardmenuScalarWhereWithAggregatesInput | dashboardmenuScalarWhereWithAggregatesInput[]
    OR?: dashboardmenuScalarWhereWithAggregatesInput[]
    NOT?: dashboardmenuScalarWhereWithAggregatesInput | dashboardmenuScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"dashboardmenu"> | number
    role?: StringWithAggregatesFilter<"dashboardmenu"> | string
    menus?: StringWithAggregatesFilter<"dashboardmenu"> | string
    updatedAt?: DateTimeWithAggregatesFilter<"dashboardmenu"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"dashboardmenu"> | Date | string
  }

  export type printerWhereInput = {
    AND?: printerWhereInput | printerWhereInput[]
    OR?: printerWhereInput[]
    NOT?: printerWhereInput | printerWhereInput[]
    id?: IntFilter<"printer"> | number
    name?: StringFilter<"printer"> | string
    location?: StringFilter<"printer"> | string
    phone?: StringNullableFilter<"printer"> | string | null
    email?: StringNullableFilter<"printer"> | string | null
    is_deleted?: BoolFilter<"printer"> | boolean
    updatedAt?: DateTimeFilter<"printer"> | Date | string
    createdAt?: DateTimeFilter<"printer"> | Date | string
    deletedAt?: DateTimeFilter<"printer"> | Date | string
    printorder?: PrintorderListRelationFilter
  }

  export type printerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    location?: SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    printorder?: printorderOrderByRelationAggregateInput
    _relevance?: printerOrderByRelevanceInput
  }

  export type printerWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: printerWhereInput | printerWhereInput[]
    OR?: printerWhereInput[]
    NOT?: printerWhereInput | printerWhereInput[]
    name?: StringFilter<"printer"> | string
    location?: StringFilter<"printer"> | string
    phone?: StringNullableFilter<"printer"> | string | null
    email?: StringNullableFilter<"printer"> | string | null
    is_deleted?: BoolFilter<"printer"> | boolean
    updatedAt?: DateTimeFilter<"printer"> | Date | string
    createdAt?: DateTimeFilter<"printer"> | Date | string
    deletedAt?: DateTimeFilter<"printer"> | Date | string
    printorder?: PrintorderListRelationFilter
  }, "id">

  export type printerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    location?: SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    _count?: printerCountOrderByAggregateInput
    _avg?: printerAvgOrderByAggregateInput
    _max?: printerMaxOrderByAggregateInput
    _min?: printerMinOrderByAggregateInput
    _sum?: printerSumOrderByAggregateInput
  }

  export type printerScalarWhereWithAggregatesInput = {
    AND?: printerScalarWhereWithAggregatesInput | printerScalarWhereWithAggregatesInput[]
    OR?: printerScalarWhereWithAggregatesInput[]
    NOT?: printerScalarWhereWithAggregatesInput | printerScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"printer"> | number
    name?: StringWithAggregatesFilter<"printer"> | string
    location?: StringWithAggregatesFilter<"printer"> | string
    phone?: StringNullableWithAggregatesFilter<"printer"> | string | null
    email?: StringNullableWithAggregatesFilter<"printer"> | string | null
    is_deleted?: BoolWithAggregatesFilter<"printer"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"printer"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"printer"> | Date | string
    deletedAt?: DateTimeWithAggregatesFilter<"printer"> | Date | string
  }

  export type printorderWhereInput = {
    AND?: printorderWhereInput | printorderWhereInput[]
    OR?: printorderWhereInput[]
    NOT?: printorderWhereInput | printorderWhereInput[]
    id?: IntFilter<"printorder"> | number
    quality?: StringFilter<"printorder"> | string
    count?: IntFilter<"printorder"> | number
    status?: Enumprintorder_statusFilter<"printorder"> | $Enums.printorder_status
    memo?: StringNullableFilter<"printorder"> | string | null
    tracking?: Enumprintorder_trackingFilter<"printorder"> | $Enums.printorder_tracking
    startDate?: DateTimeNullableFilter<"printorder"> | Date | string | null
    endDate?: DateTimeNullableFilter<"printorder"> | Date | string | null
    printerId?: IntFilter<"printorder"> | number
    edition?: StringNullableFilter<"printorder"> | string | null
    is_deleted?: BoolFilter<"printorder"> | boolean
    updatedAt?: DateTimeFilter<"printorder"> | Date | string
    createdAt?: DateTimeFilter<"printorder"> | Date | string
    deletedAt?: DateTimeFilter<"printorder"> | Date | string
    printer?: XOR<PrinterScalarRelationFilter, printerWhereInput>
  }

  export type printorderOrderByWithRelationInput = {
    id?: SortOrder
    quality?: SortOrder
    count?: SortOrder
    status?: SortOrder
    memo?: SortOrderInput | SortOrder
    tracking?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    printerId?: SortOrder
    edition?: SortOrderInput | SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    printer?: printerOrderByWithRelationInput
    _relevance?: printorderOrderByRelevanceInput
  }

  export type printorderWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: printorderWhereInput | printorderWhereInput[]
    OR?: printorderWhereInput[]
    NOT?: printorderWhereInput | printorderWhereInput[]
    quality?: StringFilter<"printorder"> | string
    count?: IntFilter<"printorder"> | number
    status?: Enumprintorder_statusFilter<"printorder"> | $Enums.printorder_status
    memo?: StringNullableFilter<"printorder"> | string | null
    tracking?: Enumprintorder_trackingFilter<"printorder"> | $Enums.printorder_tracking
    startDate?: DateTimeNullableFilter<"printorder"> | Date | string | null
    endDate?: DateTimeNullableFilter<"printorder"> | Date | string | null
    printerId?: IntFilter<"printorder"> | number
    edition?: StringNullableFilter<"printorder"> | string | null
    is_deleted?: BoolFilter<"printorder"> | boolean
    updatedAt?: DateTimeFilter<"printorder"> | Date | string
    createdAt?: DateTimeFilter<"printorder"> | Date | string
    deletedAt?: DateTimeFilter<"printorder"> | Date | string
    printer?: XOR<PrinterScalarRelationFilter, printerWhereInput>
  }, "id">

  export type printorderOrderByWithAggregationInput = {
    id?: SortOrder
    quality?: SortOrder
    count?: SortOrder
    status?: SortOrder
    memo?: SortOrderInput | SortOrder
    tracking?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    printerId?: SortOrder
    edition?: SortOrderInput | SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    _count?: printorderCountOrderByAggregateInput
    _avg?: printorderAvgOrderByAggregateInput
    _max?: printorderMaxOrderByAggregateInput
    _min?: printorderMinOrderByAggregateInput
    _sum?: printorderSumOrderByAggregateInput
  }

  export type printorderScalarWhereWithAggregatesInput = {
    AND?: printorderScalarWhereWithAggregatesInput | printorderScalarWhereWithAggregatesInput[]
    OR?: printorderScalarWhereWithAggregatesInput[]
    NOT?: printorderScalarWhereWithAggregatesInput | printorderScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"printorder"> | number
    quality?: StringWithAggregatesFilter<"printorder"> | string
    count?: IntWithAggregatesFilter<"printorder"> | number
    status?: Enumprintorder_statusWithAggregatesFilter<"printorder"> | $Enums.printorder_status
    memo?: StringNullableWithAggregatesFilter<"printorder"> | string | null
    tracking?: Enumprintorder_trackingWithAggregatesFilter<"printorder"> | $Enums.printorder_tracking
    startDate?: DateTimeNullableWithAggregatesFilter<"printorder"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"printorder"> | Date | string | null
    printerId?: IntWithAggregatesFilter<"printorder"> | number
    edition?: StringNullableWithAggregatesFilter<"printorder"> | string | null
    is_deleted?: BoolWithAggregatesFilter<"printorder"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"printorder"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"printorder"> | Date | string
    deletedAt?: DateTimeWithAggregatesFilter<"printorder"> | Date | string
  }

  export type rolesWhereInput = {
    AND?: rolesWhereInput | rolesWhereInput[]
    OR?: rolesWhereInput[]
    NOT?: rolesWhereInput | rolesWhereInput[]
    id?: IntFilter<"roles"> | number
    role_status?: BoolFilter<"roles"> | boolean
    role_name?: StringFilter<"roles"> | string
    accountId?: IntFilter<"roles"> | number
    is_deleted?: BoolFilter<"roles"> | boolean
    updatedAt?: DateTimeFilter<"roles"> | Date | string
    createdAt?: DateTimeFilter<"roles"> | Date | string
    deletedAt?: DateTimeFilter<"roles"> | Date | string
    accounts?: XOR<AccountsScalarRelationFilter, accountsWhereInput>
  }

  export type rolesOrderByWithRelationInput = {
    id?: SortOrder
    role_status?: SortOrder
    role_name?: SortOrder
    accountId?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    accounts?: accountsOrderByWithRelationInput
    _relevance?: rolesOrderByRelevanceInput
  }

  export type rolesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: rolesWhereInput | rolesWhereInput[]
    OR?: rolesWhereInput[]
    NOT?: rolesWhereInput | rolesWhereInput[]
    role_status?: BoolFilter<"roles"> | boolean
    role_name?: StringFilter<"roles"> | string
    accountId?: IntFilter<"roles"> | number
    is_deleted?: BoolFilter<"roles"> | boolean
    updatedAt?: DateTimeFilter<"roles"> | Date | string
    createdAt?: DateTimeFilter<"roles"> | Date | string
    deletedAt?: DateTimeFilter<"roles"> | Date | string
    accounts?: XOR<AccountsScalarRelationFilter, accountsWhereInput>
  }, "id">

  export type rolesOrderByWithAggregationInput = {
    id?: SortOrder
    role_status?: SortOrder
    role_name?: SortOrder
    accountId?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    _count?: rolesCountOrderByAggregateInput
    _avg?: rolesAvgOrderByAggregateInput
    _max?: rolesMaxOrderByAggregateInput
    _min?: rolesMinOrderByAggregateInput
    _sum?: rolesSumOrderByAggregateInput
  }

  export type rolesScalarWhereWithAggregatesInput = {
    AND?: rolesScalarWhereWithAggregatesInput | rolesScalarWhereWithAggregatesInput[]
    OR?: rolesScalarWhereWithAggregatesInput[]
    NOT?: rolesScalarWhereWithAggregatesInput | rolesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"roles"> | number
    role_status?: BoolWithAggregatesFilter<"roles"> | boolean
    role_name?: StringWithAggregatesFilter<"roles"> | string
    accountId?: IntWithAggregatesFilter<"roles"> | number
    is_deleted?: BoolWithAggregatesFilter<"roles"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"roles"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"roles"> | Date | string
    deletedAt?: DateTimeWithAggregatesFilter<"roles"> | Date | string
  }

  export type storesWhereInput = {
    AND?: storesWhereInput | storesWhereInput[]
    OR?: storesWhereInput[]
    NOT?: storesWhereInput | storesWhereInput[]
    id?: IntFilter<"stores"> | number
    name?: StringFilter<"stores"> | string
    location?: StringFilter<"stores"> | string
    phone?: StringNullableFilter<"stores"> | string | null
    email?: StringNullableFilter<"stores"> | string | null
    status?: StringFilter<"stores"> | string
    is_deleted?: BoolFilter<"stores"> | boolean
    updatedAt?: DateTimeFilter<"stores"> | Date | string
    createdAt?: DateTimeFilter<"stores"> | Date | string
    deletedAt?: DateTimeFilter<"stores"> | Date | string
    bookeditionstores?: BookeditionstoresListRelationFilter
    damagedbooks?: DamagedbooksListRelationFilter
  }

  export type storesOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    location?: SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    status?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    bookeditionstores?: bookeditionstoresOrderByRelationAggregateInput
    damagedbooks?: damagedbooksOrderByRelationAggregateInput
    _relevance?: storesOrderByRelevanceInput
  }

  export type storesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: storesWhereInput | storesWhereInput[]
    OR?: storesWhereInput[]
    NOT?: storesWhereInput | storesWhereInput[]
    name?: StringFilter<"stores"> | string
    location?: StringFilter<"stores"> | string
    phone?: StringNullableFilter<"stores"> | string | null
    email?: StringNullableFilter<"stores"> | string | null
    status?: StringFilter<"stores"> | string
    is_deleted?: BoolFilter<"stores"> | boolean
    updatedAt?: DateTimeFilter<"stores"> | Date | string
    createdAt?: DateTimeFilter<"stores"> | Date | string
    deletedAt?: DateTimeFilter<"stores"> | Date | string
    bookeditionstores?: BookeditionstoresListRelationFilter
    damagedbooks?: DamagedbooksListRelationFilter
  }, "id">

  export type storesOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    location?: SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    status?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    _count?: storesCountOrderByAggregateInput
    _avg?: storesAvgOrderByAggregateInput
    _max?: storesMaxOrderByAggregateInput
    _min?: storesMinOrderByAggregateInput
    _sum?: storesSumOrderByAggregateInput
  }

  export type storesScalarWhereWithAggregatesInput = {
    AND?: storesScalarWhereWithAggregatesInput | storesScalarWhereWithAggregatesInput[]
    OR?: storesScalarWhereWithAggregatesInput[]
    NOT?: storesScalarWhereWithAggregatesInput | storesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"stores"> | number
    name?: StringWithAggregatesFilter<"stores"> | string
    location?: StringWithAggregatesFilter<"stores"> | string
    phone?: StringNullableWithAggregatesFilter<"stores"> | string | null
    email?: StringNullableWithAggregatesFilter<"stores"> | string | null
    status?: StringWithAggregatesFilter<"stores"> | string
    is_deleted?: BoolWithAggregatesFilter<"stores"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"stores"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"stores"> | Date | string
    deletedAt?: DateTimeWithAggregatesFilter<"stores"> | Date | string
  }

  export type translatorWhereInput = {
    AND?: translatorWhereInput | translatorWhereInput[]
    OR?: translatorWhereInput[]
    NOT?: translatorWhereInput | translatorWhereInput[]
    id?: IntFilter<"translator"> | number
    name?: StringFilter<"translator"> | string
    phoneNumber?: StringNullableFilter<"translator"> | string | null
    email?: StringNullableFilter<"translator"> | string | null
    is_deleted?: BoolFilter<"translator"> | boolean
    updatedAt?: DateTimeFilter<"translator"> | Date | string
    createdAt?: DateTimeFilter<"translator"> | Date | string
    deletedAt?: DateTimeFilter<"translator"> | Date | string
    translatorbook?: TranslatorbookListRelationFilter
  }

  export type translatorOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    translatorbook?: translatorbookOrderByRelationAggregateInput
    _relevance?: translatorOrderByRelevanceInput
  }

  export type translatorWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: translatorWhereInput | translatorWhereInput[]
    OR?: translatorWhereInput[]
    NOT?: translatorWhereInput | translatorWhereInput[]
    name?: StringFilter<"translator"> | string
    phoneNumber?: StringNullableFilter<"translator"> | string | null
    email?: StringNullableFilter<"translator"> | string | null
    is_deleted?: BoolFilter<"translator"> | boolean
    updatedAt?: DateTimeFilter<"translator"> | Date | string
    createdAt?: DateTimeFilter<"translator"> | Date | string
    deletedAt?: DateTimeFilter<"translator"> | Date | string
    translatorbook?: TranslatorbookListRelationFilter
  }, "id">

  export type translatorOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    _count?: translatorCountOrderByAggregateInput
    _avg?: translatorAvgOrderByAggregateInput
    _max?: translatorMaxOrderByAggregateInput
    _min?: translatorMinOrderByAggregateInput
    _sum?: translatorSumOrderByAggregateInput
  }

  export type translatorScalarWhereWithAggregatesInput = {
    AND?: translatorScalarWhereWithAggregatesInput | translatorScalarWhereWithAggregatesInput[]
    OR?: translatorScalarWhereWithAggregatesInput[]
    NOT?: translatorScalarWhereWithAggregatesInput | translatorScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"translator"> | number
    name?: StringWithAggregatesFilter<"translator"> | string
    phoneNumber?: StringNullableWithAggregatesFilter<"translator"> | string | null
    email?: StringNullableWithAggregatesFilter<"translator"> | string | null
    is_deleted?: BoolWithAggregatesFilter<"translator"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"translator"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"translator"> | Date | string
    deletedAt?: DateTimeWithAggregatesFilter<"translator"> | Date | string
  }

  export type translatorbookWhereInput = {
    AND?: translatorbookWhereInput | translatorbookWhereInput[]
    OR?: translatorbookWhereInput[]
    NOT?: translatorbookWhereInput | translatorbookWhereInput[]
    id?: IntFilter<"translatorbook"> | number
    book_id?: IntNullableFilter<"translatorbook"> | number | null
    bookId?: IntFilter<"translatorbook"> | number
    translator_id?: IntFilter<"translatorbook"> | number
    Status?: Enumtranslatorbook_StatusFilter<"translatorbook"> | $Enums.translatorbook_Status
    startDate?: DateTimeNullableFilter<"translatorbook"> | Date | string | null
    endDate?: DateTimeNullableFilter<"translatorbook"> | Date | string | null
    is_deleted?: BoolFilter<"translatorbook"> | boolean
    updatedAt?: DateTimeFilter<"translatorbook"> | Date | string
    createdAt?: DateTimeFilter<"translatorbook"> | Date | string
    deletedAt?: DateTimeFilter<"translatorbook"> | Date | string
    books?: XOR<BooksScalarRelationFilter, booksWhereInput>
    translator?: XOR<TranslatorScalarRelationFilter, translatorWhereInput>
  }

  export type translatorbookOrderByWithRelationInput = {
    id?: SortOrder
    book_id?: SortOrderInput | SortOrder
    bookId?: SortOrder
    translator_id?: SortOrder
    Status?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    books?: booksOrderByWithRelationInput
    translator?: translatorOrderByWithRelationInput
  }

  export type translatorbookWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: translatorbookWhereInput | translatorbookWhereInput[]
    OR?: translatorbookWhereInput[]
    NOT?: translatorbookWhereInput | translatorbookWhereInput[]
    book_id?: IntNullableFilter<"translatorbook"> | number | null
    bookId?: IntFilter<"translatorbook"> | number
    translator_id?: IntFilter<"translatorbook"> | number
    Status?: Enumtranslatorbook_StatusFilter<"translatorbook"> | $Enums.translatorbook_Status
    startDate?: DateTimeNullableFilter<"translatorbook"> | Date | string | null
    endDate?: DateTimeNullableFilter<"translatorbook"> | Date | string | null
    is_deleted?: BoolFilter<"translatorbook"> | boolean
    updatedAt?: DateTimeFilter<"translatorbook"> | Date | string
    createdAt?: DateTimeFilter<"translatorbook"> | Date | string
    deletedAt?: DateTimeFilter<"translatorbook"> | Date | string
    books?: XOR<BooksScalarRelationFilter, booksWhereInput>
    translator?: XOR<TranslatorScalarRelationFilter, translatorWhereInput>
  }, "id">

  export type translatorbookOrderByWithAggregationInput = {
    id?: SortOrder
    book_id?: SortOrderInput | SortOrder
    bookId?: SortOrder
    translator_id?: SortOrder
    Status?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    _count?: translatorbookCountOrderByAggregateInput
    _avg?: translatorbookAvgOrderByAggregateInput
    _max?: translatorbookMaxOrderByAggregateInput
    _min?: translatorbookMinOrderByAggregateInput
    _sum?: translatorbookSumOrderByAggregateInput
  }

  export type translatorbookScalarWhereWithAggregatesInput = {
    AND?: translatorbookScalarWhereWithAggregatesInput | translatorbookScalarWhereWithAggregatesInput[]
    OR?: translatorbookScalarWhereWithAggregatesInput[]
    NOT?: translatorbookScalarWhereWithAggregatesInput | translatorbookScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"translatorbook"> | number
    book_id?: IntNullableWithAggregatesFilter<"translatorbook"> | number | null
    bookId?: IntWithAggregatesFilter<"translatorbook"> | number
    translator_id?: IntWithAggregatesFilter<"translatorbook"> | number
    Status?: Enumtranslatorbook_StatusWithAggregatesFilter<"translatorbook"> | $Enums.translatorbook_Status
    startDate?: DateTimeNullableWithAggregatesFilter<"translatorbook"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"translatorbook"> | Date | string | null
    is_deleted?: BoolWithAggregatesFilter<"translatorbook"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"translatorbook"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"translatorbook"> | Date | string
    deletedAt?: DateTimeWithAggregatesFilter<"translatorbook"> | Date | string
  }

  export type accountsCreateInput = {
    account_type: string
    account_email: string
    password: string
    account_status?: boolean
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    name?: string
    damagedbooks?: damagedbooksCreateNestedManyWithoutAccountsInput
    roles?: rolesCreateNestedManyWithoutAccountsInput
  }

  export type accountsUncheckedCreateInput = {
    id?: number
    account_type: string
    account_email: string
    password: string
    account_status?: boolean
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    name?: string
    damagedbooks?: damagedbooksUncheckedCreateNestedManyWithoutAccountsInput
    roles?: rolesUncheckedCreateNestedManyWithoutAccountsInput
  }

  export type accountsUpdateInput = {
    account_type?: StringFieldUpdateOperationsInput | string
    account_email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    account_status?: BoolFieldUpdateOperationsInput | boolean
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    damagedbooks?: damagedbooksUpdateManyWithoutAccountsNestedInput
    roles?: rolesUpdateManyWithoutAccountsNestedInput
  }

  export type accountsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    account_type?: StringFieldUpdateOperationsInput | string
    account_email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    account_status?: BoolFieldUpdateOperationsInput | boolean
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    damagedbooks?: damagedbooksUncheckedUpdateManyWithoutAccountsNestedInput
    roles?: rolesUncheckedUpdateManyWithoutAccountsNestedInput
  }

  export type accountsCreateManyInput = {
    id?: number
    account_type: string
    account_email: string
    password: string
    account_status?: boolean
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    name?: string
  }

  export type accountsUpdateManyMutationInput = {
    account_type?: StringFieldUpdateOperationsInput | string
    account_email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    account_status?: BoolFieldUpdateOperationsInput | boolean
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type accountsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    account_type?: StringFieldUpdateOperationsInput | string
    account_email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    account_status?: BoolFieldUpdateOperationsInput | boolean
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type bookeditionCreateInput = {
    edition_name: string
    selling_price?: number | null
    production_price?: number | null
    printing_cost?: number | null
    binding_cost?: number | null
    design_cost?: number | null
    translation_cost?: number | null
    memo?: string | null
    book_image_url?: string | null
    total_print_count?: number | null
    book_id?: number | null
    number_of_pages?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    editing_cost?: number | null
    other_expenses?: number | null
    transportation_cost?: number | null
    books: booksCreateNestedOneWithoutBookeditionInput
    bookeditionstores?: bookeditionstoresCreateNestedManyWithoutBookeditionInput
    bookshopeditions?: bookshopeditionsCreateNestedManyWithoutBookeditionInput
    damagedbooks?: damagedbooksCreateNestedManyWithoutBookeditionInput
  }

  export type bookeditionUncheckedCreateInput = {
    id?: number
    edition_name: string
    selling_price?: number | null
    production_price?: number | null
    printing_cost?: number | null
    binding_cost?: number | null
    design_cost?: number | null
    translation_cost?: number | null
    memo?: string | null
    book_image_url?: string | null
    total_print_count?: number | null
    book_id?: number | null
    number_of_pages?: number | null
    bookId: number
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    editing_cost?: number | null
    other_expenses?: number | null
    transportation_cost?: number | null
    bookeditionstores?: bookeditionstoresUncheckedCreateNestedManyWithoutBookeditionInput
    bookshopeditions?: bookshopeditionsUncheckedCreateNestedManyWithoutBookeditionInput
    damagedbooks?: damagedbooksUncheckedCreateNestedManyWithoutBookeditionInput
  }

  export type bookeditionUpdateInput = {
    edition_name?: StringFieldUpdateOperationsInput | string
    selling_price?: NullableFloatFieldUpdateOperationsInput | number | null
    production_price?: NullableFloatFieldUpdateOperationsInput | number | null
    printing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    binding_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    translation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    total_print_count?: NullableIntFieldUpdateOperationsInput | number | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    other_expenses?: NullableFloatFieldUpdateOperationsInput | number | null
    transportation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    books?: booksUpdateOneRequiredWithoutBookeditionNestedInput
    bookeditionstores?: bookeditionstoresUpdateManyWithoutBookeditionNestedInput
    bookshopeditions?: bookshopeditionsUpdateManyWithoutBookeditionNestedInput
    damagedbooks?: damagedbooksUpdateManyWithoutBookeditionNestedInput
  }

  export type bookeditionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    edition_name?: StringFieldUpdateOperationsInput | string
    selling_price?: NullableFloatFieldUpdateOperationsInput | number | null
    production_price?: NullableFloatFieldUpdateOperationsInput | number | null
    printing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    binding_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    translation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    total_print_count?: NullableIntFieldUpdateOperationsInput | number | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    bookId?: IntFieldUpdateOperationsInput | number
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    other_expenses?: NullableFloatFieldUpdateOperationsInput | number | null
    transportation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    bookeditionstores?: bookeditionstoresUncheckedUpdateManyWithoutBookeditionNestedInput
    bookshopeditions?: bookshopeditionsUncheckedUpdateManyWithoutBookeditionNestedInput
    damagedbooks?: damagedbooksUncheckedUpdateManyWithoutBookeditionNestedInput
  }

  export type bookeditionCreateManyInput = {
    id?: number
    edition_name: string
    selling_price?: number | null
    production_price?: number | null
    printing_cost?: number | null
    binding_cost?: number | null
    design_cost?: number | null
    translation_cost?: number | null
    memo?: string | null
    book_image_url?: string | null
    total_print_count?: number | null
    book_id?: number | null
    number_of_pages?: number | null
    bookId: number
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    editing_cost?: number | null
    other_expenses?: number | null
    transportation_cost?: number | null
  }

  export type bookeditionUpdateManyMutationInput = {
    edition_name?: StringFieldUpdateOperationsInput | string
    selling_price?: NullableFloatFieldUpdateOperationsInput | number | null
    production_price?: NullableFloatFieldUpdateOperationsInput | number | null
    printing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    binding_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    translation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    total_print_count?: NullableIntFieldUpdateOperationsInput | number | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    other_expenses?: NullableFloatFieldUpdateOperationsInput | number | null
    transportation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type bookeditionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    edition_name?: StringFieldUpdateOperationsInput | string
    selling_price?: NullableFloatFieldUpdateOperationsInput | number | null
    production_price?: NullableFloatFieldUpdateOperationsInput | number | null
    printing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    binding_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    translation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    total_print_count?: NullableIntFieldUpdateOperationsInput | number | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    bookId?: IntFieldUpdateOperationsInput | number
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    other_expenses?: NullableFloatFieldUpdateOperationsInput | number | null
    transportation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type bookeditionstoresCreateInput = {
    quantity?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    bookedition: bookeditionCreateNestedOneWithoutBookeditionstoresInput
    stores: storesCreateNestedOneWithoutBookeditionstoresInput
  }

  export type bookeditionstoresUncheckedCreateInput = {
    id?: number
    editionId: number
    quantity?: number | null
    storeId: number
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type bookeditionstoresUpdateInput = {
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookedition?: bookeditionUpdateOneRequiredWithoutBookeditionstoresNestedInput
    stores?: storesUpdateOneRequiredWithoutBookeditionstoresNestedInput
  }

  export type bookeditionstoresUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    editionId?: IntFieldUpdateOperationsInput | number
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    storeId?: IntFieldUpdateOperationsInput | number
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bookeditionstoresCreateManyInput = {
    id?: number
    editionId: number
    quantity?: number | null
    storeId: number
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type bookeditionstoresUpdateManyMutationInput = {
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bookeditionstoresUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    editionId?: IntFieldUpdateOperationsInput | number
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    storeId?: IntFieldUpdateOperationsInput | number
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type booksCreateInput = {
    unique_identification_code: string
    isbn?: string | null
    title: string
    author: string
    translator?: string | null
    designer?: string | null
    language: string
    edition: string
    category: string
    publication_year: string
    print_batch_id?: string | null
    book_sku: string
    number_of_pages?: number | null
    info?: string | null
    book_image_url?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    productionstatus?: $Enums.books_productionstatus | null
    default_edition_id?: string | null
    bookedition?: bookeditionCreateNestedManyWithoutBooksInput
    damagedbooks?: damagedbooksCreateNestedManyWithoutBooksInput
    translatorbook?: translatorbookCreateNestedManyWithoutBooksInput
  }

  export type booksUncheckedCreateInput = {
    id?: number
    unique_identification_code: string
    isbn?: string | null
    title: string
    author: string
    translator?: string | null
    designer?: string | null
    language: string
    edition: string
    category: string
    publication_year: string
    print_batch_id?: string | null
    book_sku: string
    number_of_pages?: number | null
    info?: string | null
    book_image_url?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    productionstatus?: $Enums.books_productionstatus | null
    default_edition_id?: string | null
    bookedition?: bookeditionUncheckedCreateNestedManyWithoutBooksInput
    damagedbooks?: damagedbooksUncheckedCreateNestedManyWithoutBooksInput
    translatorbook?: translatorbookUncheckedCreateNestedManyWithoutBooksInput
  }

  export type booksUpdateInput = {
    unique_identification_code?: StringFieldUpdateOperationsInput | string
    isbn?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    translator?: NullableStringFieldUpdateOperationsInput | string | null
    designer?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    edition?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    publication_year?: StringFieldUpdateOperationsInput | string
    print_batch_id?: NullableStringFieldUpdateOperationsInput | string | null
    book_sku?: StringFieldUpdateOperationsInput | string
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    info?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    productionstatus?: NullableEnumbooks_productionstatusFieldUpdateOperationsInput | $Enums.books_productionstatus | null
    default_edition_id?: NullableStringFieldUpdateOperationsInput | string | null
    bookedition?: bookeditionUpdateManyWithoutBooksNestedInput
    damagedbooks?: damagedbooksUpdateManyWithoutBooksNestedInput
    translatorbook?: translatorbookUpdateManyWithoutBooksNestedInput
  }

  export type booksUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    unique_identification_code?: StringFieldUpdateOperationsInput | string
    isbn?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    translator?: NullableStringFieldUpdateOperationsInput | string | null
    designer?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    edition?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    publication_year?: StringFieldUpdateOperationsInput | string
    print_batch_id?: NullableStringFieldUpdateOperationsInput | string | null
    book_sku?: StringFieldUpdateOperationsInput | string
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    info?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    productionstatus?: NullableEnumbooks_productionstatusFieldUpdateOperationsInput | $Enums.books_productionstatus | null
    default_edition_id?: NullableStringFieldUpdateOperationsInput | string | null
    bookedition?: bookeditionUncheckedUpdateManyWithoutBooksNestedInput
    damagedbooks?: damagedbooksUncheckedUpdateManyWithoutBooksNestedInput
    translatorbook?: translatorbookUncheckedUpdateManyWithoutBooksNestedInput
  }

  export type booksCreateManyInput = {
    id?: number
    unique_identification_code: string
    isbn?: string | null
    title: string
    author: string
    translator?: string | null
    designer?: string | null
    language: string
    edition: string
    category: string
    publication_year: string
    print_batch_id?: string | null
    book_sku: string
    number_of_pages?: number | null
    info?: string | null
    book_image_url?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    productionstatus?: $Enums.books_productionstatus | null
    default_edition_id?: string | null
  }

  export type booksUpdateManyMutationInput = {
    unique_identification_code?: StringFieldUpdateOperationsInput | string
    isbn?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    translator?: NullableStringFieldUpdateOperationsInput | string | null
    designer?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    edition?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    publication_year?: StringFieldUpdateOperationsInput | string
    print_batch_id?: NullableStringFieldUpdateOperationsInput | string | null
    book_sku?: StringFieldUpdateOperationsInput | string
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    info?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    productionstatus?: NullableEnumbooks_productionstatusFieldUpdateOperationsInput | $Enums.books_productionstatus | null
    default_edition_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type booksUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    unique_identification_code?: StringFieldUpdateOperationsInput | string
    isbn?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    translator?: NullableStringFieldUpdateOperationsInput | string | null
    designer?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    edition?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    publication_year?: StringFieldUpdateOperationsInput | string
    print_batch_id?: NullableStringFieldUpdateOperationsInput | string | null
    book_sku?: StringFieldUpdateOperationsInput | string
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    info?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    productionstatus?: NullableEnumbooks_productionstatusFieldUpdateOperationsInput | $Enums.books_productionstatus | null
    default_edition_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type bookshopeditionsCreateInput = {
    quantity?: number
    price_per_peice?: number | null
    total_price?: number | null
    memo?: string | null
    already_paid?: number | null
    remaining_amount?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    bookedition: bookeditionCreateNestedOneWithoutBookshopeditionsInput
    bookshopes: bookshopesCreateNestedOneWithoutBookshopeditionsInput
  }

  export type bookshopeditionsUncheckedCreateInput = {
    id?: number
    bookShopId: number
    bookEditionId: number
    quantity?: number
    price_per_peice?: number | null
    total_price?: number | null
    memo?: string | null
    already_paid?: number | null
    remaining_amount?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type bookshopeditionsUpdateInput = {
    quantity?: IntFieldUpdateOperationsInput | number
    price_per_peice?: NullableFloatFieldUpdateOperationsInput | number | null
    total_price?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    already_paid?: NullableFloatFieldUpdateOperationsInput | number | null
    remaining_amount?: NullableFloatFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookedition?: bookeditionUpdateOneRequiredWithoutBookshopeditionsNestedInput
    bookshopes?: bookshopesUpdateOneRequiredWithoutBookshopeditionsNestedInput
  }

  export type bookshopeditionsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    bookShopId?: IntFieldUpdateOperationsInput | number
    bookEditionId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    price_per_peice?: NullableFloatFieldUpdateOperationsInput | number | null
    total_price?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    already_paid?: NullableFloatFieldUpdateOperationsInput | number | null
    remaining_amount?: NullableFloatFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bookshopeditionsCreateManyInput = {
    id?: number
    bookShopId: number
    bookEditionId: number
    quantity?: number
    price_per_peice?: number | null
    total_price?: number | null
    memo?: string | null
    already_paid?: number | null
    remaining_amount?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type bookshopeditionsUpdateManyMutationInput = {
    quantity?: IntFieldUpdateOperationsInput | number
    price_per_peice?: NullableFloatFieldUpdateOperationsInput | number | null
    total_price?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    already_paid?: NullableFloatFieldUpdateOperationsInput | number | null
    remaining_amount?: NullableFloatFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bookshopeditionsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    bookShopId?: IntFieldUpdateOperationsInput | number
    bookEditionId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    price_per_peice?: NullableFloatFieldUpdateOperationsInput | number | null
    total_price?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    already_paid?: NullableFloatFieldUpdateOperationsInput | number | null
    remaining_amount?: NullableFloatFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bookshopesCreateInput = {
    name: string
    location: string
    branch?: string | null
    phone?: string | null
    email?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    bookshopeditions?: bookshopeditionsCreateNestedManyWithoutBookshopesInput
  }

  export type bookshopesUncheckedCreateInput = {
    id?: number
    name: string
    location: string
    branch?: string | null
    phone?: string | null
    email?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    bookshopeditions?: bookshopeditionsUncheckedCreateNestedManyWithoutBookshopesInput
  }

  export type bookshopesUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    branch?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookshopeditions?: bookshopeditionsUpdateManyWithoutBookshopesNestedInput
  }

  export type bookshopesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    branch?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookshopeditions?: bookshopeditionsUncheckedUpdateManyWithoutBookshopesNestedInput
  }

  export type bookshopesCreateManyInput = {
    id?: number
    name: string
    location: string
    branch?: string | null
    phone?: string | null
    email?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type bookshopesUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    branch?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bookshopesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    branch?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type damagedbooksCreateInput = {
    type?: $Enums.damagedbooks_type | null
    count?: number | null
    memo?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    accounts?: accountsCreateNestedOneWithoutDamagedbooksInput
    books?: booksCreateNestedOneWithoutDamagedbooksInput
    bookedition?: bookeditionCreateNestedOneWithoutDamagedbooksInput
    stores?: storesCreateNestedOneWithoutDamagedbooksInput
  }

  export type damagedbooksUncheckedCreateInput = {
    id?: number
    type?: $Enums.damagedbooks_type | null
    book_id?: number | null
    store_id?: number | null
    edition_id?: number | null
    count?: number | null
    memo?: string | null
    account_id?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type damagedbooksUpdateInput = {
    type?: NullableEnumdamagedbooks_typeFieldUpdateOperationsInput | $Enums.damagedbooks_type | null
    count?: NullableIntFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: accountsUpdateOneWithoutDamagedbooksNestedInput
    books?: booksUpdateOneWithoutDamagedbooksNestedInput
    bookedition?: bookeditionUpdateOneWithoutDamagedbooksNestedInput
    stores?: storesUpdateOneWithoutDamagedbooksNestedInput
  }

  export type damagedbooksUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: NullableEnumdamagedbooks_typeFieldUpdateOperationsInput | $Enums.damagedbooks_type | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    store_id?: NullableIntFieldUpdateOperationsInput | number | null
    edition_id?: NullableIntFieldUpdateOperationsInput | number | null
    count?: NullableIntFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    account_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type damagedbooksCreateManyInput = {
    id?: number
    type?: $Enums.damagedbooks_type | null
    book_id?: number | null
    store_id?: number | null
    edition_id?: number | null
    count?: number | null
    memo?: string | null
    account_id?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type damagedbooksUpdateManyMutationInput = {
    type?: NullableEnumdamagedbooks_typeFieldUpdateOperationsInput | $Enums.damagedbooks_type | null
    count?: NullableIntFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type damagedbooksUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: NullableEnumdamagedbooks_typeFieldUpdateOperationsInput | $Enums.damagedbooks_type | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    store_id?: NullableIntFieldUpdateOperationsInput | number | null
    edition_id?: NullableIntFieldUpdateOperationsInput | number | null
    count?: NullableIntFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    account_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type dashboardmenuCreateInput = {
    role: string
    menus: string
    updatedAt: Date | string
    createdAt?: Date | string
  }

  export type dashboardmenuUncheckedCreateInput = {
    id?: number
    role: string
    menus: string
    updatedAt: Date | string
    createdAt?: Date | string
  }

  export type dashboardmenuUpdateInput = {
    role?: StringFieldUpdateOperationsInput | string
    menus?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type dashboardmenuUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    menus?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type dashboardmenuCreateManyInput = {
    id?: number
    role: string
    menus: string
    updatedAt: Date | string
    createdAt?: Date | string
  }

  export type dashboardmenuUpdateManyMutationInput = {
    role?: StringFieldUpdateOperationsInput | string
    menus?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type dashboardmenuUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    menus?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type printerCreateInput = {
    name: string
    location: string
    phone?: string | null
    email?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    printorder?: printorderCreateNestedManyWithoutPrinterInput
  }

  export type printerUncheckedCreateInput = {
    id?: number
    name: string
    location: string
    phone?: string | null
    email?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    printorder?: printorderUncheckedCreateNestedManyWithoutPrinterInput
  }

  export type printerUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    printorder?: printorderUpdateManyWithoutPrinterNestedInput
  }

  export type printerUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    printorder?: printorderUncheckedUpdateManyWithoutPrinterNestedInput
  }

  export type printerCreateManyInput = {
    id?: number
    name: string
    location: string
    phone?: string | null
    email?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type printerUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type printerUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type printorderCreateInput = {
    quality: string
    count: number
    status?: $Enums.printorder_status
    memo?: string | null
    tracking?: $Enums.printorder_tracking
    startDate?: Date | string | null
    endDate?: Date | string | null
    edition?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    printer: printerCreateNestedOneWithoutPrintorderInput
  }

  export type printorderUncheckedCreateInput = {
    id?: number
    quality: string
    count: number
    status?: $Enums.printorder_status
    memo?: string | null
    tracking?: $Enums.printorder_tracking
    startDate?: Date | string | null
    endDate?: Date | string | null
    printerId: number
    edition?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type printorderUpdateInput = {
    quality?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    status?: Enumprintorder_statusFieldUpdateOperationsInput | $Enums.printorder_status
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    tracking?: Enumprintorder_trackingFieldUpdateOperationsInput | $Enums.printorder_tracking
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    edition?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    printer?: printerUpdateOneRequiredWithoutPrintorderNestedInput
  }

  export type printorderUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    quality?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    status?: Enumprintorder_statusFieldUpdateOperationsInput | $Enums.printorder_status
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    tracking?: Enumprintorder_trackingFieldUpdateOperationsInput | $Enums.printorder_tracking
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    printerId?: IntFieldUpdateOperationsInput | number
    edition?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type printorderCreateManyInput = {
    id?: number
    quality: string
    count: number
    status?: $Enums.printorder_status
    memo?: string | null
    tracking?: $Enums.printorder_tracking
    startDate?: Date | string | null
    endDate?: Date | string | null
    printerId: number
    edition?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type printorderUpdateManyMutationInput = {
    quality?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    status?: Enumprintorder_statusFieldUpdateOperationsInput | $Enums.printorder_status
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    tracking?: Enumprintorder_trackingFieldUpdateOperationsInput | $Enums.printorder_tracking
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    edition?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type printorderUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    quality?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    status?: Enumprintorder_statusFieldUpdateOperationsInput | $Enums.printorder_status
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    tracking?: Enumprintorder_trackingFieldUpdateOperationsInput | $Enums.printorder_tracking
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    printerId?: IntFieldUpdateOperationsInput | number
    edition?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type rolesCreateInput = {
    role_status?: boolean
    role_name: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    accounts: accountsCreateNestedOneWithoutRolesInput
  }

  export type rolesUncheckedCreateInput = {
    id?: number
    role_status?: boolean
    role_name: string
    accountId: number
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type rolesUpdateInput = {
    role_status?: BoolFieldUpdateOperationsInput | boolean
    role_name?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: accountsUpdateOneRequiredWithoutRolesNestedInput
  }

  export type rolesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    role_status?: BoolFieldUpdateOperationsInput | boolean
    role_name?: StringFieldUpdateOperationsInput | string
    accountId?: IntFieldUpdateOperationsInput | number
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type rolesCreateManyInput = {
    id?: number
    role_status?: boolean
    role_name: string
    accountId: number
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type rolesUpdateManyMutationInput = {
    role_status?: BoolFieldUpdateOperationsInput | boolean
    role_name?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type rolesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    role_status?: BoolFieldUpdateOperationsInput | boolean
    role_name?: StringFieldUpdateOperationsInput | string
    accountId?: IntFieldUpdateOperationsInput | number
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type storesCreateInput = {
    name: string
    location: string
    phone?: string | null
    email?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    bookeditionstores?: bookeditionstoresCreateNestedManyWithoutStoresInput
    damagedbooks?: damagedbooksCreateNestedManyWithoutStoresInput
  }

  export type storesUncheckedCreateInput = {
    id?: number
    name: string
    location: string
    phone?: string | null
    email?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    bookeditionstores?: bookeditionstoresUncheckedCreateNestedManyWithoutStoresInput
    damagedbooks?: damagedbooksUncheckedCreateNestedManyWithoutStoresInput
  }

  export type storesUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookeditionstores?: bookeditionstoresUpdateManyWithoutStoresNestedInput
    damagedbooks?: damagedbooksUpdateManyWithoutStoresNestedInput
  }

  export type storesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookeditionstores?: bookeditionstoresUncheckedUpdateManyWithoutStoresNestedInput
    damagedbooks?: damagedbooksUncheckedUpdateManyWithoutStoresNestedInput
  }

  export type storesCreateManyInput = {
    id?: number
    name: string
    location: string
    phone?: string | null
    email?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type storesUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type storesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type translatorCreateInput = {
    name: string
    phoneNumber?: string | null
    email?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    translatorbook?: translatorbookCreateNestedManyWithoutTranslatorInput
  }

  export type translatorUncheckedCreateInput = {
    id?: number
    name: string
    phoneNumber?: string | null
    email?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    translatorbook?: translatorbookUncheckedCreateNestedManyWithoutTranslatorInput
  }

  export type translatorUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    translatorbook?: translatorbookUpdateManyWithoutTranslatorNestedInput
  }

  export type translatorUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    translatorbook?: translatorbookUncheckedUpdateManyWithoutTranslatorNestedInput
  }

  export type translatorCreateManyInput = {
    id?: number
    name: string
    phoneNumber?: string | null
    email?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type translatorUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type translatorUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type translatorbookCreateInput = {
    book_id?: number | null
    Status?: $Enums.translatorbook_Status
    startDate?: Date | string | null
    endDate?: Date | string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    books: booksCreateNestedOneWithoutTranslatorbookInput
    translator: translatorCreateNestedOneWithoutTranslatorbookInput
  }

  export type translatorbookUncheckedCreateInput = {
    id?: number
    book_id?: number | null
    bookId: number
    translator_id: number
    Status?: $Enums.translatorbook_Status
    startDate?: Date | string | null
    endDate?: Date | string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type translatorbookUpdateInput = {
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    Status?: Enumtranslatorbook_StatusFieldUpdateOperationsInput | $Enums.translatorbook_Status
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    books?: booksUpdateOneRequiredWithoutTranslatorbookNestedInput
    translator?: translatorUpdateOneRequiredWithoutTranslatorbookNestedInput
  }

  export type translatorbookUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    bookId?: IntFieldUpdateOperationsInput | number
    translator_id?: IntFieldUpdateOperationsInput | number
    Status?: Enumtranslatorbook_StatusFieldUpdateOperationsInput | $Enums.translatorbook_Status
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type translatorbookCreateManyInput = {
    id?: number
    book_id?: number | null
    bookId: number
    translator_id: number
    Status?: $Enums.translatorbook_Status
    startDate?: Date | string | null
    endDate?: Date | string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type translatorbookUpdateManyMutationInput = {
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    Status?: Enumtranslatorbook_StatusFieldUpdateOperationsInput | $Enums.translatorbook_Status
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type translatorbookUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    bookId?: IntFieldUpdateOperationsInput | number
    translator_id?: IntFieldUpdateOperationsInput | number
    Status?: Enumtranslatorbook_StatusFieldUpdateOperationsInput | $Enums.translatorbook_Status
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DamagedbooksListRelationFilter = {
    every?: damagedbooksWhereInput
    some?: damagedbooksWhereInput
    none?: damagedbooksWhereInput
  }

  export type RolesListRelationFilter = {
    every?: rolesWhereInput
    some?: rolesWhereInput
    none?: rolesWhereInput
  }

  export type damagedbooksOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type rolesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type accountsOrderByRelevanceInput = {
    fields: accountsOrderByRelevanceFieldEnum | accountsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type accountsCountOrderByAggregateInput = {
    id?: SortOrder
    account_type?: SortOrder
    account_email?: SortOrder
    password?: SortOrder
    account_status?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    name?: SortOrder
  }

  export type accountsAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type accountsMaxOrderByAggregateInput = {
    id?: SortOrder
    account_type?: SortOrder
    account_email?: SortOrder
    password?: SortOrder
    account_status?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    name?: SortOrder
  }

  export type accountsMinOrderByAggregateInput = {
    id?: SortOrder
    account_type?: SortOrder
    account_email?: SortOrder
    password?: SortOrder
    account_status?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    name?: SortOrder
  }

  export type accountsSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BooksScalarRelationFilter = {
    is?: booksWhereInput
    isNot?: booksWhereInput
  }

  export type BookeditionstoresListRelationFilter = {
    every?: bookeditionstoresWhereInput
    some?: bookeditionstoresWhereInput
    none?: bookeditionstoresWhereInput
  }

  export type BookshopeditionsListRelationFilter = {
    every?: bookshopeditionsWhereInput
    some?: bookshopeditionsWhereInput
    none?: bookshopeditionsWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type bookeditionstoresOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type bookshopeditionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type bookeditionOrderByRelevanceInput = {
    fields: bookeditionOrderByRelevanceFieldEnum | bookeditionOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type bookeditionCountOrderByAggregateInput = {
    id?: SortOrder
    edition_name?: SortOrder
    selling_price?: SortOrder
    production_price?: SortOrder
    printing_cost?: SortOrder
    binding_cost?: SortOrder
    design_cost?: SortOrder
    translation_cost?: SortOrder
    memo?: SortOrder
    book_image_url?: SortOrder
    total_print_count?: SortOrder
    book_id?: SortOrder
    number_of_pages?: SortOrder
    bookId?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    editing_cost?: SortOrder
    other_expenses?: SortOrder
    transportation_cost?: SortOrder
  }

  export type bookeditionAvgOrderByAggregateInput = {
    id?: SortOrder
    selling_price?: SortOrder
    production_price?: SortOrder
    printing_cost?: SortOrder
    binding_cost?: SortOrder
    design_cost?: SortOrder
    translation_cost?: SortOrder
    total_print_count?: SortOrder
    book_id?: SortOrder
    number_of_pages?: SortOrder
    bookId?: SortOrder
    editing_cost?: SortOrder
    other_expenses?: SortOrder
    transportation_cost?: SortOrder
  }

  export type bookeditionMaxOrderByAggregateInput = {
    id?: SortOrder
    edition_name?: SortOrder
    selling_price?: SortOrder
    production_price?: SortOrder
    printing_cost?: SortOrder
    binding_cost?: SortOrder
    design_cost?: SortOrder
    translation_cost?: SortOrder
    memo?: SortOrder
    book_image_url?: SortOrder
    total_print_count?: SortOrder
    book_id?: SortOrder
    number_of_pages?: SortOrder
    bookId?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    editing_cost?: SortOrder
    other_expenses?: SortOrder
    transportation_cost?: SortOrder
  }

  export type bookeditionMinOrderByAggregateInput = {
    id?: SortOrder
    edition_name?: SortOrder
    selling_price?: SortOrder
    production_price?: SortOrder
    printing_cost?: SortOrder
    binding_cost?: SortOrder
    design_cost?: SortOrder
    translation_cost?: SortOrder
    memo?: SortOrder
    book_image_url?: SortOrder
    total_print_count?: SortOrder
    book_id?: SortOrder
    number_of_pages?: SortOrder
    bookId?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    editing_cost?: SortOrder
    other_expenses?: SortOrder
    transportation_cost?: SortOrder
  }

  export type bookeditionSumOrderByAggregateInput = {
    id?: SortOrder
    selling_price?: SortOrder
    production_price?: SortOrder
    printing_cost?: SortOrder
    binding_cost?: SortOrder
    design_cost?: SortOrder
    translation_cost?: SortOrder
    total_print_count?: SortOrder
    book_id?: SortOrder
    number_of_pages?: SortOrder
    bookId?: SortOrder
    editing_cost?: SortOrder
    other_expenses?: SortOrder
    transportation_cost?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BookeditionScalarRelationFilter = {
    is?: bookeditionWhereInput
    isNot?: bookeditionWhereInput
  }

  export type StoresScalarRelationFilter = {
    is?: storesWhereInput
    isNot?: storesWhereInput
  }

  export type bookeditionstoresCountOrderByAggregateInput = {
    id?: SortOrder
    editionId?: SortOrder
    quantity?: SortOrder
    storeId?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type bookeditionstoresAvgOrderByAggregateInput = {
    id?: SortOrder
    editionId?: SortOrder
    quantity?: SortOrder
    storeId?: SortOrder
  }

  export type bookeditionstoresMaxOrderByAggregateInput = {
    id?: SortOrder
    editionId?: SortOrder
    quantity?: SortOrder
    storeId?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type bookeditionstoresMinOrderByAggregateInput = {
    id?: SortOrder
    editionId?: SortOrder
    quantity?: SortOrder
    storeId?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type bookeditionstoresSumOrderByAggregateInput = {
    id?: SortOrder
    editionId?: SortOrder
    quantity?: SortOrder
    storeId?: SortOrder
  }

  export type Enumbooks_productionstatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.books_productionstatus | Enumbooks_productionstatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.books_productionstatus[] | null
    notIn?: $Enums.books_productionstatus[] | null
    not?: NestedEnumbooks_productionstatusNullableFilter<$PrismaModel> | $Enums.books_productionstatus | null
  }

  export type BookeditionListRelationFilter = {
    every?: bookeditionWhereInput
    some?: bookeditionWhereInput
    none?: bookeditionWhereInput
  }

  export type TranslatorbookListRelationFilter = {
    every?: translatorbookWhereInput
    some?: translatorbookWhereInput
    none?: translatorbookWhereInput
  }

  export type bookeditionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type translatorbookOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type booksOrderByRelevanceInput = {
    fields: booksOrderByRelevanceFieldEnum | booksOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type booksCountOrderByAggregateInput = {
    id?: SortOrder
    unique_identification_code?: SortOrder
    isbn?: SortOrder
    title?: SortOrder
    author?: SortOrder
    translator?: SortOrder
    designer?: SortOrder
    language?: SortOrder
    edition?: SortOrder
    category?: SortOrder
    publication_year?: SortOrder
    print_batch_id?: SortOrder
    book_sku?: SortOrder
    number_of_pages?: SortOrder
    info?: SortOrder
    book_image_url?: SortOrder
    status?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    productionstatus?: SortOrder
    default_edition_id?: SortOrder
  }

  export type booksAvgOrderByAggregateInput = {
    id?: SortOrder
    number_of_pages?: SortOrder
  }

  export type booksMaxOrderByAggregateInput = {
    id?: SortOrder
    unique_identification_code?: SortOrder
    isbn?: SortOrder
    title?: SortOrder
    author?: SortOrder
    translator?: SortOrder
    designer?: SortOrder
    language?: SortOrder
    edition?: SortOrder
    category?: SortOrder
    publication_year?: SortOrder
    print_batch_id?: SortOrder
    book_sku?: SortOrder
    number_of_pages?: SortOrder
    info?: SortOrder
    book_image_url?: SortOrder
    status?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    productionstatus?: SortOrder
    default_edition_id?: SortOrder
  }

  export type booksMinOrderByAggregateInput = {
    id?: SortOrder
    unique_identification_code?: SortOrder
    isbn?: SortOrder
    title?: SortOrder
    author?: SortOrder
    translator?: SortOrder
    designer?: SortOrder
    language?: SortOrder
    edition?: SortOrder
    category?: SortOrder
    publication_year?: SortOrder
    print_batch_id?: SortOrder
    book_sku?: SortOrder
    number_of_pages?: SortOrder
    info?: SortOrder
    book_image_url?: SortOrder
    status?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    productionstatus?: SortOrder
    default_edition_id?: SortOrder
  }

  export type booksSumOrderByAggregateInput = {
    id?: SortOrder
    number_of_pages?: SortOrder
  }

  export type Enumbooks_productionstatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.books_productionstatus | Enumbooks_productionstatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.books_productionstatus[] | null
    notIn?: $Enums.books_productionstatus[] | null
    not?: NestedEnumbooks_productionstatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.books_productionstatus | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumbooks_productionstatusNullableFilter<$PrismaModel>
    _max?: NestedEnumbooks_productionstatusNullableFilter<$PrismaModel>
  }

  export type BookshopesScalarRelationFilter = {
    is?: bookshopesWhereInput
    isNot?: bookshopesWhereInput
  }

  export type bookshopeditionsOrderByRelevanceInput = {
    fields: bookshopeditionsOrderByRelevanceFieldEnum | bookshopeditionsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type bookshopeditionsCountOrderByAggregateInput = {
    id?: SortOrder
    bookShopId?: SortOrder
    bookEditionId?: SortOrder
    quantity?: SortOrder
    price_per_peice?: SortOrder
    total_price?: SortOrder
    memo?: SortOrder
    already_paid?: SortOrder
    remaining_amount?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type bookshopeditionsAvgOrderByAggregateInput = {
    id?: SortOrder
    bookShopId?: SortOrder
    bookEditionId?: SortOrder
    quantity?: SortOrder
    price_per_peice?: SortOrder
    total_price?: SortOrder
    already_paid?: SortOrder
    remaining_amount?: SortOrder
  }

  export type bookshopeditionsMaxOrderByAggregateInput = {
    id?: SortOrder
    bookShopId?: SortOrder
    bookEditionId?: SortOrder
    quantity?: SortOrder
    price_per_peice?: SortOrder
    total_price?: SortOrder
    memo?: SortOrder
    already_paid?: SortOrder
    remaining_amount?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type bookshopeditionsMinOrderByAggregateInput = {
    id?: SortOrder
    bookShopId?: SortOrder
    bookEditionId?: SortOrder
    quantity?: SortOrder
    price_per_peice?: SortOrder
    total_price?: SortOrder
    memo?: SortOrder
    already_paid?: SortOrder
    remaining_amount?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type bookshopeditionsSumOrderByAggregateInput = {
    id?: SortOrder
    bookShopId?: SortOrder
    bookEditionId?: SortOrder
    quantity?: SortOrder
    price_per_peice?: SortOrder
    total_price?: SortOrder
    already_paid?: SortOrder
    remaining_amount?: SortOrder
  }

  export type bookshopesOrderByRelevanceInput = {
    fields: bookshopesOrderByRelevanceFieldEnum | bookshopesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type bookshopesCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    location?: SortOrder
    branch?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type bookshopesAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type bookshopesMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    location?: SortOrder
    branch?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type bookshopesMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    location?: SortOrder
    branch?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type bookshopesSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type Enumdamagedbooks_typeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.damagedbooks_type | Enumdamagedbooks_typeFieldRefInput<$PrismaModel> | null
    in?: $Enums.damagedbooks_type[] | null
    notIn?: $Enums.damagedbooks_type[] | null
    not?: NestedEnumdamagedbooks_typeNullableFilter<$PrismaModel> | $Enums.damagedbooks_type | null
  }

  export type AccountsNullableScalarRelationFilter = {
    is?: accountsWhereInput | null
    isNot?: accountsWhereInput | null
  }

  export type BooksNullableScalarRelationFilter = {
    is?: booksWhereInput | null
    isNot?: booksWhereInput | null
  }

  export type BookeditionNullableScalarRelationFilter = {
    is?: bookeditionWhereInput | null
    isNot?: bookeditionWhereInput | null
  }

  export type StoresNullableScalarRelationFilter = {
    is?: storesWhereInput | null
    isNot?: storesWhereInput | null
  }

  export type damagedbooksOrderByRelevanceInput = {
    fields: damagedbooksOrderByRelevanceFieldEnum | damagedbooksOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type damagedbooksCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    book_id?: SortOrder
    store_id?: SortOrder
    edition_id?: SortOrder
    count?: SortOrder
    memo?: SortOrder
    account_id?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type damagedbooksAvgOrderByAggregateInput = {
    id?: SortOrder
    book_id?: SortOrder
    store_id?: SortOrder
    edition_id?: SortOrder
    count?: SortOrder
    account_id?: SortOrder
  }

  export type damagedbooksMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    book_id?: SortOrder
    store_id?: SortOrder
    edition_id?: SortOrder
    count?: SortOrder
    memo?: SortOrder
    account_id?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type damagedbooksMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    book_id?: SortOrder
    store_id?: SortOrder
    edition_id?: SortOrder
    count?: SortOrder
    memo?: SortOrder
    account_id?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type damagedbooksSumOrderByAggregateInput = {
    id?: SortOrder
    book_id?: SortOrder
    store_id?: SortOrder
    edition_id?: SortOrder
    count?: SortOrder
    account_id?: SortOrder
  }

  export type Enumdamagedbooks_typeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.damagedbooks_type | Enumdamagedbooks_typeFieldRefInput<$PrismaModel> | null
    in?: $Enums.damagedbooks_type[] | null
    notIn?: $Enums.damagedbooks_type[] | null
    not?: NestedEnumdamagedbooks_typeNullableWithAggregatesFilter<$PrismaModel> | $Enums.damagedbooks_type | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumdamagedbooks_typeNullableFilter<$PrismaModel>
    _max?: NestedEnumdamagedbooks_typeNullableFilter<$PrismaModel>
  }

  export type dashboardmenuOrderByRelevanceInput = {
    fields: dashboardmenuOrderByRelevanceFieldEnum | dashboardmenuOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type dashboardmenuCountOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    menus?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type dashboardmenuAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type dashboardmenuMaxOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    menus?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type dashboardmenuMinOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    menus?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type dashboardmenuSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PrintorderListRelationFilter = {
    every?: printorderWhereInput
    some?: printorderWhereInput
    none?: printorderWhereInput
  }

  export type printorderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type printerOrderByRelevanceInput = {
    fields: printerOrderByRelevanceFieldEnum | printerOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type printerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    location?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type printerAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type printerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    location?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type printerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    location?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type printerSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type Enumprintorder_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.printorder_status | Enumprintorder_statusFieldRefInput<$PrismaModel>
    in?: $Enums.printorder_status[]
    notIn?: $Enums.printorder_status[]
    not?: NestedEnumprintorder_statusFilter<$PrismaModel> | $Enums.printorder_status
  }

  export type Enumprintorder_trackingFilter<$PrismaModel = never> = {
    equals?: $Enums.printorder_tracking | Enumprintorder_trackingFieldRefInput<$PrismaModel>
    in?: $Enums.printorder_tracking[]
    notIn?: $Enums.printorder_tracking[]
    not?: NestedEnumprintorder_trackingFilter<$PrismaModel> | $Enums.printorder_tracking
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type PrinterScalarRelationFilter = {
    is?: printerWhereInput
    isNot?: printerWhereInput
  }

  export type printorderOrderByRelevanceInput = {
    fields: printorderOrderByRelevanceFieldEnum | printorderOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type printorderCountOrderByAggregateInput = {
    id?: SortOrder
    quality?: SortOrder
    count?: SortOrder
    status?: SortOrder
    memo?: SortOrder
    tracking?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    printerId?: SortOrder
    edition?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type printorderAvgOrderByAggregateInput = {
    id?: SortOrder
    count?: SortOrder
    printerId?: SortOrder
  }

  export type printorderMaxOrderByAggregateInput = {
    id?: SortOrder
    quality?: SortOrder
    count?: SortOrder
    status?: SortOrder
    memo?: SortOrder
    tracking?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    printerId?: SortOrder
    edition?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type printorderMinOrderByAggregateInput = {
    id?: SortOrder
    quality?: SortOrder
    count?: SortOrder
    status?: SortOrder
    memo?: SortOrder
    tracking?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    printerId?: SortOrder
    edition?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type printorderSumOrderByAggregateInput = {
    id?: SortOrder
    count?: SortOrder
    printerId?: SortOrder
  }

  export type Enumprintorder_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.printorder_status | Enumprintorder_statusFieldRefInput<$PrismaModel>
    in?: $Enums.printorder_status[]
    notIn?: $Enums.printorder_status[]
    not?: NestedEnumprintorder_statusWithAggregatesFilter<$PrismaModel> | $Enums.printorder_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumprintorder_statusFilter<$PrismaModel>
    _max?: NestedEnumprintorder_statusFilter<$PrismaModel>
  }

  export type Enumprintorder_trackingWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.printorder_tracking | Enumprintorder_trackingFieldRefInput<$PrismaModel>
    in?: $Enums.printorder_tracking[]
    notIn?: $Enums.printorder_tracking[]
    not?: NestedEnumprintorder_trackingWithAggregatesFilter<$PrismaModel> | $Enums.printorder_tracking
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumprintorder_trackingFilter<$PrismaModel>
    _max?: NestedEnumprintorder_trackingFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type AccountsScalarRelationFilter = {
    is?: accountsWhereInput
    isNot?: accountsWhereInput
  }

  export type rolesOrderByRelevanceInput = {
    fields: rolesOrderByRelevanceFieldEnum | rolesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type rolesCountOrderByAggregateInput = {
    id?: SortOrder
    role_status?: SortOrder
    role_name?: SortOrder
    accountId?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type rolesAvgOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
  }

  export type rolesMaxOrderByAggregateInput = {
    id?: SortOrder
    role_status?: SortOrder
    role_name?: SortOrder
    accountId?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type rolesMinOrderByAggregateInput = {
    id?: SortOrder
    role_status?: SortOrder
    role_name?: SortOrder
    accountId?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type rolesSumOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
  }

  export type storesOrderByRelevanceInput = {
    fields: storesOrderByRelevanceFieldEnum | storesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type storesCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    location?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    status?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type storesAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type storesMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    location?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    status?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type storesMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    location?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    status?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type storesSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type translatorOrderByRelevanceInput = {
    fields: translatorOrderByRelevanceFieldEnum | translatorOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type translatorCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phoneNumber?: SortOrder
    email?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type translatorAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type translatorMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phoneNumber?: SortOrder
    email?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type translatorMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phoneNumber?: SortOrder
    email?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type translatorSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type Enumtranslatorbook_StatusFilter<$PrismaModel = never> = {
    equals?: $Enums.translatorbook_Status | Enumtranslatorbook_StatusFieldRefInput<$PrismaModel>
    in?: $Enums.translatorbook_Status[]
    notIn?: $Enums.translatorbook_Status[]
    not?: NestedEnumtranslatorbook_StatusFilter<$PrismaModel> | $Enums.translatorbook_Status
  }

  export type TranslatorScalarRelationFilter = {
    is?: translatorWhereInput
    isNot?: translatorWhereInput
  }

  export type translatorbookCountOrderByAggregateInput = {
    id?: SortOrder
    book_id?: SortOrder
    bookId?: SortOrder
    translator_id?: SortOrder
    Status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type translatorbookAvgOrderByAggregateInput = {
    id?: SortOrder
    book_id?: SortOrder
    bookId?: SortOrder
    translator_id?: SortOrder
  }

  export type translatorbookMaxOrderByAggregateInput = {
    id?: SortOrder
    book_id?: SortOrder
    bookId?: SortOrder
    translator_id?: SortOrder
    Status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type translatorbookMinOrderByAggregateInput = {
    id?: SortOrder
    book_id?: SortOrder
    bookId?: SortOrder
    translator_id?: SortOrder
    Status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type translatorbookSumOrderByAggregateInput = {
    id?: SortOrder
    book_id?: SortOrder
    bookId?: SortOrder
    translator_id?: SortOrder
  }

  export type Enumtranslatorbook_StatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.translatorbook_Status | Enumtranslatorbook_StatusFieldRefInput<$PrismaModel>
    in?: $Enums.translatorbook_Status[]
    notIn?: $Enums.translatorbook_Status[]
    not?: NestedEnumtranslatorbook_StatusWithAggregatesFilter<$PrismaModel> | $Enums.translatorbook_Status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumtranslatorbook_StatusFilter<$PrismaModel>
    _max?: NestedEnumtranslatorbook_StatusFilter<$PrismaModel>
  }

  export type damagedbooksCreateNestedManyWithoutAccountsInput = {
    create?: XOR<damagedbooksCreateWithoutAccountsInput, damagedbooksUncheckedCreateWithoutAccountsInput> | damagedbooksCreateWithoutAccountsInput[] | damagedbooksUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: damagedbooksCreateOrConnectWithoutAccountsInput | damagedbooksCreateOrConnectWithoutAccountsInput[]
    createMany?: damagedbooksCreateManyAccountsInputEnvelope
    connect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
  }

  export type rolesCreateNestedManyWithoutAccountsInput = {
    create?: XOR<rolesCreateWithoutAccountsInput, rolesUncheckedCreateWithoutAccountsInput> | rolesCreateWithoutAccountsInput[] | rolesUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: rolesCreateOrConnectWithoutAccountsInput | rolesCreateOrConnectWithoutAccountsInput[]
    createMany?: rolesCreateManyAccountsInputEnvelope
    connect?: rolesWhereUniqueInput | rolesWhereUniqueInput[]
  }

  export type damagedbooksUncheckedCreateNestedManyWithoutAccountsInput = {
    create?: XOR<damagedbooksCreateWithoutAccountsInput, damagedbooksUncheckedCreateWithoutAccountsInput> | damagedbooksCreateWithoutAccountsInput[] | damagedbooksUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: damagedbooksCreateOrConnectWithoutAccountsInput | damagedbooksCreateOrConnectWithoutAccountsInput[]
    createMany?: damagedbooksCreateManyAccountsInputEnvelope
    connect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
  }

  export type rolesUncheckedCreateNestedManyWithoutAccountsInput = {
    create?: XOR<rolesCreateWithoutAccountsInput, rolesUncheckedCreateWithoutAccountsInput> | rolesCreateWithoutAccountsInput[] | rolesUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: rolesCreateOrConnectWithoutAccountsInput | rolesCreateOrConnectWithoutAccountsInput[]
    createMany?: rolesCreateManyAccountsInputEnvelope
    connect?: rolesWhereUniqueInput | rolesWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type damagedbooksUpdateManyWithoutAccountsNestedInput = {
    create?: XOR<damagedbooksCreateWithoutAccountsInput, damagedbooksUncheckedCreateWithoutAccountsInput> | damagedbooksCreateWithoutAccountsInput[] | damagedbooksUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: damagedbooksCreateOrConnectWithoutAccountsInput | damagedbooksCreateOrConnectWithoutAccountsInput[]
    upsert?: damagedbooksUpsertWithWhereUniqueWithoutAccountsInput | damagedbooksUpsertWithWhereUniqueWithoutAccountsInput[]
    createMany?: damagedbooksCreateManyAccountsInputEnvelope
    set?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    disconnect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    delete?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    connect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    update?: damagedbooksUpdateWithWhereUniqueWithoutAccountsInput | damagedbooksUpdateWithWhereUniqueWithoutAccountsInput[]
    updateMany?: damagedbooksUpdateManyWithWhereWithoutAccountsInput | damagedbooksUpdateManyWithWhereWithoutAccountsInput[]
    deleteMany?: damagedbooksScalarWhereInput | damagedbooksScalarWhereInput[]
  }

  export type rolesUpdateManyWithoutAccountsNestedInput = {
    create?: XOR<rolesCreateWithoutAccountsInput, rolesUncheckedCreateWithoutAccountsInput> | rolesCreateWithoutAccountsInput[] | rolesUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: rolesCreateOrConnectWithoutAccountsInput | rolesCreateOrConnectWithoutAccountsInput[]
    upsert?: rolesUpsertWithWhereUniqueWithoutAccountsInput | rolesUpsertWithWhereUniqueWithoutAccountsInput[]
    createMany?: rolesCreateManyAccountsInputEnvelope
    set?: rolesWhereUniqueInput | rolesWhereUniqueInput[]
    disconnect?: rolesWhereUniqueInput | rolesWhereUniqueInput[]
    delete?: rolesWhereUniqueInput | rolesWhereUniqueInput[]
    connect?: rolesWhereUniqueInput | rolesWhereUniqueInput[]
    update?: rolesUpdateWithWhereUniqueWithoutAccountsInput | rolesUpdateWithWhereUniqueWithoutAccountsInput[]
    updateMany?: rolesUpdateManyWithWhereWithoutAccountsInput | rolesUpdateManyWithWhereWithoutAccountsInput[]
    deleteMany?: rolesScalarWhereInput | rolesScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type damagedbooksUncheckedUpdateManyWithoutAccountsNestedInput = {
    create?: XOR<damagedbooksCreateWithoutAccountsInput, damagedbooksUncheckedCreateWithoutAccountsInput> | damagedbooksCreateWithoutAccountsInput[] | damagedbooksUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: damagedbooksCreateOrConnectWithoutAccountsInput | damagedbooksCreateOrConnectWithoutAccountsInput[]
    upsert?: damagedbooksUpsertWithWhereUniqueWithoutAccountsInput | damagedbooksUpsertWithWhereUniqueWithoutAccountsInput[]
    createMany?: damagedbooksCreateManyAccountsInputEnvelope
    set?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    disconnect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    delete?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    connect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    update?: damagedbooksUpdateWithWhereUniqueWithoutAccountsInput | damagedbooksUpdateWithWhereUniqueWithoutAccountsInput[]
    updateMany?: damagedbooksUpdateManyWithWhereWithoutAccountsInput | damagedbooksUpdateManyWithWhereWithoutAccountsInput[]
    deleteMany?: damagedbooksScalarWhereInput | damagedbooksScalarWhereInput[]
  }

  export type rolesUncheckedUpdateManyWithoutAccountsNestedInput = {
    create?: XOR<rolesCreateWithoutAccountsInput, rolesUncheckedCreateWithoutAccountsInput> | rolesCreateWithoutAccountsInput[] | rolesUncheckedCreateWithoutAccountsInput[]
    connectOrCreate?: rolesCreateOrConnectWithoutAccountsInput | rolesCreateOrConnectWithoutAccountsInput[]
    upsert?: rolesUpsertWithWhereUniqueWithoutAccountsInput | rolesUpsertWithWhereUniqueWithoutAccountsInput[]
    createMany?: rolesCreateManyAccountsInputEnvelope
    set?: rolesWhereUniqueInput | rolesWhereUniqueInput[]
    disconnect?: rolesWhereUniqueInput | rolesWhereUniqueInput[]
    delete?: rolesWhereUniqueInput | rolesWhereUniqueInput[]
    connect?: rolesWhereUniqueInput | rolesWhereUniqueInput[]
    update?: rolesUpdateWithWhereUniqueWithoutAccountsInput | rolesUpdateWithWhereUniqueWithoutAccountsInput[]
    updateMany?: rolesUpdateManyWithWhereWithoutAccountsInput | rolesUpdateManyWithWhereWithoutAccountsInput[]
    deleteMany?: rolesScalarWhereInput | rolesScalarWhereInput[]
  }

  export type booksCreateNestedOneWithoutBookeditionInput = {
    create?: XOR<booksCreateWithoutBookeditionInput, booksUncheckedCreateWithoutBookeditionInput>
    connectOrCreate?: booksCreateOrConnectWithoutBookeditionInput
    connect?: booksWhereUniqueInput
  }

  export type bookeditionstoresCreateNestedManyWithoutBookeditionInput = {
    create?: XOR<bookeditionstoresCreateWithoutBookeditionInput, bookeditionstoresUncheckedCreateWithoutBookeditionInput> | bookeditionstoresCreateWithoutBookeditionInput[] | bookeditionstoresUncheckedCreateWithoutBookeditionInput[]
    connectOrCreate?: bookeditionstoresCreateOrConnectWithoutBookeditionInput | bookeditionstoresCreateOrConnectWithoutBookeditionInput[]
    createMany?: bookeditionstoresCreateManyBookeditionInputEnvelope
    connect?: bookeditionstoresWhereUniqueInput | bookeditionstoresWhereUniqueInput[]
  }

  export type bookshopeditionsCreateNestedManyWithoutBookeditionInput = {
    create?: XOR<bookshopeditionsCreateWithoutBookeditionInput, bookshopeditionsUncheckedCreateWithoutBookeditionInput> | bookshopeditionsCreateWithoutBookeditionInput[] | bookshopeditionsUncheckedCreateWithoutBookeditionInput[]
    connectOrCreate?: bookshopeditionsCreateOrConnectWithoutBookeditionInput | bookshopeditionsCreateOrConnectWithoutBookeditionInput[]
    createMany?: bookshopeditionsCreateManyBookeditionInputEnvelope
    connect?: bookshopeditionsWhereUniqueInput | bookshopeditionsWhereUniqueInput[]
  }

  export type damagedbooksCreateNestedManyWithoutBookeditionInput = {
    create?: XOR<damagedbooksCreateWithoutBookeditionInput, damagedbooksUncheckedCreateWithoutBookeditionInput> | damagedbooksCreateWithoutBookeditionInput[] | damagedbooksUncheckedCreateWithoutBookeditionInput[]
    connectOrCreate?: damagedbooksCreateOrConnectWithoutBookeditionInput | damagedbooksCreateOrConnectWithoutBookeditionInput[]
    createMany?: damagedbooksCreateManyBookeditionInputEnvelope
    connect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
  }

  export type bookeditionstoresUncheckedCreateNestedManyWithoutBookeditionInput = {
    create?: XOR<bookeditionstoresCreateWithoutBookeditionInput, bookeditionstoresUncheckedCreateWithoutBookeditionInput> | bookeditionstoresCreateWithoutBookeditionInput[] | bookeditionstoresUncheckedCreateWithoutBookeditionInput[]
    connectOrCreate?: bookeditionstoresCreateOrConnectWithoutBookeditionInput | bookeditionstoresCreateOrConnectWithoutBookeditionInput[]
    createMany?: bookeditionstoresCreateManyBookeditionInputEnvelope
    connect?: bookeditionstoresWhereUniqueInput | bookeditionstoresWhereUniqueInput[]
  }

  export type bookshopeditionsUncheckedCreateNestedManyWithoutBookeditionInput = {
    create?: XOR<bookshopeditionsCreateWithoutBookeditionInput, bookshopeditionsUncheckedCreateWithoutBookeditionInput> | bookshopeditionsCreateWithoutBookeditionInput[] | bookshopeditionsUncheckedCreateWithoutBookeditionInput[]
    connectOrCreate?: bookshopeditionsCreateOrConnectWithoutBookeditionInput | bookshopeditionsCreateOrConnectWithoutBookeditionInput[]
    createMany?: bookshopeditionsCreateManyBookeditionInputEnvelope
    connect?: bookshopeditionsWhereUniqueInput | bookshopeditionsWhereUniqueInput[]
  }

  export type damagedbooksUncheckedCreateNestedManyWithoutBookeditionInput = {
    create?: XOR<damagedbooksCreateWithoutBookeditionInput, damagedbooksUncheckedCreateWithoutBookeditionInput> | damagedbooksCreateWithoutBookeditionInput[] | damagedbooksUncheckedCreateWithoutBookeditionInput[]
    connectOrCreate?: damagedbooksCreateOrConnectWithoutBookeditionInput | damagedbooksCreateOrConnectWithoutBookeditionInput[]
    createMany?: damagedbooksCreateManyBookeditionInputEnvelope
    connect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type booksUpdateOneRequiredWithoutBookeditionNestedInput = {
    create?: XOR<booksCreateWithoutBookeditionInput, booksUncheckedCreateWithoutBookeditionInput>
    connectOrCreate?: booksCreateOrConnectWithoutBookeditionInput
    upsert?: booksUpsertWithoutBookeditionInput
    connect?: booksWhereUniqueInput
    update?: XOR<XOR<booksUpdateToOneWithWhereWithoutBookeditionInput, booksUpdateWithoutBookeditionInput>, booksUncheckedUpdateWithoutBookeditionInput>
  }

  export type bookeditionstoresUpdateManyWithoutBookeditionNestedInput = {
    create?: XOR<bookeditionstoresCreateWithoutBookeditionInput, bookeditionstoresUncheckedCreateWithoutBookeditionInput> | bookeditionstoresCreateWithoutBookeditionInput[] | bookeditionstoresUncheckedCreateWithoutBookeditionInput[]
    connectOrCreate?: bookeditionstoresCreateOrConnectWithoutBookeditionInput | bookeditionstoresCreateOrConnectWithoutBookeditionInput[]
    upsert?: bookeditionstoresUpsertWithWhereUniqueWithoutBookeditionInput | bookeditionstoresUpsertWithWhereUniqueWithoutBookeditionInput[]
    createMany?: bookeditionstoresCreateManyBookeditionInputEnvelope
    set?: bookeditionstoresWhereUniqueInput | bookeditionstoresWhereUniqueInput[]
    disconnect?: bookeditionstoresWhereUniqueInput | bookeditionstoresWhereUniqueInput[]
    delete?: bookeditionstoresWhereUniqueInput | bookeditionstoresWhereUniqueInput[]
    connect?: bookeditionstoresWhereUniqueInput | bookeditionstoresWhereUniqueInput[]
    update?: bookeditionstoresUpdateWithWhereUniqueWithoutBookeditionInput | bookeditionstoresUpdateWithWhereUniqueWithoutBookeditionInput[]
    updateMany?: bookeditionstoresUpdateManyWithWhereWithoutBookeditionInput | bookeditionstoresUpdateManyWithWhereWithoutBookeditionInput[]
    deleteMany?: bookeditionstoresScalarWhereInput | bookeditionstoresScalarWhereInput[]
  }

  export type bookshopeditionsUpdateManyWithoutBookeditionNestedInput = {
    create?: XOR<bookshopeditionsCreateWithoutBookeditionInput, bookshopeditionsUncheckedCreateWithoutBookeditionInput> | bookshopeditionsCreateWithoutBookeditionInput[] | bookshopeditionsUncheckedCreateWithoutBookeditionInput[]
    connectOrCreate?: bookshopeditionsCreateOrConnectWithoutBookeditionInput | bookshopeditionsCreateOrConnectWithoutBookeditionInput[]
    upsert?: bookshopeditionsUpsertWithWhereUniqueWithoutBookeditionInput | bookshopeditionsUpsertWithWhereUniqueWithoutBookeditionInput[]
    createMany?: bookshopeditionsCreateManyBookeditionInputEnvelope
    set?: bookshopeditionsWhereUniqueInput | bookshopeditionsWhereUniqueInput[]
    disconnect?: bookshopeditionsWhereUniqueInput | bookshopeditionsWhereUniqueInput[]
    delete?: bookshopeditionsWhereUniqueInput | bookshopeditionsWhereUniqueInput[]
    connect?: bookshopeditionsWhereUniqueInput | bookshopeditionsWhereUniqueInput[]
    update?: bookshopeditionsUpdateWithWhereUniqueWithoutBookeditionInput | bookshopeditionsUpdateWithWhereUniqueWithoutBookeditionInput[]
    updateMany?: bookshopeditionsUpdateManyWithWhereWithoutBookeditionInput | bookshopeditionsUpdateManyWithWhereWithoutBookeditionInput[]
    deleteMany?: bookshopeditionsScalarWhereInput | bookshopeditionsScalarWhereInput[]
  }

  export type damagedbooksUpdateManyWithoutBookeditionNestedInput = {
    create?: XOR<damagedbooksCreateWithoutBookeditionInput, damagedbooksUncheckedCreateWithoutBookeditionInput> | damagedbooksCreateWithoutBookeditionInput[] | damagedbooksUncheckedCreateWithoutBookeditionInput[]
    connectOrCreate?: damagedbooksCreateOrConnectWithoutBookeditionInput | damagedbooksCreateOrConnectWithoutBookeditionInput[]
    upsert?: damagedbooksUpsertWithWhereUniqueWithoutBookeditionInput | damagedbooksUpsertWithWhereUniqueWithoutBookeditionInput[]
    createMany?: damagedbooksCreateManyBookeditionInputEnvelope
    set?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    disconnect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    delete?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    connect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    update?: damagedbooksUpdateWithWhereUniqueWithoutBookeditionInput | damagedbooksUpdateWithWhereUniqueWithoutBookeditionInput[]
    updateMany?: damagedbooksUpdateManyWithWhereWithoutBookeditionInput | damagedbooksUpdateManyWithWhereWithoutBookeditionInput[]
    deleteMany?: damagedbooksScalarWhereInput | damagedbooksScalarWhereInput[]
  }

  export type bookeditionstoresUncheckedUpdateManyWithoutBookeditionNestedInput = {
    create?: XOR<bookeditionstoresCreateWithoutBookeditionInput, bookeditionstoresUncheckedCreateWithoutBookeditionInput> | bookeditionstoresCreateWithoutBookeditionInput[] | bookeditionstoresUncheckedCreateWithoutBookeditionInput[]
    connectOrCreate?: bookeditionstoresCreateOrConnectWithoutBookeditionInput | bookeditionstoresCreateOrConnectWithoutBookeditionInput[]
    upsert?: bookeditionstoresUpsertWithWhereUniqueWithoutBookeditionInput | bookeditionstoresUpsertWithWhereUniqueWithoutBookeditionInput[]
    createMany?: bookeditionstoresCreateManyBookeditionInputEnvelope
    set?: bookeditionstoresWhereUniqueInput | bookeditionstoresWhereUniqueInput[]
    disconnect?: bookeditionstoresWhereUniqueInput | bookeditionstoresWhereUniqueInput[]
    delete?: bookeditionstoresWhereUniqueInput | bookeditionstoresWhereUniqueInput[]
    connect?: bookeditionstoresWhereUniqueInput | bookeditionstoresWhereUniqueInput[]
    update?: bookeditionstoresUpdateWithWhereUniqueWithoutBookeditionInput | bookeditionstoresUpdateWithWhereUniqueWithoutBookeditionInput[]
    updateMany?: bookeditionstoresUpdateManyWithWhereWithoutBookeditionInput | bookeditionstoresUpdateManyWithWhereWithoutBookeditionInput[]
    deleteMany?: bookeditionstoresScalarWhereInput | bookeditionstoresScalarWhereInput[]
  }

  export type bookshopeditionsUncheckedUpdateManyWithoutBookeditionNestedInput = {
    create?: XOR<bookshopeditionsCreateWithoutBookeditionInput, bookshopeditionsUncheckedCreateWithoutBookeditionInput> | bookshopeditionsCreateWithoutBookeditionInput[] | bookshopeditionsUncheckedCreateWithoutBookeditionInput[]
    connectOrCreate?: bookshopeditionsCreateOrConnectWithoutBookeditionInput | bookshopeditionsCreateOrConnectWithoutBookeditionInput[]
    upsert?: bookshopeditionsUpsertWithWhereUniqueWithoutBookeditionInput | bookshopeditionsUpsertWithWhereUniqueWithoutBookeditionInput[]
    createMany?: bookshopeditionsCreateManyBookeditionInputEnvelope
    set?: bookshopeditionsWhereUniqueInput | bookshopeditionsWhereUniqueInput[]
    disconnect?: bookshopeditionsWhereUniqueInput | bookshopeditionsWhereUniqueInput[]
    delete?: bookshopeditionsWhereUniqueInput | bookshopeditionsWhereUniqueInput[]
    connect?: bookshopeditionsWhereUniqueInput | bookshopeditionsWhereUniqueInput[]
    update?: bookshopeditionsUpdateWithWhereUniqueWithoutBookeditionInput | bookshopeditionsUpdateWithWhereUniqueWithoutBookeditionInput[]
    updateMany?: bookshopeditionsUpdateManyWithWhereWithoutBookeditionInput | bookshopeditionsUpdateManyWithWhereWithoutBookeditionInput[]
    deleteMany?: bookshopeditionsScalarWhereInput | bookshopeditionsScalarWhereInput[]
  }

  export type damagedbooksUncheckedUpdateManyWithoutBookeditionNestedInput = {
    create?: XOR<damagedbooksCreateWithoutBookeditionInput, damagedbooksUncheckedCreateWithoutBookeditionInput> | damagedbooksCreateWithoutBookeditionInput[] | damagedbooksUncheckedCreateWithoutBookeditionInput[]
    connectOrCreate?: damagedbooksCreateOrConnectWithoutBookeditionInput | damagedbooksCreateOrConnectWithoutBookeditionInput[]
    upsert?: damagedbooksUpsertWithWhereUniqueWithoutBookeditionInput | damagedbooksUpsertWithWhereUniqueWithoutBookeditionInput[]
    createMany?: damagedbooksCreateManyBookeditionInputEnvelope
    set?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    disconnect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    delete?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    connect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    update?: damagedbooksUpdateWithWhereUniqueWithoutBookeditionInput | damagedbooksUpdateWithWhereUniqueWithoutBookeditionInput[]
    updateMany?: damagedbooksUpdateManyWithWhereWithoutBookeditionInput | damagedbooksUpdateManyWithWhereWithoutBookeditionInput[]
    deleteMany?: damagedbooksScalarWhereInput | damagedbooksScalarWhereInput[]
  }

  export type bookeditionCreateNestedOneWithoutBookeditionstoresInput = {
    create?: XOR<bookeditionCreateWithoutBookeditionstoresInput, bookeditionUncheckedCreateWithoutBookeditionstoresInput>
    connectOrCreate?: bookeditionCreateOrConnectWithoutBookeditionstoresInput
    connect?: bookeditionWhereUniqueInput
  }

  export type storesCreateNestedOneWithoutBookeditionstoresInput = {
    create?: XOR<storesCreateWithoutBookeditionstoresInput, storesUncheckedCreateWithoutBookeditionstoresInput>
    connectOrCreate?: storesCreateOrConnectWithoutBookeditionstoresInput
    connect?: storesWhereUniqueInput
  }

  export type bookeditionUpdateOneRequiredWithoutBookeditionstoresNestedInput = {
    create?: XOR<bookeditionCreateWithoutBookeditionstoresInput, bookeditionUncheckedCreateWithoutBookeditionstoresInput>
    connectOrCreate?: bookeditionCreateOrConnectWithoutBookeditionstoresInput
    upsert?: bookeditionUpsertWithoutBookeditionstoresInput
    connect?: bookeditionWhereUniqueInput
    update?: XOR<XOR<bookeditionUpdateToOneWithWhereWithoutBookeditionstoresInput, bookeditionUpdateWithoutBookeditionstoresInput>, bookeditionUncheckedUpdateWithoutBookeditionstoresInput>
  }

  export type storesUpdateOneRequiredWithoutBookeditionstoresNestedInput = {
    create?: XOR<storesCreateWithoutBookeditionstoresInput, storesUncheckedCreateWithoutBookeditionstoresInput>
    connectOrCreate?: storesCreateOrConnectWithoutBookeditionstoresInput
    upsert?: storesUpsertWithoutBookeditionstoresInput
    connect?: storesWhereUniqueInput
    update?: XOR<XOR<storesUpdateToOneWithWhereWithoutBookeditionstoresInput, storesUpdateWithoutBookeditionstoresInput>, storesUncheckedUpdateWithoutBookeditionstoresInput>
  }

  export type bookeditionCreateNestedManyWithoutBooksInput = {
    create?: XOR<bookeditionCreateWithoutBooksInput, bookeditionUncheckedCreateWithoutBooksInput> | bookeditionCreateWithoutBooksInput[] | bookeditionUncheckedCreateWithoutBooksInput[]
    connectOrCreate?: bookeditionCreateOrConnectWithoutBooksInput | bookeditionCreateOrConnectWithoutBooksInput[]
    createMany?: bookeditionCreateManyBooksInputEnvelope
    connect?: bookeditionWhereUniqueInput | bookeditionWhereUniqueInput[]
  }

  export type damagedbooksCreateNestedManyWithoutBooksInput = {
    create?: XOR<damagedbooksCreateWithoutBooksInput, damagedbooksUncheckedCreateWithoutBooksInput> | damagedbooksCreateWithoutBooksInput[] | damagedbooksUncheckedCreateWithoutBooksInput[]
    connectOrCreate?: damagedbooksCreateOrConnectWithoutBooksInput | damagedbooksCreateOrConnectWithoutBooksInput[]
    createMany?: damagedbooksCreateManyBooksInputEnvelope
    connect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
  }

  export type translatorbookCreateNestedManyWithoutBooksInput = {
    create?: XOR<translatorbookCreateWithoutBooksInput, translatorbookUncheckedCreateWithoutBooksInput> | translatorbookCreateWithoutBooksInput[] | translatorbookUncheckedCreateWithoutBooksInput[]
    connectOrCreate?: translatorbookCreateOrConnectWithoutBooksInput | translatorbookCreateOrConnectWithoutBooksInput[]
    createMany?: translatorbookCreateManyBooksInputEnvelope
    connect?: translatorbookWhereUniqueInput | translatorbookWhereUniqueInput[]
  }

  export type bookeditionUncheckedCreateNestedManyWithoutBooksInput = {
    create?: XOR<bookeditionCreateWithoutBooksInput, bookeditionUncheckedCreateWithoutBooksInput> | bookeditionCreateWithoutBooksInput[] | bookeditionUncheckedCreateWithoutBooksInput[]
    connectOrCreate?: bookeditionCreateOrConnectWithoutBooksInput | bookeditionCreateOrConnectWithoutBooksInput[]
    createMany?: bookeditionCreateManyBooksInputEnvelope
    connect?: bookeditionWhereUniqueInput | bookeditionWhereUniqueInput[]
  }

  export type damagedbooksUncheckedCreateNestedManyWithoutBooksInput = {
    create?: XOR<damagedbooksCreateWithoutBooksInput, damagedbooksUncheckedCreateWithoutBooksInput> | damagedbooksCreateWithoutBooksInput[] | damagedbooksUncheckedCreateWithoutBooksInput[]
    connectOrCreate?: damagedbooksCreateOrConnectWithoutBooksInput | damagedbooksCreateOrConnectWithoutBooksInput[]
    createMany?: damagedbooksCreateManyBooksInputEnvelope
    connect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
  }

  export type translatorbookUncheckedCreateNestedManyWithoutBooksInput = {
    create?: XOR<translatorbookCreateWithoutBooksInput, translatorbookUncheckedCreateWithoutBooksInput> | translatorbookCreateWithoutBooksInput[] | translatorbookUncheckedCreateWithoutBooksInput[]
    connectOrCreate?: translatorbookCreateOrConnectWithoutBooksInput | translatorbookCreateOrConnectWithoutBooksInput[]
    createMany?: translatorbookCreateManyBooksInputEnvelope
    connect?: translatorbookWhereUniqueInput | translatorbookWhereUniqueInput[]
  }

  export type NullableEnumbooks_productionstatusFieldUpdateOperationsInput = {
    set?: $Enums.books_productionstatus | null
  }

  export type bookeditionUpdateManyWithoutBooksNestedInput = {
    create?: XOR<bookeditionCreateWithoutBooksInput, bookeditionUncheckedCreateWithoutBooksInput> | bookeditionCreateWithoutBooksInput[] | bookeditionUncheckedCreateWithoutBooksInput[]
    connectOrCreate?: bookeditionCreateOrConnectWithoutBooksInput | bookeditionCreateOrConnectWithoutBooksInput[]
    upsert?: bookeditionUpsertWithWhereUniqueWithoutBooksInput | bookeditionUpsertWithWhereUniqueWithoutBooksInput[]
    createMany?: bookeditionCreateManyBooksInputEnvelope
    set?: bookeditionWhereUniqueInput | bookeditionWhereUniqueInput[]
    disconnect?: bookeditionWhereUniqueInput | bookeditionWhereUniqueInput[]
    delete?: bookeditionWhereUniqueInput | bookeditionWhereUniqueInput[]
    connect?: bookeditionWhereUniqueInput | bookeditionWhereUniqueInput[]
    update?: bookeditionUpdateWithWhereUniqueWithoutBooksInput | bookeditionUpdateWithWhereUniqueWithoutBooksInput[]
    updateMany?: bookeditionUpdateManyWithWhereWithoutBooksInput | bookeditionUpdateManyWithWhereWithoutBooksInput[]
    deleteMany?: bookeditionScalarWhereInput | bookeditionScalarWhereInput[]
  }

  export type damagedbooksUpdateManyWithoutBooksNestedInput = {
    create?: XOR<damagedbooksCreateWithoutBooksInput, damagedbooksUncheckedCreateWithoutBooksInput> | damagedbooksCreateWithoutBooksInput[] | damagedbooksUncheckedCreateWithoutBooksInput[]
    connectOrCreate?: damagedbooksCreateOrConnectWithoutBooksInput | damagedbooksCreateOrConnectWithoutBooksInput[]
    upsert?: damagedbooksUpsertWithWhereUniqueWithoutBooksInput | damagedbooksUpsertWithWhereUniqueWithoutBooksInput[]
    createMany?: damagedbooksCreateManyBooksInputEnvelope
    set?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    disconnect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    delete?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    connect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    update?: damagedbooksUpdateWithWhereUniqueWithoutBooksInput | damagedbooksUpdateWithWhereUniqueWithoutBooksInput[]
    updateMany?: damagedbooksUpdateManyWithWhereWithoutBooksInput | damagedbooksUpdateManyWithWhereWithoutBooksInput[]
    deleteMany?: damagedbooksScalarWhereInput | damagedbooksScalarWhereInput[]
  }

  export type translatorbookUpdateManyWithoutBooksNestedInput = {
    create?: XOR<translatorbookCreateWithoutBooksInput, translatorbookUncheckedCreateWithoutBooksInput> | translatorbookCreateWithoutBooksInput[] | translatorbookUncheckedCreateWithoutBooksInput[]
    connectOrCreate?: translatorbookCreateOrConnectWithoutBooksInput | translatorbookCreateOrConnectWithoutBooksInput[]
    upsert?: translatorbookUpsertWithWhereUniqueWithoutBooksInput | translatorbookUpsertWithWhereUniqueWithoutBooksInput[]
    createMany?: translatorbookCreateManyBooksInputEnvelope
    set?: translatorbookWhereUniqueInput | translatorbookWhereUniqueInput[]
    disconnect?: translatorbookWhereUniqueInput | translatorbookWhereUniqueInput[]
    delete?: translatorbookWhereUniqueInput | translatorbookWhereUniqueInput[]
    connect?: translatorbookWhereUniqueInput | translatorbookWhereUniqueInput[]
    update?: translatorbookUpdateWithWhereUniqueWithoutBooksInput | translatorbookUpdateWithWhereUniqueWithoutBooksInput[]
    updateMany?: translatorbookUpdateManyWithWhereWithoutBooksInput | translatorbookUpdateManyWithWhereWithoutBooksInput[]
    deleteMany?: translatorbookScalarWhereInput | translatorbookScalarWhereInput[]
  }

  export type bookeditionUncheckedUpdateManyWithoutBooksNestedInput = {
    create?: XOR<bookeditionCreateWithoutBooksInput, bookeditionUncheckedCreateWithoutBooksInput> | bookeditionCreateWithoutBooksInput[] | bookeditionUncheckedCreateWithoutBooksInput[]
    connectOrCreate?: bookeditionCreateOrConnectWithoutBooksInput | bookeditionCreateOrConnectWithoutBooksInput[]
    upsert?: bookeditionUpsertWithWhereUniqueWithoutBooksInput | bookeditionUpsertWithWhereUniqueWithoutBooksInput[]
    createMany?: bookeditionCreateManyBooksInputEnvelope
    set?: bookeditionWhereUniqueInput | bookeditionWhereUniqueInput[]
    disconnect?: bookeditionWhereUniqueInput | bookeditionWhereUniqueInput[]
    delete?: bookeditionWhereUniqueInput | bookeditionWhereUniqueInput[]
    connect?: bookeditionWhereUniqueInput | bookeditionWhereUniqueInput[]
    update?: bookeditionUpdateWithWhereUniqueWithoutBooksInput | bookeditionUpdateWithWhereUniqueWithoutBooksInput[]
    updateMany?: bookeditionUpdateManyWithWhereWithoutBooksInput | bookeditionUpdateManyWithWhereWithoutBooksInput[]
    deleteMany?: bookeditionScalarWhereInput | bookeditionScalarWhereInput[]
  }

  export type damagedbooksUncheckedUpdateManyWithoutBooksNestedInput = {
    create?: XOR<damagedbooksCreateWithoutBooksInput, damagedbooksUncheckedCreateWithoutBooksInput> | damagedbooksCreateWithoutBooksInput[] | damagedbooksUncheckedCreateWithoutBooksInput[]
    connectOrCreate?: damagedbooksCreateOrConnectWithoutBooksInput | damagedbooksCreateOrConnectWithoutBooksInput[]
    upsert?: damagedbooksUpsertWithWhereUniqueWithoutBooksInput | damagedbooksUpsertWithWhereUniqueWithoutBooksInput[]
    createMany?: damagedbooksCreateManyBooksInputEnvelope
    set?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    disconnect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    delete?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    connect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    update?: damagedbooksUpdateWithWhereUniqueWithoutBooksInput | damagedbooksUpdateWithWhereUniqueWithoutBooksInput[]
    updateMany?: damagedbooksUpdateManyWithWhereWithoutBooksInput | damagedbooksUpdateManyWithWhereWithoutBooksInput[]
    deleteMany?: damagedbooksScalarWhereInput | damagedbooksScalarWhereInput[]
  }

  export type translatorbookUncheckedUpdateManyWithoutBooksNestedInput = {
    create?: XOR<translatorbookCreateWithoutBooksInput, translatorbookUncheckedCreateWithoutBooksInput> | translatorbookCreateWithoutBooksInput[] | translatorbookUncheckedCreateWithoutBooksInput[]
    connectOrCreate?: translatorbookCreateOrConnectWithoutBooksInput | translatorbookCreateOrConnectWithoutBooksInput[]
    upsert?: translatorbookUpsertWithWhereUniqueWithoutBooksInput | translatorbookUpsertWithWhereUniqueWithoutBooksInput[]
    createMany?: translatorbookCreateManyBooksInputEnvelope
    set?: translatorbookWhereUniqueInput | translatorbookWhereUniqueInput[]
    disconnect?: translatorbookWhereUniqueInput | translatorbookWhereUniqueInput[]
    delete?: translatorbookWhereUniqueInput | translatorbookWhereUniqueInput[]
    connect?: translatorbookWhereUniqueInput | translatorbookWhereUniqueInput[]
    update?: translatorbookUpdateWithWhereUniqueWithoutBooksInput | translatorbookUpdateWithWhereUniqueWithoutBooksInput[]
    updateMany?: translatorbookUpdateManyWithWhereWithoutBooksInput | translatorbookUpdateManyWithWhereWithoutBooksInput[]
    deleteMany?: translatorbookScalarWhereInput | translatorbookScalarWhereInput[]
  }

  export type bookeditionCreateNestedOneWithoutBookshopeditionsInput = {
    create?: XOR<bookeditionCreateWithoutBookshopeditionsInput, bookeditionUncheckedCreateWithoutBookshopeditionsInput>
    connectOrCreate?: bookeditionCreateOrConnectWithoutBookshopeditionsInput
    connect?: bookeditionWhereUniqueInput
  }

  export type bookshopesCreateNestedOneWithoutBookshopeditionsInput = {
    create?: XOR<bookshopesCreateWithoutBookshopeditionsInput, bookshopesUncheckedCreateWithoutBookshopeditionsInput>
    connectOrCreate?: bookshopesCreateOrConnectWithoutBookshopeditionsInput
    connect?: bookshopesWhereUniqueInput
  }

  export type bookeditionUpdateOneRequiredWithoutBookshopeditionsNestedInput = {
    create?: XOR<bookeditionCreateWithoutBookshopeditionsInput, bookeditionUncheckedCreateWithoutBookshopeditionsInput>
    connectOrCreate?: bookeditionCreateOrConnectWithoutBookshopeditionsInput
    upsert?: bookeditionUpsertWithoutBookshopeditionsInput
    connect?: bookeditionWhereUniqueInput
    update?: XOR<XOR<bookeditionUpdateToOneWithWhereWithoutBookshopeditionsInput, bookeditionUpdateWithoutBookshopeditionsInput>, bookeditionUncheckedUpdateWithoutBookshopeditionsInput>
  }

  export type bookshopesUpdateOneRequiredWithoutBookshopeditionsNestedInput = {
    create?: XOR<bookshopesCreateWithoutBookshopeditionsInput, bookshopesUncheckedCreateWithoutBookshopeditionsInput>
    connectOrCreate?: bookshopesCreateOrConnectWithoutBookshopeditionsInput
    upsert?: bookshopesUpsertWithoutBookshopeditionsInput
    connect?: bookshopesWhereUniqueInput
    update?: XOR<XOR<bookshopesUpdateToOneWithWhereWithoutBookshopeditionsInput, bookshopesUpdateWithoutBookshopeditionsInput>, bookshopesUncheckedUpdateWithoutBookshopeditionsInput>
  }

  export type bookshopeditionsCreateNestedManyWithoutBookshopesInput = {
    create?: XOR<bookshopeditionsCreateWithoutBookshopesInput, bookshopeditionsUncheckedCreateWithoutBookshopesInput> | bookshopeditionsCreateWithoutBookshopesInput[] | bookshopeditionsUncheckedCreateWithoutBookshopesInput[]
    connectOrCreate?: bookshopeditionsCreateOrConnectWithoutBookshopesInput | bookshopeditionsCreateOrConnectWithoutBookshopesInput[]
    createMany?: bookshopeditionsCreateManyBookshopesInputEnvelope
    connect?: bookshopeditionsWhereUniqueInput | bookshopeditionsWhereUniqueInput[]
  }

  export type bookshopeditionsUncheckedCreateNestedManyWithoutBookshopesInput = {
    create?: XOR<bookshopeditionsCreateWithoutBookshopesInput, bookshopeditionsUncheckedCreateWithoutBookshopesInput> | bookshopeditionsCreateWithoutBookshopesInput[] | bookshopeditionsUncheckedCreateWithoutBookshopesInput[]
    connectOrCreate?: bookshopeditionsCreateOrConnectWithoutBookshopesInput | bookshopeditionsCreateOrConnectWithoutBookshopesInput[]
    createMany?: bookshopeditionsCreateManyBookshopesInputEnvelope
    connect?: bookshopeditionsWhereUniqueInput | bookshopeditionsWhereUniqueInput[]
  }

  export type bookshopeditionsUpdateManyWithoutBookshopesNestedInput = {
    create?: XOR<bookshopeditionsCreateWithoutBookshopesInput, bookshopeditionsUncheckedCreateWithoutBookshopesInput> | bookshopeditionsCreateWithoutBookshopesInput[] | bookshopeditionsUncheckedCreateWithoutBookshopesInput[]
    connectOrCreate?: bookshopeditionsCreateOrConnectWithoutBookshopesInput | bookshopeditionsCreateOrConnectWithoutBookshopesInput[]
    upsert?: bookshopeditionsUpsertWithWhereUniqueWithoutBookshopesInput | bookshopeditionsUpsertWithWhereUniqueWithoutBookshopesInput[]
    createMany?: bookshopeditionsCreateManyBookshopesInputEnvelope
    set?: bookshopeditionsWhereUniqueInput | bookshopeditionsWhereUniqueInput[]
    disconnect?: bookshopeditionsWhereUniqueInput | bookshopeditionsWhereUniqueInput[]
    delete?: bookshopeditionsWhereUniqueInput | bookshopeditionsWhereUniqueInput[]
    connect?: bookshopeditionsWhereUniqueInput | bookshopeditionsWhereUniqueInput[]
    update?: bookshopeditionsUpdateWithWhereUniqueWithoutBookshopesInput | bookshopeditionsUpdateWithWhereUniqueWithoutBookshopesInput[]
    updateMany?: bookshopeditionsUpdateManyWithWhereWithoutBookshopesInput | bookshopeditionsUpdateManyWithWhereWithoutBookshopesInput[]
    deleteMany?: bookshopeditionsScalarWhereInput | bookshopeditionsScalarWhereInput[]
  }

  export type bookshopeditionsUncheckedUpdateManyWithoutBookshopesNestedInput = {
    create?: XOR<bookshopeditionsCreateWithoutBookshopesInput, bookshopeditionsUncheckedCreateWithoutBookshopesInput> | bookshopeditionsCreateWithoutBookshopesInput[] | bookshopeditionsUncheckedCreateWithoutBookshopesInput[]
    connectOrCreate?: bookshopeditionsCreateOrConnectWithoutBookshopesInput | bookshopeditionsCreateOrConnectWithoutBookshopesInput[]
    upsert?: bookshopeditionsUpsertWithWhereUniqueWithoutBookshopesInput | bookshopeditionsUpsertWithWhereUniqueWithoutBookshopesInput[]
    createMany?: bookshopeditionsCreateManyBookshopesInputEnvelope
    set?: bookshopeditionsWhereUniqueInput | bookshopeditionsWhereUniqueInput[]
    disconnect?: bookshopeditionsWhereUniqueInput | bookshopeditionsWhereUniqueInput[]
    delete?: bookshopeditionsWhereUniqueInput | bookshopeditionsWhereUniqueInput[]
    connect?: bookshopeditionsWhereUniqueInput | bookshopeditionsWhereUniqueInput[]
    update?: bookshopeditionsUpdateWithWhereUniqueWithoutBookshopesInput | bookshopeditionsUpdateWithWhereUniqueWithoutBookshopesInput[]
    updateMany?: bookshopeditionsUpdateManyWithWhereWithoutBookshopesInput | bookshopeditionsUpdateManyWithWhereWithoutBookshopesInput[]
    deleteMany?: bookshopeditionsScalarWhereInput | bookshopeditionsScalarWhereInput[]
  }

  export type accountsCreateNestedOneWithoutDamagedbooksInput = {
    create?: XOR<accountsCreateWithoutDamagedbooksInput, accountsUncheckedCreateWithoutDamagedbooksInput>
    connectOrCreate?: accountsCreateOrConnectWithoutDamagedbooksInput
    connect?: accountsWhereUniqueInput
  }

  export type booksCreateNestedOneWithoutDamagedbooksInput = {
    create?: XOR<booksCreateWithoutDamagedbooksInput, booksUncheckedCreateWithoutDamagedbooksInput>
    connectOrCreate?: booksCreateOrConnectWithoutDamagedbooksInput
    connect?: booksWhereUniqueInput
  }

  export type bookeditionCreateNestedOneWithoutDamagedbooksInput = {
    create?: XOR<bookeditionCreateWithoutDamagedbooksInput, bookeditionUncheckedCreateWithoutDamagedbooksInput>
    connectOrCreate?: bookeditionCreateOrConnectWithoutDamagedbooksInput
    connect?: bookeditionWhereUniqueInput
  }

  export type storesCreateNestedOneWithoutDamagedbooksInput = {
    create?: XOR<storesCreateWithoutDamagedbooksInput, storesUncheckedCreateWithoutDamagedbooksInput>
    connectOrCreate?: storesCreateOrConnectWithoutDamagedbooksInput
    connect?: storesWhereUniqueInput
  }

  export type NullableEnumdamagedbooks_typeFieldUpdateOperationsInput = {
    set?: $Enums.damagedbooks_type | null
  }

  export type accountsUpdateOneWithoutDamagedbooksNestedInput = {
    create?: XOR<accountsCreateWithoutDamagedbooksInput, accountsUncheckedCreateWithoutDamagedbooksInput>
    connectOrCreate?: accountsCreateOrConnectWithoutDamagedbooksInput
    upsert?: accountsUpsertWithoutDamagedbooksInput
    disconnect?: accountsWhereInput | boolean
    delete?: accountsWhereInput | boolean
    connect?: accountsWhereUniqueInput
    update?: XOR<XOR<accountsUpdateToOneWithWhereWithoutDamagedbooksInput, accountsUpdateWithoutDamagedbooksInput>, accountsUncheckedUpdateWithoutDamagedbooksInput>
  }

  export type booksUpdateOneWithoutDamagedbooksNestedInput = {
    create?: XOR<booksCreateWithoutDamagedbooksInput, booksUncheckedCreateWithoutDamagedbooksInput>
    connectOrCreate?: booksCreateOrConnectWithoutDamagedbooksInput
    upsert?: booksUpsertWithoutDamagedbooksInput
    disconnect?: booksWhereInput | boolean
    delete?: booksWhereInput | boolean
    connect?: booksWhereUniqueInput
    update?: XOR<XOR<booksUpdateToOneWithWhereWithoutDamagedbooksInput, booksUpdateWithoutDamagedbooksInput>, booksUncheckedUpdateWithoutDamagedbooksInput>
  }

  export type bookeditionUpdateOneWithoutDamagedbooksNestedInput = {
    create?: XOR<bookeditionCreateWithoutDamagedbooksInput, bookeditionUncheckedCreateWithoutDamagedbooksInput>
    connectOrCreate?: bookeditionCreateOrConnectWithoutDamagedbooksInput
    upsert?: bookeditionUpsertWithoutDamagedbooksInput
    disconnect?: bookeditionWhereInput | boolean
    delete?: bookeditionWhereInput | boolean
    connect?: bookeditionWhereUniqueInput
    update?: XOR<XOR<bookeditionUpdateToOneWithWhereWithoutDamagedbooksInput, bookeditionUpdateWithoutDamagedbooksInput>, bookeditionUncheckedUpdateWithoutDamagedbooksInput>
  }

  export type storesUpdateOneWithoutDamagedbooksNestedInput = {
    create?: XOR<storesCreateWithoutDamagedbooksInput, storesUncheckedCreateWithoutDamagedbooksInput>
    connectOrCreate?: storesCreateOrConnectWithoutDamagedbooksInput
    upsert?: storesUpsertWithoutDamagedbooksInput
    disconnect?: storesWhereInput | boolean
    delete?: storesWhereInput | boolean
    connect?: storesWhereUniqueInput
    update?: XOR<XOR<storesUpdateToOneWithWhereWithoutDamagedbooksInput, storesUpdateWithoutDamagedbooksInput>, storesUncheckedUpdateWithoutDamagedbooksInput>
  }

  export type printorderCreateNestedManyWithoutPrinterInput = {
    create?: XOR<printorderCreateWithoutPrinterInput, printorderUncheckedCreateWithoutPrinterInput> | printorderCreateWithoutPrinterInput[] | printorderUncheckedCreateWithoutPrinterInput[]
    connectOrCreate?: printorderCreateOrConnectWithoutPrinterInput | printorderCreateOrConnectWithoutPrinterInput[]
    createMany?: printorderCreateManyPrinterInputEnvelope
    connect?: printorderWhereUniqueInput | printorderWhereUniqueInput[]
  }

  export type printorderUncheckedCreateNestedManyWithoutPrinterInput = {
    create?: XOR<printorderCreateWithoutPrinterInput, printorderUncheckedCreateWithoutPrinterInput> | printorderCreateWithoutPrinterInput[] | printorderUncheckedCreateWithoutPrinterInput[]
    connectOrCreate?: printorderCreateOrConnectWithoutPrinterInput | printorderCreateOrConnectWithoutPrinterInput[]
    createMany?: printorderCreateManyPrinterInputEnvelope
    connect?: printorderWhereUniqueInput | printorderWhereUniqueInput[]
  }

  export type printorderUpdateManyWithoutPrinterNestedInput = {
    create?: XOR<printorderCreateWithoutPrinterInput, printorderUncheckedCreateWithoutPrinterInput> | printorderCreateWithoutPrinterInput[] | printorderUncheckedCreateWithoutPrinterInput[]
    connectOrCreate?: printorderCreateOrConnectWithoutPrinterInput | printorderCreateOrConnectWithoutPrinterInput[]
    upsert?: printorderUpsertWithWhereUniqueWithoutPrinterInput | printorderUpsertWithWhereUniqueWithoutPrinterInput[]
    createMany?: printorderCreateManyPrinterInputEnvelope
    set?: printorderWhereUniqueInput | printorderWhereUniqueInput[]
    disconnect?: printorderWhereUniqueInput | printorderWhereUniqueInput[]
    delete?: printorderWhereUniqueInput | printorderWhereUniqueInput[]
    connect?: printorderWhereUniqueInput | printorderWhereUniqueInput[]
    update?: printorderUpdateWithWhereUniqueWithoutPrinterInput | printorderUpdateWithWhereUniqueWithoutPrinterInput[]
    updateMany?: printorderUpdateManyWithWhereWithoutPrinterInput | printorderUpdateManyWithWhereWithoutPrinterInput[]
    deleteMany?: printorderScalarWhereInput | printorderScalarWhereInput[]
  }

  export type printorderUncheckedUpdateManyWithoutPrinterNestedInput = {
    create?: XOR<printorderCreateWithoutPrinterInput, printorderUncheckedCreateWithoutPrinterInput> | printorderCreateWithoutPrinterInput[] | printorderUncheckedCreateWithoutPrinterInput[]
    connectOrCreate?: printorderCreateOrConnectWithoutPrinterInput | printorderCreateOrConnectWithoutPrinterInput[]
    upsert?: printorderUpsertWithWhereUniqueWithoutPrinterInput | printorderUpsertWithWhereUniqueWithoutPrinterInput[]
    createMany?: printorderCreateManyPrinterInputEnvelope
    set?: printorderWhereUniqueInput | printorderWhereUniqueInput[]
    disconnect?: printorderWhereUniqueInput | printorderWhereUniqueInput[]
    delete?: printorderWhereUniqueInput | printorderWhereUniqueInput[]
    connect?: printorderWhereUniqueInput | printorderWhereUniqueInput[]
    update?: printorderUpdateWithWhereUniqueWithoutPrinterInput | printorderUpdateWithWhereUniqueWithoutPrinterInput[]
    updateMany?: printorderUpdateManyWithWhereWithoutPrinterInput | printorderUpdateManyWithWhereWithoutPrinterInput[]
    deleteMany?: printorderScalarWhereInput | printorderScalarWhereInput[]
  }

  export type printerCreateNestedOneWithoutPrintorderInput = {
    create?: XOR<printerCreateWithoutPrintorderInput, printerUncheckedCreateWithoutPrintorderInput>
    connectOrCreate?: printerCreateOrConnectWithoutPrintorderInput
    connect?: printerWhereUniqueInput
  }

  export type Enumprintorder_statusFieldUpdateOperationsInput = {
    set?: $Enums.printorder_status
  }

  export type Enumprintorder_trackingFieldUpdateOperationsInput = {
    set?: $Enums.printorder_tracking
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type printerUpdateOneRequiredWithoutPrintorderNestedInput = {
    create?: XOR<printerCreateWithoutPrintorderInput, printerUncheckedCreateWithoutPrintorderInput>
    connectOrCreate?: printerCreateOrConnectWithoutPrintorderInput
    upsert?: printerUpsertWithoutPrintorderInput
    connect?: printerWhereUniqueInput
    update?: XOR<XOR<printerUpdateToOneWithWhereWithoutPrintorderInput, printerUpdateWithoutPrintorderInput>, printerUncheckedUpdateWithoutPrintorderInput>
  }

  export type accountsCreateNestedOneWithoutRolesInput = {
    create?: XOR<accountsCreateWithoutRolesInput, accountsUncheckedCreateWithoutRolesInput>
    connectOrCreate?: accountsCreateOrConnectWithoutRolesInput
    connect?: accountsWhereUniqueInput
  }

  export type accountsUpdateOneRequiredWithoutRolesNestedInput = {
    create?: XOR<accountsCreateWithoutRolesInput, accountsUncheckedCreateWithoutRolesInput>
    connectOrCreate?: accountsCreateOrConnectWithoutRolesInput
    upsert?: accountsUpsertWithoutRolesInput
    connect?: accountsWhereUniqueInput
    update?: XOR<XOR<accountsUpdateToOneWithWhereWithoutRolesInput, accountsUpdateWithoutRolesInput>, accountsUncheckedUpdateWithoutRolesInput>
  }

  export type bookeditionstoresCreateNestedManyWithoutStoresInput = {
    create?: XOR<bookeditionstoresCreateWithoutStoresInput, bookeditionstoresUncheckedCreateWithoutStoresInput> | bookeditionstoresCreateWithoutStoresInput[] | bookeditionstoresUncheckedCreateWithoutStoresInput[]
    connectOrCreate?: bookeditionstoresCreateOrConnectWithoutStoresInput | bookeditionstoresCreateOrConnectWithoutStoresInput[]
    createMany?: bookeditionstoresCreateManyStoresInputEnvelope
    connect?: bookeditionstoresWhereUniqueInput | bookeditionstoresWhereUniqueInput[]
  }

  export type damagedbooksCreateNestedManyWithoutStoresInput = {
    create?: XOR<damagedbooksCreateWithoutStoresInput, damagedbooksUncheckedCreateWithoutStoresInput> | damagedbooksCreateWithoutStoresInput[] | damagedbooksUncheckedCreateWithoutStoresInput[]
    connectOrCreate?: damagedbooksCreateOrConnectWithoutStoresInput | damagedbooksCreateOrConnectWithoutStoresInput[]
    createMany?: damagedbooksCreateManyStoresInputEnvelope
    connect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
  }

  export type bookeditionstoresUncheckedCreateNestedManyWithoutStoresInput = {
    create?: XOR<bookeditionstoresCreateWithoutStoresInput, bookeditionstoresUncheckedCreateWithoutStoresInput> | bookeditionstoresCreateWithoutStoresInput[] | bookeditionstoresUncheckedCreateWithoutStoresInput[]
    connectOrCreate?: bookeditionstoresCreateOrConnectWithoutStoresInput | bookeditionstoresCreateOrConnectWithoutStoresInput[]
    createMany?: bookeditionstoresCreateManyStoresInputEnvelope
    connect?: bookeditionstoresWhereUniqueInput | bookeditionstoresWhereUniqueInput[]
  }

  export type damagedbooksUncheckedCreateNestedManyWithoutStoresInput = {
    create?: XOR<damagedbooksCreateWithoutStoresInput, damagedbooksUncheckedCreateWithoutStoresInput> | damagedbooksCreateWithoutStoresInput[] | damagedbooksUncheckedCreateWithoutStoresInput[]
    connectOrCreate?: damagedbooksCreateOrConnectWithoutStoresInput | damagedbooksCreateOrConnectWithoutStoresInput[]
    createMany?: damagedbooksCreateManyStoresInputEnvelope
    connect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
  }

  export type bookeditionstoresUpdateManyWithoutStoresNestedInput = {
    create?: XOR<bookeditionstoresCreateWithoutStoresInput, bookeditionstoresUncheckedCreateWithoutStoresInput> | bookeditionstoresCreateWithoutStoresInput[] | bookeditionstoresUncheckedCreateWithoutStoresInput[]
    connectOrCreate?: bookeditionstoresCreateOrConnectWithoutStoresInput | bookeditionstoresCreateOrConnectWithoutStoresInput[]
    upsert?: bookeditionstoresUpsertWithWhereUniqueWithoutStoresInput | bookeditionstoresUpsertWithWhereUniqueWithoutStoresInput[]
    createMany?: bookeditionstoresCreateManyStoresInputEnvelope
    set?: bookeditionstoresWhereUniqueInput | bookeditionstoresWhereUniqueInput[]
    disconnect?: bookeditionstoresWhereUniqueInput | bookeditionstoresWhereUniqueInput[]
    delete?: bookeditionstoresWhereUniqueInput | bookeditionstoresWhereUniqueInput[]
    connect?: bookeditionstoresWhereUniqueInput | bookeditionstoresWhereUniqueInput[]
    update?: bookeditionstoresUpdateWithWhereUniqueWithoutStoresInput | bookeditionstoresUpdateWithWhereUniqueWithoutStoresInput[]
    updateMany?: bookeditionstoresUpdateManyWithWhereWithoutStoresInput | bookeditionstoresUpdateManyWithWhereWithoutStoresInput[]
    deleteMany?: bookeditionstoresScalarWhereInput | bookeditionstoresScalarWhereInput[]
  }

  export type damagedbooksUpdateManyWithoutStoresNestedInput = {
    create?: XOR<damagedbooksCreateWithoutStoresInput, damagedbooksUncheckedCreateWithoutStoresInput> | damagedbooksCreateWithoutStoresInput[] | damagedbooksUncheckedCreateWithoutStoresInput[]
    connectOrCreate?: damagedbooksCreateOrConnectWithoutStoresInput | damagedbooksCreateOrConnectWithoutStoresInput[]
    upsert?: damagedbooksUpsertWithWhereUniqueWithoutStoresInput | damagedbooksUpsertWithWhereUniqueWithoutStoresInput[]
    createMany?: damagedbooksCreateManyStoresInputEnvelope
    set?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    disconnect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    delete?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    connect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    update?: damagedbooksUpdateWithWhereUniqueWithoutStoresInput | damagedbooksUpdateWithWhereUniqueWithoutStoresInput[]
    updateMany?: damagedbooksUpdateManyWithWhereWithoutStoresInput | damagedbooksUpdateManyWithWhereWithoutStoresInput[]
    deleteMany?: damagedbooksScalarWhereInput | damagedbooksScalarWhereInput[]
  }

  export type bookeditionstoresUncheckedUpdateManyWithoutStoresNestedInput = {
    create?: XOR<bookeditionstoresCreateWithoutStoresInput, bookeditionstoresUncheckedCreateWithoutStoresInput> | bookeditionstoresCreateWithoutStoresInput[] | bookeditionstoresUncheckedCreateWithoutStoresInput[]
    connectOrCreate?: bookeditionstoresCreateOrConnectWithoutStoresInput | bookeditionstoresCreateOrConnectWithoutStoresInput[]
    upsert?: bookeditionstoresUpsertWithWhereUniqueWithoutStoresInput | bookeditionstoresUpsertWithWhereUniqueWithoutStoresInput[]
    createMany?: bookeditionstoresCreateManyStoresInputEnvelope
    set?: bookeditionstoresWhereUniqueInput | bookeditionstoresWhereUniqueInput[]
    disconnect?: bookeditionstoresWhereUniqueInput | bookeditionstoresWhereUniqueInput[]
    delete?: bookeditionstoresWhereUniqueInput | bookeditionstoresWhereUniqueInput[]
    connect?: bookeditionstoresWhereUniqueInput | bookeditionstoresWhereUniqueInput[]
    update?: bookeditionstoresUpdateWithWhereUniqueWithoutStoresInput | bookeditionstoresUpdateWithWhereUniqueWithoutStoresInput[]
    updateMany?: bookeditionstoresUpdateManyWithWhereWithoutStoresInput | bookeditionstoresUpdateManyWithWhereWithoutStoresInput[]
    deleteMany?: bookeditionstoresScalarWhereInput | bookeditionstoresScalarWhereInput[]
  }

  export type damagedbooksUncheckedUpdateManyWithoutStoresNestedInput = {
    create?: XOR<damagedbooksCreateWithoutStoresInput, damagedbooksUncheckedCreateWithoutStoresInput> | damagedbooksCreateWithoutStoresInput[] | damagedbooksUncheckedCreateWithoutStoresInput[]
    connectOrCreate?: damagedbooksCreateOrConnectWithoutStoresInput | damagedbooksCreateOrConnectWithoutStoresInput[]
    upsert?: damagedbooksUpsertWithWhereUniqueWithoutStoresInput | damagedbooksUpsertWithWhereUniqueWithoutStoresInput[]
    createMany?: damagedbooksCreateManyStoresInputEnvelope
    set?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    disconnect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    delete?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    connect?: damagedbooksWhereUniqueInput | damagedbooksWhereUniqueInput[]
    update?: damagedbooksUpdateWithWhereUniqueWithoutStoresInput | damagedbooksUpdateWithWhereUniqueWithoutStoresInput[]
    updateMany?: damagedbooksUpdateManyWithWhereWithoutStoresInput | damagedbooksUpdateManyWithWhereWithoutStoresInput[]
    deleteMany?: damagedbooksScalarWhereInput | damagedbooksScalarWhereInput[]
  }

  export type translatorbookCreateNestedManyWithoutTranslatorInput = {
    create?: XOR<translatorbookCreateWithoutTranslatorInput, translatorbookUncheckedCreateWithoutTranslatorInput> | translatorbookCreateWithoutTranslatorInput[] | translatorbookUncheckedCreateWithoutTranslatorInput[]
    connectOrCreate?: translatorbookCreateOrConnectWithoutTranslatorInput | translatorbookCreateOrConnectWithoutTranslatorInput[]
    createMany?: translatorbookCreateManyTranslatorInputEnvelope
    connect?: translatorbookWhereUniqueInput | translatorbookWhereUniqueInput[]
  }

  export type translatorbookUncheckedCreateNestedManyWithoutTranslatorInput = {
    create?: XOR<translatorbookCreateWithoutTranslatorInput, translatorbookUncheckedCreateWithoutTranslatorInput> | translatorbookCreateWithoutTranslatorInput[] | translatorbookUncheckedCreateWithoutTranslatorInput[]
    connectOrCreate?: translatorbookCreateOrConnectWithoutTranslatorInput | translatorbookCreateOrConnectWithoutTranslatorInput[]
    createMany?: translatorbookCreateManyTranslatorInputEnvelope
    connect?: translatorbookWhereUniqueInput | translatorbookWhereUniqueInput[]
  }

  export type translatorbookUpdateManyWithoutTranslatorNestedInput = {
    create?: XOR<translatorbookCreateWithoutTranslatorInput, translatorbookUncheckedCreateWithoutTranslatorInput> | translatorbookCreateWithoutTranslatorInput[] | translatorbookUncheckedCreateWithoutTranslatorInput[]
    connectOrCreate?: translatorbookCreateOrConnectWithoutTranslatorInput | translatorbookCreateOrConnectWithoutTranslatorInput[]
    upsert?: translatorbookUpsertWithWhereUniqueWithoutTranslatorInput | translatorbookUpsertWithWhereUniqueWithoutTranslatorInput[]
    createMany?: translatorbookCreateManyTranslatorInputEnvelope
    set?: translatorbookWhereUniqueInput | translatorbookWhereUniqueInput[]
    disconnect?: translatorbookWhereUniqueInput | translatorbookWhereUniqueInput[]
    delete?: translatorbookWhereUniqueInput | translatorbookWhereUniqueInput[]
    connect?: translatorbookWhereUniqueInput | translatorbookWhereUniqueInput[]
    update?: translatorbookUpdateWithWhereUniqueWithoutTranslatorInput | translatorbookUpdateWithWhereUniqueWithoutTranslatorInput[]
    updateMany?: translatorbookUpdateManyWithWhereWithoutTranslatorInput | translatorbookUpdateManyWithWhereWithoutTranslatorInput[]
    deleteMany?: translatorbookScalarWhereInput | translatorbookScalarWhereInput[]
  }

  export type translatorbookUncheckedUpdateManyWithoutTranslatorNestedInput = {
    create?: XOR<translatorbookCreateWithoutTranslatorInput, translatorbookUncheckedCreateWithoutTranslatorInput> | translatorbookCreateWithoutTranslatorInput[] | translatorbookUncheckedCreateWithoutTranslatorInput[]
    connectOrCreate?: translatorbookCreateOrConnectWithoutTranslatorInput | translatorbookCreateOrConnectWithoutTranslatorInput[]
    upsert?: translatorbookUpsertWithWhereUniqueWithoutTranslatorInput | translatorbookUpsertWithWhereUniqueWithoutTranslatorInput[]
    createMany?: translatorbookCreateManyTranslatorInputEnvelope
    set?: translatorbookWhereUniqueInput | translatorbookWhereUniqueInput[]
    disconnect?: translatorbookWhereUniqueInput | translatorbookWhereUniqueInput[]
    delete?: translatorbookWhereUniqueInput | translatorbookWhereUniqueInput[]
    connect?: translatorbookWhereUniqueInput | translatorbookWhereUniqueInput[]
    update?: translatorbookUpdateWithWhereUniqueWithoutTranslatorInput | translatorbookUpdateWithWhereUniqueWithoutTranslatorInput[]
    updateMany?: translatorbookUpdateManyWithWhereWithoutTranslatorInput | translatorbookUpdateManyWithWhereWithoutTranslatorInput[]
    deleteMany?: translatorbookScalarWhereInput | translatorbookScalarWhereInput[]
  }

  export type booksCreateNestedOneWithoutTranslatorbookInput = {
    create?: XOR<booksCreateWithoutTranslatorbookInput, booksUncheckedCreateWithoutTranslatorbookInput>
    connectOrCreate?: booksCreateOrConnectWithoutTranslatorbookInput
    connect?: booksWhereUniqueInput
  }

  export type translatorCreateNestedOneWithoutTranslatorbookInput = {
    create?: XOR<translatorCreateWithoutTranslatorbookInput, translatorUncheckedCreateWithoutTranslatorbookInput>
    connectOrCreate?: translatorCreateOrConnectWithoutTranslatorbookInput
    connect?: translatorWhereUniqueInput
  }

  export type Enumtranslatorbook_StatusFieldUpdateOperationsInput = {
    set?: $Enums.translatorbook_Status
  }

  export type booksUpdateOneRequiredWithoutTranslatorbookNestedInput = {
    create?: XOR<booksCreateWithoutTranslatorbookInput, booksUncheckedCreateWithoutTranslatorbookInput>
    connectOrCreate?: booksCreateOrConnectWithoutTranslatorbookInput
    upsert?: booksUpsertWithoutTranslatorbookInput
    connect?: booksWhereUniqueInput
    update?: XOR<XOR<booksUpdateToOneWithWhereWithoutTranslatorbookInput, booksUpdateWithoutTranslatorbookInput>, booksUncheckedUpdateWithoutTranslatorbookInput>
  }

  export type translatorUpdateOneRequiredWithoutTranslatorbookNestedInput = {
    create?: XOR<translatorCreateWithoutTranslatorbookInput, translatorUncheckedCreateWithoutTranslatorbookInput>
    connectOrCreate?: translatorCreateOrConnectWithoutTranslatorbookInput
    upsert?: translatorUpsertWithoutTranslatorbookInput
    connect?: translatorWhereUniqueInput
    update?: XOR<XOR<translatorUpdateToOneWithWhereWithoutTranslatorbookInput, translatorUpdateWithoutTranslatorbookInput>, translatorUncheckedUpdateWithoutTranslatorbookInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedEnumbooks_productionstatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.books_productionstatus | Enumbooks_productionstatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.books_productionstatus[] | null
    notIn?: $Enums.books_productionstatus[] | null
    not?: NestedEnumbooks_productionstatusNullableFilter<$PrismaModel> | $Enums.books_productionstatus | null
  }

  export type NestedEnumbooks_productionstatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.books_productionstatus | Enumbooks_productionstatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.books_productionstatus[] | null
    notIn?: $Enums.books_productionstatus[] | null
    not?: NestedEnumbooks_productionstatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.books_productionstatus | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumbooks_productionstatusNullableFilter<$PrismaModel>
    _max?: NestedEnumbooks_productionstatusNullableFilter<$PrismaModel>
  }

  export type NestedEnumdamagedbooks_typeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.damagedbooks_type | Enumdamagedbooks_typeFieldRefInput<$PrismaModel> | null
    in?: $Enums.damagedbooks_type[] | null
    notIn?: $Enums.damagedbooks_type[] | null
    not?: NestedEnumdamagedbooks_typeNullableFilter<$PrismaModel> | $Enums.damagedbooks_type | null
  }

  export type NestedEnumdamagedbooks_typeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.damagedbooks_type | Enumdamagedbooks_typeFieldRefInput<$PrismaModel> | null
    in?: $Enums.damagedbooks_type[] | null
    notIn?: $Enums.damagedbooks_type[] | null
    not?: NestedEnumdamagedbooks_typeNullableWithAggregatesFilter<$PrismaModel> | $Enums.damagedbooks_type | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumdamagedbooks_typeNullableFilter<$PrismaModel>
    _max?: NestedEnumdamagedbooks_typeNullableFilter<$PrismaModel>
  }

  export type NestedEnumprintorder_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.printorder_status | Enumprintorder_statusFieldRefInput<$PrismaModel>
    in?: $Enums.printorder_status[]
    notIn?: $Enums.printorder_status[]
    not?: NestedEnumprintorder_statusFilter<$PrismaModel> | $Enums.printorder_status
  }

  export type NestedEnumprintorder_trackingFilter<$PrismaModel = never> = {
    equals?: $Enums.printorder_tracking | Enumprintorder_trackingFieldRefInput<$PrismaModel>
    in?: $Enums.printorder_tracking[]
    notIn?: $Enums.printorder_tracking[]
    not?: NestedEnumprintorder_trackingFilter<$PrismaModel> | $Enums.printorder_tracking
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumprintorder_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.printorder_status | Enumprintorder_statusFieldRefInput<$PrismaModel>
    in?: $Enums.printorder_status[]
    notIn?: $Enums.printorder_status[]
    not?: NestedEnumprintorder_statusWithAggregatesFilter<$PrismaModel> | $Enums.printorder_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumprintorder_statusFilter<$PrismaModel>
    _max?: NestedEnumprintorder_statusFilter<$PrismaModel>
  }

  export type NestedEnumprintorder_trackingWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.printorder_tracking | Enumprintorder_trackingFieldRefInput<$PrismaModel>
    in?: $Enums.printorder_tracking[]
    notIn?: $Enums.printorder_tracking[]
    not?: NestedEnumprintorder_trackingWithAggregatesFilter<$PrismaModel> | $Enums.printorder_tracking
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumprintorder_trackingFilter<$PrismaModel>
    _max?: NestedEnumprintorder_trackingFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumtranslatorbook_StatusFilter<$PrismaModel = never> = {
    equals?: $Enums.translatorbook_Status | Enumtranslatorbook_StatusFieldRefInput<$PrismaModel>
    in?: $Enums.translatorbook_Status[]
    notIn?: $Enums.translatorbook_Status[]
    not?: NestedEnumtranslatorbook_StatusFilter<$PrismaModel> | $Enums.translatorbook_Status
  }

  export type NestedEnumtranslatorbook_StatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.translatorbook_Status | Enumtranslatorbook_StatusFieldRefInput<$PrismaModel>
    in?: $Enums.translatorbook_Status[]
    notIn?: $Enums.translatorbook_Status[]
    not?: NestedEnumtranslatorbook_StatusWithAggregatesFilter<$PrismaModel> | $Enums.translatorbook_Status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumtranslatorbook_StatusFilter<$PrismaModel>
    _max?: NestedEnumtranslatorbook_StatusFilter<$PrismaModel>
  }

  export type damagedbooksCreateWithoutAccountsInput = {
    type?: $Enums.damagedbooks_type | null
    count?: number | null
    memo?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    books?: booksCreateNestedOneWithoutDamagedbooksInput
    bookedition?: bookeditionCreateNestedOneWithoutDamagedbooksInput
    stores?: storesCreateNestedOneWithoutDamagedbooksInput
  }

  export type damagedbooksUncheckedCreateWithoutAccountsInput = {
    id?: number
    type?: $Enums.damagedbooks_type | null
    book_id?: number | null
    store_id?: number | null
    edition_id?: number | null
    count?: number | null
    memo?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type damagedbooksCreateOrConnectWithoutAccountsInput = {
    where: damagedbooksWhereUniqueInput
    create: XOR<damagedbooksCreateWithoutAccountsInput, damagedbooksUncheckedCreateWithoutAccountsInput>
  }

  export type damagedbooksCreateManyAccountsInputEnvelope = {
    data: damagedbooksCreateManyAccountsInput | damagedbooksCreateManyAccountsInput[]
    skipDuplicates?: boolean
  }

  export type rolesCreateWithoutAccountsInput = {
    role_status?: boolean
    role_name: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type rolesUncheckedCreateWithoutAccountsInput = {
    id?: number
    role_status?: boolean
    role_name: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type rolesCreateOrConnectWithoutAccountsInput = {
    where: rolesWhereUniqueInput
    create: XOR<rolesCreateWithoutAccountsInput, rolesUncheckedCreateWithoutAccountsInput>
  }

  export type rolesCreateManyAccountsInputEnvelope = {
    data: rolesCreateManyAccountsInput | rolesCreateManyAccountsInput[]
    skipDuplicates?: boolean
  }

  export type damagedbooksUpsertWithWhereUniqueWithoutAccountsInput = {
    where: damagedbooksWhereUniqueInput
    update: XOR<damagedbooksUpdateWithoutAccountsInput, damagedbooksUncheckedUpdateWithoutAccountsInput>
    create: XOR<damagedbooksCreateWithoutAccountsInput, damagedbooksUncheckedCreateWithoutAccountsInput>
  }

  export type damagedbooksUpdateWithWhereUniqueWithoutAccountsInput = {
    where: damagedbooksWhereUniqueInput
    data: XOR<damagedbooksUpdateWithoutAccountsInput, damagedbooksUncheckedUpdateWithoutAccountsInput>
  }

  export type damagedbooksUpdateManyWithWhereWithoutAccountsInput = {
    where: damagedbooksScalarWhereInput
    data: XOR<damagedbooksUpdateManyMutationInput, damagedbooksUncheckedUpdateManyWithoutAccountsInput>
  }

  export type damagedbooksScalarWhereInput = {
    AND?: damagedbooksScalarWhereInput | damagedbooksScalarWhereInput[]
    OR?: damagedbooksScalarWhereInput[]
    NOT?: damagedbooksScalarWhereInput | damagedbooksScalarWhereInput[]
    id?: IntFilter<"damagedbooks"> | number
    type?: Enumdamagedbooks_typeNullableFilter<"damagedbooks"> | $Enums.damagedbooks_type | null
    book_id?: IntNullableFilter<"damagedbooks"> | number | null
    store_id?: IntNullableFilter<"damagedbooks"> | number | null
    edition_id?: IntNullableFilter<"damagedbooks"> | number | null
    count?: IntNullableFilter<"damagedbooks"> | number | null
    memo?: StringNullableFilter<"damagedbooks"> | string | null
    account_id?: IntNullableFilter<"damagedbooks"> | number | null
    is_deleted?: BoolFilter<"damagedbooks"> | boolean
    updatedAt?: DateTimeFilter<"damagedbooks"> | Date | string
    createdAt?: DateTimeFilter<"damagedbooks"> | Date | string
    deletedAt?: DateTimeFilter<"damagedbooks"> | Date | string
  }

  export type rolesUpsertWithWhereUniqueWithoutAccountsInput = {
    where: rolesWhereUniqueInput
    update: XOR<rolesUpdateWithoutAccountsInput, rolesUncheckedUpdateWithoutAccountsInput>
    create: XOR<rolesCreateWithoutAccountsInput, rolesUncheckedCreateWithoutAccountsInput>
  }

  export type rolesUpdateWithWhereUniqueWithoutAccountsInput = {
    where: rolesWhereUniqueInput
    data: XOR<rolesUpdateWithoutAccountsInput, rolesUncheckedUpdateWithoutAccountsInput>
  }

  export type rolesUpdateManyWithWhereWithoutAccountsInput = {
    where: rolesScalarWhereInput
    data: XOR<rolesUpdateManyMutationInput, rolesUncheckedUpdateManyWithoutAccountsInput>
  }

  export type rolesScalarWhereInput = {
    AND?: rolesScalarWhereInput | rolesScalarWhereInput[]
    OR?: rolesScalarWhereInput[]
    NOT?: rolesScalarWhereInput | rolesScalarWhereInput[]
    id?: IntFilter<"roles"> | number
    role_status?: BoolFilter<"roles"> | boolean
    role_name?: StringFilter<"roles"> | string
    accountId?: IntFilter<"roles"> | number
    is_deleted?: BoolFilter<"roles"> | boolean
    updatedAt?: DateTimeFilter<"roles"> | Date | string
    createdAt?: DateTimeFilter<"roles"> | Date | string
    deletedAt?: DateTimeFilter<"roles"> | Date | string
  }

  export type booksCreateWithoutBookeditionInput = {
    unique_identification_code: string
    isbn?: string | null
    title: string
    author: string
    translator?: string | null
    designer?: string | null
    language: string
    edition: string
    category: string
    publication_year: string
    print_batch_id?: string | null
    book_sku: string
    number_of_pages?: number | null
    info?: string | null
    book_image_url?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    productionstatus?: $Enums.books_productionstatus | null
    default_edition_id?: string | null
    damagedbooks?: damagedbooksCreateNestedManyWithoutBooksInput
    translatorbook?: translatorbookCreateNestedManyWithoutBooksInput
  }

  export type booksUncheckedCreateWithoutBookeditionInput = {
    id?: number
    unique_identification_code: string
    isbn?: string | null
    title: string
    author: string
    translator?: string | null
    designer?: string | null
    language: string
    edition: string
    category: string
    publication_year: string
    print_batch_id?: string | null
    book_sku: string
    number_of_pages?: number | null
    info?: string | null
    book_image_url?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    productionstatus?: $Enums.books_productionstatus | null
    default_edition_id?: string | null
    damagedbooks?: damagedbooksUncheckedCreateNestedManyWithoutBooksInput
    translatorbook?: translatorbookUncheckedCreateNestedManyWithoutBooksInput
  }

  export type booksCreateOrConnectWithoutBookeditionInput = {
    where: booksWhereUniqueInput
    create: XOR<booksCreateWithoutBookeditionInput, booksUncheckedCreateWithoutBookeditionInput>
  }

  export type bookeditionstoresCreateWithoutBookeditionInput = {
    quantity?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    stores: storesCreateNestedOneWithoutBookeditionstoresInput
  }

  export type bookeditionstoresUncheckedCreateWithoutBookeditionInput = {
    id?: number
    quantity?: number | null
    storeId: number
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type bookeditionstoresCreateOrConnectWithoutBookeditionInput = {
    where: bookeditionstoresWhereUniqueInput
    create: XOR<bookeditionstoresCreateWithoutBookeditionInput, bookeditionstoresUncheckedCreateWithoutBookeditionInput>
  }

  export type bookeditionstoresCreateManyBookeditionInputEnvelope = {
    data: bookeditionstoresCreateManyBookeditionInput | bookeditionstoresCreateManyBookeditionInput[]
    skipDuplicates?: boolean
  }

  export type bookshopeditionsCreateWithoutBookeditionInput = {
    quantity?: number
    price_per_peice?: number | null
    total_price?: number | null
    memo?: string | null
    already_paid?: number | null
    remaining_amount?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    bookshopes: bookshopesCreateNestedOneWithoutBookshopeditionsInput
  }

  export type bookshopeditionsUncheckedCreateWithoutBookeditionInput = {
    id?: number
    bookShopId: number
    quantity?: number
    price_per_peice?: number | null
    total_price?: number | null
    memo?: string | null
    already_paid?: number | null
    remaining_amount?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type bookshopeditionsCreateOrConnectWithoutBookeditionInput = {
    where: bookshopeditionsWhereUniqueInput
    create: XOR<bookshopeditionsCreateWithoutBookeditionInput, bookshopeditionsUncheckedCreateWithoutBookeditionInput>
  }

  export type bookshopeditionsCreateManyBookeditionInputEnvelope = {
    data: bookshopeditionsCreateManyBookeditionInput | bookshopeditionsCreateManyBookeditionInput[]
    skipDuplicates?: boolean
  }

  export type damagedbooksCreateWithoutBookeditionInput = {
    type?: $Enums.damagedbooks_type | null
    count?: number | null
    memo?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    accounts?: accountsCreateNestedOneWithoutDamagedbooksInput
    books?: booksCreateNestedOneWithoutDamagedbooksInput
    stores?: storesCreateNestedOneWithoutDamagedbooksInput
  }

  export type damagedbooksUncheckedCreateWithoutBookeditionInput = {
    id?: number
    type?: $Enums.damagedbooks_type | null
    book_id?: number | null
    store_id?: number | null
    count?: number | null
    memo?: string | null
    account_id?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type damagedbooksCreateOrConnectWithoutBookeditionInput = {
    where: damagedbooksWhereUniqueInput
    create: XOR<damagedbooksCreateWithoutBookeditionInput, damagedbooksUncheckedCreateWithoutBookeditionInput>
  }

  export type damagedbooksCreateManyBookeditionInputEnvelope = {
    data: damagedbooksCreateManyBookeditionInput | damagedbooksCreateManyBookeditionInput[]
    skipDuplicates?: boolean
  }

  export type booksUpsertWithoutBookeditionInput = {
    update: XOR<booksUpdateWithoutBookeditionInput, booksUncheckedUpdateWithoutBookeditionInput>
    create: XOR<booksCreateWithoutBookeditionInput, booksUncheckedCreateWithoutBookeditionInput>
    where?: booksWhereInput
  }

  export type booksUpdateToOneWithWhereWithoutBookeditionInput = {
    where?: booksWhereInput
    data: XOR<booksUpdateWithoutBookeditionInput, booksUncheckedUpdateWithoutBookeditionInput>
  }

  export type booksUpdateWithoutBookeditionInput = {
    unique_identification_code?: StringFieldUpdateOperationsInput | string
    isbn?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    translator?: NullableStringFieldUpdateOperationsInput | string | null
    designer?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    edition?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    publication_year?: StringFieldUpdateOperationsInput | string
    print_batch_id?: NullableStringFieldUpdateOperationsInput | string | null
    book_sku?: StringFieldUpdateOperationsInput | string
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    info?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    productionstatus?: NullableEnumbooks_productionstatusFieldUpdateOperationsInput | $Enums.books_productionstatus | null
    default_edition_id?: NullableStringFieldUpdateOperationsInput | string | null
    damagedbooks?: damagedbooksUpdateManyWithoutBooksNestedInput
    translatorbook?: translatorbookUpdateManyWithoutBooksNestedInput
  }

  export type booksUncheckedUpdateWithoutBookeditionInput = {
    id?: IntFieldUpdateOperationsInput | number
    unique_identification_code?: StringFieldUpdateOperationsInput | string
    isbn?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    translator?: NullableStringFieldUpdateOperationsInput | string | null
    designer?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    edition?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    publication_year?: StringFieldUpdateOperationsInput | string
    print_batch_id?: NullableStringFieldUpdateOperationsInput | string | null
    book_sku?: StringFieldUpdateOperationsInput | string
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    info?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    productionstatus?: NullableEnumbooks_productionstatusFieldUpdateOperationsInput | $Enums.books_productionstatus | null
    default_edition_id?: NullableStringFieldUpdateOperationsInput | string | null
    damagedbooks?: damagedbooksUncheckedUpdateManyWithoutBooksNestedInput
    translatorbook?: translatorbookUncheckedUpdateManyWithoutBooksNestedInput
  }

  export type bookeditionstoresUpsertWithWhereUniqueWithoutBookeditionInput = {
    where: bookeditionstoresWhereUniqueInput
    update: XOR<bookeditionstoresUpdateWithoutBookeditionInput, bookeditionstoresUncheckedUpdateWithoutBookeditionInput>
    create: XOR<bookeditionstoresCreateWithoutBookeditionInput, bookeditionstoresUncheckedCreateWithoutBookeditionInput>
  }

  export type bookeditionstoresUpdateWithWhereUniqueWithoutBookeditionInput = {
    where: bookeditionstoresWhereUniqueInput
    data: XOR<bookeditionstoresUpdateWithoutBookeditionInput, bookeditionstoresUncheckedUpdateWithoutBookeditionInput>
  }

  export type bookeditionstoresUpdateManyWithWhereWithoutBookeditionInput = {
    where: bookeditionstoresScalarWhereInput
    data: XOR<bookeditionstoresUpdateManyMutationInput, bookeditionstoresUncheckedUpdateManyWithoutBookeditionInput>
  }

  export type bookeditionstoresScalarWhereInput = {
    AND?: bookeditionstoresScalarWhereInput | bookeditionstoresScalarWhereInput[]
    OR?: bookeditionstoresScalarWhereInput[]
    NOT?: bookeditionstoresScalarWhereInput | bookeditionstoresScalarWhereInput[]
    id?: IntFilter<"bookeditionstores"> | number
    editionId?: IntFilter<"bookeditionstores"> | number
    quantity?: IntNullableFilter<"bookeditionstores"> | number | null
    storeId?: IntFilter<"bookeditionstores"> | number
    is_deleted?: BoolFilter<"bookeditionstores"> | boolean
    updatedAt?: DateTimeFilter<"bookeditionstores"> | Date | string
    createdAt?: DateTimeFilter<"bookeditionstores"> | Date | string
    deletedAt?: DateTimeFilter<"bookeditionstores"> | Date | string
  }

  export type bookshopeditionsUpsertWithWhereUniqueWithoutBookeditionInput = {
    where: bookshopeditionsWhereUniqueInput
    update: XOR<bookshopeditionsUpdateWithoutBookeditionInput, bookshopeditionsUncheckedUpdateWithoutBookeditionInput>
    create: XOR<bookshopeditionsCreateWithoutBookeditionInput, bookshopeditionsUncheckedCreateWithoutBookeditionInput>
  }

  export type bookshopeditionsUpdateWithWhereUniqueWithoutBookeditionInput = {
    where: bookshopeditionsWhereUniqueInput
    data: XOR<bookshopeditionsUpdateWithoutBookeditionInput, bookshopeditionsUncheckedUpdateWithoutBookeditionInput>
  }

  export type bookshopeditionsUpdateManyWithWhereWithoutBookeditionInput = {
    where: bookshopeditionsScalarWhereInput
    data: XOR<bookshopeditionsUpdateManyMutationInput, bookshopeditionsUncheckedUpdateManyWithoutBookeditionInput>
  }

  export type bookshopeditionsScalarWhereInput = {
    AND?: bookshopeditionsScalarWhereInput | bookshopeditionsScalarWhereInput[]
    OR?: bookshopeditionsScalarWhereInput[]
    NOT?: bookshopeditionsScalarWhereInput | bookshopeditionsScalarWhereInput[]
    id?: IntFilter<"bookshopeditions"> | number
    bookShopId?: IntFilter<"bookshopeditions"> | number
    bookEditionId?: IntFilter<"bookshopeditions"> | number
    quantity?: IntFilter<"bookshopeditions"> | number
    price_per_peice?: FloatNullableFilter<"bookshopeditions"> | number | null
    total_price?: FloatNullableFilter<"bookshopeditions"> | number | null
    memo?: StringNullableFilter<"bookshopeditions"> | string | null
    already_paid?: FloatNullableFilter<"bookshopeditions"> | number | null
    remaining_amount?: FloatNullableFilter<"bookshopeditions"> | number | null
    is_deleted?: BoolFilter<"bookshopeditions"> | boolean
    updatedAt?: DateTimeFilter<"bookshopeditions"> | Date | string
    createdAt?: DateTimeFilter<"bookshopeditions"> | Date | string
    deletedAt?: DateTimeFilter<"bookshopeditions"> | Date | string
  }

  export type damagedbooksUpsertWithWhereUniqueWithoutBookeditionInput = {
    where: damagedbooksWhereUniqueInput
    update: XOR<damagedbooksUpdateWithoutBookeditionInput, damagedbooksUncheckedUpdateWithoutBookeditionInput>
    create: XOR<damagedbooksCreateWithoutBookeditionInput, damagedbooksUncheckedCreateWithoutBookeditionInput>
  }

  export type damagedbooksUpdateWithWhereUniqueWithoutBookeditionInput = {
    where: damagedbooksWhereUniqueInput
    data: XOR<damagedbooksUpdateWithoutBookeditionInput, damagedbooksUncheckedUpdateWithoutBookeditionInput>
  }

  export type damagedbooksUpdateManyWithWhereWithoutBookeditionInput = {
    where: damagedbooksScalarWhereInput
    data: XOR<damagedbooksUpdateManyMutationInput, damagedbooksUncheckedUpdateManyWithoutBookeditionInput>
  }

  export type bookeditionCreateWithoutBookeditionstoresInput = {
    edition_name: string
    selling_price?: number | null
    production_price?: number | null
    printing_cost?: number | null
    binding_cost?: number | null
    design_cost?: number | null
    translation_cost?: number | null
    memo?: string | null
    book_image_url?: string | null
    total_print_count?: number | null
    book_id?: number | null
    number_of_pages?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    editing_cost?: number | null
    other_expenses?: number | null
    transportation_cost?: number | null
    books: booksCreateNestedOneWithoutBookeditionInput
    bookshopeditions?: bookshopeditionsCreateNestedManyWithoutBookeditionInput
    damagedbooks?: damagedbooksCreateNestedManyWithoutBookeditionInput
  }

  export type bookeditionUncheckedCreateWithoutBookeditionstoresInput = {
    id?: number
    edition_name: string
    selling_price?: number | null
    production_price?: number | null
    printing_cost?: number | null
    binding_cost?: number | null
    design_cost?: number | null
    translation_cost?: number | null
    memo?: string | null
    book_image_url?: string | null
    total_print_count?: number | null
    book_id?: number | null
    number_of_pages?: number | null
    bookId: number
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    editing_cost?: number | null
    other_expenses?: number | null
    transportation_cost?: number | null
    bookshopeditions?: bookshopeditionsUncheckedCreateNestedManyWithoutBookeditionInput
    damagedbooks?: damagedbooksUncheckedCreateNestedManyWithoutBookeditionInput
  }

  export type bookeditionCreateOrConnectWithoutBookeditionstoresInput = {
    where: bookeditionWhereUniqueInput
    create: XOR<bookeditionCreateWithoutBookeditionstoresInput, bookeditionUncheckedCreateWithoutBookeditionstoresInput>
  }

  export type storesCreateWithoutBookeditionstoresInput = {
    name: string
    location: string
    phone?: string | null
    email?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    damagedbooks?: damagedbooksCreateNestedManyWithoutStoresInput
  }

  export type storesUncheckedCreateWithoutBookeditionstoresInput = {
    id?: number
    name: string
    location: string
    phone?: string | null
    email?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    damagedbooks?: damagedbooksUncheckedCreateNestedManyWithoutStoresInput
  }

  export type storesCreateOrConnectWithoutBookeditionstoresInput = {
    where: storesWhereUniqueInput
    create: XOR<storesCreateWithoutBookeditionstoresInput, storesUncheckedCreateWithoutBookeditionstoresInput>
  }

  export type bookeditionUpsertWithoutBookeditionstoresInput = {
    update: XOR<bookeditionUpdateWithoutBookeditionstoresInput, bookeditionUncheckedUpdateWithoutBookeditionstoresInput>
    create: XOR<bookeditionCreateWithoutBookeditionstoresInput, bookeditionUncheckedCreateWithoutBookeditionstoresInput>
    where?: bookeditionWhereInput
  }

  export type bookeditionUpdateToOneWithWhereWithoutBookeditionstoresInput = {
    where?: bookeditionWhereInput
    data: XOR<bookeditionUpdateWithoutBookeditionstoresInput, bookeditionUncheckedUpdateWithoutBookeditionstoresInput>
  }

  export type bookeditionUpdateWithoutBookeditionstoresInput = {
    edition_name?: StringFieldUpdateOperationsInput | string
    selling_price?: NullableFloatFieldUpdateOperationsInput | number | null
    production_price?: NullableFloatFieldUpdateOperationsInput | number | null
    printing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    binding_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    translation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    total_print_count?: NullableIntFieldUpdateOperationsInput | number | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    other_expenses?: NullableFloatFieldUpdateOperationsInput | number | null
    transportation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    books?: booksUpdateOneRequiredWithoutBookeditionNestedInput
    bookshopeditions?: bookshopeditionsUpdateManyWithoutBookeditionNestedInput
    damagedbooks?: damagedbooksUpdateManyWithoutBookeditionNestedInput
  }

  export type bookeditionUncheckedUpdateWithoutBookeditionstoresInput = {
    id?: IntFieldUpdateOperationsInput | number
    edition_name?: StringFieldUpdateOperationsInput | string
    selling_price?: NullableFloatFieldUpdateOperationsInput | number | null
    production_price?: NullableFloatFieldUpdateOperationsInput | number | null
    printing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    binding_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    translation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    total_print_count?: NullableIntFieldUpdateOperationsInput | number | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    bookId?: IntFieldUpdateOperationsInput | number
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    other_expenses?: NullableFloatFieldUpdateOperationsInput | number | null
    transportation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    bookshopeditions?: bookshopeditionsUncheckedUpdateManyWithoutBookeditionNestedInput
    damagedbooks?: damagedbooksUncheckedUpdateManyWithoutBookeditionNestedInput
  }

  export type storesUpsertWithoutBookeditionstoresInput = {
    update: XOR<storesUpdateWithoutBookeditionstoresInput, storesUncheckedUpdateWithoutBookeditionstoresInput>
    create: XOR<storesCreateWithoutBookeditionstoresInput, storesUncheckedCreateWithoutBookeditionstoresInput>
    where?: storesWhereInput
  }

  export type storesUpdateToOneWithWhereWithoutBookeditionstoresInput = {
    where?: storesWhereInput
    data: XOR<storesUpdateWithoutBookeditionstoresInput, storesUncheckedUpdateWithoutBookeditionstoresInput>
  }

  export type storesUpdateWithoutBookeditionstoresInput = {
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    damagedbooks?: damagedbooksUpdateManyWithoutStoresNestedInput
  }

  export type storesUncheckedUpdateWithoutBookeditionstoresInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    damagedbooks?: damagedbooksUncheckedUpdateManyWithoutStoresNestedInput
  }

  export type bookeditionCreateWithoutBooksInput = {
    edition_name: string
    selling_price?: number | null
    production_price?: number | null
    printing_cost?: number | null
    binding_cost?: number | null
    design_cost?: number | null
    translation_cost?: number | null
    memo?: string | null
    book_image_url?: string | null
    total_print_count?: number | null
    book_id?: number | null
    number_of_pages?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    editing_cost?: number | null
    other_expenses?: number | null
    transportation_cost?: number | null
    bookeditionstores?: bookeditionstoresCreateNestedManyWithoutBookeditionInput
    bookshopeditions?: bookshopeditionsCreateNestedManyWithoutBookeditionInput
    damagedbooks?: damagedbooksCreateNestedManyWithoutBookeditionInput
  }

  export type bookeditionUncheckedCreateWithoutBooksInput = {
    id?: number
    edition_name: string
    selling_price?: number | null
    production_price?: number | null
    printing_cost?: number | null
    binding_cost?: number | null
    design_cost?: number | null
    translation_cost?: number | null
    memo?: string | null
    book_image_url?: string | null
    total_print_count?: number | null
    book_id?: number | null
    number_of_pages?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    editing_cost?: number | null
    other_expenses?: number | null
    transportation_cost?: number | null
    bookeditionstores?: bookeditionstoresUncheckedCreateNestedManyWithoutBookeditionInput
    bookshopeditions?: bookshopeditionsUncheckedCreateNestedManyWithoutBookeditionInput
    damagedbooks?: damagedbooksUncheckedCreateNestedManyWithoutBookeditionInput
  }

  export type bookeditionCreateOrConnectWithoutBooksInput = {
    where: bookeditionWhereUniqueInput
    create: XOR<bookeditionCreateWithoutBooksInput, bookeditionUncheckedCreateWithoutBooksInput>
  }

  export type bookeditionCreateManyBooksInputEnvelope = {
    data: bookeditionCreateManyBooksInput | bookeditionCreateManyBooksInput[]
    skipDuplicates?: boolean
  }

  export type damagedbooksCreateWithoutBooksInput = {
    type?: $Enums.damagedbooks_type | null
    count?: number | null
    memo?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    accounts?: accountsCreateNestedOneWithoutDamagedbooksInput
    bookedition?: bookeditionCreateNestedOneWithoutDamagedbooksInput
    stores?: storesCreateNestedOneWithoutDamagedbooksInput
  }

  export type damagedbooksUncheckedCreateWithoutBooksInput = {
    id?: number
    type?: $Enums.damagedbooks_type | null
    store_id?: number | null
    edition_id?: number | null
    count?: number | null
    memo?: string | null
    account_id?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type damagedbooksCreateOrConnectWithoutBooksInput = {
    where: damagedbooksWhereUniqueInput
    create: XOR<damagedbooksCreateWithoutBooksInput, damagedbooksUncheckedCreateWithoutBooksInput>
  }

  export type damagedbooksCreateManyBooksInputEnvelope = {
    data: damagedbooksCreateManyBooksInput | damagedbooksCreateManyBooksInput[]
    skipDuplicates?: boolean
  }

  export type translatorbookCreateWithoutBooksInput = {
    book_id?: number | null
    Status?: $Enums.translatorbook_Status
    startDate?: Date | string | null
    endDate?: Date | string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    translator: translatorCreateNestedOneWithoutTranslatorbookInput
  }

  export type translatorbookUncheckedCreateWithoutBooksInput = {
    id?: number
    book_id?: number | null
    translator_id: number
    Status?: $Enums.translatorbook_Status
    startDate?: Date | string | null
    endDate?: Date | string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type translatorbookCreateOrConnectWithoutBooksInput = {
    where: translatorbookWhereUniqueInput
    create: XOR<translatorbookCreateWithoutBooksInput, translatorbookUncheckedCreateWithoutBooksInput>
  }

  export type translatorbookCreateManyBooksInputEnvelope = {
    data: translatorbookCreateManyBooksInput | translatorbookCreateManyBooksInput[]
    skipDuplicates?: boolean
  }

  export type bookeditionUpsertWithWhereUniqueWithoutBooksInput = {
    where: bookeditionWhereUniqueInput
    update: XOR<bookeditionUpdateWithoutBooksInput, bookeditionUncheckedUpdateWithoutBooksInput>
    create: XOR<bookeditionCreateWithoutBooksInput, bookeditionUncheckedCreateWithoutBooksInput>
  }

  export type bookeditionUpdateWithWhereUniqueWithoutBooksInput = {
    where: bookeditionWhereUniqueInput
    data: XOR<bookeditionUpdateWithoutBooksInput, bookeditionUncheckedUpdateWithoutBooksInput>
  }

  export type bookeditionUpdateManyWithWhereWithoutBooksInput = {
    where: bookeditionScalarWhereInput
    data: XOR<bookeditionUpdateManyMutationInput, bookeditionUncheckedUpdateManyWithoutBooksInput>
  }

  export type bookeditionScalarWhereInput = {
    AND?: bookeditionScalarWhereInput | bookeditionScalarWhereInput[]
    OR?: bookeditionScalarWhereInput[]
    NOT?: bookeditionScalarWhereInput | bookeditionScalarWhereInput[]
    id?: IntFilter<"bookedition"> | number
    edition_name?: StringFilter<"bookedition"> | string
    selling_price?: FloatNullableFilter<"bookedition"> | number | null
    production_price?: FloatNullableFilter<"bookedition"> | number | null
    printing_cost?: FloatNullableFilter<"bookedition"> | number | null
    binding_cost?: FloatNullableFilter<"bookedition"> | number | null
    design_cost?: FloatNullableFilter<"bookedition"> | number | null
    translation_cost?: FloatNullableFilter<"bookedition"> | number | null
    memo?: StringNullableFilter<"bookedition"> | string | null
    book_image_url?: StringNullableFilter<"bookedition"> | string | null
    total_print_count?: IntNullableFilter<"bookedition"> | number | null
    book_id?: IntNullableFilter<"bookedition"> | number | null
    number_of_pages?: IntNullableFilter<"bookedition"> | number | null
    bookId?: IntFilter<"bookedition"> | number
    is_deleted?: BoolFilter<"bookedition"> | boolean
    updatedAt?: DateTimeFilter<"bookedition"> | Date | string
    createdAt?: DateTimeFilter<"bookedition"> | Date | string
    deletedAt?: DateTimeFilter<"bookedition"> | Date | string
    editing_cost?: FloatNullableFilter<"bookedition"> | number | null
    other_expenses?: FloatNullableFilter<"bookedition"> | number | null
    transportation_cost?: FloatNullableFilter<"bookedition"> | number | null
  }

  export type damagedbooksUpsertWithWhereUniqueWithoutBooksInput = {
    where: damagedbooksWhereUniqueInput
    update: XOR<damagedbooksUpdateWithoutBooksInput, damagedbooksUncheckedUpdateWithoutBooksInput>
    create: XOR<damagedbooksCreateWithoutBooksInput, damagedbooksUncheckedCreateWithoutBooksInput>
  }

  export type damagedbooksUpdateWithWhereUniqueWithoutBooksInput = {
    where: damagedbooksWhereUniqueInput
    data: XOR<damagedbooksUpdateWithoutBooksInput, damagedbooksUncheckedUpdateWithoutBooksInput>
  }

  export type damagedbooksUpdateManyWithWhereWithoutBooksInput = {
    where: damagedbooksScalarWhereInput
    data: XOR<damagedbooksUpdateManyMutationInput, damagedbooksUncheckedUpdateManyWithoutBooksInput>
  }

  export type translatorbookUpsertWithWhereUniqueWithoutBooksInput = {
    where: translatorbookWhereUniqueInput
    update: XOR<translatorbookUpdateWithoutBooksInput, translatorbookUncheckedUpdateWithoutBooksInput>
    create: XOR<translatorbookCreateWithoutBooksInput, translatorbookUncheckedCreateWithoutBooksInput>
  }

  export type translatorbookUpdateWithWhereUniqueWithoutBooksInput = {
    where: translatorbookWhereUniqueInput
    data: XOR<translatorbookUpdateWithoutBooksInput, translatorbookUncheckedUpdateWithoutBooksInput>
  }

  export type translatorbookUpdateManyWithWhereWithoutBooksInput = {
    where: translatorbookScalarWhereInput
    data: XOR<translatorbookUpdateManyMutationInput, translatorbookUncheckedUpdateManyWithoutBooksInput>
  }

  export type translatorbookScalarWhereInput = {
    AND?: translatorbookScalarWhereInput | translatorbookScalarWhereInput[]
    OR?: translatorbookScalarWhereInput[]
    NOT?: translatorbookScalarWhereInput | translatorbookScalarWhereInput[]
    id?: IntFilter<"translatorbook"> | number
    book_id?: IntNullableFilter<"translatorbook"> | number | null
    bookId?: IntFilter<"translatorbook"> | number
    translator_id?: IntFilter<"translatorbook"> | number
    Status?: Enumtranslatorbook_StatusFilter<"translatorbook"> | $Enums.translatorbook_Status
    startDate?: DateTimeNullableFilter<"translatorbook"> | Date | string | null
    endDate?: DateTimeNullableFilter<"translatorbook"> | Date | string | null
    is_deleted?: BoolFilter<"translatorbook"> | boolean
    updatedAt?: DateTimeFilter<"translatorbook"> | Date | string
    createdAt?: DateTimeFilter<"translatorbook"> | Date | string
    deletedAt?: DateTimeFilter<"translatorbook"> | Date | string
  }

  export type bookeditionCreateWithoutBookshopeditionsInput = {
    edition_name: string
    selling_price?: number | null
    production_price?: number | null
    printing_cost?: number | null
    binding_cost?: number | null
    design_cost?: number | null
    translation_cost?: number | null
    memo?: string | null
    book_image_url?: string | null
    total_print_count?: number | null
    book_id?: number | null
    number_of_pages?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    editing_cost?: number | null
    other_expenses?: number | null
    transportation_cost?: number | null
    books: booksCreateNestedOneWithoutBookeditionInput
    bookeditionstores?: bookeditionstoresCreateNestedManyWithoutBookeditionInput
    damagedbooks?: damagedbooksCreateNestedManyWithoutBookeditionInput
  }

  export type bookeditionUncheckedCreateWithoutBookshopeditionsInput = {
    id?: number
    edition_name: string
    selling_price?: number | null
    production_price?: number | null
    printing_cost?: number | null
    binding_cost?: number | null
    design_cost?: number | null
    translation_cost?: number | null
    memo?: string | null
    book_image_url?: string | null
    total_print_count?: number | null
    book_id?: number | null
    number_of_pages?: number | null
    bookId: number
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    editing_cost?: number | null
    other_expenses?: number | null
    transportation_cost?: number | null
    bookeditionstores?: bookeditionstoresUncheckedCreateNestedManyWithoutBookeditionInput
    damagedbooks?: damagedbooksUncheckedCreateNestedManyWithoutBookeditionInput
  }

  export type bookeditionCreateOrConnectWithoutBookshopeditionsInput = {
    where: bookeditionWhereUniqueInput
    create: XOR<bookeditionCreateWithoutBookshopeditionsInput, bookeditionUncheckedCreateWithoutBookshopeditionsInput>
  }

  export type bookshopesCreateWithoutBookshopeditionsInput = {
    name: string
    location: string
    branch?: string | null
    phone?: string | null
    email?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type bookshopesUncheckedCreateWithoutBookshopeditionsInput = {
    id?: number
    name: string
    location: string
    branch?: string | null
    phone?: string | null
    email?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type bookshopesCreateOrConnectWithoutBookshopeditionsInput = {
    where: bookshopesWhereUniqueInput
    create: XOR<bookshopesCreateWithoutBookshopeditionsInput, bookshopesUncheckedCreateWithoutBookshopeditionsInput>
  }

  export type bookeditionUpsertWithoutBookshopeditionsInput = {
    update: XOR<bookeditionUpdateWithoutBookshopeditionsInput, bookeditionUncheckedUpdateWithoutBookshopeditionsInput>
    create: XOR<bookeditionCreateWithoutBookshopeditionsInput, bookeditionUncheckedCreateWithoutBookshopeditionsInput>
    where?: bookeditionWhereInput
  }

  export type bookeditionUpdateToOneWithWhereWithoutBookshopeditionsInput = {
    where?: bookeditionWhereInput
    data: XOR<bookeditionUpdateWithoutBookshopeditionsInput, bookeditionUncheckedUpdateWithoutBookshopeditionsInput>
  }

  export type bookeditionUpdateWithoutBookshopeditionsInput = {
    edition_name?: StringFieldUpdateOperationsInput | string
    selling_price?: NullableFloatFieldUpdateOperationsInput | number | null
    production_price?: NullableFloatFieldUpdateOperationsInput | number | null
    printing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    binding_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    translation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    total_print_count?: NullableIntFieldUpdateOperationsInput | number | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    other_expenses?: NullableFloatFieldUpdateOperationsInput | number | null
    transportation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    books?: booksUpdateOneRequiredWithoutBookeditionNestedInput
    bookeditionstores?: bookeditionstoresUpdateManyWithoutBookeditionNestedInput
    damagedbooks?: damagedbooksUpdateManyWithoutBookeditionNestedInput
  }

  export type bookeditionUncheckedUpdateWithoutBookshopeditionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    edition_name?: StringFieldUpdateOperationsInput | string
    selling_price?: NullableFloatFieldUpdateOperationsInput | number | null
    production_price?: NullableFloatFieldUpdateOperationsInput | number | null
    printing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    binding_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    translation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    total_print_count?: NullableIntFieldUpdateOperationsInput | number | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    bookId?: IntFieldUpdateOperationsInput | number
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    other_expenses?: NullableFloatFieldUpdateOperationsInput | number | null
    transportation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    bookeditionstores?: bookeditionstoresUncheckedUpdateManyWithoutBookeditionNestedInput
    damagedbooks?: damagedbooksUncheckedUpdateManyWithoutBookeditionNestedInput
  }

  export type bookshopesUpsertWithoutBookshopeditionsInput = {
    update: XOR<bookshopesUpdateWithoutBookshopeditionsInput, bookshopesUncheckedUpdateWithoutBookshopeditionsInput>
    create: XOR<bookshopesCreateWithoutBookshopeditionsInput, bookshopesUncheckedCreateWithoutBookshopeditionsInput>
    where?: bookshopesWhereInput
  }

  export type bookshopesUpdateToOneWithWhereWithoutBookshopeditionsInput = {
    where?: bookshopesWhereInput
    data: XOR<bookshopesUpdateWithoutBookshopeditionsInput, bookshopesUncheckedUpdateWithoutBookshopeditionsInput>
  }

  export type bookshopesUpdateWithoutBookshopeditionsInput = {
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    branch?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bookshopesUncheckedUpdateWithoutBookshopeditionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    branch?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bookshopeditionsCreateWithoutBookshopesInput = {
    quantity?: number
    price_per_peice?: number | null
    total_price?: number | null
    memo?: string | null
    already_paid?: number | null
    remaining_amount?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    bookedition: bookeditionCreateNestedOneWithoutBookshopeditionsInput
  }

  export type bookshopeditionsUncheckedCreateWithoutBookshopesInput = {
    id?: number
    bookEditionId: number
    quantity?: number
    price_per_peice?: number | null
    total_price?: number | null
    memo?: string | null
    already_paid?: number | null
    remaining_amount?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type bookshopeditionsCreateOrConnectWithoutBookshopesInput = {
    where: bookshopeditionsWhereUniqueInput
    create: XOR<bookshopeditionsCreateWithoutBookshopesInput, bookshopeditionsUncheckedCreateWithoutBookshopesInput>
  }

  export type bookshopeditionsCreateManyBookshopesInputEnvelope = {
    data: bookshopeditionsCreateManyBookshopesInput | bookshopeditionsCreateManyBookshopesInput[]
    skipDuplicates?: boolean
  }

  export type bookshopeditionsUpsertWithWhereUniqueWithoutBookshopesInput = {
    where: bookshopeditionsWhereUniqueInput
    update: XOR<bookshopeditionsUpdateWithoutBookshopesInput, bookshopeditionsUncheckedUpdateWithoutBookshopesInput>
    create: XOR<bookshopeditionsCreateWithoutBookshopesInput, bookshopeditionsUncheckedCreateWithoutBookshopesInput>
  }

  export type bookshopeditionsUpdateWithWhereUniqueWithoutBookshopesInput = {
    where: bookshopeditionsWhereUniqueInput
    data: XOR<bookshopeditionsUpdateWithoutBookshopesInput, bookshopeditionsUncheckedUpdateWithoutBookshopesInput>
  }

  export type bookshopeditionsUpdateManyWithWhereWithoutBookshopesInput = {
    where: bookshopeditionsScalarWhereInput
    data: XOR<bookshopeditionsUpdateManyMutationInput, bookshopeditionsUncheckedUpdateManyWithoutBookshopesInput>
  }

  export type accountsCreateWithoutDamagedbooksInput = {
    account_type: string
    account_email: string
    password: string
    account_status?: boolean
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    name?: string
    roles?: rolesCreateNestedManyWithoutAccountsInput
  }

  export type accountsUncheckedCreateWithoutDamagedbooksInput = {
    id?: number
    account_type: string
    account_email: string
    password: string
    account_status?: boolean
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    name?: string
    roles?: rolesUncheckedCreateNestedManyWithoutAccountsInput
  }

  export type accountsCreateOrConnectWithoutDamagedbooksInput = {
    where: accountsWhereUniqueInput
    create: XOR<accountsCreateWithoutDamagedbooksInput, accountsUncheckedCreateWithoutDamagedbooksInput>
  }

  export type booksCreateWithoutDamagedbooksInput = {
    unique_identification_code: string
    isbn?: string | null
    title: string
    author: string
    translator?: string | null
    designer?: string | null
    language: string
    edition: string
    category: string
    publication_year: string
    print_batch_id?: string | null
    book_sku: string
    number_of_pages?: number | null
    info?: string | null
    book_image_url?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    productionstatus?: $Enums.books_productionstatus | null
    default_edition_id?: string | null
    bookedition?: bookeditionCreateNestedManyWithoutBooksInput
    translatorbook?: translatorbookCreateNestedManyWithoutBooksInput
  }

  export type booksUncheckedCreateWithoutDamagedbooksInput = {
    id?: number
    unique_identification_code: string
    isbn?: string | null
    title: string
    author: string
    translator?: string | null
    designer?: string | null
    language: string
    edition: string
    category: string
    publication_year: string
    print_batch_id?: string | null
    book_sku: string
    number_of_pages?: number | null
    info?: string | null
    book_image_url?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    productionstatus?: $Enums.books_productionstatus | null
    default_edition_id?: string | null
    bookedition?: bookeditionUncheckedCreateNestedManyWithoutBooksInput
    translatorbook?: translatorbookUncheckedCreateNestedManyWithoutBooksInput
  }

  export type booksCreateOrConnectWithoutDamagedbooksInput = {
    where: booksWhereUniqueInput
    create: XOR<booksCreateWithoutDamagedbooksInput, booksUncheckedCreateWithoutDamagedbooksInput>
  }

  export type bookeditionCreateWithoutDamagedbooksInput = {
    edition_name: string
    selling_price?: number | null
    production_price?: number | null
    printing_cost?: number | null
    binding_cost?: number | null
    design_cost?: number | null
    translation_cost?: number | null
    memo?: string | null
    book_image_url?: string | null
    total_print_count?: number | null
    book_id?: number | null
    number_of_pages?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    editing_cost?: number | null
    other_expenses?: number | null
    transportation_cost?: number | null
    books: booksCreateNestedOneWithoutBookeditionInput
    bookeditionstores?: bookeditionstoresCreateNestedManyWithoutBookeditionInput
    bookshopeditions?: bookshopeditionsCreateNestedManyWithoutBookeditionInput
  }

  export type bookeditionUncheckedCreateWithoutDamagedbooksInput = {
    id?: number
    edition_name: string
    selling_price?: number | null
    production_price?: number | null
    printing_cost?: number | null
    binding_cost?: number | null
    design_cost?: number | null
    translation_cost?: number | null
    memo?: string | null
    book_image_url?: string | null
    total_print_count?: number | null
    book_id?: number | null
    number_of_pages?: number | null
    bookId: number
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    editing_cost?: number | null
    other_expenses?: number | null
    transportation_cost?: number | null
    bookeditionstores?: bookeditionstoresUncheckedCreateNestedManyWithoutBookeditionInput
    bookshopeditions?: bookshopeditionsUncheckedCreateNestedManyWithoutBookeditionInput
  }

  export type bookeditionCreateOrConnectWithoutDamagedbooksInput = {
    where: bookeditionWhereUniqueInput
    create: XOR<bookeditionCreateWithoutDamagedbooksInput, bookeditionUncheckedCreateWithoutDamagedbooksInput>
  }

  export type storesCreateWithoutDamagedbooksInput = {
    name: string
    location: string
    phone?: string | null
    email?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    bookeditionstores?: bookeditionstoresCreateNestedManyWithoutStoresInput
  }

  export type storesUncheckedCreateWithoutDamagedbooksInput = {
    id?: number
    name: string
    location: string
    phone?: string | null
    email?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    bookeditionstores?: bookeditionstoresUncheckedCreateNestedManyWithoutStoresInput
  }

  export type storesCreateOrConnectWithoutDamagedbooksInput = {
    where: storesWhereUniqueInput
    create: XOR<storesCreateWithoutDamagedbooksInput, storesUncheckedCreateWithoutDamagedbooksInput>
  }

  export type accountsUpsertWithoutDamagedbooksInput = {
    update: XOR<accountsUpdateWithoutDamagedbooksInput, accountsUncheckedUpdateWithoutDamagedbooksInput>
    create: XOR<accountsCreateWithoutDamagedbooksInput, accountsUncheckedCreateWithoutDamagedbooksInput>
    where?: accountsWhereInput
  }

  export type accountsUpdateToOneWithWhereWithoutDamagedbooksInput = {
    where?: accountsWhereInput
    data: XOR<accountsUpdateWithoutDamagedbooksInput, accountsUncheckedUpdateWithoutDamagedbooksInput>
  }

  export type accountsUpdateWithoutDamagedbooksInput = {
    account_type?: StringFieldUpdateOperationsInput | string
    account_email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    account_status?: BoolFieldUpdateOperationsInput | boolean
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    roles?: rolesUpdateManyWithoutAccountsNestedInput
  }

  export type accountsUncheckedUpdateWithoutDamagedbooksInput = {
    id?: IntFieldUpdateOperationsInput | number
    account_type?: StringFieldUpdateOperationsInput | string
    account_email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    account_status?: BoolFieldUpdateOperationsInput | boolean
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    roles?: rolesUncheckedUpdateManyWithoutAccountsNestedInput
  }

  export type booksUpsertWithoutDamagedbooksInput = {
    update: XOR<booksUpdateWithoutDamagedbooksInput, booksUncheckedUpdateWithoutDamagedbooksInput>
    create: XOR<booksCreateWithoutDamagedbooksInput, booksUncheckedCreateWithoutDamagedbooksInput>
    where?: booksWhereInput
  }

  export type booksUpdateToOneWithWhereWithoutDamagedbooksInput = {
    where?: booksWhereInput
    data: XOR<booksUpdateWithoutDamagedbooksInput, booksUncheckedUpdateWithoutDamagedbooksInput>
  }

  export type booksUpdateWithoutDamagedbooksInput = {
    unique_identification_code?: StringFieldUpdateOperationsInput | string
    isbn?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    translator?: NullableStringFieldUpdateOperationsInput | string | null
    designer?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    edition?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    publication_year?: StringFieldUpdateOperationsInput | string
    print_batch_id?: NullableStringFieldUpdateOperationsInput | string | null
    book_sku?: StringFieldUpdateOperationsInput | string
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    info?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    productionstatus?: NullableEnumbooks_productionstatusFieldUpdateOperationsInput | $Enums.books_productionstatus | null
    default_edition_id?: NullableStringFieldUpdateOperationsInput | string | null
    bookedition?: bookeditionUpdateManyWithoutBooksNestedInput
    translatorbook?: translatorbookUpdateManyWithoutBooksNestedInput
  }

  export type booksUncheckedUpdateWithoutDamagedbooksInput = {
    id?: IntFieldUpdateOperationsInput | number
    unique_identification_code?: StringFieldUpdateOperationsInput | string
    isbn?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    translator?: NullableStringFieldUpdateOperationsInput | string | null
    designer?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    edition?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    publication_year?: StringFieldUpdateOperationsInput | string
    print_batch_id?: NullableStringFieldUpdateOperationsInput | string | null
    book_sku?: StringFieldUpdateOperationsInput | string
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    info?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    productionstatus?: NullableEnumbooks_productionstatusFieldUpdateOperationsInput | $Enums.books_productionstatus | null
    default_edition_id?: NullableStringFieldUpdateOperationsInput | string | null
    bookedition?: bookeditionUncheckedUpdateManyWithoutBooksNestedInput
    translatorbook?: translatorbookUncheckedUpdateManyWithoutBooksNestedInput
  }

  export type bookeditionUpsertWithoutDamagedbooksInput = {
    update: XOR<bookeditionUpdateWithoutDamagedbooksInput, bookeditionUncheckedUpdateWithoutDamagedbooksInput>
    create: XOR<bookeditionCreateWithoutDamagedbooksInput, bookeditionUncheckedCreateWithoutDamagedbooksInput>
    where?: bookeditionWhereInput
  }

  export type bookeditionUpdateToOneWithWhereWithoutDamagedbooksInput = {
    where?: bookeditionWhereInput
    data: XOR<bookeditionUpdateWithoutDamagedbooksInput, bookeditionUncheckedUpdateWithoutDamagedbooksInput>
  }

  export type bookeditionUpdateWithoutDamagedbooksInput = {
    edition_name?: StringFieldUpdateOperationsInput | string
    selling_price?: NullableFloatFieldUpdateOperationsInput | number | null
    production_price?: NullableFloatFieldUpdateOperationsInput | number | null
    printing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    binding_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    translation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    total_print_count?: NullableIntFieldUpdateOperationsInput | number | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    other_expenses?: NullableFloatFieldUpdateOperationsInput | number | null
    transportation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    books?: booksUpdateOneRequiredWithoutBookeditionNestedInput
    bookeditionstores?: bookeditionstoresUpdateManyWithoutBookeditionNestedInput
    bookshopeditions?: bookshopeditionsUpdateManyWithoutBookeditionNestedInput
  }

  export type bookeditionUncheckedUpdateWithoutDamagedbooksInput = {
    id?: IntFieldUpdateOperationsInput | number
    edition_name?: StringFieldUpdateOperationsInput | string
    selling_price?: NullableFloatFieldUpdateOperationsInput | number | null
    production_price?: NullableFloatFieldUpdateOperationsInput | number | null
    printing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    binding_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    translation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    total_print_count?: NullableIntFieldUpdateOperationsInput | number | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    bookId?: IntFieldUpdateOperationsInput | number
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    other_expenses?: NullableFloatFieldUpdateOperationsInput | number | null
    transportation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    bookeditionstores?: bookeditionstoresUncheckedUpdateManyWithoutBookeditionNestedInput
    bookshopeditions?: bookshopeditionsUncheckedUpdateManyWithoutBookeditionNestedInput
  }

  export type storesUpsertWithoutDamagedbooksInput = {
    update: XOR<storesUpdateWithoutDamagedbooksInput, storesUncheckedUpdateWithoutDamagedbooksInput>
    create: XOR<storesCreateWithoutDamagedbooksInput, storesUncheckedCreateWithoutDamagedbooksInput>
    where?: storesWhereInput
  }

  export type storesUpdateToOneWithWhereWithoutDamagedbooksInput = {
    where?: storesWhereInput
    data: XOR<storesUpdateWithoutDamagedbooksInput, storesUncheckedUpdateWithoutDamagedbooksInput>
  }

  export type storesUpdateWithoutDamagedbooksInput = {
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookeditionstores?: bookeditionstoresUpdateManyWithoutStoresNestedInput
  }

  export type storesUncheckedUpdateWithoutDamagedbooksInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookeditionstores?: bookeditionstoresUncheckedUpdateManyWithoutStoresNestedInput
  }

  export type printorderCreateWithoutPrinterInput = {
    quality: string
    count: number
    status?: $Enums.printorder_status
    memo?: string | null
    tracking?: $Enums.printorder_tracking
    startDate?: Date | string | null
    endDate?: Date | string | null
    edition?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type printorderUncheckedCreateWithoutPrinterInput = {
    id?: number
    quality: string
    count: number
    status?: $Enums.printorder_status
    memo?: string | null
    tracking?: $Enums.printorder_tracking
    startDate?: Date | string | null
    endDate?: Date | string | null
    edition?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type printorderCreateOrConnectWithoutPrinterInput = {
    where: printorderWhereUniqueInput
    create: XOR<printorderCreateWithoutPrinterInput, printorderUncheckedCreateWithoutPrinterInput>
  }

  export type printorderCreateManyPrinterInputEnvelope = {
    data: printorderCreateManyPrinterInput | printorderCreateManyPrinterInput[]
    skipDuplicates?: boolean
  }

  export type printorderUpsertWithWhereUniqueWithoutPrinterInput = {
    where: printorderWhereUniqueInput
    update: XOR<printorderUpdateWithoutPrinterInput, printorderUncheckedUpdateWithoutPrinterInput>
    create: XOR<printorderCreateWithoutPrinterInput, printorderUncheckedCreateWithoutPrinterInput>
  }

  export type printorderUpdateWithWhereUniqueWithoutPrinterInput = {
    where: printorderWhereUniqueInput
    data: XOR<printorderUpdateWithoutPrinterInput, printorderUncheckedUpdateWithoutPrinterInput>
  }

  export type printorderUpdateManyWithWhereWithoutPrinterInput = {
    where: printorderScalarWhereInput
    data: XOR<printorderUpdateManyMutationInput, printorderUncheckedUpdateManyWithoutPrinterInput>
  }

  export type printorderScalarWhereInput = {
    AND?: printorderScalarWhereInput | printorderScalarWhereInput[]
    OR?: printorderScalarWhereInput[]
    NOT?: printorderScalarWhereInput | printorderScalarWhereInput[]
    id?: IntFilter<"printorder"> | number
    quality?: StringFilter<"printorder"> | string
    count?: IntFilter<"printorder"> | number
    status?: Enumprintorder_statusFilter<"printorder"> | $Enums.printorder_status
    memo?: StringNullableFilter<"printorder"> | string | null
    tracking?: Enumprintorder_trackingFilter<"printorder"> | $Enums.printorder_tracking
    startDate?: DateTimeNullableFilter<"printorder"> | Date | string | null
    endDate?: DateTimeNullableFilter<"printorder"> | Date | string | null
    printerId?: IntFilter<"printorder"> | number
    edition?: StringNullableFilter<"printorder"> | string | null
    is_deleted?: BoolFilter<"printorder"> | boolean
    updatedAt?: DateTimeFilter<"printorder"> | Date | string
    createdAt?: DateTimeFilter<"printorder"> | Date | string
    deletedAt?: DateTimeFilter<"printorder"> | Date | string
  }

  export type printerCreateWithoutPrintorderInput = {
    name: string
    location: string
    phone?: string | null
    email?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type printerUncheckedCreateWithoutPrintorderInput = {
    id?: number
    name: string
    location: string
    phone?: string | null
    email?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type printerCreateOrConnectWithoutPrintorderInput = {
    where: printerWhereUniqueInput
    create: XOR<printerCreateWithoutPrintorderInput, printerUncheckedCreateWithoutPrintorderInput>
  }

  export type printerUpsertWithoutPrintorderInput = {
    update: XOR<printerUpdateWithoutPrintorderInput, printerUncheckedUpdateWithoutPrintorderInput>
    create: XOR<printerCreateWithoutPrintorderInput, printerUncheckedCreateWithoutPrintorderInput>
    where?: printerWhereInput
  }

  export type printerUpdateToOneWithWhereWithoutPrintorderInput = {
    where?: printerWhereInput
    data: XOR<printerUpdateWithoutPrintorderInput, printerUncheckedUpdateWithoutPrintorderInput>
  }

  export type printerUpdateWithoutPrintorderInput = {
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type printerUncheckedUpdateWithoutPrintorderInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type accountsCreateWithoutRolesInput = {
    account_type: string
    account_email: string
    password: string
    account_status?: boolean
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    name?: string
    damagedbooks?: damagedbooksCreateNestedManyWithoutAccountsInput
  }

  export type accountsUncheckedCreateWithoutRolesInput = {
    id?: number
    account_type: string
    account_email: string
    password: string
    account_status?: boolean
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    name?: string
    damagedbooks?: damagedbooksUncheckedCreateNestedManyWithoutAccountsInput
  }

  export type accountsCreateOrConnectWithoutRolesInput = {
    where: accountsWhereUniqueInput
    create: XOR<accountsCreateWithoutRolesInput, accountsUncheckedCreateWithoutRolesInput>
  }

  export type accountsUpsertWithoutRolesInput = {
    update: XOR<accountsUpdateWithoutRolesInput, accountsUncheckedUpdateWithoutRolesInput>
    create: XOR<accountsCreateWithoutRolesInput, accountsUncheckedCreateWithoutRolesInput>
    where?: accountsWhereInput
  }

  export type accountsUpdateToOneWithWhereWithoutRolesInput = {
    where?: accountsWhereInput
    data: XOR<accountsUpdateWithoutRolesInput, accountsUncheckedUpdateWithoutRolesInput>
  }

  export type accountsUpdateWithoutRolesInput = {
    account_type?: StringFieldUpdateOperationsInput | string
    account_email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    account_status?: BoolFieldUpdateOperationsInput | boolean
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    damagedbooks?: damagedbooksUpdateManyWithoutAccountsNestedInput
  }

  export type accountsUncheckedUpdateWithoutRolesInput = {
    id?: IntFieldUpdateOperationsInput | number
    account_type?: StringFieldUpdateOperationsInput | string
    account_email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    account_status?: BoolFieldUpdateOperationsInput | boolean
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    damagedbooks?: damagedbooksUncheckedUpdateManyWithoutAccountsNestedInput
  }

  export type bookeditionstoresCreateWithoutStoresInput = {
    quantity?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    bookedition: bookeditionCreateNestedOneWithoutBookeditionstoresInput
  }

  export type bookeditionstoresUncheckedCreateWithoutStoresInput = {
    id?: number
    editionId: number
    quantity?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type bookeditionstoresCreateOrConnectWithoutStoresInput = {
    where: bookeditionstoresWhereUniqueInput
    create: XOR<bookeditionstoresCreateWithoutStoresInput, bookeditionstoresUncheckedCreateWithoutStoresInput>
  }

  export type bookeditionstoresCreateManyStoresInputEnvelope = {
    data: bookeditionstoresCreateManyStoresInput | bookeditionstoresCreateManyStoresInput[]
    skipDuplicates?: boolean
  }

  export type damagedbooksCreateWithoutStoresInput = {
    type?: $Enums.damagedbooks_type | null
    count?: number | null
    memo?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    accounts?: accountsCreateNestedOneWithoutDamagedbooksInput
    books?: booksCreateNestedOneWithoutDamagedbooksInput
    bookedition?: bookeditionCreateNestedOneWithoutDamagedbooksInput
  }

  export type damagedbooksUncheckedCreateWithoutStoresInput = {
    id?: number
    type?: $Enums.damagedbooks_type | null
    book_id?: number | null
    edition_id?: number | null
    count?: number | null
    memo?: string | null
    account_id?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type damagedbooksCreateOrConnectWithoutStoresInput = {
    where: damagedbooksWhereUniqueInput
    create: XOR<damagedbooksCreateWithoutStoresInput, damagedbooksUncheckedCreateWithoutStoresInput>
  }

  export type damagedbooksCreateManyStoresInputEnvelope = {
    data: damagedbooksCreateManyStoresInput | damagedbooksCreateManyStoresInput[]
    skipDuplicates?: boolean
  }

  export type bookeditionstoresUpsertWithWhereUniqueWithoutStoresInput = {
    where: bookeditionstoresWhereUniqueInput
    update: XOR<bookeditionstoresUpdateWithoutStoresInput, bookeditionstoresUncheckedUpdateWithoutStoresInput>
    create: XOR<bookeditionstoresCreateWithoutStoresInput, bookeditionstoresUncheckedCreateWithoutStoresInput>
  }

  export type bookeditionstoresUpdateWithWhereUniqueWithoutStoresInput = {
    where: bookeditionstoresWhereUniqueInput
    data: XOR<bookeditionstoresUpdateWithoutStoresInput, bookeditionstoresUncheckedUpdateWithoutStoresInput>
  }

  export type bookeditionstoresUpdateManyWithWhereWithoutStoresInput = {
    where: bookeditionstoresScalarWhereInput
    data: XOR<bookeditionstoresUpdateManyMutationInput, bookeditionstoresUncheckedUpdateManyWithoutStoresInput>
  }

  export type damagedbooksUpsertWithWhereUniqueWithoutStoresInput = {
    where: damagedbooksWhereUniqueInput
    update: XOR<damagedbooksUpdateWithoutStoresInput, damagedbooksUncheckedUpdateWithoutStoresInput>
    create: XOR<damagedbooksCreateWithoutStoresInput, damagedbooksUncheckedCreateWithoutStoresInput>
  }

  export type damagedbooksUpdateWithWhereUniqueWithoutStoresInput = {
    where: damagedbooksWhereUniqueInput
    data: XOR<damagedbooksUpdateWithoutStoresInput, damagedbooksUncheckedUpdateWithoutStoresInput>
  }

  export type damagedbooksUpdateManyWithWhereWithoutStoresInput = {
    where: damagedbooksScalarWhereInput
    data: XOR<damagedbooksUpdateManyMutationInput, damagedbooksUncheckedUpdateManyWithoutStoresInput>
  }

  export type translatorbookCreateWithoutTranslatorInput = {
    book_id?: number | null
    Status?: $Enums.translatorbook_Status
    startDate?: Date | string | null
    endDate?: Date | string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    books: booksCreateNestedOneWithoutTranslatorbookInput
  }

  export type translatorbookUncheckedCreateWithoutTranslatorInput = {
    id?: number
    book_id?: number | null
    bookId: number
    Status?: $Enums.translatorbook_Status
    startDate?: Date | string | null
    endDate?: Date | string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type translatorbookCreateOrConnectWithoutTranslatorInput = {
    where: translatorbookWhereUniqueInput
    create: XOR<translatorbookCreateWithoutTranslatorInput, translatorbookUncheckedCreateWithoutTranslatorInput>
  }

  export type translatorbookCreateManyTranslatorInputEnvelope = {
    data: translatorbookCreateManyTranslatorInput | translatorbookCreateManyTranslatorInput[]
    skipDuplicates?: boolean
  }

  export type translatorbookUpsertWithWhereUniqueWithoutTranslatorInput = {
    where: translatorbookWhereUniqueInput
    update: XOR<translatorbookUpdateWithoutTranslatorInput, translatorbookUncheckedUpdateWithoutTranslatorInput>
    create: XOR<translatorbookCreateWithoutTranslatorInput, translatorbookUncheckedCreateWithoutTranslatorInput>
  }

  export type translatorbookUpdateWithWhereUniqueWithoutTranslatorInput = {
    where: translatorbookWhereUniqueInput
    data: XOR<translatorbookUpdateWithoutTranslatorInput, translatorbookUncheckedUpdateWithoutTranslatorInput>
  }

  export type translatorbookUpdateManyWithWhereWithoutTranslatorInput = {
    where: translatorbookScalarWhereInput
    data: XOR<translatorbookUpdateManyMutationInput, translatorbookUncheckedUpdateManyWithoutTranslatorInput>
  }

  export type booksCreateWithoutTranslatorbookInput = {
    unique_identification_code: string
    isbn?: string | null
    title: string
    author: string
    translator?: string | null
    designer?: string | null
    language: string
    edition: string
    category: string
    publication_year: string
    print_batch_id?: string | null
    book_sku: string
    number_of_pages?: number | null
    info?: string | null
    book_image_url?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    productionstatus?: $Enums.books_productionstatus | null
    default_edition_id?: string | null
    bookedition?: bookeditionCreateNestedManyWithoutBooksInput
    damagedbooks?: damagedbooksCreateNestedManyWithoutBooksInput
  }

  export type booksUncheckedCreateWithoutTranslatorbookInput = {
    id?: number
    unique_identification_code: string
    isbn?: string | null
    title: string
    author: string
    translator?: string | null
    designer?: string | null
    language: string
    edition: string
    category: string
    publication_year: string
    print_batch_id?: string | null
    book_sku: string
    number_of_pages?: number | null
    info?: string | null
    book_image_url?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    productionstatus?: $Enums.books_productionstatus | null
    default_edition_id?: string | null
    bookedition?: bookeditionUncheckedCreateNestedManyWithoutBooksInput
    damagedbooks?: damagedbooksUncheckedCreateNestedManyWithoutBooksInput
  }

  export type booksCreateOrConnectWithoutTranslatorbookInput = {
    where: booksWhereUniqueInput
    create: XOR<booksCreateWithoutTranslatorbookInput, booksUncheckedCreateWithoutTranslatorbookInput>
  }

  export type translatorCreateWithoutTranslatorbookInput = {
    name: string
    phoneNumber?: string | null
    email?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type translatorUncheckedCreateWithoutTranslatorbookInput = {
    id?: number
    name: string
    phoneNumber?: string | null
    email?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type translatorCreateOrConnectWithoutTranslatorbookInput = {
    where: translatorWhereUniqueInput
    create: XOR<translatorCreateWithoutTranslatorbookInput, translatorUncheckedCreateWithoutTranslatorbookInput>
  }

  export type booksUpsertWithoutTranslatorbookInput = {
    update: XOR<booksUpdateWithoutTranslatorbookInput, booksUncheckedUpdateWithoutTranslatorbookInput>
    create: XOR<booksCreateWithoutTranslatorbookInput, booksUncheckedCreateWithoutTranslatorbookInput>
    where?: booksWhereInput
  }

  export type booksUpdateToOneWithWhereWithoutTranslatorbookInput = {
    where?: booksWhereInput
    data: XOR<booksUpdateWithoutTranslatorbookInput, booksUncheckedUpdateWithoutTranslatorbookInput>
  }

  export type booksUpdateWithoutTranslatorbookInput = {
    unique_identification_code?: StringFieldUpdateOperationsInput | string
    isbn?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    translator?: NullableStringFieldUpdateOperationsInput | string | null
    designer?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    edition?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    publication_year?: StringFieldUpdateOperationsInput | string
    print_batch_id?: NullableStringFieldUpdateOperationsInput | string | null
    book_sku?: StringFieldUpdateOperationsInput | string
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    info?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    productionstatus?: NullableEnumbooks_productionstatusFieldUpdateOperationsInput | $Enums.books_productionstatus | null
    default_edition_id?: NullableStringFieldUpdateOperationsInput | string | null
    bookedition?: bookeditionUpdateManyWithoutBooksNestedInput
    damagedbooks?: damagedbooksUpdateManyWithoutBooksNestedInput
  }

  export type booksUncheckedUpdateWithoutTranslatorbookInput = {
    id?: IntFieldUpdateOperationsInput | number
    unique_identification_code?: StringFieldUpdateOperationsInput | string
    isbn?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    translator?: NullableStringFieldUpdateOperationsInput | string | null
    designer?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    edition?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    publication_year?: StringFieldUpdateOperationsInput | string
    print_batch_id?: NullableStringFieldUpdateOperationsInput | string | null
    book_sku?: StringFieldUpdateOperationsInput | string
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    info?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    productionstatus?: NullableEnumbooks_productionstatusFieldUpdateOperationsInput | $Enums.books_productionstatus | null
    default_edition_id?: NullableStringFieldUpdateOperationsInput | string | null
    bookedition?: bookeditionUncheckedUpdateManyWithoutBooksNestedInput
    damagedbooks?: damagedbooksUncheckedUpdateManyWithoutBooksNestedInput
  }

  export type translatorUpsertWithoutTranslatorbookInput = {
    update: XOR<translatorUpdateWithoutTranslatorbookInput, translatorUncheckedUpdateWithoutTranslatorbookInput>
    create: XOR<translatorCreateWithoutTranslatorbookInput, translatorUncheckedCreateWithoutTranslatorbookInput>
    where?: translatorWhereInput
  }

  export type translatorUpdateToOneWithWhereWithoutTranslatorbookInput = {
    where?: translatorWhereInput
    data: XOR<translatorUpdateWithoutTranslatorbookInput, translatorUncheckedUpdateWithoutTranslatorbookInput>
  }

  export type translatorUpdateWithoutTranslatorbookInput = {
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type translatorUncheckedUpdateWithoutTranslatorbookInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type damagedbooksCreateManyAccountsInput = {
    id?: number
    type?: $Enums.damagedbooks_type | null
    book_id?: number | null
    store_id?: number | null
    edition_id?: number | null
    count?: number | null
    memo?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type rolesCreateManyAccountsInput = {
    id?: number
    role_status?: boolean
    role_name: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type damagedbooksUpdateWithoutAccountsInput = {
    type?: NullableEnumdamagedbooks_typeFieldUpdateOperationsInput | $Enums.damagedbooks_type | null
    count?: NullableIntFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    books?: booksUpdateOneWithoutDamagedbooksNestedInput
    bookedition?: bookeditionUpdateOneWithoutDamagedbooksNestedInput
    stores?: storesUpdateOneWithoutDamagedbooksNestedInput
  }

  export type damagedbooksUncheckedUpdateWithoutAccountsInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: NullableEnumdamagedbooks_typeFieldUpdateOperationsInput | $Enums.damagedbooks_type | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    store_id?: NullableIntFieldUpdateOperationsInput | number | null
    edition_id?: NullableIntFieldUpdateOperationsInput | number | null
    count?: NullableIntFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type damagedbooksUncheckedUpdateManyWithoutAccountsInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: NullableEnumdamagedbooks_typeFieldUpdateOperationsInput | $Enums.damagedbooks_type | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    store_id?: NullableIntFieldUpdateOperationsInput | number | null
    edition_id?: NullableIntFieldUpdateOperationsInput | number | null
    count?: NullableIntFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type rolesUpdateWithoutAccountsInput = {
    role_status?: BoolFieldUpdateOperationsInput | boolean
    role_name?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type rolesUncheckedUpdateWithoutAccountsInput = {
    id?: IntFieldUpdateOperationsInput | number
    role_status?: BoolFieldUpdateOperationsInput | boolean
    role_name?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type rolesUncheckedUpdateManyWithoutAccountsInput = {
    id?: IntFieldUpdateOperationsInput | number
    role_status?: BoolFieldUpdateOperationsInput | boolean
    role_name?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bookeditionstoresCreateManyBookeditionInput = {
    id?: number
    quantity?: number | null
    storeId: number
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type bookshopeditionsCreateManyBookeditionInput = {
    id?: number
    bookShopId: number
    quantity?: number
    price_per_peice?: number | null
    total_price?: number | null
    memo?: string | null
    already_paid?: number | null
    remaining_amount?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type damagedbooksCreateManyBookeditionInput = {
    id?: number
    type?: $Enums.damagedbooks_type | null
    book_id?: number | null
    store_id?: number | null
    count?: number | null
    memo?: string | null
    account_id?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type bookeditionstoresUpdateWithoutBookeditionInput = {
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stores?: storesUpdateOneRequiredWithoutBookeditionstoresNestedInput
  }

  export type bookeditionstoresUncheckedUpdateWithoutBookeditionInput = {
    id?: IntFieldUpdateOperationsInput | number
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    storeId?: IntFieldUpdateOperationsInput | number
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bookeditionstoresUncheckedUpdateManyWithoutBookeditionInput = {
    id?: IntFieldUpdateOperationsInput | number
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    storeId?: IntFieldUpdateOperationsInput | number
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bookshopeditionsUpdateWithoutBookeditionInput = {
    quantity?: IntFieldUpdateOperationsInput | number
    price_per_peice?: NullableFloatFieldUpdateOperationsInput | number | null
    total_price?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    already_paid?: NullableFloatFieldUpdateOperationsInput | number | null
    remaining_amount?: NullableFloatFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookshopes?: bookshopesUpdateOneRequiredWithoutBookshopeditionsNestedInput
  }

  export type bookshopeditionsUncheckedUpdateWithoutBookeditionInput = {
    id?: IntFieldUpdateOperationsInput | number
    bookShopId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    price_per_peice?: NullableFloatFieldUpdateOperationsInput | number | null
    total_price?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    already_paid?: NullableFloatFieldUpdateOperationsInput | number | null
    remaining_amount?: NullableFloatFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bookshopeditionsUncheckedUpdateManyWithoutBookeditionInput = {
    id?: IntFieldUpdateOperationsInput | number
    bookShopId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    price_per_peice?: NullableFloatFieldUpdateOperationsInput | number | null
    total_price?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    already_paid?: NullableFloatFieldUpdateOperationsInput | number | null
    remaining_amount?: NullableFloatFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type damagedbooksUpdateWithoutBookeditionInput = {
    type?: NullableEnumdamagedbooks_typeFieldUpdateOperationsInput | $Enums.damagedbooks_type | null
    count?: NullableIntFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: accountsUpdateOneWithoutDamagedbooksNestedInput
    books?: booksUpdateOneWithoutDamagedbooksNestedInput
    stores?: storesUpdateOneWithoutDamagedbooksNestedInput
  }

  export type damagedbooksUncheckedUpdateWithoutBookeditionInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: NullableEnumdamagedbooks_typeFieldUpdateOperationsInput | $Enums.damagedbooks_type | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    store_id?: NullableIntFieldUpdateOperationsInput | number | null
    count?: NullableIntFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    account_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type damagedbooksUncheckedUpdateManyWithoutBookeditionInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: NullableEnumdamagedbooks_typeFieldUpdateOperationsInput | $Enums.damagedbooks_type | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    store_id?: NullableIntFieldUpdateOperationsInput | number | null
    count?: NullableIntFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    account_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bookeditionCreateManyBooksInput = {
    id?: number
    edition_name: string
    selling_price?: number | null
    production_price?: number | null
    printing_cost?: number | null
    binding_cost?: number | null
    design_cost?: number | null
    translation_cost?: number | null
    memo?: string | null
    book_image_url?: string | null
    total_print_count?: number | null
    book_id?: number | null
    number_of_pages?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    editing_cost?: number | null
    other_expenses?: number | null
    transportation_cost?: number | null
  }

  export type damagedbooksCreateManyBooksInput = {
    id?: number
    type?: $Enums.damagedbooks_type | null
    store_id?: number | null
    edition_id?: number | null
    count?: number | null
    memo?: string | null
    account_id?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type translatorbookCreateManyBooksInput = {
    id?: number
    book_id?: number | null
    translator_id: number
    Status?: $Enums.translatorbook_Status
    startDate?: Date | string | null
    endDate?: Date | string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type bookeditionUpdateWithoutBooksInput = {
    edition_name?: StringFieldUpdateOperationsInput | string
    selling_price?: NullableFloatFieldUpdateOperationsInput | number | null
    production_price?: NullableFloatFieldUpdateOperationsInput | number | null
    printing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    binding_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    translation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    total_print_count?: NullableIntFieldUpdateOperationsInput | number | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    other_expenses?: NullableFloatFieldUpdateOperationsInput | number | null
    transportation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    bookeditionstores?: bookeditionstoresUpdateManyWithoutBookeditionNestedInput
    bookshopeditions?: bookshopeditionsUpdateManyWithoutBookeditionNestedInput
    damagedbooks?: damagedbooksUpdateManyWithoutBookeditionNestedInput
  }

  export type bookeditionUncheckedUpdateWithoutBooksInput = {
    id?: IntFieldUpdateOperationsInput | number
    edition_name?: StringFieldUpdateOperationsInput | string
    selling_price?: NullableFloatFieldUpdateOperationsInput | number | null
    production_price?: NullableFloatFieldUpdateOperationsInput | number | null
    printing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    binding_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    translation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    total_print_count?: NullableIntFieldUpdateOperationsInput | number | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    other_expenses?: NullableFloatFieldUpdateOperationsInput | number | null
    transportation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    bookeditionstores?: bookeditionstoresUncheckedUpdateManyWithoutBookeditionNestedInput
    bookshopeditions?: bookshopeditionsUncheckedUpdateManyWithoutBookeditionNestedInput
    damagedbooks?: damagedbooksUncheckedUpdateManyWithoutBookeditionNestedInput
  }

  export type bookeditionUncheckedUpdateManyWithoutBooksInput = {
    id?: IntFieldUpdateOperationsInput | number
    edition_name?: StringFieldUpdateOperationsInput | string
    selling_price?: NullableFloatFieldUpdateOperationsInput | number | null
    production_price?: NullableFloatFieldUpdateOperationsInput | number | null
    printing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    binding_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    translation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    total_print_count?: NullableIntFieldUpdateOperationsInput | number | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    number_of_pages?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editing_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    other_expenses?: NullableFloatFieldUpdateOperationsInput | number | null
    transportation_cost?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type damagedbooksUpdateWithoutBooksInput = {
    type?: NullableEnumdamagedbooks_typeFieldUpdateOperationsInput | $Enums.damagedbooks_type | null
    count?: NullableIntFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: accountsUpdateOneWithoutDamagedbooksNestedInput
    bookedition?: bookeditionUpdateOneWithoutDamagedbooksNestedInput
    stores?: storesUpdateOneWithoutDamagedbooksNestedInput
  }

  export type damagedbooksUncheckedUpdateWithoutBooksInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: NullableEnumdamagedbooks_typeFieldUpdateOperationsInput | $Enums.damagedbooks_type | null
    store_id?: NullableIntFieldUpdateOperationsInput | number | null
    edition_id?: NullableIntFieldUpdateOperationsInput | number | null
    count?: NullableIntFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    account_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type damagedbooksUncheckedUpdateManyWithoutBooksInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: NullableEnumdamagedbooks_typeFieldUpdateOperationsInput | $Enums.damagedbooks_type | null
    store_id?: NullableIntFieldUpdateOperationsInput | number | null
    edition_id?: NullableIntFieldUpdateOperationsInput | number | null
    count?: NullableIntFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    account_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type translatorbookUpdateWithoutBooksInput = {
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    Status?: Enumtranslatorbook_StatusFieldUpdateOperationsInput | $Enums.translatorbook_Status
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    translator?: translatorUpdateOneRequiredWithoutTranslatorbookNestedInput
  }

  export type translatorbookUncheckedUpdateWithoutBooksInput = {
    id?: IntFieldUpdateOperationsInput | number
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    translator_id?: IntFieldUpdateOperationsInput | number
    Status?: Enumtranslatorbook_StatusFieldUpdateOperationsInput | $Enums.translatorbook_Status
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type translatorbookUncheckedUpdateManyWithoutBooksInput = {
    id?: IntFieldUpdateOperationsInput | number
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    translator_id?: IntFieldUpdateOperationsInput | number
    Status?: Enumtranslatorbook_StatusFieldUpdateOperationsInput | $Enums.translatorbook_Status
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bookshopeditionsCreateManyBookshopesInput = {
    id?: number
    bookEditionId: number
    quantity?: number
    price_per_peice?: number | null
    total_price?: number | null
    memo?: string | null
    already_paid?: number | null
    remaining_amount?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type bookshopeditionsUpdateWithoutBookshopesInput = {
    quantity?: IntFieldUpdateOperationsInput | number
    price_per_peice?: NullableFloatFieldUpdateOperationsInput | number | null
    total_price?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    already_paid?: NullableFloatFieldUpdateOperationsInput | number | null
    remaining_amount?: NullableFloatFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookedition?: bookeditionUpdateOneRequiredWithoutBookshopeditionsNestedInput
  }

  export type bookshopeditionsUncheckedUpdateWithoutBookshopesInput = {
    id?: IntFieldUpdateOperationsInput | number
    bookEditionId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    price_per_peice?: NullableFloatFieldUpdateOperationsInput | number | null
    total_price?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    already_paid?: NullableFloatFieldUpdateOperationsInput | number | null
    remaining_amount?: NullableFloatFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bookshopeditionsUncheckedUpdateManyWithoutBookshopesInput = {
    id?: IntFieldUpdateOperationsInput | number
    bookEditionId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    price_per_peice?: NullableFloatFieldUpdateOperationsInput | number | null
    total_price?: NullableFloatFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    already_paid?: NullableFloatFieldUpdateOperationsInput | number | null
    remaining_amount?: NullableFloatFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type printorderCreateManyPrinterInput = {
    id?: number
    quality: string
    count: number
    status?: $Enums.printorder_status
    memo?: string | null
    tracking?: $Enums.printorder_tracking
    startDate?: Date | string | null
    endDate?: Date | string | null
    edition?: string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type printorderUpdateWithoutPrinterInput = {
    quality?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    status?: Enumprintorder_statusFieldUpdateOperationsInput | $Enums.printorder_status
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    tracking?: Enumprintorder_trackingFieldUpdateOperationsInput | $Enums.printorder_tracking
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    edition?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type printorderUncheckedUpdateWithoutPrinterInput = {
    id?: IntFieldUpdateOperationsInput | number
    quality?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    status?: Enumprintorder_statusFieldUpdateOperationsInput | $Enums.printorder_status
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    tracking?: Enumprintorder_trackingFieldUpdateOperationsInput | $Enums.printorder_tracking
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    edition?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type printorderUncheckedUpdateManyWithoutPrinterInput = {
    id?: IntFieldUpdateOperationsInput | number
    quality?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    status?: Enumprintorder_statusFieldUpdateOperationsInput | $Enums.printorder_status
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    tracking?: Enumprintorder_trackingFieldUpdateOperationsInput | $Enums.printorder_tracking
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    edition?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bookeditionstoresCreateManyStoresInput = {
    id?: number
    editionId: number
    quantity?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type damagedbooksCreateManyStoresInput = {
    id?: number
    type?: $Enums.damagedbooks_type | null
    book_id?: number | null
    edition_id?: number | null
    count?: number | null
    memo?: string | null
    account_id?: number | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type bookeditionstoresUpdateWithoutStoresInput = {
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookedition?: bookeditionUpdateOneRequiredWithoutBookeditionstoresNestedInput
  }

  export type bookeditionstoresUncheckedUpdateWithoutStoresInput = {
    id?: IntFieldUpdateOperationsInput | number
    editionId?: IntFieldUpdateOperationsInput | number
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type bookeditionstoresUncheckedUpdateManyWithoutStoresInput = {
    id?: IntFieldUpdateOperationsInput | number
    editionId?: IntFieldUpdateOperationsInput | number
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type damagedbooksUpdateWithoutStoresInput = {
    type?: NullableEnumdamagedbooks_typeFieldUpdateOperationsInput | $Enums.damagedbooks_type | null
    count?: NullableIntFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: accountsUpdateOneWithoutDamagedbooksNestedInput
    books?: booksUpdateOneWithoutDamagedbooksNestedInput
    bookedition?: bookeditionUpdateOneWithoutDamagedbooksNestedInput
  }

  export type damagedbooksUncheckedUpdateWithoutStoresInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: NullableEnumdamagedbooks_typeFieldUpdateOperationsInput | $Enums.damagedbooks_type | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    edition_id?: NullableIntFieldUpdateOperationsInput | number | null
    count?: NullableIntFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    account_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type damagedbooksUncheckedUpdateManyWithoutStoresInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: NullableEnumdamagedbooks_typeFieldUpdateOperationsInput | $Enums.damagedbooks_type | null
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    edition_id?: NullableIntFieldUpdateOperationsInput | number | null
    count?: NullableIntFieldUpdateOperationsInput | number | null
    memo?: NullableStringFieldUpdateOperationsInput | string | null
    account_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type translatorbookCreateManyTranslatorInput = {
    id?: number
    book_id?: number | null
    bookId: number
    Status?: $Enums.translatorbook_Status
    startDate?: Date | string | null
    endDate?: Date | string | null
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
  }

  export type translatorbookUpdateWithoutTranslatorInput = {
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    Status?: Enumtranslatorbook_StatusFieldUpdateOperationsInput | $Enums.translatorbook_Status
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    books?: booksUpdateOneRequiredWithoutTranslatorbookNestedInput
  }

  export type translatorbookUncheckedUpdateWithoutTranslatorInput = {
    id?: IntFieldUpdateOperationsInput | number
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    bookId?: IntFieldUpdateOperationsInput | number
    Status?: Enumtranslatorbook_StatusFieldUpdateOperationsInput | $Enums.translatorbook_Status
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type translatorbookUncheckedUpdateManyWithoutTranslatorInput = {
    id?: IntFieldUpdateOperationsInput | number
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    bookId?: IntFieldUpdateOperationsInput | number
    Status?: Enumtranslatorbook_StatusFieldUpdateOperationsInput | $Enums.translatorbook_Status
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}