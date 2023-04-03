Setup

graph init --product hosted-service 0xrepiax/test6

Add contract

graph add 0x743853e5D6e7dA53e3191fD7F42cBE315E247dD4 --contract-name AccountBalance --abi /Users/tuan/PycharmProjects/smartcontract1/artifacts/contracts/AccountBalance.sol/AccountBalance.json

graph add 0x8299F2515c997639473e1286b1c69A1baCD1281f --contract-name Exchange --abi /Users/tuan/PycharmProjects/smartcontract1/artifacts/contracts/Exchange.sol/Exchange.json

Deploy

yarn deploy

graph deploy --product hosted-service --network-file /Users/tuan/pnft-subgraph/networkstes.json 0xrepiax/test3
