var fontSize = 24;
chrome.storage.sync.get('fontSize', function (obj) {
  fontSize = obj.fontSize || fontSize;
});

update();

// code snippet from http://stackoverflow.com/questions/469357/html-text-input-allow-only-numeric-input
$(document).ready(function() {
  $('#font-size').keydown(function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) ||
        // Allow: Ctrl+C
        (e.keyCode == 67 && e.ctrlKey === true) ||
        // Allow: Ctrl+X
        (e.keyCode == 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }

    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
    // alert('fontSize: ' + e.value);
    // localStorage.fontSize = document.getElementById('font-size').value;
    // alert('fontSize: ' + localStorage.fontSize);
  });

  $('#font-size').keyup(function (e) {
    fontSize = document.getElementById('font-size').value;
    update();
  });
});

function update() {
  localStorage.fontSize = fontSize;
  document.getElementById('font-size').value = fontSize;
  document.getElementById('font-px').innerHTML = fontSize + 'px';
  saveChange(fontSize);
  fontSize = Math.max(12, fontSize);
  $('#font-px').css('font-size', fontSize + 'px');
};

function saveChange(fontSize) {
  // Get a value saved in a form.
  // Check that there's some code there.
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({'fontSize': fontSize}, function() {
    // Notify that we saved.
    console.log('Settings saved');
  });
}
