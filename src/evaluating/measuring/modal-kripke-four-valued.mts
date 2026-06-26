import { tm, type Tm } from "../../../lib/notating/index.mjs";

/** Identity normalizer for finite FOUR-valued Kripke receipts. */
export const modalKripkeReceiptTerm: Tm = tm.lam(tm.var(0));
