// Función que agrega imagen central al cargar la página
$(document).ready(function () {
    $('#main').html(`
        <div class="row justify-content-center divMessageInitial">
            <div class="col-lg-7">
                <h3 class="titleInitial">Puedes buscar nuestros productos por catergoría o en el buscador</h3>
            </div>
            <div class="col-12 col-md-10">
                <img class="imgMessage" src="https://astroparsec.cl/imgHeroku/search-data.svg" alt="">
            </div>
        </div>
    `);
});

// Controlador de eventos que permite cargar el menú lateral de forma asíncrona al cargar la página
window.addEventListener("load", loadNav);

// Función que carga el menú lateral
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
                $('.linkActive').removeClass('linkActive');
                getProductFromCategory(e.id);
                $(this).addClass('linkActive');
                event.preventDefault();
            });
        });
    }).fail(function (res) {
        console.log(res);
    });
}

// Controlador de eventos que permite realizar la busqueda de productos de forma asíncrona
$('#search').keyup(function () {
    $('.linkActive').removeClass('linkActive');
    let wordBySearch = $(this).val();
    if (wordBySearch != '') {
        getProductFromSearch(wordBySearch);
    } else {
        $('#main').html(`
            <div class="row justify-content-center divMessageInitial">
                <div class="col-lg-7">
                    <h3 class="titleInitial">Puedes buscar nuestros productos por catergoría o en el buscador</h3>
                </div>
                <div class="col-12 col-md-10">
                    <img class="imgMessage" src="https://astroparsec.cl/imgHeroku/search-data.svg" alt="">
                </div>
            </div>
         `);
    }

});

// Función que permite armar la URL a utilizar al consultar los productos desde el buscador
function getProductFromSearch(search, page = 1, orderby = 2, order = 1) {
    let url = `./API/index.php?search=${search}&orderby=${orderby}&order=${order}&page=${page}`;
    getProductFromApi(2, url, search, page, orderby, order);
}
// Función que permite armar la URL a utilizar al seleccionar alguna categoría
function getProductFromCategory(category, page = 1, orderby = 2, order = 1) {
    let url = `./API/index.php?category=${category}&orderby=${orderby}&order=${order}&page=${page}`;
    $('#search').val('');
    getProductFromApi(1, url, category, page, orderby, order);
}

// Función que realiza la consulta a la API según la selección de una categoría o desde el buscador
function getProductFromApi(switcher, url, category, page, orderbyGlobal, orderGlobal) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: url,
        beforeSend: function () {
            $('#main').html(`
            <div id="spinnerLoad" class="spinner-grow" role="status">
                <span class="sr-only">Cargando...</span>
            </div>
            `);
        }
    }).done(function (res) {
        if (res != null) {
            $('#main').empty();

            if (orderbyGlobal == 4 && orderGlobal == 1) { btnOrderByText = 'Precio menor a mayor' }
            else if (orderbyGlobal == 4 && orderGlobal == 2) { btnOrderByText = 'Precio mayor a menor' }
            else if (orderbyGlobal == 2 && orderGlobal == 1) { btnOrderByText = 'Nombre A-Z' }
            else if (orderbyGlobal == 2 && orderGlobal == 2) { btnOrderByText = 'Nombre Z-A' }
            else if (orderbyGlobal == 5 && orderGlobal == 2) { btnOrderByText = 'Ofertas primero' }

            $('#main').append(`
            <div class="dropdown col-12" style="margin-bottom: 2rem;">
                <a id="btnOrderBy" class="btn btn-secondary dropdown-toggle" href="" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    ${btnOrderByText}
                </a>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <a id="order1" class="dropdown-item" href="">Precio menor a mayor</a>
                    <a id="order2" class="dropdown-item" href="">Precio mayor a menor</a>
                    <a id="order3" class="dropdown-item" href="">Nombre A-Z</a>
                    <a id="order4" class="dropdown-item" href="">Nombre Z-A</a>
                    <a id="order5" class="dropdown-item" href="">Ofertas primero</a>
                </div>
            </div>
            `);
            let optionsOrder = {
                1: { 'orderby': 4, 'order': 1 },
                2: { 'orderby': 4, 'order': 2 },
                3: { 'orderby': 2, 'order': 1 },
                4: { 'orderby': 2, 'order': 2 },
                5: { 'orderby': 5, 'order': 2 },
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
                    urlImage = 'https://astroparsec.cl/imgHeroku/not-found.png';
                } else {
                    urlImage = e.url_image;
                }
                if (e.discount > 0) {
                    price = ((e.price * e.discount) / 100);
                    finalPrice = new Intl.NumberFormat('es-CL', { currency: 'CLP', style: 'currency' }).format(parseInt(e.price - price));
                    finalPriceNormal = new Intl.NumberFormat('es-CL', { currency: 'CLP', style: 'currency' }).format(parseInt(e.price));
                    $('#main').append(
                        `<div class="col-12 col-sm-6 col-lg-4 cardProduct">
                            <div class="row justify-content-center">
                                <div class="col-11 col-lg-10 cardProductVisible">
                                    <div class="divCardImg">
                                        <img class="imgCard" src="${urlImage}" alt="${e.name}">
                                    </div>
                                    <hr>
                                    <div class="cardBody">
                                        <h6 class="cardTitle">${e.name.toUpperCase()}</h6>
                                        <h4 class="cardPrice">${finalPrice} Oferta</h4>
                                        <h6 class="cardPriceNormal">${finalPriceNormal} Normal</h6>
                                        <div class="divBtnCard">
                                        <a href="#"><img class="btnCard" src="https://astroparsec.cl/imgHeroku/add.png"></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`
                    );
                } else {
                    price = new Intl.NumberFormat('es-CL', { currency: 'CLP', style: 'currency' }).format(parseInt(e.price));
                    $('#main').append(
                        `<div class="col-12 col-sm-6 col-lg-4 cardProduct">
                            <div class="row justify-content-center">
                                <div class="col-11 col-lg-10 cardProductVisible">
                                    <div class="divCardImg">
                                        <img class="imgCard" src="${urlImage}" alt="${e.name}">
                                    </div>
                                    <hr>
                                    <div class="cardBody">
                                        <h6 class="cardTitle">${e.name.toUpperCase()}</h6>
                                        <h4 class="cardPrice">${price}</h4>
                                        <h6 class="cardPriceNormal"></h6>
                                        <div class="divBtnCard">
                                            <a href="#"><img class="btnCard" src="https://astroparsec.cl/imgHeroku/add.png"></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`
                    );
                }

            });
            if (res.paginas != undefined) {
                res.paginas.forEach(e => {
                    if (e.number > 1) {
                        $('#main').append(`
                            <div id="divPagination" class="col-12 row justify-content-center">
                                <nav>
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
                <img class="imgMessage" src="https://astroparsec.cl/imgHeroku/no_data.svg">
            `);
        }
    }).fail(function () {
        $('#main').html(`
                <img class="imgMessage" src="https://astroparsec.cl/imgHeroku/no_data.svg">
        `);
    });
}