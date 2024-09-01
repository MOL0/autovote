import * as fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { connect } from "puppeteer-real-browser";





// options
const username = "MOL0";
const debug = true;


import * as site1 from "./sites/site1.mjs";
import * as site2 from "./sites/site2.mjs";
import * as site3 from "./sites/site3.mjs";
import * as site4 from "./sites/site4.mjs";
import * as site5 from "./sites/site5.mjs";
import * as site6 from "./sites/site6.mjs";
import * as site7 from "./sites/site7.mjs";



puppeteer.use(StealthPlugin());
const pathToExtension = path.join(process.cwd(), "extension");



(async () => {
	let browser, browser2;
	
	function launch() {
		return new Promise(async resolve => {
			browser = await puppeteer.launch({
				headless: false,
				defaultViewport: null,
				args: [
					`--disable-extensions-except=${pathToExtension}`,
					`--load-extension=${pathToExtension}`,
					"--enable-automation",
					"--no-sandbox"
				]
			}).catch(error => {
				if (debug) {
					console.log("[DEBUG][error] | index.mjs - puppeteer.launch");
					console.error(error);
				}
			});
			
			const response = await connect({
				headless: "auto",
				turnstile: true
			}).catch(error => {
				if (debug) {
					console.log("[DEBUG][error] | index.mjs - connect");
					console.error(error);
				}
			});
			
			browser2 = response.browser;
			
			resolve();
		});
	}
	
	function setupPage(page) {
		return new Promise(async resolve => {
			page.setDefaultNavigationTimeout(0);
			page.setDefaultTimeout(0);
			
			await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36").catch(error => {
				if (debug) {
					console.log("[DEBUG][error] | index.mjs - page.setUserAgent");
					console.error(error);
				}
			});
			
			resolve();
		});
	}
	
	
	let i = 0;
	
	async function vote() {
		await launch();
		
		
		const pages = await browser.pages(),
			  page = pages[0];
		
		await setupPage(page);
		
		const pages2 = await browser2.pages(),
			  page2 = pages2[0];
		
		await setupPage(page2);
		
		
		console.log("starting to vote");
		
		
		await site1.vote(page2, username, debug);
		await site3.vote(page, username, debug);
		await site4.vote(page, username, debug);
		await site5.vote(page, username, debug);
		await site6.vote(page2, username, debug);
		await site7.vote(page, username, debug, 0);
		
		setTimeout(async () => {
			await site2.vote(page, username, debug);
			
			await browser.close().catch(error => {
				if (debug) {
					console.log("[DEBUG][error] | index.mjs - browser.close");
					console.error(error);
				}
			});
			
			await browser2.close().catch(error => {
				if (debug) {
					console.log("[DEBUG][error] | index.mjs - browser2.close");
					console.error(error);
				}
			});
			
			console.log("finished voting for today");
			
			if (debug) console.log("----------------------");
			
			i++;
		}, i * 5 * 60 * 1000);
	}
	
	vote();
	
	setInterval(vote, 24 * 60 * 60 * 1000);
})();