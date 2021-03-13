function componentProduct(category) {
   $.ajax({
      type: 'GET',
      dataType: 'json',
      url: `./API/index.php?category=${category}&orderby=2&order=1&page=1`,
      beforeSend: function () {
         $('#main').html(`
         <div class="spinner-grow" role="status">
            <span class="sr-only">Loading...</span>
         </div>
         `);
      }
   }).done(function (res) {
      if (res != null) {
         $('#main').empty();
         res.items.forEach(e => {
            if (e.url_image == null || e.url_image == '') {
               urlImage = 'page/assets/img/not-found.png';
            } else {
               urlImage = e.url_image;
            }
            $('#main').append(
               `<div class="card col-md-3 ml-auto" style="margin: 1em;">
                   <img style="height: 15rem;" src="${urlImage}" class="card-img-top" alt="${e.name}">
                   <div class="card-body">
                       <h5 class="card-title">${e.name}</h5>
                       <p class="card-text">$${e.price}</p>
                       <a href="#" class="btn btn-primary">Agregar</a>
                   </div>
               </div>`
            );
         });
      } else {
         $('#main').html(`
         <h1>Error al encontrar los datos</h1>
         `);
      }
   }).fail(function () {
      $('#main').html(`
         <h1>Error al encontrar los datos</h1>
      `);
   });
}

const ComponentError = function () {

};


function parseLocation() {
   return location.hash.slice(1).toLowerCase() || "/";
}

function router() {
   componentProduct(parseLocation().replace('/', ''))
}

//document.addEventListener("DOMContentLoaded", router);
window.addEventListener("hashchange", router);