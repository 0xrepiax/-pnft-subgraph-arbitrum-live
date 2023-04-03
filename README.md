# pnft-protocol

### 1. Init 

graph init --product hosted-service  pnft-exchange/pnft-subgraph

### 2. Add contract 

graph add 0x8299F2515c997639473e1286b1c69A1baCD1281f --contract-name Exchange --abi  Exchange.json

### 3. Deploy

yarn deploy

