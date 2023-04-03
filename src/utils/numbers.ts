import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const BI_ZERO = BigInt.fromI32(0);
export const BI_ONE = BigInt.fromI32(1);
export const BD_ZERO = BigDecimal.fromString("0.0");
export const DUST_POSITION_SIZE = fromWei(BigInt.fromI32(10));
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const VAULT_DECIMALS = BigInt.fromI32(6);
export const DEFAULT_DECIMALS = BigInt.fromI32(18);
export const RATIO_ONE = BigDecimal.fromString("1000000");

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString("1");
  for (let i = BI_ZERO; i.lt(decimals as BigInt); i = i.plus(BI_ONE)) {
    bd = bd.times(BigDecimal.fromString("10"));
  }
  return bd;
}

export function fromWei(
  value: BigInt,
  decimals: BigInt = DEFAULT_DECIMALS
): BigDecimal {
  return value.toBigDecimal().div(exponentToBigDecimal(decimals));
}

export function abs(value: BigDecimal): BigDecimal {
  return value.lt(BD_ZERO) ? value.neg() : value;
}

export function powD(value: BigDecimal, n: BigInt): BigDecimal {
  let bd = value;
  for (let i = BI_ONE; i.lt(n); i = i.plus(BI_ONE)) {
    bd = bd.times(value);
  }
  return bd;
}

export function fromSqrtPriceX96(value: BigInt): BigDecimal {
  // sqrtPriceX96.div(2 ** 96).pow(2)
  const sqrtPriceX96 = new BigDecimal(value);
  const Q96 = new BigDecimal(BigInt.fromI32(2).pow(96));
  return powD(sqrtPriceX96.div(Q96), BigInt.fromI32(2));
}
export function startOfMinute(date: Date): Date {
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  return date;
}
export function startOf15fMinute(date: Date): Date {
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  var minutes = date.getUTCMinutes();
  date.setUTCMinutes(minutes - (minutes % 15));
  return date;
}
export function startOfHour(date: Date): Date {
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  date.setUTCMinutes(0);
  return date;
}

export function startOf4Hours(date: Date): Date {
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  date.setUTCMinutes(0);
  var hour = date.getUTCHours();
  date.setUTCHours(hour - (hour % 4));
  return date;
}
export function startOf8Hours(date: Date): Date {
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  date.setUTCMinutes(0);
  var hour = date.getUTCHours();
  date.setUTCHours(hour - (hour % 8));
  return date;
}

export function startOfDay(date: Date): Date {
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  date.setUTCMinutes(0);
  date.setUTCHours(0);
  return date;
}
export function startOfMonth(date: Date): Date {
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  date.setUTCMinutes(0);
  date.setUTCHours(0);
  date.setUTCDate(1);
  return date;
}

export function startOfWeek(date: Date): Date {
  var diff =
    date.getUTCDate() - date.getUTCDay() + (date.getUTCDate() === 0 ? -6 : 1);
  date = startOfDay(date);
  date.setUTCDate(diff);
  return date;
}
