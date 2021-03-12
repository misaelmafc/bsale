<?php

include_once 'data.php';

class ApiProduct
{

    function getProducts($category, $orderby, $order, $page)
    {

        $product = new Data();
        $products = array();
        $products["items"] = array();
        $products["paginas"] = array();

        $res = $product->getProductByCategory($category, $orderby, $order, $page);
        $res2 = $product->getPagesByCategory($category);

        if ($res->rowCount()) {
            while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
                $item = array(
                    "id" => intval($row['id']),
                    "name" => $row['name'],
                    "url_image" => $row['url_image'],
                    "price" => floatval($row['price']),
                    "discount" => intval($row['discount']),
                    "category" => intval($row['category']),
                );
                array_push($products["items"], $item);
            }
            $row = $res2->fetch();
            $item2 = array(
                "cantidad" => intval($row['cantidad']),
            );
            array_push($products["paginas"], $item2);

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
                    "id" => intval($row['id']),
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
