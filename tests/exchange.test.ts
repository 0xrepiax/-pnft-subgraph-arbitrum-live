import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { AccountBalanceChanged } from "../generated/schema"
import { AccountBalanceChanged as AccountBalanceChangedEvent } from "../generated/Exchange/Exchange"
import { handleAccountBalanceChanged } from "../src/exchange"
import { createAccountBalanceChangedEvent } from "./exchange-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let accountBalance = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newAccountBalanceChangedEvent = createAccountBalanceChangedEvent(
      accountBalance
    )
    handleAccountBalanceChanged(newAccountBalanceChangedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AccountBalanceChanged created and stored", () => {
    assert.entityCount("AccountBalanceChanged", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AccountBalanceChanged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "accountBalance",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
