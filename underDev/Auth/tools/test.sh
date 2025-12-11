#!/bin/sh
set -e
source ~/Desktop/GitHub/tools/common.sh
prj="$lib/underDev/Auth"

cd $prj
npx vitest run "$prj/__tests__/b0004.test.mjs"
cd tools/

#node --experimental-vm-modules "$prj/node_modules/jest/bin/jest.js" "$prj/__tests__/b0004.mjs"
#node --experimental-vm-modules ../node_modules/jest/bin/jest.js ../__tests__/b0004.mjs
#node --experimental-vm-modules ../node_modules/jest/bin/jest.js --runTestsByPath "../__tests__/b0003.mjs"
#node --experimental-vm-modules ../node_modules/jest/bin/jest.js ../__tests__/b0002.mjs
