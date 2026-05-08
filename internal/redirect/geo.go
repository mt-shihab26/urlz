package redirect

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

var geoClient = &http.Client{Timeout: 3 * time.Second}

type geoInfo struct {
	Country     string
	CountryCode string
	City        string
	Region      string
	Timezone    string
}

func lookupGeo(ip string) (geoInfo, error) {
	if ip == "" || isPrivateIP(ip) {
		return geoInfo{}, nil
	}
	resp, err := geoClient.Get("http://ip-api.com/json/" + ip + "?fields=country,countryCode,city,regionName,timezone")
	if err != nil {
		return geoInfo{}, err
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != http.StatusOK {
		return geoInfo{}, fmt.Errorf("ip-api.com returned status %d", resp.StatusCode)
	}
	var result struct {
		Country     string `json:"country"`
		CountryCode string `json:"countryCode"`
		City        string `json:"city"`
		RegionName  string `json:"regionName"`
		Timezone    string `json:"timezone"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return geoInfo{}, err
	}
	return geoInfo{
		Country:     result.Country,
		CountryCode: result.CountryCode,
		City:        result.City,
		Region:      result.RegionName,
		Timezone:    result.Timezone,
	}, nil
}
