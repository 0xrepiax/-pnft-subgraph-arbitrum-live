import {
  AccountBalanceChanged as AccountBalanceChangedEvent,
  ClearingHouseChanged as ClearingHouseChangedEvent,
  FundingUpdated as FundingUpdatedEvent,
  MaxTickCrossedWithinBlockChanged as MaxTickCrossedWithinBlockChangedEvent,
  ExchangeOwnershipTransferred as ExchangeOwnershipTransferredEvent,
} from "../generated/Exchange/Exchange";
import {
  AccountBalanceChanged,
  ClearingHouseChanged,
  FundingUpdated,
  MaxTickCrossedWithinBlockChanged,
  ExchangeOwnershipTransferred,
  ChartFunding,
} from "../generated/schema";

import { BigInt, Bytes, BigDecimal } from "@graphprotocol/graph-ts";
import {
  abs,
  BD_ZERO,
  BI_ZERO,
  DUST_POSITION_SIZE,
  fromSqrtPriceX96,
  fromWei,
  startOfWeek,
  startOf4Hours,
  startOf8Hours,
  startOfDay,
  startOfMinute,
  startOfMonth,
  startOfHour,
} from "./utils/numbers";

export function handleAccountBalanceChanged(
  event: AccountBalanceChangedEvent
): void {
  let entity = new AccountBalanceChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.accountBalance = event.params.accountBalance;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleClearingHouseChanged(
  event: ClearingHouseChangedEvent
): void {
  let entity = new ClearingHouseChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.clearingHouse = event.params.clearingHouse;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleMaxTickCrossedWithinBlockChanged(
  event: MaxTickCrossedWithinBlockChangedEvent
): void {
  let entity = new MaxTickCrossedWithinBlockChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.baseToken = event.params.baseToken;
  entity.maxTickCrossedWithinBlock = event.params.maxTickCrossedWithinBlock;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleExchangeOwnershipTransferred(
  event: ExchangeOwnershipTransferredEvent
): void {
  let entity = new ExchangeOwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleFundingUpdated(event: FundingUpdatedEvent): void {
  let entity = new FundingUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.baseToken = event.params.baseToken;
  entity.markTwap = fromWei(event.params.markTwap);
  entity.indexTwap = fromWei(event.params.indexTwap);
  entity.longPositionSize = fromWei(event.params.longPositionSize);
  entity.shortPositionSize = fromWei(event.params.shortPositionSize);
  

  if (
    entity.longPositionSize.equals(BD_ZERO) ||
    entity.shortPositionSize.equals(BD_ZERO)
  ) {
    entity.longDeltaRatio = BD_ZERO;
    entity.shortDeltaRatio = BD_ZERO;
    entity.dailyFundingRate = BD_ZERO;
  } else {
    let deltaPriceRatio = entity.markTwap
    .minus(entity.indexTwap)
    .div(entity.indexTwap);
    entity.dailyFundingRate = deltaPriceRatio;
  if (deltaPriceRatio.gt(BigDecimal.fromString("0.1"))) {
    deltaPriceRatio = BigDecimal.fromString("0.1");
  } else if (deltaPriceRatio.lt(BigDecimal.fromString("-0.1"))) {
    deltaPriceRatio = BigDecimal.fromString("-0.1");
  }
  
    if (abs(deltaPriceRatio).le(BigDecimal.fromString("0.03"))) {
      entity.longDeltaRatio = deltaPriceRatio
        .times(BigDecimal.fromString("0.25"))
        .times(BigDecimal.fromString("0.25"));
      entity.shortDeltaRatio = deltaPriceRatio
        .times(BigDecimal.fromString("0.25"))
        .times(BigDecimal.fromString("0.25"));
    } else if (abs(deltaPriceRatio).le(BigDecimal.fromString("0.05"))) {
      entity.longDeltaRatio = deltaPriceRatio.times(
        BigDecimal.fromString("0.25")
      );
      entity.shortDeltaRatio = deltaPriceRatio.times(
        BigDecimal.fromString("0.25")
      );
    } else {
      entity.longDeltaRatio = deltaPriceRatio;
      entity.shortDeltaRatio = deltaPriceRatio;
    }

    if (deltaPriceRatio.lt(BD_ZERO)) {
      entity.longDeltaRatio = entity.longDeltaRatio
        .times(entity.shortPositionSize)
        .div(entity.longPositionSize);
      entity.shortDeltaRatio = entity.shortDeltaRatio.times(
        BigDecimal.fromString("-1")
      );
    } else {
      entity.shortDeltaRatio = entity.shortDeltaRatio
        .times(entity.longPositionSize)
        .div(entity.shortPositionSize);
    }
    /*
    entity.longDeltaRatio = entity.longDeltaRatio.div(
      BigDecimal.fromString("3")
    );
    entity.shortDeltaRatio = entity.shortDeltaRatio.div(
      BigDecimal.fromString("3")
    );
    */
  }

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  var y = event.block.timestamp.toI64();
  var date = new Date(y * 1000);
  date = startOfMinute(date);

  let typeLong = "long";
  let typeShort = "short";
  let startMinute = BigInt.fromI64(startOfMinute(date).getTime());
  let minuteTradeIdLong = event.params.baseToken
    .toHexString()
    .concat("-")
    .concat(startMinute.toHexString())
    .concat("-")
    .concat("60")
    .concat("-")
    .concat(typeLong);

  let minuteTradeIdShort = event.params.baseToken
    .toHexString()
    .concat("-")
    .concat(startMinute.toHexString())
    .concat("-")
    .concat("60")
    .concat("-")
    .concat(typeShort);

  UpdatedOrCreateChartPoint(
    minuteTradeIdLong,
    event.params.baseToken,
    60,
    entity.longDeltaRatio,
    startMinute,
    typeLong
  );
  UpdatedOrCreateChartPoint(
    minuteTradeIdShort,
    event.params.baseToken,
    60,
    entity.shortDeltaRatio,
    startMinute,
    typeShort
  );

  let startHour = BigInt.fromI64(startOfHour(date).getTime());
  let hourTradeIdLong = event.params.baseToken
    .toHexString()
    .concat("-")
    .concat(startHour.toHexString())
    .concat("-")
    .concat("3600")
    .concat("-")
    .concat(typeLong);

  let hourTradeIdShort = event.params.baseToken
    .toHexString()
    .concat("-")
    .concat(startHour.toHexString())
    .concat("-")
    .concat("3600")
    .concat("-")
    .concat(typeShort);

  UpdatedOrCreateChartPoint(
    hourTradeIdLong,
    event.params.baseToken,
    3600,
    entity.longDeltaRatio,
    startHour,
    typeLong
  );

  UpdatedOrCreateChartPoint(
    hourTradeIdShort,
    event.params.baseToken,
    3600,
    entity.shortDeltaRatio,
    startHour,
    typeShort
  );

  let start8Hour = BigInt.fromI64(startOf8Hours(date).getTime());

  hourTradeIdLong = event.params.baseToken
    .toHexString()
    .concat("-")
    .concat(start8Hour.toHexString())
    .concat("-")
    .concat("28800")
    .concat("-")
    .concat(typeLong);

  hourTradeIdShort = event.params.baseToken
    .toHexString()
    .concat("-")
    .concat(start8Hour.toHexString())
    .concat("-")
    .concat("28800")
    .concat("-")
    .concat(typeShort);

  UpdatedOrCreateChartPoint(
    hourTradeIdLong,
    event.params.baseToken,
    28800,
    entity.longDeltaRatio,
    start8Hour,
    typeLong
  );

  UpdatedOrCreateChartPoint(
    hourTradeIdShort,
    event.params.baseToken,
    28800,
    entity.shortDeltaRatio,
    start8Hour,
    typeShort
  );

  let startDay = BigInt.fromI64(startOfDay(date).getTime());
  let dayTradeIdLong = event.params.baseToken
    .toHexString()
    .concat("-")
    .concat(startDay.toHexString())
    .concat("-")
    .concat("86400")
    .concat("-")
    .concat(typeLong);

  let dayTradeIdShort = event.params.baseToken
    .toHexString()
    .concat("-")
    .concat(startDay.toHexString())
    .concat("-")
    .concat("86400")
    .concat("-")
    .concat(typeShort);

  UpdatedOrCreateChartPoint(
    dayTradeIdLong,
    event.params.baseToken,
    86400,
    entity.longDeltaRatio,
    startDay,
    typeLong
  );

  UpdatedOrCreateChartPoint(
    dayTradeIdShort,
    event.params.baseToken,
    86400,
    entity.shortDeltaRatio,
    startDay,
    typeShort
  );

  let startWeek = BigInt.fromI64(startOfWeek(date).getTime());
  let weekTradeIdLong = event.params.baseToken
    .toHexString()
    .concat("-")
    .concat(startWeek.toHexString())
    .concat("-")
    .concat("604800")
    .concat("-")
    .concat(typeLong);

  let weekTradeIdShort = event.params.baseToken
    .toHexString()
    .concat("-")
    .concat(startWeek.toHexString())
    .concat("-")
    .concat("604800")
    .concat("-")
    .concat(typeShort);

  UpdatedOrCreateChartPoint(
    weekTradeIdLong,
    event.params.baseToken,
    604800,
    entity.longDeltaRatio,
    startWeek,
    typeLong
  );

  UpdatedOrCreateChartPoint(
    weekTradeIdShort,
    event.params.baseToken,
    604800,
    entity.shortDeltaRatio,
    startWeek,
    typeShort
  );

  let startMonth = BigInt.fromI64(startOfMonth(date).getTime());
  let monthTradeIdLong = event.params.baseToken
    .toHexString()
    .concat("-")
    .concat(startMonth.toHexString())
    .concat("-2592000")
    .concat("-")
    .concat(typeLong);

  let monthTradeIdShort = event.params.baseToken
    .toHexString()
    .concat("-")
    .concat(startMonth.toHexString())
    .concat("-2592000")
    .concat("-")
    .concat(typeShort);

  UpdatedOrCreateChartPoint(
    monthTradeIdLong,
    event.params.baseToken,
    2592000,
    entity.longDeltaRatio,
    startMonth,
    typeLong
  );

  UpdatedOrCreateChartPoint(
    monthTradeIdShort,
    event.params.baseToken,
    2592000,
    entity.shortDeltaRatio,
    startMonth,
    typeShort
  );
  entity.save();
}

function UpdatedOrCreateChartPoint(
  id: string,
  baseToken: Bytes,
  interval: i32,
  ratio: BigDecimal,
  timestamp: BigInt,
  type: string
): ChartFunding {
  let chart = ChartFunding.load(id);
  if (interval == 3600) {
    ratio = ratio
      .times(BigDecimal.fromString("100"))
      .div(BigDecimal.fromString("24"));
  } else if (interval == 28800) {
    ratio = ratio
      .times(BigDecimal.fromString("100"))
      .div(BigDecimal.fromString("3"));
  }
  if (!chart) {
    chart = new ChartFunding(id);
    chart.baseToken = baseToken;
    chart.interval = interval;
    chart.timestamp = timestamp.div(BigInt.fromString("1000"));
    chart.type = type;

    chart.close = ratio;
    chart.high = ratio;
    chart.low = ratio;
    chart.open = ratio;
    chart.volumeFrom = BD_ZERO;
    chart.volumeTo = BD_ZERO;
    chart.save();
  } else {
    chart.close = ratio;
    chart.high = ratio;
    chart.low = ratio;
    chart.open = ratio;
    chart.volumeFrom = BD_ZERO;
    chart.volumeTo = BD_ZERO;
    chart.save();
  }
  return chart;
}
