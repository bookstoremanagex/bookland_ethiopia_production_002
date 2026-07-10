
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
 * Model retail_books
 * 
 */
export type retail_books = $Result.DefaultSelection<Prisma.$retail_booksPayload>
/**
 * Model reatil_book_editions
 * 
 */
export type reatil_book_editions = $Result.DefaultSelection<Prisma.$reatil_book_editionsPayload>
/**
 * Model retail_orders
 * 
 */
export type retail_orders = $Result.DefaultSelection<Prisma.$retail_ordersPayload>
/**
 * Model users
 * 
 */
export type users = $Result.DefaultSelection<Prisma.$usersPayload>
/**
 * Model customers
 * 
 */
export type customers = $Result.DefaultSelection<Prisma.$customersPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const customerType: {
  INDVIDUAL: 'INDVIDUAL',
  DISTRIBUTOR: 'DISTRIBUTOR',
  BOOKSHOP: 'BOOKSHOP'
};

export type customerType = (typeof customerType)[keyof typeof customerType]

}

export type customerType = $Enums.customerType

export const customerType: typeof $Enums.customerType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Retail_books
 * const retail_books = await prisma.retail_books.findMany()
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
   * // Fetch zero or more Retail_books
   * const retail_books = await prisma.retail_books.findMany()
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
   * `prisma.retail_books`: Exposes CRUD operations for the **retail_books** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Retail_books
    * const retail_books = await prisma.retail_books.findMany()
    * ```
    */
  get retail_books(): Prisma.retail_booksDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.reatil_book_editions`: Exposes CRUD operations for the **reatil_book_editions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reatil_book_editions
    * const reatil_book_editions = await prisma.reatil_book_editions.findMany()
    * ```
    */
  get reatil_book_editions(): Prisma.reatil_book_editionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.retail_orders`: Exposes CRUD operations for the **retail_orders** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Retail_orders
    * const retail_orders = await prisma.retail_orders.findMany()
    * ```
    */
  get retail_orders(): Prisma.retail_ordersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.users`: Exposes CRUD operations for the **users** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.users.findMany()
    * ```
    */
  get users(): Prisma.usersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.customers`: Exposes CRUD operations for the **customers** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Customers
    * const customers = await prisma.customers.findMany()
    * ```
    */
  get customers(): Prisma.customersDelegate<ExtArgs, ClientOptions>;
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
    retail_books: 'retail_books',
    reatil_book_editions: 'reatil_book_editions',
    retail_orders: 'retail_orders',
    users: 'users',
    customers: 'customers'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    retail_db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "retail_books" | "reatil_book_editions" | "retail_orders" | "users" | "customers"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      retail_books: {
        payload: Prisma.$retail_booksPayload<ExtArgs>
        fields: Prisma.retail_booksFieldRefs
        operations: {
          findUnique: {
            args: Prisma.retail_booksFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$retail_booksPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.retail_booksFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$retail_booksPayload>
          }
          findFirst: {
            args: Prisma.retail_booksFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$retail_booksPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.retail_booksFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$retail_booksPayload>
          }
          findMany: {
            args: Prisma.retail_booksFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$retail_booksPayload>[]
          }
          create: {
            args: Prisma.retail_booksCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$retail_booksPayload>
          }
          createMany: {
            args: Prisma.retail_booksCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.retail_booksDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$retail_booksPayload>
          }
          update: {
            args: Prisma.retail_booksUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$retail_booksPayload>
          }
          deleteMany: {
            args: Prisma.retail_booksDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.retail_booksUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.retail_booksUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$retail_booksPayload>
          }
          aggregate: {
            args: Prisma.Retail_booksAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRetail_books>
          }
          groupBy: {
            args: Prisma.retail_booksGroupByArgs<ExtArgs>
            result: $Utils.Optional<Retail_booksGroupByOutputType>[]
          }
          count: {
            args: Prisma.retail_booksCountArgs<ExtArgs>
            result: $Utils.Optional<Retail_booksCountAggregateOutputType> | number
          }
        }
      }
      reatil_book_editions: {
        payload: Prisma.$reatil_book_editionsPayload<ExtArgs>
        fields: Prisma.reatil_book_editionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.reatil_book_editionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reatil_book_editionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.reatil_book_editionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reatil_book_editionsPayload>
          }
          findFirst: {
            args: Prisma.reatil_book_editionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reatil_book_editionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.reatil_book_editionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reatil_book_editionsPayload>
          }
          findMany: {
            args: Prisma.reatil_book_editionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reatil_book_editionsPayload>[]
          }
          create: {
            args: Prisma.reatil_book_editionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reatil_book_editionsPayload>
          }
          createMany: {
            args: Prisma.reatil_book_editionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.reatil_book_editionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reatil_book_editionsPayload>
          }
          update: {
            args: Prisma.reatil_book_editionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reatil_book_editionsPayload>
          }
          deleteMany: {
            args: Prisma.reatil_book_editionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.reatil_book_editionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.reatil_book_editionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reatil_book_editionsPayload>
          }
          aggregate: {
            args: Prisma.Reatil_book_editionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReatil_book_editions>
          }
          groupBy: {
            args: Prisma.reatil_book_editionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Reatil_book_editionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.reatil_book_editionsCountArgs<ExtArgs>
            result: $Utils.Optional<Reatil_book_editionsCountAggregateOutputType> | number
          }
        }
      }
      retail_orders: {
        payload: Prisma.$retail_ordersPayload<ExtArgs>
        fields: Prisma.retail_ordersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.retail_ordersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$retail_ordersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.retail_ordersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$retail_ordersPayload>
          }
          findFirst: {
            args: Prisma.retail_ordersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$retail_ordersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.retail_ordersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$retail_ordersPayload>
          }
          findMany: {
            args: Prisma.retail_ordersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$retail_ordersPayload>[]
          }
          create: {
            args: Prisma.retail_ordersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$retail_ordersPayload>
          }
          createMany: {
            args: Prisma.retail_ordersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.retail_ordersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$retail_ordersPayload>
          }
          update: {
            args: Prisma.retail_ordersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$retail_ordersPayload>
          }
          deleteMany: {
            args: Prisma.retail_ordersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.retail_ordersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.retail_ordersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$retail_ordersPayload>
          }
          aggregate: {
            args: Prisma.Retail_ordersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRetail_orders>
          }
          groupBy: {
            args: Prisma.retail_ordersGroupByArgs<ExtArgs>
            result: $Utils.Optional<Retail_ordersGroupByOutputType>[]
          }
          count: {
            args: Prisma.retail_ordersCountArgs<ExtArgs>
            result: $Utils.Optional<Retail_ordersCountAggregateOutputType> | number
          }
        }
      }
      users: {
        payload: Prisma.$usersPayload<ExtArgs>
        fields: Prisma.usersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.usersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.usersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findFirst: {
            args: Prisma.usersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.usersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findMany: {
            args: Prisma.usersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          create: {
            args: Prisma.usersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          createMany: {
            args: Prisma.usersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.usersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          update: {
            args: Prisma.usersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          deleteMany: {
            args: Prisma.usersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.usersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.usersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          aggregate: {
            args: Prisma.UsersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsers>
          }
          groupBy: {
            args: Prisma.usersGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsersGroupByOutputType>[]
          }
          count: {
            args: Prisma.usersCountArgs<ExtArgs>
            result: $Utils.Optional<UsersCountAggregateOutputType> | number
          }
        }
      }
      customers: {
        payload: Prisma.$customersPayload<ExtArgs>
        fields: Prisma.customersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.customersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$customersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.customersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$customersPayload>
          }
          findFirst: {
            args: Prisma.customersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$customersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.customersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$customersPayload>
          }
          findMany: {
            args: Prisma.customersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$customersPayload>[]
          }
          create: {
            args: Prisma.customersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$customersPayload>
          }
          createMany: {
            args: Prisma.customersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.customersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$customersPayload>
          }
          update: {
            args: Prisma.customersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$customersPayload>
          }
          deleteMany: {
            args: Prisma.customersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.customersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.customersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$customersPayload>
          }
          aggregate: {
            args: Prisma.CustomersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomers>
          }
          groupBy: {
            args: Prisma.customersGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomersGroupByOutputType>[]
          }
          count: {
            args: Prisma.customersCountArgs<ExtArgs>
            result: $Utils.Optional<CustomersCountAggregateOutputType> | number
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
    retail_books?: retail_booksOmit
    reatil_book_editions?: reatil_book_editionsOmit
    retail_orders?: retail_ordersOmit
    users?: usersOmit
    customers?: customersOmit
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
   * Count Type Retail_booksCountOutputType
   */

  export type Retail_booksCountOutputType = {
    bookEditions: number
  }

  export type Retail_booksCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookEditions?: boolean | Retail_booksCountOutputTypeCountBookEditionsArgs
  }

  // Custom InputTypes
  /**
   * Retail_booksCountOutputType without action
   */
  export type Retail_booksCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Retail_booksCountOutputType
     */
    select?: Retail_booksCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * Retail_booksCountOutputType without action
   */
  export type Retail_booksCountOutputTypeCountBookEditionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: reatil_book_editionsWhereInput
  }


  /**
   * Count Type Reatil_book_editionsCountOutputType
   */

  export type Reatil_book_editionsCountOutputType = {
    orders: number
  }

  export type Reatil_book_editionsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | Reatil_book_editionsCountOutputTypeCountOrdersArgs
  }

  // Custom InputTypes
  /**
   * Reatil_book_editionsCountOutputType without action
   */
  export type Reatil_book_editionsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reatil_book_editionsCountOutputType
     */
    select?: Reatil_book_editionsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * Reatil_book_editionsCountOutputType without action
   */
  export type Reatil_book_editionsCountOutputTypeCountOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: retail_ordersWhereInput
  }


  /**
   * Count Type CustomersCountOutputType
   */

  export type CustomersCountOutputType = {
    orders: number
  }

  export type CustomersCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | CustomersCountOutputTypeCountOrdersArgs
  }

  // Custom InputTypes
  /**
   * CustomersCountOutputType without action
   */
  export type CustomersCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomersCountOutputType
     */
    select?: CustomersCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CustomersCountOutputType without action
   */
  export type CustomersCountOutputTypeCountOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: retail_ordersWhereInput
  }


  /**
   * Models
   */

  /**
   * Model retail_books
   */

  export type AggregateRetail_books = {
    _count: Retail_booksCountAggregateOutputType | null
    _avg: Retail_booksAvgAggregateOutputType | null
    _sum: Retail_booksSumAggregateOutputType | null
    _min: Retail_booksMinAggregateOutputType | null
    _max: Retail_booksMaxAggregateOutputType | null
  }

  export type Retail_booksAvgAggregateOutputType = {
    id: number | null
    book_id: number | null
    translator_cost: number | null
    cover_design_cost: number | null
    text_design_cost: number | null
    editor_cost: number | null
    typewriting_cost: number | null
    store_cost: number | null
    distribution_cost: number | null
    advertisement_cost: number | null
    purchasing_right_cost: number | null
  }

  export type Retail_booksSumAggregateOutputType = {
    id: number | null
    book_id: number | null
    translator_cost: number | null
    cover_design_cost: number | null
    text_design_cost: number | null
    editor_cost: number | null
    typewriting_cost: number | null
    store_cost: number | null
    distribution_cost: number | null
    advertisement_cost: number | null
    purchasing_right_cost: number | null
  }

  export type Retail_booksMinAggregateOutputType = {
    id: number | null
    book_id: number | null
    title: string | null
    author: string | null
    language: string | null
    category: string | null
    publication_year: string | null
    copyright_registration_number: string | null
    book_image_url: string | null
    status: string | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
    pen_name: string | null
    translator_cost: number | null
    cover_design_cost: number | null
    text_design_cost: number | null
    editor_cost: number | null
    typewriting_cost: number | null
    store_cost: number | null
    distribution_cost: number | null
    advertisement_cost: number | null
    purchasing_right_cost: number | null
    ourbook: boolean | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
  }

  export type Retail_booksMaxAggregateOutputType = {
    id: number | null
    book_id: number | null
    title: string | null
    author: string | null
    language: string | null
    category: string | null
    publication_year: string | null
    copyright_registration_number: string | null
    book_image_url: string | null
    status: string | null
    is_deleted: boolean | null
    updatedAt: Date | null
    createdAt: Date | null
    deletedAt: Date | null
    pen_name: string | null
    translator_cost: number | null
    cover_design_cost: number | null
    text_design_cost: number | null
    editor_cost: number | null
    typewriting_cost: number | null
    store_cost: number | null
    distribution_cost: number | null
    advertisement_cost: number | null
    purchasing_right_cost: number | null
    ourbook: boolean | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
  }

  export type Retail_booksCountAggregateOutputType = {
    id: number
    book_id: number
    title: number
    author: number
    language: number
    category: number
    publication_year: number
    copyright_registration_number: number
    book_image_url: number
    status: number
    is_deleted: number
    updatedAt: number
    createdAt: number
    deletedAt: number
    pen_name: number
    translator_cost: number
    cover_design_cost: number
    text_design_cost: number
    editor_cost: number
    typewriting_cost: number
    store_cost: number
    distribution_cost: number
    advertisement_cost: number
    purchasing_right_cost: number
    ourbook: number
    created_at: number
    updated_at: number
    deleted_at: number
    _all: number
  }


  export type Retail_booksAvgAggregateInputType = {
    id?: true
    book_id?: true
    translator_cost?: true
    cover_design_cost?: true
    text_design_cost?: true
    editor_cost?: true
    typewriting_cost?: true
    store_cost?: true
    distribution_cost?: true
    advertisement_cost?: true
    purchasing_right_cost?: true
  }

  export type Retail_booksSumAggregateInputType = {
    id?: true
    book_id?: true
    translator_cost?: true
    cover_design_cost?: true
    text_design_cost?: true
    editor_cost?: true
    typewriting_cost?: true
    store_cost?: true
    distribution_cost?: true
    advertisement_cost?: true
    purchasing_right_cost?: true
  }

  export type Retail_booksMinAggregateInputType = {
    id?: true
    book_id?: true
    title?: true
    author?: true
    language?: true
    category?: true
    publication_year?: true
    copyright_registration_number?: true
    book_image_url?: true
    status?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    pen_name?: true
    translator_cost?: true
    cover_design_cost?: true
    text_design_cost?: true
    editor_cost?: true
    typewriting_cost?: true
    store_cost?: true
    distribution_cost?: true
    advertisement_cost?: true
    purchasing_right_cost?: true
    ourbook?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
  }

  export type Retail_booksMaxAggregateInputType = {
    id?: true
    book_id?: true
    title?: true
    author?: true
    language?: true
    category?: true
    publication_year?: true
    copyright_registration_number?: true
    book_image_url?: true
    status?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    pen_name?: true
    translator_cost?: true
    cover_design_cost?: true
    text_design_cost?: true
    editor_cost?: true
    typewriting_cost?: true
    store_cost?: true
    distribution_cost?: true
    advertisement_cost?: true
    purchasing_right_cost?: true
    ourbook?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
  }

  export type Retail_booksCountAggregateInputType = {
    id?: true
    book_id?: true
    title?: true
    author?: true
    language?: true
    category?: true
    publication_year?: true
    copyright_registration_number?: true
    book_image_url?: true
    status?: true
    is_deleted?: true
    updatedAt?: true
    createdAt?: true
    deletedAt?: true
    pen_name?: true
    translator_cost?: true
    cover_design_cost?: true
    text_design_cost?: true
    editor_cost?: true
    typewriting_cost?: true
    store_cost?: true
    distribution_cost?: true
    advertisement_cost?: true
    purchasing_right_cost?: true
    ourbook?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
    _all?: true
  }

  export type Retail_booksAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which retail_books to aggregate.
     */
    where?: retail_booksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of retail_books to fetch.
     */
    orderBy?: retail_booksOrderByWithRelationInput | retail_booksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: retail_booksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` retail_books from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` retail_books.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned retail_books
    **/
    _count?: true | Retail_booksCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Retail_booksAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Retail_booksSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Retail_booksMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Retail_booksMaxAggregateInputType
  }

  export type GetRetail_booksAggregateType<T extends Retail_booksAggregateArgs> = {
        [P in keyof T & keyof AggregateRetail_books]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRetail_books[P]>
      : GetScalarType<T[P], AggregateRetail_books[P]>
  }




  export type retail_booksGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: retail_booksWhereInput
    orderBy?: retail_booksOrderByWithAggregationInput | retail_booksOrderByWithAggregationInput[]
    by: Retail_booksScalarFieldEnum[] | Retail_booksScalarFieldEnum
    having?: retail_booksScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Retail_booksCountAggregateInputType | true
    _avg?: Retail_booksAvgAggregateInputType
    _sum?: Retail_booksSumAggregateInputType
    _min?: Retail_booksMinAggregateInputType
    _max?: Retail_booksMaxAggregateInputType
  }

  export type Retail_booksGroupByOutputType = {
    id: number
    book_id: number | null
    title: string
    author: string
    language: string
    category: string
    publication_year: string | null
    copyright_registration_number: string | null
    book_image_url: string | null
    status: string
    is_deleted: boolean
    updatedAt: Date
    createdAt: Date
    deletedAt: Date
    pen_name: string | null
    translator_cost: number | null
    cover_design_cost: number | null
    text_design_cost: number | null
    editor_cost: number | null
    typewriting_cost: number | null
    store_cost: number | null
    distribution_cost: number | null
    advertisement_cost: number | null
    purchasing_right_cost: number | null
    ourbook: boolean
    created_at: Date
    updated_at: Date
    deleted_at: Date
    _count: Retail_booksCountAggregateOutputType | null
    _avg: Retail_booksAvgAggregateOutputType | null
    _sum: Retail_booksSumAggregateOutputType | null
    _min: Retail_booksMinAggregateOutputType | null
    _max: Retail_booksMaxAggregateOutputType | null
  }

  type GetRetail_booksGroupByPayload<T extends retail_booksGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Retail_booksGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Retail_booksGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Retail_booksGroupByOutputType[P]>
            : GetScalarType<T[P], Retail_booksGroupByOutputType[P]>
        }
      >
    >


  export type retail_booksSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    book_id?: boolean
    title?: boolean
    author?: boolean
    language?: boolean
    category?: boolean
    publication_year?: boolean
    copyright_registration_number?: boolean
    book_image_url?: boolean
    status?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    pen_name?: boolean
    translator_cost?: boolean
    cover_design_cost?: boolean
    text_design_cost?: boolean
    editor_cost?: boolean
    typewriting_cost?: boolean
    store_cost?: boolean
    distribution_cost?: boolean
    advertisement_cost?: boolean
    purchasing_right_cost?: boolean
    ourbook?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
    bookEditions?: boolean | retail_books$bookEditionsArgs<ExtArgs>
    _count?: boolean | Retail_booksCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["retail_books"]>



  export type retail_booksSelectScalar = {
    id?: boolean
    book_id?: boolean
    title?: boolean
    author?: boolean
    language?: boolean
    category?: boolean
    publication_year?: boolean
    copyright_registration_number?: boolean
    book_image_url?: boolean
    status?: boolean
    is_deleted?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    pen_name?: boolean
    translator_cost?: boolean
    cover_design_cost?: boolean
    text_design_cost?: boolean
    editor_cost?: boolean
    typewriting_cost?: boolean
    store_cost?: boolean
    distribution_cost?: boolean
    advertisement_cost?: boolean
    purchasing_right_cost?: boolean
    ourbook?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
  }

  export type retail_booksOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "book_id" | "title" | "author" | "language" | "category" | "publication_year" | "copyright_registration_number" | "book_image_url" | "status" | "is_deleted" | "updatedAt" | "createdAt" | "deletedAt" | "pen_name" | "translator_cost" | "cover_design_cost" | "text_design_cost" | "editor_cost" | "typewriting_cost" | "store_cost" | "distribution_cost" | "advertisement_cost" | "purchasing_right_cost" | "ourbook" | "created_at" | "updated_at" | "deleted_at", ExtArgs["result"]["retail_books"]>
  export type retail_booksInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookEditions?: boolean | retail_books$bookEditionsArgs<ExtArgs>
    _count?: boolean | Retail_booksCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $retail_booksPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "retail_books"
    objects: {
      bookEditions: Prisma.$reatil_book_editionsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      book_id: number | null
      title: string
      author: string
      language: string
      category: string
      publication_year: string | null
      copyright_registration_number: string | null
      book_image_url: string | null
      status: string
      is_deleted: boolean
      updatedAt: Date
      createdAt: Date
      deletedAt: Date
      pen_name: string | null
      translator_cost: number | null
      cover_design_cost: number | null
      text_design_cost: number | null
      editor_cost: number | null
      typewriting_cost: number | null
      store_cost: number | null
      distribution_cost: number | null
      advertisement_cost: number | null
      purchasing_right_cost: number | null
      ourbook: boolean
      created_at: Date
      updated_at: Date
      deleted_at: Date
    }, ExtArgs["result"]["retail_books"]>
    composites: {}
  }

  type retail_booksGetPayload<S extends boolean | null | undefined | retail_booksDefaultArgs> = $Result.GetResult<Prisma.$retail_booksPayload, S>

  type retail_booksCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<retail_booksFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Retail_booksCountAggregateInputType | true
    }

  export interface retail_booksDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['retail_books'], meta: { name: 'retail_books' } }
    /**
     * Find zero or one Retail_books that matches the filter.
     * @param {retail_booksFindUniqueArgs} args - Arguments to find a Retail_books
     * @example
     * // Get one Retail_books
     * const retail_books = await prisma.retail_books.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends retail_booksFindUniqueArgs>(args: SelectSubset<T, retail_booksFindUniqueArgs<ExtArgs>>): Prisma__retail_booksClient<$Result.GetResult<Prisma.$retail_booksPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Retail_books that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {retail_booksFindUniqueOrThrowArgs} args - Arguments to find a Retail_books
     * @example
     * // Get one Retail_books
     * const retail_books = await prisma.retail_books.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends retail_booksFindUniqueOrThrowArgs>(args: SelectSubset<T, retail_booksFindUniqueOrThrowArgs<ExtArgs>>): Prisma__retail_booksClient<$Result.GetResult<Prisma.$retail_booksPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Retail_books that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {retail_booksFindFirstArgs} args - Arguments to find a Retail_books
     * @example
     * // Get one Retail_books
     * const retail_books = await prisma.retail_books.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends retail_booksFindFirstArgs>(args?: SelectSubset<T, retail_booksFindFirstArgs<ExtArgs>>): Prisma__retail_booksClient<$Result.GetResult<Prisma.$retail_booksPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Retail_books that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {retail_booksFindFirstOrThrowArgs} args - Arguments to find a Retail_books
     * @example
     * // Get one Retail_books
     * const retail_books = await prisma.retail_books.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends retail_booksFindFirstOrThrowArgs>(args?: SelectSubset<T, retail_booksFindFirstOrThrowArgs<ExtArgs>>): Prisma__retail_booksClient<$Result.GetResult<Prisma.$retail_booksPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Retail_books that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {retail_booksFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Retail_books
     * const retail_books = await prisma.retail_books.findMany()
     * 
     * // Get first 10 Retail_books
     * const retail_books = await prisma.retail_books.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const retail_booksWithIdOnly = await prisma.retail_books.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends retail_booksFindManyArgs>(args?: SelectSubset<T, retail_booksFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$retail_booksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Retail_books.
     * @param {retail_booksCreateArgs} args - Arguments to create a Retail_books.
     * @example
     * // Create one Retail_books
     * const Retail_books = await prisma.retail_books.create({
     *   data: {
     *     // ... data to create a Retail_books
     *   }
     * })
     * 
     */
    create<T extends retail_booksCreateArgs>(args: SelectSubset<T, retail_booksCreateArgs<ExtArgs>>): Prisma__retail_booksClient<$Result.GetResult<Prisma.$retail_booksPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Retail_books.
     * @param {retail_booksCreateManyArgs} args - Arguments to create many Retail_books.
     * @example
     * // Create many Retail_books
     * const retail_books = await prisma.retail_books.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends retail_booksCreateManyArgs>(args?: SelectSubset<T, retail_booksCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Retail_books.
     * @param {retail_booksDeleteArgs} args - Arguments to delete one Retail_books.
     * @example
     * // Delete one Retail_books
     * const Retail_books = await prisma.retail_books.delete({
     *   where: {
     *     // ... filter to delete one Retail_books
     *   }
     * })
     * 
     */
    delete<T extends retail_booksDeleteArgs>(args: SelectSubset<T, retail_booksDeleteArgs<ExtArgs>>): Prisma__retail_booksClient<$Result.GetResult<Prisma.$retail_booksPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Retail_books.
     * @param {retail_booksUpdateArgs} args - Arguments to update one Retail_books.
     * @example
     * // Update one Retail_books
     * const retail_books = await prisma.retail_books.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends retail_booksUpdateArgs>(args: SelectSubset<T, retail_booksUpdateArgs<ExtArgs>>): Prisma__retail_booksClient<$Result.GetResult<Prisma.$retail_booksPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Retail_books.
     * @param {retail_booksDeleteManyArgs} args - Arguments to filter Retail_books to delete.
     * @example
     * // Delete a few Retail_books
     * const { count } = await prisma.retail_books.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends retail_booksDeleteManyArgs>(args?: SelectSubset<T, retail_booksDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Retail_books.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {retail_booksUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Retail_books
     * const retail_books = await prisma.retail_books.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends retail_booksUpdateManyArgs>(args: SelectSubset<T, retail_booksUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Retail_books.
     * @param {retail_booksUpsertArgs} args - Arguments to update or create a Retail_books.
     * @example
     * // Update or create a Retail_books
     * const retail_books = await prisma.retail_books.upsert({
     *   create: {
     *     // ... data to create a Retail_books
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Retail_books we want to update
     *   }
     * })
     */
    upsert<T extends retail_booksUpsertArgs>(args: SelectSubset<T, retail_booksUpsertArgs<ExtArgs>>): Prisma__retail_booksClient<$Result.GetResult<Prisma.$retail_booksPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Retail_books.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {retail_booksCountArgs} args - Arguments to filter Retail_books to count.
     * @example
     * // Count the number of Retail_books
     * const count = await prisma.retail_books.count({
     *   where: {
     *     // ... the filter for the Retail_books we want to count
     *   }
     * })
    **/
    count<T extends retail_booksCountArgs>(
      args?: Subset<T, retail_booksCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Retail_booksCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Retail_books.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Retail_booksAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Retail_booksAggregateArgs>(args: Subset<T, Retail_booksAggregateArgs>): Prisma.PrismaPromise<GetRetail_booksAggregateType<T>>

    /**
     * Group by Retail_books.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {retail_booksGroupByArgs} args - Group by arguments.
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
      T extends retail_booksGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: retail_booksGroupByArgs['orderBy'] }
        : { orderBy?: retail_booksGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, retail_booksGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRetail_booksGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the retail_books model
   */
  readonly fields: retail_booksFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for retail_books.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__retail_booksClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bookEditions<T extends retail_books$bookEditionsArgs<ExtArgs> = {}>(args?: Subset<T, retail_books$bookEditionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reatil_book_editionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the retail_books model
   */
  interface retail_booksFieldRefs {
    readonly id: FieldRef<"retail_books", 'Int'>
    readonly book_id: FieldRef<"retail_books", 'Int'>
    readonly title: FieldRef<"retail_books", 'String'>
    readonly author: FieldRef<"retail_books", 'String'>
    readonly language: FieldRef<"retail_books", 'String'>
    readonly category: FieldRef<"retail_books", 'String'>
    readonly publication_year: FieldRef<"retail_books", 'String'>
    readonly copyright_registration_number: FieldRef<"retail_books", 'String'>
    readonly book_image_url: FieldRef<"retail_books", 'String'>
    readonly status: FieldRef<"retail_books", 'String'>
    readonly is_deleted: FieldRef<"retail_books", 'Boolean'>
    readonly updatedAt: FieldRef<"retail_books", 'DateTime'>
    readonly createdAt: FieldRef<"retail_books", 'DateTime'>
    readonly deletedAt: FieldRef<"retail_books", 'DateTime'>
    readonly pen_name: FieldRef<"retail_books", 'String'>
    readonly translator_cost: FieldRef<"retail_books", 'Float'>
    readonly cover_design_cost: FieldRef<"retail_books", 'Float'>
    readonly text_design_cost: FieldRef<"retail_books", 'Float'>
    readonly editor_cost: FieldRef<"retail_books", 'Float'>
    readonly typewriting_cost: FieldRef<"retail_books", 'Float'>
    readonly store_cost: FieldRef<"retail_books", 'Float'>
    readonly distribution_cost: FieldRef<"retail_books", 'Float'>
    readonly advertisement_cost: FieldRef<"retail_books", 'Float'>
    readonly purchasing_right_cost: FieldRef<"retail_books", 'Float'>
    readonly ourbook: FieldRef<"retail_books", 'Boolean'>
    readonly created_at: FieldRef<"retail_books", 'DateTime'>
    readonly updated_at: FieldRef<"retail_books", 'DateTime'>
    readonly deleted_at: FieldRef<"retail_books", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * retail_books findUnique
   */
  export type retail_booksFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_books
     */
    select?: retail_booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_books
     */
    omit?: retail_booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_booksInclude<ExtArgs> | null
    /**
     * Filter, which retail_books to fetch.
     */
    where: retail_booksWhereUniqueInput
  }

  /**
   * retail_books findUniqueOrThrow
   */
  export type retail_booksFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_books
     */
    select?: retail_booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_books
     */
    omit?: retail_booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_booksInclude<ExtArgs> | null
    /**
     * Filter, which retail_books to fetch.
     */
    where: retail_booksWhereUniqueInput
  }

  /**
   * retail_books findFirst
   */
  export type retail_booksFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_books
     */
    select?: retail_booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_books
     */
    omit?: retail_booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_booksInclude<ExtArgs> | null
    /**
     * Filter, which retail_books to fetch.
     */
    where?: retail_booksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of retail_books to fetch.
     */
    orderBy?: retail_booksOrderByWithRelationInput | retail_booksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for retail_books.
     */
    cursor?: retail_booksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` retail_books from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` retail_books.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of retail_books.
     */
    distinct?: Retail_booksScalarFieldEnum | Retail_booksScalarFieldEnum[]
  }

  /**
   * retail_books findFirstOrThrow
   */
  export type retail_booksFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_books
     */
    select?: retail_booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_books
     */
    omit?: retail_booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_booksInclude<ExtArgs> | null
    /**
     * Filter, which retail_books to fetch.
     */
    where?: retail_booksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of retail_books to fetch.
     */
    orderBy?: retail_booksOrderByWithRelationInput | retail_booksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for retail_books.
     */
    cursor?: retail_booksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` retail_books from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` retail_books.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of retail_books.
     */
    distinct?: Retail_booksScalarFieldEnum | Retail_booksScalarFieldEnum[]
  }

  /**
   * retail_books findMany
   */
  export type retail_booksFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_books
     */
    select?: retail_booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_books
     */
    omit?: retail_booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_booksInclude<ExtArgs> | null
    /**
     * Filter, which retail_books to fetch.
     */
    where?: retail_booksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of retail_books to fetch.
     */
    orderBy?: retail_booksOrderByWithRelationInput | retail_booksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing retail_books.
     */
    cursor?: retail_booksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` retail_books from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` retail_books.
     */
    skip?: number
    distinct?: Retail_booksScalarFieldEnum | Retail_booksScalarFieldEnum[]
  }

  /**
   * retail_books create
   */
  export type retail_booksCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_books
     */
    select?: retail_booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_books
     */
    omit?: retail_booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_booksInclude<ExtArgs> | null
    /**
     * The data needed to create a retail_books.
     */
    data: XOR<retail_booksCreateInput, retail_booksUncheckedCreateInput>
  }

  /**
   * retail_books createMany
   */
  export type retail_booksCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many retail_books.
     */
    data: retail_booksCreateManyInput | retail_booksCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * retail_books update
   */
  export type retail_booksUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_books
     */
    select?: retail_booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_books
     */
    omit?: retail_booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_booksInclude<ExtArgs> | null
    /**
     * The data needed to update a retail_books.
     */
    data: XOR<retail_booksUpdateInput, retail_booksUncheckedUpdateInput>
    /**
     * Choose, which retail_books to update.
     */
    where: retail_booksWhereUniqueInput
  }

  /**
   * retail_books updateMany
   */
  export type retail_booksUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update retail_books.
     */
    data: XOR<retail_booksUpdateManyMutationInput, retail_booksUncheckedUpdateManyInput>
    /**
     * Filter which retail_books to update
     */
    where?: retail_booksWhereInput
    /**
     * Limit how many retail_books to update.
     */
    limit?: number
  }

  /**
   * retail_books upsert
   */
  export type retail_booksUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_books
     */
    select?: retail_booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_books
     */
    omit?: retail_booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_booksInclude<ExtArgs> | null
    /**
     * The filter to search for the retail_books to update in case it exists.
     */
    where: retail_booksWhereUniqueInput
    /**
     * In case the retail_books found by the `where` argument doesn't exist, create a new retail_books with this data.
     */
    create: XOR<retail_booksCreateInput, retail_booksUncheckedCreateInput>
    /**
     * In case the retail_books was found with the provided `where` argument, update it with this data.
     */
    update: XOR<retail_booksUpdateInput, retail_booksUncheckedUpdateInput>
  }

  /**
   * retail_books delete
   */
  export type retail_booksDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_books
     */
    select?: retail_booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_books
     */
    omit?: retail_booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_booksInclude<ExtArgs> | null
    /**
     * Filter which retail_books to delete.
     */
    where: retail_booksWhereUniqueInput
  }

  /**
   * retail_books deleteMany
   */
  export type retail_booksDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which retail_books to delete
     */
    where?: retail_booksWhereInput
    /**
     * Limit how many retail_books to delete.
     */
    limit?: number
  }

  /**
   * retail_books.bookEditions
   */
  export type retail_books$bookEditionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reatil_book_editions
     */
    select?: reatil_book_editionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reatil_book_editions
     */
    omit?: reatil_book_editionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reatil_book_editionsInclude<ExtArgs> | null
    where?: reatil_book_editionsWhereInput
    orderBy?: reatil_book_editionsOrderByWithRelationInput | reatil_book_editionsOrderByWithRelationInput[]
    cursor?: reatil_book_editionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Reatil_book_editionsScalarFieldEnum | Reatil_book_editionsScalarFieldEnum[]
  }

  /**
   * retail_books without action
   */
  export type retail_booksDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_books
     */
    select?: retail_booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_books
     */
    omit?: retail_booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_booksInclude<ExtArgs> | null
  }


  /**
   * Model reatil_book_editions
   */

  export type AggregateReatil_book_editions = {
    _count: Reatil_book_editionsCountAggregateOutputType | null
    _avg: Reatil_book_editionsAvgAggregateOutputType | null
    _sum: Reatil_book_editionsSumAggregateOutputType | null
    _min: Reatil_book_editionsMinAggregateOutputType | null
    _max: Reatil_book_editionsMaxAggregateOutputType | null
  }

  export type Reatil_book_editionsAvgAggregateOutputType = {
    id: number | null
    book_id: number | null
    price: number | null
  }

  export type Reatil_book_editionsSumAggregateOutputType = {
    id: number | null
    book_id: number | null
    price: number | null
  }

  export type Reatil_book_editionsMinAggregateOutputType = {
    id: number | null
    edition_name: string | null
    book_id: number | null
    price: number | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
  }

  export type Reatil_book_editionsMaxAggregateOutputType = {
    id: number | null
    edition_name: string | null
    book_id: number | null
    price: number | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
  }

  export type Reatil_book_editionsCountAggregateOutputType = {
    id: number
    edition_name: number
    book_id: number
    price: number
    created_at: number
    updated_at: number
    deleted_at: number
    _all: number
  }


  export type Reatil_book_editionsAvgAggregateInputType = {
    id?: true
    book_id?: true
    price?: true
  }

  export type Reatil_book_editionsSumAggregateInputType = {
    id?: true
    book_id?: true
    price?: true
  }

  export type Reatil_book_editionsMinAggregateInputType = {
    id?: true
    edition_name?: true
    book_id?: true
    price?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
  }

  export type Reatil_book_editionsMaxAggregateInputType = {
    id?: true
    edition_name?: true
    book_id?: true
    price?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
  }

  export type Reatil_book_editionsCountAggregateInputType = {
    id?: true
    edition_name?: true
    book_id?: true
    price?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
    _all?: true
  }

  export type Reatil_book_editionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which reatil_book_editions to aggregate.
     */
    where?: reatil_book_editionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reatil_book_editions to fetch.
     */
    orderBy?: reatil_book_editionsOrderByWithRelationInput | reatil_book_editionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: reatil_book_editionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reatil_book_editions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reatil_book_editions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned reatil_book_editions
    **/
    _count?: true | Reatil_book_editionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Reatil_book_editionsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Reatil_book_editionsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Reatil_book_editionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Reatil_book_editionsMaxAggregateInputType
  }

  export type GetReatil_book_editionsAggregateType<T extends Reatil_book_editionsAggregateArgs> = {
        [P in keyof T & keyof AggregateReatil_book_editions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReatil_book_editions[P]>
      : GetScalarType<T[P], AggregateReatil_book_editions[P]>
  }




  export type reatil_book_editionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: reatil_book_editionsWhereInput
    orderBy?: reatil_book_editionsOrderByWithAggregationInput | reatil_book_editionsOrderByWithAggregationInput[]
    by: Reatil_book_editionsScalarFieldEnum[] | Reatil_book_editionsScalarFieldEnum
    having?: reatil_book_editionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Reatil_book_editionsCountAggregateInputType | true
    _avg?: Reatil_book_editionsAvgAggregateInputType
    _sum?: Reatil_book_editionsSumAggregateInputType
    _min?: Reatil_book_editionsMinAggregateInputType
    _max?: Reatil_book_editionsMaxAggregateInputType
  }

  export type Reatil_book_editionsGroupByOutputType = {
    id: number
    edition_name: string
    book_id: number | null
    price: number | null
    created_at: Date
    updated_at: Date
    deleted_at: Date
    _count: Reatil_book_editionsCountAggregateOutputType | null
    _avg: Reatil_book_editionsAvgAggregateOutputType | null
    _sum: Reatil_book_editionsSumAggregateOutputType | null
    _min: Reatil_book_editionsMinAggregateOutputType | null
    _max: Reatil_book_editionsMaxAggregateOutputType | null
  }

  type GetReatil_book_editionsGroupByPayload<T extends reatil_book_editionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Reatil_book_editionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Reatil_book_editionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Reatil_book_editionsGroupByOutputType[P]>
            : GetScalarType<T[P], Reatil_book_editionsGroupByOutputType[P]>
        }
      >
    >


  export type reatil_book_editionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    edition_name?: boolean
    book_id?: boolean
    price?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
    books?: boolean | reatil_book_editions$booksArgs<ExtArgs>
    orders?: boolean | reatil_book_editions$ordersArgs<ExtArgs>
    _count?: boolean | Reatil_book_editionsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reatil_book_editions"]>



  export type reatil_book_editionsSelectScalar = {
    id?: boolean
    edition_name?: boolean
    book_id?: boolean
    price?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
  }

  export type reatil_book_editionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "edition_name" | "book_id" | "price" | "created_at" | "updated_at" | "deleted_at", ExtArgs["result"]["reatil_book_editions"]>
  export type reatil_book_editionsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    books?: boolean | reatil_book_editions$booksArgs<ExtArgs>
    orders?: boolean | reatil_book_editions$ordersArgs<ExtArgs>
    _count?: boolean | Reatil_book_editionsCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $reatil_book_editionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "reatil_book_editions"
    objects: {
      books: Prisma.$retail_booksPayload<ExtArgs> | null
      orders: Prisma.$retail_ordersPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      edition_name: string
      book_id: number | null
      price: number | null
      created_at: Date
      updated_at: Date
      deleted_at: Date
    }, ExtArgs["result"]["reatil_book_editions"]>
    composites: {}
  }

  type reatil_book_editionsGetPayload<S extends boolean | null | undefined | reatil_book_editionsDefaultArgs> = $Result.GetResult<Prisma.$reatil_book_editionsPayload, S>

  type reatil_book_editionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<reatil_book_editionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Reatil_book_editionsCountAggregateInputType | true
    }

  export interface reatil_book_editionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['reatil_book_editions'], meta: { name: 'reatil_book_editions' } }
    /**
     * Find zero or one Reatil_book_editions that matches the filter.
     * @param {reatil_book_editionsFindUniqueArgs} args - Arguments to find a Reatil_book_editions
     * @example
     * // Get one Reatil_book_editions
     * const reatil_book_editions = await prisma.reatil_book_editions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends reatil_book_editionsFindUniqueArgs>(args: SelectSubset<T, reatil_book_editionsFindUniqueArgs<ExtArgs>>): Prisma__reatil_book_editionsClient<$Result.GetResult<Prisma.$reatil_book_editionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Reatil_book_editions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {reatil_book_editionsFindUniqueOrThrowArgs} args - Arguments to find a Reatil_book_editions
     * @example
     * // Get one Reatil_book_editions
     * const reatil_book_editions = await prisma.reatil_book_editions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends reatil_book_editionsFindUniqueOrThrowArgs>(args: SelectSubset<T, reatil_book_editionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__reatil_book_editionsClient<$Result.GetResult<Prisma.$reatil_book_editionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reatil_book_editions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reatil_book_editionsFindFirstArgs} args - Arguments to find a Reatil_book_editions
     * @example
     * // Get one Reatil_book_editions
     * const reatil_book_editions = await prisma.reatil_book_editions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends reatil_book_editionsFindFirstArgs>(args?: SelectSubset<T, reatil_book_editionsFindFirstArgs<ExtArgs>>): Prisma__reatil_book_editionsClient<$Result.GetResult<Prisma.$reatil_book_editionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reatil_book_editions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reatil_book_editionsFindFirstOrThrowArgs} args - Arguments to find a Reatil_book_editions
     * @example
     * // Get one Reatil_book_editions
     * const reatil_book_editions = await prisma.reatil_book_editions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends reatil_book_editionsFindFirstOrThrowArgs>(args?: SelectSubset<T, reatil_book_editionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__reatil_book_editionsClient<$Result.GetResult<Prisma.$reatil_book_editionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reatil_book_editions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reatil_book_editionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reatil_book_editions
     * const reatil_book_editions = await prisma.reatil_book_editions.findMany()
     * 
     * // Get first 10 Reatil_book_editions
     * const reatil_book_editions = await prisma.reatil_book_editions.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reatil_book_editionsWithIdOnly = await prisma.reatil_book_editions.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends reatil_book_editionsFindManyArgs>(args?: SelectSubset<T, reatil_book_editionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reatil_book_editionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Reatil_book_editions.
     * @param {reatil_book_editionsCreateArgs} args - Arguments to create a Reatil_book_editions.
     * @example
     * // Create one Reatil_book_editions
     * const Reatil_book_editions = await prisma.reatil_book_editions.create({
     *   data: {
     *     // ... data to create a Reatil_book_editions
     *   }
     * })
     * 
     */
    create<T extends reatil_book_editionsCreateArgs>(args: SelectSubset<T, reatil_book_editionsCreateArgs<ExtArgs>>): Prisma__reatil_book_editionsClient<$Result.GetResult<Prisma.$reatil_book_editionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reatil_book_editions.
     * @param {reatil_book_editionsCreateManyArgs} args - Arguments to create many Reatil_book_editions.
     * @example
     * // Create many Reatil_book_editions
     * const reatil_book_editions = await prisma.reatil_book_editions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends reatil_book_editionsCreateManyArgs>(args?: SelectSubset<T, reatil_book_editionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Reatil_book_editions.
     * @param {reatil_book_editionsDeleteArgs} args - Arguments to delete one Reatil_book_editions.
     * @example
     * // Delete one Reatil_book_editions
     * const Reatil_book_editions = await prisma.reatil_book_editions.delete({
     *   where: {
     *     // ... filter to delete one Reatil_book_editions
     *   }
     * })
     * 
     */
    delete<T extends reatil_book_editionsDeleteArgs>(args: SelectSubset<T, reatil_book_editionsDeleteArgs<ExtArgs>>): Prisma__reatil_book_editionsClient<$Result.GetResult<Prisma.$reatil_book_editionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Reatil_book_editions.
     * @param {reatil_book_editionsUpdateArgs} args - Arguments to update one Reatil_book_editions.
     * @example
     * // Update one Reatil_book_editions
     * const reatil_book_editions = await prisma.reatil_book_editions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends reatil_book_editionsUpdateArgs>(args: SelectSubset<T, reatil_book_editionsUpdateArgs<ExtArgs>>): Prisma__reatil_book_editionsClient<$Result.GetResult<Prisma.$reatil_book_editionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reatil_book_editions.
     * @param {reatil_book_editionsDeleteManyArgs} args - Arguments to filter Reatil_book_editions to delete.
     * @example
     * // Delete a few Reatil_book_editions
     * const { count } = await prisma.reatil_book_editions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends reatil_book_editionsDeleteManyArgs>(args?: SelectSubset<T, reatil_book_editionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reatil_book_editions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reatil_book_editionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reatil_book_editions
     * const reatil_book_editions = await prisma.reatil_book_editions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends reatil_book_editionsUpdateManyArgs>(args: SelectSubset<T, reatil_book_editionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Reatil_book_editions.
     * @param {reatil_book_editionsUpsertArgs} args - Arguments to update or create a Reatil_book_editions.
     * @example
     * // Update or create a Reatil_book_editions
     * const reatil_book_editions = await prisma.reatil_book_editions.upsert({
     *   create: {
     *     // ... data to create a Reatil_book_editions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reatil_book_editions we want to update
     *   }
     * })
     */
    upsert<T extends reatil_book_editionsUpsertArgs>(args: SelectSubset<T, reatil_book_editionsUpsertArgs<ExtArgs>>): Prisma__reatil_book_editionsClient<$Result.GetResult<Prisma.$reatil_book_editionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reatil_book_editions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reatil_book_editionsCountArgs} args - Arguments to filter Reatil_book_editions to count.
     * @example
     * // Count the number of Reatil_book_editions
     * const count = await prisma.reatil_book_editions.count({
     *   where: {
     *     // ... the filter for the Reatil_book_editions we want to count
     *   }
     * })
    **/
    count<T extends reatil_book_editionsCountArgs>(
      args?: Subset<T, reatil_book_editionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Reatil_book_editionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reatil_book_editions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Reatil_book_editionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Reatil_book_editionsAggregateArgs>(args: Subset<T, Reatil_book_editionsAggregateArgs>): Prisma.PrismaPromise<GetReatil_book_editionsAggregateType<T>>

    /**
     * Group by Reatil_book_editions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reatil_book_editionsGroupByArgs} args - Group by arguments.
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
      T extends reatil_book_editionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: reatil_book_editionsGroupByArgs['orderBy'] }
        : { orderBy?: reatil_book_editionsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, reatil_book_editionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReatil_book_editionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the reatil_book_editions model
   */
  readonly fields: reatil_book_editionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for reatil_book_editions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__reatil_book_editionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    books<T extends reatil_book_editions$booksArgs<ExtArgs> = {}>(args?: Subset<T, reatil_book_editions$booksArgs<ExtArgs>>): Prisma__retail_booksClient<$Result.GetResult<Prisma.$retail_booksPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    orders<T extends reatil_book_editions$ordersArgs<ExtArgs> = {}>(args?: Subset<T, reatil_book_editions$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$retail_ordersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the reatil_book_editions model
   */
  interface reatil_book_editionsFieldRefs {
    readonly id: FieldRef<"reatil_book_editions", 'Int'>
    readonly edition_name: FieldRef<"reatil_book_editions", 'String'>
    readonly book_id: FieldRef<"reatil_book_editions", 'Int'>
    readonly price: FieldRef<"reatil_book_editions", 'Float'>
    readonly created_at: FieldRef<"reatil_book_editions", 'DateTime'>
    readonly updated_at: FieldRef<"reatil_book_editions", 'DateTime'>
    readonly deleted_at: FieldRef<"reatil_book_editions", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * reatil_book_editions findUnique
   */
  export type reatil_book_editionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reatil_book_editions
     */
    select?: reatil_book_editionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reatil_book_editions
     */
    omit?: reatil_book_editionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reatil_book_editionsInclude<ExtArgs> | null
    /**
     * Filter, which reatil_book_editions to fetch.
     */
    where: reatil_book_editionsWhereUniqueInput
  }

  /**
   * reatil_book_editions findUniqueOrThrow
   */
  export type reatil_book_editionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reatil_book_editions
     */
    select?: reatil_book_editionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reatil_book_editions
     */
    omit?: reatil_book_editionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reatil_book_editionsInclude<ExtArgs> | null
    /**
     * Filter, which reatil_book_editions to fetch.
     */
    where: reatil_book_editionsWhereUniqueInput
  }

  /**
   * reatil_book_editions findFirst
   */
  export type reatil_book_editionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reatil_book_editions
     */
    select?: reatil_book_editionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reatil_book_editions
     */
    omit?: reatil_book_editionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reatil_book_editionsInclude<ExtArgs> | null
    /**
     * Filter, which reatil_book_editions to fetch.
     */
    where?: reatil_book_editionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reatil_book_editions to fetch.
     */
    orderBy?: reatil_book_editionsOrderByWithRelationInput | reatil_book_editionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for reatil_book_editions.
     */
    cursor?: reatil_book_editionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reatil_book_editions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reatil_book_editions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of reatil_book_editions.
     */
    distinct?: Reatil_book_editionsScalarFieldEnum | Reatil_book_editionsScalarFieldEnum[]
  }

  /**
   * reatil_book_editions findFirstOrThrow
   */
  export type reatil_book_editionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reatil_book_editions
     */
    select?: reatil_book_editionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reatil_book_editions
     */
    omit?: reatil_book_editionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reatil_book_editionsInclude<ExtArgs> | null
    /**
     * Filter, which reatil_book_editions to fetch.
     */
    where?: reatil_book_editionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reatil_book_editions to fetch.
     */
    orderBy?: reatil_book_editionsOrderByWithRelationInput | reatil_book_editionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for reatil_book_editions.
     */
    cursor?: reatil_book_editionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reatil_book_editions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reatil_book_editions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of reatil_book_editions.
     */
    distinct?: Reatil_book_editionsScalarFieldEnum | Reatil_book_editionsScalarFieldEnum[]
  }

  /**
   * reatil_book_editions findMany
   */
  export type reatil_book_editionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reatil_book_editions
     */
    select?: reatil_book_editionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reatil_book_editions
     */
    omit?: reatil_book_editionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reatil_book_editionsInclude<ExtArgs> | null
    /**
     * Filter, which reatil_book_editions to fetch.
     */
    where?: reatil_book_editionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reatil_book_editions to fetch.
     */
    orderBy?: reatil_book_editionsOrderByWithRelationInput | reatil_book_editionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing reatil_book_editions.
     */
    cursor?: reatil_book_editionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reatil_book_editions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reatil_book_editions.
     */
    skip?: number
    distinct?: Reatil_book_editionsScalarFieldEnum | Reatil_book_editionsScalarFieldEnum[]
  }

  /**
   * reatil_book_editions create
   */
  export type reatil_book_editionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reatil_book_editions
     */
    select?: reatil_book_editionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reatil_book_editions
     */
    omit?: reatil_book_editionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reatil_book_editionsInclude<ExtArgs> | null
    /**
     * The data needed to create a reatil_book_editions.
     */
    data: XOR<reatil_book_editionsCreateInput, reatil_book_editionsUncheckedCreateInput>
  }

  /**
   * reatil_book_editions createMany
   */
  export type reatil_book_editionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many reatil_book_editions.
     */
    data: reatil_book_editionsCreateManyInput | reatil_book_editionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * reatil_book_editions update
   */
  export type reatil_book_editionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reatil_book_editions
     */
    select?: reatil_book_editionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reatil_book_editions
     */
    omit?: reatil_book_editionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reatil_book_editionsInclude<ExtArgs> | null
    /**
     * The data needed to update a reatil_book_editions.
     */
    data: XOR<reatil_book_editionsUpdateInput, reatil_book_editionsUncheckedUpdateInput>
    /**
     * Choose, which reatil_book_editions to update.
     */
    where: reatil_book_editionsWhereUniqueInput
  }

  /**
   * reatil_book_editions updateMany
   */
  export type reatil_book_editionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update reatil_book_editions.
     */
    data: XOR<reatil_book_editionsUpdateManyMutationInput, reatil_book_editionsUncheckedUpdateManyInput>
    /**
     * Filter which reatil_book_editions to update
     */
    where?: reatil_book_editionsWhereInput
    /**
     * Limit how many reatil_book_editions to update.
     */
    limit?: number
  }

  /**
   * reatil_book_editions upsert
   */
  export type reatil_book_editionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reatil_book_editions
     */
    select?: reatil_book_editionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reatil_book_editions
     */
    omit?: reatil_book_editionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reatil_book_editionsInclude<ExtArgs> | null
    /**
     * The filter to search for the reatil_book_editions to update in case it exists.
     */
    where: reatil_book_editionsWhereUniqueInput
    /**
     * In case the reatil_book_editions found by the `where` argument doesn't exist, create a new reatil_book_editions with this data.
     */
    create: XOR<reatil_book_editionsCreateInput, reatil_book_editionsUncheckedCreateInput>
    /**
     * In case the reatil_book_editions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<reatil_book_editionsUpdateInput, reatil_book_editionsUncheckedUpdateInput>
  }

  /**
   * reatil_book_editions delete
   */
  export type reatil_book_editionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reatil_book_editions
     */
    select?: reatil_book_editionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reatil_book_editions
     */
    omit?: reatil_book_editionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reatil_book_editionsInclude<ExtArgs> | null
    /**
     * Filter which reatil_book_editions to delete.
     */
    where: reatil_book_editionsWhereUniqueInput
  }

  /**
   * reatil_book_editions deleteMany
   */
  export type reatil_book_editionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which reatil_book_editions to delete
     */
    where?: reatil_book_editionsWhereInput
    /**
     * Limit how many reatil_book_editions to delete.
     */
    limit?: number
  }

  /**
   * reatil_book_editions.books
   */
  export type reatil_book_editions$booksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_books
     */
    select?: retail_booksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_books
     */
    omit?: retail_booksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_booksInclude<ExtArgs> | null
    where?: retail_booksWhereInput
  }

  /**
   * reatil_book_editions.orders
   */
  export type reatil_book_editions$ordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_orders
     */
    select?: retail_ordersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_orders
     */
    omit?: retail_ordersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_ordersInclude<ExtArgs> | null
    where?: retail_ordersWhereInput
    orderBy?: retail_ordersOrderByWithRelationInput | retail_ordersOrderByWithRelationInput[]
    cursor?: retail_ordersWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Retail_ordersScalarFieldEnum | Retail_ordersScalarFieldEnum[]
  }

  /**
   * reatil_book_editions without action
   */
  export type reatil_book_editionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reatil_book_editions
     */
    select?: reatil_book_editionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reatil_book_editions
     */
    omit?: reatil_book_editionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reatil_book_editionsInclude<ExtArgs> | null
  }


  /**
   * Model retail_orders
   */

  export type AggregateRetail_orders = {
    _count: Retail_ordersCountAggregateOutputType | null
    _avg: Retail_ordersAvgAggregateOutputType | null
    _sum: Retail_ordersSumAggregateOutputType | null
    _min: Retail_ordersMinAggregateOutputType | null
    _max: Retail_ordersMaxAggregateOutputType | null
  }

  export type Retail_ordersAvgAggregateOutputType = {
    id: number | null
    book_edition_id: number | null
    total_price: number | null
    quantity: number | null
    customerId: number | null
  }

  export type Retail_ordersSumAggregateOutputType = {
    id: number | null
    book_edition_id: number | null
    total_price: number | null
    quantity: number | null
    customerId: number | null
  }

  export type Retail_ordersMinAggregateOutputType = {
    id: number | null
    book_edition_id: number | null
    total_price: number | null
    quantity: number | null
    customerId: number | null
    phoneNumber: string | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
  }

  export type Retail_ordersMaxAggregateOutputType = {
    id: number | null
    book_edition_id: number | null
    total_price: number | null
    quantity: number | null
    customerId: number | null
    phoneNumber: string | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
  }

  export type Retail_ordersCountAggregateOutputType = {
    id: number
    book_edition_id: number
    total_price: number
    quantity: number
    customerId: number
    phoneNumber: number
    created_at: number
    updated_at: number
    deleted_at: number
    _all: number
  }


  export type Retail_ordersAvgAggregateInputType = {
    id?: true
    book_edition_id?: true
    total_price?: true
    quantity?: true
    customerId?: true
  }

  export type Retail_ordersSumAggregateInputType = {
    id?: true
    book_edition_id?: true
    total_price?: true
    quantity?: true
    customerId?: true
  }

  export type Retail_ordersMinAggregateInputType = {
    id?: true
    book_edition_id?: true
    total_price?: true
    quantity?: true
    customerId?: true
    phoneNumber?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
  }

  export type Retail_ordersMaxAggregateInputType = {
    id?: true
    book_edition_id?: true
    total_price?: true
    quantity?: true
    customerId?: true
    phoneNumber?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
  }

  export type Retail_ordersCountAggregateInputType = {
    id?: true
    book_edition_id?: true
    total_price?: true
    quantity?: true
    customerId?: true
    phoneNumber?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
    _all?: true
  }

  export type Retail_ordersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which retail_orders to aggregate.
     */
    where?: retail_ordersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of retail_orders to fetch.
     */
    orderBy?: retail_ordersOrderByWithRelationInput | retail_ordersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: retail_ordersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` retail_orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` retail_orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned retail_orders
    **/
    _count?: true | Retail_ordersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Retail_ordersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Retail_ordersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Retail_ordersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Retail_ordersMaxAggregateInputType
  }

  export type GetRetail_ordersAggregateType<T extends Retail_ordersAggregateArgs> = {
        [P in keyof T & keyof AggregateRetail_orders]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRetail_orders[P]>
      : GetScalarType<T[P], AggregateRetail_orders[P]>
  }




  export type retail_ordersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: retail_ordersWhereInput
    orderBy?: retail_ordersOrderByWithAggregationInput | retail_ordersOrderByWithAggregationInput[]
    by: Retail_ordersScalarFieldEnum[] | Retail_ordersScalarFieldEnum
    having?: retail_ordersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Retail_ordersCountAggregateInputType | true
    _avg?: Retail_ordersAvgAggregateInputType
    _sum?: Retail_ordersSumAggregateInputType
    _min?: Retail_ordersMinAggregateInputType
    _max?: Retail_ordersMaxAggregateInputType
  }

  export type Retail_ordersGroupByOutputType = {
    id: number
    book_edition_id: number
    total_price: number | null
    quantity: number | null
    customerId: number | null
    phoneNumber: string | null
    created_at: Date
    updated_at: Date
    deleted_at: Date
    _count: Retail_ordersCountAggregateOutputType | null
    _avg: Retail_ordersAvgAggregateOutputType | null
    _sum: Retail_ordersSumAggregateOutputType | null
    _min: Retail_ordersMinAggregateOutputType | null
    _max: Retail_ordersMaxAggregateOutputType | null
  }

  type GetRetail_ordersGroupByPayload<T extends retail_ordersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Retail_ordersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Retail_ordersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Retail_ordersGroupByOutputType[P]>
            : GetScalarType<T[P], Retail_ordersGroupByOutputType[P]>
        }
      >
    >


  export type retail_ordersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    book_edition_id?: boolean
    total_price?: boolean
    quantity?: boolean
    customerId?: boolean
    phoneNumber?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
    book?: boolean | reatil_book_editionsDefaultArgs<ExtArgs>
    customer?: boolean | retail_orders$customerArgs<ExtArgs>
  }, ExtArgs["result"]["retail_orders"]>



  export type retail_ordersSelectScalar = {
    id?: boolean
    book_edition_id?: boolean
    total_price?: boolean
    quantity?: boolean
    customerId?: boolean
    phoneNumber?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
  }

  export type retail_ordersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "book_edition_id" | "total_price" | "quantity" | "customerId" | "phoneNumber" | "created_at" | "updated_at" | "deleted_at", ExtArgs["result"]["retail_orders"]>
  export type retail_ordersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    book?: boolean | reatil_book_editionsDefaultArgs<ExtArgs>
    customer?: boolean | retail_orders$customerArgs<ExtArgs>
  }

  export type $retail_ordersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "retail_orders"
    objects: {
      book: Prisma.$reatil_book_editionsPayload<ExtArgs>
      customer: Prisma.$customersPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      book_edition_id: number
      total_price: number | null
      quantity: number | null
      customerId: number | null
      phoneNumber: string | null
      created_at: Date
      updated_at: Date
      deleted_at: Date
    }, ExtArgs["result"]["retail_orders"]>
    composites: {}
  }

  type retail_ordersGetPayload<S extends boolean | null | undefined | retail_ordersDefaultArgs> = $Result.GetResult<Prisma.$retail_ordersPayload, S>

  type retail_ordersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<retail_ordersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Retail_ordersCountAggregateInputType | true
    }

  export interface retail_ordersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['retail_orders'], meta: { name: 'retail_orders' } }
    /**
     * Find zero or one Retail_orders that matches the filter.
     * @param {retail_ordersFindUniqueArgs} args - Arguments to find a Retail_orders
     * @example
     * // Get one Retail_orders
     * const retail_orders = await prisma.retail_orders.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends retail_ordersFindUniqueArgs>(args: SelectSubset<T, retail_ordersFindUniqueArgs<ExtArgs>>): Prisma__retail_ordersClient<$Result.GetResult<Prisma.$retail_ordersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Retail_orders that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {retail_ordersFindUniqueOrThrowArgs} args - Arguments to find a Retail_orders
     * @example
     * // Get one Retail_orders
     * const retail_orders = await prisma.retail_orders.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends retail_ordersFindUniqueOrThrowArgs>(args: SelectSubset<T, retail_ordersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__retail_ordersClient<$Result.GetResult<Prisma.$retail_ordersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Retail_orders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {retail_ordersFindFirstArgs} args - Arguments to find a Retail_orders
     * @example
     * // Get one Retail_orders
     * const retail_orders = await prisma.retail_orders.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends retail_ordersFindFirstArgs>(args?: SelectSubset<T, retail_ordersFindFirstArgs<ExtArgs>>): Prisma__retail_ordersClient<$Result.GetResult<Prisma.$retail_ordersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Retail_orders that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {retail_ordersFindFirstOrThrowArgs} args - Arguments to find a Retail_orders
     * @example
     * // Get one Retail_orders
     * const retail_orders = await prisma.retail_orders.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends retail_ordersFindFirstOrThrowArgs>(args?: SelectSubset<T, retail_ordersFindFirstOrThrowArgs<ExtArgs>>): Prisma__retail_ordersClient<$Result.GetResult<Prisma.$retail_ordersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Retail_orders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {retail_ordersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Retail_orders
     * const retail_orders = await prisma.retail_orders.findMany()
     * 
     * // Get first 10 Retail_orders
     * const retail_orders = await prisma.retail_orders.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const retail_ordersWithIdOnly = await prisma.retail_orders.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends retail_ordersFindManyArgs>(args?: SelectSubset<T, retail_ordersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$retail_ordersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Retail_orders.
     * @param {retail_ordersCreateArgs} args - Arguments to create a Retail_orders.
     * @example
     * // Create one Retail_orders
     * const Retail_orders = await prisma.retail_orders.create({
     *   data: {
     *     // ... data to create a Retail_orders
     *   }
     * })
     * 
     */
    create<T extends retail_ordersCreateArgs>(args: SelectSubset<T, retail_ordersCreateArgs<ExtArgs>>): Prisma__retail_ordersClient<$Result.GetResult<Prisma.$retail_ordersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Retail_orders.
     * @param {retail_ordersCreateManyArgs} args - Arguments to create many Retail_orders.
     * @example
     * // Create many Retail_orders
     * const retail_orders = await prisma.retail_orders.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends retail_ordersCreateManyArgs>(args?: SelectSubset<T, retail_ordersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Retail_orders.
     * @param {retail_ordersDeleteArgs} args - Arguments to delete one Retail_orders.
     * @example
     * // Delete one Retail_orders
     * const Retail_orders = await prisma.retail_orders.delete({
     *   where: {
     *     // ... filter to delete one Retail_orders
     *   }
     * })
     * 
     */
    delete<T extends retail_ordersDeleteArgs>(args: SelectSubset<T, retail_ordersDeleteArgs<ExtArgs>>): Prisma__retail_ordersClient<$Result.GetResult<Prisma.$retail_ordersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Retail_orders.
     * @param {retail_ordersUpdateArgs} args - Arguments to update one Retail_orders.
     * @example
     * // Update one Retail_orders
     * const retail_orders = await prisma.retail_orders.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends retail_ordersUpdateArgs>(args: SelectSubset<T, retail_ordersUpdateArgs<ExtArgs>>): Prisma__retail_ordersClient<$Result.GetResult<Prisma.$retail_ordersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Retail_orders.
     * @param {retail_ordersDeleteManyArgs} args - Arguments to filter Retail_orders to delete.
     * @example
     * // Delete a few Retail_orders
     * const { count } = await prisma.retail_orders.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends retail_ordersDeleteManyArgs>(args?: SelectSubset<T, retail_ordersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Retail_orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {retail_ordersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Retail_orders
     * const retail_orders = await prisma.retail_orders.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends retail_ordersUpdateManyArgs>(args: SelectSubset<T, retail_ordersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Retail_orders.
     * @param {retail_ordersUpsertArgs} args - Arguments to update or create a Retail_orders.
     * @example
     * // Update or create a Retail_orders
     * const retail_orders = await prisma.retail_orders.upsert({
     *   create: {
     *     // ... data to create a Retail_orders
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Retail_orders we want to update
     *   }
     * })
     */
    upsert<T extends retail_ordersUpsertArgs>(args: SelectSubset<T, retail_ordersUpsertArgs<ExtArgs>>): Prisma__retail_ordersClient<$Result.GetResult<Prisma.$retail_ordersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Retail_orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {retail_ordersCountArgs} args - Arguments to filter Retail_orders to count.
     * @example
     * // Count the number of Retail_orders
     * const count = await prisma.retail_orders.count({
     *   where: {
     *     // ... the filter for the Retail_orders we want to count
     *   }
     * })
    **/
    count<T extends retail_ordersCountArgs>(
      args?: Subset<T, retail_ordersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Retail_ordersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Retail_orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Retail_ordersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Retail_ordersAggregateArgs>(args: Subset<T, Retail_ordersAggregateArgs>): Prisma.PrismaPromise<GetRetail_ordersAggregateType<T>>

    /**
     * Group by Retail_orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {retail_ordersGroupByArgs} args - Group by arguments.
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
      T extends retail_ordersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: retail_ordersGroupByArgs['orderBy'] }
        : { orderBy?: retail_ordersGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, retail_ordersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRetail_ordersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the retail_orders model
   */
  readonly fields: retail_ordersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for retail_orders.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__retail_ordersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    book<T extends reatil_book_editionsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, reatil_book_editionsDefaultArgs<ExtArgs>>): Prisma__reatil_book_editionsClient<$Result.GetResult<Prisma.$reatil_book_editionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    customer<T extends retail_orders$customerArgs<ExtArgs> = {}>(args?: Subset<T, retail_orders$customerArgs<ExtArgs>>): Prisma__customersClient<$Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the retail_orders model
   */
  interface retail_ordersFieldRefs {
    readonly id: FieldRef<"retail_orders", 'Int'>
    readonly book_edition_id: FieldRef<"retail_orders", 'Int'>
    readonly total_price: FieldRef<"retail_orders", 'Float'>
    readonly quantity: FieldRef<"retail_orders", 'Int'>
    readonly customerId: FieldRef<"retail_orders", 'Int'>
    readonly phoneNumber: FieldRef<"retail_orders", 'String'>
    readonly created_at: FieldRef<"retail_orders", 'DateTime'>
    readonly updated_at: FieldRef<"retail_orders", 'DateTime'>
    readonly deleted_at: FieldRef<"retail_orders", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * retail_orders findUnique
   */
  export type retail_ordersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_orders
     */
    select?: retail_ordersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_orders
     */
    omit?: retail_ordersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_ordersInclude<ExtArgs> | null
    /**
     * Filter, which retail_orders to fetch.
     */
    where: retail_ordersWhereUniqueInput
  }

  /**
   * retail_orders findUniqueOrThrow
   */
  export type retail_ordersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_orders
     */
    select?: retail_ordersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_orders
     */
    omit?: retail_ordersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_ordersInclude<ExtArgs> | null
    /**
     * Filter, which retail_orders to fetch.
     */
    where: retail_ordersWhereUniqueInput
  }

  /**
   * retail_orders findFirst
   */
  export type retail_ordersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_orders
     */
    select?: retail_ordersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_orders
     */
    omit?: retail_ordersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_ordersInclude<ExtArgs> | null
    /**
     * Filter, which retail_orders to fetch.
     */
    where?: retail_ordersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of retail_orders to fetch.
     */
    orderBy?: retail_ordersOrderByWithRelationInput | retail_ordersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for retail_orders.
     */
    cursor?: retail_ordersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` retail_orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` retail_orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of retail_orders.
     */
    distinct?: Retail_ordersScalarFieldEnum | Retail_ordersScalarFieldEnum[]
  }

  /**
   * retail_orders findFirstOrThrow
   */
  export type retail_ordersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_orders
     */
    select?: retail_ordersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_orders
     */
    omit?: retail_ordersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_ordersInclude<ExtArgs> | null
    /**
     * Filter, which retail_orders to fetch.
     */
    where?: retail_ordersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of retail_orders to fetch.
     */
    orderBy?: retail_ordersOrderByWithRelationInput | retail_ordersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for retail_orders.
     */
    cursor?: retail_ordersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` retail_orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` retail_orders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of retail_orders.
     */
    distinct?: Retail_ordersScalarFieldEnum | Retail_ordersScalarFieldEnum[]
  }

  /**
   * retail_orders findMany
   */
  export type retail_ordersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_orders
     */
    select?: retail_ordersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_orders
     */
    omit?: retail_ordersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_ordersInclude<ExtArgs> | null
    /**
     * Filter, which retail_orders to fetch.
     */
    where?: retail_ordersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of retail_orders to fetch.
     */
    orderBy?: retail_ordersOrderByWithRelationInput | retail_ordersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing retail_orders.
     */
    cursor?: retail_ordersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` retail_orders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` retail_orders.
     */
    skip?: number
    distinct?: Retail_ordersScalarFieldEnum | Retail_ordersScalarFieldEnum[]
  }

  /**
   * retail_orders create
   */
  export type retail_ordersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_orders
     */
    select?: retail_ordersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_orders
     */
    omit?: retail_ordersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_ordersInclude<ExtArgs> | null
    /**
     * The data needed to create a retail_orders.
     */
    data: XOR<retail_ordersCreateInput, retail_ordersUncheckedCreateInput>
  }

  /**
   * retail_orders createMany
   */
  export type retail_ordersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many retail_orders.
     */
    data: retail_ordersCreateManyInput | retail_ordersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * retail_orders update
   */
  export type retail_ordersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_orders
     */
    select?: retail_ordersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_orders
     */
    omit?: retail_ordersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_ordersInclude<ExtArgs> | null
    /**
     * The data needed to update a retail_orders.
     */
    data: XOR<retail_ordersUpdateInput, retail_ordersUncheckedUpdateInput>
    /**
     * Choose, which retail_orders to update.
     */
    where: retail_ordersWhereUniqueInput
  }

  /**
   * retail_orders updateMany
   */
  export type retail_ordersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update retail_orders.
     */
    data: XOR<retail_ordersUpdateManyMutationInput, retail_ordersUncheckedUpdateManyInput>
    /**
     * Filter which retail_orders to update
     */
    where?: retail_ordersWhereInput
    /**
     * Limit how many retail_orders to update.
     */
    limit?: number
  }

  /**
   * retail_orders upsert
   */
  export type retail_ordersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_orders
     */
    select?: retail_ordersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_orders
     */
    omit?: retail_ordersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_ordersInclude<ExtArgs> | null
    /**
     * The filter to search for the retail_orders to update in case it exists.
     */
    where: retail_ordersWhereUniqueInput
    /**
     * In case the retail_orders found by the `where` argument doesn't exist, create a new retail_orders with this data.
     */
    create: XOR<retail_ordersCreateInput, retail_ordersUncheckedCreateInput>
    /**
     * In case the retail_orders was found with the provided `where` argument, update it with this data.
     */
    update: XOR<retail_ordersUpdateInput, retail_ordersUncheckedUpdateInput>
  }

  /**
   * retail_orders delete
   */
  export type retail_ordersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_orders
     */
    select?: retail_ordersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_orders
     */
    omit?: retail_ordersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_ordersInclude<ExtArgs> | null
    /**
     * Filter which retail_orders to delete.
     */
    where: retail_ordersWhereUniqueInput
  }

  /**
   * retail_orders deleteMany
   */
  export type retail_ordersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which retail_orders to delete
     */
    where?: retail_ordersWhereInput
    /**
     * Limit how many retail_orders to delete.
     */
    limit?: number
  }

  /**
   * retail_orders.customer
   */
  export type retail_orders$customerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customers
     */
    select?: customersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customers
     */
    omit?: customersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customersInclude<ExtArgs> | null
    where?: customersWhereInput
  }

  /**
   * retail_orders without action
   */
  export type retail_ordersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_orders
     */
    select?: retail_ordersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_orders
     */
    omit?: retail_ordersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_ordersInclude<ExtArgs> | null
  }


  /**
   * Model users
   */

  export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  export type UsersAvgAggregateOutputType = {
    id: number | null
  }

  export type UsersSumAggregateOutputType = {
    id: number | null
  }

  export type UsersMinAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    password: string | null
    role: string | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
  }

  export type UsersMaxAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    password: string | null
    role: string | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
  }

  export type UsersCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    role: number
    created_at: number
    updated_at: number
    deleted_at: number
    _all: number
  }


  export type UsersAvgAggregateInputType = {
    id?: true
  }

  export type UsersSumAggregateInputType = {
    id?: true
  }

  export type UsersMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
  }

  export type UsersMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
  }

  export type UsersCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
    _all?: true
  }

  export type UsersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to aggregate.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    _count?: true | UsersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersMaxAggregateInputType
  }

  export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
        [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsers[P]>
      : GetScalarType<T[P], AggregateUsers[P]>
  }




  export type usersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: usersWhereInput
    orderBy?: usersOrderByWithAggregationInput | usersOrderByWithAggregationInput[]
    by: UsersScalarFieldEnum[] | UsersScalarFieldEnum
    having?: usersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersCountAggregateInputType | true
    _avg?: UsersAvgAggregateInputType
    _sum?: UsersSumAggregateInputType
    _min?: UsersMinAggregateInputType
    _max?: UsersMaxAggregateInputType
  }

  export type UsersGroupByOutputType = {
    id: number
    name: string | null
    email: string | null
    password: string | null
    role: string | null
    created_at: Date
    updated_at: Date
    deleted_at: Date
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  type GetUsersGroupByPayload<T extends usersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersGroupByOutputType[P]>
            : GetScalarType<T[P], UsersGroupByOutputType[P]>
        }
      >
    >


  export type usersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
  }, ExtArgs["result"]["users"]>



  export type usersSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
  }

  export type usersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "role" | "created_at" | "updated_at" | "deleted_at", ExtArgs["result"]["users"]>

  export type $usersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "users"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string | null
      email: string | null
      password: string | null
      role: string | null
      created_at: Date
      updated_at: Date
      deleted_at: Date
    }, ExtArgs["result"]["users"]>
    composites: {}
  }

  type usersGetPayload<S extends boolean | null | undefined | usersDefaultArgs> = $Result.GetResult<Prisma.$usersPayload, S>

  type usersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<usersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsersCountAggregateInputType | true
    }

  export interface usersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['users'], meta: { name: 'users' } }
    /**
     * Find zero or one Users that matches the filter.
     * @param {usersFindUniqueArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends usersFindUniqueArgs>(args: SelectSubset<T, usersFindUniqueArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Users that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {usersFindUniqueOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends usersFindUniqueOrThrowArgs>(args: SelectSubset<T, usersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends usersFindFirstArgs>(args?: SelectSubset<T, usersFindFirstArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends usersFindFirstOrThrowArgs>(args?: SelectSubset<T, usersFindFirstOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usersWithIdOnly = await prisma.users.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends usersFindManyArgs>(args?: SelectSubset<T, usersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Users.
     * @param {usersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     * 
     */
    create<T extends usersCreateArgs>(args: SelectSubset<T, usersCreateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {usersCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends usersCreateManyArgs>(args?: SelectSubset<T, usersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Users.
     * @param {usersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     * 
     */
    delete<T extends usersDeleteArgs>(args: SelectSubset<T, usersDeleteArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Users.
     * @param {usersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends usersUpdateArgs>(args: SelectSubset<T, usersUpdateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {usersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends usersDeleteManyArgs>(args?: SelectSubset<T, usersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends usersUpdateManyArgs>(args: SelectSubset<T, usersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Users.
     * @param {usersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
     */
    upsert<T extends usersUpsertArgs>(args: SelectSubset<T, usersUpsertArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends usersCountArgs>(
      args?: Subset<T, usersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UsersAggregateArgs>(args: Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>

    /**
     * Group by Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersGroupByArgs} args - Group by arguments.
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
      T extends usersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: usersGroupByArgs['orderBy'] }
        : { orderBy?: usersGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, usersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the users model
   */
  readonly fields: usersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__usersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the users model
   */
  interface usersFieldRefs {
    readonly id: FieldRef<"users", 'Int'>
    readonly name: FieldRef<"users", 'String'>
    readonly email: FieldRef<"users", 'String'>
    readonly password: FieldRef<"users", 'String'>
    readonly role: FieldRef<"users", 'String'>
    readonly created_at: FieldRef<"users", 'DateTime'>
    readonly updated_at: FieldRef<"users", 'DateTime'>
    readonly deleted_at: FieldRef<"users", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * users findUnique
   */
  export type usersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findUniqueOrThrow
   */
  export type usersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findFirst
   */
  export type usersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findFirstOrThrow
   */
  export type usersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findMany
   */
  export type usersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users create
   */
  export type usersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data needed to create a users.
     */
    data?: XOR<usersCreateInput, usersUncheckedCreateInput>
  }

  /**
   * users createMany
   */
  export type usersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * users update
   */
  export type usersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data needed to update a users.
     */
    data: XOR<usersUpdateInput, usersUncheckedUpdateInput>
    /**
     * Choose, which users to update.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users updateMany
   */
  export type usersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * users upsert
   */
  export type usersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The filter to search for the users to update in case it exists.
     */
    where: usersWhereUniqueInput
    /**
     * In case the users found by the `where` argument doesn't exist, create a new users with this data.
     */
    create: XOR<usersCreateInput, usersUncheckedCreateInput>
    /**
     * In case the users was found with the provided `where` argument, update it with this data.
     */
    update: XOR<usersUpdateInput, usersUncheckedUpdateInput>
  }

  /**
   * users delete
   */
  export type usersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter which users to delete.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users deleteMany
   */
  export type usersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: usersWhereInput
    /**
     * Limit how many users to delete.
     */
    limit?: number
  }

  /**
   * users without action
   */
  export type usersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
  }


  /**
   * Model customers
   */

  export type AggregateCustomers = {
    _count: CustomersCountAggregateOutputType | null
    _avg: CustomersAvgAggregateOutputType | null
    _sum: CustomersSumAggregateOutputType | null
    _min: CustomersMinAggregateOutputType | null
    _max: CustomersMaxAggregateOutputType | null
  }

  export type CustomersAvgAggregateOutputType = {
    id: number | null
  }

  export type CustomersSumAggregateOutputType = {
    id: number | null
  }

  export type CustomersMinAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    password: string | null
    phonenumber: string | null
    customerType: string | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
  }

  export type CustomersMaxAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    password: string | null
    phonenumber: string | null
    customerType: string | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
  }

  export type CustomersCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    phonenumber: number
    customerType: number
    created_at: number
    updated_at: number
    deleted_at: number
    _all: number
  }


  export type CustomersAvgAggregateInputType = {
    id?: true
  }

  export type CustomersSumAggregateInputType = {
    id?: true
  }

  export type CustomersMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    phonenumber?: true
    customerType?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
  }

  export type CustomersMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    phonenumber?: true
    customerType?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
  }

  export type CustomersCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    phonenumber?: true
    customerType?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
    _all?: true
  }

  export type CustomersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which customers to aggregate.
     */
    where?: customersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of customers to fetch.
     */
    orderBy?: customersOrderByWithRelationInput | customersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: customersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned customers
    **/
    _count?: true | CustomersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CustomersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CustomersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomersMaxAggregateInputType
  }

  export type GetCustomersAggregateType<T extends CustomersAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomers[P]>
      : GetScalarType<T[P], AggregateCustomers[P]>
  }




  export type customersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: customersWhereInput
    orderBy?: customersOrderByWithAggregationInput | customersOrderByWithAggregationInput[]
    by: CustomersScalarFieldEnum[] | CustomersScalarFieldEnum
    having?: customersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomersCountAggregateInputType | true
    _avg?: CustomersAvgAggregateInputType
    _sum?: CustomersSumAggregateInputType
    _min?: CustomersMinAggregateInputType
    _max?: CustomersMaxAggregateInputType
  }

  export type CustomersGroupByOutputType = {
    id: number
    name: string | null
    email: string | null
    password: string | null
    phonenumber: string | null
    customerType: string | null
    created_at: Date
    updated_at: Date
    deleted_at: Date
    _count: CustomersCountAggregateOutputType | null
    _avg: CustomersAvgAggregateOutputType | null
    _sum: CustomersSumAggregateOutputType | null
    _min: CustomersMinAggregateOutputType | null
    _max: CustomersMaxAggregateOutputType | null
  }

  type GetCustomersGroupByPayload<T extends customersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomersGroupByOutputType[P]>
            : GetScalarType<T[P], CustomersGroupByOutputType[P]>
        }
      >
    >


  export type customersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    phonenumber?: boolean
    customerType?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
    orders?: boolean | customers$ordersArgs<ExtArgs>
    _count?: boolean | CustomersCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customers"]>



  export type customersSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    phonenumber?: boolean
    customerType?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
  }

  export type customersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "phonenumber" | "customerType" | "created_at" | "updated_at" | "deleted_at", ExtArgs["result"]["customers"]>
  export type customersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | customers$ordersArgs<ExtArgs>
    _count?: boolean | CustomersCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $customersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "customers"
    objects: {
      orders: Prisma.$retail_ordersPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string | null
      email: string | null
      password: string | null
      phonenumber: string | null
      customerType: string | null
      created_at: Date
      updated_at: Date
      deleted_at: Date
    }, ExtArgs["result"]["customers"]>
    composites: {}
  }

  type customersGetPayload<S extends boolean | null | undefined | customersDefaultArgs> = $Result.GetResult<Prisma.$customersPayload, S>

  type customersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<customersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CustomersCountAggregateInputType | true
    }

  export interface customersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['customers'], meta: { name: 'customers' } }
    /**
     * Find zero or one Customers that matches the filter.
     * @param {customersFindUniqueArgs} args - Arguments to find a Customers
     * @example
     * // Get one Customers
     * const customers = await prisma.customers.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends customersFindUniqueArgs>(args: SelectSubset<T, customersFindUniqueArgs<ExtArgs>>): Prisma__customersClient<$Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Customers that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {customersFindUniqueOrThrowArgs} args - Arguments to find a Customers
     * @example
     * // Get one Customers
     * const customers = await prisma.customers.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends customersFindUniqueOrThrowArgs>(args: SelectSubset<T, customersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__customersClient<$Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Customers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {customersFindFirstArgs} args - Arguments to find a Customers
     * @example
     * // Get one Customers
     * const customers = await prisma.customers.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends customersFindFirstArgs>(args?: SelectSubset<T, customersFindFirstArgs<ExtArgs>>): Prisma__customersClient<$Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Customers that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {customersFindFirstOrThrowArgs} args - Arguments to find a Customers
     * @example
     * // Get one Customers
     * const customers = await prisma.customers.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends customersFindFirstOrThrowArgs>(args?: SelectSubset<T, customersFindFirstOrThrowArgs<ExtArgs>>): Prisma__customersClient<$Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Customers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {customersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Customers
     * const customers = await prisma.customers.findMany()
     * 
     * // Get first 10 Customers
     * const customers = await prisma.customers.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customersWithIdOnly = await prisma.customers.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends customersFindManyArgs>(args?: SelectSubset<T, customersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Customers.
     * @param {customersCreateArgs} args - Arguments to create a Customers.
     * @example
     * // Create one Customers
     * const Customers = await prisma.customers.create({
     *   data: {
     *     // ... data to create a Customers
     *   }
     * })
     * 
     */
    create<T extends customersCreateArgs>(args: SelectSubset<T, customersCreateArgs<ExtArgs>>): Prisma__customersClient<$Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Customers.
     * @param {customersCreateManyArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customers = await prisma.customers.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends customersCreateManyArgs>(args?: SelectSubset<T, customersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Customers.
     * @param {customersDeleteArgs} args - Arguments to delete one Customers.
     * @example
     * // Delete one Customers
     * const Customers = await prisma.customers.delete({
     *   where: {
     *     // ... filter to delete one Customers
     *   }
     * })
     * 
     */
    delete<T extends customersDeleteArgs>(args: SelectSubset<T, customersDeleteArgs<ExtArgs>>): Prisma__customersClient<$Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Customers.
     * @param {customersUpdateArgs} args - Arguments to update one Customers.
     * @example
     * // Update one Customers
     * const customers = await prisma.customers.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends customersUpdateArgs>(args: SelectSubset<T, customersUpdateArgs<ExtArgs>>): Prisma__customersClient<$Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Customers.
     * @param {customersDeleteManyArgs} args - Arguments to filter Customers to delete.
     * @example
     * // Delete a few Customers
     * const { count } = await prisma.customers.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends customersDeleteManyArgs>(args?: SelectSubset<T, customersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {customersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Customers
     * const customers = await prisma.customers.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends customersUpdateManyArgs>(args: SelectSubset<T, customersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Customers.
     * @param {customersUpsertArgs} args - Arguments to update or create a Customers.
     * @example
     * // Update or create a Customers
     * const customers = await prisma.customers.upsert({
     *   create: {
     *     // ... data to create a Customers
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Customers we want to update
     *   }
     * })
     */
    upsert<T extends customersUpsertArgs>(args: SelectSubset<T, customersUpsertArgs<ExtArgs>>): Prisma__customersClient<$Result.GetResult<Prisma.$customersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {customersCountArgs} args - Arguments to filter Customers to count.
     * @example
     * // Count the number of Customers
     * const count = await prisma.customers.count({
     *   where: {
     *     // ... the filter for the Customers we want to count
     *   }
     * })
    **/
    count<T extends customersCountArgs>(
      args?: Subset<T, customersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CustomersAggregateArgs>(args: Subset<T, CustomersAggregateArgs>): Prisma.PrismaPromise<GetCustomersAggregateType<T>>

    /**
     * Group by Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {customersGroupByArgs} args - Group by arguments.
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
      T extends customersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: customersGroupByArgs['orderBy'] }
        : { orderBy?: customersGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, customersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the customers model
   */
  readonly fields: customersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for customers.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__customersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    orders<T extends customers$ordersArgs<ExtArgs> = {}>(args?: Subset<T, customers$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$retail_ordersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the customers model
   */
  interface customersFieldRefs {
    readonly id: FieldRef<"customers", 'Int'>
    readonly name: FieldRef<"customers", 'String'>
    readonly email: FieldRef<"customers", 'String'>
    readonly password: FieldRef<"customers", 'String'>
    readonly phonenumber: FieldRef<"customers", 'String'>
    readonly customerType: FieldRef<"customers", 'String'>
    readonly created_at: FieldRef<"customers", 'DateTime'>
    readonly updated_at: FieldRef<"customers", 'DateTime'>
    readonly deleted_at: FieldRef<"customers", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * customers findUnique
   */
  export type customersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customers
     */
    select?: customersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customers
     */
    omit?: customersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customersInclude<ExtArgs> | null
    /**
     * Filter, which customers to fetch.
     */
    where: customersWhereUniqueInput
  }

  /**
   * customers findUniqueOrThrow
   */
  export type customersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customers
     */
    select?: customersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customers
     */
    omit?: customersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customersInclude<ExtArgs> | null
    /**
     * Filter, which customers to fetch.
     */
    where: customersWhereUniqueInput
  }

  /**
   * customers findFirst
   */
  export type customersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customers
     */
    select?: customersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customers
     */
    omit?: customersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customersInclude<ExtArgs> | null
    /**
     * Filter, which customers to fetch.
     */
    where?: customersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of customers to fetch.
     */
    orderBy?: customersOrderByWithRelationInput | customersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for customers.
     */
    cursor?: customersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of customers.
     */
    distinct?: CustomersScalarFieldEnum | CustomersScalarFieldEnum[]
  }

  /**
   * customers findFirstOrThrow
   */
  export type customersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customers
     */
    select?: customersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customers
     */
    omit?: customersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customersInclude<ExtArgs> | null
    /**
     * Filter, which customers to fetch.
     */
    where?: customersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of customers to fetch.
     */
    orderBy?: customersOrderByWithRelationInput | customersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for customers.
     */
    cursor?: customersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of customers.
     */
    distinct?: CustomersScalarFieldEnum | CustomersScalarFieldEnum[]
  }

  /**
   * customers findMany
   */
  export type customersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customers
     */
    select?: customersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customers
     */
    omit?: customersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customersInclude<ExtArgs> | null
    /**
     * Filter, which customers to fetch.
     */
    where?: customersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of customers to fetch.
     */
    orderBy?: customersOrderByWithRelationInput | customersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing customers.
     */
    cursor?: customersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` customers.
     */
    skip?: number
    distinct?: CustomersScalarFieldEnum | CustomersScalarFieldEnum[]
  }

  /**
   * customers create
   */
  export type customersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customers
     */
    select?: customersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customers
     */
    omit?: customersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customersInclude<ExtArgs> | null
    /**
     * The data needed to create a customers.
     */
    data?: XOR<customersCreateInput, customersUncheckedCreateInput>
  }

  /**
   * customers createMany
   */
  export type customersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many customers.
     */
    data: customersCreateManyInput | customersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * customers update
   */
  export type customersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customers
     */
    select?: customersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customers
     */
    omit?: customersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customersInclude<ExtArgs> | null
    /**
     * The data needed to update a customers.
     */
    data: XOR<customersUpdateInput, customersUncheckedUpdateInput>
    /**
     * Choose, which customers to update.
     */
    where: customersWhereUniqueInput
  }

  /**
   * customers updateMany
   */
  export type customersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update customers.
     */
    data: XOR<customersUpdateManyMutationInput, customersUncheckedUpdateManyInput>
    /**
     * Filter which customers to update
     */
    where?: customersWhereInput
    /**
     * Limit how many customers to update.
     */
    limit?: number
  }

  /**
   * customers upsert
   */
  export type customersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customers
     */
    select?: customersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customers
     */
    omit?: customersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customersInclude<ExtArgs> | null
    /**
     * The filter to search for the customers to update in case it exists.
     */
    where: customersWhereUniqueInput
    /**
     * In case the customers found by the `where` argument doesn't exist, create a new customers with this data.
     */
    create: XOR<customersCreateInput, customersUncheckedCreateInput>
    /**
     * In case the customers was found with the provided `where` argument, update it with this data.
     */
    update: XOR<customersUpdateInput, customersUncheckedUpdateInput>
  }

  /**
   * customers delete
   */
  export type customersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customers
     */
    select?: customersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customers
     */
    omit?: customersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customersInclude<ExtArgs> | null
    /**
     * Filter which customers to delete.
     */
    where: customersWhereUniqueInput
  }

  /**
   * customers deleteMany
   */
  export type customersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which customers to delete
     */
    where?: customersWhereInput
    /**
     * Limit how many customers to delete.
     */
    limit?: number
  }

  /**
   * customers.orders
   */
  export type customers$ordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the retail_orders
     */
    select?: retail_ordersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the retail_orders
     */
    omit?: retail_ordersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: retail_ordersInclude<ExtArgs> | null
    where?: retail_ordersWhereInput
    orderBy?: retail_ordersOrderByWithRelationInput | retail_ordersOrderByWithRelationInput[]
    cursor?: retail_ordersWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Retail_ordersScalarFieldEnum | Retail_ordersScalarFieldEnum[]
  }

  /**
   * customers without action
   */
  export type customersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the customers
     */
    select?: customersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the customers
     */
    omit?: customersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: customersInclude<ExtArgs> | null
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


  export const Retail_booksScalarFieldEnum: {
    id: 'id',
    book_id: 'book_id',
    title: 'title',
    author: 'author',
    language: 'language',
    category: 'category',
    publication_year: 'publication_year',
    copyright_registration_number: 'copyright_registration_number',
    book_image_url: 'book_image_url',
    status: 'status',
    is_deleted: 'is_deleted',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt',
    pen_name: 'pen_name',
    translator_cost: 'translator_cost',
    cover_design_cost: 'cover_design_cost',
    text_design_cost: 'text_design_cost',
    editor_cost: 'editor_cost',
    typewriting_cost: 'typewriting_cost',
    store_cost: 'store_cost',
    distribution_cost: 'distribution_cost',
    advertisement_cost: 'advertisement_cost',
    purchasing_right_cost: 'purchasing_right_cost',
    ourbook: 'ourbook',
    created_at: 'created_at',
    updated_at: 'updated_at',
    deleted_at: 'deleted_at'
  };

  export type Retail_booksScalarFieldEnum = (typeof Retail_booksScalarFieldEnum)[keyof typeof Retail_booksScalarFieldEnum]


  export const Reatil_book_editionsScalarFieldEnum: {
    id: 'id',
    edition_name: 'edition_name',
    book_id: 'book_id',
    price: 'price',
    created_at: 'created_at',
    updated_at: 'updated_at',
    deleted_at: 'deleted_at'
  };

  export type Reatil_book_editionsScalarFieldEnum = (typeof Reatil_book_editionsScalarFieldEnum)[keyof typeof Reatil_book_editionsScalarFieldEnum]


  export const Retail_ordersScalarFieldEnum: {
    id: 'id',
    book_edition_id: 'book_edition_id',
    total_price: 'total_price',
    quantity: 'quantity',
    customerId: 'customerId',
    phoneNumber: 'phoneNumber',
    created_at: 'created_at',
    updated_at: 'updated_at',
    deleted_at: 'deleted_at'
  };

  export type Retail_ordersScalarFieldEnum = (typeof Retail_ordersScalarFieldEnum)[keyof typeof Retail_ordersScalarFieldEnum]


  export const UsersScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    created_at: 'created_at',
    updated_at: 'updated_at',
    deleted_at: 'deleted_at'
  };

  export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum]


  export const CustomersScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    phonenumber: 'phonenumber',
    customerType: 'customerType',
    created_at: 'created_at',
    updated_at: 'updated_at',
    deleted_at: 'deleted_at'
  };

  export type CustomersScalarFieldEnum = (typeof CustomersScalarFieldEnum)[keyof typeof CustomersScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const retail_booksOrderByRelevanceFieldEnum: {
    title: 'title',
    author: 'author',
    language: 'language',
    category: 'category',
    publication_year: 'publication_year',
    copyright_registration_number: 'copyright_registration_number',
    book_image_url: 'book_image_url',
    status: 'status',
    pen_name: 'pen_name'
  };

  export type retail_booksOrderByRelevanceFieldEnum = (typeof retail_booksOrderByRelevanceFieldEnum)[keyof typeof retail_booksOrderByRelevanceFieldEnum]


  export const reatil_book_editionsOrderByRelevanceFieldEnum: {
    edition_name: 'edition_name'
  };

  export type reatil_book_editionsOrderByRelevanceFieldEnum = (typeof reatil_book_editionsOrderByRelevanceFieldEnum)[keyof typeof reatil_book_editionsOrderByRelevanceFieldEnum]


  export const retail_ordersOrderByRelevanceFieldEnum: {
    phoneNumber: 'phoneNumber'
  };

  export type retail_ordersOrderByRelevanceFieldEnum = (typeof retail_ordersOrderByRelevanceFieldEnum)[keyof typeof retail_ordersOrderByRelevanceFieldEnum]


  export const usersOrderByRelevanceFieldEnum: {
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role'
  };

  export type usersOrderByRelevanceFieldEnum = (typeof usersOrderByRelevanceFieldEnum)[keyof typeof usersOrderByRelevanceFieldEnum]


  export const customersOrderByRelevanceFieldEnum: {
    name: 'name',
    email: 'email',
    password: 'password',
    phonenumber: 'phonenumber',
    customerType: 'customerType'
  };

  export type customersOrderByRelevanceFieldEnum = (typeof customersOrderByRelevanceFieldEnum)[keyof typeof customersOrderByRelevanceFieldEnum]


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
   * Deep Input Types
   */


  export type retail_booksWhereInput = {
    AND?: retail_booksWhereInput | retail_booksWhereInput[]
    OR?: retail_booksWhereInput[]
    NOT?: retail_booksWhereInput | retail_booksWhereInput[]
    id?: IntFilter<"retail_books"> | number
    book_id?: IntNullableFilter<"retail_books"> | number | null
    title?: StringFilter<"retail_books"> | string
    author?: StringFilter<"retail_books"> | string
    language?: StringFilter<"retail_books"> | string
    category?: StringFilter<"retail_books"> | string
    publication_year?: StringNullableFilter<"retail_books"> | string | null
    copyright_registration_number?: StringNullableFilter<"retail_books"> | string | null
    book_image_url?: StringNullableFilter<"retail_books"> | string | null
    status?: StringFilter<"retail_books"> | string
    is_deleted?: BoolFilter<"retail_books"> | boolean
    updatedAt?: DateTimeFilter<"retail_books"> | Date | string
    createdAt?: DateTimeFilter<"retail_books"> | Date | string
    deletedAt?: DateTimeFilter<"retail_books"> | Date | string
    pen_name?: StringNullableFilter<"retail_books"> | string | null
    translator_cost?: FloatNullableFilter<"retail_books"> | number | null
    cover_design_cost?: FloatNullableFilter<"retail_books"> | number | null
    text_design_cost?: FloatNullableFilter<"retail_books"> | number | null
    editor_cost?: FloatNullableFilter<"retail_books"> | number | null
    typewriting_cost?: FloatNullableFilter<"retail_books"> | number | null
    store_cost?: FloatNullableFilter<"retail_books"> | number | null
    distribution_cost?: FloatNullableFilter<"retail_books"> | number | null
    advertisement_cost?: FloatNullableFilter<"retail_books"> | number | null
    purchasing_right_cost?: FloatNullableFilter<"retail_books"> | number | null
    ourbook?: BoolFilter<"retail_books"> | boolean
    created_at?: DateTimeFilter<"retail_books"> | Date | string
    updated_at?: DateTimeFilter<"retail_books"> | Date | string
    deleted_at?: DateTimeFilter<"retail_books"> | Date | string
    bookEditions?: Reatil_book_editionsListRelationFilter
  }

  export type retail_booksOrderByWithRelationInput = {
    id?: SortOrder
    book_id?: SortOrderInput | SortOrder
    title?: SortOrder
    author?: SortOrder
    language?: SortOrder
    category?: SortOrder
    publication_year?: SortOrderInput | SortOrder
    copyright_registration_number?: SortOrderInput | SortOrder
    book_image_url?: SortOrderInput | SortOrder
    status?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    pen_name?: SortOrderInput | SortOrder
    translator_cost?: SortOrderInput | SortOrder
    cover_design_cost?: SortOrderInput | SortOrder
    text_design_cost?: SortOrderInput | SortOrder
    editor_cost?: SortOrderInput | SortOrder
    typewriting_cost?: SortOrderInput | SortOrder
    store_cost?: SortOrderInput | SortOrder
    distribution_cost?: SortOrderInput | SortOrder
    advertisement_cost?: SortOrderInput | SortOrder
    purchasing_right_cost?: SortOrderInput | SortOrder
    ourbook?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
    bookEditions?: reatil_book_editionsOrderByRelationAggregateInput
    _relevance?: retail_booksOrderByRelevanceInput
  }

  export type retail_booksWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: retail_booksWhereInput | retail_booksWhereInput[]
    OR?: retail_booksWhereInput[]
    NOT?: retail_booksWhereInput | retail_booksWhereInput[]
    book_id?: IntNullableFilter<"retail_books"> | number | null
    title?: StringFilter<"retail_books"> | string
    author?: StringFilter<"retail_books"> | string
    language?: StringFilter<"retail_books"> | string
    category?: StringFilter<"retail_books"> | string
    publication_year?: StringNullableFilter<"retail_books"> | string | null
    copyright_registration_number?: StringNullableFilter<"retail_books"> | string | null
    book_image_url?: StringNullableFilter<"retail_books"> | string | null
    status?: StringFilter<"retail_books"> | string
    is_deleted?: BoolFilter<"retail_books"> | boolean
    updatedAt?: DateTimeFilter<"retail_books"> | Date | string
    createdAt?: DateTimeFilter<"retail_books"> | Date | string
    deletedAt?: DateTimeFilter<"retail_books"> | Date | string
    pen_name?: StringNullableFilter<"retail_books"> | string | null
    translator_cost?: FloatNullableFilter<"retail_books"> | number | null
    cover_design_cost?: FloatNullableFilter<"retail_books"> | number | null
    text_design_cost?: FloatNullableFilter<"retail_books"> | number | null
    editor_cost?: FloatNullableFilter<"retail_books"> | number | null
    typewriting_cost?: FloatNullableFilter<"retail_books"> | number | null
    store_cost?: FloatNullableFilter<"retail_books"> | number | null
    distribution_cost?: FloatNullableFilter<"retail_books"> | number | null
    advertisement_cost?: FloatNullableFilter<"retail_books"> | number | null
    purchasing_right_cost?: FloatNullableFilter<"retail_books"> | number | null
    ourbook?: BoolFilter<"retail_books"> | boolean
    created_at?: DateTimeFilter<"retail_books"> | Date | string
    updated_at?: DateTimeFilter<"retail_books"> | Date | string
    deleted_at?: DateTimeFilter<"retail_books"> | Date | string
    bookEditions?: Reatil_book_editionsListRelationFilter
  }, "id">

  export type retail_booksOrderByWithAggregationInput = {
    id?: SortOrder
    book_id?: SortOrderInput | SortOrder
    title?: SortOrder
    author?: SortOrder
    language?: SortOrder
    category?: SortOrder
    publication_year?: SortOrderInput | SortOrder
    copyright_registration_number?: SortOrderInput | SortOrder
    book_image_url?: SortOrderInput | SortOrder
    status?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    pen_name?: SortOrderInput | SortOrder
    translator_cost?: SortOrderInput | SortOrder
    cover_design_cost?: SortOrderInput | SortOrder
    text_design_cost?: SortOrderInput | SortOrder
    editor_cost?: SortOrderInput | SortOrder
    typewriting_cost?: SortOrderInput | SortOrder
    store_cost?: SortOrderInput | SortOrder
    distribution_cost?: SortOrderInput | SortOrder
    advertisement_cost?: SortOrderInput | SortOrder
    purchasing_right_cost?: SortOrderInput | SortOrder
    ourbook?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
    _count?: retail_booksCountOrderByAggregateInput
    _avg?: retail_booksAvgOrderByAggregateInput
    _max?: retail_booksMaxOrderByAggregateInput
    _min?: retail_booksMinOrderByAggregateInput
    _sum?: retail_booksSumOrderByAggregateInput
  }

  export type retail_booksScalarWhereWithAggregatesInput = {
    AND?: retail_booksScalarWhereWithAggregatesInput | retail_booksScalarWhereWithAggregatesInput[]
    OR?: retail_booksScalarWhereWithAggregatesInput[]
    NOT?: retail_booksScalarWhereWithAggregatesInput | retail_booksScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"retail_books"> | number
    book_id?: IntNullableWithAggregatesFilter<"retail_books"> | number | null
    title?: StringWithAggregatesFilter<"retail_books"> | string
    author?: StringWithAggregatesFilter<"retail_books"> | string
    language?: StringWithAggregatesFilter<"retail_books"> | string
    category?: StringWithAggregatesFilter<"retail_books"> | string
    publication_year?: StringNullableWithAggregatesFilter<"retail_books"> | string | null
    copyright_registration_number?: StringNullableWithAggregatesFilter<"retail_books"> | string | null
    book_image_url?: StringNullableWithAggregatesFilter<"retail_books"> | string | null
    status?: StringWithAggregatesFilter<"retail_books"> | string
    is_deleted?: BoolWithAggregatesFilter<"retail_books"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"retail_books"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"retail_books"> | Date | string
    deletedAt?: DateTimeWithAggregatesFilter<"retail_books"> | Date | string
    pen_name?: StringNullableWithAggregatesFilter<"retail_books"> | string | null
    translator_cost?: FloatNullableWithAggregatesFilter<"retail_books"> | number | null
    cover_design_cost?: FloatNullableWithAggregatesFilter<"retail_books"> | number | null
    text_design_cost?: FloatNullableWithAggregatesFilter<"retail_books"> | number | null
    editor_cost?: FloatNullableWithAggregatesFilter<"retail_books"> | number | null
    typewriting_cost?: FloatNullableWithAggregatesFilter<"retail_books"> | number | null
    store_cost?: FloatNullableWithAggregatesFilter<"retail_books"> | number | null
    distribution_cost?: FloatNullableWithAggregatesFilter<"retail_books"> | number | null
    advertisement_cost?: FloatNullableWithAggregatesFilter<"retail_books"> | number | null
    purchasing_right_cost?: FloatNullableWithAggregatesFilter<"retail_books"> | number | null
    ourbook?: BoolWithAggregatesFilter<"retail_books"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"retail_books"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"retail_books"> | Date | string
    deleted_at?: DateTimeWithAggregatesFilter<"retail_books"> | Date | string
  }

  export type reatil_book_editionsWhereInput = {
    AND?: reatil_book_editionsWhereInput | reatil_book_editionsWhereInput[]
    OR?: reatil_book_editionsWhereInput[]
    NOT?: reatil_book_editionsWhereInput | reatil_book_editionsWhereInput[]
    id?: IntFilter<"reatil_book_editions"> | number
    edition_name?: StringFilter<"reatil_book_editions"> | string
    book_id?: IntNullableFilter<"reatil_book_editions"> | number | null
    price?: FloatNullableFilter<"reatil_book_editions"> | number | null
    created_at?: DateTimeFilter<"reatil_book_editions"> | Date | string
    updated_at?: DateTimeFilter<"reatil_book_editions"> | Date | string
    deleted_at?: DateTimeFilter<"reatil_book_editions"> | Date | string
    books?: XOR<Retail_booksNullableScalarRelationFilter, retail_booksWhereInput> | null
    orders?: Retail_ordersListRelationFilter
  }

  export type reatil_book_editionsOrderByWithRelationInput = {
    id?: SortOrder
    edition_name?: SortOrder
    book_id?: SortOrderInput | SortOrder
    price?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
    books?: retail_booksOrderByWithRelationInput
    orders?: retail_ordersOrderByRelationAggregateInput
    _relevance?: reatil_book_editionsOrderByRelevanceInput
  }

  export type reatil_book_editionsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: reatil_book_editionsWhereInput | reatil_book_editionsWhereInput[]
    OR?: reatil_book_editionsWhereInput[]
    NOT?: reatil_book_editionsWhereInput | reatil_book_editionsWhereInput[]
    edition_name?: StringFilter<"reatil_book_editions"> | string
    book_id?: IntNullableFilter<"reatil_book_editions"> | number | null
    price?: FloatNullableFilter<"reatil_book_editions"> | number | null
    created_at?: DateTimeFilter<"reatil_book_editions"> | Date | string
    updated_at?: DateTimeFilter<"reatil_book_editions"> | Date | string
    deleted_at?: DateTimeFilter<"reatil_book_editions"> | Date | string
    books?: XOR<Retail_booksNullableScalarRelationFilter, retail_booksWhereInput> | null
    orders?: Retail_ordersListRelationFilter
  }, "id">

  export type reatil_book_editionsOrderByWithAggregationInput = {
    id?: SortOrder
    edition_name?: SortOrder
    book_id?: SortOrderInput | SortOrder
    price?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
    _count?: reatil_book_editionsCountOrderByAggregateInput
    _avg?: reatil_book_editionsAvgOrderByAggregateInput
    _max?: reatil_book_editionsMaxOrderByAggregateInput
    _min?: reatil_book_editionsMinOrderByAggregateInput
    _sum?: reatil_book_editionsSumOrderByAggregateInput
  }

  export type reatil_book_editionsScalarWhereWithAggregatesInput = {
    AND?: reatil_book_editionsScalarWhereWithAggregatesInput | reatil_book_editionsScalarWhereWithAggregatesInput[]
    OR?: reatil_book_editionsScalarWhereWithAggregatesInput[]
    NOT?: reatil_book_editionsScalarWhereWithAggregatesInput | reatil_book_editionsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"reatil_book_editions"> | number
    edition_name?: StringWithAggregatesFilter<"reatil_book_editions"> | string
    book_id?: IntNullableWithAggregatesFilter<"reatil_book_editions"> | number | null
    price?: FloatNullableWithAggregatesFilter<"reatil_book_editions"> | number | null
    created_at?: DateTimeWithAggregatesFilter<"reatil_book_editions"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"reatil_book_editions"> | Date | string
    deleted_at?: DateTimeWithAggregatesFilter<"reatil_book_editions"> | Date | string
  }

  export type retail_ordersWhereInput = {
    AND?: retail_ordersWhereInput | retail_ordersWhereInput[]
    OR?: retail_ordersWhereInput[]
    NOT?: retail_ordersWhereInput | retail_ordersWhereInput[]
    id?: IntFilter<"retail_orders"> | number
    book_edition_id?: IntFilter<"retail_orders"> | number
    total_price?: FloatNullableFilter<"retail_orders"> | number | null
    quantity?: IntNullableFilter<"retail_orders"> | number | null
    customerId?: IntNullableFilter<"retail_orders"> | number | null
    phoneNumber?: StringNullableFilter<"retail_orders"> | string | null
    created_at?: DateTimeFilter<"retail_orders"> | Date | string
    updated_at?: DateTimeFilter<"retail_orders"> | Date | string
    deleted_at?: DateTimeFilter<"retail_orders"> | Date | string
    book?: XOR<Reatil_book_editionsScalarRelationFilter, reatil_book_editionsWhereInput>
    customer?: XOR<CustomersNullableScalarRelationFilter, customersWhereInput> | null
  }

  export type retail_ordersOrderByWithRelationInput = {
    id?: SortOrder
    book_edition_id?: SortOrder
    total_price?: SortOrderInput | SortOrder
    quantity?: SortOrderInput | SortOrder
    customerId?: SortOrderInput | SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
    book?: reatil_book_editionsOrderByWithRelationInput
    customer?: customersOrderByWithRelationInput
    _relevance?: retail_ordersOrderByRelevanceInput
  }

  export type retail_ordersWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: retail_ordersWhereInput | retail_ordersWhereInput[]
    OR?: retail_ordersWhereInput[]
    NOT?: retail_ordersWhereInput | retail_ordersWhereInput[]
    book_edition_id?: IntFilter<"retail_orders"> | number
    total_price?: FloatNullableFilter<"retail_orders"> | number | null
    quantity?: IntNullableFilter<"retail_orders"> | number | null
    customerId?: IntNullableFilter<"retail_orders"> | number | null
    phoneNumber?: StringNullableFilter<"retail_orders"> | string | null
    created_at?: DateTimeFilter<"retail_orders"> | Date | string
    updated_at?: DateTimeFilter<"retail_orders"> | Date | string
    deleted_at?: DateTimeFilter<"retail_orders"> | Date | string
    book?: XOR<Reatil_book_editionsScalarRelationFilter, reatil_book_editionsWhereInput>
    customer?: XOR<CustomersNullableScalarRelationFilter, customersWhereInput> | null
  }, "id">

  export type retail_ordersOrderByWithAggregationInput = {
    id?: SortOrder
    book_edition_id?: SortOrder
    total_price?: SortOrderInput | SortOrder
    quantity?: SortOrderInput | SortOrder
    customerId?: SortOrderInput | SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
    _count?: retail_ordersCountOrderByAggregateInput
    _avg?: retail_ordersAvgOrderByAggregateInput
    _max?: retail_ordersMaxOrderByAggregateInput
    _min?: retail_ordersMinOrderByAggregateInput
    _sum?: retail_ordersSumOrderByAggregateInput
  }

  export type retail_ordersScalarWhereWithAggregatesInput = {
    AND?: retail_ordersScalarWhereWithAggregatesInput | retail_ordersScalarWhereWithAggregatesInput[]
    OR?: retail_ordersScalarWhereWithAggregatesInput[]
    NOT?: retail_ordersScalarWhereWithAggregatesInput | retail_ordersScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"retail_orders"> | number
    book_edition_id?: IntWithAggregatesFilter<"retail_orders"> | number
    total_price?: FloatNullableWithAggregatesFilter<"retail_orders"> | number | null
    quantity?: IntNullableWithAggregatesFilter<"retail_orders"> | number | null
    customerId?: IntNullableWithAggregatesFilter<"retail_orders"> | number | null
    phoneNumber?: StringNullableWithAggregatesFilter<"retail_orders"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"retail_orders"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"retail_orders"> | Date | string
    deleted_at?: DateTimeWithAggregatesFilter<"retail_orders"> | Date | string
  }

  export type usersWhereInput = {
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    id?: IntFilter<"users"> | number
    name?: StringNullableFilter<"users"> | string | null
    email?: StringNullableFilter<"users"> | string | null
    password?: StringNullableFilter<"users"> | string | null
    role?: StringNullableFilter<"users"> | string | null
    created_at?: DateTimeFilter<"users"> | Date | string
    updated_at?: DateTimeFilter<"users"> | Date | string
    deleted_at?: DateTimeFilter<"users"> | Date | string
  }

  export type usersOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
    _relevance?: usersOrderByRelevanceInput
  }

  export type usersWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    name?: StringNullableFilter<"users"> | string | null
    email?: StringNullableFilter<"users"> | string | null
    password?: StringNullableFilter<"users"> | string | null
    role?: StringNullableFilter<"users"> | string | null
    created_at?: DateTimeFilter<"users"> | Date | string
    updated_at?: DateTimeFilter<"users"> | Date | string
    deleted_at?: DateTimeFilter<"users"> | Date | string
  }, "id">

  export type usersOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
    _count?: usersCountOrderByAggregateInput
    _avg?: usersAvgOrderByAggregateInput
    _max?: usersMaxOrderByAggregateInput
    _min?: usersMinOrderByAggregateInput
    _sum?: usersSumOrderByAggregateInput
  }

  export type usersScalarWhereWithAggregatesInput = {
    AND?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    OR?: usersScalarWhereWithAggregatesInput[]
    NOT?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"users"> | number
    name?: StringNullableWithAggregatesFilter<"users"> | string | null
    email?: StringNullableWithAggregatesFilter<"users"> | string | null
    password?: StringNullableWithAggregatesFilter<"users"> | string | null
    role?: StringNullableWithAggregatesFilter<"users"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"users"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"users"> | Date | string
    deleted_at?: DateTimeWithAggregatesFilter<"users"> | Date | string
  }

  export type customersWhereInput = {
    AND?: customersWhereInput | customersWhereInput[]
    OR?: customersWhereInput[]
    NOT?: customersWhereInput | customersWhereInput[]
    id?: IntFilter<"customers"> | number
    name?: StringNullableFilter<"customers"> | string | null
    email?: StringNullableFilter<"customers"> | string | null
    password?: StringNullableFilter<"customers"> | string | null
    phonenumber?: StringNullableFilter<"customers"> | string | null
    customerType?: StringNullableFilter<"customers"> | string | null
    created_at?: DateTimeFilter<"customers"> | Date | string
    updated_at?: DateTimeFilter<"customers"> | Date | string
    deleted_at?: DateTimeFilter<"customers"> | Date | string
    orders?: Retail_ordersListRelationFilter
  }

  export type customersOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    phonenumber?: SortOrderInput | SortOrder
    customerType?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
    orders?: retail_ordersOrderByRelationAggregateInput
    _relevance?: customersOrderByRelevanceInput
  }

  export type customersWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: customersWhereInput | customersWhereInput[]
    OR?: customersWhereInput[]
    NOT?: customersWhereInput | customersWhereInput[]
    name?: StringNullableFilter<"customers"> | string | null
    email?: StringNullableFilter<"customers"> | string | null
    password?: StringNullableFilter<"customers"> | string | null
    phonenumber?: StringNullableFilter<"customers"> | string | null
    customerType?: StringNullableFilter<"customers"> | string | null
    created_at?: DateTimeFilter<"customers"> | Date | string
    updated_at?: DateTimeFilter<"customers"> | Date | string
    deleted_at?: DateTimeFilter<"customers"> | Date | string
    orders?: Retail_ordersListRelationFilter
  }, "id">

  export type customersOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    phonenumber?: SortOrderInput | SortOrder
    customerType?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
    _count?: customersCountOrderByAggregateInput
    _avg?: customersAvgOrderByAggregateInput
    _max?: customersMaxOrderByAggregateInput
    _min?: customersMinOrderByAggregateInput
    _sum?: customersSumOrderByAggregateInput
  }

  export type customersScalarWhereWithAggregatesInput = {
    AND?: customersScalarWhereWithAggregatesInput | customersScalarWhereWithAggregatesInput[]
    OR?: customersScalarWhereWithAggregatesInput[]
    NOT?: customersScalarWhereWithAggregatesInput | customersScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"customers"> | number
    name?: StringNullableWithAggregatesFilter<"customers"> | string | null
    email?: StringNullableWithAggregatesFilter<"customers"> | string | null
    password?: StringNullableWithAggregatesFilter<"customers"> | string | null
    phonenumber?: StringNullableWithAggregatesFilter<"customers"> | string | null
    customerType?: StringNullableWithAggregatesFilter<"customers"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"customers"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"customers"> | Date | string
    deleted_at?: DateTimeWithAggregatesFilter<"customers"> | Date | string
  }

  export type retail_booksCreateInput = {
    book_id?: number | null
    title: string
    author: string
    language: string
    category: string
    publication_year?: string | null
    copyright_registration_number?: string | null
    book_image_url?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    pen_name?: string | null
    translator_cost?: number | null
    cover_design_cost?: number | null
    text_design_cost?: number | null
    editor_cost?: number | null
    typewriting_cost?: number | null
    store_cost?: number | null
    distribution_cost?: number | null
    advertisement_cost?: number | null
    purchasing_right_cost?: number | null
    ourbook?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
    bookEditions?: reatil_book_editionsCreateNestedManyWithoutBooksInput
  }

  export type retail_booksUncheckedCreateInput = {
    id?: number
    book_id?: number | null
    title: string
    author: string
    language: string
    category: string
    publication_year?: string | null
    copyright_registration_number?: string | null
    book_image_url?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    pen_name?: string | null
    translator_cost?: number | null
    cover_design_cost?: number | null
    text_design_cost?: number | null
    editor_cost?: number | null
    typewriting_cost?: number | null
    store_cost?: number | null
    distribution_cost?: number | null
    advertisement_cost?: number | null
    purchasing_right_cost?: number | null
    ourbook?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
    bookEditions?: reatil_book_editionsUncheckedCreateNestedManyWithoutBooksInput
  }

  export type retail_booksUpdateInput = {
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    publication_year?: NullableStringFieldUpdateOperationsInput | string | null
    copyright_registration_number?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pen_name?: NullableStringFieldUpdateOperationsInput | string | null
    translator_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    cover_design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    text_design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    editor_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    typewriting_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    store_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    distribution_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    advertisement_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    purchasing_right_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    ourbook?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bookEditions?: reatil_book_editionsUpdateManyWithoutBooksNestedInput
  }

  export type retail_booksUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    publication_year?: NullableStringFieldUpdateOperationsInput | string | null
    copyright_registration_number?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pen_name?: NullableStringFieldUpdateOperationsInput | string | null
    translator_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    cover_design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    text_design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    editor_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    typewriting_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    store_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    distribution_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    advertisement_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    purchasing_right_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    ourbook?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bookEditions?: reatil_book_editionsUncheckedUpdateManyWithoutBooksNestedInput
  }

  export type retail_booksCreateManyInput = {
    id?: number
    book_id?: number | null
    title: string
    author: string
    language: string
    category: string
    publication_year?: string | null
    copyright_registration_number?: string | null
    book_image_url?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    pen_name?: string | null
    translator_cost?: number | null
    cover_design_cost?: number | null
    text_design_cost?: number | null
    editor_cost?: number | null
    typewriting_cost?: number | null
    store_cost?: number | null
    distribution_cost?: number | null
    advertisement_cost?: number | null
    purchasing_right_cost?: number | null
    ourbook?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
  }

  export type retail_booksUpdateManyMutationInput = {
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    publication_year?: NullableStringFieldUpdateOperationsInput | string | null
    copyright_registration_number?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pen_name?: NullableStringFieldUpdateOperationsInput | string | null
    translator_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    cover_design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    text_design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    editor_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    typewriting_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    store_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    distribution_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    advertisement_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    purchasing_right_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    ourbook?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type retail_booksUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    publication_year?: NullableStringFieldUpdateOperationsInput | string | null
    copyright_registration_number?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pen_name?: NullableStringFieldUpdateOperationsInput | string | null
    translator_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    cover_design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    text_design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    editor_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    typewriting_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    store_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    distribution_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    advertisement_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    purchasing_right_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    ourbook?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type reatil_book_editionsCreateInput = {
    edition_name: string
    price?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
    books?: retail_booksCreateNestedOneWithoutBookEditionsInput
    orders?: retail_ordersCreateNestedManyWithoutBookInput
  }

  export type reatil_book_editionsUncheckedCreateInput = {
    id?: number
    edition_name: string
    book_id?: number | null
    price?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
    orders?: retail_ordersUncheckedCreateNestedManyWithoutBookInput
  }

  export type reatil_book_editionsUpdateInput = {
    edition_name?: StringFieldUpdateOperationsInput | string
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    books?: retail_booksUpdateOneWithoutBookEditionsNestedInput
    orders?: retail_ordersUpdateManyWithoutBookNestedInput
  }

  export type reatil_book_editionsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    edition_name?: StringFieldUpdateOperationsInput | string
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: retail_ordersUncheckedUpdateManyWithoutBookNestedInput
  }

  export type reatil_book_editionsCreateManyInput = {
    id?: number
    edition_name: string
    book_id?: number | null
    price?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
  }

  export type reatil_book_editionsUpdateManyMutationInput = {
    edition_name?: StringFieldUpdateOperationsInput | string
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type reatil_book_editionsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    edition_name?: StringFieldUpdateOperationsInput | string
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type retail_ordersCreateInput = {
    total_price?: number | null
    quantity?: number | null
    phoneNumber?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
    book: reatil_book_editionsCreateNestedOneWithoutOrdersInput
    customer?: customersCreateNestedOneWithoutOrdersInput
  }

  export type retail_ordersUncheckedCreateInput = {
    id?: number
    book_edition_id: number
    total_price?: number | null
    quantity?: number | null
    customerId?: number | null
    phoneNumber?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
  }

  export type retail_ordersUpdateInput = {
    total_price?: NullableFloatFieldUpdateOperationsInput | number | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    book?: reatil_book_editionsUpdateOneRequiredWithoutOrdersNestedInput
    customer?: customersUpdateOneWithoutOrdersNestedInput
  }

  export type retail_ordersUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    book_edition_id?: IntFieldUpdateOperationsInput | number
    total_price?: NullableFloatFieldUpdateOperationsInput | number | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    customerId?: NullableIntFieldUpdateOperationsInput | number | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type retail_ordersCreateManyInput = {
    id?: number
    book_edition_id: number
    total_price?: number | null
    quantity?: number | null
    customerId?: number | null
    phoneNumber?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
  }

  export type retail_ordersUpdateManyMutationInput = {
    total_price?: NullableFloatFieldUpdateOperationsInput | number | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type retail_ordersUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    book_edition_id?: IntFieldUpdateOperationsInput | number
    total_price?: NullableFloatFieldUpdateOperationsInput | number | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    customerId?: NullableIntFieldUpdateOperationsInput | number | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type usersCreateInput = {
    name?: string | null
    email?: string | null
    password?: string | null
    role?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
  }

  export type usersUncheckedCreateInput = {
    id?: number
    name?: string | null
    email?: string | null
    password?: string | null
    role?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
  }

  export type usersUpdateInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type usersUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type usersCreateManyInput = {
    id?: number
    name?: string | null
    email?: string | null
    password?: string | null
    role?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
  }

  export type usersUpdateManyMutationInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type usersUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type customersCreateInput = {
    name?: string | null
    email?: string | null
    password?: string | null
    phonenumber?: string | null
    customerType?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
    orders?: retail_ordersCreateNestedManyWithoutCustomerInput
  }

  export type customersUncheckedCreateInput = {
    id?: number
    name?: string | null
    email?: string | null
    password?: string | null
    phonenumber?: string | null
    customerType?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
    orders?: retail_ordersUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type customersUpdateInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    phonenumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerType?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: retail_ordersUpdateManyWithoutCustomerNestedInput
  }

  export type customersUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    phonenumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerType?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: retail_ordersUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type customersCreateManyInput = {
    id?: number
    name?: string | null
    email?: string | null
    password?: string | null
    phonenumber?: string | null
    customerType?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
  }

  export type customersUpdateManyMutationInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    phonenumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerType?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type customersUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    phonenumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerType?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type Reatil_book_editionsListRelationFilter = {
    every?: reatil_book_editionsWhereInput
    some?: reatil_book_editionsWhereInput
    none?: reatil_book_editionsWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type reatil_book_editionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type retail_booksOrderByRelevanceInput = {
    fields: retail_booksOrderByRelevanceFieldEnum | retail_booksOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type retail_booksCountOrderByAggregateInput = {
    id?: SortOrder
    book_id?: SortOrder
    title?: SortOrder
    author?: SortOrder
    language?: SortOrder
    category?: SortOrder
    publication_year?: SortOrder
    copyright_registration_number?: SortOrder
    book_image_url?: SortOrder
    status?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    pen_name?: SortOrder
    translator_cost?: SortOrder
    cover_design_cost?: SortOrder
    text_design_cost?: SortOrder
    editor_cost?: SortOrder
    typewriting_cost?: SortOrder
    store_cost?: SortOrder
    distribution_cost?: SortOrder
    advertisement_cost?: SortOrder
    purchasing_right_cost?: SortOrder
    ourbook?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type retail_booksAvgOrderByAggregateInput = {
    id?: SortOrder
    book_id?: SortOrder
    translator_cost?: SortOrder
    cover_design_cost?: SortOrder
    text_design_cost?: SortOrder
    editor_cost?: SortOrder
    typewriting_cost?: SortOrder
    store_cost?: SortOrder
    distribution_cost?: SortOrder
    advertisement_cost?: SortOrder
    purchasing_right_cost?: SortOrder
  }

  export type retail_booksMaxOrderByAggregateInput = {
    id?: SortOrder
    book_id?: SortOrder
    title?: SortOrder
    author?: SortOrder
    language?: SortOrder
    category?: SortOrder
    publication_year?: SortOrder
    copyright_registration_number?: SortOrder
    book_image_url?: SortOrder
    status?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    pen_name?: SortOrder
    translator_cost?: SortOrder
    cover_design_cost?: SortOrder
    text_design_cost?: SortOrder
    editor_cost?: SortOrder
    typewriting_cost?: SortOrder
    store_cost?: SortOrder
    distribution_cost?: SortOrder
    advertisement_cost?: SortOrder
    purchasing_right_cost?: SortOrder
    ourbook?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type retail_booksMinOrderByAggregateInput = {
    id?: SortOrder
    book_id?: SortOrder
    title?: SortOrder
    author?: SortOrder
    language?: SortOrder
    category?: SortOrder
    publication_year?: SortOrder
    copyright_registration_number?: SortOrder
    book_image_url?: SortOrder
    status?: SortOrder
    is_deleted?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    pen_name?: SortOrder
    translator_cost?: SortOrder
    cover_design_cost?: SortOrder
    text_design_cost?: SortOrder
    editor_cost?: SortOrder
    typewriting_cost?: SortOrder
    store_cost?: SortOrder
    distribution_cost?: SortOrder
    advertisement_cost?: SortOrder
    purchasing_right_cost?: SortOrder
    ourbook?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type retail_booksSumOrderByAggregateInput = {
    id?: SortOrder
    book_id?: SortOrder
    translator_cost?: SortOrder
    cover_design_cost?: SortOrder
    text_design_cost?: SortOrder
    editor_cost?: SortOrder
    typewriting_cost?: SortOrder
    store_cost?: SortOrder
    distribution_cost?: SortOrder
    advertisement_cost?: SortOrder
    purchasing_right_cost?: SortOrder
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

  export type Retail_booksNullableScalarRelationFilter = {
    is?: retail_booksWhereInput | null
    isNot?: retail_booksWhereInput | null
  }

  export type Retail_ordersListRelationFilter = {
    every?: retail_ordersWhereInput
    some?: retail_ordersWhereInput
    none?: retail_ordersWhereInput
  }

  export type retail_ordersOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type reatil_book_editionsOrderByRelevanceInput = {
    fields: reatil_book_editionsOrderByRelevanceFieldEnum | reatil_book_editionsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type reatil_book_editionsCountOrderByAggregateInput = {
    id?: SortOrder
    edition_name?: SortOrder
    book_id?: SortOrder
    price?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type reatil_book_editionsAvgOrderByAggregateInput = {
    id?: SortOrder
    book_id?: SortOrder
    price?: SortOrder
  }

  export type reatil_book_editionsMaxOrderByAggregateInput = {
    id?: SortOrder
    edition_name?: SortOrder
    book_id?: SortOrder
    price?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type reatil_book_editionsMinOrderByAggregateInput = {
    id?: SortOrder
    edition_name?: SortOrder
    book_id?: SortOrder
    price?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type reatil_book_editionsSumOrderByAggregateInput = {
    id?: SortOrder
    book_id?: SortOrder
    price?: SortOrder
  }

  export type Reatil_book_editionsScalarRelationFilter = {
    is?: reatil_book_editionsWhereInput
    isNot?: reatil_book_editionsWhereInput
  }

  export type CustomersNullableScalarRelationFilter = {
    is?: customersWhereInput | null
    isNot?: customersWhereInput | null
  }

  export type retail_ordersOrderByRelevanceInput = {
    fields: retail_ordersOrderByRelevanceFieldEnum | retail_ordersOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type retail_ordersCountOrderByAggregateInput = {
    id?: SortOrder
    book_edition_id?: SortOrder
    total_price?: SortOrder
    quantity?: SortOrder
    customerId?: SortOrder
    phoneNumber?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type retail_ordersAvgOrderByAggregateInput = {
    id?: SortOrder
    book_edition_id?: SortOrder
    total_price?: SortOrder
    quantity?: SortOrder
    customerId?: SortOrder
  }

  export type retail_ordersMaxOrderByAggregateInput = {
    id?: SortOrder
    book_edition_id?: SortOrder
    total_price?: SortOrder
    quantity?: SortOrder
    customerId?: SortOrder
    phoneNumber?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type retail_ordersMinOrderByAggregateInput = {
    id?: SortOrder
    book_edition_id?: SortOrder
    total_price?: SortOrder
    quantity?: SortOrder
    customerId?: SortOrder
    phoneNumber?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type retail_ordersSumOrderByAggregateInput = {
    id?: SortOrder
    book_edition_id?: SortOrder
    total_price?: SortOrder
    quantity?: SortOrder
    customerId?: SortOrder
  }

  export type usersOrderByRelevanceInput = {
    fields: usersOrderByRelevanceFieldEnum | usersOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type usersCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type usersAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type usersMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type usersMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type usersSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type customersOrderByRelevanceInput = {
    fields: customersOrderByRelevanceFieldEnum | customersOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type customersCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    phonenumber?: SortOrder
    customerType?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type customersAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type customersMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    phonenumber?: SortOrder
    customerType?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type customersMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    phonenumber?: SortOrder
    customerType?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
  }

  export type customersSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type reatil_book_editionsCreateNestedManyWithoutBooksInput = {
    create?: XOR<reatil_book_editionsCreateWithoutBooksInput, reatil_book_editionsUncheckedCreateWithoutBooksInput> | reatil_book_editionsCreateWithoutBooksInput[] | reatil_book_editionsUncheckedCreateWithoutBooksInput[]
    connectOrCreate?: reatil_book_editionsCreateOrConnectWithoutBooksInput | reatil_book_editionsCreateOrConnectWithoutBooksInput[]
    createMany?: reatil_book_editionsCreateManyBooksInputEnvelope
    connect?: reatil_book_editionsWhereUniqueInput | reatil_book_editionsWhereUniqueInput[]
  }

  export type reatil_book_editionsUncheckedCreateNestedManyWithoutBooksInput = {
    create?: XOR<reatil_book_editionsCreateWithoutBooksInput, reatil_book_editionsUncheckedCreateWithoutBooksInput> | reatil_book_editionsCreateWithoutBooksInput[] | reatil_book_editionsUncheckedCreateWithoutBooksInput[]
    connectOrCreate?: reatil_book_editionsCreateOrConnectWithoutBooksInput | reatil_book_editionsCreateOrConnectWithoutBooksInput[]
    createMany?: reatil_book_editionsCreateManyBooksInputEnvelope
    connect?: reatil_book_editionsWhereUniqueInput | reatil_book_editionsWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type reatil_book_editionsUpdateManyWithoutBooksNestedInput = {
    create?: XOR<reatil_book_editionsCreateWithoutBooksInput, reatil_book_editionsUncheckedCreateWithoutBooksInput> | reatil_book_editionsCreateWithoutBooksInput[] | reatil_book_editionsUncheckedCreateWithoutBooksInput[]
    connectOrCreate?: reatil_book_editionsCreateOrConnectWithoutBooksInput | reatil_book_editionsCreateOrConnectWithoutBooksInput[]
    upsert?: reatil_book_editionsUpsertWithWhereUniqueWithoutBooksInput | reatil_book_editionsUpsertWithWhereUniqueWithoutBooksInput[]
    createMany?: reatil_book_editionsCreateManyBooksInputEnvelope
    set?: reatil_book_editionsWhereUniqueInput | reatil_book_editionsWhereUniqueInput[]
    disconnect?: reatil_book_editionsWhereUniqueInput | reatil_book_editionsWhereUniqueInput[]
    delete?: reatil_book_editionsWhereUniqueInput | reatil_book_editionsWhereUniqueInput[]
    connect?: reatil_book_editionsWhereUniqueInput | reatil_book_editionsWhereUniqueInput[]
    update?: reatil_book_editionsUpdateWithWhereUniqueWithoutBooksInput | reatil_book_editionsUpdateWithWhereUniqueWithoutBooksInput[]
    updateMany?: reatil_book_editionsUpdateManyWithWhereWithoutBooksInput | reatil_book_editionsUpdateManyWithWhereWithoutBooksInput[]
    deleteMany?: reatil_book_editionsScalarWhereInput | reatil_book_editionsScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type reatil_book_editionsUncheckedUpdateManyWithoutBooksNestedInput = {
    create?: XOR<reatil_book_editionsCreateWithoutBooksInput, reatil_book_editionsUncheckedCreateWithoutBooksInput> | reatil_book_editionsCreateWithoutBooksInput[] | reatil_book_editionsUncheckedCreateWithoutBooksInput[]
    connectOrCreate?: reatil_book_editionsCreateOrConnectWithoutBooksInput | reatil_book_editionsCreateOrConnectWithoutBooksInput[]
    upsert?: reatil_book_editionsUpsertWithWhereUniqueWithoutBooksInput | reatil_book_editionsUpsertWithWhereUniqueWithoutBooksInput[]
    createMany?: reatil_book_editionsCreateManyBooksInputEnvelope
    set?: reatil_book_editionsWhereUniqueInput | reatil_book_editionsWhereUniqueInput[]
    disconnect?: reatil_book_editionsWhereUniqueInput | reatil_book_editionsWhereUniqueInput[]
    delete?: reatil_book_editionsWhereUniqueInput | reatil_book_editionsWhereUniqueInput[]
    connect?: reatil_book_editionsWhereUniqueInput | reatil_book_editionsWhereUniqueInput[]
    update?: reatil_book_editionsUpdateWithWhereUniqueWithoutBooksInput | reatil_book_editionsUpdateWithWhereUniqueWithoutBooksInput[]
    updateMany?: reatil_book_editionsUpdateManyWithWhereWithoutBooksInput | reatil_book_editionsUpdateManyWithWhereWithoutBooksInput[]
    deleteMany?: reatil_book_editionsScalarWhereInput | reatil_book_editionsScalarWhereInput[]
  }

  export type retail_booksCreateNestedOneWithoutBookEditionsInput = {
    create?: XOR<retail_booksCreateWithoutBookEditionsInput, retail_booksUncheckedCreateWithoutBookEditionsInput>
    connectOrCreate?: retail_booksCreateOrConnectWithoutBookEditionsInput
    connect?: retail_booksWhereUniqueInput
  }

  export type retail_ordersCreateNestedManyWithoutBookInput = {
    create?: XOR<retail_ordersCreateWithoutBookInput, retail_ordersUncheckedCreateWithoutBookInput> | retail_ordersCreateWithoutBookInput[] | retail_ordersUncheckedCreateWithoutBookInput[]
    connectOrCreate?: retail_ordersCreateOrConnectWithoutBookInput | retail_ordersCreateOrConnectWithoutBookInput[]
    createMany?: retail_ordersCreateManyBookInputEnvelope
    connect?: retail_ordersWhereUniqueInput | retail_ordersWhereUniqueInput[]
  }

  export type retail_ordersUncheckedCreateNestedManyWithoutBookInput = {
    create?: XOR<retail_ordersCreateWithoutBookInput, retail_ordersUncheckedCreateWithoutBookInput> | retail_ordersCreateWithoutBookInput[] | retail_ordersUncheckedCreateWithoutBookInput[]
    connectOrCreate?: retail_ordersCreateOrConnectWithoutBookInput | retail_ordersCreateOrConnectWithoutBookInput[]
    createMany?: retail_ordersCreateManyBookInputEnvelope
    connect?: retail_ordersWhereUniqueInput | retail_ordersWhereUniqueInput[]
  }

  export type retail_booksUpdateOneWithoutBookEditionsNestedInput = {
    create?: XOR<retail_booksCreateWithoutBookEditionsInput, retail_booksUncheckedCreateWithoutBookEditionsInput>
    connectOrCreate?: retail_booksCreateOrConnectWithoutBookEditionsInput
    upsert?: retail_booksUpsertWithoutBookEditionsInput
    disconnect?: retail_booksWhereInput | boolean
    delete?: retail_booksWhereInput | boolean
    connect?: retail_booksWhereUniqueInput
    update?: XOR<XOR<retail_booksUpdateToOneWithWhereWithoutBookEditionsInput, retail_booksUpdateWithoutBookEditionsInput>, retail_booksUncheckedUpdateWithoutBookEditionsInput>
  }

  export type retail_ordersUpdateManyWithoutBookNestedInput = {
    create?: XOR<retail_ordersCreateWithoutBookInput, retail_ordersUncheckedCreateWithoutBookInput> | retail_ordersCreateWithoutBookInput[] | retail_ordersUncheckedCreateWithoutBookInput[]
    connectOrCreate?: retail_ordersCreateOrConnectWithoutBookInput | retail_ordersCreateOrConnectWithoutBookInput[]
    upsert?: retail_ordersUpsertWithWhereUniqueWithoutBookInput | retail_ordersUpsertWithWhereUniqueWithoutBookInput[]
    createMany?: retail_ordersCreateManyBookInputEnvelope
    set?: retail_ordersWhereUniqueInput | retail_ordersWhereUniqueInput[]
    disconnect?: retail_ordersWhereUniqueInput | retail_ordersWhereUniqueInput[]
    delete?: retail_ordersWhereUniqueInput | retail_ordersWhereUniqueInput[]
    connect?: retail_ordersWhereUniqueInput | retail_ordersWhereUniqueInput[]
    update?: retail_ordersUpdateWithWhereUniqueWithoutBookInput | retail_ordersUpdateWithWhereUniqueWithoutBookInput[]
    updateMany?: retail_ordersUpdateManyWithWhereWithoutBookInput | retail_ordersUpdateManyWithWhereWithoutBookInput[]
    deleteMany?: retail_ordersScalarWhereInput | retail_ordersScalarWhereInput[]
  }

  export type retail_ordersUncheckedUpdateManyWithoutBookNestedInput = {
    create?: XOR<retail_ordersCreateWithoutBookInput, retail_ordersUncheckedCreateWithoutBookInput> | retail_ordersCreateWithoutBookInput[] | retail_ordersUncheckedCreateWithoutBookInput[]
    connectOrCreate?: retail_ordersCreateOrConnectWithoutBookInput | retail_ordersCreateOrConnectWithoutBookInput[]
    upsert?: retail_ordersUpsertWithWhereUniqueWithoutBookInput | retail_ordersUpsertWithWhereUniqueWithoutBookInput[]
    createMany?: retail_ordersCreateManyBookInputEnvelope
    set?: retail_ordersWhereUniqueInput | retail_ordersWhereUniqueInput[]
    disconnect?: retail_ordersWhereUniqueInput | retail_ordersWhereUniqueInput[]
    delete?: retail_ordersWhereUniqueInput | retail_ordersWhereUniqueInput[]
    connect?: retail_ordersWhereUniqueInput | retail_ordersWhereUniqueInput[]
    update?: retail_ordersUpdateWithWhereUniqueWithoutBookInput | retail_ordersUpdateWithWhereUniqueWithoutBookInput[]
    updateMany?: retail_ordersUpdateManyWithWhereWithoutBookInput | retail_ordersUpdateManyWithWhereWithoutBookInput[]
    deleteMany?: retail_ordersScalarWhereInput | retail_ordersScalarWhereInput[]
  }

  export type reatil_book_editionsCreateNestedOneWithoutOrdersInput = {
    create?: XOR<reatil_book_editionsCreateWithoutOrdersInput, reatil_book_editionsUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: reatil_book_editionsCreateOrConnectWithoutOrdersInput
    connect?: reatil_book_editionsWhereUniqueInput
  }

  export type customersCreateNestedOneWithoutOrdersInput = {
    create?: XOR<customersCreateWithoutOrdersInput, customersUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: customersCreateOrConnectWithoutOrdersInput
    connect?: customersWhereUniqueInput
  }

  export type reatil_book_editionsUpdateOneRequiredWithoutOrdersNestedInput = {
    create?: XOR<reatil_book_editionsCreateWithoutOrdersInput, reatil_book_editionsUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: reatil_book_editionsCreateOrConnectWithoutOrdersInput
    upsert?: reatil_book_editionsUpsertWithoutOrdersInput
    connect?: reatil_book_editionsWhereUniqueInput
    update?: XOR<XOR<reatil_book_editionsUpdateToOneWithWhereWithoutOrdersInput, reatil_book_editionsUpdateWithoutOrdersInput>, reatil_book_editionsUncheckedUpdateWithoutOrdersInput>
  }

  export type customersUpdateOneWithoutOrdersNestedInput = {
    create?: XOR<customersCreateWithoutOrdersInput, customersUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: customersCreateOrConnectWithoutOrdersInput
    upsert?: customersUpsertWithoutOrdersInput
    disconnect?: customersWhereInput | boolean
    delete?: customersWhereInput | boolean
    connect?: customersWhereUniqueInput
    update?: XOR<XOR<customersUpdateToOneWithWhereWithoutOrdersInput, customersUpdateWithoutOrdersInput>, customersUncheckedUpdateWithoutOrdersInput>
  }

  export type retail_ordersCreateNestedManyWithoutCustomerInput = {
    create?: XOR<retail_ordersCreateWithoutCustomerInput, retail_ordersUncheckedCreateWithoutCustomerInput> | retail_ordersCreateWithoutCustomerInput[] | retail_ordersUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: retail_ordersCreateOrConnectWithoutCustomerInput | retail_ordersCreateOrConnectWithoutCustomerInput[]
    createMany?: retail_ordersCreateManyCustomerInputEnvelope
    connect?: retail_ordersWhereUniqueInput | retail_ordersWhereUniqueInput[]
  }

  export type retail_ordersUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<retail_ordersCreateWithoutCustomerInput, retail_ordersUncheckedCreateWithoutCustomerInput> | retail_ordersCreateWithoutCustomerInput[] | retail_ordersUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: retail_ordersCreateOrConnectWithoutCustomerInput | retail_ordersCreateOrConnectWithoutCustomerInput[]
    createMany?: retail_ordersCreateManyCustomerInputEnvelope
    connect?: retail_ordersWhereUniqueInput | retail_ordersWhereUniqueInput[]
  }

  export type retail_ordersUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<retail_ordersCreateWithoutCustomerInput, retail_ordersUncheckedCreateWithoutCustomerInput> | retail_ordersCreateWithoutCustomerInput[] | retail_ordersUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: retail_ordersCreateOrConnectWithoutCustomerInput | retail_ordersCreateOrConnectWithoutCustomerInput[]
    upsert?: retail_ordersUpsertWithWhereUniqueWithoutCustomerInput | retail_ordersUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: retail_ordersCreateManyCustomerInputEnvelope
    set?: retail_ordersWhereUniqueInput | retail_ordersWhereUniqueInput[]
    disconnect?: retail_ordersWhereUniqueInput | retail_ordersWhereUniqueInput[]
    delete?: retail_ordersWhereUniqueInput | retail_ordersWhereUniqueInput[]
    connect?: retail_ordersWhereUniqueInput | retail_ordersWhereUniqueInput[]
    update?: retail_ordersUpdateWithWhereUniqueWithoutCustomerInput | retail_ordersUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: retail_ordersUpdateManyWithWhereWithoutCustomerInput | retail_ordersUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: retail_ordersScalarWhereInput | retail_ordersScalarWhereInput[]
  }

  export type retail_ordersUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<retail_ordersCreateWithoutCustomerInput, retail_ordersUncheckedCreateWithoutCustomerInput> | retail_ordersCreateWithoutCustomerInput[] | retail_ordersUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: retail_ordersCreateOrConnectWithoutCustomerInput | retail_ordersCreateOrConnectWithoutCustomerInput[]
    upsert?: retail_ordersUpsertWithWhereUniqueWithoutCustomerInput | retail_ordersUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: retail_ordersCreateManyCustomerInputEnvelope
    set?: retail_ordersWhereUniqueInput | retail_ordersWhereUniqueInput[]
    disconnect?: retail_ordersWhereUniqueInput | retail_ordersWhereUniqueInput[]
    delete?: retail_ordersWhereUniqueInput | retail_ordersWhereUniqueInput[]
    connect?: retail_ordersWhereUniqueInput | retail_ordersWhereUniqueInput[]
    update?: retail_ordersUpdateWithWhereUniqueWithoutCustomerInput | retail_ordersUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: retail_ordersUpdateManyWithWhereWithoutCustomerInput | retail_ordersUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: retail_ordersScalarWhereInput | retail_ordersScalarWhereInput[]
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

  export type reatil_book_editionsCreateWithoutBooksInput = {
    edition_name: string
    price?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
    orders?: retail_ordersCreateNestedManyWithoutBookInput
  }

  export type reatil_book_editionsUncheckedCreateWithoutBooksInput = {
    id?: number
    edition_name: string
    price?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
    orders?: retail_ordersUncheckedCreateNestedManyWithoutBookInput
  }

  export type reatil_book_editionsCreateOrConnectWithoutBooksInput = {
    where: reatil_book_editionsWhereUniqueInput
    create: XOR<reatil_book_editionsCreateWithoutBooksInput, reatil_book_editionsUncheckedCreateWithoutBooksInput>
  }

  export type reatil_book_editionsCreateManyBooksInputEnvelope = {
    data: reatil_book_editionsCreateManyBooksInput | reatil_book_editionsCreateManyBooksInput[]
    skipDuplicates?: boolean
  }

  export type reatil_book_editionsUpsertWithWhereUniqueWithoutBooksInput = {
    where: reatil_book_editionsWhereUniqueInput
    update: XOR<reatil_book_editionsUpdateWithoutBooksInput, reatil_book_editionsUncheckedUpdateWithoutBooksInput>
    create: XOR<reatil_book_editionsCreateWithoutBooksInput, reatil_book_editionsUncheckedCreateWithoutBooksInput>
  }

  export type reatil_book_editionsUpdateWithWhereUniqueWithoutBooksInput = {
    where: reatil_book_editionsWhereUniqueInput
    data: XOR<reatil_book_editionsUpdateWithoutBooksInput, reatil_book_editionsUncheckedUpdateWithoutBooksInput>
  }

  export type reatil_book_editionsUpdateManyWithWhereWithoutBooksInput = {
    where: reatil_book_editionsScalarWhereInput
    data: XOR<reatil_book_editionsUpdateManyMutationInput, reatil_book_editionsUncheckedUpdateManyWithoutBooksInput>
  }

  export type reatil_book_editionsScalarWhereInput = {
    AND?: reatil_book_editionsScalarWhereInput | reatil_book_editionsScalarWhereInput[]
    OR?: reatil_book_editionsScalarWhereInput[]
    NOT?: reatil_book_editionsScalarWhereInput | reatil_book_editionsScalarWhereInput[]
    id?: IntFilter<"reatil_book_editions"> | number
    edition_name?: StringFilter<"reatil_book_editions"> | string
    book_id?: IntNullableFilter<"reatil_book_editions"> | number | null
    price?: FloatNullableFilter<"reatil_book_editions"> | number | null
    created_at?: DateTimeFilter<"reatil_book_editions"> | Date | string
    updated_at?: DateTimeFilter<"reatil_book_editions"> | Date | string
    deleted_at?: DateTimeFilter<"reatil_book_editions"> | Date | string
  }

  export type retail_booksCreateWithoutBookEditionsInput = {
    book_id?: number | null
    title: string
    author: string
    language: string
    category: string
    publication_year?: string | null
    copyright_registration_number?: string | null
    book_image_url?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    pen_name?: string | null
    translator_cost?: number | null
    cover_design_cost?: number | null
    text_design_cost?: number | null
    editor_cost?: number | null
    typewriting_cost?: number | null
    store_cost?: number | null
    distribution_cost?: number | null
    advertisement_cost?: number | null
    purchasing_right_cost?: number | null
    ourbook?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
  }

  export type retail_booksUncheckedCreateWithoutBookEditionsInput = {
    id?: number
    book_id?: number | null
    title: string
    author: string
    language: string
    category: string
    publication_year?: string | null
    copyright_registration_number?: string | null
    book_image_url?: string | null
    status?: string
    is_deleted?: boolean
    updatedAt: Date | string
    createdAt?: Date | string
    deletedAt?: Date | string
    pen_name?: string | null
    translator_cost?: number | null
    cover_design_cost?: number | null
    text_design_cost?: number | null
    editor_cost?: number | null
    typewriting_cost?: number | null
    store_cost?: number | null
    distribution_cost?: number | null
    advertisement_cost?: number | null
    purchasing_right_cost?: number | null
    ourbook?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
  }

  export type retail_booksCreateOrConnectWithoutBookEditionsInput = {
    where: retail_booksWhereUniqueInput
    create: XOR<retail_booksCreateWithoutBookEditionsInput, retail_booksUncheckedCreateWithoutBookEditionsInput>
  }

  export type retail_ordersCreateWithoutBookInput = {
    total_price?: number | null
    quantity?: number | null
    phoneNumber?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
    customer?: customersCreateNestedOneWithoutOrdersInput
  }

  export type retail_ordersUncheckedCreateWithoutBookInput = {
    id?: number
    total_price?: number | null
    quantity?: number | null
    customerId?: number | null
    phoneNumber?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
  }

  export type retail_ordersCreateOrConnectWithoutBookInput = {
    where: retail_ordersWhereUniqueInput
    create: XOR<retail_ordersCreateWithoutBookInput, retail_ordersUncheckedCreateWithoutBookInput>
  }

  export type retail_ordersCreateManyBookInputEnvelope = {
    data: retail_ordersCreateManyBookInput | retail_ordersCreateManyBookInput[]
    skipDuplicates?: boolean
  }

  export type retail_booksUpsertWithoutBookEditionsInput = {
    update: XOR<retail_booksUpdateWithoutBookEditionsInput, retail_booksUncheckedUpdateWithoutBookEditionsInput>
    create: XOR<retail_booksCreateWithoutBookEditionsInput, retail_booksUncheckedCreateWithoutBookEditionsInput>
    where?: retail_booksWhereInput
  }

  export type retail_booksUpdateToOneWithWhereWithoutBookEditionsInput = {
    where?: retail_booksWhereInput
    data: XOR<retail_booksUpdateWithoutBookEditionsInput, retail_booksUncheckedUpdateWithoutBookEditionsInput>
  }

  export type retail_booksUpdateWithoutBookEditionsInput = {
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    publication_year?: NullableStringFieldUpdateOperationsInput | string | null
    copyright_registration_number?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pen_name?: NullableStringFieldUpdateOperationsInput | string | null
    translator_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    cover_design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    text_design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    editor_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    typewriting_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    store_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    distribution_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    advertisement_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    purchasing_right_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    ourbook?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type retail_booksUncheckedUpdateWithoutBookEditionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    publication_year?: NullableStringFieldUpdateOperationsInput | string | null
    copyright_registration_number?: NullableStringFieldUpdateOperationsInput | string | null
    book_image_url?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    is_deleted?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pen_name?: NullableStringFieldUpdateOperationsInput | string | null
    translator_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    cover_design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    text_design_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    editor_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    typewriting_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    store_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    distribution_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    advertisement_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    purchasing_right_cost?: NullableFloatFieldUpdateOperationsInput | number | null
    ourbook?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type retail_ordersUpsertWithWhereUniqueWithoutBookInput = {
    where: retail_ordersWhereUniqueInput
    update: XOR<retail_ordersUpdateWithoutBookInput, retail_ordersUncheckedUpdateWithoutBookInput>
    create: XOR<retail_ordersCreateWithoutBookInput, retail_ordersUncheckedCreateWithoutBookInput>
  }

  export type retail_ordersUpdateWithWhereUniqueWithoutBookInput = {
    where: retail_ordersWhereUniqueInput
    data: XOR<retail_ordersUpdateWithoutBookInput, retail_ordersUncheckedUpdateWithoutBookInput>
  }

  export type retail_ordersUpdateManyWithWhereWithoutBookInput = {
    where: retail_ordersScalarWhereInput
    data: XOR<retail_ordersUpdateManyMutationInput, retail_ordersUncheckedUpdateManyWithoutBookInput>
  }

  export type retail_ordersScalarWhereInput = {
    AND?: retail_ordersScalarWhereInput | retail_ordersScalarWhereInput[]
    OR?: retail_ordersScalarWhereInput[]
    NOT?: retail_ordersScalarWhereInput | retail_ordersScalarWhereInput[]
    id?: IntFilter<"retail_orders"> | number
    book_edition_id?: IntFilter<"retail_orders"> | number
    total_price?: FloatNullableFilter<"retail_orders"> | number | null
    quantity?: IntNullableFilter<"retail_orders"> | number | null
    customerId?: IntNullableFilter<"retail_orders"> | number | null
    phoneNumber?: StringNullableFilter<"retail_orders"> | string | null
    created_at?: DateTimeFilter<"retail_orders"> | Date | string
    updated_at?: DateTimeFilter<"retail_orders"> | Date | string
    deleted_at?: DateTimeFilter<"retail_orders"> | Date | string
  }

  export type reatil_book_editionsCreateWithoutOrdersInput = {
    edition_name: string
    price?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
    books?: retail_booksCreateNestedOneWithoutBookEditionsInput
  }

  export type reatil_book_editionsUncheckedCreateWithoutOrdersInput = {
    id?: number
    edition_name: string
    book_id?: number | null
    price?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
  }

  export type reatil_book_editionsCreateOrConnectWithoutOrdersInput = {
    where: reatil_book_editionsWhereUniqueInput
    create: XOR<reatil_book_editionsCreateWithoutOrdersInput, reatil_book_editionsUncheckedCreateWithoutOrdersInput>
  }

  export type customersCreateWithoutOrdersInput = {
    name?: string | null
    email?: string | null
    password?: string | null
    phonenumber?: string | null
    customerType?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
  }

  export type customersUncheckedCreateWithoutOrdersInput = {
    id?: number
    name?: string | null
    email?: string | null
    password?: string | null
    phonenumber?: string | null
    customerType?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
  }

  export type customersCreateOrConnectWithoutOrdersInput = {
    where: customersWhereUniqueInput
    create: XOR<customersCreateWithoutOrdersInput, customersUncheckedCreateWithoutOrdersInput>
  }

  export type reatil_book_editionsUpsertWithoutOrdersInput = {
    update: XOR<reatil_book_editionsUpdateWithoutOrdersInput, reatil_book_editionsUncheckedUpdateWithoutOrdersInput>
    create: XOR<reatil_book_editionsCreateWithoutOrdersInput, reatil_book_editionsUncheckedCreateWithoutOrdersInput>
    where?: reatil_book_editionsWhereInput
  }

  export type reatil_book_editionsUpdateToOneWithWhereWithoutOrdersInput = {
    where?: reatil_book_editionsWhereInput
    data: XOR<reatil_book_editionsUpdateWithoutOrdersInput, reatil_book_editionsUncheckedUpdateWithoutOrdersInput>
  }

  export type reatil_book_editionsUpdateWithoutOrdersInput = {
    edition_name?: StringFieldUpdateOperationsInput | string
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    books?: retail_booksUpdateOneWithoutBookEditionsNestedInput
  }

  export type reatil_book_editionsUncheckedUpdateWithoutOrdersInput = {
    id?: IntFieldUpdateOperationsInput | number
    edition_name?: StringFieldUpdateOperationsInput | string
    book_id?: NullableIntFieldUpdateOperationsInput | number | null
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type customersUpsertWithoutOrdersInput = {
    update: XOR<customersUpdateWithoutOrdersInput, customersUncheckedUpdateWithoutOrdersInput>
    create: XOR<customersCreateWithoutOrdersInput, customersUncheckedCreateWithoutOrdersInput>
    where?: customersWhereInput
  }

  export type customersUpdateToOneWithWhereWithoutOrdersInput = {
    where?: customersWhereInput
    data: XOR<customersUpdateWithoutOrdersInput, customersUncheckedUpdateWithoutOrdersInput>
  }

  export type customersUpdateWithoutOrdersInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    phonenumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerType?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type customersUncheckedUpdateWithoutOrdersInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    phonenumber?: NullableStringFieldUpdateOperationsInput | string | null
    customerType?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type retail_ordersCreateWithoutCustomerInput = {
    total_price?: number | null
    quantity?: number | null
    phoneNumber?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
    book: reatil_book_editionsCreateNestedOneWithoutOrdersInput
  }

  export type retail_ordersUncheckedCreateWithoutCustomerInput = {
    id?: number
    book_edition_id: number
    total_price?: number | null
    quantity?: number | null
    phoneNumber?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
  }

  export type retail_ordersCreateOrConnectWithoutCustomerInput = {
    where: retail_ordersWhereUniqueInput
    create: XOR<retail_ordersCreateWithoutCustomerInput, retail_ordersUncheckedCreateWithoutCustomerInput>
  }

  export type retail_ordersCreateManyCustomerInputEnvelope = {
    data: retail_ordersCreateManyCustomerInput | retail_ordersCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type retail_ordersUpsertWithWhereUniqueWithoutCustomerInput = {
    where: retail_ordersWhereUniqueInput
    update: XOR<retail_ordersUpdateWithoutCustomerInput, retail_ordersUncheckedUpdateWithoutCustomerInput>
    create: XOR<retail_ordersCreateWithoutCustomerInput, retail_ordersUncheckedCreateWithoutCustomerInput>
  }

  export type retail_ordersUpdateWithWhereUniqueWithoutCustomerInput = {
    where: retail_ordersWhereUniqueInput
    data: XOR<retail_ordersUpdateWithoutCustomerInput, retail_ordersUncheckedUpdateWithoutCustomerInput>
  }

  export type retail_ordersUpdateManyWithWhereWithoutCustomerInput = {
    where: retail_ordersScalarWhereInput
    data: XOR<retail_ordersUpdateManyMutationInput, retail_ordersUncheckedUpdateManyWithoutCustomerInput>
  }

  export type reatil_book_editionsCreateManyBooksInput = {
    id?: number
    edition_name: string
    price?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
  }

  export type reatil_book_editionsUpdateWithoutBooksInput = {
    edition_name?: StringFieldUpdateOperationsInput | string
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: retail_ordersUpdateManyWithoutBookNestedInput
  }

  export type reatil_book_editionsUncheckedUpdateWithoutBooksInput = {
    id?: IntFieldUpdateOperationsInput | number
    edition_name?: StringFieldUpdateOperationsInput | string
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    orders?: retail_ordersUncheckedUpdateManyWithoutBookNestedInput
  }

  export type reatil_book_editionsUncheckedUpdateManyWithoutBooksInput = {
    id?: IntFieldUpdateOperationsInput | number
    edition_name?: StringFieldUpdateOperationsInput | string
    price?: NullableFloatFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type retail_ordersCreateManyBookInput = {
    id?: number
    total_price?: number | null
    quantity?: number | null
    customerId?: number | null
    phoneNumber?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
  }

  export type retail_ordersUpdateWithoutBookInput = {
    total_price?: NullableFloatFieldUpdateOperationsInput | number | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: customersUpdateOneWithoutOrdersNestedInput
  }

  export type retail_ordersUncheckedUpdateWithoutBookInput = {
    id?: IntFieldUpdateOperationsInput | number
    total_price?: NullableFloatFieldUpdateOperationsInput | number | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    customerId?: NullableIntFieldUpdateOperationsInput | number | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type retail_ordersUncheckedUpdateManyWithoutBookInput = {
    id?: IntFieldUpdateOperationsInput | number
    total_price?: NullableFloatFieldUpdateOperationsInput | number | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    customerId?: NullableIntFieldUpdateOperationsInput | number | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type retail_ordersCreateManyCustomerInput = {
    id?: number
    book_edition_id: number
    total_price?: number | null
    quantity?: number | null
    phoneNumber?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    deleted_at?: Date | string
  }

  export type retail_ordersUpdateWithoutCustomerInput = {
    total_price?: NullableFloatFieldUpdateOperationsInput | number | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    book?: reatil_book_editionsUpdateOneRequiredWithoutOrdersNestedInput
  }

  export type retail_ordersUncheckedUpdateWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    book_edition_id?: IntFieldUpdateOperationsInput | number
    total_price?: NullableFloatFieldUpdateOperationsInput | number | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type retail_ordersUncheckedUpdateManyWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    book_edition_id?: IntFieldUpdateOperationsInput | number
    total_price?: NullableFloatFieldUpdateOperationsInput | number | null
    quantity?: NullableIntFieldUpdateOperationsInput | number | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deleted_at?: DateTimeFieldUpdateOperationsInput | Date | string
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