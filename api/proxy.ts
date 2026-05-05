import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ChildProcess, spawn } from "node:child_process";
import http from "node:http";
import { join } from "node:path";

const BINARY_PATH = join(process.cwd(), "dist", "main");
const HEALTH_CHECK_ENDPOINT = "/api/health";
const STARTUP_TIMEOUT_MS = 10_000;
const PORT = 8090;

let goProcess: ChildProcess | null = null;
let goReady = false;

async function waitForGoApp(url: string, timeout: number): Promise<void> {
	const startTime = Date.now();
	return new Promise((resolve, reject) => {
		const attempt = () => {
			http
				.get(url, (res) => {
					if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
						resolve();
					} else {
						scheduleNextAttempt();
					}
				})
				.on("error", scheduleNextAttempt);
		};

		const scheduleNextAttempt = (err?: Error) => {
			if (Date.now() - startTime > timeout) {
				return reject(err || new Error("Health check timed out."));
			}
			setTimeout(attempt, 50);
		};

		attempt();
	});
}

async function init() {
	const startTime = performance.now();

	try {
		goProcess = spawn(
			BINARY_PATH,
			["--dir=/tmp/pb_data", "serve", `--http=0.0.0.0:${PORT}`],
			{
				env: { ...process.env },
				stdio: "pipe",
			},
		);

		goProcess.stdout?.on("data", (data) =>
			console.log(`[Go]: ${data.toString().trim()}`),
		);
		goProcess.stderr?.on("data", (data) =>
			console.error(`[Go ERR]: ${data.toString().trim()}`),
		);

		goProcess.on("exit", (code, signal) => {
			console.log(
				`[Node Proxy]: Go process exited with code ${code}, signal ${signal}.`,
			);
			goProcess = null;
		});

		const healthCheckURL = `http://localhost:${PORT}${HEALTH_CHECK_ENDPOINT}`;
		await waitForGoApp(healthCheckURL, STARTUP_TIMEOUT_MS);

		goReady = true;
		console.log(
			`[Node Proxy]: Go app ready in ${(performance.now() - startTime).toFixed(2)}ms.`,
		);
	} catch (err) {
		console.error("[Node Proxy ERR]: Fatal error during initialization:", err);
		goProcess?.kill();
		goProcess = null;
		throw err;
	}
}

const startupPromise = init();
await startupPromise;

export default async function handler(req: VercelRequest, res: VercelResponse) {
	try {
		if (!goReady) {
			await startupPromise;
		}

		if (!goProcess || goProcess.killed) {
			res
				.status(503)
				.send("Service Unavailable: The backend service is not running.");
			return;
		}

		const proxyReq = http.request(
			{
				hostname: "localhost",
				port: PORT,
				path: req.url,
				method: req.method,
				headers: req.headers,
			},
			(proxyRes) => {
				res.writeHead(proxyRes.statusCode ?? 500, proxyRes.headers);
				proxyRes.pipe(res, { end: true });
			},
		);

		proxyReq.on("error", (err) => {
			console.error("[Node Proxy ERR]: Error proxying request:", err);
			if (!res.headersSent) {
				res.status(502).send("Bad Gateway");
			}
			res.end();
		});

		req.pipe(proxyReq, { end: true });
	} catch (error) {
		console.error("[Node Proxy ERR]: Handler error:", error);
		if (!res.headersSent) {
			res.status(500).send("Internal Server Error: Initialization failed.");
		}
	}
}

process.on("SIGTERM", () => {
	if (goProcess) {
		console.log("[Node Proxy]: SIGTERM received, shutting down Go process.");
		goProcess.kill("SIGTERM");
	}
});
