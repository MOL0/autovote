const config = {
	"url": "https://best-minecraft-servers.co/server-jartexnetwork.4402/vote"
};

const vote = async (page, username, debug) => {
	return new Promise(async resolve => {
		const date = new Date(),
			  hours = String(date.getHours()).padStart(2, "0"),
			  minutes = String(date.getMinutes()).padStart(2, "0");
		
		if (debug) console.log(`[DEBUG][site2] | ${hours}:${minutes}`);
		
		
		await page.goto(config.url, { waitUntil: "networkidle0" }).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site2.mjs - page.goto");
				console.error(error);
			}
		});
		
		
		const fullTitle = await page.evaluate(() => document.title).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site2.mjs - page.evaluate 1");
				console.error(error);
			}
		});
		
		if (debug) console.log("[DEBUG][site2] | titre :", fullTitle);
		
		
		// COOKIES
		
		const cookiesElement = await page.$("#cmpwrapper").catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site2.mjs - page.$");
				console.error(error);
			}
		});
		
		if (cookiesElement) {
			await page.evaluate(() => document.getElementById("cmpwrapper")?.shadowRoot?.getElementById("cmpbntyestxt")?.click()).catch(error => {
				if (debug) {
					console.log("[DEBUG][error] | site2.mjs - page.evaluate 2");
					console.error(error);
				}
			});
		}
		
		
		// VOTE
		
		await page.type("input[name=username]", username).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site2.mjs - page.type");
				console.error(error);
			}
		});
		await page.evaluate(() => document.getElementsByClassName("ui button submit")[0]?.click()).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site2.mjs - page.evaluate 3");
				console.error(error);
			}
		});
		
		
		// RESULTAT
		
		await page.waitForNavigation().catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site2.mjs - page.waitForNavigation 1");
				console.error(error);
			}
		});
		
		const error = await page.evaluate(() => document.getElementsByClassName("ui error message")[0]?.textContent?.trim()).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site2.mjs - page.evaluate 4");
				console.error(error);
			}
		});
		
		if (!error) {
			await page.waitForNavigation().catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site2.mjs - page.waitForNavigation 2");
				console.error(error);
			}
		});
			
			if (debug) console.log("[DEBUG][site2] | voted");
			
		} else if (error === "Error You must wait until tomorrow before voting again!") {
			if (debug) console.log("[DEBUG][site2] | not voted - need to wait");
			
		} else {
			console.log("[site2][error] | " + error);
		}
		
		resolve();
	});
};

export { vote };