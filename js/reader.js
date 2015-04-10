var cleaned = false;
var fontSize = 24;

function startUp() {
  if (document.readyState == 'complete') {
    readerEnable();
  } else {
    window.setTimeout(startUp, 100);
  };
}

function removeAttr(el, attrs) {
  for (var i = 0; i < attrs.length; i++) {
    el.removeAttribute(attrs[i]);
  };
};

function removeElements(els) {
  for (var i = els.length - 1; i > -1; i--) {
    var el = els[i];
    el.parentNode.removeChild(el);
  };
};

function readerDisable() {
  if (cleaned) {
    location.reload();
  };
};

function readerEnable() {

  if (cleaned == false) {

    cleaned = true;

    document.body.className = 'reader';
    document.body.innerHTML = '<div id="reader-wrap">'+document.body.innerHTML+'</div>';

    removeElements(document.querySelectorAll('script'));
    removeElements(document.querySelectorAll('object'));
    removeElements(document.querySelectorAll('style'));
    removeElements(document.querySelectorAll('link[rel=stylesheet]'));
    removeElements(document.querySelectorAll('iframe'));
    
    var all = document.querySelectorAll('*');
    
    removeAttr(document.body, [ 'color', 'bgcolor', 'text', 'link', 'vlink', 'alink' ]);

    for (var i = all.length - 1; i > -1; i--) {
      var el = all[i];
      removeAttr(el, [ 'face', 'size', 'color', 'background', 'border', 'bgcolor', 'width', 'height', 'style' ]);
    };
    
    var images = document.querySelectorAll('img');

    for (var i = images.length - 1; i > -1; i--) {
      var el = images[i];
      if (el.width < 22 || el.height < 22) {
        el.className = 'hidden';
      };
    };
    // $('body.reader div').css('font-size', '8px');
    var elements = document.getElementsByClassName('reader');
    chrome.storage.sync.get('fontSize', function (obj) {
      console.log(obj);
      fontSize = obj.fontSize || fontSize;
      console.log('fontSize: ' + fontSize);
      elements[0].style.fontSize = fontSize + 'px';
    });
    console.log("enable " + fontSize);
  };
};

chrome.extension.onRequest.addListener(function(req, from) {
  if (req == 'reader-disable') {
    readerDisable();  
  } else if (req == 'reader-enable') {
    startUp();
  };
});
