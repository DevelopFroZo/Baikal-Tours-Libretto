# 1. _С кем пойти_
`POST /companions` - создать с кем пойти

`body`:
- `(string) name` - название

`payload type: number` - `ID` нового _с кем пойти_

`GET /companions` - получить список всех с кем пойти

`PUT /companions/:id` - обновить _с кем пойти_ по `ID`

`query`:
- `(number) :id` - `ID` _с кем пойти_

`body`:
- `(string) name` - название

# 2. Тематики. Аналогично _с кем пойти_, но роут `/subjects`

# 3. События
`POST /events` - создать событие

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

`query`:
- `(number) :id` - `ID` события

`body`: аналогично созданию

# 4. Цепочка событий
`POST /chained-events` - создать цепочку событий

`body`:
- `(number[]) events` - массив `ID` событий (`events`)

`payload type: number` - `ID` новой цепочки событий

`GET /chained-events` - получить все цепочки событий

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

`query`:
- `(number) :id` - `ID` цепочки событий

`body`:
- `(number[]) events` - массив `ID` событий (`events`)