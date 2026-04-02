const { validateAdminArgs } = require('firebase-admin/data-connect');

const connectorConfig = {
  connector: 'example',
  serviceId: 'projetofinanascasal',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

function listAllCategories(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListAllCategories', undefined, inputOpts);
}
exports.listAllCategories = listAllCategories;

function getUserBudgets(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('GetUserBudgets', inputVars, inputOpts);
}
exports.getUserBudgets = getUserBudgets;

function createNewTransaction(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('CreateNewTransaction', inputVars, inputOpts);
}
exports.createNewTransaction = createNewTransaction;

function updateGoalAmount(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('UpdateGoalAmount', inputVars, inputOpts);
}
exports.updateGoalAmount = updateGoalAmount;

