#!/usr/bin/expect

set timeout 20
set user [lindex $argv 0]
set host [lindex $argv 1]
set pwd [lindex $argv 2]
set port [lindex $argv 3]

spawn ssh $user@$host -p $port
expect {
  "Are you sure you want to continue connecting" {
    send "yes\n"
    expect "password:"
    send "$pwd\n"
  }
  "password:" { send "$pwd\n" }
}
interact
