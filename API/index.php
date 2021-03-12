<?php
    include_once 'api.php';

    $api = new ApiProduct();

    if(isset($_GET['category'])){
        $category = $_GET['category'];
        if(is_numeric($category)){
            $api->getProducts($category);
        }
    }

    if(isset($_GET['categories'])){
        $categories = $_GET['categories'];
        if(is_numeric($categories) && $categories == 1){
            $api->getCategories();
        }
    }
    
?>