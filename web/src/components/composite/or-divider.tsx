import { Separator } from '#/components/ui/separator';

export const OrDivider = () => {
    return (
        <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
        </div>
    );
};
