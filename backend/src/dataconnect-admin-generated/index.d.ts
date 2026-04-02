import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface BudgetItem_Key {
  id: UUIDString;
  __typename?: 'BudgetItem_Key';
}

export interface Budget_Key {
  id: UUIDString;
  __typename?: 'Budget_Key';
}

export interface Category_Key {
  id: UUIDString;
  __typename?: 'Category_Key';
}

export interface Couple_Key {
  id: UUIDString;
  __typename?: 'Couple_Key';
}

export interface CreateNewTransactionData {
  transaction_insert: Transaction_Key;
}

export interface CreateNewTransactionVariables {
  coupleId: UUIDString;
  userId: UUIDString;
  amount: number;
  type: string;
  description: string;
  date: DateString;
  categoryId?: UUIDString | null;
}

export interface GetUserBudgetsData {
  budgets: ({
    id: UUIDString;
    name: string;
    startDate: DateString;
    endDate: DateString;
    description?: string | null;
  } & Budget_Key)[];
}

export interface GetUserBudgetsVariables {
  coupleId: UUIDString;
}

export interface Goal_Key {
  id: UUIDString;
  __typename?: 'Goal_Key';
}

export interface ListAllCategoriesData {
  categories: ({
    id: UUIDString;
    name: string;
    type: string;
    couple?: {
      id: UUIDString;
      name?: string | null;
    } & Couple_Key;
  } & Category_Key)[];
}

export interface Transaction_Key {
  id: UUIDString;
  __typename?: 'Transaction_Key';
}

export interface UpdateGoalAmountData {
  goal_update?: Goal_Key | null;
}

export interface UpdateGoalAmountVariables {
  goalId: UUIDString;
  newAmount: number;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

/** Generated Node Admin SDK operation action function for the 'ListAllCategories' Query. Allow users to execute without passing in DataConnect. */
export function listAllCategories(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllCategoriesData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllCategories' Query. Allow users to pass in custom DataConnect instances. */
export function listAllCategories(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllCategoriesData>>;

/** Generated Node Admin SDK operation action function for the 'GetUserBudgets' Query. Allow users to execute without passing in DataConnect. */
export function getUserBudgets(dc: DataConnect, vars: GetUserBudgetsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserBudgetsData>>;
/** Generated Node Admin SDK operation action function for the 'GetUserBudgets' Query. Allow users to pass in custom DataConnect instances. */
export function getUserBudgets(vars: GetUserBudgetsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetUserBudgetsData>>;

/** Generated Node Admin SDK operation action function for the 'CreateNewTransaction' Mutation. Allow users to execute without passing in DataConnect. */
export function createNewTransaction(dc: DataConnect, vars: CreateNewTransactionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateNewTransactionData>>;
/** Generated Node Admin SDK operation action function for the 'CreateNewTransaction' Mutation. Allow users to pass in custom DataConnect instances. */
export function createNewTransaction(vars: CreateNewTransactionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateNewTransactionData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateGoalAmount' Mutation. Allow users to execute without passing in DataConnect. */
export function updateGoalAmount(dc: DataConnect, vars: UpdateGoalAmountVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateGoalAmountData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateGoalAmount' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateGoalAmount(vars: UpdateGoalAmountVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateGoalAmountData>>;

