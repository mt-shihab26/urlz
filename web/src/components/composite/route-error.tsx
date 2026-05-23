export const RouteError = ({ error }: { error: Error }) => (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
        <p className="text-sm text-destructive">{error.message}</p>
    </div>
);
