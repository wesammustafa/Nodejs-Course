import express, { Request, Response } from 'express';

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;
const BLOCK_DURATION_MS = 10_000;
const STARTING_BALANCE = 100;

let balance = STARTING_BALANCE;

/**
 * Synchronously busy-waits for the given duration, blocking the Node.js
 * event loop for the entire time. Used here to demonstrate how a CPU-bound
 * handler stalls all other requests on a single-process Express server.
 */
function blockEventLoop(durationMs: number): number {
  const start = Date.now();
  const end = start + durationMs;
  let counter = 0;
  while (Date.now() < end) {
    counter++;
  }
  return counter;
}

app.get('/fast', (_req: Request, res: Response) => {
  console.log(`[FAST] handled at ${new Date().toISOString()} (PID ${process.pid})`);
  res.send(`Fast response from PID ${process.pid}\n`);
});

app.get('/slow', (_req: Request, res: Response) => {
  const startedAt = new Date().toISOString();
  console.log(`[SLOW] started at ${startedAt} (PID ${process.pid})`);

  const start = Date.now();
  blockEventLoop(BLOCK_DURATION_MS);
  const elapsed = Date.now() - start;

  console.log(`[SLOW] finished at ${new Date().toISOString()} (took ${elapsed}ms)`);
  res.send(`Slow response from PID ${process.pid} (took ${elapsed}ms)\n`);
});

/**
 * Demonstrates the canonical Node.js concurrency bug: stale shared state
 * across an `await` boundary. Two concurrent withdrawals both read `balance`,
 * both pass the sufficient-funds check, then both subtract — driving the
 * balance negative even though only one withdrawal should have been allowed.
 *
 * The bug is interleaving, not parallelism: only one handler runs JS at a
 * time, but when the first handler awaits, the event loop picks up the
 * second handler, which sees stale state.
 *
 * Repro:
 *   curl 'http://localhost:3000/reset'
 *   curl 'http://localhost:3000/withdraw?amount=60' &
 *   curl 'http://localhost:3000/withdraw?amount=60' &
 *   wait
 *   curl 'http://localhost:3000/balance'   # -> -20 instead of 40
 */
app.get('/withdraw', async (req: Request, res: Response) => {
  const amount = Number(req.query.amount);
  console.log(`[WITHDRAW] amount=${amount} entered, balance=${balance}`);

  if (balance >= amount) {
    await new Promise<void>((resolve) => setTimeout(resolve, 100));
    balance -= amount;
    console.log(`[WITHDRAW] amount=${amount} succeeded, balance=${balance}`);
    res.send(`Withdrew ${amount}. New balance: ${balance}\n`);
    return;
  }

  console.log(`[WITHDRAW] amount=${amount} rejected, balance=${balance}`);
  res.status(400).send(`Insufficient funds. Balance: ${balance}\n`);
});

/**
 * Fixed counterpart to `/withdraw`. The check and the balance mutation are
 * now in a single synchronous block — there is no `await` between reading
 * `balance` and writing it back. Any async work happens AFTER the commit,
 * so a second handler that runs during the await sees the already-decremented
 * balance and is correctly rejected.
 *
 * The lesson: in Node.js you don't need a mutex — you just need to keep the
 * critical section synchronous. Interleaving only happens at `await` points.
 *
 * Repro (should leave balance at 40, with one request rejected):
 *   curl 'http://localhost:3000/reset'
 *   curl 'http://localhost:3000/withdraw-safe?amount=60' &
 *   curl 'http://localhost:3000/withdraw-safe?amount=60' &
 *   wait
 *   curl 'http://localhost:3000/balance'   # -> 40
 */
app.get('/withdraw-safe', async (req: Request, res: Response) => {
  const amount = Number(req.query.amount);
  console.log(`[WITHDRAW-SAFE] amount=${amount} entered, balance=${balance}`);

  if (balance < amount) {
    console.log(`[WITHDRAW-SAFE] amount=${amount} rejected, balance=${balance}`);
    res.status(400).send(`Insufficient funds. Balance: ${balance}\n`);
    return;
  }

  balance -= amount;
  const balanceAfterCommit = balance;
  console.log(`[WITHDRAW-SAFE] amount=${amount} committed, balance=${balanceAfterCommit}`);

  await new Promise<void>((resolve) => setTimeout(resolve, 100));

  res.send(`Withdrew ${amount}. New balance: ${balanceAfterCommit}\n`);
});

app.get('/balance', (_req: Request, res: Response) => {
  res.send(`Balance: ${balance}\n`);
});

app.get('/reset', (_req: Request, res: Response) => {
  balance = STARTING_BALANCE;
  res.send(`Balance reset to ${balance}\n`);
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT} (PID ${process.pid})`);
});
