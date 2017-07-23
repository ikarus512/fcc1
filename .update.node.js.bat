rem https://nodejs.org
wget https://nodejs.org/download/release/latest-v6.x/win-x64/node.exe -O $(which node).exe

rem https://docs.npmjs.com
npm i -g npm

npm outdated -g --depth=0
npm cache clean
npm update -g

npm outdated
npm update
