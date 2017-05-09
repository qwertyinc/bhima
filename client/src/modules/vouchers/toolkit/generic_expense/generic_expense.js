angular.module('bhima.controllers')
.controller('GenericExpenseKitController', GenericExpenseKitController);

// DI definition
GenericExpenseKitController.$inject = [
  '$uibModalInstance', 'NotifyService', 'CashboxService',
  'data', 'AccountStoreService', 'bhConstants',
];

// Import transaction rows for a convention payment
function GenericExpenseKitController(Instance, Notify, Cashbox, Data, AccountStore, bhConstants) {
  var vm = this;

  // global variables
  vm.tool = Data;

  // expose to the view
  vm.close = Instance.close;
  vm.import = submit;

  // accounts from store
  AccountStore.accounts()
    .then(function (data) {
      vm.accounts = data;
    })
    .catch(Notify.handleError);

  // load cashboxes
  Cashbox.read(null, { detailed: 1 })
    .then(function (data) {
      vm.cashboxes = data;
    })
    .catch(Notify.handleError);

  // generate transaction rows
  function generateTransactionRows(params) {
    var rows = [];
    var debitRow = generateRow();
    var creditRow = generateRow();

    var cashboxAccountId = params.cashbox.account_id;
    var selectedAccountId = params.account.id;

    // debit the selected account
    debitRow.account_id = selectedAccountId;
    debitRow.debit = vm.amount;
    debitRow.credit = 0;
    rows.push(debitRow);

    // credit the cash box
    creditRow.account_id = cashboxAccountId;
    creditRow.debit = 0;
    creditRow.credit = vm.amount;
    rows.push(creditRow);

    return rows;
  }

  // generate row element
  function generateRow() {
    return {
      account_id     : undefined,
      debit          : 0,
      credit         : 0,
      reference_uuid : undefined,
      entity_uuid    : undefined
    };
  }

  // submission
  function submit(form) {
    if (form.$invalid) { return; }

    var bundle = generateTransactionRows({
      cashbox : vm.cashbox,
      account : vm.account,
    });

    Instance.close({
      rows        : bundle,
      description : vm.description,
      type_id     : bhConstants.transactionType.GENERIC_EXPENSE, // Generic Expense ID
      currency_id : vm.cashbox.currency_id,
    });
  }
}
