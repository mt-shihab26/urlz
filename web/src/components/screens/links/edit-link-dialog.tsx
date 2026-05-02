import type { TLink } from '@/types/models';

import { updateLink } from '@/collections/links';
import { useForm } from '@/hooks/use-form';
import { toastError } from '@/lib/toast';

import { DateField } from '@/components/composite/date-field';
import { Form } from '@/components/composite/form';
import { SubmitButton } from '@/components/composite/submit-button';
import { TextField } from '@/components/composite/text-field';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { codePrefix } from '@/lib/utils';

export const EditLinkDialog = ({
    link,
    open,
    onOpenChange,
}: {
    link: TLink;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) => {
    const { data, setData, loading, setLoading, errors, setErrors } = useForm({
        url: link.url,
        code: link.code,
        title: link.title,
        expiry: link.expires ?? '',
    });

    const handleSubmit = async () => {
        if (!data.url || loading) return;
        setLoading(true);
        try {
            await updateLink(link.id, {
                url: data.url,
                title: data.title || data.url,
                code: data.code,
                expires: data.expiry || undefined,
            });
            onOpenChange(false);
        } catch (e: any) {
            const res = e?.response?.data;
            if (res?.url?.message) {
                setErrors('url', res.url.message);
            } else if (res?.code?.message) {
                setErrors('code', res.code.message);
            } else if (res?.title?.message) {
                setErrors('title', res.title.message);
            } else if (res?.expires?.message) {
                setErrors('expiry', res.expires.message);
            } else {
                toastError(e?.message ?? 'Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-120">
                <DialogHeader>
                    <DialogTitle>Edit Link</DialogTitle>
                </DialogHeader>
                <Form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
                    <TextField
                        id="url"
                        label="Destination URL"
                        value={data.url}
                        onChange={(e) => setData('url', e.target.value)}
                        placeholder="https://example.com/very/long/url"
                        error={errors.url}
                        required
                    />
                    <div className="flex flex-col gap-1.5">
                        <Label>Custom Slug</Label>
                        <div className="flex overflow-hidden rounded-md border">
                            <span className="flex items-center border-r bg-muted px-3 text-sm text-muted-foreground font-mono">
                                {codePrefix()}/
                            </span>
                            <TextField
                                id="slug"
                                value={data.code}
                                onChange={(e) =>
                                    setData(
                                        'code',
                                        e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                                    )
                                }
                                placeholder="my-link"
                                className="rounded-none border-0 shadow-none focus-visible:ring-0"
                                error={errors.code}
                            />
                        </div>
                    </div>
                    <TextField
                        id="label"
                        label="Label"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="e.g. Pricing Page Q2"
                        error={errors.title}
                    />
                    <DateField
                        id="expiry-date"
                        label="Expiry Date"
                        value={data.expiry}
                        onChange={(e) => setData('expiry', e.target.value)}
                        error={errors.expiry}
                    />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <SubmitButton
                            loading={loading}
                            disabled={!data.url || loading}
                            label="Save Changes"
                        />
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
