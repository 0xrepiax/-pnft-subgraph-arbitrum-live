import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  DelegateApprovalChanged,
  FundingPaymentSettled,
  LiquidityChanged,
  OwnershipTransferred,
  Paused,
  PlatformFundChanged,
  PositionChanged,
  PositionClosed,
  PositionLiquidated,
  ReferredPositionChanged,
  Repeg,
  TrustedForwarderChanged,
  TrustedForwarderUpdated,
  Unpaused
} from "../generated/ClearingHouse/ClearingHouse"

export function createDelegateApprovalChangedEvent(
  delegateApproval: Address
): DelegateApprovalChanged {
  let delegateApprovalChangedEvent = changetype<DelegateApprovalChanged>(
    newMockEvent()
  )

  delegateApprovalChangedEvent.parameters = new Array()

  delegateApprovalChangedEvent.parameters.push(
    new ethereum.EventParam(
      "delegateApproval",
      ethereum.Value.fromAddress(delegateApproval)
    )
  )

  return delegateApprovalChangedEvent
}

export function createFundingPaymentSettledEvent(
  trader: Address,
  baseToken: Address,
  fundingPayment: BigInt
): FundingPaymentSettled {
  let fundingPaymentSettledEvent = changetype<FundingPaymentSettled>(
    newMockEvent()
  )

  fundingPaymentSettledEvent.parameters = new Array()

  fundingPaymentSettledEvent.parameters.push(
    new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  )
  fundingPaymentSettledEvent.parameters.push(
    new ethereum.EventParam("baseToken", ethereum.Value.fromAddress(baseToken))
  )
  fundingPaymentSettledEvent.parameters.push(
    new ethereum.EventParam(
      "fundingPayment",
      ethereum.Value.fromSignedBigInt(fundingPayment)
    )
  )

  return fundingPaymentSettledEvent
}

export function createLiquidityChangedEvent(
  maker: Address,
  baseToken: Address,
  quoteToken: Address,
  lowerTick: i32,
  upperTick: i32,
  base: BigInt,
  quote: BigInt,
  liquidity: BigInt,
  quoteFee: BigInt
): LiquidityChanged {
  let liquidityChangedEvent = changetype<LiquidityChanged>(newMockEvent())

  liquidityChangedEvent.parameters = new Array()

  liquidityChangedEvent.parameters.push(
    new ethereum.EventParam("maker", ethereum.Value.fromAddress(maker))
  )
  liquidityChangedEvent.parameters.push(
    new ethereum.EventParam("baseToken", ethereum.Value.fromAddress(baseToken))
  )
  liquidityChangedEvent.parameters.push(
    new ethereum.EventParam(
      "quoteToken",
      ethereum.Value.fromAddress(quoteToken)
    )
  )
  liquidityChangedEvent.parameters.push(
    new ethereum.EventParam("lowerTick", ethereum.Value.fromI32(lowerTick))
  )
  liquidityChangedEvent.parameters.push(
    new ethereum.EventParam("upperTick", ethereum.Value.fromI32(upperTick))
  )
  liquidityChangedEvent.parameters.push(
    new ethereum.EventParam("base", ethereum.Value.fromSignedBigInt(base))
  )
  liquidityChangedEvent.parameters.push(
    new ethereum.EventParam("quote", ethereum.Value.fromSignedBigInt(quote))
  )
  liquidityChangedEvent.parameters.push(
    new ethereum.EventParam(
      "liquidity",
      ethereum.Value.fromSignedBigInt(liquidity)
    )
  )
  liquidityChangedEvent.parameters.push(
    new ethereum.EventParam(
      "quoteFee",
      ethereum.Value.fromUnsignedBigInt(quoteFee)
    )
  )

  return liquidityChangedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createPlatformFundChangedEvent(
  platformFundArg: Address
): PlatformFundChanged {
  let platformFundChangedEvent = changetype<PlatformFundChanged>(newMockEvent())

  platformFundChangedEvent.parameters = new Array()

  platformFundChangedEvent.parameters.push(
    new ethereum.EventParam(
      "platformFundArg",
      ethereum.Value.fromAddress(platformFundArg)
    )
  )

  return platformFundChangedEvent
}

export function createPositionChangedEvent(
  trader: Address,
  baseToken: Address,
  exchangedPositionSize: BigInt,
  exchangedPositionNotional: BigInt,
  fee: BigInt,
  openNotional: BigInt,
  realizedPnl: BigInt,
  sqrtPriceAfterX96: BigInt
): PositionChanged {
  let positionChangedEvent = changetype<PositionChanged>(newMockEvent())

  positionChangedEvent.parameters = new Array()

  positionChangedEvent.parameters.push(
    new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  )
  positionChangedEvent.parameters.push(
    new ethereum.EventParam("baseToken", ethereum.Value.fromAddress(baseToken))
  )
  positionChangedEvent.parameters.push(
    new ethereum.EventParam(
      "exchangedPositionSize",
      ethereum.Value.fromSignedBigInt(exchangedPositionSize)
    )
  )
  positionChangedEvent.parameters.push(
    new ethereum.EventParam(
      "exchangedPositionNotional",
      ethereum.Value.fromSignedBigInt(exchangedPositionNotional)
    )
  )
  positionChangedEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )
  positionChangedEvent.parameters.push(
    new ethereum.EventParam(
      "openNotional",
      ethereum.Value.fromSignedBigInt(openNotional)
    )
  )
  positionChangedEvent.parameters.push(
    new ethereum.EventParam(
      "realizedPnl",
      ethereum.Value.fromSignedBigInt(realizedPnl)
    )
  )
  positionChangedEvent.parameters.push(
    new ethereum.EventParam(
      "sqrtPriceAfterX96",
      ethereum.Value.fromUnsignedBigInt(sqrtPriceAfterX96)
    )
  )

  return positionChangedEvent
}

