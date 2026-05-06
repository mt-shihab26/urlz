package overview

type breakdownItem struct {
	Label string `json:"label"`
	Count int    `json:"count"`
}

type clickDay struct {
	Date   string `json:"date"`
	Clicks int    `json:"clicks"`
}

type topLink struct {
	ID          string     `json:"id"`
	Code        string     `json:"code"`
	URL         string     `json:"url"`
	Title       string     `json:"title"`
	Status      string     `json:"status"`
	Created     string     `json:"created"`
	Updated     string     `json:"updated"`
	Expires     string     `json:"expires"`
	TotalClicks int        `json:"totalClicks"`
	Sparkline   []clickDay `json:"sparkline"`
}

type breakdownData struct {
	Countries []breakdownItem `json:"countries"`
	Devices   []breakdownItem `json:"devices"`
	Referrers []breakdownItem `json:"referrers"`
	Browsers  []breakdownItem `json:"browsers"`
	OS        []breakdownItem `json:"os"`
	Languages []breakdownItem `json:"languages"`
}
