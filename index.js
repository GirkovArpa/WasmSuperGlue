'use strict';

import WasmApp from './WasmApp.js';

(async () => {
  const app = new WasmApp('app.wasm', 1, 4);
  await app.init();

  const BYTES_PER_PAGE = 65_536;

  console.log(app);

  app.arrays.yeet = app.newArray((65_536 / 4), 'i32');
  app.functions.i32Fill(app.arrays.yeet.pointer, app.arrays.yeet.length, 666);
  console.log(app.arrays.yeet);

  app.arrays.yeet2 = app.newArray((65_536 / 4), 'i32');
  app.functions.i32Fill(app.arrays.yeet2.pointer, app.arrays.yeet2.length, 1337);
  console.log(app.arrays.yeet2);

  app.arrays.yeet3 = app.newArray((65_536 / 4), 'f32');
  app.functions.f32Fill(app.arrays.yeet3.pointer, app.arrays.yeet3.length, 123.1);
  console.log(app.arrays.yeet3);

  app.arrays.yeet4 = app.newArray((65_536 / 8), 'f64');
  app.functions.f64Fill(app.arrays.yeet4.pointer, app.arrays.yeet4.length, 666.1337);
  console.log(app.arrays.yeet4);
})();
