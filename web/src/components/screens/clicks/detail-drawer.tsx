import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';

import type { TClick, TLink } from '@/types/models';

import { formatDate } from '@/lib/formats';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';

const Field = ({ label, value }: { label: string; value: string }) => {
    if (!value?.trim()) return null;

    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
            <span className="text-sm break-all">{value}</span>
        </div>
    );
};

export const DetailDrawer = ({
    click,
    link,
    open,
    onClose,
}: {
    click: TClick | null;
    link: TLink | undefined;
    open: boolean;
    onClose: () => void;
}) => {
    return (
        <Drawer direction="right" open={open} onClose={onClose}>
            <DrawerContent className="!w-[40%] sm:!max-w-[40%] overflow-y-auto overflow-x-hidden">
                <DrawerHeader className="flex-row items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <DrawerTitle>Click Details</DrawerTitle>
                        {click && <DrawerDescription>{formatDate(click.date)}</DrawerDescription>}
                    </div>
                    <DrawerClose asChild>
                        <Button variant="ghost" size="icon" className="shrink-0">
                            <X className="h-4 w-4" />
                        </Button>
                    </DrawerClose>
                </DrawerHeader>

                {click && (
                    <div className="flex flex-col gap-4 px-4 pb-6">
                        {link && (
                            <>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                        Link
                                    </span>
                                    <span className="text-sm font-medium">{link.title}</span>
                                    <span className="text-xs font-mono text-primary">
                                        {link.code}
                                    </span>
                                    <span className="text-xs text-muted-foreground break-all">
                                        {link.url}
                                    </span>
                                </div>
                                <Separator />
                            </>
                        )}

                        <div className="flex flex-col gap-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Location
                            </span>
                            <Field label="Country" value={click.country_name} />
                            <Field label="Country Code" value={click.country_code} />
                            <Field label="City" value={click.city} />
                            <Field label="Region" value={click.region} />
                            <Field label="Timezone" value={click.timezone} />
                        </div>

                        <Separator />

                        <div className="flex flex-col gap-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Device
                            </span>
                            <Field label="Device" value={click.device} />
                            <Field label="Browser" value={click.browser} />
                            <Field label="OS" value={click.os} />
                            <Field label="Language" value={click.language} />
                        </div>

                        <Separator />

                        <div className="flex flex-col gap-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Request
                            </span>
                            <Field label="Referrer" value={click.referrer} />
                            <Field label="IP" value={click.ip} />
                            <Field label="User Agent" value={click.user_agent} />
                        </div>
                    </div>
                )}
            </DrawerContent>
        </Drawer>
    );
};
