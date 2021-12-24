import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  // OCC assumes that multiple transactions can frequently
  // complete without interfering with each other

  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: "party",
    price: 20,
    userId: "123",
  });

  // Save the ticket to the database
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make 2 separate changes to the ticket we fetched
  firstInstance!.set({ price: 200 });
  secondInstance!.set({ price: 300 });

  // save the first fetched ticket
  await firstInstance!.save();

  // save the second fetched ticket expect an error

  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("should not be thrown");
});

it("increments the number of version by 1 on multiple saves", async () => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: "party",
    price: 20,
    userId: "123",
  });

  // Save the ticket to the database
  await ticket.save();
  expect(ticket.version).toEqual(0);

  // Save the ticket to the database again and expect the version to be incremented
  await ticket.save();
  expect(ticket.version).toEqual(1);

  // Save the ticket to the database again and expect the version to be incremented
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
