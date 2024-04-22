# GuideIn-Space

## Установка зависимостей

GuideIn-Space требует:

* Python 3.11 и выше.
* virtualenv, который можно установить, выполнив `sudo apt install virtualenv`.

## Подготовка к запуску и запуск

Вначале создаем в папке проекта файл **.env** с переменными окружения (*при первой установке приложения*):

```dotenv
ALLOWED_HOSTS=*
DEBUG=true
SECRET_KEY=secret
CORS_ALLOWED_ORIGINS=http://localhost:3000
CORS_TRUSTED_ORIGINS=http://localhost:3000
CORS_ALLOW_CREDENTIALS=True
```

Затем создаем виртуальное окружение и устанавливаем в него зависимости (*при первой установке приложения*):

```bash
$ virtualenv -ppython3 guidein-space-env
$ cd guidein-space
$ ../guidein-space-env/bin/pip install -r requirements-dev.txt
```

Накатываем миграции (*при первой установке приложения*):

```bash
$ ../guidein-space-env/bin/python manage.py migrate
```

Создаем суперпользователя (*при первой установке приложения*):

```bash
$ ../guidein-space-env/bin/python manage.py createsuperuser
```

Запускаем GuideIn-Space:

```bash
$ ../guidein-space-env/bin/python manage.py runserver
```

## Запуск GuideIn-Space с помощью docker

Дополнительные зависимости:

* Docker, инструкцию по установке которого можно найти [здесь](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-engine---community-1).

Сборка и запуск:

```bash
$ cd docker && docker-compose up -d --build
```
