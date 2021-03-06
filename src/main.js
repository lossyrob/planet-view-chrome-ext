var d3 = require('d3');
var queue = require('queue-async');

var Globe = require('./globe');
var Player = require('./player');
var Scene = require('./scene');

// navigation to other chrome pages
d3.selectAll('a[data-hook="chrome-link"]').on('click', function() {
  d3.event.preventDefault();
  chrome.tabs.update({url: d3.event.currentTarget.href});
});

// trigger data loading
queue()
    .defer(d3.json, 'assets/data/world-110m.json')
    .defer(d3.json, 'https://www.planet.com/gallery.json')
    .await(ready);

/**
 * Handle loaded data.
 * @param {Error} err Network error.
 * @param {Object} world Land and country data.
 * @param {Document} gallery Gallery feed.
 */
function ready(err, world, gallery) {
  if (err) {
    console.error(err);
    return;
  }
  var scene = new Scene('#scene');
  var globe = new Globe('#map', world);

  var entries = {};
  var entry;
  for (var i = 0, ii = gallery.length; i < ii; ++i) {
    entry = gallery[i];
    // assume link is stable identifier
    entry.id = entry.link;
    entries[entry.id] = entry;
  }

  var player = new Player(entries, scene, globe);

  d3.select('#map').on('click', function() {
    player.new();
  });

  player.new();
}
