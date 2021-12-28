import { State } from "./state-machine";
import { PeerEntry } from "./peer-state";

export enum Phase {
  KEYGEN = "keygen",
  SIGN = "sign",
}

// Configuration parameters retrieved from the server
// during the handshake.
export interface Parameters {
  parties: number;
  threshold: number;
}

// Opaque type for the final generated key data,
// see the rust `PartyKey` type for details.
export interface PartyKey {}

// The result from generating a key.
export interface KeygenResult {
  parameters: Parameters;
  key: PartyKey;
  partySignup: PartySignup;
}

// Generated by the server to signal this party wants
// to be included in key generation.
export interface PartySignup {
  number: number;
  uuid: string;
}

// Temporary object passed back and forth between javascript
// and webassembly for the various rounds.
export interface RoundEntry {
  peer_entries: PeerEntry[];
  // Webassembly adds a bunch of temporary properties
  // to each round entry for further rounds but
  // these fields should not be accessed here
  // however we declare their presence in the type
  [x: string]: any;
}

// Type received from the server once all parties have commited
// to a round; contains the answers from the other parties.
export interface BroadcastAnswer {
  answer: string[];
}

// Holds the websocket identifier.
export interface ClientId {
  conn_id: number;
}

// Encapsulates server handshake information.
export interface Handshake {
  client: ClientId;
  parameters: Parameters;
}

// State for party signup round during keygen.
export interface PartySignupInfo {
  parameters: Parameters;
  partySignup: PartySignup;
}

export function makeOnTransition<T, U>(postMessage: Function) {
  return (
    index: number,
    previousState: State<T, U>,
    nextState: State<T, U>
  ) => {
    let message = "";
    if (previousState) {
      message = `transition ${index} from ${previousState.name} to ${nextState.name}`;
    } else {
      message = `transition ${index} to ${nextState.name}`;
    }
    console.log(message);
    postMessage({ type: "log", message });
  };
}
