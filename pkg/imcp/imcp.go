package imcp

import (
	"time"

	"github.com/go-ping/ping"
)

func Ping(ipAddr string) (stats *ping.Statistics, err error) {
	pinger, err := ping.NewPinger(ipAddr)
	if err != nil {
		return
	}

	pinger.Count = 1
	pinger.SetPrivileged(true)
	pinger.Timeout = 5 * time.Second
	err = pinger.Run()
	stats = pinger.Statistics()

	return
}
