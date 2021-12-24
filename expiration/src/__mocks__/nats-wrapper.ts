// fake nats wrapper just for testing
// tests care only for the client object from nats wrapper
// the implementation of the client object is in the base-publisher.ts

export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
          /* 
          mock function
          mockImplementation -> to get the callback function
        */
        }
      ),
  },
};
