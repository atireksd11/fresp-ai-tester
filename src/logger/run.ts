import { runAudit } from "../core/core.js";
import { startReportServer } from "../apply/listen.js";

await runAudit();
startReportServer();
