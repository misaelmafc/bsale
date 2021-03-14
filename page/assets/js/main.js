window.addEventListener("load", loadNav);

$('#search').keyup(function () {
    $('.linkActive').removeClass('active');
    let wordBySearch = $(this).val();
    let url = `./API/index.php?search=${wordBySearch}`;
    if (wordBySearch != '') {
        getProductFromApi(url);
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

function getProductFromApi(url, category, page) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: url,
        beforeSend: function () {
            $('#main').html(`
          <div class="spinner-grow" role="status">
             <span class="sr-only">Cargando...</span>
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
            if (res.paginas != undefined) {
                res.paginas.forEach(e => {
                    if (e.number > 1) {
                        $('#main').append(`
                            <div style="margin-top: 3rem;" class="col-12 row justify-content-center">
                                <nav aria-label="Page navigation example">
                                    <ul id="pagination" class="pagination">
                                    </ul>
                                </nav>
                            </div>
                        `);
                        for(i = 1; i <= e.number; i++){
                            $('#pagination').append(`
                                <li id="li${i}" class="page-item"><a id="page${i}" class="page-link" href="">${i}</a></li>
                            `)
                            $(`#page${i}`).click(function (event){
                                page = $(this).attr('id').replace('page', '');
                                componentProduct(category, page);
                                event.preventDefault();
                            });
                        }
                        $('.page-item').removeClass('active');
                        $(`#li${page}`).addClass('active');
                    }
                });
            }
        } else {
            $('#main').html(`
          <h1>Error al encontrar los datos 1</h1>
          `);
        }
    }).fail(function () {
        $('#main').html(`
          <h1>Error al encontrar los datos 2</h1>
       `);
    });
}

function componentProduct(category, page = 1, orderby = 2, order = 1) {
    let url = `./API/index.php?category=${category}&orderby=${orderby}&order=${order}&page=${page}`;
    $('#search').val('');
    getProductFromApi(url, category, page);
}