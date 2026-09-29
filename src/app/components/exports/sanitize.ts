// exceljs writes all string cells as type String: no formula execution risk,
// so no escaping needed here.
export const sanitizeExcelValue = (value: string | number): string | number => value;
