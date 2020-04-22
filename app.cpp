/** TO START WITH 1 PAGE AND GROW VIA JAVASCRIPT COMMAND TO 2 */
// emcc 
// -Os (max optimization)
// -s INITIAL_MEMORY=64kb (64kb per page)
// -s MAXIMUM_MEMORY=128kb 
// -s ALLOW_MEMORY_GROWTH
// -s TOTAL_STACK=0kb 
// -s STANDALONE_WASM (don't create emscripten "glue" stuff)
// -s EXPORTED_FUNCTIONS="['_f64myCustomFunction', '_i32Fill', '_i64Fill', '_f32Fill', '_f64Fill']" 
// -Wl,--no-entry (prevents creation of a useless "start()" function
// -Wl,--import-memory (specifies that memory will be imported from JavaScript)
// "app.cpp" 
// -o "app.wasm" 

/** TO START WITH 4 PAGES WITHOUT NEEDING TO GROW OR IMPORT FROM JAVASCRIPT */
// emcc 
// -Os 
// -s INITIAL_MEMORY=128kb 
// -s MAXIMUM_MEMORY=128kb 
// -s ALLOW_MEMORY_GROWTH=0
// -s TOTAL_STACK=0kb 
// -s STANDALONE_WASM 
// -s EXPORTED_FUNCTIONS="['f64myCustomFunction', '_i32Fill', '_i64Fill', '_f32Fill', '_f64Fill']" 
// -Wl,--no-entry 
// "app.cpp" 
// -o "app.wasm"


typedef long int i32;
typedef long long int i64;
typedef float f32;
typedef double f64;

extern "C" {
  f64 f64myCustomFunction(f64 number) {
    return number * 1337 / 666;
  }

  // The asterisk before array (*array) means it's the location (pointer) of the first index of the array inside Wasm memory.
  void i32Fill(i32 *array, int length, i32 value) {
    for (int i = 0; i < length; i++) { 
      array[i] = value;
    }
  }

  void i64Fill(i64 *array, int length, i64 value) {
    for (int i = 0; i < length; i++) { 
      array[i] = value;
    }
  }

  void f32Fill(f32 *array, int length, f32 value) {
    for (int i = 0; i < length; i++) { 
      array[i] = value;
    }
  }

  void f64Fill(f64 *array, int length, f64 value) {
    for (int i = 0; i < length; i++) { 
      array[i] = value;
    }
  }
}