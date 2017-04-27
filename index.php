<?


include ('connect.php');

include('api_key.php');


$latitude_origine = $_GET["latitude"];
$longitude_origine = $_GET["longitude"];


echo "{

    \"nhits\": 353,
    \"parameters\": {
        \"dataset\": [
\"aires-de-jeux-des-espaces-verts-rennes\"
        ],
        \"timezone\": \"UTC\",
        \"rows\": 10,
        \"format\": \"json\"
    },
    \"records\": [";
    
$compo = $bdd->prepare('SELECT * FROM aires');
$compo ->execute(array());


// On affiche chaque entrée une à une
while ($donnees = $compo->fetch())
{
$row++;
    
if ($row > 10){break;}    

    $equipe = $donnees['equipe'];
    $objectif = $donnees['objectif'];
    $nom = $donnees['nom'];
    $espace_publique = $donnees['espace_publique'];
    $latitude = $donnees['latitude'];
    $longitude = $donnees['longitude'];
    $numero = $donnees['numero'];
    $nusect = $donnees['nusect'];
    $annee = $donnees['annee'];
    $id_ajeu = $donnees['id_ajeu'];
    $numsite = $donnees['numsite'];
    
   
    
$json_source = file_get_contents('https://maps.googleapis.com/maps/api/directions/json?origin='.$latitude_origine.','.$longitude_origine.'&destination='.$latitude.','.$longitude.'&avoid=highways&mode=walking&key='.$key);
    
//echo $json_source;

$json = json_decode($json_source);
    
$duree = $json->routes[0]->legs[0]->duration->text;

    
    
echo '
{
"datasetid": "aires-de-jeux-des-espaces-verts-rennes",
"recordid": "6148a447fd6c9f4e274d5e3de41ca860b35d9520",

"fields": {
"distance": "'.$duree.'",
    "sev": "'.$equipe.'",
    "objectid": '.$objectif.',
    "nom": "'.$nom.'",
    "espace_publique": "'.$espace_publique.'",
    "geo_point_2d": [
        '.$latitude.',
        '.$longitude.'
    ],
    "numero": "'.$numero.'",
    "nusect": '.$nusect.',
    "geo_shape": {
        "type": "MultiPolygon",
        "coordinates": [
[
    [
        [
-1.688756000102905,
48.11785440631317
        ],
        [
-1.688493754794064,
48.118152026228465
        ],
        [
-1.688191822673244,
48.11802945757794
        ],
        [
-1.68817551030383,
48.11802453049692
        ],
        [
-1.688436130462878,
48.11772685866264
        ],
        [
-1.688756000102905,
48.11785440631317
        ]
    ]
]
        ]
    },
    "annee": '.$annee.',
    "id_ajeu": '.$id_ajeu.',
    "numsite": "'.$numsite.'",
    "nuquart": 3
},
"geometry": {
    "type": "Point",
    "coordinates": [
        '.$longitude.',
        '.$latitude.'
    ]
},
"record_timestamp": "2017-04-01T07:00:02+00:00"';
    
    
    if ($row <10){echo  '},'; }
    else {echo  '}';}
          
    
    
    
    
        
    }


echo '
    ]

}';




//Fin While





?>




