package billing

import (
	"os"

	"github.com/stripe/stripe-go/v85"
)

func Init() {
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")
}
