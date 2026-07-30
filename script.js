document.addEventListener('DOMContentLoaded', function () {
  var wizard = document.getElementById('wizard');
  if (!wizard) return;

  var panels = Array.prototype.slice.call(wizard.querySelectorAll('.step-panel'));
  var bars = Array.prototype.slice.call(wizard.querySelectorAll('.wizard-progress .bar'));
  var btnBack = document.getElementById('btnBack');
  var btnNext = document.getElementById('btnNext');
  var btnSubmit = document.getElementById('btnSubmit');
  var stepNum = document.getElementById('stepNum');
  var stepName = document.getElementById('stepName');
  var errorBox = document.getElementById('wizardError');
  var stepNames = ['Trip details', 'Mobility', 'Access', 'Assistance', 'Contact'];
  var current = 0;

  // ---- Conditional show/hide ----
  wizard.addEventListener('change', function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.toggle) {
      var el = document.getElementById(t.dataset.toggle);
      if (el) el.classList.add('show');
      // hide the sibling "No" panel target if this is the Yes/No wheelchair pair
      if (t.id === 'wc-yes') { /* nothing to hide */ }
    }
    if (t.id === 'wc-no') {
      var y = document.getElementById('wcYes'); if (y) y.classList.remove('show');
    }
    if (t.id === 'wc-yes') {
      var yy = document.getElementById('wcYes'); if (yy) yy.classList.add('show');
    }
    if (t.dataset && t.dataset.untoggle) {
      var el2 = document.getElementById(t.dataset.untoggle);
      if (el2) el2.classList.remove('show');
    }
  });

  function showStep(i) {
    panels.forEach(function (p, idx) { p.classList.toggle('active', idx === i); });
    bars.forEach(function (b, idx) {
      b.classList.toggle('done', idx < i);
      b.classList.toggle('active', idx === i);
    });
    stepNum.textContent = (i + 1);
    stepName.textContent = stepNames[i];
    btnBack.style.display = i === 0 ? 'none' : '';
    btnNext.style.display = i === panels.length - 1 ? 'none' : '';
    btnSubmit.style.display = i === panels.length - 1 ? '' : 'none';
    errorBox.classList.remove('show');
    if (i === panels.length - 1) buildDispatchPreview();
    wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validateStep(i) {
    var panel = panels[i];
    var required = Array.prototype.slice.call(panel.querySelectorAll('[required]'));
    for (var j = 0; j < required.length; j++) {
      var f = required[j];
      if (f.type === 'radio') {
        var group = wizard.querySelectorAll('input[name="' + f.name + '"]');
        var checked = Array.prototype.some.call(group, function (g) { return g.checked; });
        if (!checked) return false;
      } else if (!f.value.trim()) {
        return false;
      }
    }
    return true;
  }

  btnNext.addEventListener('click', function () {
    if (!validateStep(current)) { errorBox.classList.add('show'); return; }
    if (current < panels.length - 1) { current++; showStep(current); }
  });
  btnBack.addEventListener('click', function () {
    if (current > 0) { current--; showStep(current); }
  });

  // ---- Auto dispatch-flag logic ----
  function val(name) {
    var el = wizard.querySelector('input[name="' + name + '"]:checked, select[name="' + name + '"], input[name="' + name + '"]');
    if (!el) return '';
    if (el.type === 'radio') {
      var checked = wizard.querySelector('input[name="' + name + '"]:checked');
      return checked ? checked.value : '';
    }
    return el.value;
  }

  function computeFlags() {
    var flags = [];
    var usesWC = val('Uses Wheelchair');
    var hasWC = val('Has Wheelchair');
    var wcType = val('Wheelchair Type');
    var pStairs = val('Stairs at Pickup');
    var pElev = val('Pickup Elevator');
    var dStairs = val('Stairs at Destination');
    var dElev = val('Destination Elevator');
    var transfer = val('Transfers Independently');

    if (usesWC === 'Yes') {
      flags.push('ADA wheelchair-accessible van with lift/ramp');
      if (hasWC && hasWC.indexOf('No') === 0) flags.push('Provide a loaner wheelchair');
      if (wcType === 'Bariatric') flags.push('Bariatric-capable vehicle & equipment');
      if (wcType === 'Electric / Power' || wcType === 'Scooter') flags.push('Confirm lift weight capacity for power device');
    }
    var stairHelp = false;
    if (pStairs === 'Yes' && pElev !== 'Yes') stairHelp = true;
    if (dStairs === 'Yes' && dElev !== 'Yes') stairHelp = true;
    if (stairHelp) flags.push('Extra helper for stairs (no elevator)');
    if (transfer && transfer.indexOf('No') === 0) flags.push('Driver assistance for transfer in/out of vehicle');

    var appt = val('Appointment Type');
    if (appt === 'Dialysis' || appt === 'Chemotherapy' || appt === 'Physical therapy') {
      flags.push('Likely recurring / standing schedule (' + appt + ')');
    }
    if (!flags.length) flags.push('Standard accessible pickup');
    return flags;
  }

  function buildDispatchPreview() {
    var flags = computeFlags();
    var list = document.getElementById('dispatchList');
    var box = document.getElementById('dispatchPreview');
    list.innerHTML = '';
    flags.forEach(function (f) {
      var li = document.createElement('li');
      li.textContent = f;
      list.appendChild(li);
    });
    box.style.display = '';
    var hidden = document.getElementById('dispatchFlagsField');
    if (hidden) hidden.value = flags.join('; ');
  }

  wizard.addEventListener('submit', function () {
    buildDispatchPreview(); // ensure hidden field is populated
    if (btnSubmit) { btnSubmit.disabled = true; btnSubmit.textContent = 'Sending…'; }
  });

  showStep(0);
});
