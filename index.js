const getFirstMatch = (obj, cb, matchAll = false, keys = null, keyIndex = null) => {
  if (!keys) {
    const objKeys = Object.keys(obj)
    return getFirstMatch(obj, cb, matchAll, objKeys, 0)
  }

  if (keyIndex === keys.length) return { found: matchAll, key: undefined, value: undefined }

  const key = keys[keyIndex]

  const truthyCb = !!cb(obj[key], key)

  if ((truthyCb && !matchAll) || (!truthyCb && matchAll)) return { found: !matchAll, key, value: obj[key] }

  return getFirstMatch(obj, cb, matchAll, keys, keyIndex + 1)
}

const functions = {
  every (obj, cb) {
    return getFirstMatch(obj, cb, true).found
  },
  filter (obj, cb) {
    return Object.keys(obj)
      .reduce((acc, key) => {
        return cb(obj[key], key)
         ? { ...acc, [key]: obj[key] }
         : acc
      }, {})
  },
  find (obj, cb) {
    const { key, value } = getFirstMatch(obj, cb)
  
    return { key, value }
  },
  findKey (obj, cb) {
    return getFirstMatch(obj, cb).key
  },
  findValue (obj, cb) {
    return getFirstMatch(obj, cb).value
  },
  forEach (obj, cb) {
    Object.keys(obj)
      .forEach(key => {
        cb(obj[key], key)
      })
  },
  map (obj, cb) {
    return Object.keys(obj)
      .reduce((acc, key) => {
        return { ...acc, [key]: cb(obj[key], key) }
      }, {})
  },
  mapEntries (obj, cb) {
    return Object.keys(obj)
      .reduce((acc, key) => {
        return { ...acc, ...cb(obj[key], key) }
      }, {})
  },
  mapKeys (obj, cb) {
    return Object.keys(obj)
      .reduce((acc, key) => {
        return { ...acc, [cb(obj[key], key)]: obj[key] }
      }, {})
  },
  reduce (obj, cb, start) {
    return Object.keys(obj)
      .reduce((acc, key) => {
        return cb(acc, obj[key], key)
      }, start)
  },
  some (obj, cb) {
    return getFirstMatch(obj, cb).found
  },
  sort (obj, cb) {
    const keys = Object.keys(obj)

    const callback = cb
      ? cb
      : (a, b) => b > a ? -1 : a > b ? 1 : 0

    keys.sort((a, b) => callback(obj[a], obj[b], a, b))

    return keys
      .reduce((acc, key) => {
        return { ...acc, [key]: obj[key] }
      }, {})
  },
  includes (obj, value) {
    return Object.values(obj).includes(value)
  },
  includesKey (obj, value) {
    return Object.keys(obj).includes(value)
  },
}

const extendObjectPrototype = () => {
  functions.forEach(functions, (fn, name) => {
    Object.prototype[name] = function (cb) {
      return fn(this, cb)
    }
  })
}

module.exports = {
  extendObjectPrototype,
  ...functions.mapEntries(functions, (fn, name) => {
    return { [`${name}Object`]: fn }
  })
}
