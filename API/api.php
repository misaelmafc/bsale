<?php

include_once 'data.php';

class ApiProduct
{
    function getProductBySearch($name)
    {

        $data = new Data();
        $response = array();
        $response["items"] = array();

        $res = $data->getProductBySearch($name);

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
                array_push($response["items"], $item);
            }
            echo json_encode($response);
        } else {
            echo json_encode(array('mensaje' => null));
        }
    }

    function getProducts($category, $orderby, $order, $page)
    {

        $data = new Data();
        $response = array();
        $response["items"] = array();
        $response["paginas"] = array();

        $res = $data->getProductByCategory($category, $orderby, $order, $page);
        $res2 = $data->getPagesByCategory($category);

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
                array_push($response["items"], $item);
            }
            $row = $res2->fetch();
            $item2 = array(
                "number" => intval($row['number']),
            );
            array_push($response["paginas"], $item2);

            echo json_encode($response);
        } else {
            echo json_encode(array('mensaje' => 'No hay elementos que mostrar'));
        }
    }

    function getCategories()
    {

        $data = new Data();
        $response = array();
        $response["categories"] = array();

        $res = $data->getCategories();

        if ($res->rowCount()) {
            while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
                $item = array(
                    "id" => intval($row['id']),
                    "name" => $row['name'],
                );
                array_push($response["categories"], $item);
            }
            echo json_encode($response);
        } else {
            echo json_encode(array('mensaje' => 'No hay elementos que mostrar'));
        }
    }
}
