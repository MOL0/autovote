const config = {
	"url": "https://minecraftservers.page/servers/jartexnetwork/vote"
};

const vote = async (page, username, debug) => {
	return new Promise(async resolve => {
		const date = new Date(),
			  hours = String(date.getHours()).padStart(2, "0"),
			  minutes = String(date.getMinutes()).padStart(2, "0");
		
		if (debug) console.log(`[DEBUG][site5] | ${hours}:${minutes}`);
		
		
		await page.goto(config.url, { waitUntil: "networkidle0" }).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site5.mjs - page.goto");
				console.error(error);
			}
		});
		
		
		const fullTitle = await page.evaluate(() => document.title).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site5.mjs - page.evaluate 1");
				console.error(error);
			}
		});
		
		if (debug) console.log("[DEBUG][site5] | titre :", fullTitle);
		
		await page.waitForSelector('iframe[title="reCAPTCHA"]').catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site5.mjs - page.waitForSelector");
				console.error(error);
			}
		});
		
		const interval = setInterval(async () => {
			const iframeElement = await page.$('iframe[title="reCAPTCHA"]').catch(error => {
				if (debug) {
					console.log("[DEBUG][error] | site5.mjs - page.$ 1");
					console.error(error);
				}
			});
			
			const iframe = await iframeElement.contentFrame().catch(error => {
				if (debug) {
					console.log("[DEBUG][error] | site5.mjs - iframeElement.contentFrame");
					console.error(error);
				}
			});
			
			const captchaStatusElem = await iframe.$("#recaptcha-accessible-status").catch(error => {
				if (error.message === "Execution context was destroyed") return;
				
				if (debug) {
					console.log("[DEBUG][error] | site5.mjs - iframe.$");
					console.error(error);
				}
			});
			
			const captchaStatus = await captchaStatusElem?.evaluate(el => el?.textContent).catch(error => {
				if (debug) {
					console.log("[DEBUG][error] | site5.mjs - captchaStatusElem?.evaluate");
					console.error(error);
				}
			});
			
			if (captchaStatus === "You are verified") {
				clearInterval(interval);
				
				if (debug) console.log("[DEBUG][site5] | captcha solved");
				
				
				// VOTE
				
				await page.type("input[name=minecraft_name]", username).catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site5.mjs - page.type");
						console.error(error);
					}
				});
				await page.evaluate(() => document.querySelector("button.mt-3")?.click()).catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site5.mjs - page.evaluate 2");
						console.error(error);
					}
				});
				
				
				// RESULTAT
				
				await page.waitForNavigation().catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site5.mjs - page.waitForNavigation 1");
						console.error(error);
					}
				});
				await page.waitForNavigation().catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site5.mjs - page.waitForNavigation 2");
						console.error(error);
					}
				});
				
				const voted = await page.$("#voteSuccessModal").catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site5.mjs - page.$ 2");
						console.error(error);
					}
				});
				
				const error = await page.evaluate(() => document.getElementsByClassName("alert alert-danger")[0]?.textContent?.trim()).catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site5.mjs - page.evaluate 3");
						console.error(error);
					}
				});
				
				if (voted) {
					if (debug) console.log("[DEBUG][site5] | voted");
					
				} else if (error === "You can only vote once per day") {
					if (debug) console.log("[DEBUG][site5] | not voted - need to wait");
					
				} else if (!error) {
					if (debug) console.log("[DEBUG][site5] | error undefined - refreshing the page");
					
					await vote(page, username, debug);
					
				} else {
					console.log("[site5][error] | " + error);
				}
				
				resolve();
			}
		}, 2000);
	});
};

export { vote };