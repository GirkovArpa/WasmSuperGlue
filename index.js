'use strict';

import WasmApp from './WasmApp.js';

(async () => {
  const app = new WasmApp('app.wasm');
  await app.init();

  const myNumber = app.functions.f64myCustomFunction(100);
  console.log(myNumber); // 200.75075075075074

  app.arrays.myArray = app.newArray(100, 'i32'); // Arrays should always be declared and accessed at the .arrays property!
  console.log(app.arrays.myArray); // WasmInt32Array(100) [0, 0, 0, 97 more items...]
  app.functions.i32Fill(app.arrays.myArray.pointer, app.arrays.myArray.length, 1337);
  console.log(app.arrays.myArray); // WasmInt32Array(100) [1337, 1337, 1337, 97 more items ...]

  app.arrays.myArray[12] = 34; // Remember to access arrays at the .arrays property!
  console.log(app.arrays.myArray[12]); // 34
})();
