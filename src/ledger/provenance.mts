/**
 * ledger/provenance - in-toto/SLSA/Sigstore as RWIL signed provenance.
 *
 * This is a structural model, not a Sigstore client: signatures are deterministic
 * commitments over canonical JSON so the record-tier law can be tested without
 * pretending to perform keyless signing, Rekor inclusion, or certificate-chain
 * verification.
 */
import { createHash } from "node:crypto";

import { carrierFrom, type FromSchema } from "../typing/carrier.mjs";
import { eavtRecord, type Datom, type EAVTRecord } from "../writing/eavt.mjs";
import { canonical, requireJsonValue, type JsonValue } from "../writing/json.mjs";

export const structuralProvenanceSignatureSchema = {
  $id: "relating/ledger/provenance/structural-signature",
  title: "Structural Provenance Signature",
  description: "A deterministic canonical-json commitment standing in for a Sigstore signature.",
  type: "object",
  required: ["kind", "scheme", "signer", "digest"],
  properties: {
    kind: { const: "relating.ledger.provenance.structural-signature" },
    scheme: { const: "sigstore.structural" },
    signer: { type: "string", minLength: 1 },
    digest: { type: "string", minLength: 1 },
  },
  additionalProperties: false,
} as const;

export type StructuralProvenanceSignature = FromSchema<typeof structuralProvenanceSignatureSchema>;
export const structuralProvenanceSignatureCarrier = carrierFrom(structuralProvenanceSignatureSchema);

export const signedProvenanceSourceSchema = {
  $id: "relating/ledger/provenance/signed-source",
  title: "Signed Provenance Source",
  description: "The source payload plus its structural signature.",
  type: "object",
  required: ["kind", "source", "signature"],
  properties: {
    kind: { const: "relating.ledger.provenance.signed-source" },
    source: {},
    signature: { $ref: "relating/ledger/provenance/structural-signature" },
  },
  additionalProperties: false,
} as const;

type SignedProvenanceSourceBase = FromSchema<typeof signedProvenanceSourceSchema>;
export type SignedProvenanceSource = Omit<SignedProvenanceSourceBase, "source" | "signature"> & {
  readonly source: JsonValue;
  readonly signature: StructuralProvenanceSignature;
};
export const signedProvenanceSourceCarrier = carrierFrom(signedProvenanceSourceSchema);

export const attestationLinkSchema = {
  $id: "relating/ledger/provenance/attestation-link",
  title: "RWIL Provenance Attestation Link",
  description: "An in-toto/SLSA link carried as one RWIL record-tier provenance witness.",
  type: "object",
  required: ["kind", "name", "subject", "predicateType", "predicate", "materials", "products", "source", "signature", "t"],
  properties: {
    kind: { const: "relating.ledger.provenance.attestation-link" },
    name: { type: "string", minLength: 1 },
    subject: {},
    predicateType: { type: "string", minLength: 1 },
    predicate: {},
    materials: { type: "array", items: {} },
    products: { type: "array", items: {} },
    source: {},
    signature: { $ref: "relating/ledger/provenance/structural-signature" },
    t: {},
  },
  additionalProperties: false,
} as const;

type AttestationLinkBase = FromSchema<typeof attestationLinkSchema>;
export type AttestationLink = Omit<AttestationLinkBase, "subject" | "predicate" | "materials" | "products" | "source" | "signature" | "t"> & {
  readonly subject: JsonValue;
  readonly predicate: JsonValue;
  readonly materials: readonly JsonValue[];
  readonly products: readonly JsonValue[];
  readonly source: JsonValue;
  readonly signature: StructuralProvenanceSignature;
  readonly t: JsonValue;
};
export const attestationLinkCarrier = carrierFrom(attestationLinkSchema);

