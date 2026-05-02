package seed

import (
	"fmt"
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/spf13/cobra"
)

const defaultLinks = 30

func RegisterCmd(app *pocketbase.PocketBase) {
	var (
		email    string
		password string
		count    int
	)

	cmd := &cobra.Command{
		Use:   "seed",
		Short: "Seed the database with fake data for development",
		RunE: func(cmd *cobra.Command, args []string) error {
			if err := app.Bootstrap(); err != nil {
				return fmt.Errorf("bootstrap: %w", err)
			}
			defer app.ResetBootstrapState()

			if err := run(app, email, password, count); err != nil {
				log.Fatal(err)
			}
			return nil
		},
	}
	cmd.Flags().StringVar(&email, "email", "dev@example.com", "user email")
	cmd.Flags().StringVar(&password, "password", "password1234", "user password")
	cmd.Flags().IntVar(&count, "links", defaultLinks, "number of links to create")

	app.RootCmd.AddCommand(cmd)
}
