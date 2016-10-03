echo addItem <mapName> <layerName> <resource>
wget -qO- localhost:8081/addItem/$1/$2/name/$3
