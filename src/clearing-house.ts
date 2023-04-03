import { BigInt, Bytes, BigDecimal } from "@graphprotocol/graph-ts";
import {
  abs,
  BD_ZERO,
  BI_ZERO,
  DUST_POSITION_SIZE,
  startOf15fMinute,
  fromSqrtPriceX96,
  fromWei,
  startOfWeek,
  startOf4Hours,
  startOfDay,
  startOfMinute,
  startOfMonth,
  startOfHour,
} from "./utils/numbers";

import {
  DelegateApprovalChanged as DelegateApprovalChangedEvent,
  FundingPaymentSettled as FundingPaymentSettledEvent,
  LiquidityChanged as LiquidityChangedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Paused as PausedEvent,
  PlatformFundChanged as PlatformFundChangedEvent,
  PositionChanged as PositionChangedEvent,
  PositionClosed as PositionClosedEvent,
  PositionLiquidated as PositionLiquidatedEvent,
  ReferredPositionChanged as ReferredPositionChangedEvent,
  Repeg as RepegEvent,
  TrustedForwarderChanged as TrustedForwarderChangedEvent,
  TrustedForwarderUpdated as TrustedForwarderUpdatedEvent,
  Unpaused as UnpausedEvent,
} from "../generated/ClearingHouse/ClearingHouse";
import {
  ChartTrade,
  DelegateApprovalChanged,
  FundingPaymentSettled,
  LiquidityChanged,
  OwnershipTransferred,
  Paused,
  PlatformFundChanged,
  PositionChanged,
  PositionClosed,
  PositionLiquidated,
  Repeg,
  TrustedForwarderChanged,
  TrustedForwarderUpdated,
  Unpaused,
} from "../generated/schema";

