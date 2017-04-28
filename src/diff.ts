import { VNode, Patchs, Index, Attr } from './model'
import * as util from './util'

export function diff (oldNode: VNode, newNode: VNode): Patchs {
    const patch: Patchs = {}
    const idx: Index = { idx: -1 }

    dfs(oldNode, newNode, idx, patch)

    return patch
}

function dfs (oldNode: VNode, newNode: VNode, idx: Index, patch: Patchs) {
    idx.idx++
    const currentPatch = patch[idx.idx] = []
    // text node
    if (util.isString(oldNode) && util.isString(newNode)) {
        if (oldNode !== newNode) {
            currentPatch.push({
                index: idx.idx,
                type: 'TEXT',
                payload: newNode
            })
        }
        return
    }

    // same vnode
    if (!sameVNode(oldNode, newNode)) {
        currentPatch.push({
            index: idx.idx,
            type: 'REPLACE',
            payload: newNode
        })
        return
    }

    // same props
    if (!sameProps(oldNode.attr, newNode.attr)) {
        currentPatch.push({
            index: idx.idx,
            type: 'PROPS',
            payload: newNode.attr
        })
    }

    // textContent
    if (oldNode.text !== newNode.text) {
        currentPatch.push({
            index: idx.idx,
            type: 'TEXT',
            payload: newNode.text
        })
    }

    const childDiff = diffList(oldNode.children, newNode.children, 'key')

    if (childDiff.moves.length) {
        currentPatch.push({
            index: idx.idx,
            type: 'REORDER',
            payload: childDiff.moves
        })
    }

    for (let i = 0; i < childDiff.children.length; i++) {
        const oldChild = oldNode.children[i] as VNode
        const child = childDiff.children[i]

        if (!child) {
            idx.idx++
            patch[idx.idx] = []
            continue
        }
        dfs(oldChild, child, idx, patch)
    }
}

function sameVNode (node1: VNode, node2: VNode) {
    return node1.sel === node2.sel && node1.key === node2.key
}

// TODO: rewrite
function sameProps (attr1: Attr, attr2: Attr) {
    for (let key of Object.keys(attr2)) {
        if (!attr1[key] || attr1[key] !== attr2[key]) {
            return false
        }
    }
    for (let key of Object.keys(attr1)) {
        if (!attr2[key]) {
            return false
        }
    }
    return true
}

// TODO: rewrite
function diffList (oldList, newList, key) {
  var oldMap = makeKeyIndexAndFree(oldList, key)
  var newMap = makeKeyIndexAndFree(newList, key)

  var newFree = newMap.free

  var oldKeyIndex = oldMap.keyIndex
  var newKeyIndex = newMap.keyIndex

  var moves = []

  // a simulate list to manipulate
  var children = []
  var i = 0
  var item
  var itemKey
  var freeIndex = 0

  // fist pass to check item in old list: if it's removed or not
  while (i < oldList.length) {
    item = oldList[i]
    itemKey = getItemKey(item, key)
    if (itemKey) {
      if (!newKeyIndex.hasOwnProperty(itemKey)) {
        children.push(null)
      } else {
        var newItemIndex = newKeyIndex[itemKey]
        children.push(newList[newItemIndex])
      }
    } else {
      var freeItem = newFree[freeIndex++]
      children.push(freeItem || null)
    }
    i++
  }

  var simulateList = children.slice(0)

  // remove items no longer exist
  i = 0
  while (i < simulateList.length) {
    if (simulateList[i] === null) {
      remove(i)
      removeSimulate(i)
    } else {
      i++
    }
  }

  // i is cursor pointing to a item in new list
  // j is cursor pointing to a item in simulateList
  var j = i = 0
  while (i < newList.length) {
    item = newList[i]
    itemKey = getItemKey(item, key)

    var simulateItem = simulateList[j]
    var simulateItemKey = getItemKey(simulateItem, key)

    if (simulateItem) {
      if (itemKey === simulateItemKey) {
        j++
      } else {
        // new item, just inesrt it
        if (!oldKeyIndex.hasOwnProperty(itemKey)) {
          insert(i, item)
        } else {
          // if remove current simulateItem make item in right place
          // then just remove it
          var nextItemKey = getItemKey(simulateList[j + 1], key)
          if (nextItemKey === itemKey) {
            remove(i)
            removeSimulate(j)
            j++ // after removing, current j is right, just jump to next one
          } else {
            // else insert item
            insert(i, item)
          }
        }
      }
    } else {
      insert(i, item)
    }

    i++
  }

  function remove (index) {
    var move = {index: index, type: 0}
    moves.push(move)
  }

  function insert (index, item) {
    var move = {index: index, item: item, type: 1}
    moves.push(move)
  }

  function removeSimulate (index) {
    simulateList.splice(index, 1)
  }

  return {
    moves: moves,
    children: children
  }
}

/**
 * Convert list to key-item keyIndex object.
 * @param {Array} list
 * @param {String|Function} key
 */
function makeKeyIndexAndFree (list, key) {
  var keyIndex = {}
  var free = []
  for (var i = 0, len = list.length; i < len; i++) {
    var item = list[i]
    var itemKey = getItemKey(item, key)
    if (itemKey) {
      keyIndex[itemKey] = i
    } else {
      free.push(item)
    }
  }
  return {
    keyIndex: keyIndex,
    free: free
  }
}

function getItemKey (item, key) {
  if (!item || !key) return void 666
  return typeof key === 'string'
    ? item[key]
    : key(item)
}
