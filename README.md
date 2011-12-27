# Windchime Stats

Experimental realtime stats in your Toldo shop, powered with Node.JS, Redis and Websockets.

## Dependencies

- `socket.io`
- `hiredis`
- `redis`
- `Capistrano` Ruby gem (for deploying the code)

## windchime-stats script

Process visits from a Redis pub/sub channel, stores them and updates the realtime channel.

## windchime-stats-realtime script

A proxy that receives information from the realtime channel in Redis and publishes it in the websockets.

## Deploy

Not being pretty sure how is the best way to deploy Node.js applications in production, this project uses two bash scripts which create a `pid` for each process and support `(start|stop|restart)` arguments. This way, the processes can be monitored in production using, for example, `monit` daemon.

Also, Capistrano is configured in `config/deploy.rb` file. Some of the default tasks of a Ruby on Rails deployment have been overrided to be adapted to a Node.js application.

## TODO

- testing

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

Developed by Fernando Blat <blat@tol.do>, for [Toldo](http://tol.do).
Feel free to contact me for any question, suggestion or comments.
