'use strict';

import WasmLoader from './WasmLoader.js';
import { WasmInt32Array, WasmInt64Array, WasmFloat32Array, WasmFloat64Array } from './TypedArrays.js';

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

  constructor(filename, minPages, maxPages) {
    this.#filename = filename;
    this.#minPages = minPages;
    this.#maxPages = maxPages;
  }

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