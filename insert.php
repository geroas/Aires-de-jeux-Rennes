<?php

include('connect.php');


if (($handle = fopen("aires.csv", "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, ";")) !== FALSE) {
$row++;
        
if ($row ==1 ){continue;}        
        
$geopoint = $data[0];
        
$myArray = explode(',', $geopoint);
$latitude = $myArray[0];    


$long = strstr($geopoint, ', ', false);
$longitude = substr($long, 2);       

//echo $latitude.'/'.$longitude.'<br>';    
    
$geo_shape        = $data[1];
$annee            = $data[2];
$borne_eau        = $data[3];
$eclairage        = $data[4];
$id_ajeu          = $data[5];
$nom              = $data[6];
$nom_voie         = $data[7];
$notes            = $data[8];
$numero           = $data[9];
$photo            = $data[10];
$sev              = $data[11];
$echelle          = $data[12];
$espace_publique  = $data[13];
$numsite          = $data[14];
$nuquart          = $data[15];
$nusect           = $data[16];
$objectif         = $data[17];
        
       
        


        
$insertarticle= $bdd->prepare('INSERT INTO aires SET 
latitude        = :latitude,
longitude       = :longitude,
geo_shape       = :geo_shape,
annee           = :annee,
borne_eau       = :borne_eau,
eclairage       = :eclairage,
id_ajeu         = :id_ajeu,
nom             = :nom,
nom_voie        = :nom_voie,
notes           = :notes,
numero          = :numero,
photo           = :photo,
sev             = :sev,
echelle         = :echelle,
espace_publique = :espace_publique,
numsite         = :numsite,
nuquart         = :nuquart,
nusect          = :nusect,
objectif        = :objectif
');
$insertarticle->execute(array(
'latitude'        => $latitude,
'longitude'       => $longitude,
'geo_shape'       => $geo_shape,
'annee'           => $annee,
'borne_eau'       => $borne_eau,
'eclairage'       => $eclairage,
'id_ajeu'         => $id_ajeu,
'nom'             => $nom,
'nom_voie'        => $nom_voie,
'notes'           => $notes,
'numero'          => $numero,
'photo'           => $photo,
'sev'             => $sev,
'echelle'         => $echelle,
'espace_publique' => $espace_publique,
'numsite'         => $numsite,
'nuquart'         => $nuquart,
'nusect'          => $nusect,
'objectif'        => $objectif
    
    
));
        
    }}


?>