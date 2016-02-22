#!/bin/bash          

#export NODE_ENV=production
# Uncomment following and edit config/development.jason to run in development mode
export NODE_ENV=development
PACRT_HOME=`pwd`
export PACRT_HOME
cd ./js
app="node tls-service.js"
case "$1" in
	start)
		PID=`ps -ef | grep -F 'node tls-service.js' | grep -v -F 'grep' | awk '{ print $2 }'`
		if [[ ! -z "$PID" ]]; then 
                        echo "tls-service is already running with [PID=$PID]";
                        exit 0;
        else
		nohup $app &> ./error.log&
                PID=$!
                echo "tls-service started successfull with PID "$PID
        fi
	;;
	status)
                PID=`ps -ef | grep -F 'node tls-service.js' | grep -v -F 'grep' | awk '{ print $2 }'`
                if [[ ! -z "$PID" ]]; then
                        echo "tls-service is running on \"$NODE_ENV\" mode with [PID=$PID]";
                        exit 0;
        else
                echo "tls-service is not running"
        fi
        ;;
	stop)
		PID=`ps aux | grep -F 'node tls-service.js' | grep -v -F 'grep' | awk '{ print $2 }'`
		if [[ ! -z "$PID" ]]; then
			kill -2 $PID;
			echo "tls-service is running on \"$NODE_ENV\" mode has been stopped";
			exit 0;
	else
		echo "tls-service is not running"
	fi
	;;
	*)
		echo "Usage option : tls-service.sh [start|stop|status]"
	;;
esac

