# contact

## create
```
url: /api/contact
method: post
middleware: [auth]
body: {
    key: value          // variable number of key-value
}
res: {
    code: number
    result: {}
}
```

## list
```
url: /api/contact
method: get
middleware: [auth]
query: {
    page: number,
    size: number
}
res: {
    code: number,
    result: {
        count: number,
        items: [{...}]
    }
}
```

## delete
```
url: /api/contact/:id
method: delete
middleware: [auth]
res: {
    code: number,
    result: {}
}
```
