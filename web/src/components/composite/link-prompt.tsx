import { Link } from 'react-router';

export const LinkPrompt = ({
    text,
    linkText,
    linkTo,
}: {
    text: string;
    linkText: string;
    linkTo: string;
}) => {
    return (
        <div className="justify-center text-sm text-muted-foreground">
            {text}&nbsp;
            <Link to={linkTo} className="font-medium text-foreground hover:underline">
                {linkText}
            </Link>
        </div>
    );
};
