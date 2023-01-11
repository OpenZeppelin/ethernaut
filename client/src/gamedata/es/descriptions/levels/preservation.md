Este contrato utiliza una librería para almacenar dos tiempos diferentes para dos
zonas horarias. El constructor crea dos instancias de la librería para almacenar cada tiempo.

El objetivo de este nivel es reclamar la propiedad de la instancia que se te proporciona.

&nbsp; Cosas que pueden ayudar
* Consulta la documentación de Solidity sobre la función de bajo nivel `delegatecall`,
  cómo funciona, cómo se puede utilizar para delegar operaciones en la red.
  Librerías y qué implicaciones tienen en la ejecución.
* Entender lo que significa que `delegatecall` es context-preserving.
* Comprender cómo se almacenan y se accede a las variables de storage.
* Comprender cómo funciona la conversión entre diferentes tipos de datos.