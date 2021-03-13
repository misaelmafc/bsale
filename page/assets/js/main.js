
function loadNav() {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: './API/index.php?categories=1',
    }).done(function (res) {
        res.categories.forEach(e => {
            $('#verticalNav').append(`
            <li class="nav-item nav-perso">
                <a class="nav-link" href="#/${e.id}">
                    ${e.name.toUpperCase()} 
                </a>
            </li>
        `);
        });
    }).fail(function (res) {
        console.log(res);
    });
}

window.addEventListener("load", loadNav);

// function loadCard() {
//     $.ajax({
//         type: 'GET',
//         dataType: 'json',
//         url: './API/index.php?category=3&orderby=4&order=2&page=1',
//     }).done(function (res) {
//         res.items.forEach(e => {
//             console.log(e);
//             $('#main').append(`
//                 <div class="card col-md-3 ml-auto" style="margin: 1em;">
//                     <img style="height: 15rem;" src="${e.url_image}" class="card-img-top" alt="${e.name}">
//                     <div class="card-body">
//                         <h5 class="card-title">${e.name}</h5>
//                         <p class="card-text">$${e.price}</p>
//                         <a href="#" class="btn btn-primary">Agregar</a>
//                     </div>
//                 </div>
//             `);
//         });
//     }).fail(function (res) {
//         console.log(res);
//     });
// }

// document.addEventListener("DOMContentLoaded", loadCard);