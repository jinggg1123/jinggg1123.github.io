/* 
 * hexo theme meow
 * scroll scripts
 */

const initScroll = () => {
  const scrollHeader = () => {
    const updateHeaderStyle = () => {
      const scroll_y = window.scrollY || window.pageYOffset || document.body.scrollTop;
      const bg_color = document.body.getAttribute('data-mode') == 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(45, 45, 45, 0.85)';
      const new_color = scroll_y >= (window.innerHeight * 0.6) ? bg_color : 'transparent';
      const headerElement = document.querySelector('header');
      requestAnimationFrame(() => {
        headerElement.style.background = new_color;
      });
      if (new_color == 'transparent') {
        headerElement.setAttribute('custom', '');
      } else {
        headerElement.removeAttribute('custom');
      }
    };

    window.addEventListener('scroll', meow.debounce(() => updateHeaderStyle(), 200));
  };

  const scrollHomeBg = () => {
    if (document.body.getAttribute('bg-style') != 'fixed') return;
    const updateBgStyle = () => {
      const scroll_y = window.scrollY || window.pageYOffset || document.body.scrollTop;
      if (scroll_y >= (window.innerHeight * 0.6)) {
        document.body.setAttribute('blur', '');
      } else {
        document.body.removeAttribute('blur');
      }
    };
    window.addEventListener('scroll', meow.debounce(() => updateBgStyle(), 200));
  };

  const scrollTOC = () => {
    document.querySelectorAll('.toc-list-link[href^="#"]').forEach(link => {
      link.addEventListener('click', event => {
        const href = link.getAttribute('href');
        const heading = document.getElementById(decodeURIComponent(href.slice(1)));
        // Keep the native anchor behaviour as a fallback if a heading is absent.
        if (!heading) return;

        event.preventDefault();
        window.history.pushState(null, '', href);
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  const scrollToMain = () => {
    const scroll_down = document.getElementById('scroll-to-main');
    if (scroll_down) {
      scroll_down.addEventListener('click', function () { meow.scrollFn(document.getElementById('home-container').offsetTop - 59) });
    }
  };

  const scrollTOCHighlight = () => {
    if (GLOBALCONFIG.encrypt) return;
    initTOCHighlight();
  };

  const scrollToTop = () => {
    const toolbar = document.getElementById('toolbar');
    if (toolbar) {
      document.getElementById('tool-gototop').addEventListener('click', function () { meow.scrollFn(0) });
    }
  };

  const scrollToolbar = () => {
    const changeToolbarStatus = () => {
      const scroll_y = window.scrollY || window.pageYOffset || document.body.scrollTop;
      if (scroll_y >= (window.innerHeight * 0.15) && scroll_y <= (document.documentElement.scrollHeight - window.innerHeight - 16)) {
        document.getElementById('toolbar').removeAttribute("hide");
      } else {
        document.getElementById('toolbar').setAttribute("hide", "");
      }
    };

    window.addEventListener('scroll', meow.debounce(() => changeToolbarStatus(), 150));
  };

  scrollHeader();
  scrollToMain();
  scrollHomeBg();
  scrollToolbar();
  scrollToTop();
  scrollTOC();
  scrollTOCHighlight();
};

const initTOCHighlight = () => {
  const toc = document.querySelector('.toc-content');
  if (!toc) return;

  let titleList = [];
  const tocList = document.querySelectorAll('.toc-content a[href^="#"]');
  tocList.forEach(item => {
    const title = document.getElementById(decodeURIComponent(item.hash.slice(1)));
    if (title) titleList.push(title);
  });

  titleList.forEach(section => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let titleId = entry.target.id;
          tocList.forEach(link => { link.removeAttribute('active') });
          let targetToc = Array.from(tocList).find(link => decodeURIComponent(link.hash.slice(1)) === titleId);
          if (!targetToc) return;
          targetToc.setAttribute('active', '');

          let targetView = targetToc.getBoundingClientRect();
          let tocView = toc.getBoundingClientRect();
          if (targetView.top >= (tocView.top + tocView.height)) {
            requestAnimationFrame(() => {
              toc.scrollTop += 35;
            });
          } else if (targetView.top <= tocView.top) {
            requestAnimationFrame(() => {
              toc.scrollTop -= 35;
            });
          }
        }
      });
    }, { threshold: [1], rootMargin: '-10% 0% -60%' });
    observer.observe(section);
  });
}

export { initScroll, initTOCHighlight };
