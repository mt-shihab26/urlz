import { toast } from 'sonner';

export const toastError = (e: any) => {
    try {
        toast.error(e instanceof Error ? e.message : String(e));
    } catch (e: any) {
        console.error('toast:', e);
    }
};

export const toastSuccess = (message: string) => {
    toast.success(message);
};
