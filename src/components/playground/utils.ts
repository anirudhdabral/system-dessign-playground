export const formatVersionDate = (createdAt: string) => {
  const asNumber = Number(createdAt);
  const date = Number.isFinite(asNumber) ? new Date(asNumber) : new Date(createdAt);

  return Number.isNaN(date.getTime()) ? "Unknown date" : date.toLocaleString();
};

export const getVersionTimestamp = (createdAt: string) => {
  const asNumber = Number(createdAt);
  if (Number.isFinite(asNumber)) return asNumber;
  const parsed = Date.parse(createdAt);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const sanitizeForPersistence = <T>(value: T): T =>
  JSON.parse(
    JSON.stringify(value, (_key, fieldValue) => (typeof fieldValue === "function" ? undefined : fieldValue)),
  ) as T;
