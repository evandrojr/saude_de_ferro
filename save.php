<?php

echo $HTTP_RAW_POST_DATA;
$d = json_decode($HTTP_RAW_POST_DATA);

$today = date("Y-m-d");
file_put_contents("./backup_data/$file.json", $d);


?>
