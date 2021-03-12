<?php

include_once 'db.php';

class Data extends DB
{

    function getCategories()
    {
        $query = $this->connect()->query('SELECT * FROM category');
        return $query;
    }

    function getProductByCategory($category)
    {
        $query = $this->connect()->prepare('SELECT * FROM product WHERE category = :category');
        $query->execute(['category' => $category]);
        return $query;
    }
}
