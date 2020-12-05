# Config example
```
package config

def PROJECT_ROOT = ""
def PUBLIC_URI = "public"
def UPLOAD_URI = "upload"
def ROOT_SECRET = ""
```

# 1. _С кем пойти_ (`companions`)
`POST /companions` - создать с кем пойти

`Access level`: `admin`

`body`:
- `(string) name` - название

`payload type: number` - `ID` нового _с кем пойти_

`GET /companions` - получить список всех с кем пойти

`PUT /companions/:id` - обновить _с кем пойти_ по `ID`

`Access level`: `admin`

`query`:
- `(number) :id` - `ID` _с кем пойти_

`body`:
- `(string) name` - название

`DELETE /companions/:id` - удалить _с кем пойти_ по `ID`

`Access level`: `admin`

`query`:
- `(number) :id` - `ID` _с кем пойти_

# 2. Тематики (`subjects`). Аналогично _с кем пойти_, но роут `/subjects`

# 3. События (`events`)
`POST /events` - создать событие

`Access level`: `admin`

`body`:
- `(string) name` - название
- `(string) description` - описание
- `(number) date_start` - дата начала (`UNIX` формат)
- `(number) date_end` - дата окончания (`UNIX` формат)
- `(number[]) companions` - массив `ID` с кем пойти (`companions`)
- `(string) location` - место проведения
- `(number[]) subjects` - массив `ID` тематик (`subjects`)

`payload type: number` - `ID` нового события

`GET /events` - получить все события

`payload type: [ event, ... ] // из GET /events/:id`

`GET /events/:id` - получить событие по `ID`

`query`:
- `(number) :id` - `ID` события

```
payload type: {
  id: number,
  name: string,
  description: string,
  date_start: number,
  date_end: number,
  companions: [
    {
      id: number,
      name: string
    },
    ...
  ],
  location: string,
  subjects: [
    {
      id: number,
      name: string
    },
    ...
  ],
  image_path: string
}
```

`PUT /events/:id` - обновить событие по `ID`

`Access level`: `admin`

`query`:
- `(number) :id` - `ID` события

`body`: аналогично созданию

`DELETE /events/:id` - удалить событие по `ID`

`Access level`: `admin`

`query`:
- `(number) :id` - `ID` события

`POST /events/:id/image` - создать картинку для события

`query`:
- `(number) :id` - `ID` события

`(multipart) body`:
- `(file) image` - картинка

`payload type: string` - сгенерированное имя для картинки

# 4. Цепочка событий (`chained-events`)
`POST /chained-events` - создать цепочку событий

`Access level`: `user`

`body`:
- `(number[]) events` - массив `ID` событий (`events`)

`payload type: number` - `ID` новой цепочки событий

`GET /chained-events` - получить все цепочки событий

`Access level`: `user`

```
payload type: [
  {
    id: number,
    events: [ event, ... ] // из GET /events/:id
  },
  ...
]
```

`PUT /chained-events/:id` - обновить цепочку событий по `ID`

`Access level`: `user`

`query`:
- `(number) :id` - `ID` цепочки событий

`body`:
- `(number[]) events` - массив `ID` событий (`events`)

`DELETE /chained-events/:id` - удалить цепочку событий по `ID`

`Access level`: `user`

`query`:
- `(number) :id` - `ID` цепочки событий

# 4. Авторизация (`auth`)
`POST /auth/signUp` - зарегистрировать пользователя

`body`:
- `(string) login` - логин
- `(string) password` - пароль

`payload type: number` - `ID` нового пользователя

`POST /auth/signIn` - войти под пользователем

`body`:
- `(string) login` - логин
- `(string) password` - пароль

`GET /auth/signOut` - выйти

# 5. Пользователи (`users`)
`GET /users/current` - получить информацию о текущем пользователе

```
payload type: {
  id: number,
  login: string,
  role: "user" | "admin"
}
```

`POST /users/createRoot` - создаёт админа с логином `root` и паролем `root`

`body`:
- `(string) secret` - секрет, который должен совпасть с секретом из файла `libretto/config.ltt`

`payload type: number` - `ID` нового пользователя