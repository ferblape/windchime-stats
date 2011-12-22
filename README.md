# Windchime Stats

Realtime two phases stats in your shop, powered with Node.JS, Redis and Websockets.

## dependencies

- `socket.io`
- `hiredis`
- `redis`

## windchime-stats

Receives visitors data from a channel, processes it and updates the realtime channel.

## windchime-stats-realtime

A proxy that receives information from the realtime channel in Redis and publishes it into the sockets.

## TODO

- improve deploy
- manage dependencies

## LICENSE

> This work ‘as-is’ we provide.

> No warranty express or implied.

> We’ve done our best,

> to debug and test.

> Liability for damages denied.
>
> Permission is granted hereby,

> to copy, share, and modify.

> Use as is fit,

> free or for profit.

> On this notice, these rights rely.

## Credits

Developed by Fernando Blat <blat@tol.do>, for [Toldo](http://tol.do)