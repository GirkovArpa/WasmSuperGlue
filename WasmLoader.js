'use strict';

export default class WasmLoader {

  async loadWasm(filename, minPages, maxPages) {
    const file = await this.#fetchWasm(filename);
    if (minPages && maxPages) {
      return await this.#importMemoryIntoWasm(file, minPages, maxPages);
    } else {
      return await this.#exportMemoryFromWasm(file);
    }
  }

  #fetchWasm = async filename => {
    const response = await fetch(filename);
    const file = await response.arrayBuffer();
    return file;
  }

  #exportMemoryFromWasm = async file => {
    const wasm = await WebAssembly.instantiate(file);
    const { memory, ...functions } = wasm.instance.exports;
    return { memory, functions };
  }

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