export const provenanceReadingSchema = {
  $id: "relating/ledger/provenance/reading",
  title: "RWIL Provenance Reading",
  description: "The fifth Datom slot for a settled provenance judgement.",
  type: "object",
  required: ["kind", "standard", "linkName", "signedSource", "verified"],
  properties: {
    kind: { const: "relating.ledger.provenance.reading" },
    standard: { const: "in-toto/slsa/sigstore.structural" },
    linkName: { type: "string", minLength: 1 },
    signedSource: { $ref: "relating/ledger/provenance/signed-source" },
    verified: { type: "boolean" },
  },
  additionalProperties: false,
} as const;

type ProvenanceReadingBase = FromSchema<typeof provenanceReadingSchema>;
export type ProvenanceReading = Omit<ProvenanceReadingBase, "signedSource"> & {
  readonly signedSource: SignedProvenanceSource;
};
export const provenanceReadingCarrier = carrierFrom(provenanceReadingSchema);

function digest(value: JsonValue): string {
  return createHash("sha256").update(canonical(value), "utf8").digest("hex");
}

function signaturePayload(source: JsonValue, signer: string): JsonValue {
  return requireJsonValue({
    kind: "relating.ledger.provenance.signature-payload",
    scheme: "sigstore.structural",
    signer,
    source,
  }, "provenance signature payload");
}

export function signProvenanceSource(source: JsonValue, signer: string): StructuralProvenanceSignature {
  return structuralProvenanceSignatureCarrier.assert(Object.freeze({
    kind: "relating.ledger.provenance.structural-signature" as const,
    scheme: "sigstore.structural" as const,
    signer,
    digest: digest(signaturePayload(source, signer)),
  }), "structural provenance signature");
}

export function signedProvenanceSource(source: JsonValue, signer: string): SignedProvenanceSource {
  return signedProvenanceSourceCarrier.assert(Object.freeze({
    kind: "relating.ledger.provenance.signed-source" as const,
    source,
    signature: signProvenanceSource(source, signer),
  }), "signed provenance source") as SignedProvenanceSource;
}

export function verifySignedProvenanceSource(signed: SignedProvenanceSource): boolean {
  signedProvenanceSourceCarrier.assert(signed, "signed provenance source");
  return signed.signature.digest === digest(signaturePayload(signed.source, signed.signature.signer));
}

export type AttestationLinkInput = {
  readonly name: string;
  readonly subject: JsonValue;
  readonly predicateType: string;
  readonly predicate: JsonValue;
  readonly materials?: readonly JsonValue[];
  readonly products?: readonly JsonValue[];
  readonly t: JsonValue;
  readonly signer: string;
};

export function attestationSourceOf(link: Omit<AttestationLink, "source" | "signature">): JsonValue {
  return requireJsonValue({
    kind: "relating.ledger.provenance.attestation-source",
    name: link.name,
    subject: link.subject,
    predicateType: link.predicateType,
    predicate: link.predicate,
    materials: [...link.materials],
    products: [...link.products],
    t: link.t,
  }, "attestation source");
}

export function createAttestationLink(input: AttestationLinkInput): AttestationLink {
  const base = Object.freeze({
    kind: "relating.ledger.provenance.attestation-link" as const,
    name: input.name,
    subject: input.subject,
    predicateType: input.predicateType,
    predicate: input.predicate,
    materials: Object.freeze([...(input.materials ?? [])]),
    products: Object.freeze([...(input.products ?? [])]),
    t: input.t,
  });
  const source = attestationSourceOf(base);
  return attestationLinkCarrier.assert(Object.freeze({
    ...base,
    source,
    signature: signProvenanceSource(source, input.signer),
  }), "attestation link") as AttestationLink;
}

export function signedSourceOfAttestation(link: AttestationLink): SignedProvenanceSource {
  return signedProvenanceSourceCarrier.assert(Object.freeze({
    kind: "relating.ledger.provenance.signed-source" as const,
    source: link.source,
    signature: link.signature,
  }), "attestation signed source") as SignedProvenanceSource;
}

export function verifyAttestationLink(link: AttestationLink): boolean {
  attestationLinkCarrier.assert(link, "attestation link");
  const expectedSource = attestationSourceOf(link);
  return canonical(link.source) === canonical(expectedSource) && verifySignedProvenanceSource(signedSourceOfAttestation(link));
}

