'use strict';

describe('Stats E2E Tests:', function () {
  describe('Test Stats page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/stats');
      expect(element.all(by.repeater('stat in stats')).count()).toEqual(0);
    });
  });
});
