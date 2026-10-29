import { createApiServer } from "./index.js";

const port = Number(process.env.PORT ?? 8790);
createApiServer().listen(port, () => {
  console.log(`opp api listening on :${port}`);
});
