import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AccountBalanceChanged,
  ClearingHouseChanged,
  FundingUpdated,
  MaxTickCrossedWithinBlockChanged,
  ExchangeOwnershipTransferred
} from "../generated/Exchange/Exchange"

export function createAccountBalanceChangedEvent(
  accountBalance: Address
): AccountBalanceChanged {
  let accountBalanceChangedEvent = changetype<AccountBalanceChanged>(
    newMockEvent()
  )

  accountBalanceChangedEvent.parameters = new Array()

  accountBalanceChangedEvent.parameters.push(
    new ethereum.EventParam(
      "accountBalance",
      ethereum.Value.fromAddress(accountBalance)
    )
  )

  return accountBalanceChangedEvent
}

export function createClearingHouseChangedEvent(
  clearingHouse: Address
): ClearingHouseChanged {
  let clearingHouseChangedEvent = changetype<ClearingHouseChanged>(
    newMockEvent()
  )

  clearingHouseChangedEvent.parameters = new Array()

  clearingHouseChangedEvent.parameters.push(
    new ethereum.EventParam(
      "clearingHouse",
      ethereum.Value.fromAddress(clearingHouse)
    )
  )

  return clearingHouseChangedEvent
}

export function createFundingUpdatedEvent(
  baseToken: Address,
  markTwap: BigInt,
  indexTwap: BigInt,
  longPositionSize: BigInt,
  shortPositionSize: BigInt
): FundingUpdated {
  let fundingUpdatedEvent = changetype<FundingUpdated>(newMockEvent())

  fundingUpdatedEvent.parameters = new Array()

  fundingUpdatedEvent.parameters.push(
    new ethereum.EventParam("baseToken", ethereum.Value.fromAddress(baseToken))
  )
  fundingUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "markTwap",
      ethereum.Value.fromUnsignedBigInt(markTwap)
    )
  )
  fundingUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "indexTwap",
      ethereum.Value.fromUnsignedBigInt(indexTwap)
    )
  )
  fundingUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "longPositionSize",
      ethereum.Value.fromUnsignedBigInt(longPositionSize)
    )
  )
  fundingUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "shortPositionSize",
      ethereum.Value.fromUnsignedBigInt(shortPositionSize)
    )
  )

  return fundingUpdatedEvent
}

export function createMaxTickCrossedWithinBlockChangedEvent(
  baseToken: Address,
  maxTickCrossedWithinBlock: i32
): MaxTickCrossedWithinBlockChanged {
  let maxTickCrossedWithinBlockChangedEvent = changetype<
    MaxTickCrossedWithinBlockChanged
  >(newMockEvent())

  maxTickCrossedWithinBlockChangedEvent.parameters = new Array()

  maxTickCrossedWithinBlockChangedEvent.parameters.push(
    new ethereum.EventParam("baseToken", ethereum.Value.fromAddress(baseToken))
  )
  maxTickCrossedWithinBlockChangedEvent.parameters.push(
    new ethereum.EventParam(
      "maxTickCrossedWithinBlock",
      ethereum.Value.fromUnsignedBigInt(
        BigInt.fromI32(maxTickCrossedWithinBlock)
      )
    )
  )

  return maxTickCrossedWithinBlockChangedEvent
}

export function createExchangeOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): ExchangeOwnershipTransferred {
  let exchangeOwnershipTransferredEvent = changetype<
    ExchangeOwnershipTransferred
  >(newMockEvent())

  exchangeOwnershipTransferredEvent.parameters = new Array()

  exchangeOwnershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  exchangeOwnershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return exchangeOwnershipTransferredEvent
}
