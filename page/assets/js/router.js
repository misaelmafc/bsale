const parseLocation = function () {
    return location.hash.slice(1).toLowerCase() || "/";
 }
 
 const findComponent = function (path, routes) {
    return routes.find(route => route.path.match(new RegExp(`^\\${path}$`, 'gm'))) || undefined;
 }
 
 function router() {
    $.ajax({
       type: 'POST',
       url: 'php/init-session.php',
    }).done(function (response) {
       if (response == 0) {
          history.pushState(null, "", "user.php#/register");
          const path = parseLocation();
          const { component = ComponenteError } = findComponent(path, routes) || {};
          $('#main-user').html(component.render());
          $("#accept-terms").modal('show');
       } else if (response == 1) {
          const path = parseLocation();
          const { component = ComponenteError } = findComponent(path, routes) || {};
          $('#main-user').html(component.render());
       } else {
          window.location.replace('php/logout.php');
       }
    }).fail(function () {
       window.location.replace('php/logout.php');
    });
 }
 
 document.addEventListener("DOMContentLoaded", router);
 window.addEventListener("hashchange", router);