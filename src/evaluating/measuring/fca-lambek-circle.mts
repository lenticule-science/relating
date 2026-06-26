import { tm, type Tm } from "../../../lib/notating/index.mjs";

/** RMN normalizer for finite FCA/Lambek circle receipts. */
export const circleReceiptTerm: Tm = tm.lam(tm.var(0));
