(() => {
  const picker = document.querySelector('.project-picker');
  const stage = document.querySelector('.project-stage');
  const tabs = [...picker.querySelectorAll('[data-project]')];
  const panels = [...stage.querySelectorAll('.project-panel')];
  const mobile = matchMedia('(max-width: 767px)');
  picker.hidden = false;
  picker.setAttribute('role', 'tablist');
  stage.classList.add('enhanced');

  function select(tab, focus = false) {
    for (const button of tabs) {
      const selected = button === tab;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    }
    for (const panel of panels) panel.hidden = panel.id !== `project-${tab.dataset.project}`;
    if (focus) tab.focus({ preventScroll: true });
  }
  function orientation() { picker.setAttribute('aria-orientation', mobile.matches ? 'horizontal' : 'vertical'); }
  for (const tab of tabs) {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `project-${tab.dataset.project}`);
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      const index = tabs.indexOf(tab);
      let next;
      if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else if (event.key === (mobile.matches ? 'ArrowRight' : 'ArrowDown')) next = (index + 1) % tabs.length;
      else if (event.key === (mobile.matches ? 'ArrowLeft' : 'ArrowUp')) next = (index - 1 + tabs.length) % tabs.length;
      if (next !== undefined) { event.preventDefault(); select(tabs[next], true); }
    });
  }
  for (const panel of panels) {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${panel.id.replace('project-', '')}`);
    panel.tabIndex = 0;
  }
  orientation();
  mobile.addEventListener('change', orientation);
  select(tabs[0]);
})();
