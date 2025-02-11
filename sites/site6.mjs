const config = {
	"url": "https://minecraft-mp.com/server/52462/vote/"
};

const vote = async (page, username, debug) => {
	return new Promise(async resolve => {
		const date = new Date(),
			  hours = String(date.getHours()).padStart(2, "0"),
			  minutes = String(date.getMinutes()).padStart(2, "0");
		
		if (debug) console.log(`[DEBUG][site6] | ${hours}:${minutes}`);
		
		
		page.goto(config.url).catch(error => {
			if (error.message !== "Navigating frame was detached" && debug) {
				console.log("[DEBUG][error] | site6.mjs - page.goto");
				console.error(error);
			}
		});
		
		await page.waitForNetworkIdle().catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site6.mjs - page.waitForNetworkIdle");
				console.error(error);
			}
		});
		
		
		const title = await page.evaluate(() => document.title).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site6.mjs - page.evaluate 1");
				console.error(error);
			}
		});
		
		if (title !== "Vote for JartexNetwork | Server") await page.waitForNavigation().catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site6.mjs - page.waitForNavigation 1");
				console.error(error);
			}
		});
		
		
		const fullTitle = await page.evaluate(() => document.title).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site6.mjs - page.evaluate 2");
				console.error(error);
			}
		});
		
		if (debug) console.log("[DEBUG][site6] | titre :", fullTitle);
		
		
		
		// COOKIES
		
		await page.waitForSelector(".fc-button.fc-cta-consent.fc-primary-button", { timeout: 60 * 1000 }).catch();
		
		const cookiesElement = await page.$(".fc-button.fc-cta-consent.fc-primary-button").catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site6.mjs - page.$ 1");
				console.error(error);
			}
		});
		
		if (cookiesElement) await cookiesElement.click().catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site6.mjs - cookiesElement.click");
				console.error(error);
			}
		});
		
		
		const privacyElement = await page.$("#accept").catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site6.mjs - page.$ 2");
				console.error(error);
			}
		});
		
		const checked = await page.evaluate(() => document.getElementById("accept")?.checked).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site6.mjs - page.evaluate 3");
				console.error(error);
			}
		});
		
		if (privacyElement && !checked) await privacyElement.click().catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site6.mjs - privacyElement.click");
				console.error(error);
			}
		});
		
		
		
		await page.waitForSelector(".cf-turnstile").catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site6.mjs - page.waitForSelector");
				console.error(error);
			}
		});
		
		const interval = setInterval(async () => {
			const captchaValue = await page.evaluate(() => document.getElementsByClassName("cf-turnstile")[0]?.children[0]?.querySelector("input[name=cf-turnstile-response]")?.value).catch(error => {
				if (debug) {
					console.log("[DEBUG][error] | site6.mjs - page.evaluate 4");
					console.error(error);
				}
			});
			
			if (captchaValue) {
				clearInterval(interval);
				
				if (debug) console.log("[DEBUG][site6] | captcha solved");
				
				// VOTE
				
				await page.type("#nickname", username).catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site6.mjs - page.type");
						console.error(error);
					}
				});
				await page.evaluate(() => document.querySelector(".btn.btn-primary")?.click()).catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site6.mjs - page.evaluate 5");
						console.error(error);
					}
				});
				
				
				// RESULTAT
				
				await page.waitForNavigation().catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site6.mjs - page.waitForNavigation 2");
						console.error(error);
					}
				});
				
				const value = await page.evaluate(() => document.querySelector("p>strong")?.textContent?.trim()).catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site6.mjs - page.evaluate 6");
						console.error(error);
					}
				});
				const error = await page.evaluate(() => document.querySelector('div.alert.alert-danger[role="alert"]')?.textContent?.trim()).catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site6.mjs - page.evaluate 7");
						console.error(error);
					}
				});
				
				if (value === "Thank you for your vote! Score of each server is updated every 10 minutes.") {
					if (debug) console.log("[DEBUG][site6] | voted");
					
				} else if (error === "You have already voted for this server today (Error code 2).") {
					if (debug) console.log("[DEBUG][site6] | not voted - need to wait");
					
				} else if (error) {
					console.log("[site6][error] | " + error);
					
				} else {
					if (debug) console.log("[DEBUG][site6] | not voted - jsp pk");
				}
				
				resolve();
			}
		}, 2000);
	});
};

export { vote };