export function attestationLinkToDatom(link: AttestationLink): Datom {
  const signedSource = signedSourceOfAttestation(link);
  const reading = provenanceReadingCarrier.assert(Object.freeze({
    kind: "relating.ledger.provenance.reading" as const,
    standard: "in-toto/slsa/sigstore.structural" as const,
    linkName: link.name,
    signedSource,
    verified: verifyAttestationLink(link),
  }), "provenance reading") as ProvenanceReading;
  return Object.freeze([link.subject, link.predicateType, link.predicate, link.t, reading as unknown as JsonValue]);
}

function isProvenanceReading(value: JsonValue): value is ProvenanceReading {
  return provenanceReadingCarrier.validate(value);
}

export function attestationLinkFromDatom(datom: Datom): AttestationLink {
  const reading = datom[4];
  if (!isProvenanceReading(reading)) throw new TypeError("datom has no provenance reading");
  const source = reading.signedSource.source;
  if (typeof source !== "object" || source === null || Array.isArray(source)) throw new TypeError("provenance source must be an object");
  const src = source as Record<string, JsonValue>;
  return attestationLinkCarrier.assert(Object.freeze({
    kind: "relating.ledger.provenance.attestation-link" as const,
    name: String(src.name),
    subject: datom[0],
    predicateType: String(datom[1]),
    predicate: datom[2],
    materials: Array.isArray(src.materials) ? src.materials : [],
    products: Array.isArray(src.products) ? src.products : [],
    source,
    signature: reading.signedSource.signature,
    t: datom[3],
  }), "attestation link from datom") as AttestationLink;
}

export function verifyAttestationDatom(datom: Datom): boolean {
  try {
    const link = attestationLinkFromDatom(datom);
    return verifyAttestationLink(link) &&
      canonical(datom[0]) === canonical(link.subject) &&
      canonical(datom[1]) === canonical(link.predicateType) &&
      canonical(datom[2]) === canonical(link.predicate) &&
      canonical(datom[3]) === canonical(link.t);
  } catch {
    return false;
  }
}

function isDatom(value: AttestationLink | Datom): value is Datom {
  return Array.isArray(value) && value.length === 5;
}

function linkOf(value: AttestationLink | Datom): AttestationLink {
  return isDatom(value) ? attestationLinkFromDatom(value) : value;
}

function jsonKey(value: JsonValue): string {
  return canonical(value);
}

/**
 * Read an attestation chain as the supply-chain provenance order. An edge
 * exists when one link's product is another link's material.
 */
export function provenanceOrder(chain: readonly (AttestationLink | Datom)[]): readonly AttestationLink[] {
  const links = chain.map(linkOf);
  const productOwner = new Map<string, number>();
  links.forEach((link, index) => {
    for (const product of link.products) productOwner.set(jsonKey(product), index);
  });

  const deps = links.map((link) => new Set<number>());
  links.forEach((link, index) => {
    for (const material of link.materials) {
      const owner = productOwner.get(jsonKey(material));
      if (owner !== undefined && owner !== index) deps[index]!.add(owner);
    }
  });

  const out: AttestationLink[] = [];
  const temporary = new Set<number>();
  const permanent = new Set<number>();
  const visit = (index: number): void => {
    if (permanent.has(index)) return;
    if (temporary.has(index)) throw new Error("provenanceOrder: cycle in attestation chain");
    temporary.add(index);
    for (const dep of [...deps[index]!].sort((a, b) => a - b)) visit(dep);
    temporary.delete(index);
    permanent.add(index);
    out.push(links[index]!);
  };

  for (let i = 0; i < links.length; i += 1) visit(i);
  return Object.freeze(out);
}

export function provenanceWitnessOfDatom(datom: Datom): EAVTRecord {
  return eavtRecord({ e: datom[0], a: datom[1], v: datom[2], t: datom[3] });
}
