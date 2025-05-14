// This is a template for a Node.js scraper on morph.io (https://morph.io)

var cheerio = require("cheerio");
var request = require("request");
var sqlite3 = require("sqlite3").verbose();

const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const options = new chrome.Options();
options.addArguments('--headless', '--disable-gpu', '--no-sandbox');

(async function scrapeAdvertisements() {
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        const url = "https://portal.planbuild.tas.gov.au/external/advertisement/search";
        await driver.get(url);

        // Wait for the page to load (adjust the timeout as needed)
        await driver.sleep(10000);

        // Find all rows with the specified CSS class
        const rows = await driver.findElements(By.css('.row.advertisement-result-row'));

        for (let row of rows) {
            // Extract the ID from the row's 'id' attribute
            const advertisementId = await row.getAttribute('id');
            if (!advertisementId) continue;

            // Construct the detail page URL
            const detailUrl = `https://portal.planbuild.tas.gov.au/external/advertisement/${advertisementId}`;
            console.log(`Fetching details for ID: ${advertisementId} from ${detailUrl}`);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        // Quit the WebDriver instance
        await driver.quit();
    }
})();



/*

function initDatabase(callback) {
	// Set up sqlite database.
	var db = new sqlite3.Database("data.sqlite");
	db.serialize(function() {
		db.run("CREATE TABLE IF NOT EXISTS data (name TEXT)");
		callback(db);
	});
}

function updateRow(db, value) {
	// Insert some data.
	var statement = db.prepare("INSERT INTO data VALUES (?)");
	statement.run(value);
	statement.finalize();
}

function readRows(db) {
	// Read some data.
	db.each("SELECT rowid AS id, name FROM data", function(err, row) {
		console.log(row.id + ": " + row.name);
	});
}

function fetchPage(url, callback) {
	// Use request to read in pages.
	request(url, function (error, response, body) {
		if (error) {
			console.log("Error requesting page: " + error);
			return;
		}

		callback(body);
	});
}

function run(db) {
	// Use request to read in pages.
	fetchPage("https://morph.io", function (body) {
		// Use cheerio to find things in the page with css selectors.
		var $ = cheerio.load(body);

		var elements = $("div.media-body span.p-name").each(function () {
			var value = $(this).text().trim();
			updateRow(db, value);
		});

		readRows(db);

		db.close();
	});
}

initDatabase(run);
*/
