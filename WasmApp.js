'use strict';

import WasmLoader from './WasmLoader.js';
import { WasmInt32Array, WasmInt64Array, WasmFloat32Array, WasmFloat64Array } from './TypedArrays.js';

// 64 kibibytes (KB or KiB), not to be confused with kilobytes (kB).
const BYTES_PER_PAGE = 65_536;

export default class WasmApp {

  #wasmLoader = new WasmLoader();

  #filename;

  #memory;
  #usedMemory = 0;
  #availableMemory;
  #functions;

  #minPages;
  #maxPages;

  #arrays = {};

  /**
   * @constructor Constructs a new Wasm app. The method .init() must be called before using its functions or arrays. Functions are accessed via the .functions property. Arrays are created via the .newArray() method, and must be assigned to a property of the .arrays property and accessed from there. For example, myApp.arrays.myArray = myApp.newArray(10, 'i32'); myApp.arrays.myArray[0] = 3.14. Otherwise when memory limit is reached and then grown, you will be using a reference to an expired array whose buffer has become detached.
   * @param {string} filename - The name of the Wasm binary.
   * @param {number} [minPages] - Initial memory in pages (64 kibibytes per page). Specify this and the next parameter ONLY if your binary was compiled with the "-Wl,--import-memory" flag.
   * @param {number} [maxPages] - Maximum memory in pages.
   */
  constructor(filename, minPages, maxPages) {
    this.#filename = filename;
    this.#minPages = minPages;
    this.#maxPages = maxPages;
  }

  /**
   * Must be called before the Wasm app is used.
   */
  async init() {
    ({ functions: this.#functions, memory: this.#memory, minPages: this.#minPages, maxPages: this.#maxPages } = await this.#wasmLoader.loadWasm(this.#filename, this.#minPages, this.#maxPages));
    this.#availableMemory = (this.#minPages || 1) * BYTES_PER_PAGE;
  }

  get functions() {
    return this.#functions;
  }

  get arrays() {
    return this.#arrays;
  }

  /** 
   * Creates a new typed array (more like a view) inside the Wasm memory. It has a .pointer property for interfacing with Wasm.
   * @param {number} length - The length of the array.
   * @param {string} type - The type of the array (i32, i64, f32, or f64).
   * @returns {TypedArray} 
   */
  newArray(length, type) {
    let array;
    let memoryToBeUsed;
    switch (type) {
      case 'i32':
        memoryToBeUsed = length * WasmInt32Array.BYTES_PER_ELEMENT;
        this.#manageMemory(memoryToBeUsed);
        array = new WasmInt32Array(this.#memory.buffer, this.#usedMemory - memoryToBeUsed, length);
        return array;
        break;
      case 'i64':
        throw ('JavaScript does not yet support i64!');
        memoryToBeUsed = length * WasmInt64Array.BYTES_PER_ELEMENT;
        this.#manageMemory(memoryToBeUsed);
        array = new WasmInt64Array(this.#memory.buffer, this.#usedMemory - memoryToBeUsed, length);
        return array;
        break;
      case 'f32':
        memoryToBeUsed = length * WasmFloat32Array.BYTES_PER_ELEMENT;
        this.#manageMemory(memoryToBeUsed);
        array = new WasmFloat32Array(this.#memory.buffer, this.#usedMemory - memoryToBeUsed, length);
        return array;
        break;
      case 'f64':
        memoryToBeUsed = length * WasmFloat64Array.BYTES_PER_ELEMENT;
        this.#manageMemory(memoryToBeUsed);
        array = new WasmFloat64Array(this.#memory.buffer, this.#usedMemory - memoryToBeUsed, length);
        return array;
        break;
      default:
        throw (`<<${type}>> is not a valid array type.`);
        break;
    }
  }

  /** Replaces array references with references to new arrays not detached from the Wasm memory buffer.
   */
  #refreshArrays = () => {
    for (const [key, array] of Object.entries(this.#arrays)) {
      array.WARNING = 'This is an expired reference to the actual array, which must now be accessed via the <<arrays>> property of the associated wasm app.';
      switch (array.constructor.name) {
        case 'WasmInt32Array':
          this.#arrays[key] = new WasmInt32Array(this.#memory.buffer, array.bufferIndex, array.length);
          break;
        case 'WasmInt64Array':
          this.#arrays[key] = new WasmInt64Array(this.#memory.buffer, array.bufferIndex, array.length);
          break;
        case 'WasmFloat32Array':
          this.#arrays[key] = new WasmFloat32Array(this.#memory.buffer, array.bufferIndex, array.length);
          break;
        case 'WasmFloat64Array':
          this.#arrays[key] = new WasmFloat64Array(this.#memory.buffer, array.bufferIndex, array.length);
          break;
      }
    }
  }

  /** Checks if memory is available for a requested array.
   * If not, the memory will be grown.
   * @param {number} memoryToBeUsed - The memory, in bytes, that the most recently requested newArray() call will require.
   */
  #manageMemory = memoryToBeUsed => {
    this.#usedMemory += memoryToBeUsed;
    if (!this.#minPages) { return }
    while (this.#usedMemory > this.#availableMemory) {
      console.warn(`Need ${this.#usedMemory.toLocaleString()} bytes but only ${this.#availableMemory.toLocaleString()} are available.  Growing ${BYTES_PER_PAGE.toLocaleString()} bytes.`);
      this.#memory.grow(1);
      this.#availableMemory += BYTES_PER_PAGE;
      this.#refreshArrays();
    }
  }

}