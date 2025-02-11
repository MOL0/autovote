const config = {
	"url": "https://minecraft.buzz/vote/24"
};

const vote = async (page, username, debug) => {
	return new Promise(async resolve => {
		const date = new Date(),
			  hours = String(date.getHours()).padStart(2, "0"),
			  minutes = String(date.getMinutes()).padStart(2, "0");
		
		if (debug) console.log(`[DEBUG][site4] | ${hours}:${minutes}`);
		
		
		await page.goto(config.url, { waitUntil: "networkidle0" }).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site4.mjs - page.goto");
				console.error(error);
			}
		});
		
		
		const fullTitle = await page.evaluate(() => document.title).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site4.mjs - page.evaluate 1");
				console.error(error);
			}
		});
		
		if (debug) console.log("[DEBUG][site4] | titre :", fullTitle);
		
		await page.waitForSelector('iframe[title="reCAPTCHA"]').catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site4.mjs - page.waitForSelector");
				console.error(error);
			}
		});
		
		const interval = setInterval(async () => {
			const iframeElement = await page.$('iframe[title="reCAPTCHA"]').catch(error => {
				if (debug) {
					console.log("[DEBUG][error] | site4.mjs - page.$");
					console.error(error);
				}
			});
			
			const iframe = await iframeElement.contentFrame().catch(error => {
				if (debug) {
					console.log("[DEBUG][error] | site4.mjs - iframeElement.contentFrame");
					console.error(error);
				}
			});
			
			const captchaStatusElem = await iframe.$("#recaptcha-accessible-status").catch(error => {
				if (error.message === "Execution context was destroyed, most likely because of a navigation.") return;
				
				if (debug) {
					console.log("[DEBUG][error] | site4.mjs - iframe.$");
					console.error(error);
				}
			});
			
			const captchaStatus = await captchaStatusElem?.evaluate(el => el?.textContent).catch(error => {
				if (debug) {
					console.log("[DEBUG][error] | site4.mjs - captchaStatusElem?.evaluate");
					console.error(error);
				}
			});
			
			if (captchaStatus === "You are verified") {
				clearInterval(interval);
				
				if (debug) console.log("[DEBUG][site4] | captcha solved");
				
				
				// VOTE
				
				await page.type("#username-input", username).catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site4.mjs - page.type");
						console.error(error);
					}
				});
				await page.evaluate(() => document.querySelector(".btn.btn-primary.w-100")?.click()).catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site4.mjs - page.evaluate 2");
						console.error(error);
					}
				});
				
				
				// RESULTAT
				
				await page.waitForNavigation().catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site4.mjs - page.waitForNavigation");
						console.error(error);
					}
				});
				
				const value = await page.evaluate(() => document.querySelector(".modal-dialog.modal-confirm")?.getElementsByTagName("p")[0]?.textContent).catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site4.mjs - page.evaluate 3");
						console.error(error);
					}
				});
				
				if (value === "Thank you for voting!") {
					if (debug) console.log("[DEBUG][site4] | voted");
					
				} else if (value === "You already voted today!") {
					if (debug) console.log("[DEBUG][site4] | not voted - need to wait");
					
				} else if (value === "Proxy Detected. Voting using a proxy is not allowed.") {
					console.log("[site4][error] | not voted - vpn/proxy detected");
					
				} else {
					console.log("[site4][error] | " + error);
				}
				
				resolve();
			}
		}, 2000);
	});
};

export { vote };