import toast from 'react-hot-toast';

export const notifyToastSuccess = (message) => {
    toast.success(message, {
        position: 'bottom-center',
        duration: 5000,
    });
}

export const notifyToastError = (message) => {
    toast.error(message, {
        position: 'bottom-center',
        duration: 9000,
    });
}