export function createPositionClosedEvent(
  trader: Address,
  baseToken: Address,
  closedPositionSize: BigInt,
  closedPositionNotional: BigInt,
  openNotional: BigInt,
  realizedPnl: BigInt,
  closedPrice: BigInt
): PositionClosed {
  let positionClosedEvent = changetype<PositionClosed>(newMockEvent())

  positionClosedEvent.parameters = new Array()

  positionClosedEvent.parameters.push(
    new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  )
  positionClosedEvent.parameters.push(
    new ethereum.EventParam("baseToken", ethereum.Value.fromAddress(baseToken))
  )
  positionClosedEvent.parameters.push(
    new ethereum.EventParam(
      "closedPositionSize",
      ethereum.Value.fromSignedBigInt(closedPositionSize)
    )
  )
  positionClosedEvent.parameters.push(
    new ethereum.EventParam(
      "closedPositionNotional",
      ethereum.Value.fromSignedBigInt(closedPositionNotional)
    )
  )
  positionClosedEvent.parameters.push(
    new ethereum.EventParam(
      "openNotional",
      ethereum.Value.fromSignedBigInt(openNotional)
    )
  )
  positionClosedEvent.parameters.push(
    new ethereum.EventParam(
      "realizedPnl",
      ethereum.Value.fromSignedBigInt(realizedPnl)
    )
  )
  positionClosedEvent.parameters.push(
    new ethereum.EventParam(
      "closedPrice",
      ethereum.Value.fromUnsignedBigInt(closedPrice)
    )
  )

  return positionClosedEvent
}

export function createPositionLiquidatedEvent(
  trader: Address,
  baseToken: Address,
  positionNotional: BigInt,
  positionSize: BigInt,
  liquidationFee: BigInt,
  liquidator: Address
): PositionLiquidated {
  let positionLiquidatedEvent = changetype<PositionLiquidated>(newMockEvent())

  positionLiquidatedEvent.parameters = new Array()

  positionLiquidatedEvent.parameters.push(
    new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  )
  positionLiquidatedEvent.parameters.push(
    new ethereum.EventParam("baseToken", ethereum.Value.fromAddress(baseToken))
  )
  positionLiquidatedEvent.parameters.push(
    new ethereum.EventParam(
      "positionNotional",
      ethereum.Value.fromUnsignedBigInt(positionNotional)
    )
  )
  positionLiquidatedEvent.parameters.push(
    new ethereum.EventParam(
      "positionSize",
      ethereum.Value.fromUnsignedBigInt(positionSize)
    )
  )
  positionLiquidatedEvent.parameters.push(
    new ethereum.EventParam(
      "liquidationFee",
      ethereum.Value.fromUnsignedBigInt(liquidationFee)
    )
  )
  positionLiquidatedEvent.parameters.push(
    new ethereum.EventParam(
      "liquidator",
      ethereum.Value.fromAddress(liquidator)
    )
  )

  return positionLiquidatedEvent
}

export function createReferredPositionChangedEvent(
  referralCode: Bytes
): ReferredPositionChanged {
  let referredPositionChangedEvent = changetype<ReferredPositionChanged>(
    newMockEvent()
  )

  referredPositionChangedEvent.parameters = new Array()

  referredPositionChangedEvent.parameters.push(
    new ethereum.EventParam(
      "referralCode",
      ethereum.Value.fromFixedBytes(referralCode)
    )
  )

  return referredPositionChangedEvent
}

export function createRepegEvent(
  oldMarkPrice: BigInt,
  newMarkPrice: BigInt
): Repeg {
  let repegEvent = changetype<Repeg>(newMockEvent())

  repegEvent.parameters = new Array()

  repegEvent.parameters.push(
    new ethereum.EventParam(
      "oldMarkPrice",
      ethereum.Value.fromUnsignedBigInt(oldMarkPrice)
    )
  )
  repegEvent.parameters.push(
    new ethereum.EventParam(
      "newMarkPrice",
      ethereum.Value.fromUnsignedBigInt(newMarkPrice)
    )
  )

  return repegEvent
}

export function createTrustedForwarderChangedEvent(
  forwarder: Address
): TrustedForwarderChanged {
  let trustedForwarderChangedEvent = changetype<TrustedForwarderChanged>(
    newMockEvent()
  )

  trustedForwarderChangedEvent.parameters = new Array()

  trustedForwarderChangedEvent.parameters.push(
    new ethereum.EventParam("forwarder", ethereum.Value.fromAddress(forwarder))
  )

  return trustedForwarderChangedEvent
}

export function createTrustedForwarderUpdatedEvent(
  trustedForwarder: Address
): TrustedForwarderUpdated {
  let trustedForwarderUpdatedEvent = changetype<TrustedForwarderUpdated>(
    newMockEvent()
  )

  trustedForwarderUpdatedEvent.parameters = new Array()

  trustedForwarderUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "trustedForwarder",
      ethereum.Value.fromAddress(trustedForwarder)
    )
  )

  return trustedForwarderUpdatedEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}
