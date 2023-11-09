import { PORT } from "./constants";
import createServer from "./utils/server";
import log from "./utils/logger";

const app = createServer();

app.listen(PORT, () => {
  log.info(`Population statistics server started on http://localhost:${PORT}`);
});
