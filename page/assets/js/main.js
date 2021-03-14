window.addEventListener("load", loadNav);

$('#search').keyup(function () {
    let wordBySearch = $(this).val();

    if (wordBySearch != '') {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: `./API/index.php?search=${wordBySearch}`,
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
                        `<div class="card col-9 col-md-5 col-lg-3 m-4">
                        <img src="${urlImage}" style="width: 100%;" alt="${e.name}">
                        <hr>
                        <div class="card-body">
                            <h5 class="card-title">${e.name.toUpperCase()}</h5>
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

    } else {
        $('#main').empty();
    }

});

function loadNav() {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: './API/index.php?categories=1',
    }).done(function (res) {
        res.categories.forEach(e => {
            $('#verticalNav').append(`
            <li class="nav-item active nav-perso">
                <a class="nav-link" id="navId${e.id}" href="">
                    ${e.name.toUpperCase()} 
                </a>
            </li>
            `);

            $(`#navId${e.id}`).click(function (event) {
                $('.linkActive').removeClass('active');
                componentProduct(e.id);
                $(this).addClass('active linkActive');
                event.preventDefault();
            });
        });
    }).fail(function (res) {
        console.log(res);
    });
}

function componentProduct(category) {
    $('#search').val('');
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
                    `<div class="card col-9 col-md-5 col-lg-3 m-4">
                        <img src="${urlImage}" style="width: 100%;" alt="${e.name}">
                        <hr>
                        <div class="card-body">
                            <h5 class="card-title">${e.name.toUpperCase()}</h5>
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