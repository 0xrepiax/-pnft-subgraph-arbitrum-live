import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { DelegateApprovalChanged } from "../generated/schema"
import { DelegateApprovalChanged as DelegateApprovalChangedEvent } from "../generated/ClearingHouse/ClearingHouse"
import { handleDelegateApprovalChanged } from "../src/clearing-house"
import { createDelegateApprovalChangedEvent } from "./clearing-house-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let delegateApproval = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newDelegateApprovalChangedEvent = createDelegateApprovalChangedEvent(
      delegateApproval
    )
    handleDelegateApprovalChanged(newDelegateApprovalChangedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("DelegateApprovalChanged created and stored", () => {
    assert.entityCount("DelegateApprovalChanged", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "DelegateApprovalChanged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "delegateApproval",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
