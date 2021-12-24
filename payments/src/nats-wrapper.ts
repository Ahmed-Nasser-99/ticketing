/* 
the use of this is to make nats act like mongoose that any file can connect 
to mongoose after importing it  
*/

import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;
  //? is to tell TS that _client may not be defined for some time

  get client() {
    if (!this._client) {
      throw new Error("Cannot access nats client b4 connecting");
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    //url is from the nats-depl.yaml the service
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      //the promise so we can convert this method to async one (ability to use wait)
      this.client.on("connect", () => {
        console.log("connected to NATS");
        resolve();
      });

      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
