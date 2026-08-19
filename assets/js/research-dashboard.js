(function () {
  const dashboard = document.querySelector('[data-research-dashboard]');
  if (!dashboard) return;

  const frame = dashboard.querySelector('[data-report-frame]');
  const title = dashboard.querySelector('[data-report-title]');
  const openLink = dashboard.querySelector('[data-open-report]');
  const menuButtons = Array.from(dashboard.querySelectorAll('[data-menu-toggle]'));
  const reportLinks = Array.from(dashboard.querySelectorAll('[data-report]'));

  function setMenu(open) {
    dashboard.classList.toggle('menu-open', open);
    menuButtons.forEach((button) => button.setAttribute('aria-expanded', String(open)));
  }

  function selectReport(link, updateHistory) {
    if (!link) return;
    const reportTitle = link.dataset.title || link.textContent.trim();
    const reportUrl = link.dataset.report;

    reportLinks.forEach((item) => {
      const active = item === link;
      item.classList.toggle('active', active);
      if (active) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });

    title.textContent = reportTitle;
    frame.title = reportTitle;
    if (frame.getAttribute('src') !== reportUrl) frame.setAttribute('src', reportUrl);
    openLink.href = reportUrl;
    if (updateHistory) history.pushState({ report: link.id }, '', '#' + link.id);
    if (window.matchMedia('(max-width: 840px)').matches) setMenu(false);
  }

  dashboard.querySelectorAll('[data-tree-toggle]').forEach((button) => {
    button.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      const branch = document.getElementById(this.getAttribute('aria-controls'));
      if (branch) branch.hidden = expanded;
    });
  });

  reportLinks.forEach((link) => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      selectReport(this, true);
    });
  });

  menuButtons.forEach((button) => {
    button.addEventListener('click', function () {
      setMenu(!dashboard.classList.contains('menu-open'));
    });
  });

  function selectFromLocation() {
    const requested = document.getElementById(window.location.hash.slice(1));
    selectReport(requested && requested.matches('[data-report]') ? requested : reportLinks[0], false);
  }

  window.addEventListener('popstate', selectFromLocation);
  selectFromLocation();
})();
