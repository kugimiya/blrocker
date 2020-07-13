const { BLRocker } = require('./dist/index');

var expired = true;

const blrocker = new BLRocker(
  function resolver() {
    console.log('resolver started');
    return new Promise((resolve) => {
      setTimeout(() => {
        expired = false;
        resolve()
      }, 2000);
    });
  },
  function detector(data) {
    return (data.foo !== undefined && data.foo === 'bar');
  }
);

blrocker.push(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('first fetch')
      resolve({ test: 'bar' })
    }, 1000);
  });
});

blrocker.push(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (expired) {
        console.log('second fetch, but session can be expired')
      } else {
        console.log('second fetch, session already refreshed')
      }
      resolve({ foo: expired ? 'bar' : '3000' })
    }, 500);
  });
});

blrocker.push(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('third fetch')
      resolve({ bar: 'foo' })
    }, 500);
  });
});

setTimeout(() => {
  blrocker.push(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('forth fetch')
        resolve({ bar: 'foo2' })
      }, 500);
    });
  });
}, 5000);