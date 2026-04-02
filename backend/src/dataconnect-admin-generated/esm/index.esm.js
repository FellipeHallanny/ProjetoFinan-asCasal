import { validateAdminArgs } from 'firebase-admin/data-connect';

export const connectorConfig = {
  connector: 'example',
  serviceId: 'projetofinanascasal',
  location: 'us-east4'
};

export function listAllCategories(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListAllCategories', undefined, inputOpts);
}

export function getUserBudgets(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('GetUserBudgets', inputVars, inputOpts);
}

export function createNewTransaction(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('CreateNewTransaction', inputVars, inputOpts);
}

export function updateGoalAmount(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('UpdateGoalAmount', inputVars, inputOpts);
}

