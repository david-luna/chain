import { Chainable, ChainableKeys } from './types';

/**
 * 
 * @param source the object where to check for the property
 * @param key    the property key to lookup
 */
const hasProperty = ( source: Object, key: string ): boolean => {
  // End of recursion cases
  if ( !source ) {
    return false;
  }
  if ( Object.getOwnPropertyNames(source).indexOf(key) !== -1 ) {
    return true;
  }
  // recursion
  return hasProperty(Object.getPrototypeOf(source), key);
}

/**
 * Returns an chainable object with the same API and properties like the source with 2 differences
 * - properties become a getter/setter method depending if they have parameter
 * - we get 2 extra properties
 *   1. `_getChainReference` is a method which returns the original object
 *   2. `_getChainValueAt` method which returns the result of the nth call
 * @param source the object to make chainable
 */
export function chainable<T>( source: T ): Chainable<T> {
  // initialize values array
  const values: any[] = [];

  // make sure we're passing an object
  const sourceType: string = typeof source;
  let sourceObj: Object;

  switch(sourceType) {
    case 'string':
      sourceObj = new String(source);
      break;
    case 'number':
        sourceObj = new Number(source);
        break;
    case 'boolean':
      sourceObj = new Boolean(source);
      break;
    default:
      sourceObj = source;
  }

  // Use Proxy to also allow to work also with unset props
  const proxy = new Proxy(sourceObj, {
    get: function ( target: Object, propKey: string ) {
      // Return reference or values if requested
      if ( propKey === ChainableKeys._getChainReference ) {
        return () => source;
      }
      if ( propKey === ChainableKeys._getChainValueAt ) {
        return (index: number) => values[index];
      }

      // Throw if undetected property in strict mode
      if ( !hasProperty(source, propKey) && chainable.prototype.strict ) {
        throw new TypeError(`Chainable: the property ${propKey} is not available in the proto of source object`);
      }

      // Bypass function call if exists
      if ( typeof target[propKey] === 'function' ) {
        return function (...args: any[]) {
          values.push(target[propKey].apply(target, args));
          return proxy;
        }
      }

      // Default accessor getter/setter function by default 
      return function ( ...args: any[] ) {
        if ( args.length === 0 ) {
          values.push(target[propKey]);
        } else {
          values.push(target[propKey] = args[0]);
        }
        return proxy;
      }
    }
  });

  return proxy;
}

// Set default value for strict mode
chainable.prototype.strict = true;
