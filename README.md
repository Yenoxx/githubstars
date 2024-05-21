# githubstars
 Service that pulls trending repositories from GitHub

1) Configuring the server

Go to "githubstars-service/" and edit "server-config.json" so the service can connect to PostgreSQL.
It will look like this:

...
"database": 
{
    "host": "127.0.0.1",      <-- database server hostname
    "port": "5432",           <-- database server port
    "user": "user",           <-- username
    "password": "password",   <-- password
    "databaseName": "testdb"  <-- name of the database
}
...

WARNING: the service will create a new table inside the specified database!

To run the service use "run-service.bat" or "node ." inside "githubstars-service/" folder.


2) Configuring the client

Config file for client is "githubstars-client-cli/client-config.json".
This is what it looks like:

{
    "host": "127.0.0.1",  <-- service server hostname 
    "port": "8000"        <-- service server port
}

To run the client use "run-client.bat" or "node ." inside "githubstars-client-cli/" folder.




RUSSIAN:

1) Настройка сервера

Перейдите в каталог "githubstars-service/" и отредактируйте файл "server-config.json", 
чтобы сервис мог подключиться к PostgreSQL.
Файл выглядит так:

...
"database": 
{
    "host": "127.0.0.1",      <-- адрес сервера БД 
    "port": "5432",           <-- порт сервера БД 
    "user": "user",           <-- имя пользователя
    "password": "password",   <-- пароль
    "databaseName": "testdb"  <-- название базы данных
}
...

ВНИМАНИЕ: сервис создаст новую таблицу в базе данных!

Чтобы запустить сервис, используйте "run-service.bat" или 
команду "node ." внутри каталога "githubstars-service/".


2) Настройка клиента

Файл конфигурации клиента - "githubstars-client-cli/client-config.json".
Вот так он выглядит:

{
    "host": "127.0.0.1",  <-- адрес сервера 
    "port": "8000"        <-- порт сервера
}

Чтобы запустить клиент, используйте "run-client.bat" или 
"node ." внутри каталога "githubstars-client-cli/".