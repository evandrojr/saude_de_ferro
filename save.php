<?php
echo $HTTP_RAW_POST_DATA;
$today = date("Y-m-d");
$r = file_put_contents("/www/saude/backup_data/$today.json", $HTTP_RAW_POST_DATA);
echo $r;
?>
