const config = {
	"url": "https://minecraft-server-list.com/server/288369/vote/"
};

const vote = async (page, username, debug, i) => {
	return new Promise(async resolve => {
		const date = new Date(),
			  hours = String(date.getHours()).padStart(2, "0"),
			  minutes = String(date.getMinutes()).padStart(2, "0");
		
		if (debug) console.log(`[DEBUG][site7] | ${hours}:${minutes}`);
		
		
		await page.goto(config.url, { waitUntil: "networkidle0" }).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site7.mjs - page.goto");
				console.error(error);
			}
		});
		
		
		const fullTitle = await page.evaluate(() => document.title).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site7.mjs - page.evaluate 1");
				console.error(error);
			}
		});
		
		if (debug) console.log("[DEBUG][site7] | titre :", fullTitle);
		
		// COOKIES
		
		const cookiesElement = await page.$(".fc-button.fc-cta-consent.fc-primary-button").catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site7.mjs - page.$");
				console.error(error);
			}
		});
		
		if (cookiesElement) {
			await page.evaluate(() => document.querySelector(".fc-button.fc-cta-consent.fc-primary-button")?.click()).catch(error => {
				if (debug) {
					console.log("[DEBUG][error] | site7.mjs - page.evaluate 2");
					console.error(error);
				}
			});
		}
		
		
		// VOTE
		
		setTimeout(async () => {
			await page.type("#ignn", username).catch(error => {
				if (debug) {
					console.log("[DEBUG][error] | site7.mjs - page.type");
					console.error(error);
				}
			});
			await page.evaluate(() => document.getElementById("voteButton")?.click()).catch(error => {
				if (debug) {
					console.log("[DEBUG][error] | site7.mjs - page.evaluate 3");
					console.error(error);
				}
			});
			
			
			// RESULTAT
			
			const interval = setInterval(async () => {
				const value = await page.evaluate(() => document.getElementById("voteerror")?.textContent).catch(error => {
					if (debug) {
						console.log("[DEBUG][error] | site7.mjs - page.evaluate 4");
						console.error(error);
					}
				});
				
				if (value !== "Please Wait....") {
					clearInterval(interval);
					
					if (value === "Thanks, Vote Registered") {
						if (debug) console.log("[DEBUG][site7] | voted");
						
					} else if (value === "We cannot verify your vote due to a low browser score. Try another browser or try login to Google to raise your score.") {
						if (debug) console.log("[DEBUG][site7] | need to refresh the page");
						
						setTimeout(async () => {
							await vote(page, username, debug, i + 1);
						}, i * 1000);
						
					} else if (value.startsWith("IP already voted today!") || value.startsWith("Username already voted today!")) {
						if (debug) console.log("[DEBUG][site7] | not voted - need to wait");
						
					} else {
						console.log("[site7][error] | " + value);
					}
					
					resolve();
				}
			}, 2000);
		}, i * 1000);
	});
};

export { vote };