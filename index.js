'use strict';

import WasmApp from './WasmApp.js';

(async () => {
  const app = new WasmApp('app.wasm', 1, 2);
  await app.init();

  console.log(app);

  /*

  const i32arr = app.newArray(4, 'i32');
  app.functions.i32Fill(i32arr.pointer, i32arr.length / 2, 1337);

  const f32arr = app.newArray(4, 'f32');
  app.functions.f32Fill(f32arr.pointer, f32arr.length / 2, 66.6);

  const f64arr = app.newArray(4, 'f64');
  app.functions.f64Fill(f64arr.pointer, f64arr.length / 2, 200.3);

  console.log(i32arr);
  console.log(f32arr);
  console.log(f64arr);
  */const BYTES_PER_PAGE = 65_536;

  const yeet = app.newArray((65_536 / 4), 'i32');
  app.functions.i32Fill(yeet.pointer, yeet.length, 666);
  console.log(yeet);

  const yeet2 = app.newArray((65_536 / 4), 'i32');
  app.functions.i32Fill(yeet2.pointer, yeet2.length, 1337);
  console.log(yeet2);
})();
