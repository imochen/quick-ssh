# Quick-SSH

Only use for Public Key unavailable.

Probably don't need `Quick SSH`, If you can use Public Key for login.

## Update

### 1.0.3
- add ssh port support, default 22.

## Usage

```shell
npm install -g @mochen/qss
```

####  add a user or host
```shell
qss add
```

#### manage user or host
```shell
qss config
```

#### list all host and select login
```shell
qss
```

Config File at `$HOME/.qss/`