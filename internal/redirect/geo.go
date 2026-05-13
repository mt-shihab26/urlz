package redirect

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

var geoClient = &http.Client{Timeout: 3 * time.Second}

type geoInfo struct {
	Country     string `json:"country"`
	CountryCode string `json:"countryCode"`
	City        string `json:"city"`
	Region      string `json:"regionName"`
	Timezone    string `json:"timezone"`
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
	var result geoInfo
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return geoInfo{}, err
	}
	return result, nil
}
