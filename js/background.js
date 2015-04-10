// Getter
function get(name, def) {
  var val = localStorage[name];
  if (typeof val != 'undefined') {
    return JSON.parse(val);
  };
  if (typeof def != 'undefined') {
    set(name, def);
    return def;
  };
  return null;
};

// Setter.
function set(name, val) {
  localStorage[name] = JSON.stringify(val);
  return val;
};

// Updates.
function update(tabId) {
  chrome.tabs.get(tabId, function(Tab) {
    var enabled = isReaderEnabled(Tab.url);
    var icon;

    if (enabled) {
      icon = 'icon-enabled.png';
      chrome.tabs.sendRequest(Tab.id, "reader-enable");
    } else {
      icon = 'icon-disabled.png';
      chrome.tabs.sendRequest(Tab.id, "reader-disable");
    };

    chrome.pageAction.setIcon({
      'tabId': Tab.id,
      'path': icon
    });

    chrome.pageAction.show(Tab.id);

  });
};

// Reader status.
function isReaderEnabled(url) {
  return get('reader@'+url);
};

function enableReader(url) {
  return set('reader@'+url, true);
};

function disableReader(url) {
  return set('reader@'+url, false);
};

function toggleReader(url) {
  // Toggle
  if (isReaderEnabled(url) == true) {
    disableReader(url);
  } else {
    enableReader(url);
  };
};

chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:' + command);
  console.log(command);
  chrome.storage.sync.get('fontSize', function (obj) {
    var fontSize = obj.fontSize || 24;
    if (command === "increase-fontsize") {
      fontSize += 1;
    }
    if (command === "decrease-fontsize") {
      fontSize -= 1;
    }
    if (command === 'reset-fontsize') {
      fontSize = 24;
    }
    chrome.storage.sync.set({'fontSize': fontSize}, function() {
      // Notify that we saved.
      console.log('new font size: ' + fontSize);
    });
  });
});

// Fired when the address-bar icon is clicked.
chrome.pageAction.onClicked.addListener(function(Tab) {
  toggleReader(Tab.url);
  update(Tab.id);
});

chrome.tabs.onSelectionChanged.addListener(update);

chrome.tabs.onUpdated.addListener(update);

chrome.tabs.getSelected(null, update);

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  //console.log(response);
});
