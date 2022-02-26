package wol

import (
	"net"

	"github.com/sabhiram/go-wol/wol"
)

func SendMagicPacket(macAddr, bcastAddr string) (err error) {
	packet, err := wol.New(macAddr)
	if err != nil {
		return
	}
	payload, err := packet.Marshal()
	if err != nil {
		return
	}

	if bcastAddr == "" {
		bcastAddr = "255.255.255.255:9"
	}
	bcAddr, err := net.ResolveUDPAddr("udp", bcastAddr)
	if err != nil {
		return
	}

	conn, err := net.DialUDP("udp", nil, bcAddr)
	if err != nil {
		return
	}
	defer conn.Close()

	_, err = conn.Write(payload)
	return
}
