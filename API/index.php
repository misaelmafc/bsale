<?php
include_once 'api.php';

$api = new ApiProduct();

if (isset($_GET['search'])) {
    $name = $_GET['search'];
    $api->getProductBySearch($name);
}

if (isset($_GET['category'], $_GET['orderby'], $_GET['order'], $_GET['page'])) {
    $category = $_GET['category'];
    $orderby = $_GET['orderby'];
    $order = $_GET['order'];
    $page = $_GET['page'];
    if (
        is_numeric($category) &&
        is_numeric($orderby) &&
        is_numeric($order) &&
        ($order == 1 || $order == 2) &&
        is_numeric($page)
    ) {
        $api->getProducts($category, $orderby, $order, $page);
    }
}

if (isset($_GET['categories'])) {
    $categories = $_GET['categories'];
    if (is_numeric($categories) && $categories == 1) {
        $api->getCategories();
    }
}
