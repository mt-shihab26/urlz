import type { TLink } from '@/types/models';

import { createLink } from '@/collections/links';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckIcon } from 'lucide-react';

export const CreateLinkDialog = ({
    open,
    onOpenChange,
    onCreated,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated?: (link: TLink) => void;
}) => {
    const [url, setUrl] = useState('');
    const [slug, setSlug] = useState('');
    const [title, setTitle] = useState('');
    const [expiry, setExpiry] = useState('');
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [created, setCreated] = useState<TLink | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!url || loading) return;
        setLoading(true);
        try {
            const code = slug || Math.random().toString(36).slice(2, 7);
            const link = await createLink({
                url,
                title: title || url,
                code,
                expires: expiry || undefined,
            });
            setCreated(link);
            setStep('success');
            onCreated?.(link);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        setTimeout(() => {
            setStep('form');
            setUrl('');
            setSlug('');
            setTitle('');
            setExpiry('');
            setCreated(null);
        }, 200);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-120">
                <DialogHeader>
                    <DialogTitle>
                        {step === 'success' ? 'Link Created!' : 'New Short Link'}
                    </DialogTitle>
                </DialogHeader>

                {step === 'form' ? (
                    <div className="flex flex-col gap-4 pt-2">
                        <div className="flex flex-col gap-1.5">
                            <Label>
                                Destination URL <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com/very/long/url"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label>Custom Slug</Label>
                            <div className="flex overflow-hidden rounded-md border">
                                <span className="flex items-center border-r bg-muted px-3 text-sm text-muted-foreground font-mono">
                                    urlz.io/
                                </span>
                                <Input
                                    value={slug}
                                    onChange={(e) =>
                                        setSlug(
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
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Pricing Page Q2"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label>Expiry Date</Label>
                            <Input
                                type="date"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} disabled={!url || loading}>
                                {loading ? 'Creating…' : 'Create Link'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-5 py-4">
                        <div className="flex size-14 items-center justify-center rounded-full bg-green-500/10">
                            <CheckIcon className="size-7 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="text-center">
                            <div className="font-mono text-xl font-bold text-primary">
                                urlz.io/{created?.code}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Your link is live and ready to share.
                            </p>
                        </div>
                        <div className="flex w-full gap-2">
                            <Button variant="outline" className="flex-1" onClick={handleClose}>
                                Done
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={() => {
                                    setStep('form');
                                    setUrl('');
                                    setSlug('');
                                    setTitle('');
                                }}
                            >
                                Create Another
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
