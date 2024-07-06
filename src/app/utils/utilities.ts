const resUtility = {
    responseObj: (status: boolean, message: string, data: object = {}) => {
        return { status, message, data };
    }
};

export default resUtility;