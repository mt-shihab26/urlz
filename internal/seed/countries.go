package seed

import (
	"math"
	"math/rand"
)

var sampleCountries = []struct{ name, code string }{
	{"United States", "US"}, {"United Kingdom", "GB"}, {"Germany", "DE"},
	{"France", "FR"}, {"Canada", "CA"}, {"Australia", "AU"},
	{"India", "IN"}, {"Brazil", "BR"}, {"Japan", "JP"}, {"Netherlands", "NL"},
}

func fakeCountries(total int) []map[string]any {
	if total == 0 {
		return nil
	}
	count := rand.Intn(6) + 2
	if count > len(sampleCountries) {
		count = len(sampleCountries)
	}
	perm := rand.Perm(len(sampleCountries))[:count]
	weights := randomWeights(count)
	countries := make([]map[string]any, count)
	for i, idx := range perm {
		c := sampleCountries[idx]
		clicks := int(math.Round(float64(total) * weights[i]))
		pct := math.Round(weights[i]*1000) / 10
		countries[i] = map[string]any{
			"country": c.name,
			"code":    c.code,
			"clicks":  clicks,
			"pct":     pct,
		}
	}
	return countries
}

func randomWeights(n int) []float64 {
	raw := make([]float64, n)
	sum := 0.0
	for i := range n {
		raw[i] = rand.Float64() + 0.1
		sum += raw[i]
	}
	for i := range n {
		raw[i] /= sum
	}
	return raw
}
