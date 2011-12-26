#!/bin/bash

PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
NODE_PATH=/usr/local/lib/node_modules
NODE=/usr/local/bin/node

APP=windchime-stats-realtime
BASE_DIR=/home/ubuntu/www/windchime-stats
CURRENT_DIR=$BASE_DIR/current
PID_DIR=$BASE_DIR/shared/pids

test -x $NODE || exit 0

function start_app {
  NODE_ENV=production nohup "$NODE" "$CURRENT_DIR/lib/"$APP".js" "$CURRENT_DIR/config/config.json" 1>>"$CURRENT_DIR/log/$APP.log" 2>&1 &
  echo $! > "$PID_DIR/"$APP".pid"
}

function stop_app {
  kill `cat $PID_DIR/$APP.pid`
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