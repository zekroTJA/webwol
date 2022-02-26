package models

import (
	"encoding/json"
	"errors"
	"net"
	"regexp"
)

var (
	reMacAddress = regexp.MustCompile(`^(?:[0-9a-fA-F]{2}[:-]){5}(?:[0-9a-fA-F]{2})$`)
)

type DeviceType int

const (
	DeviceTypeUnspecified DeviceType = iota
	DeviceTypePC
	DeviceTypeServer
	DeviceTypeIOT
	DeviceTypeMobile

	maxType
)

type Device struct {
	UID        string     `json:"uid"`
	Name       string     `json:"name"`
	Type       DeviceType `json:"type"`
	MacAddress string     `json:"mac_address"`
	IPAddress  string     `json:"ip_address,omitempty"`
}

func UnmarshalDevice(v []byte) (dev Device, err error) {
	err = json.Unmarshal(v, &dev)
	return
}

func (dev Device) Marshal() (v []byte, err error) {
	return json.Marshal(dev)
}

func (dev Device) Validate() (err error) {
	if dev.Name == "" {
		return errors.New("invalid name")
	}
	if dev.MacAddress == "" || !reMacAddress.MatchString(dev.MacAddress) {
		return errors.New("invalid mac address")
	}
	if dev.Type < DeviceTypeUnspecified || dev.Type >= maxType {
		return errors.New("invalid device type")
	}
	if dev.IPAddress != "" && net.ParseIP(dev.IPAddress) == nil {
		return errors.New("invalid ip address")
	}
	return
}
