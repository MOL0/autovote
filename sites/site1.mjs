const config = {
	"url": "https://topminecraftservers.org/vote/18687"
};

const vote = (page, username, debug) => {
	return new Promise(async resolve => {
		const date = new Date(),
			  hours = String(date.getHours()).padStart(2, "0"),
			  minutes = String(date.getMinutes()).padStart(2, "0");
		
		if (debug) console.log(`[DEBUG][site1] | ${hours}:${minutes}`);
		
		
		page.goto(config.url).catch(error => {
			if (error.message !== "Navigating frame was detached" && debug) {
				console.log("[DEBUG][error] | site1.mjs - page.goto");
				console.error(error);
			}
		});
		
		await page.waitForNavigation().catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site1.mjs - page.waitForNavigation 1");
				console.error(error);
			}
		});
		
		await page.waitForNetworkIdle().catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site1.mjs - page.waitForNetworkIdle");
				console.error(error);
			}
		});
		
		
		const title = await page.evaluate(() => document.title).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site1.mjs - page.evaluate 1");
				console.error(error);
			}
		});
		
		if (title !== "Vote for JartexNetwork | topt.jartex.fun Minecraft Server") await page.waitForNavigation().catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site1.mjs - page.waitForNavigation 2");
				console.error(error);
			}
		});
		
		
		const fullTitle = await page.evaluate(() => document.title).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site1.mjs - page.evaluate 2");
				console.error(error);
			}
		});
		
		if (debug) console.log("[DEBUG][site1] | titre :", fullTitle);
		
		await page.waitForSelector("#username").catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site1.mjs - page.waitForSelector 1");
				console.error(error);
			}
		});
		
		
		const alreadyVotedValue = await page.evaluate(() => document.getElementsByClassName("btn btn-primary btn-lg btn-block")[0]?.textContent?.trim()).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site1.mjs - page.evaluate 3");
				console.error(error);
			}
		});
		
		if (alreadyVotedValue === "Thanks for voting!") {
			if (debug) console.log("[DEBUG][site1] | not voted - need to wait");
			
			return resolve();
		}
		
		
		// VOTE
		
		await page.type("#username", username).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site1.mjs - page.type");
				console.error(error);
			}
		});
		await page.evaluate(() => document.getElementById("voteButton")?.click()).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site1.mjs - page.evaluate 4");
				console.error(error);
			}
		});
		
		
		// RESULTAT
		
		await page.waitForSelector(".alert.alert-danger, .btn.btn-primary.btn-lg.btn-block").catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site1.mjs - page.waitForSelector 2");
				console.error(error);
			}
		});
		
		const value = await page.evaluate(() => document.getElementsByClassName("btn btn-primary btn-lg btn-block")[0]?.textContent?.trim()).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site1.mjs - page.evaluate 5");
				console.error(error);
			}
		});
		const error = await page.evaluate(() => document.getElementsByClassName("alert alert-danger")[0]?.textContent?.trim()).catch(error => {
			if (debug) {
				console.log("[DEBUG][error] | site1.mjs - page.evaluate 6");
				console.error(error);
			}
		});
		
		if (value === "Thanks for voting!") {
			if (debug) console.log("[DEBUG][site1] | voted");
			
		} else if (error?.startsWith("Someone has already voted for this server using the username")) {
			if (debug) console.log("[DEBUG][site1] | not voted - need to wait");
			
		} else if (error === "You either waited too long to submit the form or you failed the captcha test.") {
			if (debug) console.log("[DEBUG][site1] | need to refresh the page");
			
			await vote(page, username, debug);
			
		} else if (error) {
			console.log("[site1][error] | " + error);
			
		} else {
			if (debug) console.log("[DEBUG][site1] | not voted - jsp pk");
		}
		
		resolve();
	});
};

export { vote, config };