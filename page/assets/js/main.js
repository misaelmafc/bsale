window.addEventListener("load", loadNav);

$('#search').keyup(function () {
    $('.linkActive').removeClass('active');
    let wordBySearch = $(this).val();
    if (wordBySearch != '') {
        getProductFromSearch(wordBySearch);
    } else {
        $('#main').empty();
    }

});

function getProductFromSearch(search, page = 1, orderby = 2, order = 1) {
    let url = `./API/index.php?search=${search}&orderby=${orderby}&order=${order}&page=${page}`;
    getProductFromApi(2, url, search, page, orderby, order);
}

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
                getProductFromCategory(e.id);
                $(this).addClass('active linkActive');
                event.preventDefault();
            });
        });
    }).fail(function (res) {
        console.log(res);
    });
}

function getProductFromCategory(category, page = 1, orderby = 2, order = 1) {
    let url = `./API/index.php?category=${category}&orderby=${orderby}&order=${order}&page=${page}`;
    $('#search').val('');
    getProductFromApi(1, url, category, page, orderby, order);
}

function getProductFromApi(switcher, url, category, page, orderbyGlobal, orderGlobal) {
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


            if (orderbyGlobal == 4 && orderGlobal == 1) { btnOrderByText = 'Precio menor a mayor' }
            else if (orderbyGlobal == 4 && orderGlobal == 2) { btnOrderByText = 'Precio mayor a menor' }
            else if (orderbyGlobal == 2 && orderGlobal == 1) { btnOrderByText = 'Ordenar por' }
            else if (orderbyGlobal == 2 && orderGlobal == 2) { btnOrderByText = 'Nombre Z-A' }
            else if (orderbyGlobal == 5 && orderGlobal == 1) { btnOrderByText = 'Descuento' }


            $('#main').append(`
            <div class="dropdown col-12">
                <a id="btnOrderBy" class="btn btn-secondary dropdown-toggle" href="" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    ${btnOrderByText}
                </a>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <a id="order1" class="dropdown-item" href="">Precio menor a mayor</a>
                    <a id="order2" class="dropdown-item" href="">Precio mayor a menor</a>
                    <a id="order3" class="dropdown-item" href="">Nombre A-Z</a>
                    <a id="order4" class="dropdown-item" href="">Nombre Z-A</a>
                    <a id="order5" class="dropdown-item" href="">Descuento</a>
                </div>
            </div>
            `);
            let optionsOrder = {
                1: { 'orderby': 4, 'order': 1 },
                2: { 'orderby': 4, 'order': 2 },
                3: { 'orderby': 2, 'order': 1 },
                4: { 'orderby': 2, 'order': 2 },
                5: { 'orderby': 5, 'order': 1 },
            };
            for (i = 1; i <= Object.keys(optionsOrder).length; i++) {
                $(`#order${i}`).click(function (event) {
                    j = $(this).attr('id').replace('order', '');
                    orderby = optionsOrder[j].orderby;
                    order = optionsOrder[j].order;
                    switcher === 1 ? getProductFromCategory(category, 1, orderby, order) : getProductFromSearch(category, 1, orderby, order);
                    
                    event.preventDefault();
                });
            }

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
                        for (i = 1; i <= e.number; i++) {
                            $('#pagination').append(`
                                <li id="li${i}" class="page-item"><a id="page${i}" class="page-link" href="">${i}</a></li>
                            `)
                            $(`#page${i}`).click(function (event) {
                                page = $(this).attr('id').replace('page', '');
                                switcher === 1 ? getProductFromCategory(category, page, orderbyGlobal, orderGlobal) : getProductFromSearch(category, page, orderbyGlobal, orderGlobal);
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