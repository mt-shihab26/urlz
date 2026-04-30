export const Form = ({
    onSubmit,
    children,
}: {
    onSubmit: () => void;
    children: React.ReactNode;
}) => {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="flex flex-col gap-4"
        >
            {children}
        </form>
    );
};
