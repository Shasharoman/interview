# account

## account
```
url: /api/account
method: get
middleware: [auth]
res: {
    code: number,
    result: {
        id: number,
        username: string,
        nickname: string
        created_at: number,
        updated_at: number
    }
}
```

## register
```
url: /api/account/register
method: post
body: {
    username: string,
    password: string,
    nickname: string        // optional
}
res: {
    code: number,           // 0: success, other: error
    result: {}
}
```

## login
```
url: /api/account/login
method: post
body: {
    username: string,
    password: string
}
res: {
    code: number,
    result: {}
}
```

## logout
```
url: /api/account/logout
method: get, post
res: {
    code: number,
    result: {}
}
```