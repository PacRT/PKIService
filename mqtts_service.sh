#!/bin/bash          

#export NODE_ENV=production
# Uncomment following and edit config/development.jason to run in development mode
#export NODE_ENV=development
PACRT_HOME=`pwd`
export PACRT_HOME
app="node mqtts-server.js"
case "$1" in
	start)
		PID=`ps -ef | grep -F 'node mqtts-server.js' | grep -v -F 'grep' | awk '{ print $2 }'`
		if [[ ! -z "$PID" ]]; then 
                        echo "mqtts-server is already running with [PID=$PID]";
                        exit 0;
        else
		nohup $app &> ./error.log&
                PID=$!
                echo "mqtts-server started successfull with PID "$PID
        fi
	;;
	status)
                PID=`ps -ef | grep -F 'node mqtts-server.js' | grep -v -F 'grep' | awk '{ print $2 }'`
                if [[ ! -z "$PID" ]]; then
                        echo "mqtts-server is running on \"$NODE_ENV\" mode with [PID=$PID]";
                        exit 0;
        else
                echo "mqtts-server is not running"
        fi
        ;;
	stop)
		PID=`ps aux | grep -F 'node mqtts-server.js' | grep -v -F 'grep' | awk '{ print $2 }'`
		if [[ ! -z "$PID" ]]; then
			kill -2 $PID;
			echo "mqtts-server is running on \"$NODE_ENV\" mode has been stopped";
			exit 0;
	else
		echo "mqtts-server is not running"
	fi
	;;
	*)
		echo "Usage option : mqtts-service.sh [start|stop|status]"
	;;
esac

