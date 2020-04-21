'use strict';

export { WasmInt32Array, WasmInt64Array, WasmFloat32Array, WasmFloat64Array };
  
const i32_MAX = 2_147_483_647;
const f32_MAX = 2_147_483_647;
const i64_MAX = 9_223_372_036_854_775_807n;
const f64_MAX = 9_007_199_254_740_993;

class WasmInt32Array extends Int32Array {
  constructor(buffer, bufferIndex, length) {
    super(buffer, bufferIndex, length);
  }
  get pointer() {
    return this.byteOffset;
  }
}

class WasmInt64Array extends BigInt64Array {
  constructor(buffer, bufferIndex, length) {
    super(buffer, bufferIndex, length);
  }
  get pointer() {
    return this.byteOffset;
  }
}

class WasmFloat32Array extends Float32Array {
  constructor(buffer, bufferIndex, length) {
    super(buffer, bufferIndex, length);
  }
  get pointer() {
    return this.byteOffset;
  }
}

class WasmFloat64Array extends Float64Array {
  constructor(buffer, bufferIndex, length) {
    super(buffer, bufferIndex, length);
  }
  get pointer() {
    return this.byteOffset;
  }
}