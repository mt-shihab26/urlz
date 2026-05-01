import { createLink } from '@/collections/links';
import { useForm } from '@/hooks/use-form';
import { generateRandomSlug } from '@/lib/links';
import { toastError } from '@/lib/toast';

import { Form } from '@/components/composite/form';
import { SubmitButton } from '@/components/composite/submit-button';
import { TextField } from '@/components/composite/text-field';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const CreateLinkDialog = ({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) => {
    const { data, setData, loading, setLoading, reset } = useForm({
        url: '',
        slug: '',
        title: '',
        expiry: '',
    });

    const handleSubmit = async () => {
        if (!data.url || loading) return;
        setLoading(true);
        try {
            await createLink({
                url: data.url,
                title: data.title || data.url,
                code: data.slug || generateRandomSlug(),
                expires: data.expiry || undefined,
            });
            handleClose();
        } catch (e) {
            toastError(e instanceof Error ? e.message : 'Failed to create new link');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-120">
                <DialogHeader>
                    <DialogTitle>New Short Link</DialogTitle>
                </DialogHeader>
                <Form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
                    <TextField
                        id="url"
                        label="Destination URL"
                        value={data.url}
                        onChange={(e) => setData('url', e.target.value)}
                        placeholder="https://example.com/very/long/url"
                        required
                    />
                    <div className="flex flex-col gap-1.5">
                        <Label>Custom Slug</Label>
                        <div className="flex overflow-hidden rounded-md border">
                            <span className="flex items-center border-r bg-muted px-3 text-sm text-muted-foreground font-mono">
                                urlz.io/
                            </span>
                            <Input
                                value={data.slug}
                                onChange={(e) =>
                                    setData(
                                        'slug',
                                        e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                                    )
                                }
                                placeholder="my-link"
                                className="rounded-none border-0 shadow-none focus-visible:ring-0"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label>Label</Label>
                        <Input
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="e.g. Pricing Page Q2"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label>Expiry Date</Label>
                        <Input
                            type="date"
                            value={data.expiry}
                            onChange={(e) => setData('expiry', e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <SubmitButton
                            loading={loading}
                            disabled={!data.url || loading}
                            label="Create Link"
                        />
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
