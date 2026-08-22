import { runAudit } from "../core/core.js";
import { startReportServer, reportUrl } from "../apply/listen.js";

await runAudit();
startReportServer();
setTimeout(function () {
  console.log("report " + reportUrl());
}, 200);
