<?php

include_once 'db.php';

class Data extends DB
{

    function getCategories()
    {
        $query = $this->connect()->query("SELECT * FROM category");
        return $query;
    }

    function getProductByCategory($category, $orderby, $order, $page)
    {
        if($order == 1){$sort = 'ASC';}
        if($order == 2){$sort = 'DESC';}
        $page_ = (($page-1)*6);
        $query = $this->connect()->prepare(
            "SELECT * FROM product 
            WHERE category = :category
            ORDER BY :orderby $sort
            LIMIT 6 OFFSET :page"
        );
        $query->bindParam(':category',$category, PDO::PARAM_INT);
        $query->bindParam(':orderby',$orderby, PDO::PARAM_INT);
        $query->bindParam(':page',$page_, PDO::PARAM_INT);
        $query->execute();
        return $query;
    }

    function getPagesByCategory($category){
        $query = $this->connect()->prepare(
            "SELECT CEIL(COUNT(id)/6) 'cantidad' FROM product
            WHERE category = :category"
        );
        $query->bindParam(':category', $category, PDO::PARAM_INT);
        $query->execute();
        return $query;
    }
}
