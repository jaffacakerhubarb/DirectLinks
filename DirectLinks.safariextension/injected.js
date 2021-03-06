(function main() {
  if (window != top) {
    return;
  }
  if ((/^(encrypted|www)\.google(\.[a-z]+)+$/).test(location.hostname)) {
    if (['/','/search','/webhp'].indexOf(location.pathname) >= 0) {
      document.addEventListener('mousedown', function (e) {
        var et = e.target, lc = -1;
        while (et && !(et instanceof HTMLAnchorElement) && (3 > lc++))
          et = et.parentElement;
        if (!et || !et.href)
          return;
        var link = et;
        e.stopPropagation();
        reformGoogleLink(link);
      });
    }
  }
  else if (/^(beta|web|www)\.facebook(\.[a-z]+)+$/.test(location.hostname)) {
    document.addEventListener('mouseover', function (evt) {
      var thing = evt.target;
      if (thing instanceof HTMLAnchorElement) {
        reformFacebookLink(thing);
      }
      else if (thing.parentElement instanceof HTMLAnchorElement) {
        reformFacebookLink(thing.parentElement);
      }
    });
  }
  else if (/^twitter(\.[a-z]+)+$/.test(location.hostname)) {
    document.addEventListener('mouseover', function (evt) {
      var thing = evt.target;
      if (thing instanceof HTMLAnchorElement) {
        reformTwitterLink(thing);
      }
      else if (thing.parentElement instanceof HTMLAnchorElement) {
        reformTwitterLink(thing.parentElement);
      }
    });
  }
  else if ((iconLink = document.querySelector('link[rel="icon"]')) && /\btumblr\.com\//.test(iconLink.href)) {
    document.addEventListener('mouseover', function (evt) {
      var thing = evt.target;
      if (thing instanceof HTMLAnchorElement && thing.pathname === '/redirect') {
        reformTumblrLink(thing);
      }
    });
  }

  function reformGoogleLink(link) {
    if (link.getAttribute('onmousedown')) {
      link.removeAttribute('onmousedown');
      if (link.pathname === '/url') {
        var url = (/[?&]url=([^&]+)/.exec(link.search) || [])[1];
        if (url) {
          link.href = decodeURIComponent(url);
          console.log('Link changed to', url);
        }
      }
    }
  }
  function reformFacebookLink(link) {
    if (link.onclick && /referrer_log/.test(link.onclick)) {
      link.removeAttribute('onclick');
      console.log('Removed "onclick" attribute on link to', link.href);
    }
    else if (link.getAttribute('data-lynx-uri')) {
      link.removeAttribute('data-lynx-uri');
      link.removeAttribute('data-lynx-mode');
      console.log('Removed "data-lynx-uri" attribute on link to', link.href);
    }
    else if (link.pathname === '/l.php') {
      var url = (/[?&]u=([^&]+)/.exec(link.search) || [])[1];
      if (url) {
        link.href = decodeURIComponent(url);
        link.removeAttribute('data-lynx-mode');
        console.log('Link changed to', url);
      }
    }
  }
  function reformTwitterLink(link) {
    var url = link.getAttribute('data-expanded-url');
    if (url) {
      link.href = url;
      link.removeAttribute('data-expanded-url');
      console.log('Link changed to', url);
    }
  }
  function reformTumblrLink(link) {
    var params = link.search.slice(1).split('&');
    var directUrl, param;
    while (params.length) {
      param = params.shift();
      var kvp = param.split('=');
      if (kvp[0] === 'z') {
        directUrl = decodeURIComponent(kvp[1]);
        params.length = 0;
      }
    }
    if (directUrl) {
      link.href = directUrl;
    }
  }
  function log(html) {
    var log = document.createElement('div');
    log.innerHTML = html;
    document.body.appendChild(log);
  }
})();
