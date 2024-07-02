import { toastSuccess } from './toast-success';

export const toastSuccessReloadTable = (message, tables, serverSide) => {
    // Show toast
    toastSuccess(message);

    console.log(tables);
    //TODO - Add in paging retain
    // Reload tables
    if (serverSide) {
        tables.draw();
    } else {
        tables.ajax.reload();
    }

    // tables.ajax.reload();
};
