var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.use(express.static(__dirname + '/public/'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/covid', function (req, res) {

  url = 'https://www.mohfw.gov.in/';
  let result = [];
  let totalResult = [];

  request(url, function (error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);
      let params = {};
      const tableRows = $('.table-striped').children('tbody').children('tr:not(.total_row)').toArray();
      const test = $('.site-stats-count').children('ul').children().toArray();

      params.totActive = test[0].children[3].children[0].data;
      params.totCured = test[1].children[3].children[0].data;
      params.totDeath = test[2].children[3].children[0].data;
      params.totMig = test[3].children[3].children[0].data;
      totalResult.push(params); 
      
      for (let i = 0; i <= 31; i++) {
        console.log(i);
        let obj = {};
        var cells = tableRows[i].children.filter((cell) => cell.name === 'td');
        obj.id = parseInt(cells[0].children[0].data);
        obj.stateName = cells[1].children[0].data;
        obj.active = parseInt(cells[2].children[0].data);
        obj.recovered = parseInt(cells[3].children[0].data);
        obj.death = parseInt(cells[4].children[0].data);
        result.push(obj);
      }

    }
    console.log("length ", result.length);
    res.render('index', { name: "Vinith", result: result, totRes : totalResult });

  })
});

app.listen('3000')
console.log('Magic happens on port 3000');
exports = module.exports = app;