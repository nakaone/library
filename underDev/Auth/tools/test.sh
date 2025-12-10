#!/bin/zsh
node --experimental-vm-modules ../node_modules/jest/bin/jest.js ../__tests__/b0002.mjs
#node --experimental-vm-modules ../node_modules/jest/bin/jest.js "$@"

# __tests__ 内の全テストを実行
#node --experimental-vm-modules ../node_modules/jest/bin/jest.js ../__tests__ "$@"

#npx jest ../__tests__/htmlButton.test.js
