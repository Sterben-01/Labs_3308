#!/bin/bash
# Authors : ZIQI ZHAO
# Date: 09/19/2020
SRC_DIR="/var/log/syslog"
DST_DIR="/home/ziqi/Documents/lab_4/"
cp -r "$SRC_DIR" "$DST_DIR"
egrep --color=always -Ei '(.*error.*)' syslog | tee errormsg.txt
echo "System Error log" | mutt -s "System Error log" -a errormsg.txt -- zizh6512@colorado.com

