/* global element, by */

const FU = require('../FormUtils');

module.exports = {
  selector : '[bh-transaction-type-select]',
  set      : async function set(transactionTypes, id) {
    const locator = (id) ? by.id(id) : by.css(this.selector);
    await element(locator).click();

    await Promise.all(transactionTypes.map(type => FU.uiSelect('$ctrl.selectedTransactionTypes', type)));
  },
};
