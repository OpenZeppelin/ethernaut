Como en el nivel anterior, `delegate` menciona, el uso de `delegatecall` para llamar
las librerías puede ser peligroso. Esto es particularmente cierto para las librerías que
tienen su propio estado. Este ejemplo demuestra por qué la palabra clave `library`
debe usarse para construir librerías, ya que evita que ellas puedan
almacenar y acceder a las variables de estado.