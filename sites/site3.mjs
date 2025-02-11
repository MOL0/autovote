const config = {
	"url": "https://servers-minecraft.net/server-jartexnetwork.955/vote"
};

const vote = async (page, username, debug) => {
	return new Promise(async resolve => {
		const date = new Date(),
			  hours = String(date.getHours()).padStart(2, "0"),
			  minutes = String(date.getMinutes()).padStart(2, "0");
		
		if (debug) console.log(`[DEBUG][site3] | ${hours}:${minutes}`);
		
		
		await page.goto(config.url, { waitUntil: "networkidle0" }).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site3.mjs - page.goto");
				console.error(error);
			}
		});
		
		
		const fullTitle = await page.evaluate(() => document.title).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site3.mjs - page.evaluate 1");
				console.error(error);
			}
		});
		
		if (debug) console.log("[DEBUG][site3] | titre :", fullTitle);
		
		
		const alreadyVoted = await page.$(".bg-blue-100.text-blue-500.font-bold.flex.items-center.py-4.px-6.mt-6.rounded-md.border.border-blue-200").catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site3.mjs - page.$ 1");
				console.error(error);
			}
		});
		
		if (alreadyVoted) {
			if (debug) console.log("[DEBUG][site3] | not voted - need to wait");
			
			return resolve();
		}
		
		
		// scroll jusqu'à l'input pour que la captcha apparaisse
		
		await page.waitForSelector("#username").catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site3.mjs - page.waitForSelector 1");
				console.error(error);
			}
		});
		
		await page.evaluate(() => document.getElementById("username")?.scrollIntoView()).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site3.mjs - page.evaluate 2");
				console.error(error);
			}
		});
		
		
		await page.waitForSelector('iframe[title="reCAPTCHA"]').catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site3.mjs - page.waitForSelector 2");
				console.error(error);
			}
		});
		
		const interval = setInterval(async () => {
			const iframeElement = await page.$('iframe[title="reCAPTCHA"]').catch(error => {
				if (debug) {
					console.log("[DEBUG][error] | site3.mjs - page.$ 2");
					console.error(error);
				}
			});
			
			const iframe = await iframeElement.contentFrame().catch(error => {
				if (debug) {
					console.log("[DEBUG][error] | site3.mjs - iframeElement.contentFrame");
					console.error(error);
				}
			});
			
			const captchaStatusElem = await iframe.$("#recaptcha-accessible-status").catch(error => {
				if (error.message === "Execution context was destroyed, most likely because of a navigation." ||
					error.message === "Protocol error (DOM.describeNode): Cannot find context with specified id") return;
				
				if (debug) {
					console.log("[DEBUG][error] | site3.mjs - page.$ 3");
					console.error(error);
				}
			});
			
			const captchaStatus = await captchaStatusElem?.evaluate(el => el?.textContent).catch(error => {
				if (debug) {
					console.log("[DEBUG][error] | site3.mjs - captchaStatusElem?.evaluate");
					console.error(error);
				}
			});
			
			if (captchaStatus === "You are verified") {
				clearInterval(interval);
				
				if (debug) console.log("[DEBUG][site3] | captcha solved");
				
				
				// VOTE
				
				await page.type("#username", username).catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site3.mjs - page.type");
						console.error(error);
					}
				});
				await page.evaluate(() => document.getElementById("voteSubmitBtn")?.click()).catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site3.mjs - page.evaluate 3");
						console.error(error);
					}
				});
				
				
				// RESULTAT
				
				await page.waitForNavigation().catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site3.mjs - page.waitForNavigation 1");
						console.error(error);
					}
				});
				
				const errorElem = await page.$(".bg-red-100.text-red-500.mb-6.font-bold.flex.items-center.py-4.px-6.rounded-md.border.border-red-200").catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site3.mjs - page.$ 4");
						console.error(error);
					}
				});
				
				if (errorElem) {
					const error = await errorElem.evaluate(el => el?.textContent?.trim()).catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site3.mjs - errorElem.evaluate");
						console.error(error);
					}
				});
					
					if (error === "You must wait until tomorrow before voting again!") {
						if (debug) console.log("[DEBUG][site3] | not voted - need to wait");
					} else {
						console.log("[site3][error] | " + value);
					}
				} else {
					await page.waitForNavigation().catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site3.mjs - page.waitForNavigation 2");
						console.error(error);
					}
				});
					
					const value = await page.evaluate(() => document.getElementById("ct-popup-title-1")?.textContent).catch(error => {
						if (debug) {
							console.log("[DEBUG][error] | site3.mjs - page.evaluate 4");
							console.error(error);
						}
					});
					
					if (value === "You voted for JartexNetwork! - Thank you!") {
						if (debug) console.log("[DEBUG][site3] | voted");
					} else {
						if (debug) console.log("[DEBUG][site3] | not voted - jsp pk");
					}
				}
				
				resolve();
			}
		}, 2000);
	});
};

export { vote };