'use strict';

export default class WasmLoader {

  /** 
   * Must be called after instance creation.
   * @param {string} filename - Name of the Wasm binary.
   * @param {number} [minPages] - Initial memory in pages (64 kibibytes per page).
   * @param {number} [maxPages] - Maximum memory in pages.
   * @returns {object} - An object with the Wasm raw memory, functions, and number of initial and maximum pages if specified.
   */
  async loadWasm(filename, minPages, maxPages) {
    const file = await this.#fetchWasm(filename);
    if (minPages && maxPages) {
      return await this.#importMemoryIntoWasm(file, minPages, maxPages);
    } else {
      return await this.#exportMemoryFromWasm(file);
    }
  }

  /**
   * Loads a Wasm binary file as a buffer.
   * @param {string} - Name of the Wasm binary.
   * @returns {buffer} - The wasm binary as a buffer.
   */
  #fetchWasm = async filename => {
    const response = await fetch(filename);
    const file = await response.arrayBuffer();
    return file;
  }

  /**
   * Creates a new Wasm module which was compiled to manage its own memory.
   * @param {buffer} file - A Wasm binary.
   * @returns {object} - An object with the Wasm memory and functions.
   */
  #exportMemoryFromWasm = async file => {
    const wasm = await WebAssembly.instantiate(file);
    const { memory, ...functions } = wasm.instance.exports;
    return { memory, functions };
  }

  /**
   * Creates a new Wasm module whose memory growth will be managed via JavaScript.
   * @param {buffer} file - A Wasm binary.
   * @param {number} minPages - Initial memory in pages (64 kibibytes per page).
   * @param {number} maxPages - Maximum memory in pages.
   * @returns {object} - An object with the Wasm memory, functions, initial pages number, and maximum pages number.
   */
  #importMemoryIntoWasm = async (file, minPages, maxPages) => {
    const memory = new WebAssembly.Memory({
      initial: minPages,
      maximum: maxPages
    });
    const imports = { env: { memory } };
    const wasm = await WebAssembly.instantiate(file, imports);
    const { ...functions } = wasm.instance.exports;
    return { memory, functions, minPages, maxPages };
  }

}