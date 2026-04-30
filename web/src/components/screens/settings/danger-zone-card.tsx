import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DangerZoneCard = () => (
    <Card className="border-destructive/40">
        <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-muted-foreground">
                        Permanently remove all links, data, and your account.
                    </p>
                </div>
                <Button variant="destructive" size="sm">
                    Delete Account
                </Button>
            </div>
        </CardContent>
    </Card>
);
