// TODO: write small api for tests

import { BLRocker } from "./src";

interface Response {
  status: number;
  payload: string;
}

const broker = new BLRocker<Response>(
  function resolver() {
    return new Promise<Response>((resolve) => {
      /* some resolve requests */
      resolve();
    });
  },
  function detector(response) {
    return response.status === 401;
  }
);

/* push tasks in broker */