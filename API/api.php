<?php

include_once 'product.php';

class ApiProduct
{

    function getProducts($category)
    {

        $product = new Data();
        $products = array();
        $products["items"] = array();

        $res = $product->getProductByCategory($category);

        if ($res->rowCount()) {
            while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
                $item = array(
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "url_image" => $row['url_image'],
                    "price" => $row['price'],
                    "discount" => $row['discount'],
                    "category" => $row['category'],
                );
                array_push($products["items"], $item);
            }
            echo json_encode($products);
        } else {
            echo json_encode(array('mensaje' => 'No hay elementos que mostrar'));
        }
    }

    function getCategories()
    {

        $category = new Data();
        $categories = array();
        $categories["categories"] = array();

        $res = $category->getCategories();

        if ($res->rowCount()) {
            while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
                $item = array(
                    "id" => $row['id'],
                    "name" => $row['name'],
                );
                array_push($categories["categories"], $item);
            }
            echo json_encode($categories);
        } else {
            echo json_encode(array('mensaje' => 'No hay elementos que mostrar'));
        }
    }
}