export function handleDelegateApprovalChanged(
  event: DelegateApprovalChangedEvent
): void {
  let entity = new DelegateApprovalChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.delegateApproval = event.params.delegateApproval;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleFundingPaymentSettled(
  event: FundingPaymentSettledEvent
): void {
  let entity = new FundingPaymentSettled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.trader = event.params.trader;
  entity.baseToken = event.params.baseToken;
  entity.fundingPayment = event.params.fundingPayment;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleLiquidityChanged(event: LiquidityChangedEvent): void {
  let entity = new LiquidityChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.maker = event.params.maker;
  entity.baseToken = event.params.baseToken;
  entity.quoteToken = event.params.quoteToken;
  entity.lowerTick = event.params.lowerTick;
  entity.upperTick = event.params.upperTick;
  entity.base = event.params.base;
  entity.quote = event.params.quote;
  entity.liquidity = event.params.liquidity;
  entity.quoteFee = event.params.quoteFee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.account = event.params.account;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePlatformFundChanged(
  event: PlatformFundChangedEvent
): void {
  let entity = new PlatformFundChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.platformFundArg = event.params.platformFundArg;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePositionChanged(event: PositionChangedEvent): void {
  let entity = new PositionChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.trader = event.params.trader;
  entity.baseToken = event.params.baseToken;
  entity.exchangedPositionSize = fromWei(event.params.exchangedPositionSize);
  if (
    abs(entity.exchangedPositionSize).lt(
      BigDecimal.fromString("0.0000000000001")
    )
  ) {
    return;
  }

  entity.exchangedPositionNotional = fromWei(
    event.params.exchangedPositionNotional
  );
  entity.fee = event.params.fee;
  entity.openNotional = event.params.openNotional;
  entity.realizedPnl = event.params.realizedPnl;
  entity.sqrtPriceAfterX96 = event.params.sqrtPriceAfterX96;
  entity.marketPriceAfter = fromSqrtPriceX96(event.params.sqrtPriceAfterX96);
  // exchangedPositionSize could be 0 if PositionChanged is from addLiquidity/removeLiquidity
  if (entity.exchangedPositionSize.equals(BD_ZERO)) {
    entity.swappedPrice = BD_ZERO;
  } else {
    // see https://www.figma.com/file/xuue5qGH4RalX7uAbbzgP3?embed_host=notion&kind=&node-id=0%3A1&viewer=1
    // swappedPrice is already considering fee:
    // when long, fee is deducted first, then swap
    // when short, swap first, then fee is deducted
    entity.swappedPrice = abs(
      entity.exchangedPositionNotional.div(entity.exchangedPositionSize)
    );
  }

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  var y = event.block.timestamp.toI64();
  var date = new Date(y * 1000);
  date = startOfMinute(date);

  let startMinute = BigInt.fromI64(startOfMinute(date).getTime());
  let minuteTradeId = event.params.baseToken
    .toHexString()
    .concat("-")
    .concat(startMinute.toHexString())
    .concat("-")
    .concat("60");
  UpdatedOrCreateChartTrade(
    minuteTradeId,
    event.params.baseToken,
    60,
    entity.swappedPrice,
    startMinute,
    entity.exchangedPositionNotional
  );

  let start15Minute = BigInt.fromI64(startOf15fMinute(date).getTime());
  minuteTradeId = event.params.baseToken
    .toHexString()
    .concat("-")
    .concat(start15Minute.toHexString())
    .concat("-")
    .concat("900");

  UpdatedOrCreateChartTrade(
    minuteTradeId,
    event.params.baseToken,
    900,
    entity.swappedPrice,
    start15Minute,
    entity.exchangedPositionNotional
  );

  let startHour = BigInt.fromI64(startOfHour(date).getTime());
  let hourTradeId = event.params.baseToken
    .toHexString()
    .concat("-")
    .concat(startHour.toHexString())
    .concat("-")
    .concat("3600");
  UpdatedOrCreateChartTrade(
    hourTradeId,
    event.params.baseToken,
    3600,
    entity.swappedPrice,
    startHour,
    entity.exchangedPositionNotional
  );

  let start4Hour = BigInt.fromI64(startOf4Hours(date).getTime());
  hourTradeId = event.params.baseToken
    .toHexString()
    .concat("-")
    .concat(start4Hour.toHexString())
    .concat("-")
    .concat("14400");
  UpdatedOrCreateChartTrade(
    hourTradeId,
    event.params.baseToken,
    14400,
    entity.swappedPrice,
    start4Hour,
    entity.exchangedPositionNotional
  );

  let startDay = BigInt.fromI64(startOfDay(date).getTime());
  let dayTradeId = event.params.baseToken
    .toHexString()
    .concat("-")
    .concat(startDay.toHexString())
    .concat("-")
    .concat("86400");
  UpdatedOrCreateChartTrade(
    dayTradeId,
    event.params.baseToken,
    86400,
    entity.swappedPrice,
    startDay,
    entity.exchangedPositionNotional
  );

  let startWeek = BigInt.fromI64(startOfWeek(date).getTime());
  let weekTradeId = event.params.baseToken
    .toHexString()
    .concat("-")
    .concat(startWeek.toHexString())
    .concat("-")
    .concat("604800");
  UpdatedOrCreateChartTrade(
    weekTradeId,
    event.params.baseToken,
    604800,
    entity.swappedPrice,
    startWeek,
    entity.exchangedPositionNotional
  );

  let startMonth = BigInt.fromI64(startOfMonth(date).getTime());
  let monthTradeId = event.params.baseToken
    .toHexString()
    .concat("-")
    .concat(startMonth.toHexString())
    .concat("-2592000");
  UpdatedOrCreateChartTrade(
    monthTradeId,
    event.params.baseToken,
    2592000,
    entity.swappedPrice,
    startMinute,
    entity.exchangedPositionNotional
  );

  entity.save();
}

function UpdatedOrCreateChartTrade(
  id: string,
  baseToken: Bytes,
  interval: i32,
  swappedPrice: BigDecimal,
  timestamp: BigInt,
  exchangedPositionSize: BigDecimal
): ChartTrade {
  let chart = ChartTrade.load(id);
  if (!chart) {
    chart = new ChartTrade(id);
    chart.baseToken = baseToken;
    chart.interval = interval;
    chart.timestamp = timestamp.div(BigInt.fromString("1000"));
    chart.open = swappedPrice;
    chart.close = swappedPrice;
    chart.high = swappedPrice;
    chart.low = swappedPrice;
    chart.volumeFrom = abs(exchangedPositionSize);
    chart.volumeTo = abs(exchangedPositionSize);
    chart.volume = abs(exchangedPositionSize);
    chart.save();
  } else {
    if (chart.volumeFrom > abs(exchangedPositionSize)) {
      chart.volumeFrom = abs(exchangedPositionSize);
    } else if (chart.volumeTo < abs(exchangedPositionSize)) {
      chart.volumeTo = abs(exchangedPositionSize);
    }
    if (chart.low > swappedPrice) {
      chart.low = swappedPrice;
    } else if (chart.high < swappedPrice) {
      chart.high = swappedPrice;
    }
    chart.volume = chart.volume.plus(abs(exchangedPositionSize));
    chart.close = swappedPrice;
    chart.save();
  }
  return chart;
}

export function handlePositionClosed(event: PositionClosedEvent): void {
  let entity = new PositionClosed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.trader = event.params.trader;
  entity.baseToken = event.params.baseToken;
  entity.closedPositionSize = event.params.closedPositionSize;
  entity.closedPositionNotional = event.params.closedPositionNotional;
  entity.openNotional = event.params.openNotional;
  entity.realizedPnl = event.params.realizedPnl;
  entity.closedPrice = event.params.closedPrice;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePositionLiquidated(event: PositionLiquidatedEvent): void {
  let entity = new PositionLiquidated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.trader = event.params.trader;
  entity.baseToken = event.params.baseToken;
  entity.positionNotional = event.params.positionNotional;
  entity.positionSize = event.params.positionSize;
  entity.liquidationFee = event.params.liquidationFee;
  entity.liquidator = event.params.liquidator;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleReferredPositionChanged(
  event: ReferredPositionChangedEvent
): void {}

export function handleRepeg(event: RepegEvent): void {
  let entity = new Repeg(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.oldMarkPrice = event.params.oldMarkPrice;
  entity.newMarkPrice = event.params.newMarkPrice;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTrustedForwarderChanged(
  event: TrustedForwarderChangedEvent
): void {
  let entity = new TrustedForwarderChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.forwarder = event.params.forwarder;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTrustedForwarderUpdated(
  event: TrustedForwarderUpdatedEvent
): void {
  let entity = new TrustedForwarderUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.trustedForwarder = event.params.trustedForwarder;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new Unpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.account = event.params.account;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
