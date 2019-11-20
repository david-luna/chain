import { chainable } from './chainable';

describe('chain with js types', () => {

  // The only types we're goint to cover are Map, WeakMap and Sets
  // primitives like string, number are out of scope

  describe('Array type', () => {

    it('should work properly if we cast to any type', done => {
      // Prepare
      const rawValue     = [1,2,3,4,5];
      const chainedValue = chainable(rawValue);

      // Execute
      chainedValue
      .push(6)
      .push(7)
      .push(8)
      .push(9)
      .push(0)
      .shift()
      .pop()
      .length()
      .map((n) => n * 2)
      .reduce((s: number, n: number) => s + n, 0)

      // Expect
      expect(chainedValue._getChainReference()).toBe(rawValue);
      expect(chainedValue._getChainValueAt(5)).toEqual(1);
      expect(chainedValue._getChainValueAt(6)).toEqual(0);
      expect(chainedValue._getChainValueAt(7)).toEqual(8);
      expect(chainedValue._getChainValueAt(8)).toEqual([4,6,8,10,12,14,16,18]);
      expect(chainedValue._getChainValueAt(9)).toEqual(44);
      
      done();
    });

  });

  describe('Map type', () => {

    it('should resolve all interface types properly with the primitive', done => {
      // Prepare
      const rawValue     = new Map();
      const chainedValue = chainable<Map<string, string>>(rawValue);

      // Execute
      chainedValue
      .set('key1', 'val1')
      .set('key2', 'val2')
      .set('key3', 'val3')
      .size()
      .get('key1')
      .delete('key1')
      .has('key1')
      .size()
      .keys()
      .values()

      // Expect
      expect(chainedValue._getChainReference()).toBe(rawValue);
      expect(chainedValue._getChainValueAt(3)).toEqual(3);
      expect(chainedValue._getChainValueAt(4)).toEqual('val1');
      expect(chainedValue._getChainValueAt(6)).toEqual(false);
      expect(chainedValue._getChainValueAt(7)).toEqual(2);
      expect(chainedValue._getChainValueAt(8)).toEqual(rawValue.keys());
      expect(chainedValue._getChainValueAt(9)).toEqual(rawValue.values());
      done();
    });

  });

  describe('WeakMap type', () => {

    it('should resolve all interface types properly with the primitive', done => {
      // Prepare
      const rawValue     = new WeakMap();
      const chainedValue = chainable<WeakMap<object, string>>(rawValue);
      const key1 = new String('1');
      const key2 = new String('1');
      const key3 = new String('1');

      // Execute
      chainedValue
      .set(key1, 'val1')
      .set(key2, 'val2')
      .set(key3, 'val3')
      .get(key1)
      .delete(key1)
      .has(key1)
      .has(key2)

      // Expect
      expect(chainedValue._getChainReference()).toBe(rawValue);
      expect(chainedValue._getChainValueAt(3)).toEqual('val1');
      expect(chainedValue._getChainValueAt(5)).toEqual(false);
      expect(chainedValue._getChainValueAt(6)).toEqual(true);
      done();
    });

  });

  describe('Set type', () => {

    it('should resolve all interface types properly with the primitive', done => {
      // Prepare
      const rawValue     = new Set(['val0']);
      const chainedValue = chainable<Set<string>>(rawValue);

      // Execute
      chainedValue
      .add('val1')
      .add('val2')
      .size()
      .has('val1')
      .delete('val1')
      .has('val1')
      .clear()
      .size()

      // Expect
      expect(chainedValue._getChainReference()).toBe(rawValue);
      expect(chainedValue._getChainValueAt(2)).toEqual(3);
      expect(chainedValue._getChainValueAt(3)).toEqual(true);
      expect(chainedValue._getChainValueAt(5)).toEqual(false);
      expect(chainedValue._getChainValueAt(7)).toEqual(0);
      done();
    });

  });

});
