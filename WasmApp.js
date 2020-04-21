'use strict';

import WasmLoader from './WasmLoader.js';
import { WasmInt32Array, WasmInt64Array, WasmFloat32Array, WasmFloat64Array } from './TypedArrays.js';

const BYTES_PER_PAGE = 65_536;

export default class WasmApp {

  #wasmLoader = new WasmLoader();

  #filename;

  #memory;
  #usedMemory = 0;
  #availableMemory = BYTES_PER_PAGE;
  #functions;

  #minPages;
  #maxPages;

  constructor(filename, minPages, maxPages) {
    this.#filename = filename;
    this.#minPages = minPages;
    this.#maxPages = maxPages;
  }

  async init() {
    ({ functions: this.#functions, memory: this.#memory, minPages: this.#minPages, maxPages: this.#maxPages } = await this.#wasmLoader.loadWasm(this.#filename, this.#minPages, this.#maxPages));
  }

  get functions() {
    return this.#functions;
  }

  #manageMemory = memoryToBeUsed => {
    if (!this.#minPages && !this.#maxPages) { return }
    this.#usedMemory += memoryToBeUsed;
    while (this.#usedMemory > this.#availableMemory) {
      console.warn('Adding page to wasm app memory. All its arrays will be invalidated.');
      this.#memory.grow(1);
      this.#availableMemory += BYTES_PER_PAGE;
    }
  }

  newArray(length, type) {
    let array;
    switch (type) {
      case 'i32':
        const memoryToBeUsed = length * WasmInt32Array.BYTES_PER_ELEMENT;
        this.#manageMemory(memoryToBeUsed);
        array = new WasmInt32Array(this.#memory.buffer, this.#usedMemory - memoryToBeUsed, length);
        return array;
        break;
      case 'i64':
        array = new WasmInt64Array(this.#memory.buffer, this.#usedMemory, length);
        this.#usedMemory += (length * WasmInt64Array.BYTES_PER_ELEMENT);
        return array;
        break;
      case 'f32':
        array = new WasmFloat32Array(this.#memory.buffer, this.#usedMemory, length);
        this.#usedMemory += (length * WasmInt32Array.BYTES_PER_ELEMENT);
        return array;
        break;
      case 'f64':
        array = new WasmFloat64Array(this.#memory.buffer, this.#usedMemory, length);
        this.#usedMemory += (length * WasmFloat64Array.BYTES_PER_ELEMENT);
        return array;
        break;
      default:
        throw new Error(`"${type}" is not a valid array type.`);
        break;
    }
  }

}