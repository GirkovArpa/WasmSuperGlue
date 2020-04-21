// emcc 
// -Os 
// -s INITIAL_MEMORY=64kb 
// -s MAXIMUM_MEMORY=128kb 
// -s ALLOW_MEMORY_GROWTH
// -s TOTAL_STACK=0kb 
// -s STANDALONE_WASM 
// -s EXPORTED_FUNCTIONS="['_i32Fill', '_i64Fill', '_f32Fill', '_f64Fill']" 
// -Wl,--no-entry 
// -Wl,--import-memory 
// "app.cpp" 
// -o "app.wasm"

typedef long int i32;
typedef long long int i64;
typedef float f32;
typedef double f64;

extern "C" {
  void i32Fill(i32 *array, i32 length, i32 value) {
    for (int i = 0; i < length; i++) { 
      array[i] = value;
    }
  }

  void i64Fill(i64 *array, i32 length, i64 value) {
    for (int i = 0; i < length; i++) { 
      array[i] = value;
    }
  }

  void f32Fill(f32 *array, i32 length, f32 value) {
    for (int i = 0; i < length; i++) { 
      array[i] = value;
    }
  }

  void f64Fill(f64 *array, i32 length, f64 value) {
    for (int i = 0; i < length; i++) { 
      array[i] = value;
    }
  }
}