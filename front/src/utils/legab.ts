/**
 *Executes a function a specific number of times
 * @param n number of times to iterate
 * @param func function to execute with i going from 0 to n
 */
export const times = <T = any>(
  n: number,
  func: (i: number) => T | void
): T | void => {
  for (let i = 0; i < n; i++) {
    const ret = func(i)
  }
  return undefined
}

export const reduceFind = <T, U>(
  arr: T[],
  accumulator: (acc: U | T, value: T) => U,
  comparator: (acc: U | T, value: T) => boolean,
  initialValue?: U | T
) => {
  if (typeof initialValue !== "undefined") {
    for (let i = 0; i < arr.length; i++) {
      initialValue = accumulator(initialValue as U, arr[i])
      if (comparator(initialValue as U, arr[i])) return arr[i]
    }
  } else {
    initialValue = arr[0]
    if (comparator(initialValue, initialValue as T)) return initialValue
    for (let i = 1; i < arr.length; i++) {
      initialValue = accumulator(initialValue as U, arr[i])
      if (comparator(initialValue as U, arr[i])) return arr[i]
    }
  }
}

/**
 *
 * @param i number of outter loops
 * @param j number of inner loops
 * @param func function to execute
 */
export const fors = <T = any>(
  i: number,
  j: number,
  func: (i: number, j: number) => T | void,
  midFunc?: (i: number) => void
) => {
  for (let n = 0; n < i; n++) {
    midFunc && midFunc(n)
    for (let m = 0; m < j; m++) {
      func(n, m)
    }
  }
}

/**
 *@
 * @param arr array to pick from
 * return a random element from an array
 */
export const pick = <T>(arr: T[]): T => {
  if (arr.length) {
    return arr[rnd(0, arr.length)]
  }
  throw "Empty length"
}

/**
 *
 * @param min minimum number (inclusive)
 * @param max maximum number (exclusive)
 * @param integer integer o decimal numbers
 */
export const rnd = (min = 0, max = 10, integer = true): number => {
  const num = integer
    ? Math.floor(Math.random() * (max - min)) + min
    : Math.random() * (max - min) + min
  return num
}

export const last = <T = any>(element: string | Array<T>) => {
  return !element.length
    ? 0
    : element instanceof Array
      ? element[element.length - 1]
      : element.charAt(element.length - 1)
}

export const pickWeighted = <T = any>(arr: { item: T; weight: number }[]) => {
  const total = arr.reduce<number>((acc, v) => acc + v.weight, 0)
  const objective = rnd(0, total, false)
  return reduceFind<{ item: T; weight: number }, number>(
    arr,
    (acc, item) => (acc as number) + item.weight,
    (acc) => acc > objective,
    0
  )?.item
}

export const map = <T>(i: number, func: (i: number) => T) => {
  const arr = []
  for (let index = 0; index < i; index++) {
    arr.push(func(index))
  }
  return arr
}

export const el = (id: string) => {
  return document.getElementById(id)
}

export const is = (element: any) => element !== undefined

export const adaptObject = (object: Record<string, any>, target: Record<string, any>, defaultValue?: any) => {
  var newObject = {} as Record<string, any>
  Object.keys(target).forEach(key => newObject[key] = object[key] ??= defaultValue)
  return newObject
}
