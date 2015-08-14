// Dependency for CLI
var program = require("commander");

// Dependencies for fetching search results
var request = require("request");
var cheerio = require("cheerio");

// Dependencies for rendering in the terminal
var marked = require("marked");
var TerminalRenderer = require("marked-terminal");

marked.setOptions({
  renderer: new TerminalRenderer()
});

program
  .version("0.0.1")
  .usage("[options] <term...>")
  .option("-t, --term <search term>", "String to search for.")
  .option("-l, --list <amount>", "Amount of search results to return. Default value is 5.", 5)
  .parse(process.argv);

if(!program.term){
  throw new Error("--term required!");
}

searchResults = [];
request.get("https://google.com/search?q=" + program.term, function(error, httpResponse, body){
  if (!error && httpResponse.statusCode === 200){
    var $ = cheerio.load(body);
    var result = {};

    console.log("\n\n");
    $("h3.r > a").each(function(index, obj){
      if (index < program.list){
        var markedString = "";
        markedString += "# " + index + ": " + $(obj).text() + "\n";

        markedString += "*http://" + $(obj).attr("href").split("/url?q=")[1].match(/([a-z0-9\-]+\.){1,2}[a-z]{2,4}/g)[0] + "*";

        console.log(marked(markedString));
      }else if (index === program.list){
        // Callback
        console.log("\n");
      }
    });
  }
});
