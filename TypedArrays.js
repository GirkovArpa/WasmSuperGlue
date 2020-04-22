'use strict';

export { WasmInt32Array, WasmInt64Array, WasmFloat32Array, WasmFloat64Array };

/** 
 * Extends Int32Array in order to preserve the original length and buffer index when the buffer becomes detached during a memory.grow() operation.
 * Also allows for the more intuitive 'pointer' alias of 'byteOffset'.
 * @param {buffer} buffer - The raw Wasm memory.
 * @param {number} bufferIndex - The location in the Wasm memory, in bytes, where this array begins.
 * @param {number} length - The length of this array.
 */
class WasmInt32Array extends Int32Array {
  #length;
  #bufferIndex;
  constructor(buffer, bufferIndex, length) {
    super(buffer, bufferIndex, length);
    this.#length = length;
    this.#bufferIndex = bufferIndex;
  }
  get pointer() {
    return this.bufferIndex;
  }
  get length() {
    return this.#length;
  }
  get bufferIndex() {
    return this.#bufferIndex;
  }
}

/** 
 * Extends BigInt64Array in order to preserve the original length and buffer index when the buffer becomes detached during a memory.grow() operation.
 * Also allows for the more intuitive 'pointer' alias of 'byteOffset'.
 * @param {buffer} buffer - The raw Wasm memory.
 * @param {number} bufferIndex - The location in the Wasm memory, in bytes, where this array begins.
 * @param {number} length - The length of this array.
 */
class WasmInt64Array extends BigInt64Array {
  #length;
  #bufferIndex;
  constructor(buffer, bufferIndex, length) {
    super(buffer, bufferIndex, length);
    this.#length = length;
    this.#bufferIndex = bufferIndex;
  }
  get pointer() {
    return this.bufferIndex;
  }
  get length() {
    return this.#length;
  }
  get bufferIndex() {
    return this.#bufferIndex;
  }
}

/** 
 * Extends Float32Array in order to preserve the original length and buffer index when the buffer becomes detached during a memory.grow() operation.
 * Also allows for the more intuitive 'pointer' alias of 'byteOffset'.
 * @param {buffer} buffer - The raw Wasm memory.
 * @param {number} bufferIndex - The location in the Wasm memory, in bytes, where this array begins.
 * @param {number} length - The length of this array.
 */
class WasmFloat32Array extends Float32Array {
  #length;
  #bufferIndex;
  constructor(buffer, bufferIndex, length) {
    super(buffer, bufferIndex, length);
    this.#length = length;
    this.#bufferIndex = bufferIndex;
  }
  get pointer() {
    return this.bufferIndex;
  }
  get length() {
    return this.#length;
  }
  get bufferIndex() {
    return this.#bufferIndex;
  }
}

/** 
 * Extends Float64Array in order to preserve the original length and buffer index when the buffer becomes detached during a memory.grow() operation.
 * Also allows for the more intuitive 'pointer' alias of 'byteOffset'.
 * @param {buffer} buffer - The raw Wasm memory.
 * @param {number} bufferIndex - The location in the Wasm memory, in bytes, where this array begins.
 * @param {number} length - The length of this array.
 */
class WasmFloat64Array extends Float64Array {
  #length;
  #bufferIndex;
  constructor(buffer, bufferIndex, length) {
    super(buffer, bufferIndex, length);
    this.#length = length;
    this.#bufferIndex = bufferIndex;
  }
  get pointer() {
    return this.bufferIndex;
  }
  get length() {
    return this.#length;
  }
  get bufferIndex() {
    return this.#bufferIndex;
  }
}