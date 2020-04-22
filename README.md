# WasmSuperGlue

A minimal JavaScript-WebAssembly interface.

## Examples

First step:

```javascript
const app = new WasmApp('app.wasm');
await app.init();
```

Create an array of 100 32-bit integers shared with both JavaScript and WebAssembly:

```javascript
app.arrays.myArray = app.newArray(100, 'i32');
```

Pass the array to your Wasm "i32Fill" function, which fills it with the number 1337:

```javascript
app.functions.i32Fill(app.arrays.myArray.pointer, app.arrays.myArray.length, 1337);
```

Set the first value of the same array to 2003, in JavaScript:

```javascript
app.arrays.myArray[0] = 2003; // Always access your arrays this way, via the .arrays property
```

Pass a number to Wasm to perform a custom compiled calculation and recieve the result:

```javascript
const myNumber = app.functions.f64myCustomFunction(100);
console.log(myNumber); // 200.75075075075074
```