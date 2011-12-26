#!/bin/bash

PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
NODE_PATH=/usr/local/lib/node_modules
NODE=/usr/local/bin/node

APP=windchime-stats-realtime
DIR=/home/ubuntu/www/windchime-stats

test -x $NODE || exit 0
test -x $DIR/log  || mkdir $DIR/log
test -x $DIR/pids || mkdir $DIR/pids

function start_app {
  NODE_ENV=production nohup "$NODE" "$DIR/lib/"$APP".js" 1>>"$DIR/log/$APP.log" 2>&1 &
  echo $! > "$DIR/pids/"$APP".pid"
}

function stop_app {
  kill `cat $DIR/pids/$APP.pid`
}

case $1 in
   start)
      start_app ;;
    stop)
      stop_app ;;
    restart)
      stop_app
      start_app
      ;;
    *)
      echo "usage: "$APP" {start|stop}" ;;
esac
exit 0