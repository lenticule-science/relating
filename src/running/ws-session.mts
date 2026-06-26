// running/ws-session — the transfinite transport over a WebSocket frame loop.
//
// A WebSocket carries the bounded interactive claim session: each text frame is a
// claim `{cell, charge}` advancing the monotone log, and the reply frame is the
// settled judgement (per-cell verdict, contested cells, regime). The pure core
// (`exchangeClaim`, text → text) is split from the ws-frame encoder and the
// node-socket binding, exactly as `routeRequest` is split from `serve`. Nothing is
// overwritten: a contradicting claim flips a cell's verdict to ⊤ (`stable`) with no
// retraction.

import type { Server } from "node:http";
import type { Duplex } from "node:stream";
import { acceptKey, encodeFrame, FrameDecoder } from "../writing/http/ws/index.mjs";
import {
  isChargeValueName,
  type ChargeValueName,
} from "../../lib/articulating/predicating/positing/bilattice-charge.mjs";
import { claim, conflicts, judge, openSession, sessionRegime, type Session } from "./session.mjs";

/** One claim carried on a frame: a charged predication about a cell. */
export interface ClaimMessage {
  readonly cell: string;
  readonly charge: ChargeValueName;
}

/** Parse and validate a claim message from frame text; throws on a malformed claim. */
export function parseClaimMessage(text: string): ClaimMessage {
  const value: unknown = JSON.parse(text);
  const cell = (value as { cell?: unknown })?.cell;
  const charge = (value as { charge?: unknown })?.charge;
  if (typeof cell !== "string" || typeof charge !== "string" || !isChargeValueName(charge)) {
    throw new TypeError("ws-session: not a {cell:string, charge:ChargeValueName} claim");
  }
  return { cell, charge };
}

/** The settled judgement reply for a session: per-cell verdict, contested cells, and
 *  the regime (`scott` until a cell conflicts, then `transfinite`). */
export function judgementReply(session: Session): string {
  return JSON.stringify({
    judgement: Object.fromEntries(judge(session)),
    conflicts: conflicts(session),
    regime: sessionRegime(session),
  });
}

/** Apply one claim message (frame text) to the session, returning the advanced
 *  session and the judgement reply text — the pure core of the WS loop. */
export function exchangeClaim(
  session: Session,
  messageText: string,
): { readonly session: Session; readonly reply: string } {
  const message = parseClaimMessage(messageText);
  const next = claim(session, message.cell, message.charge);
  return { session: next, reply: judgementReply(next) };
}

/** Encode a judgement reply as a WebSocket text frame (opcode 0x1, fin). */
export function judgementFrame(reply: string): Buffer {
  return encodeFrame(0x1, Buffer.from(reply, "utf-8"));
}

/** Attach a transfinite claim-session WebSocket endpoint to an HTTP server: the
 *  RFC 6455 upgrade handshake, then one bounded claim session per connection — each
 *  text frame a claim, each reply the settled judgement. This is the thin
 *  node-socket binding over the pure {@link exchangeClaim} core. */
export function attachClaimSession(server: Server): Server {
  server.on("upgrade", (req, socket: Duplex) => {
    const key = req.headers["sec-websocket-key"];
    if (typeof key !== "string") {
      socket.destroy();
      return;
    }
    socket.write(
      "HTTP/1.1 101 Switching Protocols\r\n" +
        "Upgrade: websocket\r\nConnection: Upgrade\r\n" +
        `Sec-WebSocket-Accept: ${acceptKey(key)}\r\n\r\n`,
    );
    let session: Session = openSession();
    const decoder = new FrameDecoder();
    socket.on("data", (chunk: Buffer) => {
      for (const frame of decoder.push(chunk)) {
        if (frame.opcode === 0x8) {
          socket.end();
          return;
        }
        if (frame.opcode !== 0x1) continue; // only text claim frames
        try {
          const exchanged = exchangeClaim(session, frame.payload.toString("utf-8"));
          session = exchanged.session;
          socket.write(judgementFrame(exchanged.reply));
        } catch (error) {
          socket.write(judgementFrame(JSON.stringify({ error: String(error) })));
        }
      }
    });
    socket.on("error", () => {
      /* client reset; drop the session */
    });
  });
  return server;
}
